// Theme toggle (persist)
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') root.classList.add('light');
themeToggle.textContent = root.classList.contains('light') ? '🌞' : '🌙';

themeToggle.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  themeToggle.textContent = root.classList.contains('light') ? '🌞' : '🌙';
});

// Mobile nav
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navList.classList.toggle('show');
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// IntersectionObserver for reveal + skill bars + counters
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');

      // animate skill bars
      entry.target.querySelectorAll('.bar').forEach(bar => {
        const level = bar.getAttribute('data-level');
        bar.style.setProperty('--level', level + '%');
        bar.style.setProperty('--levelInt', level);
        bar.style.setProperty('--anim', '1'); // marker
        bar.style.setProperty('position', 'relative');
        bar.style.setProperty('overflow', 'hidden');
        bar.style.setProperty('height', '10px');
        bar.style.setProperty('borderRadius', '999px');
        bar.style.setProperty('--grad', 'linear-gradient(90deg, #38bdf8, #22d3ee, #34d399)');
        bar.style.setProperty('background', 'rgba(255,255,255,0.06)');
        bar.style.setProperty('transition', 'none');
        bar.style.setProperty('--w', level + '%');
        bar.style.setProperty('isolation', 'isolate');

        // grow pseudo via inline child
        if (!bar.querySelector('.fill')) {
          const fill = document.createElement('span');
          fill.className = 'fill';
          fill.style.position = 'absolute';
          fill.style.inset = '0';
          fill.style.width = '0%';
          fill.style.background = 'var(--grad)';
          fill.style.borderRadius = '999px';
          fill.style.transition = 'width 1.2s ease';
          bar.appendChild(fill);
          requestAnimationFrame(() => { fill.style.width = level + '%'; });
        }
      });

      // animate counters
      entry.target.querySelectorAll('.count').forEach(el => animateCount(el));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

revealEls.forEach(el => observer.observe(el));

function animateCount(el) {
  const target = parseInt(el.getAttribute('data-target') || '0', 10);
  let current = 0;
  const step = Math.max(1, Math.floor(target / 60));
  const tick = () => {
    current += step;
    if (current >= target) {
      current = target;
      el.textContent = target;
    } else {
      el.textContent = current;
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);
}

// Tilt effect
document.querySelectorAll('.tilt').forEach(card => {
  const strength = 10;
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left; // 0..w
    const y = e.clientY - r.top;  // 0..h
    const rx = ((y / r.height) - 0.5) * -strength;
    const ry = ((x / r.width) - 0.5) * strength;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)';
  });
});

// Back to top
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) toTop.classList.add('show');
  else toTop.classList.remove('show');
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Contact form (no backend; validates and "pretends" to send)
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  if (!data.name || !data.email || !data.message) {
    statusEl.textContent = 'Please fill all fields.';
    return;
  }
  // Simple email pattern
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    statusEl.textContent = 'Please enter a valid email.';
    return;
  }
  statusEl.textContent = 'Thanks! Your message has been queued. I will reach out soon.';
  form.reset();
});

// Close mobile nav when clicking a link (small UX nicety)
document.querySelectorAll('.nav-list a').forEach(a => {
  a.addEventListener('click', () => {
    navList.classList.remove('show');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});
