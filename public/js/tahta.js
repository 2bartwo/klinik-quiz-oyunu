const socket = io();
let questionStatsData = [];
let lastAnswerBreakdown = { answeredNames: [], notAnsweredNames: [] };

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
const questionNumBoxEl = document.getElementById('tahta-question-num-box');
const questionTextEl = document.getElementById('tahta-question-text');
const answeredCountEl = document.getElementById('tahta-answered-count');
const answerBreakdownBtn = document.getElementById('answer-breakdown-btn');
const resetQuestionBtn = document.getElementById('reset-question-btn');
const resetParticipantBtn = document.getElementById('reset-participant-btn');
const activityBtn = document.getElementById('activity-btn');
const participantCountEl = document.getElementById('participant-count');
const participantListEl = document.getElementById('participant-list');
const startBtn = document.getElementById('start-btn');
const endBtn = document.getElementById('end-btn');
const resultBtn = document.getElementById('result-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const resetBtn = document.getElementById('reset-btn');
const statsTableBody = document.getElementById('stats-table-body');
const detailModal = document.getElementById('detail-modal');
const detailTitle = document.getElementById('detail-title');
const detailBody = document.getElementById('detail-body');
const resultModal = document.getElementById('result-modal');
const resultBody = document.getElementById('result-body');
const breakdownModal = document.getElementById('breakdown-modal');
const breakdownBody = document.getElementById('breakdown-body');
const activityModal = document.getElementById('activity-modal');
const activityBody = document.getElementById('activity-body');

let scoreChart = null;
let wrongChart = null;
let lastParticipantCount = 0;
let lastTeams = [];

function closeAllModals() {
  detailModal.classList.remove('open');
  resultModal.classList.remove('open');
  breakdownModal.classList.remove('open');
  activityModal.classList.remove('open');
}

document.querySelectorAll('.modal-close, .result-close').forEach(btn => {
  btn.addEventListener('click', closeAllModals);
});
detailModal.addEventListener('click', (e) => { if (e.target === detailModal) detailModal.classList.remove('open'); });
resultModal.addEventListener('click', (e) => { if (e.target === resultModal) resultModal.classList.remove('open'); });
breakdownModal.addEventListener('click', (e) => { if (e.target === breakdownModal) breakdownModal.classList.remove('open'); });
activityModal.addEventListener('click', (e) => { if (e.target === activityModal) activityModal.classList.remove('open'); });

socket.emit('join-board');

socket.on('participants-update', (data) => {
  lastParticipantCount = data.count || 0;
  lastTeams = data.teams || [];
  participantCountEl.textContent = data.count;
  participantListEl.innerHTML = (data.teams || []).map(t => `<li>${t}</li>`).join('');
});

socket.on('question-answered', (data) => {
  const { answered = 0, total = 0, answeredNames = [], notAnsweredNames = [] } = data;
  lastAnswerBreakdown = { answeredNames, notAnsweredNames };
  answeredCountEl.textContent = `${answered}/${total} katılımcı işaretledi`;
});

answerBreakdownBtn.addEventListener('click', () => {
  const { answeredNames, notAnsweredNames } = lastAnswerBreakdown;
  breakdownBody.innerHTML = `
    <div class="detail-section">
      <h4>İşaretleyen katılımcılar (${answeredNames.length})</h4>
      <ul>${answeredNames.length ? answeredNames.map(t => `<li class="stat-correct">${t}</li>`).join('') : '<li class="empty">Henüz yok</li>'}</ul>
    </div>
    <div class="detail-section">
      <h4>İşaretlemeyen katılımcılar (${notAnsweredNames.length})</h4>
      <ul>${notAnsweredNames.length ? notAnsweredNames.map(t => `<li class="stat-blank">${t}</li>`).join('') : '<li class="empty">Yok</li>'}</ul>
    </div>
  `;
  breakdownModal.classList.add('open');
});

resetQuestionBtn.addEventListener('click', () => {
  if (confirm('Bu sorudaki tüm işaretlemeleri sıfırlamak istiyor musunuz?')) {
    socket.emit('reset-current-question');
  }
});

resetParticipantBtn.addEventListener('click', () => {
  if (!lastTeams.length) {
    alert('Sıfırlanacak katılımcı bulunamadı.');
    return;
  }
  const list = lastTeams.join(', ');
  const input = prompt(`Sıfırlanacak katılımcı adını yazın:\n${list}`);
  const target = String(input || '').trim();
  if (!target) return;
  socket.emit('reset-current-for-participant', target);
});

socket.on('activity-log-update', (entries) => {
  if (!Array.isArray(entries) || !entries.length) {
    activityBody.innerHTML = '<p class="modal-hint">Henüz kayıt yok.</p>';
    return;
  }
  const rows = [...entries].reverse().map((e) => {
    const d = new Date(e.time);
    const timeStr = d.toLocaleString('tr-TR');
    const typeLabel = e.type === 'join' ? 'Katıldı' : 'Ayrıldı';
    const typeClass = e.type === 'join' ? 'type-join' : 'type-leave';
    return `<tr><td>${timeStr}</td><td>${e.name || '-'}</td><td class="${typeClass}">${typeLabel}</td><td>Soru ${e.questionNum || 1}</td></tr>`;
  }).join('');
  activityBody.innerHTML = `
    <table class="activity-table">
      <thead><tr><th>Zaman</th><th>Katılımcı</th><th>Olay</th><th>Soru</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
});

activityBtn.addEventListener('click', () => {
  activityModal.classList.add('open');
});

socket.on('scores-update', (data) => {
  const correct = data.correct || data;
  const wrong = data.wrong || {};
  const sortedCorrect = sortScores(correct, true);
  const sortedWrong = sortScores(wrong, true);
  updateChart(scoreChart, 'score-chart', sortedCorrect.scores, 'rgba(46, 213, 115, 0.7)', '#2ed573');
  updateChart(wrongChart, 'wrong-chart', sortedWrong.scores, 'rgba(255, 107, 129, 0.7)', '#ff6b81');
});

function sortScores(obj, descending = true) {
  const entries = Object.entries(obj).sort((a, b) => descending ? b[1] - a[1] : a[1] - b[1]);
  return { labels: entries.map(e => e[0]), scores: Object.fromEntries(entries), data: entries.map(e => e[1]) };
}

socket.on('stats-update', (stats) => {
  questionStatsData = stats || [];
  statsTableBody.innerHTML = '';
  (stats || []).forEach((s, i) => {
    const total = s.totalAtQuestion || (s.teamsAtQuestion && s.teamsAtQuestion.length) || lastParticipantCount || 0;
    const blank = Math.max(0, total - (s.correct || 0) - (s.wrong || 0));
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>Soru ${i + 1}</td>
      <td class="stat-correct">${s.correct || 0}</td>
      <td class="stat-wrong">${s.wrong || 0}</td>
      <td class="stat-blank">${blank}</td>
      <td><button class="btn-detail" data-index="${i}">Detay</button></td>
    `;
    tr.querySelector('.btn-detail').addEventListener('click', () => showDetail(i));
    statsTableBody.appendChild(tr);
  });
});

function showDetail(index) {
  const s = questionStatsData[index];
  const total = s.totalAtQuestion || (s.teamsAtQuestion && s.teamsAtQuestion.length) || lastParticipantCount || 0;
  const blank = Math.max(0, total - (s.correct || 0) - (s.wrong || 0));
  const correct = s.correct || 0;
  const wrong = s.wrong || 0;

  const pct = (n) => total ? ((n / total) * 100).toFixed(1) : 0;
  const allTeams = (s.teamsAtQuestion && s.teamsAtQuestion.length) ? s.teamsAtQuestion : lastTeams;
  const blankTeams = allTeams.filter(t => !(s.correctTeams || []).includes(t) && !(s.wrongTeams || []).includes(t));

  detailTitle.textContent = `Soru ${index + 1} Detayı`;
  detailBody.innerHTML = `
    <div class="detail-section">
      <h4>Doğru (${correct} katılımcı, %${pct(correct)})</h4>
      <ul>${(s.correctTeams || []).map(t => `<li class="stat-correct">${t}</li>`).join('') || '<li class="empty">-</li>'}</ul>
    </div>
    <div class="detail-section">
      <h4>Yanlış (${wrong} katılımcı, %${pct(wrong)})</h4>
      <ul>${(s.wrongTeams || []).map(t => `<li class="stat-wrong">${t}</li>`).join('') || '<li class="empty">-</li>'}</ul>
    </div>
    <div class="detail-section">
      <h4>Boş — işaretlemeyenler (${blank} katılımcı, %${pct(blank)})</h4>
      <ul>${blankTeams.map(t => `<li class="stat-blank">${t}</li>`).join('') || '<li class="empty">-</li>'}</ul>
    </div>
  `;
  detailModal.classList.add('open');
}

resultBtn.addEventListener('click', () => {
  const teamCorrect = {};
  const teamWrong = {};
  questionStatsData.forEach((s) => {
    (s.correctTeams || []).forEach(t => { teamCorrect[t] = (teamCorrect[t] || 0) + 1; });
    (s.wrongTeams || []).forEach(t => { teamWrong[t] = (teamWrong[t] || 0) + 1; });
  });

  let totalCorrect = 0, totalWrong = 0;
  Object.values(teamCorrect).forEach(v => totalCorrect += v);
  Object.values(teamWrong).forEach(v => totalWrong += v);
  const totalAnswered = totalCorrect + totalWrong;
  const pctCorrect = totalAnswered ? ((totalCorrect / totalAnswered) * 100).toFixed(1) : 0;
  const pctWrong = totalAnswered ? ((totalWrong / totalAnswered) * 100).toFixed(1) : 0;

  const allNames = new Set([...lastTeams, ...Object.keys(teamCorrect), ...Object.keys(teamWrong)]);
  const ranked = [...allNames].map((name) => ({
    name,
    c: teamCorrect[name] || 0,
    w: teamWrong[name] || 0
  })).sort((a, b) => {
    if (b.c !== a.c) return b.c - a.c;
    if (a.w !== b.w) return a.w - b.w;
    return a.name.localeCompare(b.name, 'tr');
  });

  const winner = ranked[0] && ranked[0].c > 0 ? ranked[0].name : '-';

  const rankRows = ranked.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${r.name}</td>
      <td class="stat-correct">${r.c}</td>
      <td class="stat-wrong">${r.w}</td>
    </tr>
  `).join('');

  resultBody.innerHTML = `
    <div class="result-summary">
      <p><strong>Toplam Doğru:</strong> ${totalCorrect} (%${pctCorrect})</p>
      <p><strong>Toplam Yanlış:</strong> ${totalWrong} (%${pctWrong})</p>
      <p class="winner">Kazanan: <strong>${winner}</strong></p>
    </div>
    <p class="modal-hint">Tüm katılımcılar (sıralı)</p>
    <table class="result-table">
      <thead><tr><th>#</th><th>Katılımcı</th><th>Doğru</th><th>Yanlış</th></tr></thead>
      <tbody>
        ${ranked.length ? rankRows : '<tr><td colspan="4">Veri yok</td></tr>'}
      </tbody>
    </table>
  `;
  resultModal.classList.add('open');
});

socket.on('question-change', (data) => {
  const { index, question, total } = data;
  const num = (index || 0) + 1;
  questionNumEl.textContent = `Soru ${num}/${total || 17}`;
  questionNumBoxEl.textContent = `Soru ${num}/${total || 17}`;
  questionTextEl.textContent = question?.text || '—';
});

function updateChart(chart, canvasId, scoresObj, bgColor, borderColor) {
  const labels = Object.keys(scoresObj);
  const data = Object.values(scoresObj);

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
          tooltip: { callbacks: { label: (ctx) => ` ${ctx.raw}` } }
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
  if (confirm('Oyunu bitirmek istediğinize emin misiniz?')) socket.emit('end-game');
});
prevBtn.addEventListener('click', () => socket.emit('prev-question'));
nextBtn.addEventListener('click', () => socket.emit('next-question'));
resetBtn.addEventListener('click', () => {
  if (confirm('Oyunu sıfırlamak istediğinize emin misiniz?')) socket.emit('reset-game');
});
