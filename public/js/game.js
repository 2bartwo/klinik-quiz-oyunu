const socket = io();

const teamScreen = document.getElementById('team-screen');
const waitingScreen = document.getElementById('waiting-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const teamForm = document.getElementById('team-form');
const teamInput = document.getElementById('team-input');
const teamBadge = document.getElementById('team-badge');
const waitingTeamBadge = document.getElementById('waiting-team-badge');
const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('question-text');
const optionsEl = document.getElementById('options');
const resultMessage = document.getElementById('result-message');

let teamName = null;
let currentQuestion = null;
let currentIndex = 0;

function showScreen(screen) {
  [teamScreen, waitingScreen, gameScreen, endScreen].forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
}

// Takım girişi
teamForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = teamInput.value.trim();
  if (!name) return;
  teamName = name;
  socket.emit('join-team', name);
});

socket.on('joined', (data) => {
  teamBadge.textContent = data.teamName;
  waitingTeamBadge.textContent = data.teamName + ' olarak katıldınız.';
  teamScreen.classList.remove('active');
  if (data.questionAnswered) {
    const el = document.getElementById('question-answered-info');
    if (el) el.textContent = `${data.questionAnswered.answered}/${data.questionAnswered.total} katılımcı soruyu çözdü`;
  }

  if (data.gameEnded) {
    showScreen(endScreen);
  } else if (data.gameStarted) {
    showScreen(gameScreen);
    const q = data.currentQuestion || { index: 0, question: null, total: 17 };
    loadQuestion(q);
  } else {
    showScreen(waitingScreen);
  }
});

socket.on('game-state', (data) => {
  if (data.gameEnded) {
    showScreen(endScreen);
  } else if (data.gameStarted) {
    showScreen(gameScreen);
    fetch('/api/current-question')
      .then(r => r.json())
      .then(loadQuestion)
      .catch(() => {});
  } else {
    showScreen(waitingScreen);
  }
});

// Soru değişimi (sunucudan)
socket.on('question-change', (data) => {
  currentIndex = data.index;
  currentQuestion = data.question;
  loadQuestion(data);
});

function loadQuestion(data) {
  const { index, question, total } = data;
  currentIndex = index;
  currentQuestion = question;

  questionCounter.textContent = `Soru ${(index || 0) + 1}/${total || 17}`;

  if (!question) {
    questionText.textContent = 'Sorular yükleniyor...';
    optionsEl.innerHTML = '';
    return;
  }

  questionText.textContent = question.text;
  resultMessage.classList.remove('show', 'correct', 'wrong');

  optionsEl.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  for (const letter of letters) {
    const opt = question.options[letter];
    if (!opt) continue;
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.type = 'button';
    btn.innerHTML = `<span class="option-letter">${letter}</span><span>${opt}</span>`;
    btn.dataset.letter = letter;
    btn.addEventListener('click', () => selectOption(btn));
    optionsEl.appendChild(btn);
  }
}

function selectOption(btn) {
  if (btn.disabled) return;
  const letter = btn.dataset.letter;

  optionsEl.querySelectorAll('.option').forEach(o => {
    o.classList.remove('selected');
    o.disabled = true;
  });
  btn.classList.add('selected');

  socket.emit('submit-answer', {
    answer: letter,
    questionIndex: currentIndex
  });
}

socket.on('result', (data) => {
  const options = optionsEl.querySelectorAll('.option');
  options.forEach(o => {
    if (data.correctLetter && o.dataset.letter === data.correctLetter) o.classList.add('correct');
    else if (o.classList.contains('selected') && !data.correct) o.classList.add('wrong');
  });

  resultMessage.textContent = data.message;
  resultMessage.className = 'result-message show ' + (data.correct ? 'correct' : 'wrong');
});

/** Tahta katılımcı/soru sıfırlayınca şıklar tekrar seçilebilir olsun */
function reopenQuestionAfterRevoke() {
  resultMessage.textContent = '';
  resultMessage.classList.remove('show', 'correct', 'wrong');
  optionsEl.querySelectorAll('.option').forEach((o) => {
    o.disabled = false;
    o.classList.remove('selected', 'correct', 'wrong');
  });
}

socket.on('answer-revoked', (data) => {
  if (!data || data.questionIndex !== currentIndex) return;
  if (!gameScreen.classList.contains('active')) return;
  reopenQuestionAfterRevoke();
});

socket.on('question-answered', (data) => {
  const el = document.getElementById('question-answered-info');
  if (el) el.textContent = `${data.answered || 0}/${data.total || 0} katılımcı soruyu çözdü`;
});

socket.on('participants-update', (data) => {
  const txt = data.count + ' katılımcı';
  ['game-participant-count', 'waiting-participant-count'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  });
});

socket.on('error', (msg) => {
  alert(msg);
});
