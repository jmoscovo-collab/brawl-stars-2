/* === COGUMELO GAMES — escolha da LETRA do site ===
   Dá pra trocar entre a letra de celular (a de sempre) e a letra de mão
   (cursiva, como se alguém tivesse escrito). Vale no site inteiro e dentro
   dos jogos, e fica guardada em localStorage. Escolha em /conta/ (⚙️ → ✍️ Letra). */
(function () {
  if (window.cgLetra) return;

  var CHAVE = 'cg_letra';

  var LETRAS = {
    celular: {
      nome: 'Letra de celular',
      exemplo: 'A capivara come cogumelo',
      desc: 'A letra de sempre, bem fácil de ler.',
      css: null,
      fonte: null
    },
    mao: {
      nome: 'Letra de mão',
      exemplo: 'A capivara come cogumelo',
      desc: 'Parece escrita à mão, com caneta.',
      // Patrick Hand é redondinha e MUITO mais fácil de ler que uma cursiva de verdade
      css: 'https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap',
      fonte: "'Patrick Hand', 'Comic Sans MS', cursive"
    },
    cursiva: {
      nome: 'Letra de mão emendada',
      exemplo: 'A capivara come cogumelo',
      desc: 'Cursiva de verdade, toda emendada. Mais bonita, mais difícil de ler.',
      css: 'https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap',
      fonte: "'Caveat', 'Comic Sans MS', cursive"
    }
  };

  function escolhida() {
    try {
      var v = localStorage.getItem(CHAVE);
      return LETRAS[v] ? v : 'celular';
    } catch (e) { return 'celular'; }
  }

  function carregaFonte(url) {
    if (!url) return;
    if (document.querySelector('link[data-cg-letra="' + url + '"]')) return;
    var pre = document.createElement('link');
    pre.rel = 'preconnect'; pre.href = 'https://fonts.gstatic.com'; pre.crossOrigin = '';
    document.head.appendChild(pre);
    var l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = url;
    l.setAttribute('data-cg-letra', url);
    document.head.appendChild(l);
  }

  var estilo = null;
  function aplica() {
    var id = escolhida();
    var L = LETRAS[id];
    if (!estilo) {
      estilo = document.createElement('style');
      estilo.id = 'cg-letra-estilo';
      (document.head || document.documentElement).appendChild(estilo);
    }
    if (!L.fonte) { estilo.textContent = ''; return; }
    carregaFonte(L.css);
    // a letra de mão é menorzinha de natureza, então cresce um tico pra ler bem
    var cresce = (id === 'cursiva') ? 1.22 : 1.06;
    estilo.textContent =
      'body, button, input, textarea, select, h1, h2, h3, h4, .game-name, .game-desc, .bt, .mb {' +
      '  font-family: ' + L.fonte + ' !important;' +
      '  font-size-adjust: none;' +
      '}' +
      'body { font-size: calc(1em * ' + cresce + '); }' +
      /* os emojis e os ícones não podem virar letra de mão */
      '.game-icon, .emoji, .ic, .i, .e, .emo { font-family: inherit !important; }';
  }

  function escolhe(id) {
    if (!LETRAS[id]) return;
    try { localStorage.setItem(CHAVE, id); } catch (e) {}
    aplica();
    try { window.dispatchEvent(new CustomEvent('cgletra', { detail: id })); } catch (e) {}
  }

  window.cgLetra = { escolhida: escolhida, escolhe: escolhe, aplica: aplica, LETRAS: LETRAS };

  // aplica o quanto antes, pra página não "piscar" com a letra errada
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aplica);
  aplica();

  // ---- a telinha de escolher (só existe onde tem a engrenagem) ----
  window.abreLetra = function () {
    var fundo = document.createElement('div');
    fundo.id = 'cg-letra-tela';
    fundo.style.cssText =
      'position:fixed; inset:0; z-index:2147483000; background:rgba(5,5,20,.93);' +
      'display:flex; flex-direction:column; align-items:center; justify-content:center;' +
      'gap:12px; padding:20px 16px; overflow-y:auto; color:#fff;';

    var tit = document.createElement('div');
    tit.textContent = '✍️ Qual letra você quer?';
    tit.style.cssText = 'font-size:22px; font-weight:bold; text-align:center; margin-bottom:4px';

    var sub = document.createElement('div');
    sub.textContent = 'Vale no site inteiro e dentro dos jogos.';
    sub.style.cssText = 'font-size:14px; opacity:.8; text-align:center; max-width:360px';
    fundo.append(tit, sub);

    Object.keys(LETRAS).forEach(function (id) {
      var L = LETRAS[id];
      carregaFonte(L.css);
      var b = document.createElement('button');
      var atual = escolhida() === id;
      b.style.cssText =
        'width:100%; max-width:360px; text-align:left; border-radius:16px; padding:14px 16px;' +
        'cursor:pointer; color:#fff; font-family:inherit;' +
        'background:' + (atual ? 'rgba(0,255,136,.16)' : 'rgba(255,255,255,.07)') + ';' +
        'border:2px solid ' + (atual ? '#00ff88' : 'rgba(255,255,255,.2)') + ';';
      var n = document.createElement('div');
      n.textContent = (atual ? '✓ ' : '') + L.nome;
      n.style.cssText = 'font-size:16px; font-weight:bold; margin-bottom:5px';
      var ex = document.createElement('div');
      ex.textContent = L.exemplo;
      ex.style.cssText = 'font-size:' + (id === 'cursiva' ? '26px' : '20px') + ';' +
        'font-family:' + (L.fonte || 'Arial, Helvetica, sans-serif') + '; margin-bottom:4px';
      var d = document.createElement('div');
      d.textContent = L.desc;
      d.style.cssText = 'font-size:12.5px; opacity:.7';
      b.append(n, ex, d);
      b.onclick = function () { escolhe(id); fecha(); setTimeout(window.abreLetra, 60); };
      fundo.appendChild(b);
    });

    var fechar = document.createElement('button');
    fechar.textContent = '✖ Fechar';
    fechar.style.cssText =
      'margin-top:8px; padding:11px 24px; font-size:16px; font-weight:bold; cursor:pointer;' +
      'background:#ff3355; border:none; border-radius:14px; color:#fff; font-family:inherit;';
    fechar.onclick = fecha;
    fundo.appendChild(fechar);

    document.body.appendChild(fundo);
    function fecha() {
      var e = document.getElementById('cg-letra-tela');
      if (e) e.remove();
    }
    window.fechaLetra = fecha;
  };
})();
