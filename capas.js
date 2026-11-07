/* === CAPAS DOS JOGOS (home) ===
   Cada jogo ganha um DESENHO de verdade (nada de emoji): cenário + personagem principal + 3 coisas do jogo.
   Tudo é desenhado aqui com formas (canvas), no estilo desenho animado (contorno escuro).
   Jogo novo: adicione uma linha em CAPAS  →  pasta: [cenário, 'principal', ['coisa1', 'coisa2', 'coisa3']].
   Os nomes são os desenhos de DES (lá embaixo). Cor diferente: 'carro:#ff5a3a'.
   Cenários: ceu noite mar espaco cidade deserto grama arena cozinha palco caverna roxo pista praia neve.
   Pra usar um desenho pronto (svg/jpg) em vez do gerado: coloque em FOTOS. */
(function () {
  var FOTOS = { voador: '/fotos/voador.svg?v=2', 'cogumelo-detetive': '/fotos/cogumelo-detetive.svg?v=1' };
  var CAPAS = {
    cogucoins: ['palco', 'cogu', ['moeda', 'presente', 'estrela']], comunidade: ['ceu', 'controle', ['tijolo', 'lampada', 'cogu']],
    brawl: ['arena', 'robo', ['explosao', 'estrela', 'cogu']], capivara: ['grama', 'capivara', ['moeda', 'arvore', 'estrela']],
    clicker: ['roxo', 'cogu', ['cursor', 'estrela', 'moeda']], corrida: ['pista', 'carro', ['quadriculada', 'trofeu', 'moeda']],
    space: ['cidade', 'carro:#2f7aff', ['semaforo', 'cone', 'moeda']], labirinto: ['noite', 'fantasma', ['chave', 'morcego', 'lanterna']],
    zombie: ['noite', 'zumbi', ['machado', 'lanterna', 'abobora']], parkour: ['ceu', 'cogu', ['tijolo', 'moeda', 'estrela']],
    fps: ['cidade', 'blaster', ['alvo', 'explosao', 'tijolo']], ninja: ['noite', 'coguNinja', ['espada', 'shuriken', 'capivara']],
    prisao: ['cidade', 'capivara', ['chave', 'grade', 'sirene']], demo3d: ['espaco', 'diamante', ['estrela', 'planeta', 'estrela']],
    capyio: ['grama', 'capivara', ['maca', 'estrela', 'moeda']], dino: ['deserto', 'dino', ['cacto', 'vulcao', 'osso']],
    furacao: ['ceu', 'furacao', ['casa', 'carro:#ffcc22', 'arvore']], desenha: ['palco', 'paleta', ['lapis', 'interrogacao', 'pincel']],
    estaciona: ['cidade', 'carro:#ff5a3a', ['placaP', 'cone', 'carro:#3ac46a']], quiz: ['roxo', 'interrogacao', ['lampada', 'certo', 'errado']],
    minijogos: ['roxo', 'dado', ['alvo', 'controle', 'estrela']], emojiquiz: ['roxo', 'carinha', ['interrogacao', 'estrela', 'lampada']],
    pais: ['mar', 'globo', ['bandeira', 'aviao', 'mapa']], golf: ['grama', 'bandeiraGolf', ['taco', 'trofeu', 'bolaGolf']],
    boliche: ['arena', 'pino', ['bolaBoliche', 'pino', 'estrela']], aviao: ['ceu', 'aviao', ['nuvem', 'quadriculada', 'estrela']],
    sorte: ['palco', 'cacaniquel', ['trevo', 'moeda', 'diamante']], ladrao: ['cidade', 'policia', ['saco', 'sirene', 'moeda']],
    laser: ['espaco', 'cogu', ['laser', 'estrela', 'laser']], piso: ['roxo', 'pisos', ['nota', 'cogu', 'estrela']],
    chuva: ['ceu', 'cogu', ['coguVeneno', 'cesta', 'moeda']], chuva2: ['noite', 'cogu', ['raio', 'nuvemChuva', 'coguVeneno']],
    cogumelo: ['ceu', 'cesta', ['cogu', 'coguDourado', 'estrela']], luta: ['arena', 'capivara', ['luva', 'explosao', 'estrela']],
    parkour2d: ['ceu', 'cogu', ['tijolo', 'quadriculada', 'moeda']], pescaria: ['mar', 'peixe:#ffa82a', ['vara', 'peixe:#4ac0ff', 'coroa']],
    caindo: ['ceu', 'capivaraPara', ['nuvem', 'moeda', 'passaro']], caboguerra: ['grama', 'corda', ['capivara', 'cogu', 'estrela']],
    salsicha: ['grama', 'salsichao', ['salsicha', 'osso', 'coracao']], meteoros: ['espaco', 'meteoro', ['planeta', 'explosao', 'estrela']],
    capivara2: ['noite', 'capivara', ['sombra', 'cogu', 'estrela']], 'capivara-pet': ['grama', 'capivara', ['coracao', 'melancia', 'patinho']],
    barbeiro: ['palco', 'tesoura', ['pente', 'posteBarbeiro', 'cogu']], pescaria2: ['mar', 'barco', ['tubarao', 'polvo', 'peixe:#ff6aa0']],
    penaltis: ['grama', 'bolaFutebol', ['gol', 'luva:#3ac46a', 'trofeu']], figurinhas: ['palco', 'figurinha', ['estrela', 'trofeu', 'figurinha:#3a8aff']],
    cavando: ['caverna', 'picareta', ['diamante', 'moeda', 'morcego']], cozinha: ['cozinha', 'hamburguer', ['capivara', 'panela', 'bolo']],
    merge: ['roxo', 'coguDourado', ['cogu', 'estrela', 'cogu:#8a3aff']], spcity: ['cidade', 'taxi', ['predio', 'moeda', 'semaforo']],
    cidade: ['grama', 'casa', ['castelo', 'arvore', 'capivara']], capydash: ['ceu', 'capivara', ['raio', 'moeda', 'estrela']],
    tesouro: ['praia', 'bau', ['mapa', 'moeda', 'palmeira']], tubarao: ['mar', 'tubarao', ['peixe:#ffd23a', 'peixe:#ff6aa0', 'coroa']],
    portas: ['roxo', 'porta', ['chave', 'interrogacao', 'monstro']], piano: ['palco', 'piano', ['nota', 'nota', 'estrela']],
    'pai-recur': ['espaco', 'ampulheta', ['relogio', 'estrela', 'pedra']], sugestoes: ['roxo', 'carta', ['lampada', 'coracao', 'estrela']],
    kart: ['pista', 'kart', ['banana', 'caixa', 'quadriculada']], piratas: ['mar', 'navio', ['bomba', 'bandeiraPirata', 'moeda']],
    bolas: ['arena', 'bolaEspada', ['bolaEspada:#3a8aff', 'explosao', 'estrela']], capibalao: ['ceu', 'balao', ['nuvem', 'passaro', 'estrela']],
    armas: ['cidade', 'blaster', ['alvo', 'explosao', 'cogu']], invasao: ['espaco', 'alien', ['foguete', 'explosao', 'alien:#ff5ad0']],
    ovos: ['caverna', 'ovo', ['dragao', 'fogo', 'diamante']], arena2: ['arena', 'cogu', ['luva', 'explosao', 'trofeu']],
    arqueiro: ['grama', 'arco', ['alvo', 'maca', 'cogu']], polvo: ['mar', 'polvo', ['gota', 'peixe:#ffd23a', 'caranguejo']],
    cogurock: ['palco', 'guitarra', ['microfone', 'nota', 'cogu']], torre: ['grama', 'castelo', ['espada', 'monstro', 'arco']],
    chefoes: ['noite', 'dragao', ['cogu', 'fogo', 'espada']], volei: ['praia', 'bolaVolei', ['cogu', 'palmeira', 'capivara']],
    blocos: ['espaco', 'blocos', ['bolinha', 'explosao', 'estrela']], lab: ['roxo', 'frasco', ['explosao', 'frasco:#ff5ad0', 'estrela']],
    trem: ['grama', 'trem', ['arvore', 'moeda', 'nuvem']], pinta: ['palco', 'pincel', ['paleta', 'estrela', 'cogu']],
    detetive: ['cidade', 'lupa', ['osso', 'interrogacao', 'estrela']], monstro: ['roxo', 'monstro', ['ovo', 'fogo', 'estrela']],
    espacial: ['espaco', 'foguete', ['planeta', 'meteoro', 'alien']], pizzaria: ['cozinha', 'pizza', ['cogu', 'fogo', 'moeda']],
    'cogu-zumbis': ['grama', 'zumbi', ['cogu', 'arvore', 'gota:#3ab8ff']], futebol: ['grama', 'gol', ['bolinha', 'cogu', 'trofeu']],
    esqui: ['neve', 'coguEsqui', ['bonecoNeve', 'floco', 'pinheiro']]
  };
  var CEN = { // [céu em cima, céu embaixo, chão, enfeite]
    ceu: ['#3aa0ff', '#bfe6ff', '#4cc44c', 'nuvens'], noite: ['#0b0420', '#3a1a5a', '#1e1530', 'lua'],
    mar: ['#2a8cff', '#9adcff', '#0a5aa8', 'ondas'], espaco: ['#05010f', '#1a0a3a', null, 'estrelas'],
    cidade: ['#ff9a5a', '#ffd08a', '#3a3a48', 'predios'], deserto: ['#ffb84a', '#ffe0a0', '#e0a050', 'sol'],
    grama: ['#5ab8ff', '#d6f0ff', '#3fae3f', 'nuvens'], arena: ['#2a0a4a', '#8a2aff', '#3a2a5a', 'holofote'],
    cozinha: ['#ffe3b0', '#fff4dc', '#c8874a', 'azulejo'], palco: ['#4a0a2a', '#ff3a8a', '#2a1020', 'holofote'],
    caverna: ['#1a1410', '#4a3a2a', '#2a2018', 'cristais'], roxo: ['#4a1aa8', '#ff6ad0', null, 'bolhas'],
    pista: ['#5ab8ff', '#d6f0ff', '#444', 'pista'], praia: ['#3aa0ff', '#ffe9a8', '#ffd98a', 'sol'],
    neve: ['#5aa8f0', '#e4f2ff', '#f4f8ff', 'montanhas']
  };
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rnd(seed) { return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }

  var W = 480, H = 320;

  // ---------- canetinhas: tudo com contorno escuro, igual desenho animado ----------
  var K = '#1e1a2a';
  function pinta(g, cor) { if (cor) { g.fillStyle = cor; g.fill(); } g.strokeStyle = K; g.stroke(); }
  function el(g, x, y, rx, ry, cor, rot) { g.beginPath(); g.ellipse(x, y, rx, ry, rot || 0, 0, Math.PI * 2); pinta(g, cor); }
  function ci(g, x, y, r, cor) { el(g, x, y, r, r, cor); }
  function re(g, x, y, w, h, cor, r) {
    g.beginPath(); r = Math.min(r || 0, w / 2, h / 2);
    g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
    pinta(g, cor);
  }
  function po(g, pts, cor, aberto) {
    g.beginPath(); g.moveTo(pts[0], pts[1]);
    for (var i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]);
    if (!aberto) g.closePath();
    pinta(g, aberto ? null : cor);
  }
  function li(g, x1, y1, x2, y2, cor, w) { var lw = g.lineWidth; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.strokeStyle = cor || K; if (w) g.lineWidth = w; g.stroke(); g.lineWidth = lw; }
  function olho(g, x, y, r) { ci(g, x, y, r, '#fff'); g.beginPath(); g.arc(x + r * .2, y + r * .1, r * .55, 0, 7); g.fillStyle = '#111'; g.fill(); g.beginPath(); g.arc(x + r * .35, y - r * .15, r * .2, 0, 7); g.fillStyle = '#fff'; g.fill(); }
  function brilho(g, x, y, r) { g.save(); g.globalAlpha = .55; g.beginPath(); g.ellipse(x, y, r, r * .55, -.6, 0, 7); g.fillStyle = '#fff'; g.fill(); g.restore(); }
  function texto(g, t, x, y, tam, cor) { g.font = 'bold ' + tam + 'px Arial,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = tam / 6; g.strokeStyle = K; g.strokeText(t, x, y); g.fillStyle = cor; g.fillText(t, x, y); }
  function estrela5(g, x, y, r, cor) { var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; p.push(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } po(g, p, cor); }
  function roda(g, x, y, r) { ci(g, x, y, r, '#2a2a30'); ci(g, x, y, r * .45, '#c8ccd4'); }

  // ---------- os desenhos (cada um cabe numa caixa de ~100x100 em volta do 0,0) ----------
  var DES = {
    cogu: function (g, cor) {
      re(g, -22, -6, 44, 48, '#f6ead0', 14);
      olho(g, -10, 12, 7); olho(g, 10, 12, 7);
      g.beginPath(); g.arc(0, 24, 7, .2, Math.PI - .2); g.stroke();
      el(g, -18, 24, 5, 3, '#ffaaaa'); el(g, 18, 24, 5, 3, '#ffaaaa');
      g.beginPath(); g.ellipse(0, -4, 50, 42, 0, Math.PI, 0); g.closePath(); pinta(g, cor || '#e8322a');
      el(g, -26, -20, 8, 6, '#fff8ea'); el(g, 2, -34, 10, 6, '#fff8ea'); el(g, 28, -18, 8, 6, '#fff8ea'); el(g, -6, -14, 5, 4, '#fff8ea');
      brilho(g, -22, -30, 10);
    },
    // ---- neve (Cogu Esqui 3D) ----
    coguEsqui: function (g) {
      li(g, -46, 10, -30, 66, K, 4); li(g, 46, 10, 30, 66, K, 4);
      re(g, -62, 52, 124, 9, '#ffc21a', 4); re(g, -58, 62, 116, 9, '#ffc21a', 4);
      po(g, [62, 52, 74, 40, 70, 56], '#ffc21a'); po(g, [58, 62, 70, 50, 66, 66], '#ffc21a');
      re(g, -14, 40, 10, 16, '#222', 3); re(g, 4, 40, 10, 16, '#222', 3);
      DES.cogu(g);
      re(g, -30, -24, 60, 12, '#ffc21a', 6); re(g, -24, -22, 20, 8, '#7fd0ff', 4); re(g, 4, -22, 20, 8, '#7fd0ff', 4);
      re(g, -22, 34, 44, 8, '#e8322a', 4); po(g, [10, 38, 20, 54, 12, 56], '#e8322a');
    },
    pinheiro: function (g) {
      re(g, -7, 30, 14, 20, '#8a5a2a', 3);
      po(g, [0, -10, 36, 34, -36, 34], '#2f8a4a'); po(g, [0, -34, 28, 10, -28, 10], '#3aa85a'); po(g, [0, -54, 20, -14, -20, -14], '#4ac86a');
      po(g, [0, -54, 9, -38, 2, -42, -6, -36, -9, -38], '#fff');
      el(g, -16, 8, 10, 4, '#fff'); el(g, 18, 30, 12, 4, '#fff'); el(g, -20, 31, 9, 3, '#fff');
    },
    bonecoNeve: function (g) {
      ci(g, 0, 26, 30, '#fff'); ci(g, 0, -16, 21, '#fff');
      re(g, -16, -48, 32, 18, '#222', 3); re(g, -24, -32, 48, 6, '#222', 3);
      ci(g, -7, -20, 3, '#222'); ci(g, 7, -20, 3, '#222');
      po(g, [0, -14, 22, -10, 0, -8], '#ff8a1a');
      re(g, -20, -2, 40, 8, '#e8322a', 4);
      ci(g, 0, 16, 3, '#222'); ci(g, 0, 30, 3, '#222');
    },
    floco: function (g, cor) {
      var c = cor || '#fff', a;
      for (a = 0; a < 6; a++) { g.save(); g.rotate(a * Math.PI / 3);
        li(g, 0, 0, 0, -40, K, 11); li(g, 0, -24, -10, -34, K, 9); li(g, 0, -24, 10, -34, K, 9);
        li(g, 0, 0, 0, -40, c, 5); li(g, 0, -24, -10, -34, c, 4); li(g, 0, -24, 10, -34, c, 4); g.restore(); }
      ci(g, 0, 0, 7, c);
    },
    coguDourado: function (g) { DES.cogu(g, '#f2c21a'); estrela5(g, 40, -40, 12, '#fff6a0'); estrela5(g, -44, -8, 8, '#fff6a0'); },
    coguVeneno: function (g) { DES.cogu(g, '#8a3aff'); el(g, 30, 40, 8, 5, '#6ad04a'); },
    coguNinja: function (g) {
      DES.cogu(g, '#4a4a78');
      re(g, -26, -2, 52, 9, '#d02a2a', 3); po(g, [24, 2, 46, -8, 44, 6], '#d02a2a'); po(g, [24, 5, 42, 16, 34, 20], '#d02a2a');
    },
    capivara: function (g, cor) {
      g.save(); g.translate(-12, 4);
      [-28, 22].forEach(function (x) { re(g, x, 18, 12, 26, '#6a4020', 3); });
      el(g, -6, 4, 50, 30, cor || '#8a5a2e');
      el(g, 38, -18, 26, 20, '#9a6a3a', -.2); el(g, 56, -14, 11, 12, '#6a4020'); el(g, 26, -38, 7, 6, '#6a4020');
      olho(g, 40, -24, 5); g.beginPath(); g.arc(60, -18, 2.4, 0, 7); g.fillStyle = '#2a1a0a'; g.fill();
      g.restore();
    },
    sombra: function (g) { g.save(); g.globalAlpha = .55; DES.capivara(g, '#1a1030'); g.restore(); },
    capivaraPara: function (g) {
      g.beginPath(); g.ellipse(0, -30, 56, 30, 0, Math.PI, 0); g.closePath(); pinta(g, '#ff5a5a');
      g.beginPath(); g.ellipse(0, -30, 20, 30, 0, Math.PI, 0); g.closePath(); pinta(g, '#fff');
      li(g, -54, -30, -14, 18); li(g, 54, -30, 14, 18); li(g, 0, -30, 0, 14);
      g.save(); g.translate(0, 34); g.scale(.55, .55); DES.capivara(g); g.restore();
    },
    robo: function (g) {
      li(g, 0, -40, 0, -52); ci(g, 0, -54, 5, '#ff3a3a');
      re(g, -26, -40, 52, 36, '#9aa8c0', 8); re(g, -18, -32, 36, 16, '#2a3a5a', 5);
      ci(g, -8, -24, 4, '#6af0ff'); ci(g, 8, -24, 4, '#6af0ff');
      re(g, -32, -2, 64, 40, '#7a88a8', 8); ci(g, 0, 16, 8, '#ffcc22');
      re(g, -46, 2, 12, 28, '#9aa8c0', 5); re(g, 34, 2, 12, 28, '#9aa8c0', 5);
      re(g, -22, 38, 14, 12, '#5a6888', 3); re(g, 8, 38, 14, 12, '#5a6888', 3);
    },
    fantasma: function (g) {
      g.beginPath(); g.moveTo(-38, 40); g.lineTo(-38, -8); g.bezierCurveTo(-38, -56, 38, -56, 38, -8); g.lineTo(38, 40);
      for (var i = 0; i < 4; i++) g.quadraticCurveTo(38 - i * 19 - 9.5, 26, 38 - (i + 1) * 19, 40);
      g.closePath(); pinta(g, '#f4f4ff');
      el(g, -13, -10, 7, 10, '#111'); el(g, 13, -10, 7, 10, '#111'); el(g, 0, 14, 7, 9, '#3a1a3a');
      brilho(g, -20, -30, 9);
    },
    zumbi: function (g) {
      re(g, -48, 4, 34, 12, '#6ab04a', 6); re(g, 14, 4, 34, 12, '#6ab04a', 6);
      re(g, -24, 0, 48, 46, '#5a7aa8', 6);
      re(g, -28, -48, 56, 50, '#7ac85a', 14);
      po(g, [-28, -40, -20, -54, -10, -44, 0, -56, 10, -44, 20, -54, 28, -40], '#3a2a1a');
      olho(g, -12, -24, 8); ci(g, 12, -22, 5, '#ffee88');
      li(g, -12, -6, 12, -8); [-6, 0, 6].forEach(function (x) { li(g, x, -11, x, -3); });
      li(g, 8, -42, 18, -32, '#c83a3a', 3);
    },
    dino: function (g) {
      po(g, [-14, 6, -60, 30, -54, 8, -18, -10], '#4aa83a');
      el(g, -2, 6, 30, 24, '#4aa83a');
      re(g, -14, 24, 12, 24, '#3a8a2a', 4); re(g, 8, 24, 12, 24, '#3a8a2a', 4);
      re(g, 4, -46, 52, 34, '#5ac84a', 12);
      po(g, [16, -12, 22, -4, 28, -12, 34, -4, 40, -12, 46, -4, 52, -12], '#fff', true);
      g.beginPath(); g.moveTo(10, -14); g.lineTo(56, -14); g.stroke();
      olho(g, 22, -34, 6); li(g, 22, 10, 32, 18); li(g, 32, 18, 36, 12);
      el(g, -6, 10, 14, 10, '#9ae07a');
    },
    tubarao: function (g) {
      po(g, [-40, 0, -64, -22, -58, 0, -64, 22], '#6a7a9a');
      po(g, [-6, -18, 6, -46, 18, -18], '#6a7a9a');
      el(g, 0, 0, 52, 22, '#7a8aaa');
      g.beginPath(); g.ellipse(4, 8, 44, 12, 0, 0, Math.PI); pinta(g, '#f0f4ff');
      olho(g, 30, -6, 5);
      po(g, [28, 10, 32, 16, 36, 10, 40, 16, 44, 9], '#fff', true);
      li(g, 12, -4, 12, 6); li(g, 6, -4, 6, 6);
    },
    peixe: function (g, cor) {
      po(g, [-28, 0, -54, -22, -50, 0, -54, 22], cor || '#ffa82a');
      el(g, 0, 0, 38, 26, cor || '#ffa82a'); olho(g, 18, -6, 7);
      g.beginPath(); g.arc(-4, 0, 14, -1, 1); g.stroke(); po(g, [-4, -24, 8, -38, 14, -22], cor || '#ffa82a');
      brilho(g, -6, -12, 8);
    },
    polvo: function (g) {
      for (var i = 0; i < 5; i++) { var x = -32 + i * 16; g.beginPath(); g.moveTo(x, 6); g.bezierCurveTo(x - 10, 30, x + 14, 36, x + 2, 50); g.lineWidth *= 2.6; g.strokeStyle = K; g.stroke(); g.lineWidth /= 2.6; g.lineWidth *= 1.6; g.strokeStyle = '#c85ad8'; g.stroke(); g.lineWidth /= 1.6; }
      g.beginPath(); g.ellipse(0, -8, 40, 38, 0, Math.PI, 0); g.lineTo(40, 6); g.lineTo(-40, 6); g.closePath(); pinta(g, '#c85ad8');
      olho(g, -12, -10, 8); olho(g, 12, -10, 8); brilho(g, -18, -32, 9);
    },
    dragao: function (g) {
      po(g, [-10, -10, -56, -50, -40, -10, -60, -14, -30, 6], '#b02a2a');
      po(g, [-30, 10, -70, 30, -40, 26], '#c83a3a');
      el(g, -6, 10, 30, 24, '#d84a3a');
      re(g, -14, 28, 10, 20, '#a02a2a', 3); re(g, 6, 28, 10, 20, '#a02a2a', 3);
      re(g, 6, -42, 44, 30, '#d84a3a', 12);
      po(g, [12, -40, 8, -58, 22, -42], '#f0e0a0'); po(g, [30, -42, 34, -60, 42, -42], '#f0e0a0');
      olho(g, 24, -30, 6); ci(g, 44, -22, 2, '#111');
      po(g, [50, -20, 74, -30, 66, -18, 80, -12, 52, -12], '#ffaa22');
      el(g, -2, 14, 16, 12, '#f0b060');
    },
    alien: function (g, cor) {
      var m = ['..x.....x..', '...x...x...', '..xxxxxxx..', '.xx.xxx.xx.', 'xxxxxxxxxxx', 'x.xxxxxxx.x', 'x.x.....x.x', '...xx.xx...'], s = 9;
      g.fillStyle = cor || '#5aff6a'; g.strokeStyle = K; g.lineWidth = 2.5;
      for (var y = 0; y < m.length; y++) for (var x = 0; x < 11; x++) if (m[y][x] === 'x') { g.fillRect(-49.5 + x * s, -36 + y * s, s, s); g.strokeRect(-49.5 + x * s, -36 + y * s, s, s); }
    },
    salsichao: function (g) {
      po(g, [-50, -6, -64, -26, -56, -2], '#8a4a1a');
      re(g, -52, -16, 80, 30, '#a85a22', 15);
      [-44, -30, 8, 20].forEach(function (x) { re(g, x, 8, 9, 20, '#8a4a1a', 3); });
      el(g, 38, -20, 22, 18, '#a85a22'); el(g, 54, -14, 12, 9, '#c8783a'); ci(g, 64, -16, 4, '#111');
      el(g, 28, -12, 8, 16, '#6a3a12', .4); olho(g, 40, -26, 5);
    },
    passaro: function (g) {
      el(g, 0, 0, 26, 20, '#3ab0ff'); po(g, [-6, -2, -30, -24, -18, 4], '#2a8ad8');
      po(g, [24, -4, 40, 0, 24, 6], '#ffaa22'); olho(g, 12, -6, 6); el(g, 2, 8, 12, 7, '#cfeeff');
    },
    patinho: function (g) { DES.passaro(g); },
    morcego: function (g) {
      po(g, [0, -6, -22, -24, -30, -8, -46, -16, -40, 6, -24, 2, -12, 12, 0, 6, 12, 12, 24, 2, 40, 6, 46, -16, 30, -8, 22, -24], '#3a2a4a');
      el(g, 0, 0, 13, 15, '#4a3a5a'); po(g, [-8, -12, -6, -24, -1, -14], '#4a3a5a'); po(g, [8, -12, 6, -24, 1, -14], '#4a3a5a');
      ci(g, -5, -2, 3, '#ffdd33'); ci(g, 5, -2, 3, '#ffdd33');
    },
    caranguejo: function (g) {
      [-1, 1].forEach(function (s) { li(g, s * 20, 6, s * 40, 24); li(g, s * 24, 0, s * 46, 14); el(g, s * 40, -24, 13, 10, '#e84a2a'); po(g, [s * 34, -28, s * 48, -40, s * 46, -26], '#e84a2a'); li(g, s * 24, -6, s * 36, -16); });
      el(g, 0, 4, 32, 20, '#e84a2a'); li(g, -8, -14, -10, -26); li(g, 8, -14, 10, -26); olho(g, -10, -28, 5); olho(g, 10, -28, 5);
    },
    monstro: function (g) {
      po(g, [-24, -30, -34, -54, -12, -36], '#f0e0a0'); po(g, [24, -30, 34, -54, 12, -36], '#f0e0a0');
      g.beginPath(); g.moveTo(-40, 40); g.bezierCurveTo(-52, -40, 52, -40, 40, 40); g.closePath(); pinta(g, '#8a4ae0');
      olho(g, -12, -8, 9); olho(g, 14, -10, 7);
      po(g, [-20, 14, 20, 14, 14, 26, -14, 26], '#3a1a3a'); po(g, [-14, 14, -10, 21, -6, 14], '#fff'); po(g, [6, 14, 10, 21, 14, 14], '#fff');
    },
    carro: function (g, cor) {
      cor = cor || '#e83a3a';
      po(g, [-58, 10, -56, -8, -30, -12, -14, -32, 22, -32, 38, -12, 58, -8, 60, 10, 54, 18, -54, 18], cor);
      po(g, [-8, -27, 16, -27, 28, -12, -22, -12], '#9ad6ff'); li(g, 4, -27, 4, -12);
      re(g, -58, -2, 116, 6, '#fff', 2); brilho(g, -30, -16, 8);
      roda(g, -34, 18, 13); roda(g, 34, 18, 13); el(g, 56, 0, 4, 3, '#fff6a0');
    },
    policia: function (g) {
      DES.carro(g, '#f4f4f4'); re(g, -58, -2, 116, 6, '#2a4ad0', 2);
      re(g, -6, -42, 12, 10, '#ff3a3a', 3); re(g, 6, -42, 12, 10, '#3a6aff', 3);
      texto(g, 'POLÍCIA', 0, 6, 11, '#2a4ad0');
    },
    taxi: function (g) { DES.carro(g, '#ffcc22'); re(g, -10, -44, 22, 12, '#fff', 3); texto(g, 'TAXI', 1, -38, 8, '#1e1a2a'); },
    kart: function (g) {
      roda(g, -36, 20, 16); roda(g, 38, 20, 16);
      po(g, [-54, 14, -46, -2, 46, -2, 58, 14], '#3ac46a'); re(g, -12, -14, 26, 14, '#2a2a30', 4);
      g.save(); g.translate(2, -34); g.scale(.6, .6); DES.cogu(g); g.restore();
      li(g, 20, -14, 30, -26, '#2a2a30', 6);
    },
    aviao: function (g) {
      po(g, [-46, -6, -60, -34, -48, -34, -30, -8], '#e83a3a');
      el(g, 0, 0, 56, 16, '#f4f4f4'); po(g, [-10, 0, 14, 0, -4, 36, -20, 36], '#e83a3a');
      [-20, -8, 4, 16].forEach(function (x) { ci(g, x, -4, 4, '#9ad6ff'); });
      po(g, [36, -12, 52, -6, 52, 4, 38, 4], '#9ad6ff'); li(g, 58, -18, 58, 18, K, 5);
    },
    navio: function (g) {
      po(g, [-60, 10, 60, 10, 46, 40, -46, 40], '#8a4a1a'); li(g, -50, 22, 50, 22, '#5a2a0a'); [-30, 0, 30].forEach(function (x) { ci(g, x, 30, 4, '#2a1a0a'); });
      li(g, 0, 10, 0, -58, K, 5); po(g, [-4, -50, -40, -28, -40, 2, -4, 2], '#f4ead0'); po(g, [4, -50, 38, -30, 38, 2, 4, 2], '#f4ead0');
      po(g, [0, -58, 22, -52, 0, -46], '#1e1a2a'); ci(g, -22, -22, 7, '#fff');
    },
    barco: function (g) {
      po(g, [-56, 6, 56, 6, 42, 30, -44, 30], '#e8e8f0'); re(g, -56, 4, 112, 6, '#2a6ad8', 2);
      re(g, -24, -22, 40, 26, '#f4f4f4', 4); re(g, -16, -16, 12, 10, '#9ad6ff', 2); re(g, 0, -16, 12, 10, '#9ad6ff', 2);
      li(g, 30, 4, 54, -46); g.beginPath(); g.moveTo(54, -46); g.quadraticCurveTo(66, -10, 62, 20); g.lineWidth /= 2; g.stroke(); g.lineWidth *= 2;
    },
    balao: function (g) {
      li(g, -24, 6, -14, 34); li(g, 24, 6, 14, 34);
      g.beginPath(); g.moveTo(0, 12); g.bezierCurveTo(-70, -20, -40, -76, 0, -76); g.bezierCurveTo(40, -76, 70, -20, 0, 12); pinta(g, '#ff5a5a');
      g.beginPath(); g.moveTo(0, 12); g.bezierCurveTo(-24, -20, -16, -76, 0, -76); g.bezierCurveTo(16, -76, 24, -20, 0, 12); pinta(g, '#ffd23a');
      re(g, -16, 32, 32, 18, '#a8743a', 4); g.save(); g.translate(2, 26); g.scale(.3, .3); DES.capivara(g); g.restore();
    },
    foguete: function (g) {
      po(g, [-12, 34, -6, 54, 0, 42, 6, 54, 12, 34], '#ffaa22');
      po(g, [-16, 20, -32, 38, -16, 34], '#e83a3a'); po(g, [16, 20, 32, 38, 16, 34], '#e83a3a');
      g.beginPath(); g.moveTo(0, -50); g.bezierCurveTo(24, -30, 18, 20, 16, 34); g.lineTo(-16, 34); g.bezierCurveTo(-18, 20, -24, -30, 0, -50); pinta(g, '#f4f4f4');
      ci(g, 0, -8, 9, '#6ac0ff');
    },
    moeda: function (g) { el(g, 4, 2, 40, 40, '#c8901a'); ci(g, 0, 0, 40, '#ffcc22'); ci(g, 0, 0, 28, '#ffdd55'); estrela5(g, 0, 0, 16, '#ffcc22'); brilho(g, -16, -20, 9); },
    estrela: function (g) { estrela5(g, 0, 2, 48, '#ffd23a'); brilho(g, -10, -12, 8); },
    presente: function (g) {
      re(g, -36, -10, 72, 50, '#e83a6a', 4); re(g, -42, -24, 84, 16, '#ff5a8a', 4);
      re(g, -6, -24, 12, 64, '#ffd23a'); el(g, -14, -32, 14, 9, '#ffd23a', .4); el(g, 14, -32, 14, 9, '#ffd23a', -.4);
    },
    controle: function (g) {
      g.beginPath(); g.moveTo(-50, -10); g.bezierCurveTo(-56, 36, -30, 36, -20, 16); g.lineTo(20, 16); g.bezierCurveTo(30, 36, 56, 36, 50, -10); g.bezierCurveTo(48, -26, -48, -26, -50, -10); pinta(g, '#4a4a5a');
      re(g, -34, -12, 6, 18, '#222', 1); re(g, -40, -6, 18, 6, '#222', 1);
      ci(g, 26, -12, 5, '#3ac46a'); ci(g, 36, -4, 5, '#e83a3a'); ci(g, 16, -4, 5, '#3a8aff'); ci(g, 26, 4, 5, '#ffd23a');
    },
    tijolo: function (g) {
      re(g, -44, -30, 88, 60, '#d86a3a', 4);
      li(g, -44, -10, 44, -10); li(g, -44, 10, 44, 10); li(g, -14, -30, -14, -10); li(g, 18, -30, 18, -10); li(g, 2, -10, 2, 10); li(g, -28, 10, -28, 30); li(g, 28, 10, 28, 30);
    },
    explosao: function (g) {
      var p = []; for (var i = 0; i < 18; i++) { var a = i * Math.PI / 9, r = i % 2 ? 26 : 50; p.push(Math.cos(a) * r, Math.sin(a) * r); } po(g, p, '#ff7a22');
      p = []; for (i = 0; i < 18; i++) { a = i * Math.PI / 9 + .2; r = i % 2 ? 14 : 30; p.push(Math.cos(a) * r, Math.sin(a) * r); } po(g, p, '#ffe04a');
    },
    arvore: function (g) { re(g, -8, 0, 16, 48, '#8a5a2a', 3); ci(g, -18, -14, 24, '#3aa83a'); ci(g, 18, -14, 24, '#3aa83a'); ci(g, 0, -34, 26, '#4ac84a'); brilho(g, -8, -42, 8); },
    palmeira: function (g) {
      g.beginPath(); g.moveTo(-4, 50); g.quadraticCurveTo(-10, 0, 6, -30); g.lineTo(14, -28); g.quadraticCurveTo(2, 0, 8, 50); g.closePath(); pinta(g, '#a8743a');
      [[-44, -20], [-30, -50], [40, -46], [50, -14], [6, -60]].forEach(function (f) { g.beginPath(); g.moveTo(10, -30); g.quadraticCurveTo((10 + f[0]) / 2, f[1] - 18, f[0], f[1]); g.quadraticCurveTo((10 + f[0]) / 2, f[1] - 4, 10, -30); pinta(g, '#3ab84a'); });
      ci(g, 4, -24, 6, '#6a4a1a'); ci(g, 16, -24, 6, '#6a4a1a');
    },
    cacto: function (g) {
      re(g, -12, -48, 24, 96, '#4ab04a', 12); re(g, -40, -18, 16, 36, '#4ab04a', 8); re(g, -34, 8, 26, 12, '#4ab04a', 6); re(g, 24, -32, 16, 32, '#4ab04a', 8); re(g, 10, -8, 26, 12, '#4ab04a', 6);
      li(g, 0, -40, 0, 40, '#3a8a3a', 2);
    },
    vulcao: function (g) {
      po(g, [-56, 44, -14, -30, 14, -30, 56, 44], '#7a5a3a'); po(g, [-14, -30, 14, -30, 8, -14, 0, -22, -6, -12], '#ff5a22');
      ci(g, -10, -46, 12, '#9a9aaa'); ci(g, 8, -54, 14, '#9a9aaa');
    },
    osso: function (g) { re(g, -34, -8, 68, 16, '#f4ecd8', 6); [-38, 38].forEach(function (x) { ci(g, x, -10, 11, '#f4ecd8'); ci(g, x, 10, 11, '#f4ecd8'); }); re(g, -30, -6, 60, 12, '#f4ecd8'); },
    furacao: function (g) {
      [[0, 36, 10], [4, 22, 18], [-2, 6, 26], [6, -12, 34], [0, -32, 44]].forEach(function (c, i) { el(g, c[0], c[1], c[2], 8, ['#8a9ab8', '#9aaac8', '#aab8d4', '#b8c4dc', '#c8d2e8'][i]); });
      li(g, -30, -32, 30, -32, '#fff', 2);
    },
    casa: function (g) {
      re(g, -40, -8, 80, 52, '#ffe0a8', 2); po(g, [-50, -6, 0, -50, 50, -6], '#e8503a');
      re(g, -10, 14, 20, 30, '#8a4a1a', 2); re(g, -32, 2, 16, 14, '#9ad6ff', 2); re(g, 16, 2, 16, 14, '#9ad6ff', 2); re(g, 22, -40, 10, 18, '#9a5a3a');
    },
    castelo: function (g) {
      re(g, -36, -14, 72, 60, '#b8b8c8'); re(g, -54, -36, 24, 82, '#a8a8b8'); re(g, 30, -36, 24, 82, '#a8a8b8');
      [-54, -46, -38, 30, 38, 46].forEach(function (x) { re(g, x, -44, 8, 9, '#a8a8b8'); });
      [-36, -24, -12, 0, 12, 24].forEach(function (x) { re(g, x, -22, 8, 9, '#b8b8c8'); });
      g.beginPath(); g.moveTo(-12, 46); g.lineTo(-12, 20); g.arc(0, 20, 12, Math.PI, 0); g.lineTo(12, 46); pinta(g, '#6a4020');
      li(g, -42, -44, -42, -64); po(g, [-42, -64, -26, -58, -42, -52], '#e83a3a'); re(g, -46, -20, 8, 12, '#2a2a3a'); re(g, 38, -20, 8, 12, '#2a2a3a');
    },
    predio: function (g) {
      re(g, -26, -56, 52, 104, '#5a6aa8'); for (var y = 0; y < 5; y++) for (var x = 0; x < 3; x++) re(g, -18 + x * 14, -48 + y * 18, 8, 10, (x + y) % 3 ? '#ffe07a' : '#3a4a7a', 1);
      re(g, -8, 32, 16, 16, '#3a2a1a');
    },
    chave: function (g) { ci(g, -28, 0, 20, '#ffcc22'); ci(g, -28, 0, 8, '#2a2a3a'); re(g, -10, -6, 58, 12, '#ffcc22', 3); re(g, 30, 4, 8, 14, '#ffcc22'); re(g, 42, 4, 8, 10, '#ffcc22'); },
    lanterna: function (g) {
      g.save(); g.globalAlpha = .5; po(g, [20, -12, 60, -40, 60, 40, 20, 12], '#fff6a0'); g.restore();
      re(g, -50, -8, 50, 16, '#3a3a4a', 4); po(g, [0, -10, 20, -16, 20, 16, 0, 10], '#5a5a6a'); re(g, -34, -12, 8, 4, '#e83a3a');
    },
    machado: function (g) { g.rotate(.5); re(g, -6, -50, 12, 100, '#8a5a2a', 4); g.beginPath(); g.moveTo(6, -46); g.quadraticCurveTo(48, -40, 40, -6); g.lineTo(6, -14); g.closePath(); pinta(g, '#c8ccd4'); },
    abobora: function (g) {
      el(g, -18, 4, 22, 34, '#ff8a22'); el(g, 18, 4, 22, 34, '#ff8a22'); el(g, 0, 4, 22, 36, '#ffa03a'); re(g, -4, -42, 8, 12, '#4a8a2a', 2);
      po(g, [-20, -6, -12, -16, -4, -6], '#3a1a0a'); po(g, [4, -6, 12, -16, 20, -6], '#3a1a0a'); po(g, [-22, 10, -12, 18, -4, 12, 4, 18, 12, 12, 22, 10, 14, 26, -14, 26], '#3a1a0a');
    },
    espada: function (g) { g.rotate(-.7); po(g, [-6, -10, -6, -64, 0, -74, 6, -64, 6, -10], '#dfe6ee'); re(g, -22, -12, 44, 8, '#ffcc22', 3); re(g, -5, -4, 10, 30, '#6a3a1a', 3); ci(g, 0, 30, 7, '#ffcc22'); },
    shuriken: function (g) { var p = []; for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4, r = i % 2 ? 12 : 44; p.push(Math.cos(a) * r, Math.sin(a) * r); } po(g, p, '#9aa4b8'); ci(g, 0, 0, 7, '#2a2a3a'); },
    pincel: function (g) { g.rotate(-.6); re(g, -6, -10, 12, 64, '#e8503a', 5); re(g, -9, -24, 18, 16, '#c8ccd4', 2); g.beginPath(); g.moveTo(-9, -24); g.quadraticCurveTo(0, -70, 9, -24); pinta(g, '#3a8aff'); },
    lapis: function (g) { g.rotate(.7); re(g, -9, -40, 18, 70, '#ffcc22', 2); re(g, -9, 30, 18, 12, '#ff8aa0', 3); po(g, [-9, -40, 0, -62, 9, -40], '#f4d8a8'); po(g, [-3, -54, 0, -62, 3, -54], '#2a2a3a'); },
    paleta: function (g) {
      g.beginPath(); g.moveTo(-10, -42); g.bezierCurveTo(50, -50, 64, 30, 10, 40); g.bezierCurveTo(-10, 44, -20, 30, -6, 20); g.bezierCurveTo(4, 12, -16, 4, -30, 14); g.bezierCurveTo(-60, 20, -56, -36, -10, -42); pinta(g, '#f4d8a8');
      [['#e83a3a', -18, -24], ['#ffd23a', 6, -30], ['#3ac46a', 28, -18], ['#3a8aff', 32, 6], ['#c85ad8', 14, 24]].forEach(function (c) { ci(g, c[1], c[2], 8, c[0]); });
    },
    interrogacao: function (g) { ci(g, 0, 0, 46, '#ffd23a'); texto(g, '?', 0, 4, 62, '#fff'); brilho(g, -18, -24, 9); },
    lampada: function (g) {
      g.save(); g.strokeStyle = '#fff6a0'; g.lineWidth = 4; [-1, 1].forEach(function (s) { li(g, s * 44, -30, s * 54, -36, '#fff6a0'); li(g, s * 46, -6, s * 58, -6, '#fff6a0'); }); g.restore();
      g.beginPath(); g.arc(0, -16, 30, Math.PI * .8, Math.PI * 2.2); g.lineTo(12, 16); g.lineTo(-12, 16); g.closePath(); pinta(g, '#fff07a');
      re(g, -12, 16, 24, 18, '#9aa4b8', 3); li(g, -12, 22, 12, 22); brilho(g, -12, -26, 8);
    },
    certo: function (g) { ci(g, 0, 0, 44, '#3ac46a'); g.save(); g.lineWidth *= 2.4; po(g, [-20, 0, -6, 16, 22, -16], null, true); g.strokeStyle = '#fff'; g.lineWidth /= 2; g.stroke(); g.restore(); },
    errado: function (g) { ci(g, 0, 0, 44, '#e83a3a'); g.save(); g.lineWidth *= 2.4; li(g, -16, -16, 16, 16); li(g, 16, -16, -16, 16); g.lineWidth /= 2; li(g, -16, -16, 16, 16, '#fff'); li(g, 16, -16, -16, 16, '#fff'); g.restore(); },
    dado: function (g) {
      po(g, [-40, -16, 0, -36, 40, -16, 0, 4], '#ffffff'); po(g, [-40, -16, 0, 4, 0, 46, -40, 26], '#e8e8f0'); po(g, [0, 4, 40, -16, 40, 26, 0, 46], '#d4d4e4');
      [[0, -16]].forEach(function (p) { el(g, p[0], p[1], 6, 4, '#e83a3a'); });
      [[-28, -2], [-12, 22], [-20, 10]].forEach(function (p) { ci(g, p[0], p[1], 4, '#1e1a2a'); }); [[12, 0], [28, -8], [12, 26], [28, 18]].forEach(function (p) { ci(g, p[0], p[1], 4, '#1e1a2a'); });
    },
    alvo: function (g) { ['#e83a3a', '#fff', '#e83a3a', '#fff', '#e83a3a'].forEach(function (c, i) { ci(g, 0, 0, 46 - i * 9, c); }); li(g, 4, -4, 44, -44, '#8a5a2a', 5); po(g, [44, -44, 36, -54, 54, -36], '#3ac46a'); },
    carinha: function (g) {
      ci(g, 0, 0, 46, '#ffd23a'); g.beginPath(); g.arc(-15, -10, 8, Math.PI, 0); g.stroke(); g.beginPath(); g.arc(15, -10, 8, Math.PI, 0); g.stroke();
      g.beginPath(); g.moveTo(-26, 6); g.quadraticCurveTo(0, 44, 26, 6); g.closePath(); pinta(g, '#7a1a2a'); el(g, 0, 22, 10, 6, '#ff6a7a');
      el(g, -34, -4, 7, 12, '#7ad0ff'); el(g, 34, -4, 7, 12, '#7ad0ff'); brilho(g, -20, -28, 9);
    },
    globo: function (g) {
      ci(g, 0, 0, 46, '#3a8aff');
      g.beginPath(); g.moveTo(-30, -26); g.bezierCurveTo(-10, -40, 4, -24, -8, -12); g.bezierCurveTo(-18, 0, -30, 0, -36, -10); g.closePath(); pinta(g, '#4ac84a');
      g.beginPath(); g.moveTo(6, 0); g.bezierCurveTo(30, -10, 40, 14, 22, 30); g.bezierCurveTo(10, 38, 0, 20, 6, 0); pinta(g, '#4ac84a');
      el(g, 28, -24, 8, 6, '#4ac84a'); brilho(g, -18, -28, 10);
    },
    bandeira: function (g) {
      li(g, -30, -50, -30, 50, '#6a4a2a', 6);
      g.beginPath(); g.moveTo(-30, -48); g.quadraticCurveTo(0, -60, 20, -46); g.quadraticCurveTo(36, -36, 50, -44); g.lineTo(50, 4); g.quadraticCurveTo(36, 12, 20, 2); g.quadraticCurveTo(0, -10, -30, 0); g.closePath(); pinta(g, '#3ab84a');
      po(g, [-16, -24, 10, -38, 36, -22, 10, -8], '#ffd23a'); ci(g, 10, -23, 9, '#2a4ad0');
    },
    mapa: function (g) {
      po(g, [-46, -34, -16, -42, 16, -34, 46, -42, 46, 34, 16, 42, -16, 34, -46, 42], '#f4e0b0'); li(g, -16, -42, -16, 34, '#c8a870'); li(g, 16, -34, 16, 42, '#c8a870');
      g.save(); g.setLineDash([5, 6]); g.beginPath(); g.moveTo(-34, 24); g.quadraticCurveTo(-10, -20, 22, 6); g.strokeStyle = '#c83a3a'; g.stroke(); g.restore();
      li(g, 22, -6, 34, 6, '#c83a3a', 5); li(g, 34, -6, 22, 6, '#c83a3a', 5);
    },
    bandeiraGolf: function (g) { el(g, 0, 40, 50, 12, '#3a9a3a'); el(g, 6, 40, 14, 5, '#1e1a2a'); li(g, 6, 40, 6, -50, '#f4f4f4', 5); po(g, [6, -50, 46, -38, 6, -24], '#e83a3a'); ci(g, -26, 36, 7, '#fff'); },
    taco: function (g) { g.rotate(.5); re(g, -4, -54, 8, 90, '#9aa4b8', 3); re(g, -6, -54, 12, 20, '#2a2a3a', 3); po(g, [-4, 36, 4, 36, 20, 44, 18, 52, -6, 50], '#c8ccd4'); },
    bolaGolf: function (g) { ci(g, 0, 0, 30, '#fff'); [[-10, -8], [6, -12], [12, 4], [-4, 8], [-14, 10]].forEach(function (p) { ci(g, p[0], p[1], 3, '#dde'); }); },
    trofeu: function (g) {
      g.beginPath(); g.arc(-34, -20, 12, Math.PI / 2, Math.PI * 1.5); g.stroke(); g.beginPath(); g.arc(34, -20, 12, -Math.PI / 2, Math.PI / 2); g.stroke();
      g.beginPath(); g.moveTo(-32, -40); g.lineTo(32, -40); g.quadraticCurveTo(30, 0, 6, 6); g.lineTo(6, 22); g.lineTo(-6, 22); g.lineTo(-6, 6); g.quadraticCurveTo(-30, 0, -32, -40); pinta(g, '#ffcc22');
      re(g, -22, 22, 44, 10, '#ffcc22', 2); re(g, -28, 32, 56, 14, '#8a5a2a', 3); estrela5(g, 0, -20, 11, '#fff6a0'); brilho(g, -18, -30, 6);
    },
    pino: function (g) {
      g.beginPath(); g.moveTo(0, -56); g.bezierCurveTo(16, -56, 16, -30, 9, -22); g.bezierCurveTo(30, 0, 26, 40, 14, 52); g.lineTo(-14, 52); g.bezierCurveTo(-26, 40, -30, 0, -9, -22); g.bezierCurveTo(-16, -30, -16, -56, 0, -56); pinta(g, '#fff');
      re(g, -12, -30, 24, 5, '#e83a3a'); re(g, -13, -22, 26, 5, '#e83a3a'); brilho(g, -8, -44, 5);
    },
    bolaBoliche: function (g) { ci(g, 0, 0, 40, '#3a2a8a'); ci(g, -10, -16, 5, '#1a1040'); ci(g, 6, -18, 5, '#1a1040'); ci(g, -2, -4, 5, '#1a1040'); brilho(g, -18, -22, 10); },
    nuvem: function (g) { g.beginPath(); g.arc(-26, 6, 20, Math.PI * .5, Math.PI * 1.5); g.arc(-6, -12, 24, Math.PI, Math.PI * 1.9); g.arc(22, -2, 22, Math.PI * 1.3, Math.PI * .5); g.closePath(); pinta(g, '#fff'); },
    nuvemChuva: function (g) { [-20, 0, 20].forEach(function (x) { li(g, x, 24, x - 6, 44, '#6ac0ff', 4); }); g.save(); g.translate(0, -4); DES.nuvem(g); g.restore(); },
    cacaniquel: function (g) {
      re(g, -46, -46, 84, 96, '#e83a3a', 10); re(g, -38, -36, 68, 36, '#fff', 4);
      [-26, -4, 18].forEach(function (x) { texto(g, '7', x, -18, 26, '#e8b81a'); }); li(g, -15, -36, -15, 0); li(g, 7, -36, 7, 0);
      re(g, -30, 12, 52, 24, '#ffcc22', 4); li(g, 38, -10, 52, -34, K, 5); ci(g, 52, -36, 8, '#3ac46a');
    },
    trevo: function (g) { li(g, 0, 10, 10, 50, '#2a8a2a', 6); [0, 1, 2, 3].forEach(function (i) { g.save(); g.rotate(i * Math.PI / 2); g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-30, -14, -20, -46, 0, -26); g.bezierCurveTo(20, -46, 30, -14, 0, 0); pinta(g, '#3ac44a'); g.restore(); }); },
    diamante: function (g) { po(g, [-40, -14, -22, -36, 22, -36, 40, -14, 0, 42], '#4ad8ff'); po(g, [-40, -14, 40, -14], null, true); po(g, [-22, -36, -10, -14, 0, 42, 10, -14, 22, -36], null, true); brilho(g, -16, -24, 8); },
    saco: function (g) { el(g, 0, 14, 40, 36, '#c8a060'); po(g, [-12, -22, -22, -44, 0, -34, 22, -44, 12, -22], '#c8a060'); re(g, -14, -24, 28, 8, '#8a6030', 2); texto(g, '$', 0, 16, 40, '#3a8a2a'); },
    sirene: function (g) { re(g, -30, 20, 60, 14, '#3a3a4a', 3); g.beginPath(); g.moveTo(-24, 20); g.lineTo(-24, -10); g.arc(0, -10, 24, Math.PI, 0); g.lineTo(24, 20); g.closePath(); pinta(g, '#ff3a3a'); g.save(); g.globalAlpha = .6; [-1, 1].forEach(function (s) { po(g, [s * 30, -10, s * 58, -26, s * 58, 6], '#ffee88'); }); g.restore(); brilho(g, -8, -18, 7); },
    laser: function (g) { g.save(); g.lineCap = 'round'; li(g, -56, 0, 56, 0, 'rgba(255,40,40,.45)', 26); li(g, -56, 0, 56, 0, '#ff3a3a', 12); li(g, -56, 0, 56, 0, '#fff', 4); g.restore(); },
    pisos: function (g) {
      re(g, -48, -52, 96, 104, '#f4f4f4'); li(g, -16, -52, -16, 52); li(g, 16, -52, 16, 52);
      re(g, -48, -40, 32, 30, '#1e1a2a'); re(g, 16, -10, 32, 30, '#1e1a2a'); re(g, -16, 22, 32, 30, '#1e1a2a'); ci(g, 32, 6, 8, '#ff6ad0');
    },
    nota: function (g) { el(g, -16, 26, 16, 12, '#1e1a2a', -.4); re(g, -4, -42, 6, 70, '#1e1a2a'); g.beginPath(); g.moveTo(2, -42); g.quadraticCurveTo(30, -30, 24, -6); g.quadraticCurveTo(22, -22, 2, -26); pinta(g, '#1e1a2a'); },
    cesta: function (g) {
      g.beginPath(); g.arc(0, -6, 38, Math.PI, 0); g.lineWidth *= 2.2; g.strokeStyle = K; g.stroke(); g.lineWidth /= 2.2; g.strokeStyle = '#c8904a'; g.lineWidth *= 1.2; g.stroke(); g.lineWidth /= 1.2;
      po(g, [-50, -6, 50, -6, 38, 42, -38, 42], '#c8904a'); [-30, -10, 10, 30].forEach(function (x) { li(g, x, -6, x * .8, 42); }); li(g, -46, 12, 46, 12); li(g, -42, 28, 42, 28);
      g.save(); g.translate(-14, -18); g.scale(.35, .35); DES.cogu(g); g.restore(); g.save(); g.translate(16, -16); g.scale(.3, .3); DES.cogu(g, '#f2c21a'); g.restore();
    },
    raio: function (g) { po(g, [10, -56, -30, 6, -4, 6, -16, 56, 30, -10, 4, -10], '#ffe04a'); },
    luva: function (g, cor) {
      cor = cor || '#e83a3a';
      re(g, -30, 20, 48, 28, '#fff', 6); g.beginPath(); g.moveTo(-34, 22); g.bezierCurveTo(-46, -40, 34, -56, 40, -6); g.bezierCurveTo(44, 16, 20, 26, 22, 22); g.closePath(); pinta(g, cor);
      el(g, -26, -6, 12, 18, cor, -.4); brilho(g, 4, -30, 10);
    },
    vara: function (g) { li(g, -50, 50, 30, -50, '#8a5a2a', 7); li(g, 30, -50, 44, 20, '#ccc', 2); g.beginPath(); g.arc(40, 24, 6, 0, Math.PI); g.stroke(); ci(g, 44, 10, 6, '#e83a3a'); ci(g, -30, 26, 9, '#3a3a4a'); },
    coroa: function (g) { po(g, [-44, 30, -48, -24, -24, 0, 0, -36, 24, 0, 48, -24, 44, 30], '#ffcc22'); re(g, -44, 22, 88, 14, '#ffcc22', 2); [-24, 0, 24].forEach(function (x, i) { ci(g, x, 29, 5, ['#e83a3a', '#3a8aff', '#3ac46a'][i]); }); ci(g, -48, -26, 6, '#fff'); ci(g, 48, -26, 6, '#fff'); ci(g, 0, -38, 6, '#fff'); },
    pizza: function (g) { ci(g, 0, 0, 52, '#e8a848'); ci(g, 0, 0, 42, '#d8321a'); [[-18, -16], [16, -20], [22, 12], [-8, 22], [-24, 8], [4, -2]].forEach(function (p, i) { ci(g, p[0], p[1], 8, i % 2 ? '#ffd84a' : '#c83a2a'); }); },
    melancia: function (g) { g.beginPath(); g.arc(0, -10, 50, 0, Math.PI); g.closePath(); pinta(g, '#3ab84a'); g.beginPath(); g.arc(0, -10, 42, 0, Math.PI); g.closePath(); pinta(g, '#ff4a6a'); [[-20, 6], [0, 14], [20, 6], [-8, 24], [10, 24]].forEach(function (p) { el(g, p[0], p[1], 3, 5, '#1e1a2a'); }); },
    coracao: function (g) { g.beginPath(); g.moveTo(0, 42); g.bezierCurveTo(-60, 0, -40, -54, 0, -24); g.bezierCurveTo(40, -54, 60, 0, 0, 42); pinta(g, '#ff3a6a'); brilho(g, -20, -22, 9); },
    salsicha: function (g) { g.rotate(-.3); re(g, -50, -12, 100, 24, '#c84a2a', 12); g.beginPath(); g.moveTo(-36, -2); g.quadraticCurveTo(-18, -10, 0, -2); g.quadraticCurveTo(18, 6, 36, -2); g.strokeStyle = '#ffd23a'; g.lineWidth *= 1.4; g.stroke(); g.lineWidth /= 1.4; },
    meteoro: function (g) {
      g.save(); g.globalAlpha = .9; po(g, [-6, -30, -60, -60, -40, -20, -66, -14, -20, 10], '#ff7a22'); po(g, [-4, -18, -40, -40, -26, -14, -44, -10, -10, 4], '#ffe04a'); g.restore();
      ci(g, 10, 4, 30, '#7a5a4a'); ci(g, 2, -4, 7, '#5a3a2a'); ci(g, 20, 14, 6, '#5a3a2a'); ci(g, 18, -10, 4, '#5a3a2a');
    },
    planeta: function (g) { ci(g, 0, 0, 34, '#ff8a4a'); g.save(); g.beginPath(); g.ellipse(0, 0, 58, 14, -.3, 0, Math.PI * 2); g.lineWidth *= 2; g.strokeStyle = K; g.stroke(); g.lineWidth /= 2.5; g.strokeStyle = '#ffd23a'; g.stroke(); g.restore(); el(g, -10, -12, 10, 5, '#ffaa6a'); },
    pedra: function (g) { po(g, [-40, 20, -30, -20, 0, -36, 34, -16, 42, 22, 10, 32], '#8a8a9a'); li(g, -10, -10, 4, 6); },
    tesoura: function (g) {
      g.rotate(-.5); po(g, [-4, 0, -14, -60, 4, -8], '#c8ccd4'); po(g, [4, 0, 14, -60, -4, -8], '#dfe6ee');
      el(g, -16, 26, 12, 16, null); g.save(); g.lineWidth *= 2; el(g, -16, 26, 12, 16, null); g.strokeStyle = '#e83a3a'; g.lineWidth /= 2.4; g.stroke(); g.restore();
      g.save(); g.lineWidth *= 2; el(g, 16, 26, 12, 16, null); g.strokeStyle = '#e83a3a'; g.lineWidth /= 2.4; g.stroke(); g.restore(); ci(g, 0, 0, 4, '#555');
    },
    pente: function (g) { g.rotate(.4); re(g, -50, -16, 100, 14, '#3a8aff', 4); for (var x = -44; x <= 44; x += 9) re(g, x, -2, 5, 22, '#3a8aff', 1); },
    posteBarbeiro: function (g) {
      re(g, -18, -44, 36, 88, '#fff', 6); g.save(); g.beginPath(); g.rect(-18, -44, 36, 88); g.clip();
      for (var y = -80; y < 60; y += 22) po(g, [-18, y, 18, y + 24, 18, y + 34, -18, y + 10], '#e83a3a');
      g.restore(); re(g, -18, -44, 36, 88, null, 6); re(g, -24, -56, 48, 12, '#c8ccd4', 4); re(g, -24, 44, 48, 12, '#c8ccd4', 4);
    },
    bolaFutebol: function (g) {
      ci(g, 0, 0, 44, '#fff');
      var p = []; for (var i = 0; i < 5; i++) { var a = -Math.PI / 2 + i * Math.PI * 2 / 5; p.push(Math.cos(a) * 14, Math.sin(a) * 14); } po(g, p, '#1e1a2a');
      for (i = 0; i < 5; i++) { a = -Math.PI / 2 + i * Math.PI * 2 / 5; li(g, Math.cos(a) * 14, Math.sin(a) * 14, Math.cos(a) * 30, Math.sin(a) * 30); g.save(); g.beginPath(); g.arc(Math.cos(a) * 40, Math.sin(a) * 40, 10, 0, 7); g.fillStyle = '#1e1a2a'; g.fill(); g.restore(); }
      ci(g, 0, 0, 44, null); brilho(g, -18, -22, 9);
    },
    gol: function (g) {
      g.save(); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.5; for (var x = -44; x <= 44; x += 10) { g.beginPath(); g.moveTo(x, -30); g.lineTo(x, 34); g.stroke(); } for (var y = -30; y <= 34; y += 10) { g.beginPath(); g.moveTo(-44, y); g.lineTo(44, y); g.stroke(); } g.restore();
      po(g, [-50, 40, -50, -36, 50, -36, 50, 40], null, true); g.save(); g.strokeStyle = '#fff'; g.lineWidth /= 2; po(g, [-50, 40, -50, -36, 50, -36, 50, 40], null, true); g.restore();
    },
    figurinha: function (g, cor) { re(g, -34, -48, 68, 96, '#fff', 6); re(g, -26, -40, 52, 56, cor || '#ff5a8a', 4); estrela5(g, 0, -12, 18, '#ffd23a'); re(g, -26, 22, 52, 8, '#ddd', 2); re(g, -26, 34, 34, 6, '#ddd', 2); brilho(g, -16, -34, 6); },
    picareta: function (g) { g.rotate(-.4); re(g, -5, -30, 10, 84, '#8a5a2a', 3); g.beginPath(); g.moveTo(-52, -18); g.quadraticCurveTo(0, -56, 52, -18); g.quadraticCurveTo(0, -40, -52, -18); pinta(g, '#9aa4b8'); },
    hamburguer: function (g) {
      g.beginPath(); g.ellipse(0, -14, 48, 32, 0, Math.PI, 0); g.closePath(); pinta(g, '#e8a04a');
      [[-20, -30], [0, -36], [18, -28], [-6, -24]].forEach(function (p) { el(g, p[0], p[1], 3, 2, '#fff6d8'); });
      g.beginPath(); g.moveTo(-50, -12); for (var x = -50; x <= 50; x += 10) g.lineTo(x + 5, x % 20 ? -4 : -12); g.lineTo(50, -12); pinta(g, '#4ac84a');
      re(g, -50, -8, 100, 10, '#ffcc22', 3); re(g, -48, 2, 96, 14, '#7a3a1a', 7); re(g, -48, 16, 96, 16, '#e8a04a', 8);
    },
    panela: function (g) { re(g, -40, -10, 80, 40, '#9aa4b8', 8); re(g, -46, -16, 92, 10, '#c8ccd4', 4); re(g, 40, -8, 26, 8, '#3a3a4a', 3); re(g, -66, -8, 26, 8, '#3a3a4a', 3); [-14, 4, 20].forEach(function (x) { g.beginPath(); g.moveTo(x, -22); g.quadraticCurveTo(x + 10, -34, x, -46); g.strokeStyle = 'rgba(255,255,255,.8)'; g.stroke(); }); },
    bolo: function (g) {
      re(g, -44, -2, 88, 44, '#f4c8a0', 4); g.beginPath(); g.moveTo(-44, 4); for (var x = -44; x <= 44; x += 11) g.quadraticCurveTo(x + 5.5, 18, x + 11, 4); g.lineTo(44, -6); g.lineTo(-44, -6); g.closePath(); pinta(g, '#ff8ab8');
      re(g, -3, -34, 6, 28, '#3a8aff', 2); po(g, [0, -48, -5, -38, 0, -32, 5, -38], '#ffaa22'); ci(g, -24, -4, 5, '#e83a3a'); ci(g, 24, -4, 5, '#e83a3a');
    },
    piano: function (g) {
      re(g, -54, -30, 108, 66, '#2a1a2a', 6); re(g, -48, 0, 96, 30, '#fff', 2);
      for (var x = -48; x < 48; x += 12) li(g, x, 0, x, 30); [-42, -30, -6, 6, 18, 30].forEach(function (x) { re(g, x, 0, 8, 18, '#1e1a2a', 1); });
      re(g, -40, -22, 80, 14, '#4a2a4a', 3);
    },
    ampulheta: function (g) {
      re(g, -34, -52, 68, 10, '#8a5a2a', 3); re(g, -34, 42, 68, 10, '#8a5a2a', 3);
      po(g, [-26, -42, 26, -42, 4, 0, 26, 42, -26, 42, -4, 0], '#d8f0ff'); po(g, [-12, -28, 12, -28, 2, -6, -2, -6], '#ffcc22'); po(g, [-22, 42, 22, 42, 0, 20], '#ffcc22');
    },
    relogio: function (g) { ci(g, 0, 0, 44, '#ffcc22'); ci(g, 0, 0, 36, '#fff'); for (var i = 0; i < 12; i++) { var a = i * Math.PI / 6; li(g, Math.cos(a) * 30, Math.sin(a) * 30, Math.cos(a) * 34, Math.sin(a) * 34); } li(g, 0, 0, 0, -24, K, 5); li(g, 0, 0, 16, 6, K, 5); ci(g, 0, 0, 4, '#e83a3a'); },
    carta: function (g) { re(g, -50, -32, 100, 64, '#fff', 4); po(g, [-50, -32, 0, 6, 50, -32], null, true); g.save(); g.translate(0, 8); g.scale(.3, .3); DES.coracao(g); g.restore(); },
    banana: function (g) { g.beginPath(); g.moveTo(-44, -30); g.quadraticCurveTo(-30, 40, 44, 20); g.quadraticCurveTo(-10, 20, -30, -34); g.closePath(); pinta(g, '#ffe04a'); re(g, -50, -40, 10, 12, '#6a4a1a', 2); },
    caixa: function (g) { re(g, -40, -40, 80, 80, '#ffcc22', 8); [[-30, -30], [30, -30], [-30, 30], [30, 30]].forEach(function (p) { ci(g, p[0], p[1], 3, '#c8901a'); }); texto(g, '?', 0, 4, 58, '#fff'); },
    bomba: function (g) { ci(g, 0, 8, 38, '#2a2a3a'); re(g, -10, -36, 20, 12, '#5a5a6a', 2); g.beginPath(); g.moveTo(0, -36); g.quadraticCurveTo(14, -54, 28, -48); g.stroke(); estrela5(g, 30, -50, 10, '#ffcc22'); brilho(g, -14, -6, 9); },
    bandeiraPirata: function (g) {
      li(g, -40, -50, -40, 54, '#6a4a2a', 6); g.beginPath(); g.moveTo(-40, -48); g.quadraticCurveTo(0, -60, 46, -44); g.lineTo(46, 12); g.quadraticCurveTo(0, -2, -40, 12); g.closePath(); pinta(g, '#1e1a2a');
      ci(g, 2, -24, 12, '#fff'); ci(g, -3, -26, 3, '#1e1a2a'); ci(g, 7, -26, 3, '#1e1a2a'); g.save(); g.strokeStyle = '#fff'; g.lineWidth *= 1.2; g.beginPath(); g.moveTo(-14, -2); g.lineTo(18, -12); g.moveTo(-14, -12); g.lineTo(18, -2); g.stroke(); g.restore();
    },
    blaster: function (g) {
      re(g, -50, -20, 84, 26, '#3a8aff', 10); re(g, 30, -14, 26, 14, '#ffcc22', 4); re(g, -36, 0, 22, 40, '#2a5ad0', 6); re(g, -14, 2, 12, 16, null, 4);
      ci(g, -24, -8, 6, '#ff5ad0'); ci(g, -6, -8, 6, '#3ac46a'); po(g, [58, -14, 70, -22, 70, 2, 58, -6], '#ffe04a');
    },
    ovo: function (g) { g.beginPath(); g.moveTo(0, -52); g.bezierCurveTo(38, -50, 44, 46, 0, 46); g.bezierCurveTo(-44, 46, -38, -50, 0, -52); pinta(g, '#a8e0a0'); [[-14, -20, 8], [12, -8, 10], [-8, 18, 9], [16, 26, 6]].forEach(function (s) { ci(g, s[0], s[1], s[2], '#5ab84a'); }); brilho(g, -14, -34, 8); },
    fogo: function (g) { g.beginPath(); g.moveTo(0, 48); g.bezierCurveTo(-50, 40, -40, -10, -14, -30); g.bezierCurveTo(-14, -10, -4, -4, 0, -10); g.bezierCurveTo(0, -30, 10, -46, 6, -58); g.bezierCurveTo(40, -30, 50, 40, 0, 48); pinta(g, '#ff6a22'); g.beginPath(); g.moveTo(0, 46); g.bezierCurveTo(-24, 40, -20, 10, -6, -4); g.bezierCurveTo(-2, 10, 8, 8, 8, 0); g.bezierCurveTo(24, 16, 22, 40, 0, 46); pinta(g, '#ffe04a'); },
    arco: function (g) {
      g.beginPath(); g.moveTo(-10, -54); g.quadraticCurveTo(50, 0, -10, 54); g.lineWidth *= 2.4; g.strokeStyle = K; g.stroke(); g.lineWidth /= 2.4; g.lineWidth *= 1.4; g.strokeStyle = '#a8743a'; g.stroke(); g.lineWidth /= 1.4;
      li(g, -10, -54, -10, 54, '#ddd', 2); li(g, -30, 0, 50, 0, '#8a5a2a', 5); po(g, [50, -8, 64, 0, 50, 8], '#c8ccd4'); po(g, [-30, 0, -40, -8, -36, 0, -40, 8], '#e83a3a');
    },
    maca: function (g) { g.beginPath(); g.moveTo(0, -24); g.bezierCurveTo(-50, -44, -50, 50, 0, 40); g.bezierCurveTo(50, 50, 50, -44, 0, -24); pinta(g, '#e83a3a'); li(g, 0, -24, 4, -44, '#6a4a1a', 5); el(g, 16, -40, 12, 6, '#4ac84a', -.4); brilho(g, -18, -10, 9); },
    gota: function (g) { g.beginPath(); g.moveTo(0, -50); g.bezierCurveTo(10, -24, 36, 0, 36, 16); g.arc(0, 16, 36, 0, Math.PI); g.bezierCurveTo(-36, 0, -10, -24, 0, -50); pinta(g, '#3a1a5a'); brilho(g, -14, 10, 8); },
    guitarra: function (g) {
      g.rotate(-.6); re(g, -6, -66, 12, 70, '#8a5a2a', 2); re(g, -10, -78, 20, 16, '#2a1a1a', 4);
      g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-46, -12, -40, 30, -20, 34); g.bezierCurveTo(-30, 64, 30, 64, 20, 34); g.bezierCurveTo(40, 30, 46, -12, 0, 0); pinta(g, '#e83a3a');
      ci(g, 0, 26, 8, '#1e1a2a'); re(g, -14, 40, 28, 6, '#2a2a3a', 2); li(g, -2, -62, -2, 44, '#eee', 1); li(g, 2, -62, 2, 44, '#eee', 1);
    },
    microfone: function (g) { g.rotate(.4); re(g, -8, 0, 16, 54, '#3a3a4a', 6); ci(g, 0, -12, 22, '#9aa4b8'); g.save(); g.strokeStyle = '#6a7488'; for (var i = -14; i <= 14; i += 7) { g.beginPath(); g.moveTo(-20, -12 + i); g.lineTo(20, -12 + i); g.stroke(); } g.restore(); ci(g, 0, -12, 22, null); },
    bolaVolei: function (g) {
      ci(g, 0, 0, 46, '#fff');
      g.save(); g.beginPath(); g.arc(0, 0, 46, 0, 7); g.clip();
      g.beginPath(); g.moveTo(-46, -10); g.quadraticCurveTo(0, -30, 30, -46); g.lineTo(46, -46); g.quadraticCurveTo(0, -12, -46, 6); g.closePath(); pinta(g, '#ffd23a');
      g.beginPath(); g.moveTo(-10, 46); g.quadraticCurveTo(0, 0, 46, -10); g.lineTo(46, 8); g.quadraticCurveTo(10, 14, 6, 46); g.closePath(); pinta(g, '#3a8aff');
      g.restore(); ci(g, 0, 0, 46, null); brilho(g, -20, -20, 9);
    },
    blocos: function (g) {
      var cores = ['#e83a3a', '#ffcc22', '#3ac46a', '#3a8aff'];
      for (var y = 0; y < 4; y++) for (var x = 0; x < 5; x++) if ((x + y) % 4 !== 3) re(g, -56 + x * 22.4, -56 + y * 14, 22, 13, cores[y], 2);
      ci(g, 6, 18, 8, '#fff'); re(g, -26, 42, 52, 10, '#c8ccd4', 5); li(g, 0, 26, -12, 40, 'rgba(255,255,255,.7)', 3);
    },
    bolinha: function (g) { ci(g, 0, 0, 26, '#fff'); brilho(g, -8, -8, 7); },
    grade: function (g) { re(g, -46, -46, 92, 92, null, 4); for (var x = -34; x <= 34; x += 17) re(g, x - 4, -46, 8, 92, '#7a8090', 3); re(g, -46, -46, 92, 10, '#5a6070', 3); re(g, -46, 36, 92, 10, '#5a6070', 3); },
    bau: function (g) {
      re(g, -48, -4, 96, 46, '#a8642a', 4); g.beginPath(); g.moveTo(-48, -4); g.lineTo(-48, -20); g.quadraticCurveTo(0, -56, 48, -20); g.lineTo(48, -4); g.closePath(); pinta(g, '#c87a3a');
      re(g, -48, -6, 96, 8, '#ffcc22', 2); re(g, -10, -10, 20, 22, '#ffcc22', 3); ci(g, 0, 2, 3, '#1e1a2a');
      ci(g, -24, -30, 8, '#ffcc22'); ci(g, 20, -32, 8, '#ffcc22'); po(g, [0, -40, 8, -30, 0, -20, -8, -30], '#4ad8ff');
    },
    semaforo: function (g) { re(g, -6, 30, 12, 26, '#3a3a4a'); re(g, -20, -56, 40, 88, '#2a2a3a', 8); ci(g, 0, -36, 10, '#ff3a3a'); ci(g, 0, -12, 10, '#5a4a1a'); ci(g, 0, 12, 10, '#2a4a2a'); brilho(g, -4, -40, 4); },
    cone: function (g) { re(g, -40, 34, 80, 12, '#ff6a22', 3); po(g, [-30, 34, -6, -46, 6, -46, 30, 34], '#ff7a2a'); po(g, [-20, 4, 20, 4, 14, -16, -14, -16], '#fff'); },
    placaP: function (g) { re(g, -6, 20, 12, 36, '#9aa4b8'); re(g, -36, -48, 72, 72, '#2a6ad8', 10); texto(g, 'P', 0, -10, 56, '#fff'); },
    quadriculada: function (g) {
      li(g, -40, -50, -40, 54, '#6a4a2a', 6);
      g.save(); g.beginPath(); g.rect(-40, -48, 84, 56); g.clip(); for (var y = 0; y < 4; y++) for (var x = 0; x < 6; x++) { g.fillStyle = (x + y) % 2 ? '#1e1a2a' : '#fff'; g.fillRect(-40 + x * 14, -48 + y * 14, 14, 14); } g.restore();
      re(g, -40, -48, 84, 56, null);
    },
    cursor: function (g) { po(g, [-20, -46, -20, 30, -4, 16, 8, 44, 20, 38, 8, 12, 30, 12], '#fff'); },
    corda: function (g) {
      g.save(); g.lineCap = 'round'; li(g, -60, 0, 60, 0, K, 14); li(g, -60, 0, 60, 0, '#d8b070', 9); for (var x = -56; x < 60; x += 10) li(g, x, -4, x + 6, 4, '#a8804a', 2); g.restore();
      re(g, -4, -10, 8, 20, '#e83a3a', 2);
      g.save(); g.translate(-48, -4); g.scale(.42, .42); DES.capivara(g); g.restore(); g.save(); g.translate(46, -18); g.scale(.4, .4); DES.cogu(g); g.restore();
    },
    bolaEspada: function (g, cor) { g.save(); g.translate(26, -24); g.scale(.7, .7); DES.espada(g); g.restore(); ci(g, -6, 8, 36, cor || '#e83a3a'); olho(g, -16, 0, 7); olho(g, 4, 0, 7); brilho(g, -18, -12, 8); },
    frasco: function (g, cor) {
      re(g, -10, -52, 20, 30, '#e8f4ff', 3); re(g, -14, -58, 28, 8, '#a8743a', 2);
      g.beginPath(); g.moveTo(-10, -24); g.lineTo(-40, 36); g.quadraticCurveTo(-42, 46, -30, 46); g.lineTo(30, 46); g.quadraticCurveTo(42, 46, 40, 36); g.lineTo(10, -24); g.closePath(); pinta(g, '#e8f4ff');
      g.beginPath(); g.moveTo(-26, 8); g.lineTo(26, 8); g.lineTo(38, 36); g.quadraticCurveTo(40, 44, 30, 44); g.lineTo(-30, 44); g.quadraticCurveTo(-40, 44, -38, 36); g.closePath(); pinta(g, cor || '#4ae07a');
      ci(g, -10, 24, 4, '#fff'); ci(g, 8, 32, 3, '#fff'); ci(g, 4, -40, 5, '#fff');
    },
    trem: function (g) {
      re(g, -60, -6, 70, 34, '#e83a3a', 4); re(g, 4, -36, 40, 64, '#e83a3a', 4); re(g, 12, -28, 24, 18, '#9ad6ff', 2); re(g, -48, -24, 12, 18, '#3a3a4a', 2); po(g, [-56, -24, -38, -24, -42, -34, -52, -34], '#3a3a4a');
      re(g, 44, 6, 14, 22, '#ffcc22', 2); [-44, -16, 26].forEach(function (x) { roda(g, x, 30, 11); }); ci(g, -48, -46, 8, '#ddd'); ci(g, -38, -58, 10, '#eee');
    },
    porta: function (g) { re(g, -38, -58, 76, 112, '#5a2a8a', 6); g.beginPath(); g.moveTo(-28, 54); g.lineTo(-28, -18); g.arc(0, -18, 28, Math.PI, 0); g.lineTo(28, 54); pinta(g, '#a8642a'); ci(g, 16, 14, 5, '#ffcc22'); texto(g, '?', 0, -16, 34, '#ffd23a'); },
    lupa: function (g) { g.rotate(-.5); re(g, -7, 20, 14, 44, '#6a3a1a', 5); ci(g, 0, -10, 34, '#c8d0dc'); ci(g, 0, -10, 26, 'rgba(180,225,255,.8)'); brilho(g, -10, -20, 9); }
  };
  function poe(g, nome, tam) {
    var p = String(nome).split(':'), f = DES[p[0]] || DES.estrela, k = tam / 100;
    g.save(); g.scale(k, k); g.lineWidth = 5; g.lineJoin = 'round'; g.lineCap = 'round'; g.strokeStyle = K;
    f(g, p[1]); g.restore();
  }

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
      case 'montanhas': // montanhas com neve no topo + flocos caindo
        g.lineWidth = 4; g.lineJoin = 'round';
        [[-30, 120, 150, '#8aa4c8'], [130, 150, 140, '#7a96bc'], [300, 110, 160, '#8aa4c8'], [440, 140, 130, '#7a96bc'],
         [40, 170, 120, '#5d7fa8'], [230, 185, 130, '#5d7fa8'], [390, 175, 115, '#5d7fa8']].forEach(function (m) {
          var x = m[0], topo = chao - m[1], b = m[2];
          po(g, [x - b, chao + 4, x, topo, x + b, chao + 4], m[3]);
          var s = 0.34, sx = b * s, sy = m[1] * s;
          po(g, [x - sx, topo + sy, x, topo, x + sx, topo + sy, x + sx * 0.45, topo + sy * 0.78, x + sx * 0.1, topo + sy * 1.05, x - sx * 0.35, topo + sy * 0.8], '#fff');
        });
        g.fillStyle = 'rgba(255,255,255,.95)';
        for (i = 0; i < 55; i++) { g.beginPath(); g.arc(R() * W, R() * H, 1.5 + R() * 2.5, 0, 7); g.fill(); }
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
    // as 3 coisas do jogo em volta
    var en = cfg[2] || [], pos = [[0.15, 0.62, 74], [0.86, 0.28, 64], [0.84, 0.72, 76]];
    for (i = 0; i < en.length && i < pos.length; i++) {
      g.save(); g.translate(W * pos[i][0], H * pos[i][1]); g.rotate((R() - 0.5) * 0.6);
      g.shadowColor = 'rgba(0,0,0,.3)'; g.shadowBlur = 8; g.shadowOffsetY = 4; poe(g, en[i], pos[i][2]); g.restore();
    }
    // linhas de velocidade + sombra + personagem principal pulando inclinado
    var px = W * 0.5, py = H * 0.46, lado = R() < 0.5 ? -1 : 1, ang = lado * (0.12 + R() * 0.22);
    g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 5; g.lineCap = 'round';
    for (i = -1; i <= 1; i++) { var ox = px - lado * 105, oy = py + 45 + i * 26; g.beginPath(); g.moveTo(ox, oy); g.lineTo(ox - lado * 50, oy + 28); g.stroke(); }
    g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(px, chao + 8, 80, 12, 0, 0, 7); g.fill();
    g.save(); g.translate(px, py); g.rotate(ang);
    g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 16; g.shadowOffsetY = 8;
    poe(g, cfg[1], 190); g.restore();
  }

  // gera as capas só quando o card chega perto da tela (1 canvas só, vira imagem)
  var tela = document.createElement('canvas'); tela.width = W; tela.height = H;
  var g = tela.getContext('2d');
  function geraCapa(card, pasta) {
    var img = card.querySelector('img.capa');
    if (FOTOS[pasta]) { img.src = FOTOS[pasta]; return; }
    try {
      g.setTransform(1, 0, 0, 1, 0, 0); g.shadowColor = 'transparent';
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
  // pra testar: cgCapaTeste('pasta') devolve um canvas com a capa
  window.cgCapaTeste = function (pasta) { var c = document.createElement('canvas'); c.width = W; c.height = H; desenha(c.getContext('2d'), pasta, CAPAS[pasta]); return c; };
  window.cgCapasLista = function () { return Object.keys(CAPAS); };
})();
