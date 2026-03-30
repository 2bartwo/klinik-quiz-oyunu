(function () {
  const data = window.MENU_DATA;
  if (!data) return;

  const FAV_KEY = 'atesten_favs_v1';
  const cart = {};

  function syncBodyScrollLock() {
    const qr = document.getElementById('qr-modal');
    const cM = document.getElementById('cart-modal');
    const dM = document.getElementById('detail-modal');
    const any =
      (qr && qr.classList.contains('is-open')) ||
      (cM && cM.classList.contains('is-open')) ||
      (dM && dM.classList.contains('is-open'));
    document.body.style.overflow = any ? 'hidden' : '';
  }

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

  function itemKey(cat, item) {
    return item.id || dishId(cat.id, item.name);
  }

  function formatPrice(n) {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(n);
  }

  function cartLineCount() {
    return Object.values(cart).reduce((s, l) => s + l.qty, 0);
  }

  function cartTotal() {
    return Object.values(cart).reduce((s, l) => s + l.qty * l.price, 0);
  }

  function syncCartBar() {
    const bar = document.getElementById('cart-bar');
    const text = document.getElementById('cart-bar-text');
    const n = cartLineCount();
    if (!bar || !text) return;
    if (n === 0) {
      bar.hidden = true;
      document.body.classList.remove('has-cart-pad');
      text.textContent = '';
      return;
    }
    bar.hidden = false;
    document.body.classList.add('has-cart-pad');
    text.textContent = n + ' ürün · ' + formatPrice(cartTotal());
  }

  function syncAllCardSteppers() {
    document.querySelectorAll('.dish-qty-row[data-item-key]').forEach((row) => {
      const key = row.getAttribute('data-item-key');
      const num = row.querySelector('.qty-num');
      const stepper = row.querySelector('.qty-stepper');
      if (!num || !stepper || !key) return;
      const btnM = stepper.children[0];
      const q = cart[key] ? cart[key].qty : 0;
      num.textContent = String(q);
      if (btnM) btnM.disabled = q <= 0;
    });
  }

  function setQty(cat, item, qty) {
    const id = itemKey(cat, item);
    const q = Math.max(0, Math.min(99, parseInt(qty, 10) || 0));
    if (q === 0) {
      delete cart[id];
    } else {
      cart[id] = { id, name: item.name, price: item.price, qty: q };
    }
    syncCartBar();
    syncAllCardSteppers();
  }

  function findItemByCartId(cid) {
    for (const cat of data.categories) {
      for (const item of cat.items) {
        if (itemKey(cat, item) === cid) return { cat, item };
      }
    }
    return null;
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
      const id = itemKey(cat, item);
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

      const qtyRow = document.createElement('div');
      qtyRow.className = 'dish-qty-row';
      qtyRow.setAttribute('data-item-key', id);
      const qtyLab = document.createElement('span');
      qtyLab.className = 'dish-qty-label';
      qtyLab.textContent = 'Adet';
      const stepper = document.createElement('div');
      stepper.className = 'qty-stepper';
      const btnM = document.createElement('button');
      btnM.type = 'button';
      btnM.setAttribute('aria-label', 'Azalt');
      btnM.textContent = '−';
      const num = document.createElement('span');
      num.className = 'qty-num';
      num.textContent = '0';
      const btnP = document.createElement('button');
      btnP.type = 'button';
      btnP.setAttribute('aria-label', 'Arttır');
      btnP.textContent = '+';

      function readQty() {
        return cart[id] ? cart[id].qty : 0;
      }

      function paintQty() {
        const q = readQty();
        num.textContent = String(q);
        btnM.disabled = q <= 0;
      }

      btnM.addEventListener('click', () => {
        setQty(cat, item, readQty() - 1);
        paintQty();
      });
      btnP.addEventListener('click', () => {
        setQty(cat, item, readQty() + 1);
        paintQty();
      });
      paintQty();

      stepper.appendChild(btnM);
      stepper.appendChild(num);
      stepper.appendChild(btnP);
      qtyRow.appendChild(qtyLab);
      qtyRow.appendChild(stepper);

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
      body.appendChild(qtyRow);
      body.appendChild(footer);
      card.appendChild(body);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    menuRoot.appendChild(section);
  });

  function scrollToSection(secId) {
    const el = document.getElementById(secId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const pills = [...catNav.querySelectorAll('.cat-pill')];
  const sections = data.categories.map((c) => document.getElementById(c.id)).filter(Boolean);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const secId = en.target.id;
        pills.forEach((p) => {
          p.classList.toggle('is-active', p.dataset.target === secId);
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

  /* Sepet modal */
  const cartModal = document.getElementById('cart-modal');
  const openCartBtn = document.getElementById('open-cart');
  const closeCartBtn = document.getElementById('close-cart');
  const cartLinesEl = document.getElementById('cart-lines');
  const cartTotalEl = document.getElementById('cart-total');
  const cartTableSel = document.getElementById('cart-table');
  const cartNoteEl = document.getElementById('cart-note');
  const cartMsgEl = document.getElementById('cart-msg');
  const cartSubmitBtn = document.getElementById('cart-submit');
  let cartLastFocus = null;

  if (cartTableSel) {
    for (let t = 1; t <= 40; t++) {
      const o = document.createElement('option');
      o.value = String(t);
      o.textContent = 'Masa ' + t;
      cartTableSel.appendChild(o);
    }
  }

  function renderCartLines() {
    if (!cartLinesEl || !cartTotalEl) return;
    cartLinesEl.innerHTML = '';
    const lines = Object.values(cart);
    if (lines.length === 0) {
      cartLinesEl.innerHTML = '<p class="admin-empty" style="padding:1rem;margin:0">Sepet boş.</p>';
      cartTotalEl.textContent = '';
      return;
    }
    lines.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    lines.forEach((line) => {
      const wrap = document.createElement('div');
      wrap.className = 'cart-line';
      const left = document.createElement('div');
      const nm = document.createElement('div');
      nm.className = 'cart-line-name';
      nm.textContent = line.name;
      const meta = document.createElement('div');
      meta.className = 'cart-line-meta';
      meta.textContent = formatPrice(line.price) + ' × ' + line.qty;
      left.appendChild(nm);
      left.appendChild(meta);

      const stepper = document.createElement('div');
      stepper.className = 'qty-stepper';
      const bM = document.createElement('button');
      bM.type = 'button';
      bM.textContent = '−';
      bM.setAttribute('aria-label', line.name + ' azalt');
      const num = document.createElement('span');
      num.className = 'qty-num';
      num.textContent = String(line.qty);
      const bP = document.createElement('button');
      bP.type = 'button';
      bP.textContent = '+';
      bP.setAttribute('aria-label', line.name + ' arttır');

      const found = findItemByCartId(line.id);
      bM.addEventListener('click', () => {
        if (!found) return;
        setQty(found.cat, found.item, line.qty - 1);
        renderCartLines();
      });
      bP.addEventListener('click', () => {
        if (!found) return;
        setQty(found.cat, found.item, line.qty + 1);
        renderCartLines();
      });

      stepper.appendChild(bM);
      stepper.appendChild(num);
      stepper.appendChild(bP);
      wrap.appendChild(left);
      wrap.appendChild(stepper);
      cartLinesEl.appendChild(wrap);
    });
    cartTotalEl.textContent = 'Ara toplam: ' + formatPrice(cartTotal());
  }

  function openCartModal() {
    if (!cartModal) return;
    if (cartLineCount() === 0) return;
    cartLastFocus = document.activeElement;
    if (cartMsgEl) {
      cartMsgEl.textContent = '';
      cartMsgEl.classList.remove('is-error', 'is-ok');
    }
    renderCartLines();
    cartModal.hidden = false;
    cartModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (closeCartBtn) closeCartBtn.focus();
  }

  function closeCartModal() {
    if (!cartModal || !cartModal.classList.contains('is-open')) return;
    cartModal.classList.remove('is-open');
    syncBodyScrollLock();
    setTimeout(() => {
      cartModal.hidden = true;
    }, 250);
    if (cartLastFocus && typeof cartLastFocus.focus === 'function') cartLastFocus.focus();
    cartLastFocus = null;
  }

  if (openCartBtn) openCartBtn.addEventListener('click', openCartModal);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartModal);
  if (cartModal) {
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) closeCartModal();
    });
  }

  if (cartSubmitBtn) {
    cartSubmitBtn.addEventListener('click', async () => {
      if (cartMsgEl) {
        cartMsgEl.textContent = '';
        cartMsgEl.classList.remove('is-error', 'is-ok');
      }
      const table = parseInt(cartTableSel && cartTableSel.value, 10);
      if (!Number.isFinite(table) || table < 1) {
        if (cartMsgEl) {
          cartMsgEl.textContent = 'Masa seçin.';
          cartMsgEl.classList.add('is-error');
        }
        return;
      }
      const items = Object.values(cart).map((l) => ({
        name: l.name,
        price: l.price,
        qty: l.qty
      }));
      if (items.length === 0) {
        if (cartMsgEl) {
          cartMsgEl.textContent = 'Sepet boş.';
          cartMsgEl.classList.add('is-error');
        }
        return;
      }
      const note = cartNoteEl ? cartNoteEl.value.trim() : '';
      cartSubmitBtn.disabled = true;
      try {
        const res = await fetch('/api/menu-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table, items, note })
        });
        const j = await res.json().catch(() => ({}));
        if (!res.ok || !j.ok) {
          throw new Error(j.message || 'Gönderilemedi');
        }
        Object.keys(cart).forEach((k) => delete cart[k]);
        syncCartBar();
        renderCartLines();
        syncAllCardSteppers();
        if (cartNoteEl) cartNoteEl.value = '';
        if (cartMsgEl) {
          cartMsgEl.textContent = 'Siparişiniz alındı. Afiyet olsun!';
          cartMsgEl.classList.add('is-ok');
        }
        setTimeout(() => {
          closeCartModal();
          if (cartMsgEl) {
            cartMsgEl.textContent = '';
            cartMsgEl.classList.remove('is-ok');
          }
        }, 1600);
      } catch (err) {
        if (cartMsgEl) {
          cartMsgEl.textContent = err.message || 'Bağlantı hatası.';
          cartMsgEl.classList.add('is-error');
        }
      } finally {
        cartSubmitBtn.disabled = false;
      }
    });
  }

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
    syncBodyScrollLock();
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
    syncBodyScrollLock();
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

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (detailModal && detailModal.classList.contains('is-open')) closeDetailModal();
    else if (cartModal && cartModal.classList.contains('is-open')) closeCartModal();
    else if (modal && modal.classList.contains('is-open')) closeModal();
  });

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
