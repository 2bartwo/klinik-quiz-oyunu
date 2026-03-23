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

const connectedPlayers = {};
const teamScores = {};
const teamWrongScores = {};
const answeredByTeam = {};
const questionStats = questions.map(() => ({
  correct: 0, wrong: 0,
  correctTeams: [], wrongTeams: [],
  totalAtQuestion: 0,
  teamsAtQuestion: []
}));

let currentQuestionIndex = 0;
let gameStarted = false;
let gameEnded = false;

/** Mevcut sorunun ekranda gösterilen (karıştırılmış) hali — doğrulama için */
let currentDisplay = null;

const activityLog = [];
const MAX_ACTIVITY = 200;

function logActivity(type, participantName) {
  activityLog.push({
    time: new Date().toISOString(),
    type,
    name: participantName,
    questionIndex: currentQuestionIndex,
    questionNum: currentQuestionIndex + 1
  });
  if (activityLog.length > MAX_ACTIVITY) activityLog.shift();
  io.to('board').emit('activity-log-update', activityLog.slice(-100));
}

/** Şıkları rastgele sıraya koy, doğru harfi yeniden hesapla */
function buildDisplayForIndex(idx) {
  const q = questions[idx];
  const letters = ['A', 'B', 'C', 'D'];
  const entries = letters.map((orig) => ({ orig, text: q.options[orig] })).filter((e) => e.text);
  for (let i = entries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [entries[i], entries[j]] = [entries[j], entries[i]];
  }
  const options = {};
  let correctLetter = null;
  entries.forEach((e, i) => {
    const L = letters[i];
    options[L] = e.text;
    if (e.orig === q.correct) correctLetter = L;
  });
  currentDisplay = { index: idx, text: q.text, options, correctLetter };
  return { text: q.text, options };
}

function getAnswerBreakdown() {
  const uniq = [...new Set(Object.values(connectedPlayers))];
  const answered = [];
  const notAnswered = [];
  uniq.forEach((name) => {
    if (answeredByTeam[`${name}-${currentQuestionIndex}`]) answered.push(name);
    else notAnswered.push(name);
  });
  return { answered, notAnswered };
}

function emitQuestionAnswered() {
  const teams = Object.values(connectedPlayers);
  const uniq = [...new Set(teams)];
  const answeredCount = questionStats[currentQuestionIndex].correct + questionStats[currentQuestionIndex].wrong;
  const breakdown = getAnswerBreakdown();
  const payload = {
    answered: answeredCount,
    total: uniq.length,
    answeredNames: breakdown.answered,
    notAnsweredNames: breakdown.notAnswered
  };
  io.to('board').emit('question-answered', payload);
  io.to('players').emit('question-answered', payload);
}

function broadcastCurrentQuestion() {
  buildDisplayForIndex(currentQuestionIndex);
  const question = { text: currentDisplay.text, options: currentDisplay.options };
  io.to('board').emit('question-change', {
    index: currentQuestionIndex,
    question,
    total: questions.length
  });
  io.to('players').emit('question-change', {
    index: currentQuestionIndex,
    question,
    total: questions.length
  });
  emitQuestionAnswered();
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/tahta-logout', (req, res) => {
  res.clearCookie('tahta_auth');
  res.redirect('/tahta');
});

app.post('/api/tahta-login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === TAHTA_USER && password === TAHTA_PASS) {
    res.cookie('tahta_auth', TAHTA_SECRET, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'lax' });
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' });
  }
});

app.get('/tahta', (req, res) => {
  if (req.cookies?.tahta_auth === TAHTA_SECRET) {
    res.sendFile(path.join(__dirname, 'public', 'tahta.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'tahta-login.html'));
  }
});

app.get('/api/questions', (req, res) => {
  res.json(questions);
});

app.get('/api/current-question', (req, res) => {
  if (!currentDisplay || currentDisplay.index !== currentQuestionIndex) {
    buildDisplayForIndex(currentQuestionIndex);
  }
  res.json({
    index: currentQuestionIndex,
    question: { text: currentDisplay.text, options: currentDisplay.options },
    total: questions.length
  });
});

app.get('/api/game-state', (req, res) => {
  res.json({ gameStarted, gameEnded });
});

function emitGameState() {
  io.to('board').emit('game-state', { gameStarted, gameEnded });
  io.to('players').emit('game-state', { gameStarted, gameEnded });
}

function revokeAnswerForParticipant(participantName, questionIndex) {
  const key = `${participantName}-${questionIndex}`;
  const previous = answeredByTeam[key];
  if (!previous) return false;

  const stat = questionStats[questionIndex];
  if (previous === 'correct') {
    teamScores[participantName] = Math.max(0, (teamScores[participantName] || 0) - 1);
    stat.correct = Math.max(0, stat.correct - 1);
    const idx = stat.correctTeams.indexOf(participantName);
    if (idx >= 0) stat.correctTeams.splice(idx, 1);
  } else if (previous === 'wrong') {
    teamWrongScores[participantName] = Math.max(0, (teamWrongScores[participantName] || 0) - 1);
    stat.wrong = Math.max(0, stat.wrong - 1);
    const idx = stat.wrongTeams.indexOf(participantName);
    if (idx >= 0) stat.wrongTeams.splice(idx, 1);
  }

  delete answeredByTeam[key];
  return true;
}

/** Prompt’taki isim ile answeredByTeam anahtarındaki isim farklı olabildiği için (büyük/küçük harf) eşleştirir */
function findAnsweredParticipantName(input, questionIndex) {
  const t = String(input || '').trim().toLowerCase();
  if (!t) return null;
  const suffix = `-${questionIndex}`;
  for (const key of Object.keys(answeredByTeam)) {
    if (!key.endsWith(suffix)) continue;
    const name = key.slice(0, -suffix.length);
    if (name.trim().toLowerCase() === t) return name;
  }
  return null;
}

/** Katılımcı sıfırlandığında / soru sıfırlandığında oyuncu tarayıcısında şıkları yeniden açmak için */
function emitAnswerRevokedToSocketsForName(participantName) {
  const t = String(participantName || '').trim().toLowerCase();
  if (!t) return;
  const payload = { questionIndex: currentQuestionIndex };
  for (const [sid, pname] of Object.entries(connectedPlayers)) {
    if (String(pname).trim().toLowerCase() === t) {
      io.to(sid).emit('answer-revoked', payload);
    }
  }
}

io.on('connection', (socket) => {
  function emitParticipants() {
    const teams = Object.values(connectedPlayers);
    const uniq = [...new Set(teams)];
    const data = { count: uniq.length, teams: uniq };
    io.to('board').emit('participants-update', data);
    io.to('players').emit('participants-update', data);
    emitQuestionAnswered();
  }

  socket.on('join-board', () => {
    socket.join('board');
    const uniq = [...new Set(Object.values(connectedPlayers))];
    const totalPlayers = uniq.length;
    if (!currentDisplay || currentDisplay.index !== currentQuestionIndex) {
      buildDisplayForIndex(currentQuestionIndex);
    }
    const question = { text: currentDisplay.text, options: currentDisplay.options };
    socket.emit('scores-update', { correct: teamScores, wrong: teamWrongScores });
    socket.emit('stats-update', questionStats);
    socket.emit('participants-update', { count: totalPlayers, teams: uniq });
    socket.emit('activity-log-update', activityLog.slice(-100));
    socket.emit('question-change', {
      index: currentQuestionIndex,
      question,
      total: questions.length
    });
    emitQuestionAnswered();
    socket.emit('game-state', { gameStarted, gameEnded });
  });

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
    logActivity('join', name);
    emitParticipants();
    const totalPlayers = [...new Set(Object.values(connectedPlayers))].length;
    const answeredCurrent = questionStats[currentQuestionIndex].correct + questionStats[currentQuestionIndex].wrong;
    const breakdown = getAnswerBreakdown();
    if (!currentDisplay || currentDisplay.index !== currentQuestionIndex) {
      buildDisplayForIndex(currentQuestionIndex);
    }
    const question = { text: currentDisplay.text, options: currentDisplay.options };
    socket.emit('joined', {
      teamName: name,
      scores: teamScores,
      currentQuestion: {
        index: currentQuestionIndex,
        question,
        total: questions.length
      },
      gameStarted,
      gameEnded,
      questionAnswered: {
        answered: answeredCurrent,
        total: totalPlayers,
        answeredNames: breakdown.answered,
        notAnsweredNames: breakdown.notAnswered
      }
    });
  });

  socket.on('submit-answer', (data) => {
    if (!gameStarted || gameEnded) return socket.emit('error', 'Oyun henüz başlamadı veya bitti.');
    const { answer, questionIndex } = data;
    const team = socket.teamName;
    if (!team) return socket.emit('error', 'Önce takım adınızı girin.');

    if (questionIndex !== currentQuestionIndex) {
      return socket.emit('result', { correct: false, message: 'Bu soru artık geçerli değil.' });
    }

    if (!currentDisplay || currentDisplay.index !== currentQuestionIndex) {
      return socket.emit('error', 'Soru yüklenemedi.');
    }

    const key = `${team}-${questionIndex}`;
    if (answeredByTeam[key]) {
      return socket.emit('result', { correct: false, message: 'Bu soruyu zaten cevapladınız.' });
    }

    const correct = answer === currentDisplay.correctLetter;
    const correctText = currentDisplay.options[currentDisplay.correctLetter];

    answeredByTeam[key] = correct ? 'correct' : 'wrong';
    if (correct) {
      teamScores[team] = (teamScores[team] || 0) + 1;
      questionStats[questionIndex].correct++;
      questionStats[questionIndex].correctTeams.push(team);
    } else {
      teamWrongScores[team] = (teamWrongScores[team] || 0) + 1;
      questionStats[questionIndex].wrong++;
      questionStats[questionIndex].wrongTeams.push(team);
    }

    io.to('board').emit('scores-update', { correct: teamScores, wrong: teamWrongScores });
    io.to('board').emit('stats-update', questionStats);
    emitQuestionAnswered();

    socket.emit('result', {
      correct,
      correctLetter: currentDisplay.correctLetter,
      message: correct ? 'Doğru!' : 'Yanlış. Doğru cevap: ' + correctText
    });
  });

  socket.on('next-question', () => {
    const qs = questionStats[currentQuestionIndex];
    qs.totalAtQuestion = Object.keys(teamScores).length;
    qs.teamsAtQuestion = Object.keys(teamScores);
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      broadcastCurrentQuestion();
    }
  });

  socket.on('prev-question', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      broadcastCurrentQuestion();
    }
  });

  socket.on('start-game', () => {
    gameStarted = true;
    gameEnded = false;
    emitGameState();
  });

  socket.on('end-game', () => {
    gameEnded = true;
    emitGameState();
  });

  socket.on('reset-current-question', () => {
    const suffix = `-${currentQuestionIndex}`;
    Object.keys(answeredByTeam)
      .filter((key) => key.endsWith(suffix))
      .forEach((key) => {
        const name = key.slice(0, -suffix.length);
        revokeAnswerForParticipant(name, currentQuestionIndex);
      });
    io.to('board').emit('scores-update', { correct: teamScores, wrong: teamWrongScores });
    io.to('board').emit('stats-update', questionStats);
    emitQuestionAnswered();
    io.to('players').emit('answer-revoked', { questionIndex: currentQuestionIndex });
  });

  socket.on('reset-current-for-participant', (participantName) => {
    const canonical = findAnsweredParticipantName(participantName, currentQuestionIndex);
    if (!canonical) return;
    const changed = revokeAnswerForParticipant(canonical, currentQuestionIndex);
    if (!changed) return;
    io.to('board').emit('scores-update', { correct: teamScores, wrong: teamWrongScores });
    io.to('board').emit('stats-update', questionStats);
    emitQuestionAnswered();
    emitAnswerRevokedToSocketsForName(canonical);
  });

  socket.on('reset-game', () => {
    Object.keys(teamScores).forEach((k) => delete teamScores[k]);
    Object.keys(teamWrongScores).forEach((k) => delete teamWrongScores[k]);
    Object.keys(answeredByTeam).forEach((k) => delete answeredByTeam[k]);
    questionStats.forEach((s) => {
      s.correct = 0; s.wrong = 0;
      s.correctTeams = []; s.wrongTeams = [];
      s.totalAtQuestion = 0; s.teamsAtQuestion = [];
    });
    currentQuestionIndex = 0;
    gameStarted = false;
    gameEnded = false;
    activityLog.length = 0;
    currentDisplay = null;
    io.to('board').emit('scores-update', { correct: {}, wrong: {} });
    io.to('board').emit('stats-update', questionStats);
    io.to('board').emit('activity-log-update', []);
    broadcastCurrentQuestion();
    emitGameState();
  });

  socket.on('disconnect', () => {
    if (connectedPlayers[socket.id]) {
      const name = connectedPlayers[socket.id];
      delete connectedPlayers[socket.id];
      logActivity('leave', name);
      emitParticipants();
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n  Klinik Quiz Oyunu çalışıyor!\n`);
  console.log(`  Oyuncu girişi: http://localhost:${PORT}`);
  console.log(`  Tahta/grafik:  http://localhost:${PORT}/tahta\n`);
});
