/* === COGUMELO GAMES — rádio do site (home + Minha Conta) ===
   30 músicas compostas na hora pelo navegador (Web Audio, sem arquivo de mp3,
   sem direito autoral). Cada música tem seu ritmo, tom, instrumento e bateria;
   a melodia sai de uma "semente", então a mesma música soa sempre igual.
   Tocam em ordem aleatória, uma depois da outra. Quando a pessoa entra num
   jogo a página muda e a música para sozinha.
   Botão 🎵 no canto: liga/desliga (lembra a escolha) e ⏭ pula a música.
   A ordem fica no sessionStorage, então de Home → Minha Conta continua na próxima. */
(function () {
  if (window.__cgRadio) return;
  window.__cgRadio = true;

  var LS = 'cg_radio';             // 'on' | 'off'
  var VOL = 0.16;
  var MAIOR = [0, 2, 4, 5, 7, 9, 11], MENOR = [0, 2, 3, 5, 7, 8, 10],
      DORICO = [0, 2, 3, 5, 7, 9, 10], MIXO = [0, 2, 4, 5, 7, 9, 10];

  // nome, bpm, tom (semitom acima de Dó), escala, acordes (graus), lead, bateria, semente
  var MUSICAS = [
    ['Cogumelo Feliz',        112, 0,  MAIOR,  [0, 5, 3, 4], 'quadrada', 'pop',    11],
    ['Floresta de Pixel',      96, 7,  MAIOR,  [0, 3, 4, 0], 'marimba',  'leve',   23],
    ['Capivara na Lagoa',      84, 5,  MAIOR,  [0, 4, 5, 3], 'marimba',  'nada',   37],
    ['Corrida do Kart',       138, 2,  MIXO,   [0, 6, 3, 0], 'quadrada', 'rapida', 41],
    ['Caverna Misteriosa',     90, 9,  MENOR,  [0, 5, 2, 6], 'sino',     'meia',   53],
    ['Ilha do Tesouro',       104, 4,  MAIOR,  [0, 3, 0, 4], 'triangulo','pop',    67],
    ['Noite de Estrelas',      76, 0,  MAIOR,  [5, 3, 0, 4], 'sino',     'nada',   71],
    ['Robô Dançarino',        124, 10, DORICO, [0, 3, 0, 6], 'quadrada', 'disco',  83],
    ['Pescaria Tranquila',     88, 2,  MAIOR,  [0, 1, 4, 0], 'marimba',  'leve',   97],
    ['Chefão Final',          132, 4,  MENOR,  [0, 5, 6, 4], 'serra',    'rapida', 101],
    ['Nuvem de Algodão',       80, 7,  MAIOR,  [0, 4, 3, 4], 'sino',     'nada',   113],
    ['Pulo do Ninja',         128, 9,  MENOR,  [0, 6, 5, 6], 'quadrada', 'pop',    127],
    ['Praia do Polvo',        100, 5,  MIXO,   [0, 6, 3, 0], 'marimba',  'leve',   131],
    ['Fábrica de Doces',      116, 0,  MAIOR,  [0, 3, 1, 4], 'triangulo','disco',  149],
    ['Espaço Sideral',         92, 3,  DORICO, [0, 3, 0, 3], 'sino',     'meia',   151],
    ['Festa do Cogu',         126, 7,  MAIOR,  [0, 4, 5, 3], 'quadrada', 'disco',  163],
    ['Dino Correndo',         140, 0,  MIXO,   [0, 6, 0, 3], 'quadrada', 'rapida', 179],
    ['Jardim Secreto',         86, 4,  MAIOR,  [0, 2, 3, 4], 'marimba',  'nada',   181],
    ['Castelo Assombrado',     98, 2,  MENOR,  [0, 3, 4, 0], 'sino',     'meia',   191],
    ['Pirata Valente',        110, 9,  MENOR,  [0, 6, 5, 4], 'triangulo','pop',    199],
    ['Chuva de Cogumelos',     94, 5,  MAIOR,  [3, 4, 0, 5], 'marimba',  'leve',   211],
    ['Arena de Brawl',        134, 11, MENOR,  [0, 5, 3, 6], 'serra',    'rapida', 223],
    ['Bolhas de Sabão',        82, 0,  MAIOR,  [0, 5, 1, 4], 'sino',     'nada',   227],
    ['Trem do Cogu',          120, 2,  MAIOR,  [0, 0, 3, 4], 'triangulo','pop',    239],
    ['Labirinto',             106, 7,  DORICO, [0, 3, 6, 3], 'quadrada', 'meia',   241],
    ['Vôlei na Areia',        118, 4,  MIXO,   [0, 3, 6, 0], 'marimba',  'disco',  251],
    ['Sorvete de Arco-Íris',  102, 9,  MAIOR,  [0, 4, 5, 3], 'triangulo','leve',   263],
    ['Missão no Gelo',         88, 1,  MENOR,  [0, 2, 5, 6], 'sino',     'meia',   271],
    ['Cidade Neon',           122, 6,  DORICO, [0, 3, 0, 4], 'serra',    'disco',  281],
    ['Boa Noite, Cogu',        72, 5,  MAIOR,  [0, 3, 4, 0], 'marimba',  'nada',   293]
  ];

  var ac = null, master = null, ruido = null, tocando = false, timer = null;
  var musica = null, proxTempo = 0, passo = 0, fimMusica = 0;

  function ligado() { try { return localStorage.getItem(LS) !== 'off'; } catch (e) { return true; } }
  function salva(v) { try { localStorage.setItem(LS, v); } catch (e) {} }

  // ---- ordem aleatória que continua entre as páginas ----
  function embaralha() {
    var o = [];
    for (var i = 0; i < MUSICAS.length; i++) o.push(i);
    for (var j = o.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1)), t = o[j]; o[j] = o[k]; o[k] = t;
    }
    return o;
  }
  var fila, pos;
  try { fila = JSON.parse(sessionStorage.getItem('cg_radio_fila')); pos = +sessionStorage.getItem('cg_radio_pos') || 0; } catch (e) {}
  if (!fila || fila.length !== MUSICAS.length) { fila = embaralha(); pos = 0; }
  function guardaFila() {
    try { sessionStorage.setItem('cg_radio_fila', JSON.stringify(fila)); sessionStorage.setItem('cg_radio_pos', pos); } catch (e) {}
  }

  // ---- monta uma música a partir dos dados ----
  function rnd(seed) {
    return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  }
  var RITMOS = [
    [1,0,0,0, 1,0,1,0, 1,0,0,0, 1,0,0,0],
    [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0],
    [1,0,1,0, 1,0,1,0, 1,0,0,0, 0,0,0,0],
    [1,0,0,0, 0,0,0,0, 1,0,1,0, 1,0,1,0],
    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    [0,0,1,0, 1,0,0,1, 0,0,1,0, 1,0,0,0],
    [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
  ];
  function compoe(d) {
    var r = rnd(d[7]), escala = d[3], acordes = d[4];
    // uma frase de 4 compassos (64 passos de semicolcheia): null = silêncio
    function frase() {
      var notas = [], idx = 7 + Math.floor(r() * 4);
      for (var c = 0; c < 4; c++) {
        var ritmo = RITMOS[Math.floor(r() * RITMOS.length)];
        if (c === 3 && r() < 0.6) ritmo = RITMOS[6];          // fim de frase respira
        var grau = acordes[c];
        for (var s = 0; s < 16; s++) {
          if (!ritmo[s]) { notas.push(null); continue; }
          if (s % 4 === 0) {
            // tempo forte: nota do acorde mais perto
            var alvos = [grau, grau + 2, grau + 4], melhor = idx, dist = 99;
            for (var o = 7; o <= 14; o += 7) alvos.forEach(function (a) {
              var cand = o + (a % 7), dd = Math.abs(cand - idx);
              if (dd < dist) { dist = dd; melhor = cand; }
            });
            idx = melhor;
          } else {
            idx += Math.floor(r() * 5) - 2;
          }
          if (idx < 5) idx = 7; if (idx > 16) idx = 13;
          notas.push(idx);
        }
      }
      return notas;
    }
    var A = frase(), B = frase();
    // forma: introdução, A A B A B B A, final
    return { d: d, partes: ['I', 'A', 'A', 'B', 'A', 'B', 'B', 'A', 'F'], A: A, B: B,
             passoDur: 60 / d[1] / 4 };
  }

  function freqGrau(m, idx) {             // idx = grau da escala (0 = tônica grave)
    var esc = m.d[3], oit = Math.floor(idx / 7), g = ((idx % 7) + 7) % 7;
    var midi = 48 + m.d[2] + oit * 12 + esc[g];
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // ---- instrumentos ----
  function env(g, t, ataque, vol, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + ataque);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }
  function osc(tipo, f, t, dur, vol, ataque, destino) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = tipo; o.frequency.value = f;
    env(g, t, ataque || 0.01, vol, dur);
    o.connect(g); g.connect(destino || master);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function lead(tipo, f, t, dur) {
    if (tipo === 'marimba') {
      osc('sine', f, t, dur * 1.4 + 0.3, 0.32, 0.005);
      osc('sine', f * 4, t, 0.12, 0.06, 0.003);
    } else if (tipo === 'sino') {
      osc('sine', f, t, dur * 2 + 0.6, 0.24, 0.005);
      osc('sine', f * 2.76, t, 0.5, 0.05, 0.003);
    } else {
      var fl = ac.createBiquadFilter();
      fl.type = 'lowpass'; fl.frequency.value = tipo === 'serra' ? 1800 : 2600;
      fl.connect(master);
      var v = tipo === 'triangulo' ? 0.28 : 0.1;
      osc(tipo === 'quadrada' ? 'square' : tipo === 'serra' ? 'sawtooth' : 'triangle',
          f, t, Math.max(0.08, dur * 0.9), v, 0.01, fl);
    }
  }
  function baixo(f, t, dur) { osc('triangle', f, t, dur, 0.3, 0.01); }
  function pad(fs, t, dur) {
    var fl = ac.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = 900; fl.connect(master);
    fs.forEach(function (f) { osc('triangle', f, t, dur, 0.05, dur * 0.3, fl); });
  }
  function bumbo(t) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    env(g, t, 0.003, 0.5, 0.18);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.2);
  }
  function chiado(t, dur, vol, corte) {
    var s = ac.createBufferSource(), g = ac.createGain(), fl = ac.createBiquadFilter();
    s.buffer = ruido; fl.type = 'highpass'; fl.frequency.value = corte;
    env(g, t, 0.002, vol, dur);
    s.connect(fl); fl.connect(g); g.connect(master);
    s.start(t); s.stop(t + dur + 0.02);
  }
  var BATERIAS = {           // b = bumbo, c = caixa, h = chimbal (16 passos)
    pop:    { b: [0, 8, 10], c: [4, 12], h: [0, 2, 4, 6, 8, 10, 12, 14] },
    rapida: { b: [0, 6, 8, 14], c: [4, 12], h: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
    disco:  { b: [0, 4, 8, 12], c: [4, 12], h: [2, 6, 10, 14] },
    meia:   { b: [0], c: [8], h: [0, 4, 8, 12] },
    leve:   { b: [0, 8], c: [], h: [4, 12] },
    nada:   { b: [], c: [], h: [] }
  };

  // ---- toca um passo (semicolcheia) da música ----
  function tocaPasso(m, n, t) {
    var total = m.partes.length * 64;
    if (n >= total) return false;
    var parte = m.partes[Math.floor(n / 64)], p = n % 64, c = Math.floor(p / 16), s = p % 16;
    var d = m.d, grau = d[4][c], pd = m.passoDur;
    var raiz = freqGrau(m, grau % 7);

    // pad em todo compasso
    if (s === 0) pad([freqGrau(m, 7 + grau), freqGrau(m, 9 + grau), freqGrau(m, 11 + grau)], t, pd * 16);
    // baixo
    if (parte !== 'F' || c === 0) {
      if (s === 0 || s === 8 || (d[6] !== 'nada' && d[6] !== 'leve' && (s === 6 || s === 14)))
        baixo(raiz / 2, t, pd * (s % 8 === 0 ? 5 : 2));
    }
    // bateria (não toca na introdução)
    if (parte !== 'I') {
      var bt = BATERIAS[d[6]];
      if (parte === 'F' && c > 0) bt = BATERIAS.nada;
      if (bt.b.indexOf(s) >= 0) bumbo(t);
      if (bt.c.indexOf(s) >= 0) chiado(t, 0.15, 0.22, 1200);
      if (bt.h.indexOf(s) >= 0) chiado(t, 0.04, 0.07, 7000);
    }
    // melodia
    if (parte === 'A' || parte === 'B') {
      var frase = m[parte], nota = frase[p];
      if (nota != null) {
        var dur = 1;
        while (p + dur < 64 && frase[p + dur] == null && dur < 8) dur++;
        lead(d[5], freqGrau(m, nota), t, dur * pd);
      }
    } else if (parte === 'I' && s % 4 === 0 && c >= 2) {
      // introdução: arpejo subindo
      lead(d[5], freqGrau(m, 7 + grau + (s / 4) * 2), t, pd * 3);
    } else if (parte === 'F' && p === 0) {
      lead(d[5], freqGrau(m, 14), t, pd * 12);
    }
    return true;
  }

  function agenda() {
    if (!tocando || !ac) return;
    while (proxTempo < ac.currentTime + 0.35) {
      if (!musica || !tocaPasso(musica, passo, proxTempo)) {
        // acabou: pausa de 1,5s e vem a próxima
        pos = (pos + 1) % fila.length;
        if (pos === 0) fila = embaralha();
        guardaFila();
        carrega();
        proxTempo += 1.5;
        continue;
      }
      proxTempo += musica.passoDur;
      passo++;
    }
  }

  function carrega() {
    musica = compoe(MUSICAS[fila[pos]]);
    passo = 0;
    pintaBotao();
  }

  function criaAudio() {
    if (ac) return ac;
    try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    master = ac.createGain(); master.gain.value = 0;
    var comp = ac.createDynamicsCompressor();
    master.connect(comp); comp.connect(ac.destination);
    ruido = ac.createBuffer(1, ac.sampleRate * 0.3, ac.sampleRate);
    var dd = ruido.getChannelData(0);
    for (var i = 0; i < dd.length; i++) dd[i] = Math.random() * 2 - 1;
    return ac;
  }

  function comeca() {
    if (tocando || !ligado()) return;
    if (!criaAudio()) return;
    if (ac.state === 'suspended') ac.resume();
    tocando = true;
    if (!musica) carrega();
    proxTempo = ac.currentTime + 0.1;
    master.gain.cancelScheduledValues(ac.currentTime);
    master.gain.setValueAtTime(0.0001, ac.currentTime);
    master.gain.linearRampToValueAtTime(VOL, ac.currentTime + 1.5);
    timer = setInterval(agenda, 100);
    agenda();
    pintaBotao();
  }

  function para() {
    tocando = false;
    if (timer) { clearInterval(timer); timer = null; }
    if (master && ac) {
      master.gain.cancelScheduledValues(ac.currentTime);
      master.gain.setValueAtTime(master.gain.value, ac.currentTime);
      master.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 0.4);
    }
    pintaBotao();
  }

  function pula() {
    pos = (pos + 1) % fila.length;
    if (pos === 0) fila = embaralha();
    guardaFila();
    carrega();
    if (tocando && ac) proxTempo = ac.currentTime + 0.5;
  }

  // ---- botãozinho ----
  var caixa, btn, nome, pular;
  function pintaBotao() {
    if (!btn) return;
    var on = ligado();
    btn.textContent = on ? '🎵' : '🔇';
    btn.title = on ? 'Desligar a música' : 'Ligar a música';
    nome.textContent = on && musica ? musica.d[0] : '';
    nome.style.display = on && musica ? 'inline' : 'none';
    pular.style.display = on ? 'inline-block' : 'none';
    caixa.style.opacity = on ? '0.95' : '0.6';
  }
  function criaBotao() {
    caixa = document.createElement('div');
    caixa.id = 'cg-radio';
    caixa.style.cssText =
      'position:fixed; right:12px; bottom:92px; z-index:2147482000; display:flex; align-items:center; gap:6px;' +
      'background:rgba(10,10,30,.78); border:2px solid rgba(255,255,255,.3); border-radius:22px; padding:4px 6px;' +
      'color:#fff; font-family:Arial,sans-serif; font-size:12px; max-width:min(70vw,260px);';
    var est = 'border:none; background:none; color:#fff; font-size:20px; cursor:pointer; padding:2px 4px; line-height:1;';
    btn = document.createElement('button'); btn.style.cssText = est;
    nome = document.createElement('span');
    nome.style.cssText = 'white-space:nowrap; overflow:hidden; text-overflow:ellipsis;';
    pular = document.createElement('button'); pular.style.cssText = est + 'font-size:16px;';
    pular.textContent = '⏭'; pular.title = 'Próxima música';
    btn.onclick = function (e) {
      e.preventDefault(); e.stopPropagation();
      if (ligado()) { salva('off'); para(); } else { salva('on'); comeca(); }
    };
    pular.onclick = function (e) {
      e.preventDefault(); e.stopPropagation();
      pula(); if (!tocando) comeca();
    };
    caixa.appendChild(btn); caixa.appendChild(nome); caixa.appendChild(pular);
    document.body.appendChild(caixa);
    musica = compoe(MUSICAS[fila[pos]]);
    pintaBotao();
  }

  // navegador só deixa tocar depois que a pessoa mexe na página
  function primeiroToque() {
    comeca();
    if (tocando) ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
      window.removeEventListener(ev, primeiroToque, true);
    });
  }
  function inicia() {
    criaBotao();
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
      window.addEventListener(ev, primeiroToque, true);
    });
    // clicou num jogo: a música some antes de trocar de página
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (a && !/\/conta\/?$|^\/?$|^#/.test(a.getAttribute('href'))) para();
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inicia);
  else inicia();

  // trocou de aba / voltou pelo botão "voltar" do navegador
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (tocando) { para(); tocando = false; window.__cgRadioVolta = true; } }
    else if (window.__cgRadioVolta) { window.__cgRadioVolta = false; comeca(); }
  });
  window.addEventListener('pagehide', para);
  window.addEventListener('pageshow', function (e) { if (e.persisted && ligado() && ac) comeca(); });

  window.cgRadio = { comeca: comeca, para: para, pula: pula, musicas: MUSICAS };
})();
