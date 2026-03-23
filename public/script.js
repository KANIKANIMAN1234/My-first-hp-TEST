(function () {
  "use strict";

  /* ================================================
     NAV TOGGLE
     ================================================ */
  var nav = document.getElementById("global-nav");
  var toggle = document.querySelector(".nav-toggle");

  if (nav && toggle) {
    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
      nav.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 47.99rem)").matches) setOpen(false);
      });
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 48rem)").matches) setOpen(false);
    });
  }

  /* ================================================
     HEADER: スクロール時シャドウ
     ================================================ */
  var header = document.querySelector(".site-header");
  if (header) {
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ================================================
     SCROLL REVEAL (IntersectionObserver)
     ================================================ */
  var revealEls = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -52px 0px" }
    );
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ================================================
     COUNTER ANIMATION
     ================================================ */
  function animateCounter(el, target, duration) {
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      // ease-out cubic
      var ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  var statNums = document.querySelectorAll(".hero__stat-num");
  if ("IntersectionObserver" in window && statNums.length) {
    var counterObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = parseInt(el.getAttribute("data-count") || el.textContent, 10);
            if (!isNaN(target)) {
              el.textContent = "0";
              animateCounter(el, target, 2000);
            }
            counterObs.unobserve(el);
          }
        });
      },
      { threshold: 0.6 }
    );
    statNums.forEach(function (el) {
      var val = parseInt(el.textContent, 10);
      if (!isNaN(val)) {
        el.setAttribute("data-count", val);
        counterObs.observe(el);
      }
    });
  }

  /* ================================================
     FAQ: スムーズアコーディオン
     ================================================ */
  document.querySelectorAll(".faq-item").forEach(function (details) {
    var summary = details.querySelector(".faq-item__q");
    var answer  = details.querySelector(".faq-item__a");
    if (!summary || !answer) return;

    summary.addEventListener("click", function (e) {
      e.preventDefault();
      if (details.open) {
        details.open = false;
      } else {
        details.open = true;
        answer.style.animation = "none";
        // reflow
        void answer.offsetHeight;
        answer.style.animation = "fade-up 0.35s ease";
      }
    });
  });

})();
