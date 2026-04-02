// Interações: mobile nav toggle, model preview modal, contact form (fake), year update
document.addEventListener('DOMContentLoaded', function(){
  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile nav
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');
  navToggle.addEventListener('click', () => {
    const isOpen = nav.getAttribute('aria-open') === 'true';
    nav.setAttribute('aria-open', (!isOpen).toString());
    navToggle.setAttribute('aria-expanded', (!isOpen).toString());
  });

  // Model preview modal
  const modal = document.getElementById('model-modal');
  const modalTitle = document.getElementById('model-modal-title');
  const modalDesc = document.getElementById('model-modal-desc');
  const modalCloseBtns = Array.from(document.querySelectorAll('.modal-close'));
  const previewBtns = Array.from(document.querySelectorAll('.preview-btn'));

  previewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.model-card');
      const title = card.dataset.title || 'Modelo';
      const desc = card.dataset.desc || '';
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modal.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
    });
  });

  modalCloseBtns.forEach(b => b.addEventListener('click', closeModal));
  modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
  });

  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  // Contact form - fake submit with success microcopy
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submit = contactForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Enviando...';

    // Fake delay to simulate API
    setTimeout(()=>{
      submit.textContent = 'Enviado ✓';
      contactForm.reset();
      setTimeout(()=> {
        submit.disabled = false;
        submit.textContent = 'Enviar pedido';
      }, 1800);
    }, 1400);
  });

  // Smooth scroll for anchor links (modern support)
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const targetId = this.getAttribute('href');
      if(targetId.length > 1){
        e.preventDefault();
        const el = document.querySelector(targetId);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Optional: hide sticky CTA on top
  const sticky = document.querySelector('.sticky-cta');
  let lastScroll = window.scrollY;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 120 && current > lastScroll) {
      // scrolling down
      sticky.style.transform = 'translateY(10px)';
      sticky.style.opacity = '0.95';
    } else {
      sticky.style.transform = 'translateY(0)';
      sticky.style.opacity = '1';
    }
    lastScroll = current;
  }, {passive:true});
});
