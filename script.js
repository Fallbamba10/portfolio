/* ═══════════════════════════════════════════════════════
   CURSOR PERSONNALISÉ
═══════════════════════════════════════════════════════ */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

/* ═══════════════════════════════════════════════════════
   PARTICLES CANVAS
═══════════════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  const COUNT = 70;
  const CONNECT_DIST = 130;
  const particles = [];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124,58,237,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT_DIST) {
          const alpha = (1 - d / CONNECT_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(loop);
  }
  loop();

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
})();

/* ═══════════════════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════════════════ */
(function () {
  const el = document.getElementById('typewriter');
  const words = [
    'expériences',
    'applications',
    'interfaces',
    'solutions SaaS',
    'produits web',
  ];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
      }
    }
    setTimeout(type, deleting ? 55 : 100);
  }
  setTimeout(type, 800);
})();

/* ═══════════════════════════════════════════════════════
   NAVBAR SCROLL
═══════════════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ═══════════════════════════════════════════════════════
   BURGER / MOBILE MENU
═══════════════════════════════════════════════════════ */
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ═══════════════════════════════════════════════════════
   REVEAL ON SCROLL
═══════════════════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal-up');

const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // cascade delay per card in a grid
      const siblings = entry.target.parentElement.querySelectorAll('.reveal-up');
      let delay = 0;
      siblings.forEach((sib, idx) => { if (sib === entry.target) delay = idx * 80; });
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ═══════════════════════════════════════════════════════
   ACTIVE NAV LINK ON SCROLL
═══════════════════════════════════════════════════════ */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.style.color = 'var(--text)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ═══════════════════════════════════════════════════════
   CONTACT FORM (Formspree)
═══════════════════════════════════════════════════════ */
const form      = document.getElementById('contactForm');
const btnText   = document.getElementById('btnText');
const submitBtn = document.getElementById('submitBtn');
const successEl = document.getElementById('formSuccess');
const errorEl   = document.getElementById('formError');

form.addEventListener('submit', async e => {
  e.preventDefault();
  successEl.classList.remove('show');
  errorEl.classList.remove('show');
  btnText.textContent = 'Envoi en cours…';
  submitBtn.disabled = true;

  try {
    const res = await fetch('https://formspree.io/f/maqzvbal', {
      method:  'POST',
      headers: { 'Accept': 'application/json' },
      body:    new FormData(form),
    });
    if (res.ok) {
      successEl.classList.add('show');
      form.reset();
    } else {
      errorEl.classList.add('show');
    }
  } catch {
    errorEl.classList.add('show');
  } finally {
    btnText.textContent = 'Envoyer le message';
    submitBtn.disabled = false;
  }
});

/* ═══════════════════════════════════════════════════════
   FOOTER YEAR
═══════════════════════════════════════════════════════ */
document.getElementById('footerYear').textContent = new Date().getFullYear();

/* ═══════════════════════════════════════════════════════
   HERO CARD 3D TILT (mouse parallax)
═══════════════════════════════════════════════════════ */
const heroCard = document.querySelector('.hero-card');
if (heroCard) {
  document.addEventListener('mousemove', e => {
    const rect = heroCard.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const rx = ((e.clientY - cy) / window.innerHeight) * 12;
    const ry = ((e.clientX - cx) / window.innerWidth)  * -12;
    heroCard.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
}

/* ═══════════════════════════════════════════════════════
   SMOOTH HOVER ON NAV
═══════════════════════════════════════════════════════ */
document.querySelectorAll('a, button').forEach(el => {
  el.style.cursor = 'none';
});
