(function () {
  const data = window.MENU_DATA;
  if (!data) return;

  const FAV_KEY = 'atesten_favs_v1';

  function getFavs() {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  }

  function saveFavs(set) {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify([...set]));
    } catch { /* ignore */ }
  }

  function dishId(catId, name) {
    return catId + '::' + name;
  }

  function formatPrice(n) {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(n);
  }

  const catNav = document.getElementById('cat-nav');
  const menuRoot = document.getElementById('menu-root');
  const heroDesc = document.getElementById('hero-desc');
  const footerBrand = document.getElementById('footer-brand');
  const footerAddress = document.getElementById('footer-address');
  const footerPhone = document.getElementById('footer-phone');
  const footerHours = document.getElementById('footer-hours');

  const r = data.restaurant;
  if (heroDesc && r.tagline) heroDesc.textContent = r.tagline;
  if (footerBrand) footerBrand.textContent = r.name;
  if (footerAddress) {
    footerAddress.innerHTML = '<strong>Adres</strong>' + escapeHtml(r.address);
  }
  if (footerPhone) {
    const tel = r.phone.replace(/\s/g, '');
    const href = tel.startsWith('+') ? 'tel:' + tel.replace(/[^\d+]/g, '') : 'tel:' + tel;
    footerPhone.innerHTML =
      '<strong>Telefon</strong><a href="' + href + '">' + escapeHtml(r.phone) + '</a>';
  }
  if (footerHours) {
    footerHours.innerHTML = '<strong>Çalışma saatleri</strong>' + escapeHtml(r.hours);
  }

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  data.categories.forEach((cat, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cat-pill' + (idx === 0 ? ' is-active' : '');
    btn.textContent = cat.title.split('&')[0].trim();
    btn.dataset.target = cat.id;
    btn.addEventListener('click', () => scrollToSection(cat.id));
    catNav.appendChild(btn);
  });

  data.categories.forEach((cat) => {
    const section = document.createElement('section');
    section.className = 'menu-section';
    section.id = cat.id;
    section.setAttribute('aria-labelledby', 'h-' + cat.id);

    const head = document.createElement('div');
    head.className = 'section-head';
    head.innerHTML =
      '<h2 id="h-' + cat.id + '">' +
      escapeHtml(cat.title) +
      '</h2>' +
      (cat.subtitle ? '<p>' + escapeHtml(cat.subtitle) + '</p>' : '');
    section.appendChild(head);

    const grid = document.createElement('div');
    grid.className = 'dish-grid';

    cat.items.forEach((item) => {
      const id = dishId(cat.id, item.name);
      const card = document.createElement('article');
      card.className = 'dish-card';

      const imgWrap = document.createElement('div');
      imgWrap.className = 'dish-img-wrap';
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name + ' — ' + (item.desc || '').slice(0, 80);
      img.loading = 'lazy';
      img.decoding = 'async';
      imgWrap.appendChild(img);
      if (item.badge) {
        const b = document.createElement('span');
        b.className = 'dish-badge';
        b.textContent = item.badge;
        imgWrap.appendChild(b);
      }
      card.appendChild(imgWrap);

      const body = document.createElement('div');
      body.className = 'dish-body';
      const h3 = document.createElement('h3');
      h3.textContent = item.name;
      const p = document.createElement('p');
      p.className = 'dish-desc';
      p.textContent = item.desc || '';

      const allergens = Array.isArray(item.allergens) ? item.allergens : [];
      const detailBtn = document.createElement('button');
      detailBtn.type = 'button';
      detailBtn.className = 'btn-detail';
      detailBtn.textContent = 'Detay — alerjenler';
      detailBtn.setAttribute('aria-haspopup', 'dialog');
      detailBtn.setAttribute('aria-label', item.name + ' — alerjen detayı');
      detailBtn.addEventListener('click', () => openDetailModal(item.name, allergens));

      const footer = document.createElement('div');
      footer.className = 'dish-footer';
      const priceEl = document.createElement('div');
      priceEl.className = 'dish-price';
      priceEl.textContent = formatPrice(item.price);

      const favBtn = document.createElement('button');
      favBtn.type = 'button';
      favBtn.className = 'fav-btn';
      favBtn.setAttribute('aria-label', item.name + ' — beğen');
      favBtn.dataset.dishId = id;
      const favs = getFavs();
      favBtn.setAttribute('aria-pressed', favs.has(id) ? 'true' : 'false');
      favBtn.innerHTML =
        '<svg viewBox="0 0 24 24" fill="' +
        (favs.has(id) ? 'currentColor' : 'none') +
        '" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';

      favBtn.addEventListener('click', () => {
        const set = getFavs();
        if (set.has(id)) {
          set.delete(id);
          favBtn.setAttribute('aria-pressed', 'false');
          favBtn.querySelector('svg').setAttribute('fill', 'none');
        } else {
          set.add(id);
          favBtn.setAttribute('aria-pressed', 'true');
          favBtn.querySelector('svg').setAttribute('fill', 'currentColor');
        }
        saveFavs(set);
      });

      footer.appendChild(priceEl);
      footer.appendChild(favBtn);
      body.appendChild(h3);
      body.appendChild(p);
      body.appendChild(detailBtn);
      body.appendChild(footer);
      card.appendChild(body);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    menuRoot.appendChild(section);
  });

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const pills = [...catNav.querySelectorAll('.cat-pill')];
  const sections = data.categories.map((c) => document.getElementById(c.id)).filter(Boolean);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        pills.forEach((p) => {
          p.classList.toggle('is-active', p.dataset.target === id);
        });
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );

  sections.forEach((s) => io.observe(s));

  /* QR modal */
  const modal = document.getElementById('qr-modal');
  const openBtn = document.getElementById('open-qr');
  const closeBtn = document.getElementById('close-qr');
  const copyBtn = document.getElementById('copy-link');
  const canvas = document.getElementById('qr-canvas');

  function menuUrl() {
    const u = new URL(window.location.href);
    u.hash = '';
    return u.toString();
  }

  function openModal() {
    modal.hidden = false;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (typeof QRCode !== 'undefined' && canvas) {
      QRCode.toCanvas(canvas, menuUrl(), { width: 200, margin: 2, color: { dark: '#1a1512ff', light: '#ffffffff' } }, (err) => {
        if (err) console.error(err);
      });
    }
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      modal.hidden = true;
    }, 250);
    openBtn.focus();
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (detailModal.classList.contains('is-open')) closeDetailModal();
    else if (modal.classList.contains('is-open')) closeModal();
  });

  /* Alerjen detay modal */
  const detailModal = document.getElementById('detail-modal');
  const detailTitle = document.getElementById('detail-title');
  const detailLabel = document.getElementById('detail-label');
  const detailAllergens = document.getElementById('detail-allergens');
  const detailFootnote = document.getElementById('detail-footnote');
  const closeDetailBtn = document.getElementById('close-detail');

  const ALLERGEN_FOOTNOTE =
    'Liste bilgilendirme amaçlıdır; mutfakta çapraz bulaşma ihtimali olabilir. Ciddi alerjiniz varsa mutlaka personelimize bildirin.';

  let detailLastFocus = null;

  function openDetailModal(dishName, allergens) {
    if (!detailModal || !detailTitle || !detailAllergens) return;
    detailLastFocus = document.activeElement;
    detailTitle.textContent = dishName;
    if (detailLabel) {
      detailLabel.textContent =
        allergens.length > 0
          ? 'İçerebileceği alerjenler'
          : 'Kayıtlı alerjen uyarısı';
    }
    detailAllergens.innerHTML = '';
    if (allergens.length > 0) {
      allergens.forEach((line) => {
        const li = document.createElement('li');
        li.textContent = line;
        detailAllergens.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.className = 'allergen-list-empty';
      li.textContent =
        'Bu ürün için menümüzde özel alerjen satırı tanımlanmamıştır. Yine de hassasiyetiniz varsa personelimize sorunuz.';
      detailAllergens.appendChild(li);
    }
    if (detailFootnote) detailFootnote.textContent = ALLERGEN_FOOTNOTE;

    detailModal.hidden = false;
    detailModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (closeDetailBtn) closeDetailBtn.focus();
  }

  function closeDetailModal() {
    if (!detailModal || !detailModal.classList.contains('is-open')) return;
    detailModal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      detailModal.hidden = true;
    }, 250);
    if (detailLastFocus && typeof detailLastFocus.focus === 'function') {
      detailLastFocus.focus();
    }
    detailLastFocus = null;
  }

  if (closeDetailBtn) closeDetailBtn.addEventListener('click', closeDetailModal);
  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) closeDetailModal();
    });
  }

  copyBtn.addEventListener('click', async () => {
    const url = menuUrl();
    try {
      await navigator.clipboard.writeText(url);
      copyBtn.textContent = 'Kopyalandı!';
      setTimeout(() => {
        copyBtn.textContent = 'Bağlantıyı kopyala';
      }, 2000);
    } catch {
      copyBtn.textContent = 'Kopyalanamadı';
      setTimeout(() => {
        copyBtn.textContent = 'Bağlantıyı kopyala';
      }, 2000);
    }
  });
})();
