/* ============================================================
   GOLF SIMULATOR LOUNGE — MAIN JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── PAGE LOADER ──
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 1600);
  }

  // ── DARK MODE ──
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  const toggleBtns = document.querySelectorAll('.dark-toggle');
  toggleBtns.forEach(btn => {
    btn.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    btn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      toggleBtns.forEach(b => b.textContent = next === 'dark' ? '🌙' : '☀️');
    });
  });

  // ── RTL TOGGLE ──
  const rtlBtns = document.querySelectorAll('.rtl-toggle');
  rtlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isRTL = document.body.dir === 'rtl';
      document.body.dir = isRTL ? 'ltr' : 'rtl';
      btn.textContent = isRTL ? '🌐' : '🔄';
    });
  });

  // ── MOBILE MENU ──
  const hamburger = document.querySelector('.hamburger');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileDrawer.classList.toggle('open');
      document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
    });
    mobileDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── ACTIVE NAV LINK ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });

  // ── SCROLL REVEAL ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── COUNTER ANIMATION ──
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = Number.isInteger(target)
            ? Math.round(current).toLocaleString() + suffix
            : current.toFixed(1) + suffix;
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  // ── NAVBAR SCROLL EFFECT ──
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.15)';
        navbar.style.borderBottomColor = 'var(--border)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    });
  }

  // ── SMOOTH SCROLL ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── TESTIMONIALS SLIDER (mobile) ──
  let currentSlide = 0;
  const slides = document.querySelectorAll('.testimonial-card');
  if (slides.length && window.innerWidth < 768) {
    // auto-reveal
  }

  // ── FORM SUBMIT ──
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (btn) {
        const original = btn.textContent;
        btn.textContent = '✅ Sent!';
        btn.disabled = true;
        setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 3000);
      }
    });
  });

  // ── PASSWORD TOGGLE ──
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
      else { input.type = 'password'; btn.textContent = '👁'; }
    });
  });

  // ── TAB SYSTEM ──
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('[data-tabs]');
      if (!group) return;
      const target = btn.dataset.tab;

      // Remove .active from all buttons and plan groups (tab panes)
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.plan-group, .tab-pane').forEach(p => p.classList.remove('active'));

      // Add .active to clicked button
      btn.classList.add('active');

      // Add .active to target plan group
      const pane = group.querySelector(`[data-tab-pane="${target}"]`);
      if (pane) pane.classList.add('active');
    });
  });

  // ── FAQ ACCORDION ──
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items (Exclusive)
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBody = other.querySelector('.faq-body');
        if (otherBody) otherBody.style.maxHeight = null;
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        const body = item.querySelector('.faq-body');
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // ── BOOKING DATE DEFAULT ──
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(d => { if (!d.value) d.min = today; });

  // ── HERO PARALLAX ──
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `translateY(${y * 0.3}px)`;
    });
  }

  // ── DASHBOARD SIDEBAR TOGGLE ──
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }

  // ── DASHBOARD NAV ACTIVE ──
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function(e) {
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      const target = this.dataset.panel;
      document.querySelectorAll('.dashboard-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(target);
      if (panel) { e.preventDefault(); panel.classList.add('active'); }
    });
  });

  // ── SIMPLE CHART (Canvas-based score chart) ──
  const chartCanvas = document.getElementById('score-chart');
  if (chartCanvas) {
    drawLineChart(chartCanvas, [82, 79, 76, 74, 72, 71, 69, 68], ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug']);
  }
  const accCanvas = document.getElementById('accuracy-chart');
  if (accCanvas) {
    drawDonutChart(accCanvas, 78);
  }

  function drawLineChart(canvas, data, labels) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth || 600;
    const H = canvas.height = canvas.offsetHeight || 220;
    const pad = { top:20, right:20, bottom:40, left:40 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const min = Math.min(...data) - 5;
    const max = Math.max(...data) + 5;
    const range = max - min;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? 'rgba(148,163,184,0.8)' : 'rgba(100,116,139,0.8)';
    const gridColor = isDark ? 'rgba(51,65,85,0.6)' : 'rgba(226,232,240,0.8)';

    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = gridColor; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (chartH / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + chartW, y); ctx.stroke();
      ctx.fillStyle = textColor; ctx.font = '11px Inter'; ctx.textAlign = 'right';
      ctx.fillText(Math.round(max - (range / 4) * i), pad.left - 8, y + 4);
    }

    // Labels
    ctx.fillStyle = textColor; ctx.font = '11px Inter'; ctx.textAlign = 'center';
    data.forEach((_, i) => {
      const x = pad.left + (chartW / (data.length - 1)) * i;
      ctx.fillText(labels[i], x, H - 8);
    });

    // Gradient fill
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0, 'rgba(22,163,74,0.25)');
    grad.addColorStop(1, 'rgba(22,163,74,0)');
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = pad.left + (chartW / (data.length - 1)) * i;
      const y = pad.top + chartH - ((v - min) / range) * chartH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    const lastX = pad.left + chartW;
    const firstX = pad.left;
    ctx.lineTo(lastX, pad.top + chartH); ctx.lineTo(firstX, pad.top + chartH);
    ctx.closePath(); ctx.fillStyle = grad; ctx.fill();

    // Line
    ctx.beginPath(); ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
    data.forEach((v, i) => {
      const x = pad.left + (chartW / (data.length - 1)) * i;
      const y = pad.top + chartH - ((v - min) / range) * chartH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dots
    data.forEach((v, i) => {
      const x = pad.left + (chartW / (data.length - 1)) * i;
      const y = pad.top + chartH - ((v - min) / range) * chartH;
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#16A34A'; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    });
  }

  function drawDonutChart(canvas, percent) {
    const size = Math.min(canvas.offsetWidth, canvas.offsetHeight) || 160;
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    const cx = size / 2, cy = size / 2, r = size * 0.38, lineW = size * 0.12;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bgColor = isDark ? 'rgba(51,65,85,0.4)' : 'rgba(226,232,240,0.5)';

    ctx.clearRect(0, 0, size, size);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = bgColor; ctx.lineWidth = lineW; ctx.stroke();

    const start = -Math.PI / 2;
    const end = start + (percent / 100) * Math.PI * 2;
    const grad = ctx.createLinearGradient(0, 0, size, 0);
    grad.addColorStop(0, '#16A34A'); grad.addColorStop(1, '#22C55E');
    ctx.beginPath(); ctx.arc(cx, cy, r, start, end);
    ctx.strokeStyle = grad; ctx.lineWidth = lineW; ctx.lineCap = 'round'; ctx.stroke();

    ctx.fillStyle = isDark ? '#F1F5F9' : '#0F172A';
    ctx.font = `bold ${size * 0.18}px Outfit, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(percent + '%', cx, cy);
  }
  
  // ── BACK TO TOP ──
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
