/* ============================================================
   SURBASANT CLONE – MAIN JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Set current year in footer ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── 2. Sticky header ── */
  const header   = document.getElementById('site-header');
  const backToTop = document.getElementById('back-to-top');
  const onScroll = () => {
    if (header)    header.classList.toggle('scrolled', window.scrollY > 50);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── 3. Mobile hamburger menu ── */
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('main-nav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mainNav.classList.toggle('open');
    });
    // Close nav when a link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mainNav.classList.remove('open');
      });
    });
  }

  /* ── 4. Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.main-nav a');
  const observer  = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.main-nav a[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));

  /* ── 5. Back to top ── */
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── 6. Product filter tabs ── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('#popular-grid .product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      productCards.forEach(card => {
        const cat = card.dataset.cat;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.4s ease both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ── 7. Stats counter animation ── */
  const statNums = document.querySelectorAll('.stat-num');
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = +el.dataset.target;
        const dur    = 1800;
        const step   = Math.ceil(target / (dur / 16));
        let current  = 0;
        const timer  = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current.toLocaleString();
        }, 16);
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(n => statsObserver.observe(n));

  /* ── 8. Contact form submission (home page) ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('contact-submit');
      const original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        showToast('✅ Message sent successfully! We\'ll be in touch soon.', 'success');
        contactForm.reset();
        btn.textContent = original;
        btn.disabled = false;
      }, 1500);
    });
  }

  /* ── 9. Toast notification ── */
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 90px;
      right: 32px;
      background: ${type === 'success' ? '#75c32c' : '#e74c3c'};
      color: #fff;
      padding: 14px 24px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      z-index: 9999;
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.4s ease;
      max-width: 320px;
      font-family: 'Poppins', sans-serif;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  /* ── 10. Scroll reveal animation (lightweight) ── */
  const revealEls = document.querySelectorAll(
    '.product-card, .blog-card, .testimonial-card, .service-item, .contact-info-item, .stat-item'
  );
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.transitionDelay = `${(i % 4) * 80}ms`;
        el.classList.add('revealed');
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  // Add base styles for reveal
  const style = document.createElement('style');
  style.textContent = `
    .product-card,
    .blog-card,
    .testimonial-card,
    .service-item,
    .contact-info-item,
    .stat-item {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.55s ease, transform 0.55s ease;
    }
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
  revealEls.forEach(el => revealObserver.observe(el));

  /* ── 11. Hero scroll arrow ── */
  document.querySelector('.hero-scroll-indicator')?.addEventListener('click', () => {
    document.querySelector('.features-strip')?.scrollIntoView({ behavior: 'smooth' });
  });

  /* ── 12. Smooth scroll for all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = 72; // header height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
