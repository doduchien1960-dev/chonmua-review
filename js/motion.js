/* Chọn Mua Review — motion system V4b.
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

  /* 2. Số liệu đếm lên */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    if (reduced) { el.textContent = target; return; }
    var dur = 1100, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  });

  /* 3. Parallax cuộn + hero parallax chuột + quầng sáng chuột (event-driven, không loop vô hạn) */
  var plx = Array.prototype.slice.call(document.querySelectorAll("[data-plx]"));
  var hero = document.querySelector(".hero-cine");
  var heroBg = document.querySelector(".hero-cine-bg");

  function plxTransform(el) {
    var r = el.getBoundingClientRect(), vh = window.innerHeight;
    var sp = parseFloat(el.getAttribute("data-plx")) || 0.1;
    var off = (r.top + r.height / 2 - vh / 2) * sp;
    var base = el.getAttribute("data-plx-base") || "";
    return (base ? base + " " : "") + "translate3d(0," + off.toFixed(1) + "px,0)";
  }
  var plxTick = false;
  function updatePlx() {
    plxTick = false;
    if (reduced) return;
    var vh = window.innerHeight;
    plx.forEach(function (el) {
      if (el === heroBg) { applyHero(); return; }
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      el.style.transform = plxTransform(el);
    });
  }
  function queuePlx() {
    if (!plxTick) { plxTick = true; requestAnimationFrame(updatePlx); }
  }
  if (!reduced && plx.length) {
    window.addEventListener("scroll", queuePlx, { passive: true });
    window.addEventListener("resize", queuePlx);
    updatePlx();
  }

  /* Hero parallax theo chuột (làm mượt, tự dừng khi đứng yên) */
  var mTX = 0, mTY = 0, mCX = 0, mCY = 0, mouseRaf = null;
  function applyHero() {
    if (!heroBg || reduced) return;
    var t = plxTransform(heroBg);
    heroBg.style.transform = t + " translate3d(" + mCX.toFixed(1) + "px," + mCY.toFixed(1) + "px,0)";
  }
  function mouseStep() {
    mouseRaf = null;
    mCX += (mTX - mCX) * 0.14;
    mCY += (mTY - mCY) * 0.14;
    applyHero();
    if (Math.abs(mTX - mCX) > 0.05 || Math.abs(mTY - mCY) > 0.05)
      mouseRaf = requestAnimationFrame(mouseStep);
  }
  function queueMouse() {
    if (!mouseRaf) mouseRaf = requestAnimationFrame(mouseStep);
  }

  /* Quầng sáng đi theo chuột — "web biết nhìn lại" */
  var aura = null, aX = 0, aY = 0, aCX = 0, aCY = 0, auraRaf = null, auraInit = false;
  function auraStep() {
    auraRaf = null;
    aCX += (aX - aCX) * 0.16;
    aCY += (aY - aCY) * 0.16;
    aura.style.transform = "translate3d(" + aCX.toFixed(1) + "px," + aCY.toFixed(1) + "px,0)";
    if (Math.abs(aX - aCX) > 0.5 || Math.abs(aY - aCY) > 0.5)
      auraRaf = requestAnimationFrame(auraStep);
  }
  if (!reduced && fineHover) {
    aura = document.createElement("div");
    aura.className = "cursor-aura";
    aura.setAttribute("aria-hidden", "true");
    document.body.appendChild(aura);
    window.addEventListener("pointermove", function (ev) {
      aX = ev.clientX; aY = ev.clientY;
      if (!auraInit) {
        auraInit = true; aCX = aX; aCY = aY;
        aura.style.transform = "translate3d(" + aX + "px," + aY + "px,0)";
      }
      if (aura.style.opacity !== "1") aura.style.opacity = "1";
      if (!auraRaf) auraRaf = requestAnimationFrame(auraStep);
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", function () {
      if (aura) aura.style.opacity = "0";
    });
    if (hero && heroBg) {
      hero.addEventListener("pointermove", function (ev) {
        var r = hero.getBoundingClientRect();
        mTX = ((ev.clientX - r.left) / r.width - 0.5) * 30;
        mTY = ((ev.clientY - r.top) / r.height - 0.5) * 22;
        queueMouse();
      });
      hero.addEventListener("pointerleave", function () { mTX = 0; mTY = 0; queueMouse(); });
    }
  }

  /* 4. Card "biết nhìn lại": nghiêng 3D + quầng sáng theo chuột */
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

  window.__motionOK = true;
})();
