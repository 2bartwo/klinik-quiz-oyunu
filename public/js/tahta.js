const socket = io();

// QR kod - oyuncu giriş URL'si
const gameUrl = window.location.origin;
document.getElementById('qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(gameUrl)}`;
document.getElementById('game-url').textContent = gameUrl;

const questionNumEl = document.getElementById('tahta-question-num');
const questionTextEl = document.getElementById('tahta-question-text');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const resetBtn = document.getElementById('reset-btn');

let chart = null;

// Tahta olarak katıl
socket.emit('join-board');

socket.on('scores-update', (scores) => {
  updateChart(scores);
});

socket.on('question-change', (data) => {
  const { index, question, total } = data;
  questionNumEl.textContent = `Soru ${(index || 0) + 1}/${total || 17}`;
  questionTextEl.textContent = question?.text || '—';
});

function updateChart(scores) {
  const labels = Object.keys(scores);
  const data = Object.values(scores);

  if (!chart) {
    const ctx = document.getElementById('score-chart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Puan',
          data: data,
          backgroundColor: 'rgba(0, 212, 170, 0.7)',
          borderColor: '#00d4aa',
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
              label: (ctx) => ` ${ctx.raw} puan`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { color: '#8888a0', stepSize: 1 },
            grid: { color: 'rgba(255,255,255,0.06)' }
          },
          y: {
            ticks: { color: '#f0f0f5' },
            grid: { display: false }
          }
        }
      }
    });
  } else {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
  }
}

prevBtn.addEventListener('click', () => socket.emit('prev-question'));
nextBtn.addEventListener('click', () => socket.emit('next-question'));
resetBtn.addEventListener('click', () => {
  if (confirm('Oyunu sıfırlamak istediğinize emin misiniz? Tüm skorlar silinecek.')) {
    socket.emit('reset-game');
  }
});
