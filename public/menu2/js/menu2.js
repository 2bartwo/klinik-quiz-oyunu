(function () {
  const data = window.COFFEE_MENU;
  if (!data) return;

  const root = document.getElementById('m2-root');
  const filterEl = document.getElementById('m2-filter');
  const heroBlurb = document.getElementById('m2-hero-blurb');
  const footerName = document.getElementById('m2-footer-name');
  const footerMeta = document.getElementById('m2-footer-meta');

  const c = data.cafe;
  if (heroBlurb && c.blurb) heroBlurb.textContent = c.blurb;
  if (footerName) footerName.textContent = c.name;
  if (footerMeta) {
    footerMeta.innerHTML =
      '<p>' +
      escapeHtml(c.location) +
      '</p><p>' +
      escapeHtml(c.hours) +
      '</p>';
  }

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function formatPrice(n) {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(n);
  }

  const filters = [
    { id: 'all', label: 'Tümü' },
    { id: 'hot', label: 'Sıcak' },
    { id: 'cold', label: 'Soğuk' }
  ];

  filters.forEach((f) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'm2-filter-btn' + (f.id === 'all' ? ' is-active' : '');
    b.textContent = f.label;
    b.dataset.filter = f.id;
    b.addEventListener('click', () => setFilter(f.id));
    filterEl.appendChild(b);
  });

  function setFilter(id) {
    filterEl.querySelectorAll('.m2-filter-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.filter === id);
    });
    if (id === 'all') {
      document.querySelectorAll('.m2-card').forEach((card) => card.classList.remove('is-hidden'));
      document.querySelectorAll('.m2-section').forEach((sec) => {
        sec.style.display = '';
      });
      return;
    }
    document.querySelectorAll('.m2-card[data-temp]').forEach((card) => {
      const t = card.getAttribute('data-temp');
      card.classList.toggle('is-hidden', t !== id);
    });
    document.querySelectorAll('.m2-section').forEach((sec) => {
      const any = sec.querySelector('.m2-card:not(.is-hidden)');
      sec.style.display = any ? '' : 'none';
    });
  }

  data.categories.forEach((cat) => {
    const section = document.createElement('section');
    section.className = 'm2-section';
    section.id = cat.id;

    const head = document.createElement('div');
    head.className = 'm2-section-head';
    head.innerHTML =
      '<h2>' +
      escapeHtml(cat.title) +
      '</h2>' +
      (cat.subtitle ? '<p>' + escapeHtml(cat.subtitle) + '</p>' : '');
    section.appendChild(head);

    const grid = document.createElement('div');
    grid.className = 'm2-grid';

    cat.items.forEach((item) => {
      const temp = item.temp === 'cold' ? 'cold' : 'hot';
      const card = document.createElement('article');
      card.className = 'm2-card';
      card.setAttribute('data-temp', temp);

      const imgW = document.createElement('div');
      imgW.className = 'm2-img-wrap';
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;
      img.loading = 'lazy';
      img.decoding = 'async';
      imgW.appendChild(img);
      const badge = document.createElement('span');
      badge.className = 'm2-temp m2-temp--' + (temp === 'cold' ? 'cold' : 'hot');
      badge.textContent = temp === 'cold' ? 'Soğuk' : 'Sıcak';
      imgW.appendChild(badge);
      card.appendChild(imgW);

      const body = document.createElement('div');
      body.className = 'm2-card-body';
      const h3 = document.createElement('h3');
      h3.textContent = item.name;
      const p = document.createElement('p');
      p.className = 'm2-desc';
      p.textContent = item.desc || '';
      const price = document.createElement('div');
      price.className = 'm2-price';
      price.textContent = formatPrice(item.price);
      body.appendChild(h3);
      body.appendChild(p);
      body.appendChild(price);
      card.appendChild(body);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    root.appendChild(section);
  });
})();
