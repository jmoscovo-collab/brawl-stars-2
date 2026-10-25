/* === CAPAS DOS JOGOS (home) ===
   Cada jogo ganha uma "foto" desenhada: cenário + personagem principal pulando inclinado + coisinhas do jogo.
   A capa ocupa o card inteiro. Jogo novo: adicione uma linha em CAPAS  →  pasta: [cenário, principal, enfeites].
   Cenários: ceu noite mar espaco cidade deserto grama arena cozinha palco caverna roxo pista praia.
   Pra usar um desenho pronto (svg/jpg) em vez do gerado: coloque em FOTOS. */
(function () {
  var FOTOS = { voador: '/fotos/voador.svg?v=2' };
  var CAPAS = {
    cogucoins: ['palco', '🍄', '⭐💰🎁'], comunidade: ['ceu', '🏗️', '🧱🎮🍄'], brawl: ['arena', '🤖', '💥⭐🍄'],
    capivara: ['grama', '§', '🐾🌳⭐'], clicker: ['roxo', '🍄', '👆✨⭐'], corrida: ['pista', '🏎️', '🏁💨🏆'],
    space: ['cidade', '🚗', '🚦💨🏙️'], labirinto: ['noite', '👻', '🕯️🦇🕸️'], zombie: ['noite', '🧟', '🔦🎃🧠'],
    parkour: ['ceu', '🍄', '🧱⭐☁️'], fps: ['cidade', '🔫', '💥🎯🧱'], ninja: ['noite', '🍄', '⭐🍄🌙'],
    prisao: ['cidade', '🏃', '🚔⛓️🔦'], demo3d: ['espaco', '✨', '💎🌈⭐'], capyio: ['grama', '🐍', '🍎§⭐'],
    dino: ['deserto', '🦖', '🌋🦴🌵'], furacao: ['ceu', '🌪️', '🏠🚗🌳'], desenha: ['palco', '🎨', '✏️🖌️❓'],
    estaciona: ['cidade', '🚗', '🅿️🚙🚧'], quiz: ['roxo', '❓', '💡✅❌'], minijogos: ['roxo', '🎲', '🎯🎮⭐'],
    emojiquiz: ['roxo', '😂', '🤔😎❓'], pais: ['mar', '🌍', '🗺️🚩✈️'], golf: ['grama', '⛳', '🏌️⚪🏆'],
    boliche: ['arena', '🎳', '🍄🎯⭐'], aviao: ['ceu', '✈️', '☁️🏁⭐'], sorte: ['palco', '🎰', '🍀⭐💎'],
    ladrao: ['cidade', '🚓', '🦹💰🚨'], laser: ['espaco', '🏃', '🔴⚡🔴'], piso: ['roxo', '🟦', '🟥🟩🍄'],
    chuva: ['ceu', '🍄', '🍄🧺🍄'], chuva2: ['noite', '⛈️', '🍄⚡🧺'], cogumelo: ['ceu', '🍄', '🧺🍄⭐'],
    luta: ['arena', '§', '🥊💥⭐'], parkour2d: ['ceu', '🍄', '🧱⭐☁️'], pescaria: ['mar', '🎣', '🐟🐠🐡'],
    caindo: ['ceu', '§', '§☁️⭐'], caboguerra: ['grama', '💪', '💪§🍄'], salsicha: ['cozinha', '🌭', '🍔🍕🍟'],
    meteoros: ['espaco', '☄️', '🌍💥⭐'], capivara2: ['noite', '👤', '§🌙🕯️'], 'capivara-pet': ['grama', '§', '❤️🍉🛁'],
    barbeiro: ['palco', '💈', '✂️💇✂️'], pescaria2: ['mar', '🎣', '🦈🐙🐠'], penaltis: ['grama', '⚽', '🥅🧤🏆'],
    figurinhas: ['palco', '🏆', '⚽🃏⭐'], cavando: ['caverna', '⛏️', '💎⭐⭐'], cozinha: ['cozinha', '§', '🍳🍰🍕'],
    merge: ['roxo', '🍄', '✨🍄🍄'], spcity: ['cidade', '🌆', '🚕🏢🚇'], cidade: ['cidade', '§', '🏠🚗🌳'],
    capydash: ['ceu', '⚡', '§💨⭐'], tesouro: ['mar', '🏴‍☠️', '💰🗺️🏝️'], tubarao: ['mar', '🦈', '🐟🐠🏊'],
    portas: ['roxo', '🚪', '❓🗝️✨'], piano: ['palco', '🎹', '🎵🎶✨'], 'pai-recur': ['espaco', '⏳', '🕰️✨🌀'],
    sugestoes: ['roxo', '💌', '✉️💡❤️'], kart: ['pista', '🏎️', '🍄🍌🏁'], piratas: ['mar', '⛵', '💣🏴‍☠️🌊'],
    bolas: ['arena', '⚔️', '🔴🔵💥'], capibalao: ['ceu', '🎈', '§☁️🐦'], armas: ['cidade', '🔫', '🍄💥🎯'],
    invasao: ['espaco', '👾', '🚀💥⭐'], ovos: ['caverna', '🥚', '🐉🔥💎'], arena2: ['arena', '🥊', '🍄💥🏆'],
    arqueiro: ['grama', '🏹', '🎯🍎🍄'], polvo: ['mar', '🐙', '💧🐟🦀'], cogurock: ['palco', '🎸', '🎤🎵🍄'],
    torre: ['grama', '🏰', '🏹👹⚔️'], chefoes: ['noite', '🐉', '🍄🔥⚔️'], volei: ['praia', '🏐', '🍄🌴☀️'],
    blocos: ['espaco', '🧱', '⚪💥⭐'], lab: ['roxo', '🧪', '⚗️💥🧬'], trem: ['grama', '🚂', '🛤️🙋🌳'],
    pinta: ['palco', '🎨', '🟥🟦🟩']
  };
  var CEN = { // [céu em cima, céu embaixo, chão, enfeite]
    ceu: ['#3aa0ff', '#bfe6ff', '#4cc44c', 'nuvens'], noite: ['#0b0420', '#3a1a5a', '#1e1530', 'lua'],
    mar: ['#2a8cff', '#9adcff', '#0a5aa8', 'ondas'], espaco: ['#05010f', '#1a0a3a', null, 'estrelas'],
    cidade: ['#ff9a5a', '#ffd08a', '#3a3a48', 'predios'], deserto: ['#ffb84a', '#ffe0a0', '#e0a050', 'sol'],
    grama: ['#5ab8ff', '#d6f0ff', '#3fae3f', 'nuvens'], arena: ['#2a0a4a', '#8a2aff', '#3a2a5a', 'holofote'],
    cozinha: ['#ffe3b0', '#fff4dc', '#c8874a', 'azulejo'], palco: ['#4a0a2a', '#ff3a8a', '#2a1020', 'holofote'],
    caverna: ['#1a1410', '#4a3a2a', '#2a2018', 'cristais'], roxo: ['#4a1aa8', '#ff6ad0', null, 'bolhas'],
    pista: ['#5ab8ff', '#d6f0ff', '#444', 'pista'], praia: ['#3aa0ff', '#ffe9a8', '#ffd98a', 'sol']
  };
  var FONTE = '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rnd(seed) { return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
  // separa a string em emojis (sem quebrar os que são feitos de vários pedaços, tipo 🏴‍☠️)
  function separa(s) {
    try { if (window.Intl && Intl.Segmenter) return Array.from(new Intl.Segmenter('pt', { granularity: 'grapheme' }).segment(s), function (x) { return x.segment; }); } catch (e) {}
    return Array.from(s.replace(/‍/g, '')).filter(function (c) { return c !== '️'; });
  }

  var W = 480, H = 320;
  // capivara desenhada (o emoji 🦫 não existe em todo aparelho) — § na tabela = capivara
  function capivara(g, t) {
    var k = t / 100; g.save(); g.scale(k, k);
    g.fillStyle = '#8a5a2e'; g.strokeStyle = '#3a2210'; g.lineWidth = 4;
    [-28, 22].forEach(function (x) { g.fillRect(x, 18, 12, 26); g.strokeRect(x, 18, 12, 26); });
    g.beginPath(); g.ellipse(-6, 4, 50, 30, 0, 0, 7); g.fill(); g.stroke();
    g.fillStyle = '#9a6a3a'; g.beginPath(); g.ellipse(38, -18, 26, 20, -0.2, 0, 7); g.fill(); g.stroke();
    g.fillStyle = '#6a4020'; g.beginPath(); g.ellipse(56, -14, 11, 12, 0, 0, 7); g.fill(); g.stroke();
    g.beginPath(); g.ellipse(26, -38, 7, 6, 0, 0, 7); g.fill(); g.stroke();
    g.fillStyle = '#111'; g.beginPath(); g.arc(40, -24, 4.5, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(41.5, -25.5, 1.6, 0, 7); g.fill();
    g.fillStyle = '#2a1a0a'; g.beginPath(); g.arc(60, -18, 2.4, 0, 7); g.fill();
    g.restore();
  }
  function poe(g, e, tam) { if (e === '§') capivara(g, tam); else { g.fillStyle = '#000'; g.font = tam + 'px ' + FONTE; g.fillText(e, 0, 0); } }
  function desenha(g, pasta, cfg) {
    var cen = CEN[cfg[0]] || CEN.ceu, R = rnd(hash(pasta)), chao = H * 0.78, i, j;
    var ceu = g.createLinearGradient(0, 0, 0, H); ceu.addColorStop(0, cen[0]); ceu.addColorStop(1, cen[1]);
    g.fillStyle = ceu; g.fillRect(0, 0, W, H);
    switch (cen[3]) {
      case 'nuvens': g.fillStyle = 'rgba(255,255,255,.9)';
        for (i = 0; i < 3; i++) { var nx = R() * W, ny = 30 + R() * 70; g.beginPath(); g.ellipse(nx, ny, 40, 14, 0, 0, 7); g.ellipse(nx + 24, ny - 8, 26, 14, 0, 0, 7); g.fill(); }
        break;
      case 'lua': g.fillStyle = '#fff6c8'; g.beginPath(); g.arc(W * 0.82, 60, 30, 0, 7); g.fill();
        g.fillStyle = 'rgba(255,255,255,.8)'; for (i = 0; i < 40; i++) g.fillRect(R() * W, R() * chao * 0.8, 2, 2);
        break;
      case 'estrelas': for (i = 0; i < 90; i++) { g.fillStyle = 'rgba(255,255,255,' + (0.4 + R() * 0.6) + ')'; var s = R() < 0.1 ? 3 : 1.6; g.fillRect(R() * W, R() * H, s, s); }
        g.fillStyle = 'rgba(180,90,255,.35)'; g.beginPath(); g.arc(W * 0.15, H * 0.8, 60, 0, 7); g.fill();
        break;
      case 'predios': for (i = 0; i < 9; i++) { var bw = 40 + R() * 30, bh = 60 + R() * 110, bx = i * 56 - 10;
          g.fillStyle = 'rgba(60,40,80,' + (0.55 + R() * 0.3) + ')'; g.fillRect(bx, chao - bh, bw, bh);
          g.fillStyle = 'rgba(255,230,120,.8)'; for (j = 0; j < 6; j++) if (R() < 0.5) g.fillRect(bx + 6 + (j % 2) * 18, chao - bh + 10 + Math.floor(j / 2) * 22, 8, 10); }
        break;
      case 'sol': g.fillStyle = '#fff0a0'; g.beginPath(); g.arc(W * 0.82, 55, 34, 0, 7); g.fill(); break;
      case 'holofote': for (i = 0; i < 3; i++) { g.fillStyle = 'rgba(255,255,255,.10)'; g.beginPath(); var hx = W * (0.2 + i * 0.3); g.moveTo(hx, 0); g.lineTo(hx - 90, chao); g.lineTo(hx + 90, chao); g.fill(); } break;
      case 'azulejo': g.strokeStyle = 'rgba(200,150,90,.35)'; g.lineWidth = 2;
        for (i = 0; i < W; i += 40) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, chao); g.stroke(); }
        for (i = 0; i < chao; i += 40) { g.beginPath(); g.moveTo(0, i); g.lineTo(W, i); g.stroke(); }
        break;
      case 'cristais': for (i = 0; i < 7; i++) { g.fillStyle = ['#6af0ff', '#ff6ad0', '#ffd23a'][i % 3]; var cx = R() * W, cy = R() * chao; g.beginPath(); g.moveTo(cx, cy - 14); g.lineTo(cx + 8, cy); g.lineTo(cx, cy + 14); g.lineTo(cx - 8, cy); g.fill(); } break;
      case 'bolhas': for (i = 0; i < 14; i++) { g.fillStyle = 'rgba(255,255,255,' + (0.08 + R() * 0.15) + ')'; g.beginPath(); g.arc(R() * W, R() * H, 10 + R() * 40, 0, 7); g.fill(); } break;
    }
    if (cen[2]) {
      g.fillStyle = cen[2];
      if (cen[3] === 'ondas') {
        g.beginPath(); g.moveTo(0, chao); for (i = 0; i <= W; i += 20) g.lineTo(i, chao + Math.sin(i / 25) * 6); g.lineTo(W, H); g.lineTo(0, H); g.fill();
        g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 3; g.beginPath(); for (i = 0; i <= W; i += 20) g.lineTo(i, chao + Math.sin(i / 25) * 6); g.stroke();
      } else {
        g.beginPath(); g.moveTo(0, chao + 6); g.quadraticCurveTo(W * 0.3, chao - 12, W * 0.55, chao + 2); g.quadraticCurveTo(W * 0.8, chao + 12, W, chao - 4); g.lineTo(W, H); g.lineTo(0, H); g.fill();
      }
      if (cen[3] === 'pista') { g.strokeStyle = '#fff'; g.lineWidth = 5; g.setLineDash([26, 18]); g.beginPath(); g.moveTo(0, chao + 36); g.lineTo(W, chao + 30); g.stroke(); g.setLineDash([]); }
    }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    // enfeites em volta
    var en = separa(cfg[2] || ''), pos = [[0.15, 0.62, 62], [0.86, 0.3, 54], [0.84, 0.74, 66], [0.18, 0.2, 44]];
    for (i = 0; i < en.length && i < pos.length; i++) {
      g.save(); g.translate(W * pos[i][0], H * pos[i][1]); g.rotate((R() - 0.5) * 0.7);
      g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 8; poe(g, en[i], pos[i][2]); g.restore();
    }
    // linhas de velocidade + sombra + personagem principal pulando inclinado
    var px = W * 0.52, py = H * 0.44, lado = R() < 0.5 ? -1 : 1, ang = lado * (0.35 + R() * 0.45);
    g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 5; g.lineCap = 'round';
    for (i = -1; i <= 1; i++) { var ox = px - lado * 95, oy = py + 55 + i * 26; g.beginPath(); g.moveTo(ox, oy); g.lineTo(ox - lado * 50, oy + 28); g.stroke(); }
    g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(px, chao + 8, 70, 12, 0, 0, 7); g.fill();
    g.save(); g.translate(px, py); g.rotate(ang);
    g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 18; g.shadowOffsetY = 8;
    poe(g, separa(cfg[1])[0] || cfg[1], 170); g.restore();
  }

  // gera as capas só quando o card chega perto da tela (1 canvas só, vira imagem)
  var tela = document.createElement('canvas'); tela.width = W; tela.height = H;
  var g = tela.getContext('2d');
  function geraCapa(card, pasta) {
    var img = card.querySelector('img.capa');
    if (FOTOS[pasta]) { img.src = FOTOS[pasta]; return; }
    try {
      desenha(g, pasta, CAPAS[pasta]);
      if (tela.toBlob) tela.toBlob(function (b) { if (b) img.src = URL.createObjectURL(b); }, 'image/jpeg', 0.85);
      else img.src = tela.toDataURL('image/jpeg', 0.85);
    } catch (e) {}
  }
  window.cgCapas = function () {
    var cards = [];
    document.querySelectorAll('.game-card').forEach(function (c) {
      var m = (c.getAttribute('href') || '').match(/^\/([a-z0-9-]+)\/$/);
      if (!m || !(CAPAS[m[1]] || FOTOS[m[1]])) return;
      var img = document.createElement('img'); img.className = 'capa'; img.alt = '';
      var sombra = document.createElement('div'); sombra.className = 'capa-sombra';
      c.insertBefore(sombra, c.firstChild); c.insertBefore(img, c.firstChild);
      c.classList.add('com-capa');
      c.dataset.capa = m[1];
      cards.push(c);
    });
    if (!('IntersectionObserver' in window)) { cards.forEach(function (c) { geraCapa(c, c.dataset.capa); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (!e.isIntersecting) return; io.unobserve(e.target); geraCapa(e.target, e.target.dataset.capa); });
    }, { rootMargin: '400px' });
    cards.forEach(function (c) { io.observe(c); });
  };
})();
