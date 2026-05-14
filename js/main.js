(function () {
  'use strict';

  function save(key, data) {
    try { localStorage.setItem('mk7_' + key, JSON.stringify(data)); } catch (e) {}
  }
  function load(key, def) {
    try { const v = localStorage.getItem('mk7_' + key); return v ? JSON.parse(v) : def; } catch (e) { return def; }
  }

  /* ========== 0. Entrance animation for cards ========== */
  const cards = document.querySelectorAll('details.card');
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.setProperty('--delay', i * 0.06 + 's');
        entry.target.classList.add('card-visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(c => cardObserver.observe(c));

  /* ========== 1. Accordion state (localStorage) ========== */
  const details = document.querySelectorAll('details.card');
  const storedAccordion = load('accordion', []);
  details.forEach((d, i) => {
    if (storedAccordion[i]) d.open = true;
    d.addEventListener('toggle', () => {
      const arr = details.map(el => el.open);
      save('accordion', arr);
    });
  });

  /* ========== 2. Checklist + Progress ========== */
  const allRecords = document.querySelectorAll('.record');
  const checkedState = load('checklist', {});

  allRecords.forEach((rec, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'record-inner';
    while (rec.firstChild) wrapper.appendChild(rec.firstChild);

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'record-check';
    check.title = 'Отметить как выполненное';
    check.checked = !!checkedState[idx];
    check.addEventListener('change', () => {
      checkedState[idx] = check.checked;
      save('checklist', checkedState);
      updateAllProgress();
    });

    rec.insertBefore(check, rec.firstChild);
    rec.appendChild(wrapper);
  });

  function updateAllProgress() {
    let totalChecked = 0;
    let totalRecords = 0;
    document.querySelectorAll('details.card').forEach(card => {
      const records = card.querySelectorAll('.record');
      const done = card.querySelectorAll('.record-check:checked');
      let bar = card.querySelector('.progress-bar');
      if (!bar) {
        bar = document.createElement('div');
        bar.className = 'progress-bar';
        const label = document.createElement('span');
        label.className = 'progress-label';
        bar.appendChild(label);
        const fill = document.createElement('div');
        fill.className = 'progress-fill';
        bar.appendChild(fill);
        card.insertBefore(bar, card.firstElementChild.nextSibling);
      }
      const pct = records.length ? Math.round(done.length / records.length * 100) : 0;
      bar.querySelector('.progress-label').textContent = `Выполнено: ${done.length} / ${records.length}`;
      bar.querySelector('.progress-fill').style.width = pct + '%';
      totalChecked += done.length;
      totalRecords += records.length;
    });
  }
  updateAllProgress();

  /* ========== 3. Search ========== */
  const searchBox = document.createElement('input');
  searchBox.type = 'search';
  searchBox.placeholder = 'Поиск по инструкции...';
  searchBox.className = 'search-input';
  searchBox.setAttribute('aria-label', 'Поиск');

  const searchWrap = document.createElement('div');
  searchWrap.className = 'search-wrap';
  searchWrap.appendChild(searchBox);

  const mainEl = document.querySelector('.main');
  mainEl.parentNode.insertBefore(searchWrap, mainEl);

  searchBox.addEventListener('input', function () {
    const q = this.value.toLowerCase().trim();
    document.querySelectorAll('.record').forEach(rec => {
      const text = rec.textContent.toLowerCase();
      const match = !q || text.includes(q);
      rec.style.display = match ? '' : 'none';
    });
    document.querySelectorAll('details.card').forEach(card => {
      const visible = card.querySelectorAll('.record[style*="display"]:not([style*="display: none"])');
      const hidden = card.querySelectorAll('.record[style*="display: none"]');
      const total = card.querySelectorAll('.record').length;
      if (q && hidden.length === total) {
        card.style.display = 'none';
      } else {
        card.style.display = '';
      }
    });
  });

  /* ========== 4. Scroll to top ========== */
  const scrollBtn = document.createElement('button');
  scrollBtn.className = 'scroll-top';
  scrollBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
  scrollBtn.setAttribute('aria-label', 'Наверх');
  document.body.appendChild(scrollBtn);

  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ========== 5. Dark theme ========== */
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Переключить тему');
  themeToggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  document.body.appendChild(themeToggle);

  const isDark = load('darkTheme', false);
  if (isDark) document.documentElement.setAttribute('data-theme', 'dark');
  themeToggle.addEventListener('click', () => {
    const now = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', now ? '' : 'dark');
    save('darkTheme', !now);
  });

  /* ========== 6. Lightbox ========== */
  const lbOverlay = document.createElement('div');
  lbOverlay.className = 'lightbox-overlay';
  const lbImg = document.createElement('img');
  lbImg.className = 'lightbox-img';
  const lbClose = document.createElement('button');
  lbClose.className = 'lightbox-close';
  lbClose.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  lbClose.setAttribute('aria-label', 'Закрыть');
  lbOverlay.appendChild(lbImg);
  lbOverlay.appendChild(lbClose);
  document.body.appendChild(lbOverlay);

  document.querySelectorAll('.list-img.image').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      if (img.src && img.src !== window.location.href) {
        lbImg.src = img.src;
        lbImg.alt = img.alt || '';
        lbOverlay.classList.add('open');
      }
    });
  });
  lbClose.addEventListener('click', () => lbOverlay.classList.remove('open'));
  lbOverlay.addEventListener('click', e => { if (e.target === lbOverlay) lbOverlay.classList.remove('open'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lbOverlay.classList.remove('open'); });

  /* ========== 7. Intersection Observer (current step highlight) ========== */
  let currentId = -1;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const rec = entry.target;
      const idx = Array.from(allRecords).indexOf(rec);
      if (entry.isIntersecting) {
        rec.classList.add('record-active');
        if (idx > currentId) currentId = idx;
      } else {
        rec.classList.remove('record-active');
        if (idx === currentId) currentId = -1;
      }
    });
  }, { threshold: 0.3 });

  allRecords.forEach(rec => obs.observe(rec));

  /* ========== 8. Print button ========== */
  const printBtn = document.createElement('button');
  printBtn.className = 'print-btn';
  printBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Печать / PDF';
  printBtn.setAttribute('aria-label', 'Печать или сохранить как PDF');
  document.body.appendChild(printBtn);
  printBtn.addEventListener('click', () => window.print());

  /* ========== 9. QR generator ========== */
  if (typeof QRCode !== 'undefined' && document.querySelector('.qrcode')) {
    new QRCode(document.querySelector('.qrcode'), {
      text: 'https://nephrit44.github.io/MK7-MyID/?clckid=95014eee',
      width: 128,
      height: 128,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  }
})();
