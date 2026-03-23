const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cookieParser = require('cookie-parser');
const questions = require('./data/questions.json');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const TAHTA_USER = process.env.TAHTA_USER || 'bartwo';
const TAHTA_PASS = process.env.TAHTA_PASS || 'bartwo143';
const TAHTA_SECRET = process.env.TAHTA_SECRET || 'tahta-secret-' + Date.now();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

// Bağlı oyuncular: { socketId: teamName }
const connectedPlayers = {};

// Takım skorları: { "Takım 1": 5, "Takım 2": 3, ... }
const teamScores = {};
// Yanlış sayıları: { "Takım 1": 2, ... }
const teamWrongScores = {};
// Her soru için hangi takımlar cevap verdi (tekrar cevap vermesin)
const answeredByTeam = {};
// Soru bazlı istatistik
const questionStats = questions.map(() => ({
  correct: 0, wrong: 0,
  correctTeams: [], wrongTeams: [],
  totalAtQuestion: 0,
  teamsAtQuestion: []
}));
// Mevcut soru indeksi (0-16)
let currentQuestionIndex = 0;
// Oyun durumu
let gameStarted = false;
let gameEnded = false;

// Ana sayfa - oyuncu girişi
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Tahta çıkış
app.get('/api/tahta-logout', (req, res) => {
  res.clearCookie('tahta_auth');
  res.redirect('/tahta');
});

// Tahta girişi
app.post('/api/tahta-login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === TAHTA_USER && password === TAHTA_PASS) {
    res.cookie('tahta_auth', TAHTA_SECRET, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'lax' });
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' });
  }
});

// Tahta/grafik sayfası (giriş gerekli)
app.get('/tahta', (req, res) => {
  if (req.cookies?.tahta_auth === TAHTA_SECRET) {
    res.sendFile(path.join(__dirname, 'public', 'tahta.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'tahta-login.html'));
  }
});

// Sorular API
app.get('/api/questions', (req, res) => {
  res.json(questions);
});

// Mevcut soru
app.get('/api/current-question', (req, res) => {
  res.json({
    index: currentQuestionIndex,
    question: questions[currentQuestionIndex],
    total: questions.length
  });
});

// Oyun durumu
app.get('/api/game-state', (req, res) => {
  res.json({ gameStarted, gameEnded });
});

function emitGameState() {
  io.to('board').emit('game-state', { gameStarted, gameEnded });
  io.to('players').emit('game-state', { gameStarted, gameEnded });
}

// Socket.io - gerçek zamanlı iletişim
io.on('connection', (socket) => {
  function emitParticipants() {
    const teams = Object.values(connectedPlayers);
    const data = { count: teams.length, teams };
    const answeredCurrent = questionStats[currentQuestionIndex].correct + questionStats[currentQuestionIndex].wrong;
    io.to('board').emit('participants-update', data);
    io.to('players').emit('participants-update', data);
    io.to('board').emit('question-answered', { answered: answeredCurrent, total: teams.length });
    io.to('players').emit('question-answered', { answered: answeredCurrent, total: teams.length });
  }

  // Tahta bağlandığında mevcut skorları ve soruyu gönder
  socket.on('join-board', () => {
    socket.join('board');
    const totalPlayers = Object.keys(connectedPlayers).length;
    const answeredCurrent = questionStats[currentQuestionIndex].correct + questionStats[currentQuestionIndex].wrong;
    socket.emit('scores-update', { correct: teamScores, wrong: teamWrongScores });
    socket.emit('stats-update', questionStats);
    socket.emit('participants-update', { count: totalPlayers, teams: Object.values(connectedPlayers) });
    socket.emit('question-answered', { answered: answeredCurrent, total: totalPlayers });
    socket.emit('question-change', {
      index: currentQuestionIndex,
      question: questions[currentQuestionIndex],
      total: questions.length
    });
    socket.emit('game-state', { gameStarted, gameEnded });
  });

  // Oyuncu takım adıyla katıldı
  socket.on('join-team', (teamName) => {
    if (!teamName || typeof teamName !== 'string') return;
    const name = teamName.trim().slice(0, 50);
    if (!name) return;
    if (!teamScores[name]) {
      teamScores[name] = 0;
      teamWrongScores[name] = 0;
    }
    socket.teamName = name;
    connectedPlayers[socket.id] = name;
    socket.join('players');
    emitParticipants();
    const totalPlayers = Object.keys(connectedPlayers).length;
    const answeredCurrent = questionStats[currentQuestionIndex].correct + questionStats[currentQuestionIndex].wrong;
    socket.emit('joined', {
      teamName: name,
      scores: teamScores,
      currentQuestion: {
        index: currentQuestionIndex,
        question: questions[currentQuestionIndex],
        total: questions.length
      },
      gameStarted,
      gameEnded,
      questionAnswered: { answered: answeredCurrent, total: totalPlayers }
    });
  });

  // Cevap gönder
  socket.on('submit-answer', (data) => {
    if (!gameStarted || gameEnded) return socket.emit('error', 'Oyun henüz başlamadı veya bitti.');
    const { answer, questionIndex } = data;
    const team = socket.teamName;
    if (!team) return socket.emit('error', 'Önce takım adınızı girin.');

    if (questionIndex !== currentQuestionIndex) {
      return socket.emit('result', { correct: false, message: 'Bu soru artık geçerli değil.' });
    }

    const key = `${team}-${questionIndex}`;
    if (answeredByTeam[key]) {
      return socket.emit('result', { correct: false, message: 'Bu soruyu zaten cevapladınız.' });
    }

    const question = questions[questionIndex];
    const correct = question && answer === question.correct;

    answeredByTeam[key] = true;
    if (correct) {
      teamScores[team] = (teamScores[team] || 0) + 1;
      questionStats[questionIndex].correct++;
      questionStats[questionIndex].correctTeams.push(team);
    } else {
      teamWrongScores[team] = (teamWrongScores[team] || 0) + 1;
      questionStats[questionIndex].wrong++;
      questionStats[questionIndex].wrongTeams.push(team);
    }

    const totalPlayers = Object.keys(connectedPlayers).length;
    const answeredCurrent = questionStats[currentQuestionIndex].correct + questionStats[currentQuestionIndex].wrong;

    io.to('board').emit('scores-update', { correct: teamScores, wrong: teamWrongScores });
    io.to('board').emit('stats-update', questionStats);
    io.to('board').emit('question-answered', { answered: answeredCurrent, total: totalPlayers });
    io.to('players').emit('question-answered', { answered: answeredCurrent, total: totalPlayers });

    socket.emit('result', {
      correct,
      message: correct ? 'Doğru!' : 'Yanlış. Doğru cevap: ' + (question?.options?.[question.correct] || question?.correct)
    });
  });

  // Öğretmen: Sonraki soru
  socket.on('next-question', () => {
    const qs = questionStats[currentQuestionIndex];
    qs.totalAtQuestion = Object.keys(teamScores).length;
    qs.teamsAtQuestion = Object.keys(teamScores);
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      const totalPlayers = Object.keys(connectedPlayers).length;
      const answeredCurrent = questionStats[currentQuestionIndex].correct + questionStats[currentQuestionIndex].wrong;
      io.to('board').emit('question-change', {
        index: currentQuestionIndex,
        question: questions[currentQuestionIndex],
        total: questions.length
      });
      io.to('players').emit('question-change', {
        index: currentQuestionIndex,
        question: questions[currentQuestionIndex],
        total: questions.length
      });
      io.to('board').emit('question-answered', { answered: answeredCurrent, total: totalPlayers });
      io.to('players').emit('question-answered', { answered: answeredCurrent, total: totalPlayers });
    }
  });

  // Öğretmen: Önceki soru
  socket.on('prev-question', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      const totalPlayers = Object.keys(connectedPlayers).length;
      const answeredCurrent = questionStats[currentQuestionIndex].correct + questionStats[currentQuestionIndex].wrong;
      io.to('board').emit('question-change', {
        index: currentQuestionIndex,
        question: questions[currentQuestionIndex],
        total: questions.length
      });
      io.to('players').emit('question-change', {
        index: currentQuestionIndex,
        question: questions[currentQuestionIndex],
        total: questions.length
      });
      io.to('board').emit('question-answered', { answered: answeredCurrent, total: totalPlayers });
      io.to('players').emit('question-answered', { answered: answeredCurrent, total: totalPlayers });
    }
  });

  // Öğretmen: Oyunu başlat
  socket.on('start-game', () => {
    gameStarted = true;
    gameEnded = false;
    emitGameState();
  });

  // Öğretmen: Oyunu bitir
  socket.on('end-game', () => {
    gameEnded = true;
    emitGameState();
  });

  // Öğretmen: Oyunu sıfırla
  socket.on('reset-game', () => {
    Object.keys(teamScores).forEach(k => delete teamScores[k]);
    Object.keys(teamWrongScores).forEach(k => delete teamWrongScores[k]);
    Object.keys(answeredByTeam).forEach(k => delete answeredByTeam[k]);
    questionStats.forEach(s => {
      s.correct = 0; s.wrong = 0;
      s.correctTeams = []; s.wrongTeams = [];
      s.totalAtQuestion = 0; s.teamsAtQuestion = [];
    });
    currentQuestionIndex = 0;
    gameStarted = false;
    gameEnded = false;
    io.to('board').emit('scores-update', { correct: {}, wrong: {} });
    io.to('board').emit('stats-update', questionStats);
    io.to('board').emit('question-change', {
      index: 0,
      question: questions[0],
      total: questions.length
    });
    io.to('players').emit('question-change', {
      index: 0,
      question: questions[0],
      total: questions.length
    });
    io.to('board').emit('question-answered', { answered: 0, total: 0 });
    io.to('players').emit('question-answered', { answered: 0, total: 0 });
    emitGameState();
  });

  socket.on('disconnect', () => {
    if (connectedPlayers[socket.id]) {
      delete connectedPlayers[socket.id];
      emitParticipants();
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n  Klinik Quiz Oyunu çalışıyor!\n`);
  console.log(`  Oyuncu girişi: http://localhost:${PORT}`);
  console.log(`  Tahta/grafik:  http://localhost:${PORT}/tahta`);
  console.log(`\n  QR kodu oluşturmak için: https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http://YOUR_IP:${PORT}\n`);
});
