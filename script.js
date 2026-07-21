/* HyperCode Survival — interactions */
(function () {
  // Year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Theme toggle
  var toggle = document.querySelector('[data-theme-toggle]');
  var root = document.documentElement;
  var sunSVG =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  var moonSVG =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = prefersDark ? 'dark' : 'dark'; // default dark for gaming feel
  root.setAttribute('data-theme', theme);
  if (toggle) {
    toggle.innerHTML = theme === 'dark' ? sunSVG : moonSVG;
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Zum hellen Modus wechseln' : 'Zum dunklen Modus wechseln');
    toggle.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      toggle.innerHTML = theme === 'dark' ? sunSVG : moonSVG;
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Zum hellen Modus wechseln' : 'Zum dunklen Modus wechseln');
    });
  }

  // Header scroll state
  var header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > 12) header.classList.add('header--scrolled');
    else header.classList.remove('header--scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Copy IP
  var copyBtn = document.getElementById('copyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var text = copyBtn.getAttribute('data-copy');
      var done = function () {
        showToast('Adresse kopiert!');
        var label = copyBtn.querySelector('.copy-label');
        var orig = label ? label.textContent : null;
        if (label) label.textContent = 'Kopiert!';
        copyBtn.style.background = 'var(--color-primary-active)';
        setTimeout(function () {
          if (label && orig) label.textContent = orig;
          copyBtn.style.background = '';
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
      function fallbackCopy() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  }

  // Toast helper
  function showToast(msg) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>' +
      msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.remove(); }, 300);
    }, 1800);
  }

  // FAQ Accordion
  var faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var expanded = trigger.getAttribute('aria-expanded') === 'true';
      var contentId = trigger.getAttribute('aria-controls');
      var content = document.getElementById(contentId);

      // Close all other items
      faqTriggers.forEach(function (otherTrigger) {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          var otherContentId = otherTrigger.getAttribute('aria-controls');
          var otherContent = document.getElementById(otherContentId);
          if (otherContent) {
            otherContent.setAttribute('aria-hidden', 'true');
          }
        }
      });

      // Toggle current item
      trigger.setAttribute('aria-expanded', !expanded ? 'true' : 'false');
      if (content) {
        content.setAttribute('aria-hidden', !expanded ? 'false' : 'true');
      }
    });
  });

  // Reveal on scroll
  var reveals = document.querySelectorAll('.feature-card, .rule, .connect-card, .connect-note, .rules__footer, .faq-item');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'none';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1)';
      io.observe(el);
    });
  }
})();
