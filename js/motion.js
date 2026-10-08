/* Chọn Mua Review — motion system V4 (Editorial Cinematic).
   Chỉ transform/opacity. Tôn trọng prefers-reduced-motion. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* 1. Reveal theo cuộn */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -36px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* 2. Parallax nhẹ (data-plx = tốc độ, data-plx-base = transform nền) */
  var plx = document.querySelectorAll("[data-plx]");
  if (!reduced && plx.length) {
    var ticking = false;
    var BASE = {};
    plx.forEach(function (el, i) {
      BASE[i] = el.getAttribute("data-plx-base") || "";
      el.dataset.plxIdx = i;
    });
    var SP = {};
    plx.forEach(function (el) { SP[el.dataset.plxIdx] = parseFloat(el.getAttribute("data-plx")) || 0.1; });
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      plx.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var off = (r.top + r.height / 2 - vh / 2) * SP[el.dataset.plxIdx];
        el.style.transform = (BASE[el.dataset.plxIdx] ? BASE[el.dataset.plxIdx] + " " : "") +
          "translate3d(0," + off.toFixed(1) + "px,0)";
      });
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* 3. Card "biết nhìn lại": nghiêng 3D + quầng sáng theo chuột */
  if (!reduced && fineHover) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      var raf = null;
      card.addEventListener("pointermove", function (ev) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var r = card.getBoundingClientRect();
          var px = (ev.clientX - r.left) / r.width;
          var py = (ev.clientY - r.top) / r.height;
          card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
          card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
          var rx = ((0.5 - py) * 9).toFixed(2);
          var ry = ((px - 0.5) * 9).toFixed(2);
          card.style.transform =
            "perspective(950px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-3px)";
        });
      });
      card.addEventListener("pointerleave", function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        card.style.transform = "";
      });
    });
  }
})();

window.__motionOK = true;