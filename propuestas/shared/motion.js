// Comportamientos compartidos de las portadas de Kokar (mockup).
// Todo respeta prefers-reduced-motion: sin animaciones, el contenido se muestra completo.
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  document.documentElement.classList.add('js');

  const css = `
  .js [data-reveal]{opacity:0;transform:translateY(28px);transition:opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1);transition-delay:var(--d,0s)}
  .js [data-reveal="left"]{transform:translateX(-36px)}
  .js [data-reveal="zoom"]{transform:scale(.96)}
  .js [data-reveal].in{opacity:1;transform:none}
  .js .line-mask{display:block;overflow:hidden;padding-bottom:.06em}
  .js .line-mask>span{display:block;transform:translateY(105%);transition:transform 1.1s cubic-bezier(.2,.75,.15,1);transition-delay:var(--d,0s)}
  .js .ready .line-mask>span{transform:none}
  .marquee{overflow:hidden;-webkit-mask:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);mask:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}
  .marquee-track{display:flex;width:max-content;animation:mq var(--mq,38s) linear infinite}
  .marquee:hover .marquee-track{animation-play-state:paused}
  @keyframes mq{to{transform:translateX(-50%)}}
  .toast{position:fixed;left:50%;bottom:28px;z-index:60;transform:translate(-50%,calc(100% + 40px));visibility:hidden;padding:14px 20px;border-radius:12px;font:600 15px/1.3 system-ui,sans-serif;background:#111c2b;color:#fff;box-shadow:0 14px 40px rgba(0,0,0,.35);transition:transform .45s cubic-bezier(.2,.8,.2,1),visibility .45s}
  .toast.show{transform:translate(-50%,0);visibility:visible}
  .badge.bump{animation:bump .5s}
  @keyframes bump{40%{transform:scale(1.45)}}
  @media (prefers-reduced-motion:reduce){.js [data-reveal],.js .line-mask>span{opacity:1!important;transform:none!important;transition:none!important}.marquee-track{animation:none}}
  `;
  document.head.append(Object.assign(document.createElement('style'), { textContent: css }));

  // Entrada del hero: se activa al cargar
  requestAnimationFrame(() => setTimeout(() => $$('[data-hero]').forEach(h => h.classList.add('ready')), 80));

  // Aparición al hacer scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .14, rootMargin: '0px 0px -40px 0px' });
  $$('[data-reveal]').forEach(el => io.observe(el));
  // Escalonado: hijos con data-stagger
  $$('[data-stagger]').forEach(p => [...p.children].forEach((c, i) => {
    c.setAttribute('data-reveal', c.getAttribute('data-reveal') || '');
    c.style.setProperty('--d', (i * (+p.dataset.stagger || .08)) + 's');
    io.observe(c);
  }));

  // Cifras que cuentan
  const fmt = n => n.toLocaleString('es-PE').replace(/[.,]/g, ' ');
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
    co.unobserve(el);
    if (still) { el.textContent = fmt(end) + suf; return; }
    const t0 = performance.now(), dur = 1600;
    const tick = t => { const p = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 3))); el.textContent = fmt(v) + suf; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .5 });
  $$('[data-count]').forEach(el => { el.textContent = '0' + (el.dataset.suffix || ''); co.observe(el); });

  // Header que cambia al bajar
  const top = document.querySelector('.top');
  const onScroll = () => top && top.classList.toggle('scrolled', scrollY > 12);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Menú móvil
  $$('[data-burger]').forEach(b => b.addEventListener('click', () => {
    const m = document.getElementById(b.getAttribute('aria-controls'));
    const open = m.classList.toggle('open'); b.setAttribute('aria-expanded', open);
    document.body.classList.toggle('menu-open', open);
  }));

  // Pestañas
  $$('[data-tabs]').forEach(box => {
    const tabs = $$('[role=tab]', box), panels = $$('[role=tabpanel]', box), ind = box.querySelector('.tab-ind');
    const go = i => {
      tabs.forEach((t, j) => { t.setAttribute('aria-selected', i === j); t.tabIndex = i === j ? 0 : -1; });
      panels.forEach((p, j) => { p.hidden = i !== j; if (i === j) { p.classList.remove('in'); requestAnimationFrame(() => p.classList.add('in')); } });
      if (ind) { ind.style.width = tabs[i].offsetWidth + 'px'; ind.style.transform = `translateX(${tabs[i].offsetLeft}px)`; }
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => go(i));
      t.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length; tabs[n].focus(); go(n); } });
    });
    addEventListener('resize', () => go(tabs.findIndex(t => t.getAttribute('aria-selected') === 'true')));
    go(0);
  });

  // Carrusel con botones
  $$('[data-carousel]').forEach(c => {
    const track = c.querySelector('.track');
    const step = () => (track.firstElementChild?.offsetWidth || 300) + 20;
    c.querySelector('[data-prev]')?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: still ? 'auto' : 'smooth' }));
    c.querySelector('[data-next]')?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: still ? 'auto' : 'smooth' }));
  });

  // Testimonios que rotan
  $$('[data-rotator]').forEach(r => {
    const items = $$('.quote', r), dots = $$('.dots button', r); let i = 0, timer;
    const show = n => { i = (n + items.length) % items.length; items.forEach((q, j) => q.classList.toggle('on', j === i)); dots.forEach((d, j) => d.setAttribute('aria-current', j === i)); };
    const play = () => { if (!still) timer = setInterval(() => show(i + 1), 6500); };
    dots.forEach((d, j) => d.addEventListener('click', () => { clearInterval(timer); show(j); play(); }));
    r.addEventListener('mouseenter', () => clearInterval(timer)); r.addEventListener('mouseleave', play);
    show(0); play();
  });

  // Carrito de maqueta
  const toast = Object.assign(document.createElement('div'), { className: 'toast', role: 'status' });
  document.body.append(toast); let tt;
  $$('[data-add]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault();
    const badge = document.querySelector('.badge');
    if (badge) { badge.textContent = +badge.textContent + 1; badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump'); }
    toast.textContent = `Agregado al carrito: ${b.dataset.add}`;
    toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2600);
  }));

  // Paralaje suave
  const px = $$('[data-parallax]');
  if (px.length && !still) {
    const run = () => { px.forEach(el => { const r = el.getBoundingClientRect(); el.style.transform = `translate3d(0,${(r.top + r.height / 2 - innerHeight / 2) * -(+el.dataset.parallax)}px,0) scale(1.12)`; }); };
    addEventListener('scroll', () => requestAnimationFrame(run), { passive: true }); run();
  }
})();
