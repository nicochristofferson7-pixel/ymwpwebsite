// Shared behaviour: mobile menu, disclosure state, scroll-in text.
// ── HAMBURGER MENU ──────────────────────────
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('nav-mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu when a link is tapped
document.querySelectorAll('.nav-mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Disclosure buttons report open/closed. Their inline onclick runs first,
// so by the time this listener fires the "open" class is already updated.
document.querySelectorAll('.faq-question, .announcement-toggle, button.tournament-header').forEach(btn => {
  const item = btn.closest('.faq-item, .announcement-item, .tournament-item');
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', () => {
    btn.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
  });
});
function syncMenuState() {
  const open = mobileMenu.classList.contains('open');
  hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
hamburger.addEventListener('click', syncMenuState);
document.querySelectorAll('.nav-mobile-link').forEach(l => l.addEventListener('click', syncMenuState));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    hamburger.click();
    hamburger.focus();
  }
});

// ── SCROLL-IN TEXT ─────────────────────────────────────────
// Text fades up once as it scrolls into view. Skipped entirely for
// visitors who prefer reduced motion, and content is fully visible
// if JavaScript or IntersectionObserver is unavailable.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  var targets = [
    '.announcements-title', '.schedule-title', '.full-section-heading', '.alumni-heading', '.recruit-heading',
    '.section-label:not(.view-toggle)', '.full-section-tag',
    '.about-text p', '.full-section-body', '.alumni-body', '.recruit-body',
    '.stat-item', '.contact-grid > div', '.faq-item', '.announcement-item',
    '.season-label-row', '.tournament-item', '.roster-row',
    '.recruit-fieldset', '.recruit-foot', '.alumni-form', '.cta-btn'
  ].join(',');
  var els = Array.prototype.slice.call(document.querySelectorAll(targets));
  els.forEach(function (el) { el.classList.add('reveal'); });
  var io = new IntersectionObserver(function (entries) {
    var shown = entries.filter(function (e) { return e.isIntersecting; }).sort(function (a, b) {
      return a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left;
    });
    shown.forEach(function (entry, i) {
      var el = entry.target;
      var delay = Math.min(i, 6) * 70;
      el.style.setProperty('--reveal-delay', delay + 'ms');
      requestAnimationFrame(function () { el.classList.add('is-visible'); });
      io.unobserve(el);
      // Hand the element back to its normal styles once it has settled.
      setTimeout(function () {
        el.classList.remove('reveal', 'is-visible');
        el.style.removeProperty('--reveal-delay');
      }, delay + 1000);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -6% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

