const socket = io();

// QR kod - butona basınca büyük göster
const gameUrl = window.location.origin;
const qrImg = document.getElementById('qr-img');
qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(gameUrl)}`;
document.getElementById('game-url').textContent = gameUrl;

const qrModal = document.getElementById('qr-modal');
const qrBtn = document.getElementById('qr-btn');
const qrClose = document.getElementById('qr-close');

qrBtn.addEventListener('click', () => qrModal.classList.add('open'));
qrClose.addEventListener('click', () => qrModal.classList.remove('open'));
qrModal.addEventListener('click', (e) => { if (e.target === qrModal) qrModal.classList.remove('open'); });

const questionNumEl = document.getElementById('tahta-question-num');
const questionTextEl = document.getElementById('tahta-question-text');
const participantCountEl = document.getElementById('participant-count');
const participantListEl = document.getElementById('participant-list');
const startBtn = document.getElementById('start-btn');
const endBtn = document.getElementById('end-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const resetBtn = document.getElementById('reset-btn');
const statsTableBody = document.getElementById('stats-table-body');

let scoreChart = null;
let wrongChart = null;

// Tahta olarak katıl
socket.emit('join-board');

socket.on('participants-update', (data) => {
  participantCountEl.textContent = data.count;
  participantListEl.innerHTML = (data.teams || []).map(t => `<li>${t}</li>`).join('');
});

socket.on('scores-update', (data) => {
  const correct = data.correct || data;
  const wrong = data.wrong || {};
  updateChart(scoreChart, 'score-chart', correct, 'rgba(46, 213, 115, 0.7)', '#2ed573');
  updateChart(wrongChart, 'wrong-chart', wrong, 'rgba(255, 107, 129, 0.7)', '#ff6b81');
});

socket.on('stats-update', (stats) => {
  statsTableBody.innerHTML = '';
  stats.forEach((s, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>Soru ${i + 1}</td>
      <td class="stat-correct">${s.correct || 0}</td>
      <td class="stat-wrong">${s.wrong || 0}</td>
    `;
    statsTableBody.appendChild(tr);
  });
});

socket.on('question-change', (data) => {
  const { index, question, total } = data;
  questionNumEl.textContent = `Soru ${(index || 0) + 1}/${total || 17}`;
  questionTextEl.textContent = question?.text || '—';
});

function updateChart(chart, canvasId, scores, bgColor, borderColor) {
  const labels = Object.keys(scores);
  const data = Object.values(scores);

  if (!chart) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '',
          data: data,
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.raw}`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { color: '#8b9cad', stepSize: 1 },
            grid: { color: 'rgba(255,255,255,0.06)' }
          },
          y: {
            ticks: { color: '#f5f6fa' },
            grid: { display: false }
          }
        }
      }
    });
    if (canvasId === 'score-chart') scoreChart = chart;
    else wrongChart = chart;
  } else {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
  }
}

startBtn.addEventListener('click', () => socket.emit('start-game'));
endBtn.addEventListener('click', () => {
  if (confirm('Oyunu bitirmek istediğinize emin misiniz? Tüm oyunculara teşekkür mesajı gösterilecek.')) {
    socket.emit('end-game');
  }
});
prevBtn.addEventListener('click', () => socket.emit('prev-question'));
nextBtn.addEventListener('click', () => socket.emit('next-question'));
resetBtn.addEventListener('click', () => {
  if (confirm('Oyunu sıfırlamak istediğinize emin misiniz? Tüm skorlar silinecek.')) {
    socket.emit('reset-game');
  }
});
