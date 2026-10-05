/* === COGUMELO GAMES — musiquinha de fundo, versão configurável ===
   Nada de bip de robô: cada nota é tocada como marimba (a nota mais dois
   harmônicos que somem em tempos diferentes), com vibrato leve, eco curto e
   um pad comprido por baixo. A melodia sai de uma escala pentatônica, então
   nunca cai numa nota errada e nunca sai igual duas vezes. Volume bem baixo.

   Use assim:
     cgMusiquinha({ chave:'meujogo_musica', clima:'calmo', intensidade: function(){ return 0; } });

   clima: 'calmo' (pentatônica maior, fofinho) ou 'misterio' (menor, tenso)
   intensidade: função que devolve 0 a 1 — quanto maior, mais apertado o ritmo */
window.cgMusiquinha = function (op) {
  op = op || {};
  var LS = op.chave || 'cg_musiquinha';
  var VOL = (typeof op.volume === 'number') ? op.volume : 0.16;   // bem mais alta (era 0.05)
  var intensidade = op.intensidade || function () { return 0; };
  var baixo = op.botaoEmBaixo || 112;

  var CLIMAS = {
    calmo: {
      escala: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00],
      acordes: [[130.81,164.81,196.00],[110.00,130.81,164.81],[174.61,220.00,261.63],[196.00,246.94,293.66]]
    },
    misterio: {
      escala: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99],
      acordes: [[110.00,130.81,164.81],[146.83,174.61,220.00],[130.81,164.81,196.00],[98.00,123.47,146.83]]
    }
  };
  var C = CLIMAS[op.clima] || CLIMAS.calmo;

  var a = null, master = null, timer = null, tocando = false, passo = 0, acorde = 0;

  function ligado() { try { return localStorage.getItem(LS) !== 'off'; } catch (e) { return true; } }
  function guarda(v) { try { localStorage.setItem(LS, v); } catch (e) {} }

  function cria() {
    if (a) return a;
    try { a = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    master = a.createGain();
    master.gain.value = 0;
    var delay = a.createDelay(1.0); delay.delayTime.value = 0.4;
    var fb = a.createGain(); fb.gain.value = 0.3;
    var eco = a.createGain(); eco.gain.value = 0.33;
    delay.connect(fb); fb.connect(delay);
    delay.connect(eco); eco.connect(a.destination);
    master.connect(delay); master.connect(a.destination);
    return a;
  }

  function nota(freq, quando, dur, vol) {
    var fl = a.createBiquadFilter();
    fl.type = 'lowpass';
    fl.frequency.setValueAtTime(freq * 6, quando);
    fl.frequency.exponentialRampToValueAtTime(Math.max(200, freq * 1.5), quando + dur);
    fl.connect(master);
    var lfo = a.createOscillator(), lg = a.createGain();
    lfo.frequency.value = 4.3 + Math.random();
    lg.gain.value = freq * 0.005;
    lfo.connect(lg);
    lfo.start(quando); lfo.stop(quando + dur + 0.1);
    [[1, 1, dur], [2.01, 0.28, dur * 0.5], [3.02, 0.12, dur * 0.3]].forEach(function (h) {
      var o = a.createOscillator(), g = a.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq * h[0] * 1.03, quando);
      o.frequency.exponentialRampToValueAtTime(freq * h[0], quando + 0.06);
      lg.connect(o.frequency);
      g.gain.setValueAtTime(0.0001, quando);
      g.gain.exponentialRampToValueAtTime(vol * h[1], quando + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, quando + h[2]);
      o.connect(g); g.connect(fl);
      o.start(quando); o.stop(quando + h[2] + 0.1);
    });
  }

  function pad(freqs, quando, dur) {
    freqs.forEach(function (f) {
      var o = a.createOscillator(), g = a.createGain(), fl = a.createBiquadFilter();
      fl.type = 'lowpass'; fl.frequency.value = 640;
      o.type = 'triangle';
      o.frequency.setValueAtTime(f, quando);
      g.gain.setValueAtTime(0.0001, quando);
      g.gain.exponentialRampToValueAtTime(0.055, quando + dur * 0.35);
      g.gain.exponentialRampToValueAtTime(0.0001, quando + dur);
      o.connect(g); g.connect(fl); fl.connect(master);
      o.start(quando); o.stop(quando + dur + 0.1);
    });
  }

  function compasso() {
    if (!a || !tocando) return;
    var agora = a.currentTime + 0.05;
    var t = Math.max(0, Math.min(1, intensidade() || 0));
    var bat = 0.64 - t * 0.10;
    if (passo % 8 === 0) {
      pad(C.acordes[acorde % C.acordes.length], agora, bat * 8.4);
      acorde++;
    }
    for (var i = 0; i < 4; i++) {
      if (Math.random() < (0.55 + t * 0.18)) {
        var oit = Math.random() < 0.3 ? 5 : 0;
        var n = C.escala[Math.floor(Math.random() * 5) + oit];
        nota(n, agora + i * bat, bat * (1.5 + Math.random()), 0.085 + Math.random() * 0.03);
      }
    }
    passo += 4;
    timer = setTimeout(compasso, bat * 4 * 1000);
  }

  function comeca() {
    if (tocando || !ligado()) return;
    if (!cria()) return;
    if (a.state === 'suspended') a.resume();
    tocando = true;
    master.gain.cancelScheduledValues(a.currentTime);
    master.gain.setValueAtTime(0.0001, a.currentTime);
    master.gain.linearRampToValueAtTime(VOL, a.currentTime + 2.2);   // entra devagarinho
    passo = 0;
    compasso();
    pinta();
  }
  function para() {
    tocando = false;
    clearTimeout(timer);
    if (master && a) {
      master.gain.cancelScheduledValues(a.currentTime);
      master.gain.setValueAtTime(master.gain.value, a.currentTime);
      master.gain.linearRampToValueAtTime(0.0001, a.currentTime + 0.6);
    }
    pinta();
  }

  var btn = null;
  function pinta() {
    if (!btn) return;
    btn.textContent = ligado() ? '🔊' : '🔇';
    btn.title = ligado() ? 'Desligar a musiquinha' : 'Ligar a musiquinha';
  }
  function criaBotao() {
    btn = document.createElement('button');
    btn.type = 'button';
    btn.style.cssText =
      'position:fixed; right:10px; bottom:' + baixo + 'px; z-index:2147482100;' +
      'width:44px; height:44px; border-radius:50%; border:2px solid rgba(255,255,255,.35);' +
      'background:rgba(10,5,24,.78); color:#fff; font-size:20px; cursor:pointer; padding:0;' +
      'line-height:1; display:flex; align-items:center; justify-content:center;';
    btn.onclick = function (e) {
      e.preventDefault(); e.stopPropagation();
      if (ligado()) { guarda('off'); para(); } else { guarda('on'); comeca(); }
    };
    (document.body || document.documentElement).appendChild(btn);
    pinta();
  }

  function inicia() {
    criaBotao();
    // o navegador só deixa tocar depois que a pessoa mexe na página
    function primeiroToque() {
      comeca();
      ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
        window.removeEventListener(ev, primeiroToque);
      });
    }
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
      window.addEventListener(ev, primeiroToque);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inicia);
  else inicia();

  document.addEventListener('visibilitychange', function () {
    if (!a || !master) return;
    var alvo = document.hidden ? 0.0001 : (tocando ? VOL : 0.0001);
    master.gain.cancelScheduledValues(a.currentTime);
    master.gain.setValueAtTime(master.gain.value, a.currentTime);
    master.gain.linearRampToValueAtTime(alvo, a.currentTime + 0.5);
  });

  return { comeca: comeca, para: para, ligado: ligado };
};
