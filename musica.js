/* === COGUMELO GAMES — musiquinha de fundo relaxante ===
   Nada de robô: as notas são tocadas como marimba/kalimba (nota + harmônicos
   que somem em tempos diferentes), com vibrato leve, eco e um pad suave por
   baixo. A melodia é sorteada numa escala pentatônica, então nunca sai nota
   errada e nunca fica igual duas vezes.
   Volume bem baixinho. Botão 🔊/🔇 no canto, e ele lembra da sua escolha. */
(function () {
  if (window.__cgMusica) return;
  window.__cgMusica = true;

  var LS = 'cg_musica';            // 'on' | 'off'
  var VOL = 0.17;                  // o Davi pediu bem mais alta (era 0.055)
  var ac = null, master = null, timer = null, tocando = false;

  // pentatônica maior de Dó, 2 oitavas (sem nota errada)
  var ESCALA = [261.63, 293.66, 329.63, 392.00, 440.00,
                523.25, 587.33, 659.25, 783.99, 880.00];
  // acordes do pad: I, vi, IV, V — a volta clássica que soa calma
  var ACORDES = [[130.81, 164.81, 196.00], [110.00, 130.81, 164.81],
                 [174.61, 220.00, 261.63], [196.00, 246.94, 293.66]];
  var passo = 0, acorde = 0;

  function ligado() {
    try { return localStorage.getItem(LS) !== 'off'; } catch (e) { return true; }
  }
  function salva(v) { try { localStorage.setItem(LS, v); } catch (e) {} }

  function criaAudio() {
    if (ac) return ac;
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { return null; }

    master = ac.createGain();
    master.gain.value = 0;                      // entra devagarinho
    // eco curtinho: dá sensação de espaço, tira o ar de "bip de computador"
    var delay = ac.createDelay(1.0);
    delay.delayTime.value = 0.42;
    var fb = ac.createGain(); fb.gain.value = 0.3;
    var ecoVol = ac.createGain(); ecoVol.gain.value = 0.35;
    delay.connect(fb); fb.connect(delay);
    delay.connect(ecoVol); ecoVol.connect(ac.destination);
    master.connect(delay);
    master.connect(ac.destination);
    return ac;
  }

  // uma nota de marimba: fundamental + harmônicos somindo em tempos diferentes
  function nota(freq, quando, dur, vol) {
    var filtro = ac.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.setValueAtTime(freq * 6, quando);
    filtro.frequency.exponentialRampToValueAtTime(Math.max(220, freq * 1.6), quando + dur);
    filtro.connect(master);

    var lfo = ac.createOscillator(), lfoG = ac.createGain();
    lfo.frequency.value = 4.6 + Math.random();
    lfoG.gain.value = freq * 0.005;
    lfo.connect(lfoG);
    lfo.start(quando); lfo.stop(quando + dur + 0.1);

    [[1, 1.0, dur], [2.01, 0.3, dur * 0.5], [3.03, 0.14, dur * 0.3]].forEach(function (h) {
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq * h[0] * 1.03, quando);
      o.frequency.exponentialRampToValueAtTime(freq * h[0], quando + 0.06);
      lfoG.connect(o.frequency);
      g.gain.setValueAtTime(0.0001, quando);
      g.gain.exponentialRampToValueAtTime(vol * h[1], quando + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, quando + h[2]);
      o.connect(g); g.connect(filtro);
      o.start(quando); o.stop(quando + h[2] + 0.1);
    });
  }

  // pad: acorde comprido e abafado por baixo de tudo
  function pad(freqs, quando, dur) {
    freqs.forEach(function (f) {
      var o = ac.createOscillator(), g = ac.createGain(), fl = ac.createBiquadFilter();
      fl.type = 'lowpass'; fl.frequency.value = 700;
      o.type = 'triangle';
      o.frequency.setValueAtTime(f, quando);
      g.gain.setValueAtTime(0.0001, quando);
      g.gain.exponentialRampToValueAtTime(0.09, quando + dur * 0.35);
      g.gain.exponentialRampToValueAtTime(0.0001, quando + dur);
      o.connect(g); g.connect(fl); fl.connect(master);
      o.start(quando); o.stop(quando + dur + 0.1);
    });
  }

  // um compasso: troca o acorde e espalha 2 a 4 notinhas por cima
  function compasso() {
    if (!ac || ac.state === 'closed') return;
    var t = ac.currentTime + 0.05, dur = 4.2;
    pad(ACORDES[acorde % ACORDES.length], t, dur);
    acorde++;

    var quantas = 2 + Math.floor(Math.random() * 3);
    for (var i = 0; i < quantas; i++) {
      var atraso = (i / quantas) * dur + Math.random() * 0.5;
      // anda pouquinho na escala: melodia que "caminha", não pula
      passo += Math.floor(Math.random() * 5) - 2;
      if (passo < 0) passo += ESCALA.length;
      passo = passo % ESCALA.length;
      nota(ESCALA[passo], t + atraso, 1.6 + Math.random(), 0.16 + Math.random() * 0.08);
    }
  }

  function começa() {
    if (tocando || !ligado()) return;
    if (!criaAudio()) return;
    if (ac.state === 'suspended') ac.resume();
    tocando = true;
    master.gain.cancelScheduledValues(ac.currentTime);
    master.gain.setValueAtTime(master.gain.value || 0.0001, ac.currentTime);
    master.gain.linearRampToValueAtTime(VOL, ac.currentTime + 2.5);   // fade in suave
    compasso();
    timer = setInterval(compasso, 4200);
    pintaBotao();
  }

  function para() {
    tocando = false;
    if (timer) { clearInterval(timer); timer = null; }
    if (master && ac) {
      master.gain.cancelScheduledValues(ac.currentTime);
      master.gain.setValueAtTime(master.gain.value, ac.currentTime);
      master.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 0.8);
    }
    pintaBotao();
  }

  // ---- botãozinho no canto ----
  var btn;
  function pintaBotao() {
    if (!btn) return;
    var on = ligado();
    btn.textContent = on ? '🔊' : '🔇';
    btn.title = on ? 'Desligar a musiquinha' : 'Ligar a musiquinha';
    btn.style.opacity = on ? '0.92' : '0.5';
  }
  function criaBotao() {
    btn = document.createElement('button');
    btn.id = 'cg-musica-btn';
    btn.style.cssText =
      'position:fixed; right:10px; bottom:10px; z-index:2147482000;' +
      'width:44px; height:44px; border-radius:50%; border:2px solid rgba(255,255,255,.35);' +
      'background:rgba(10,10,30,.72); color:#fff; font-size:20px; cursor:pointer;' +
      'padding:0; line-height:1; display:flex; align-items:center; justify-content:center;';
    btn.onclick = function (e) {
      e.preventDefault(); e.stopPropagation();
      if (ligado()) { salva('off'); para(); }
      else { salva('on'); começa(); }
    };
    (document.body || document.documentElement).appendChild(btn);
    pintaBotao();
  }

  // navegador só deixa tocar som depois que a pessoa mexe na página
  function primeiroToque() {
    começa();
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
      window.removeEventListener(ev, primeiroToque);
    });
  }
  function inicia() {
    criaBotao();
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
      window.addEventListener(ev, primeiroToque, { once: false });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inicia);
  else inicia();

  // se trocar de aba, baixa o volume pra não incomodar
  document.addEventListener('visibilitychange', function () {
    if (!ac || !master) return;
    var alvo = document.hidden ? 0.0001 : (tocando ? VOL : 0.0001);
    master.gain.cancelScheduledValues(ac.currentTime);
    master.gain.setValueAtTime(master.gain.value, ac.currentTime);
    master.gain.linearRampToValueAtTime(alvo, ac.currentTime + 0.5);
  });

  window.cgMusica = { começa: começa, para: para, ligado: ligado };
})();
