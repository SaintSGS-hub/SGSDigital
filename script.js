// script.js - comportamento: menu mobile, formulários (mock), testimonials carousel, toast

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  // Simple toast
  const toast = document.getElementById('toast');
  function showToast(msg = 'Enviado com sucesso!') {
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    toast.style.pointerEvents = 'auto';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.pointerEvents = 'none';
    }, 3200);
  }

  // Handle forms (mock submit)
  function handleFormSubmission(form, successMessage) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      const old = btn.textContent;
      btn.textContent = 'Enviando...';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = old;
        form.reset();
        showToast(successMessage || 'Mensagem enviada. Obrigado!');
      }, 1000 + Math.random() * 700);
    });
  }

  const leadForm = document.getElementById('leadForm');
  const contactForm = document.getElementById('contactForm');
  if (leadForm) handleFormSubmission(leadForm, 'Orçamento solicitado! Aguardamos seu contato.');
  if (contactForm) handleFormSubmission(contactForm, 'Mensagem recebida! Respondemos em até 24h.');

  // Testimonials carousel (simple)
  (function initTestimonials() {
    const wrap = document.getElementById('testimonials');
    if (!wrap) return;
    const list = wrap.querySelectorAll('.testi-item');
    const prevBtn = wrap.querySelector('.prev');
    const nextBtn = wrap.querySelector('.next');
    let idx = 0;
    const total = list.length;
    function setActive(i) {
      list.forEach((li, k) => {
        li.classList.toggle('active', k === i);
      });
    }
    function next() { idx = (idx + 1) % total; setActive(idx); }
    function prev() { idx = (idx - 1 + total) % total; setActive(idx); }

    let timer = setInterval(next, 6000);
    wrap.addEventListener('mouseenter', () => clearInterval(timer));
    wrap.addEventListener('mouseleave', () => timer = setInterval(next, 6000));
    nextBtn.addEventListener('click', () => { next(); });
    prevBtn.addEventListener('click', () => { prev(); });

    // init
    setActive(0);
  })();

  // Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
      // close nav on mobile
      if (mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
      }
    });
  });

});
