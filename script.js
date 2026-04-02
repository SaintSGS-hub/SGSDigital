// script.js
// Integra AOS, GSAP e Lenis para uma experiência premium, com fallback para prefers-reduced-motion

document.addEventListener('DOMContentLoaded', () => {
  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize AOS (will animate elements on scroll)
  AOS.init({
    duration: 700,
    easing: 'cubic-bezier(.2,.9,.3,1)',
    once: true,
    offset: 80,
    disable: prefersReduced // disable if reduced motion
  });

  // Initialize Lenis (smooth scroll) unless reduced-motion
  let lenis = null;
  if (!prefersReduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.05,
      easing: t => Math.pow(t, 0.9),
      smooth: true,
      direction: 'vertical'
    });

    // Throttle AOS.refresh to avoid perf issues
    let lastAOSRefresh = 0;
    function raf(time) {
      lenis.raf(time);
      // refresh AOS max every 200ms while scrolling to keep animations aligned
      if (time - lastAOSRefresh > 200) {
        AOS.refresh();
        lastAOSRefresh = time;
      }
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // GSAP animations for hero and CTAs (discrete & elegant)
  if (!prefersReduced && typeof gsap !== 'undefined') {
    try {
      gsap.defaults({ease: 'power3.out'});
      const tl = gsap.timeline();

      // hero entrance sequence (staggered)
      tl.from('.hero-copy h1', { y: 28, opacity: 0, duration: 0.9 })
        .from('.hero-copy .lead', { y: 18, opacity: 0, duration: 0.8 }, '-=0.5')
        .from('.hero-ctas .btn', { scale: 0.96, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.45')
        .from('.device-mockup', { y: 18, opacity: 0, scale: 0.985, duration: 0.9 }, '-=0.65');

      // subtle perpetual microinteraction for the sticky CTA (gentle bob)
      gsap.to('.sticky-cta', {
        y: -6,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        opacity: 1,
        delay: 1.2
      });
    } catch (err) {
      // fail silently if GSAP not present
      console.warn('GSAP init error', err);
    }
  }

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.getAttribute('aria-open') === 'true';
      nav.setAttribute('aria-open', (!isOpen).toString());
      navToggle.setAttribute('aria-expanded', (!isOpen).toString());
    });

    // close mobile nav when a link is clicked (better UX)
    nav.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        if (nav.getAttribute('aria-open') === 'true') {
          nav.setAttribute('aria-open', 'false');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Model preview modal
  const modal = document.getElementById('model-modal');
  const modalTitle = document.getElementById('model-modal-title');
  const modalDesc = document.getElementById('model-modal-desc');
  const modalCloseBtns = Array.from(document.querySelectorAll('.modal-close'));
  const previewBtns = Array.from(document.querySelectorAll('.preview-btn'));

  previewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.model-card');
      const title = card?.dataset?.title || 'Modelo';
      const desc = card?.dataset?.desc || '';
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // small entrance using GSAP when available
      if (!prefersReduced && typeof gsap !== 'undefined') {
        gsap.fromTo('.modal-panel', {scale:0.98, opacity:0}, {scale:1, opacity:1, duration:0.32, ease:'power2.out'});
      }
    });
  });

  modalCloseBtns.forEach(b => b.addEventListener('click', closeModal));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  // Contact form - fake submit with success microcopy (replace with real API)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submit = contactForm.querySelector('button[type="submit"]');
      submit.disabled = true;
      submit.textContent = 'Enviando...';

      // Fake delay to simulate API
      setTimeout(()=>{
        submit.textContent = 'Enviado ✓';
        contactForm.reset();
        // animate success lightly
        if (!prefersReduced && typeof gsap !== 'undefined') {
          gsap.fromTo(submit, {scale:0.98, boxShadow:'0 6px 20px rgba(212,175,55,0.06)'}, {scale:1, duration:0.35, ease:'elastic.out(1, 0.6)'});
        }
        setTimeout(()=> {
          submit.disabled = false;
          submit.textContent = 'Enviar pedido';
        }, 1600);
      }, 1000);
    });
  }

  // Smooth anchor scrolling: use Lenis if available, fallback to native smooth
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        // compute offset to account for sticky header height
        const header = document.querySelector('.site-header');
        const headerH = header ? header.offsetHeight : 0;
        const targetY = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
        lenis.scrollTo(targetY, {offset: 0, immediate: false});
      } else {
        target.scrollIntoView({behavior:'smooth', block:'start'});
        // compensate a bit for the sticky header
        window.scrollBy(0, -12);
      }
    });
  });

  // Smooth hide/show header on scroll (subtle)
  (function headerScroll() {
    let last = window.scrollY;
    const header = document.querySelector('.site-header');
    if (!header) return;
    window.addEventListener('scroll', () => {
      const cur = window.scrollY;
      if (cur > 80 && cur > last) {
        header.style.transform = 'translateY(-10px)';
        header.style.opacity = '0.98';
      } else {
        header.style.transform = 'translateY(0)';
        header.style.opacity = '1';
      }
      last = cur;
    }, {passive:true});
  })();

  // Performance note: don't refresh AOS too often; it's throttled above.
});
