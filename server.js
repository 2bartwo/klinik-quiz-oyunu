const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const questions = require('./data/questions.json');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Takım skorları: { "Takım 1": 5, "Takım 2": 3, ... }
const teamScores = {};
// Yanlış sayıları: { "Takım 1": 2, ... }
const teamWrongScores = {};
// Her soru için hangi takımlar cevap verdi (tekrar cevap vermesin)
const answeredByTeam = {};
// Soru bazlı istatistik: [{ correct: 3, wrong: 2 }, ...]
const questionStats = questions.map(() => ({ correct: 0, wrong: 0 }));
// Mevcut soru indeksi (0-16)
let currentQuestionIndex = 0;
// Oyun durumu
let gameStarted = false;
let gameEnded = false;

// Ana sayfa - oyuncu girişi
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Tahta/grafik sayfası
app.get('/tahta', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tahta.html'));
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
  // Tahta bağlandığında mevcut skorları ve soruyu gönder
  socket.on('join-board', () => {
    socket.join('board');
    socket.emit('scores-update', { correct: teamScores, wrong: teamWrongScores });
    socket.emit('stats-update', questionStats);
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
    socket.join('players');
    socket.emit('joined', {
      teamName: name,
      scores: teamScores,
      currentQuestion: {
        index: currentQuestionIndex,
        question: questions[currentQuestionIndex],
        total: questions.length
      },
      gameStarted,
      gameEnded
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
    } else {
      teamWrongScores[team] = (teamWrongScores[team] || 0) + 1;
      questionStats[questionIndex].wrong++;
    }

    io.to('board').emit('scores-update', { correct: teamScores, wrong: teamWrongScores });
    io.to('board').emit('stats-update', questionStats);

    socket.emit('result', {
      correct,
      message: correct ? 'Doğru!' : 'Yanlış. Doğru cevap: ' + (question?.options?.[question.correct] || question?.correct)
    });
  });

  // Öğretmen: Sonraki soru
  socket.on('next-question', () => {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
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
    }
  });

  // Öğretmen: Önceki soru
  socket.on('prev-question', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
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
    questionStats.forEach(s => { s.correct = 0; s.wrong = 0; });
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
    emitGameState();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n  Klinik Quiz Oyunu çalışıyor!\n`);
  console.log(`  Oyuncu girişi: http://localhost:${PORT}`);
  console.log(`  Tahta/grafik:  http://localhost:${PORT}/tahta`);
  console.log(`\n  QR kodu oluşturmak için: https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http://YOUR_IP:${PORT}\n`);
});
