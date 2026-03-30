(function () {
  const STORAGE_KEY = 'atesten_menu_orders_key';
  const root = document.getElementById('orders-root');
  const msg = document.getElementById('admin-msg');
  const keyInput = document.getElementById('admin-key');
  const btnSave = document.getElementById('btn-save-key');
  const btnRefresh = document.getElementById('btn-refresh');
  const autoChk = document.getElementById('auto-refresh');

  const fmt = new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  function formatPrice(n) {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(n);
  }

  function getKey() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) || '';
    } catch {
      return '';
    }
  }

  function setKey(k) {
    try {
      if (k) sessionStorage.setItem(STORAGE_KEY, k);
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  }

  if (keyInput && getKey()) keyInput.value = getKey();

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const v = keyInput ? keyInput.value.trim() : '';
      setKey(v);
      if (msg) {
        msg.textContent = v ? 'Anahtar bu oturum için kaydedildi.' : 'Anahtar temizlendi.';
        msg.classList.remove('is-error');
        msg.classList.add('is-ok');
      }
      loadOrders();
    });
  }

  async function loadOrders() {
    if (!root) return;
    const key = getKey() || (keyInput && keyInput.value.trim()) || '';
    const headers = {};
    if (key) headers['X-Menu-Orders-Key'] = key;

    if (msg) {
      msg.classList.remove('is-error', 'is-ok');
    }

    try {
      const res = await fetch('/api/menu-orders', { headers });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        root.innerHTML = '';
        if (msg) {
          msg.textContent =
            'Yetkisiz. Sunucuda MENU_ORDERS_KEY tanımlıysa doğru anahtarı girip «Anahtarı kaydet»e basın.';
          msg.classList.add('is-error');
        }
        return;
      }
      if (!res.ok || !data.ok || !Array.isArray(data.orders)) {
        throw new Error(data.message || 'Liste alınamadı');
      }
      if (msg && msg.textContent && msg.classList.contains('is-error')) {
        msg.textContent = '';
      }
      renderOrders(data.orders);
    } catch (e) {
      root.innerHTML = '';
      if (msg) {
        msg.textContent = e.message || 'Bağlantı hatası';
        msg.classList.add('is-error');
      }
    }
  }

  function renderOrders(orders) {
    if (!root) return;
    if (orders.length === 0) {
      root.innerHTML = '<p class="admin-empty">Henüz kayıtlı sipariş yok.</p>';
      return;
    }

    const frag = document.createDocumentFragment();
    orders.forEach((o) => {
      const card = document.createElement('article');
      card.className = 'order-card';

      const head = document.createElement('div');
      head.className = 'order-card-head';
      const masa = document.createElement('div');
      masa.className = 'order-masa';
      masa.textContent = 'Masa ' + o.table;
      const time = document.createElement('div');
      time.className = 'order-time';
      try {
        time.textContent = fmt.format(new Date(o.createdAt));
      } catch {
        time.textContent = o.createdAt || '';
      }
      const oid = document.createElement('div');
      oid.className = 'order-id';
      oid.textContent = 'Sipariş no: ' + (o.id || '—');
      head.appendChild(masa);
      head.appendChild(time);
      head.appendChild(oid);
      card.appendChild(head);

      const table = document.createElement('table');
      table.className = 'order-table';
      const thead = document.createElement('thead');
      thead.innerHTML =
        '<tr><th>Ürün</th><th class="num">Adet</th><th class="num">Birim</th><th class="num">Ara</th></tr>';
      table.appendChild(thead);
      const tbody = document.createElement('tbody');
      let sum = 0;
      (o.items || []).forEach((it) => {
        const tr = document.createElement('tr');
        const sub = (it.qty || 0) * (it.price || 0);
        sum += sub;
        tr.innerHTML =
          '<td>' +
          escapeHtml(it.name) +
          '</td><td class="num">' +
          it.qty +
          '</td><td class="num">' +
          formatPrice(it.price) +
          '</td><td class="num">' +
          formatPrice(sub) +
          '</td>';
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      card.appendChild(table);

      const total = document.createElement('div');
      total.className = 'order-total-row';
      total.textContent = 'Toplam: ' + formatPrice(sum);
      card.appendChild(total);

      if (o.note) {
        const note = document.createElement('p');
        note.className = 'order-note';
        note.textContent = 'Not: ' + o.note;
        card.appendChild(note);
      }

      frag.appendChild(card);
    });
    root.innerHTML = '';
    root.appendChild(frag);
  }

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  if (btnRefresh) btnRefresh.addEventListener('click', loadOrders);

  let timer = null;
  function armAuto() {
    if (timer) clearInterval(timer);
    timer = null;
    if (autoChk && autoChk.checked) {
      timer = setInterval(loadOrders, 20000);
    }
  }
  if (autoChk) autoChk.addEventListener('change', armAuto);

  loadOrders();
  armAuto();
})();
