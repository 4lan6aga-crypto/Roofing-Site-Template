/* =====================================================
   EZ ROOFING – JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ---- Year in footer ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Mobile nav toggle ----
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close nav when a link is clicked
    mainNav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink () {
    let current = '';
    sections.forEach(function (section) {
      const top = section.offsetTop - 90;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ---- Slideshow engine ----
  function initSlideshow (slideshowEl, btnPrev, btnNext, dotsContainer) {
    if (!slideshowEl) return;

    const slides = Array.from(slideshowEl.querySelectorAll('.slide'));
    if (slides.length === 0) return;

    let current = 0;
    let timer = null;

    function goTo (index) {
      slides[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dotsContainer) {
        Array.from(dotsContainer.querySelectorAll('.dot')).forEach(function (dot, i) {
          dot.classList.toggle('active', i === current);
        });
      }
    }

    function next () { goTo(current + 1); }
    function prev () { goTo(current - 1); }

    // Auto-advance every 5 seconds
    function startAuto () {
      timer = setInterval(next, 5000);
    }

    function resetAuto () {
      clearInterval(timer);
      startAuto();
    }

    if (btnNext) {
      btnNext.addEventListener('click', function () { next(); resetAuto(); });
    }
    if (btnPrev) {
      btnPrev.addEventListener('click', function () { prev(); resetAuto(); });
    }

    // Build dots
    if (dotsContainer) {
      slides.forEach(function (_, i) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); resetAuto(); });
        dotsContainer.appendChild(dot);
      });
    }

    startAuto();
  }

  // ---- Hero slideshow ----
  (function () {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const slideshowEl = hero.querySelector('.slideshow');
    const btnPrev = hero.querySelector('.slide-btn.prev');
    const btnNext = hero.querySelector('.slide-btn.next');
    const dotsContainer = hero.querySelector('.slide-dots');
    initSlideshow(slideshowEl, btnPrev, btnNext, dotsContainer);
  })();

  // ---- Gallery slideshows ----
  document.querySelectorAll('.gallery-block').forEach(function (block) {
    const slideshowEl = block.querySelector('.slideshow');
    const btnPrev = block.querySelector('.slide-btn.prev');
    const btnNext = block.querySelector('.slide-btn.next');
    initSlideshow(slideshowEl, btnPrev, btnNext, null);
  });

  // ---- Contact form (client-side demo) ----
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (form && formStatus) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = form.name.value.trim();
      const phone = form.phone.value.trim();

      if (!name || !phone) {
        formStatus.textContent = 'Please provide your name and phone number.';
        formStatus.className = 'form-note error';
        return;
      }

      // Simulate submission
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      setTimeout(function () {
        form.reset();
        btn.disabled = false;
        btn.textContent = 'Send Message';
        formStatus.textContent = 'Thank you! We\'ll be in touch soon.';
        formStatus.className = 'form-note';
      }, 1000);
    });
  }

  // ---- Smooth scroll polyfill for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
