/* Chọn Mua Review — 3D scroll hero (Three.js).
   Chỉ chạy trên desktop có WebGL và không giảm chuyển động.
   Mobile / không WebGL / lỗi mạng → giữ nguyên hero ảnh (fallback). */
(function () {
  "use strict";
  var heroPin = document.querySelector(".hero-pin");
  var hero = document.querySelector(".hero-cine");
  var canvas = document.getElementById("webgl-hero");
  if (!heroPin || !hero || !canvas) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduced || !fineHover) return;

  var gl = null;
  try { gl = canvas.getContext("webgl2") || canvas.getContext("webgl"); } catch (e) { /* no webgl */ }
  if (!gl) return;

  import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js")
    .then(function (THREE) { init(THREE); })
    .catch(function () { /* giữ hero ảnh */ });

  function init(THREE) {
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    } catch (e) { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0f0c, 0.045);
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 60);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    var dir = new THREE.DirectionalLight(0xffffff, 1.15);
    dir.position.set(4, 6, 6);
    scene.add(dir);
    var pGreen = new THREE.PointLight(0x2f9e68, 26, 22);
    pGreen.position.set(-4, -1, 3);
    scene.add(pGreen);
    var pGold = new THREE.PointLight(0xd9a400, 16, 20);
    pGold.position.set(4, 2, 2);
    scene.add(pGold);

    var palette = [0x0d6b45, 0xb45309, 0xe9f3ec, 0x1d2b23, 0x2f9e68];
    var geos = [
      new THREE.IcosahedronGeometry(0.55, 0),
      new THREE.TorusGeometry(0.42, 0.16, 18, 42),
      new THREE.BoxGeometry(0.75, 0.75, 0.75),
      new THREE.OctahedronGeometry(0.55, 0),
      new THREE.TorusKnotGeometry(0.3, 0.1, 80, 12)
    ];
    var group = new THREE.Group();
    scene.add(group);
    var shapes = [];
    function rnd(a, b) { return a + Math.random() * (b - a); }
    for (var i = 0; i < 16; i++) {
      var mat = new THREE.MeshStandardMaterial({
        color: palette[i % palette.length],
        metalness: 0.35,
        roughness: 0.42
      });
      var m = new THREE.Mesh(geos[i % geos.length], mat);
      m.position.set(rnd(-5.5, 5.5), rnd(-2.6, 2.6), rnd(-2.5, 1.5));
      m.rotation.set(rnd(0, 6.28), rnd(0, 6.28), 0);
      var s = rnd(0.6, 1.5);
      m.scale.set(s, s, s);
      m.userData = { rx: rnd(-0.4, 0.4), ry: rnd(-0.5, 0.5), ph: rnd(0, 6.28), amp: rnd(0.15, 0.5) };
      group.add(m);
      shapes.push(m);
    }

    var pCount = 260;
    var pos = new Float32Array(pCount * 3);
    for (var j = 0; j < pCount; j++) {
      pos[j * 3] = rnd(-7, 7);
      pos[j * 3 + 1] = rnd(-3.5, 3.5);
      pos[j * 3 + 2] = rnd(-3, 2);
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    var points = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0x9fe0bd, size: 0.035, transparent: true, opacity: 0.7
    }));
    scene.add(points);

    hero.classList.add("webgl-on");
    window.__webglHero = true;

    var tX = 0, tY = 0, mX = 0, mY = 0;
    hero.addEventListener("pointermove", function (ev) {
      var r = hero.getBoundingClientRect();
      tX = (ev.clientX - r.left) / r.width - 0.5;
      tY = (ev.clientY - r.top) / r.height - 0.5;
    });
    hero.addEventListener("pointerleave", function () { tX = 0; tY = 0; });

    function progress() {
      var total = heroPin.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      var y = -heroPin.getBoundingClientRect().top;
      return Math.min(Math.max(y / total, 0), 1);
    }
    function resize() {
      var w = hero.clientWidth, h = hero.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    var visible = true, raf = 0;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible) loop();
      }).observe(heroPin);
    }

    var clock = new THREE.Clock();
    function loop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (!visible || document.hidden) return;
      raf = requestAnimationFrame(loop);
      var dt = Math.min(clock.getDelta(), 0.05);
      var t = clock.elapsedTime;
      var p = progress();
      mX += (tX - mX) * 0.06;
      mY += (tY - mY) * 0.06;
      for (var i = 0; i < shapes.length; i++) {
        var m = shapes[i], u = m.userData;
        m.rotation.x += u.rx * dt * (1 + p * 2.2);
        m.rotation.y += u.ry * dt * (1 + p * 2.2);
        m.position.y += Math.sin(t * 0.7 + u.ph) * u.amp * dt;
      }
      var attr = points.geometry.attributes.position;
      for (var k = 0; k < pCount; k++) {
        var y = attr.getY(k) + dt * 0.12;
        attr.setY(k, y > 3.5 ? -3.5 : y);
      }
      attr.needsUpdate = true;
      /* camera bay qua scene theo cuộn — linh hồn web 3D scroll */
      camera.position.set(mX * 1.4, mY * 0.9 + p * 1.5, 9 - p * 4.2);
      camera.lookAt(mX * 0.6, 0, 0);
      group.rotation.y = p * 0.9 + mX * 0.25;
      renderer.render(scene, camera);
    }
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && visible) loop();
    });
    loop();
  }
})();
