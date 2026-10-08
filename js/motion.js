/* Chọn Mua Review — motion tối giản (news style).
   Chỉ giữ: reveal nhẹ, ngày tiếng Việt, thanh tiến trình đọc.
   Tôn trọng prefers-reduced-motion. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Ngày tiếng Việt trên thanh topbar */
  var todayEl = document.getElementById("today-line");
  if (todayEl) {
    try {
      var days = ["Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"];
      var now = new Date();
      todayEl.textContent = days[now.getDay()] + ", ngày " + now.getDate() +
        " tháng " + (now.getMonth() + 1) + " năm " + now.getFullYear();
    } catch (e) { /* giữ chữ mặc định */ }
  }

  /* 2. Reveal nhẹ khi cuộn */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* 3. Thanh tiến trình đọc (chỉ trang bài viết) */
  var bar = document.querySelector(".progress");
  if (bar) {
    var tick = false;
    function update() {
      tick = false;
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", function () {
      if (!tick) { tick = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  window.__motionOK = true;
})();
