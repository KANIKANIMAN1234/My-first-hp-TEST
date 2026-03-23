(function () {
  "use strict";

  /* ============================================================
     1. HAMBURGER NAV
     ============================================================ */
  var nav    = document.getElementById("global-nav");
  var toggle = document.querySelector(".nav-toggle");

  function setNavOpen(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setNavOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
  }

  if (nav) {
    nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 47.99rem)").matches) setNavOpen(false);
      });
    });
  }

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 48rem)").matches) setNavOpen(false);
  });

  /* ============================================================
     2. STICKY HEADER SHADOW
     ============================================================ */
  var header = document.getElementById("site-header");

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* ============================================================
     3. SMOOTH SCROLL OFFSET (sticky header)
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href").slice(1);
      if (!targetId) return;
      var target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      var headerH = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ============================================================
     4. COUNT-UP ANIMATION (hero stats)
     ============================================================ */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    var duration = 1400;
    var start    = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // Ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  var statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".hero__stat-num[data-count]").forEach(function (el) {
    statsObserver.observe(el);
  });

  /* ============================================================
     5. SCROLL-IN ANIMATIONS
     ============================================================ */
  // Add data-animate attribute to key elements
  var animateTargets = [
    ".section__header",
    ".value-card",
    ".service-item",
    ".profile-layout__main",
    ".profile-layout__aside",
    ".cta__eyebrow",
    ".cta__title",
    ".cta__text",
    ".cta__actions"
  ];

  animateTargets.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.setAttribute("data-animate", "");
      // Stagger sibling cards / items
      if (el.matches(".value-card, .service-item")) {
        el.setAttribute("data-animate-delay", String(i % 3 + 1));
      }
    });
  });

  var animObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          animObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll("[data-animate]").forEach(function (el) {
    animObserver.observe(el);
  });

  /* ============================================================
     6. ACTIVE NAV HIGHLIGHT (scroll spy)
     ============================================================ */
  var sections = Array.from(document.querySelectorAll("section[id]"));
  var navLinks  = Array.from(document.querySelectorAll(".global-nav__link"));

  function setActiveNav() {
    var scrollY = window.scrollY + (header ? header.offsetHeight + 32 : 80);
    var current = "";

    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });

    navLinks.forEach(function (link) {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === "#" + current
      );
    });
  }

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

})();
