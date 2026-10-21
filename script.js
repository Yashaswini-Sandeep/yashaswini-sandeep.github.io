// Portfolio behaviour: theme toggle, active nav link, scroll reveal, chart animation.
// Everything degrades gracefully: without JS the page is fully visible.
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  // ---- Theme toggle (remembered per browser; works without storage) ----
  var toggle = document.getElementById('themeToggle');
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) { /* storage blocked: ignore */ }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      if (!current) {
        current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
    });
  }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  // ---- Scroll reveal ----
  var revealTargets = document.querySelectorAll(
    '.snap, .ledger, .rubric, .flow li, .case-text, .chart-card, .chevrons, .road-text, .leave, .spec, .hub-card, .timeline > li, .card, .layer, .bg-item, .contact-inner'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if (hasIO && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  // ---- Bar chart animation ----
  var bars = document.querySelector('.bars');
  if (bars) {
    if (hasIO && !reduce) {
      var bio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { bars.classList.add('in'); bio.disconnect(); }
        });
      }, { threshold: 0.4 });
      bio.observe(bars);
    } else {
      bars.classList.add('in');
    }
  }

  // ---- Active nav link ----
  var links = Array.prototype.slice.call(document.querySelectorAll('.links a'));
  var map = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });

  function updateActive() {
    var pos = window.scrollY + window.innerHeight * 0.3;
    var activeIndex = -1;
    map.forEach(function (section, i) {
      if (section && section.offsetTop <= pos) activeIndex = i;
    });
    links.forEach(function (a, i) { a.classList.toggle('active', i === activeIndex); });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('load', updateActive);
})();
