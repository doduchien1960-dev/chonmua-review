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
  var heroPin = document.querySelector(".hero-pin");
  var heroInner = document.querySelector(".hero-cine-inner");
  function heroProgress() {
    if (!heroPin || reduced) return 0;
    var total = heroPin.offsetHeight - window.innerHeight;
    if (total <= 0) return 0;
    var y = -heroPin.getBoundingClientRect().top;
    return Math.min(Math.max(y / total, 0), 1);
  }
  function applyHero() {
    if (!heroBg || reduced) return;
    var p = heroProgress();
    var t = plxTransform(heroBg);
    var sc = (1.16 - 0.16 * p).toFixed(3);
    heroBg.style.transform = "scale(" + sc + ") " + t +
      " translate3d(" + mCX.toFixed(1) + "px," + mCY.toFixed(1) + "px,0)";
    if (heroInner) {
      heroInner.style.transform = "translate3d(0," + (p * 150).toFixed(1) + "px,0)";
      heroInner.style.opacity = (1 - p * 0.9).toFixed(3);
    }
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

  /* Phase A2: sticky product stage — panel theo dõi sản phẩm đang đọc */
  (function () {
    var prods = Array.prototype.slice.call(document.querySelectorAll(".product"));
    if (!prods.length) return;
    var info = prods.map(function (p) {
      var rank = ((p.querySelector(".rank") || {}).textContent || "").trim();
      var h3 = ((p.querySelector("h3") || {}).textContent || "").replace(/^\d+\.\s*/, "").trim();
      return { rank: rank, name: h3 };
    });
    var stage = document.createElement("div");
    stage.className = "stage";
    stage.setAttribute("aria-hidden", "true");
    stage.innerHTML = '<span class="stage-rank"></span><span class="stage-name"></span><span class="stage-count"></span>';
    document.body.appendChild(stage);
    var rEl = stage.querySelector(".stage-rank"),
        nEl = stage.querySelector(".stage-name"),
        cEl = stage.querySelector(".stage-count");
    var cur = -1;
    function setStage(i) {
      if (i === cur) return;
      cur = i;
      if (i < 0) { stage.classList.remove("on"); return; }
      rEl.textContent = info[i].rank;
      nEl.textContent = info[i].name;
      cEl.textContent = (i + 1) + "/" + prods.length;
      stage.classList.add("on");
    }
    if ("IntersectionObserver" in window && !reduced) {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) setStage(prods.indexOf(e.target));
        });
      }, { rootMargin: "-38% 0px -52% 0px", threshold: 0 });
      prods.forEach(function (p) { io2.observe(p); });
    } else if (reduced) {
      /* reduced motion: không hiện panel */
    }
  })();

  /* Phase B1: magnetic CTA — nút hút nhẹ về chuột (desktop) */
  if (!reduced && fineHover) {
    document.querySelectorAll(".btn-cta").forEach(function (btn) {
      var raf = null, tx = 0, ty = 0;
      btn.addEventListener("pointermove", function (ev) {
        var r = btn.getBoundingClientRect();
        var dx = ev.clientX - (r.left + r.width / 2);
        var dy = ev.clientY - (r.top + r.height / 2);
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 70) { tx = 0; ty = 0; }
        else { tx = (dx / 70 * 9).toFixed(1); ty = (dy / 70 * 9).toFixed(1); }
        if (!raf) raf = requestAnimationFrame(function () {
          raf = null;
          btn.style.transform = (tx == 0 && ty == 0) ? "" : "translate(" + tx + "px," + ty + "px)";
        });
      });
      btn.addEventListener("pointerleave", function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        tx = 0; ty = 0;
        btn.style.transform = "";
      });
    });
    /* Phase B2: aura mạnh hơn trong section tối */
    var auraEl = document.querySelector(".cursor-aura");
    if (auraEl) {
      document.querySelectorAll(".spotlight,.verdict").forEach(function (sec) {
        sec.addEventListener("pointerenter", function () { auraEl.style.opacity = "1"; });
      });
    }
  }

  /* Phase C1: smooth scroll quán tính (desktop, có fallback native) */
  if (!reduced && fineHover) {
    var sc = { target: window.scrollY, current: window.scrollY, raf: null };
    function sStep() {
      sc.raf = null;
      var diff = sc.target - sc.current;
      if (Math.abs(diff) < 0.5) {
        sc.current = sc.target;
        window.scrollTo(0, Math.round(sc.current));
        return;
      }
      sc.current += diff * 0.14;
      window.scrollTo(0, Math.round(sc.current));
      queuePlx();
      sc.raf = requestAnimationFrame(sStep);
    }
    function sStop() {
      if (sc.raf) { cancelAnimationFrame(sc.raf); sc.raf = null; }
      sc.target = window.scrollY; sc.current = window.scrollY;
    }
    window.addEventListener("wheel", function (ev) {
      if (ev.ctrlKey || ev.metaKey) return;
      var t = ev.target;
      if (t && t.closest && t.closest(".table-wrap")) return;
      var d = ev.deltaY * (ev.deltaMode === 1 ? 16 : ev.deltaMode === 2 ? window.innerHeight : 1);
      if (!sc.raf) { sc.target = window.scrollY; sc.current = window.scrollY; }
      sc.target += d;
      ev.preventDefault();
      if (!sc.raf) sc.raf = requestAnimationFrame(sStep);
    }, { passive: false });
    window.addEventListener("keydown", sStop);
    window.addEventListener("touchstart", sStop, { passive: true });
    window.addEventListener("scroll", function () {
      if (!sc.raf) { sc.target = window.scrollY; sc.current = window.scrollY; }
    }, { passive: true });
  }

  window.__motionOK = true;
})();
