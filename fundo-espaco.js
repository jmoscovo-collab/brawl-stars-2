/* === COGUMELO GAMES — fundo de espaço da página inicial ===
   Estrelas piscando, planetinhas pequenos andando devagar, estrelas cadentes
   e nuvens coloridas (nebulosas) lá no fundo. Desenha num canvas atrás de
   tudo, a 30fps (20 no celular), e para quando a aba some.
   No modo fundo branco ele se esconde. */
(function () {
  if (window.__cgEspaco) return;
  window.__cgEspaco = true;

  var cel = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  var FPS = cel ? 20 : 30;
  var cv, cx, neb, W = 0, H = 0, dpr = 1;
  var estrelas = [], planetas = [], cadentes = [], ultimo = 0, proxCadente = 0;

  function sorteia(a, b) { return a + Math.random() * (b - a); }

  var CORES = [['#ff8a65', '#bf360c'], ['#81d4fa', '#01579b'], ['#ce93d8', '#4a148c'],
               ['#fff176', '#f57f17'], ['#a5d6a7', '#1b5e20'], ['#f48fb1', '#880e4f'],
               ['#b0bec5', '#37474f']];

  function monta() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);

    estrelas = [];
    var n = Math.min(260, Math.round(W * H / 5000));
    for (var i = 0; i < n; i++) estrelas.push({
      x: Math.random() * W, y: Math.random() * H, r: sorteia(0.4, 1.6),
      f: sorteia(0, 6.28), v: sorteia(0.8, 2.6),
      c: Math.random() < 0.15 ? '#bfe3ff' : (Math.random() < 0.1 ? '#ffe9b0' : '#ffffff')
    });

    planetas = [];
    var np = cel ? 4 : 7;
    for (var p = 0; p < np; p++) {
      var cor = CORES[p % CORES.length];
      planetas.push({
        x: Math.random() * W, y: Math.random() * H, r: sorteia(4, cel ? 11 : 15),
        vx: sorteia(-4, 4), vy: sorteia(-2, 2), c1: cor[0], c2: cor[1],
        anel: Math.random() < 0.4, ang: sorteia(-0.8, 0.8), lua: Math.random() < 0.35, la: sorteia(0, 6.28)
      });
    }

    // nebulosas: desenha uma vez só numa imagem e reaproveita
    neb = document.createElement('canvas');
    neb.width = Math.max(1, Math.round(W / 2)); neb.height = Math.max(1, Math.round(H / 2));
    var nx = neb.getContext('2d');
    var cores = ['rgba(140,60,255,', 'rgba(0,180,255,', 'rgba(255,60,180,', 'rgba(0,255,150,'];
    for (var k = 0; k < 5; k++) {
      var gx = Math.random() * neb.width, gy = Math.random() * neb.height,
          gr = sorteia(0.15, 0.35) * Math.max(neb.width, neb.height);
      var g = nx.createRadialGradient(gx, gy, 0, gx, gy, gr), c = cores[k % cores.length];
      g.addColorStop(0, c + '0.16)'); g.addColorStop(1, c + '0)');
      nx.fillStyle = g; nx.fillRect(0, 0, neb.width, neb.height);
    }
  }

  function planeta(p, t) {
    var r = p.r;
    if (p.anel) {             // metade de trás do anel
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.ang);
      cx.strokeStyle = 'rgba(255,240,200,0.45)'; cx.lineWidth = Math.max(1, r * 0.25);
      cx.beginPath(); cx.ellipse(0, 0, r * 1.9, r * 0.55, 0, Math.PI, Math.PI * 2); cx.stroke();
      cx.restore();
    }
    var g = cx.createRadialGradient(p.x - r * 0.4, p.y - r * 0.4, r * 0.1, p.x, p.y, r);
    g.addColorStop(0, p.c1); g.addColorStop(1, p.c2);
    cx.fillStyle = g;
    cx.beginPath(); cx.arc(p.x, p.y, r, 0, Math.PI * 2); cx.fill();
    if (p.anel) {             // metade da frente
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.ang);
      cx.strokeStyle = 'rgba(255,240,200,0.6)'; cx.lineWidth = Math.max(1, r * 0.25);
      cx.beginPath(); cx.ellipse(0, 0, r * 1.9, r * 0.55, 0, 0, Math.PI); cx.stroke();
      cx.restore();
    }
    if (p.lua) {
      var a = p.la + t * 0.5;
      cx.fillStyle = '#ddd';
      cx.beginPath(); cx.arc(p.x + Math.cos(a) * r * 2.2, p.y + Math.sin(a) * r * 0.9, Math.max(1.2, r * 0.22), 0, Math.PI * 2); cx.fill();
    }
  }

  function quadro(agora) {
    requestAnimationFrame(quadro);
    if (document.hidden || agora - ultimo < 1000 / FPS) return;
    var dt = Math.min(0.1, (agora - ultimo) / 1000); ultimo = agora;
    var t = agora / 1000;
    if (document.documentElement.classList.contains('fundo-branco')) { cv.style.display = 'none'; return; }
    cv.style.display = 'block';

    cx.clearRect(0, 0, W, H);
    cx.drawImage(neb, 0, 0, W, H);

    for (var i = 0; i < estrelas.length; i++) {
      var e = estrelas[i], a = 0.45 + 0.55 * Math.sin(e.f + t * e.v);
      cx.globalAlpha = Math.max(0.1, a);
      cx.fillStyle = e.c;
      cx.fillRect(e.x - e.r / 2, e.y - e.r / 2, e.r, e.r);
      if (e.r > 1.3 && a > 0.85) {          // as maiores brilham em cruz
        cx.fillRect(e.x - e.r * 2, e.y - 0.3, e.r * 4, 0.6);
        cx.fillRect(e.x - 0.3, e.y - e.r * 2, 0.6, e.r * 4);
      }
    }
    cx.globalAlpha = 1;

    for (var p = 0; p < planetas.length; p++) {
      var pl = planetas[p];
      pl.x += pl.vx * dt; pl.y += pl.vy * dt;
      var m = pl.r * 3;
      if (pl.x < -m) pl.x = W + m; if (pl.x > W + m) pl.x = -m;
      if (pl.y < -m) pl.y = H + m; if (pl.y > H + m) pl.y = -m;
      planeta(pl, t);
    }

    if (t > proxCadente) {
      proxCadente = t + sorteia(2.5, 7);
      cadentes.push({ x: sorteia(0, W), y: sorteia(0, H * 0.5), vx: sorteia(350, 600) * (Math.random() < 0.5 ? -1 : 1), vy: sorteia(150, 300), vida: 1 });
    }
    for (var c = cadentes.length - 1; c >= 0; c--) {
      var s = cadentes[c];
      s.x += s.vx * dt; s.y += s.vy * dt; s.vida -= dt * 1.2;
      if (s.vida <= 0) { cadentes.splice(c, 1); continue; }
      var gr = cx.createLinearGradient(s.x, s.y, s.x - s.vx * 0.15, s.y - s.vy * 0.15);
      gr.addColorStop(0, 'rgba(255,255,255,' + s.vida + ')'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      cx.strokeStyle = gr; cx.lineWidth = 2;
      cx.beginPath(); cx.moveTo(s.x, s.y); cx.lineTo(s.x - s.vx * 0.15, s.y - s.vy * 0.15); cx.stroke();
    }
  }

  function inicia() {
    cv = document.createElement('canvas');
    cv.id = 'cg-espaco';
    cv.style.cssText = 'position:fixed; inset:0; width:100vw; height:100vh; z-index:-1; pointer-events:none;';
    document.body.insertBefore(cv, document.body.firstChild);
    cx = cv.getContext('2d');
    monta();
    var to;
    // no celular a barra do navegador some/aparece e muda a altura: só refaz se mudar de verdade
    window.addEventListener('resize', function () {
      if (window.innerWidth === W && Math.abs(window.innerHeight - H) < 160) return;
      clearTimeout(to); to = setTimeout(monta, 200);
    });
    requestAnimationFrame(quadro);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inicia);
  else inicia();
})();
