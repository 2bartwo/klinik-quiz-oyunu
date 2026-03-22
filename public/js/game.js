const socket = io();

const teamScreen = document.getElementById('team-screen');
const gameScreen = document.getElementById('game-screen');
const teamForm = document.getElementById('team-form');
const teamInput = document.getElementById('team-input');
const teamBadge = document.getElementById('team-badge');
const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('question-text');
const optionsEl = document.getElementById('options');
const resultMessage = document.getElementById('result-message');

let teamName = null;
let currentQuestion = null;
let currentIndex = 0;

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
  teamScreen.classList.remove('active');
  gameScreen.classList.add('active');
  const q = data.currentQuestion || { index: 0, question: null, total: 17 };
  loadQuestion(q);
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

  // Diğer seçimleri kaldır
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
    if (o.dataset.letter === currentQuestion?.correct) o.classList.add('correct');
    else if (o.classList.contains('selected') && !data.correct) o.classList.add('wrong');
  });

  resultMessage.textContent = data.message;
  resultMessage.className = 'result-message show ' + (data.correct ? 'correct' : 'wrong');
});

socket.on('error', (msg) => {
  alert(msg);
});

// Sayfa yüklendiğinde mevcut soruyu al
fetch('/api/current-question')
  .then(r => r.json())
  .then(data => {
    if (teamName) {
      loadQuestion(data);
    }
  })
  .catch(() => {});
