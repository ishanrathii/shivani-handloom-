/* ============================================================
   SHIVANI HANDLOOM — PRODUCTION JAVASCRIPT
   ============================================================ */

'use strict';

/* ---------- CINEMATIC INTRO ---------- */
(function initIntro() {
  var intro = document.getElementById('intro');
  if (!intro) return;

  // Auto-dismiss intro after 2800ms (faster = no blocking)
  var dismissTimeout = setTimeout(function () {
    dismissIntro();
  }, 2800);

  function dismissIntro() {
    intro.style.opacity = '0';
    intro.style.pointerEvents = 'none';
    intro.style.userSelect = 'none';
    document.body.classList.add('intro-done');
    // Remove from DOM fully after fade
    setTimeout(function () {
      intro.style.display = 'none';
      intro.setAttribute('aria-hidden', 'true');
      intro.setAttribute('inert', '');
    }, 850);
  }

  // Allow clicking intro to skip
  intro.addEventListener('click', function () {
    clearTimeout(dismissTimeout);
    dismissIntro();
  });
})();

/* ---------- NAVBAR SCROLL BEHAVIOR ---------- */
(function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  var lastScrollY = window.scrollY;
  var ticking = false;

  function updateNavbar() {
    var scrollY = window.scrollY;

    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // Initialize on load
  updateNavbar();
})();

/* ---------- MOBILE MENU ---------- */
(function initMobileMenu() {
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileClose = document.getElementById('mobileClose');
  var mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMenu);
  }

  // Close on nav link click
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
})();

/* ---------- HERO PARALLAX ---------- */
(function initHeroParallax() {
  var heroContent = document.getElementById('heroContent');
  if (!heroContent) return;

  // Respect reduced motion preference
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var ticking = false;

  function applyParallax() {
    var scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroContent.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }, { passive: true });
})();

/* ---------- SCROLL REVEAL (IntersectionObserver) ---------- */
(function initScrollReveal() {
  var sections = document.querySelectorAll('.reveal-section');
  if (!sections.length) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    sections.forEach(function (section) {
      section.classList.add('revealed');
    });
    return;
  }

  if (!('IntersectionObserver' in window)) {
    sections.forEach(function (section) {
      section.classList.add('revealed');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();

/* ---------- FAQ ACCORDION ---------- */
(function initFAQ() {
  var faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Close all other items
      faqItems.forEach(function (otherItem) {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
          var otherAnswer = otherItem.querySelector('.faq-answer');
          var otherQuestion = otherItem.querySelector('.faq-question');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
          if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0';
        question.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ---------- INQUIRY FORM — WHATSAPP REDIRECT ---------- */
(function initInquiryForm() {
  var form = document.getElementById('inquiryForm');
  if (!form) return;

  var wa_number = '919849149566';

  function setError(id, msg) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
    var input = document.getElementById(id.replace('err-', 'inq-'));
    if (input) input.classList.toggle('input-error', !!msg);
  }

  function clearErrors() {
    ['err-name', 'err-phone', 'err-email', 'err-category'].forEach(function (id) { setError(id, ''); });
  }

  function showToast(msg) {
    var toast = document.getElementById('wa-success-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(function () { toast.classList.remove('visible'); }, 4000);
  }

  // Clear individual field error on input
  ['inq-name', 'inq-phone', 'inq-email', 'inq-category'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function () { setError('err-' + id.replace('inq-', ''), ''); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    var name     = (document.getElementById('inq-name')     && document.getElementById('inq-name').value.trim())     || '';
    var phone    = (document.getElementById('inq-phone')    && document.getElementById('inq-phone').value.trim())    || '';
    var email    = (document.getElementById('inq-email')    && document.getElementById('inq-email').value.trim())    || '';
    var category = (document.getElementById('inq-category') && document.getElementById('inq-category').value)        || '';
    var qty      = (document.getElementById('inq-qty')      && document.getElementById('inq-qty').value.trim())      || '';
    var msg      = (document.getElementById('inq-msg')      && document.getElementById('inq-msg').value.trim())      || '';

    var valid = true;
    if (!name)     { setError('err-name',     'Please enter your full name.');        valid = false; }
    if (!phone)    { setError('err-phone',    'Please enter your phone number.');     valid = false; }
    if (!category) { setError('err-category', 'Please select a product category.');  valid = false; }
    if (!valid) return;

    var text = [
      'Hello Shivani Handloom,',
      'I am interested in your products.',
      '',
      'Name: ' + name,
      'Phone: ' + phone,
      'Email: ' + (email || 'Not provided'),
      'Product Category: ' + category,
      'Quantity Requirement: ' + (qty || 'Not specified'),
      'Message: ' + (msg || 'No additional message')
    ].join('\n');

    var waUrl = 'https://wa.me/' + wa_number + '?text=' + encodeURIComponent(text);
    var a = document.createElement('a');
    a.href = waUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast('Opening WhatsApp... we\'ll respond shortly!');
    setTimeout(function () { form.reset(); clearErrors(); }, 600);
  });
})();

/* ---------- SMOOTH ANCHOR SCROLL (fallback) ---------- */
(function initSmoothScroll() {
  // CSS scroll-behavior: smooth handles most cases
  // This JS fallback handles offset for fixed header
  var navHeight = 80;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href === '#') return;
      // NEVER intercept external links, WhatsApp, Instagram, tel, mailto
      if (href.indexOf('http') === 0 || href.indexOf('wa.me') >= 0 ||
          href.indexOf('tel:') === 0 || href.indexOf('mailto:') === 0 ||
          href.indexOf('instagram') >= 0 || href.indexOf('indiamart') >= 0) return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      var targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
})();

/* ---------- COLLECTION CARD HOVER ENHANCEMENT ---------- */
(function initCardHover() {
  var cards = document.querySelectorAll('.collection-card');
  cards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      this.style.willChange = 'transform';
    });
    card.addEventListener('mouseleave', function () {
      this.style.willChange = 'auto';
    });
  });
})();

/* ---------- MARQUEE PAUSE ON HOVER ---------- */
(function initMarquee() {
  var marqueeContent = document.querySelector('.marquee-content');
  if (!marqueeContent) return;

  // Duplicate content to ensure seamless loop
  var originalText = marqueeContent.textContent;
  marqueeContent.textContent = originalText + originalText;

  var strip = document.querySelector('.marquee-strip');
  if (strip) {
    strip.addEventListener('mouseenter', function () {
      marqueeContent.style.animationPlayState = 'paused';
    });
    strip.addEventListener('mouseleave', function () {
      marqueeContent.style.animationPlayState = 'running';
    });
  }
})();

/* ---------- GRACEFUL ERROR BOUNDARY ---------- */
window.addEventListener('error', function (e) {
  // Silent graceful degradation — don't crash the page
  if (typeof console !== 'undefined' && console.error) {
    console.error('Shivani Handloom script error:', e.message);
  }
});
