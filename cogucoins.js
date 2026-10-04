/* === COGU COINS — a moeda do Cogumelo Games ===
   Vale no site inteiro (diferente das moedas de cada jogo).
   Ganha no presente diário. NÃO dá pra comprar com dinheiro de verdade.
   Guardado em localStorage e, se estiver logado, sobe junto com o save da conta. */
(function () {
  if (window.CoguCoins) return;

  var CHAVE = 'cg_cogucoins';
  var CHAVE_ITENS = 'cg_cogu_itens';

  function leInt(k) {
    try { return parseInt(localStorage.getItem(k) || '0', 10) || 0; } catch (e) { return 0; }
  }
  function saldo() { return leInt(CHAVE); }

  function grava(v) {
    try { localStorage.setItem(CHAVE, String(Math.max(0, Math.round(v)))); } catch (e) {}
    pinta();
    try { window.dispatchEvent(new CustomEvent('cogucoins', { detail: saldo() })); } catch (e) {}
  }

  function ganha(n) {
    n = Math.round(n) || 0;
    if (n <= 0) return saldo();
    grava(saldo() + n);
    return saldo();
  }

  // só gasta se tiver; devolve true se conseguiu
  function gasta(n) {
    n = Math.round(n) || 0;
    if (n <= 0) return true;
    if (saldo() < n) return false;
    grava(saldo() - n);
    return true;
  }

  // ---- itens comprados (valem em todo o site) ----
  function itens() {
    try { return JSON.parse(localStorage.getItem(CHAVE_ITENS) || '[]') || []; }
    catch (e) { return []; }
  }
  function tem(id) { return itens().indexOf(id) >= 0; }
  function guardaItem(id) {
    var l = itens();
    if (l.indexOf(id) < 0) { l.push(id); }
    try { localStorage.setItem(CHAVE_ITENS, JSON.stringify(l)); } catch (e) {}
  }
  // compra: tira as moedas e guarda o item
  function compra(id, preco) {
    if (tem(id)) return 'ja_tem';
    if (!gasta(preco)) return 'sem_moeda';
    guardaItem(id);
    return 'ok';
  }

  // ---- plaquinha do saldo no canto ----
  var hud = null;
  function pinta() {
    if (!hud) return;
    hud.textContent = '🍄 ' + saldo().toLocaleString('pt-BR');
  }
  function criaHud() {
    if (hud || !document.body) return;
    hud = document.createElement('a');
    hud.id = 'cg-cogucoins';
    hud.href = '/loja/';
    hud.title = 'Cogu Coins — clique pra ver a loja';
    hud.style.cssText =
      'position:fixed; left:10px; bottom:10px; z-index:2147481500;' +
      'background:rgba(10,10,30,.78); border:2px solid #ffcc33; color:#ffcc33;' +
      'border-radius:18px; padding:6px 12px; font-size:14px; font-weight:bold;' +
      'font-family:Arial,Helvetica,sans-serif; text-decoration:none; line-height:1;' +
      'display:flex; align-items:center; gap:4px;';
    document.body.appendChild(hud);
    pinta();
  }

  // animação de "+N" quando ganha
  function mostraGanho(n) {
    try {
      var d = document.createElement('div');
      d.textContent = '+' + n + ' 🍄';
      d.style.cssText =
        'position:fixed; left:14px; bottom:54px; z-index:2147481600; color:#ffcc33;' +
        'font-size:22px; font-weight:bold; font-family:Arial,Helvetica,sans-serif;' +
        'text-shadow:0 2px 6px #000; pointer-events:none; transition:all 1.1s ease-out;';
      document.body.appendChild(d);
      requestAnimationFrame(function () {
        d.style.transform = 'translateY(-38px)';
        d.style.opacity = '0';
      });
      setTimeout(function () { d.remove(); }, 1200);
    } catch (e) {}
  }

  window.CoguCoins = {
    saldo: saldo,
    ganha: function (n) { var s = ganha(n); mostraGanho(n); return s; },
    ganhaSilencioso: ganha,
    gasta: gasta,
    compra: compra,
    tem: tem,
    itens: itens,
    atualiza: pinta
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', criaHud);
  else criaHud();
})();

/* === OFERTA NA HORA ===
   Em vez de mandar o jogador numa loja, o próprio jogo oferece o que vale a pena
   no momento exato — morreu? aparece "reviver por N 🍄" ali mesmo. */
(function () {
  var CC = window.CoguCoins;
  var aberto = null;

  function fecha() {
    if (aberto) { aberto.remove(); aberto = null; }
  }

  // oferece({emoji, titulo, texto, preco, textoBotao, aoComprar, aoRecusar, textoRecusar})
  function oferece(o) {
    fecha();
    if (!document.body) return false;
    var preco = Math.max(0, Math.round(o.preco || 0));

    var fundo = document.createElement('div');
    fundo.style.cssText =
      'position:fixed; inset:0; z-index:2147483000; background:rgba(5,2,20,.82);' +
      'display:flex; align-items:center; justify-content:center; padding:18px;' +
      'font-family:Arial,Helvetica,sans-serif;';

    var cx = document.createElement('div');
    cx.style.cssText =
      'background:linear-gradient(160deg,#2d1b4e,#140a26); border:3px solid #ffcc33;' +
      'border-radius:22px; padding:22px 20px; max-width:340px; width:100%; text-align:center;' +
      'box-shadow:0 14px 40px rgba(0,0,0,.6); color:#fff;';

    var emo = document.createElement('div');
    emo.textContent = o.emoji || '🍄';
    emo.style.cssText = 'font-size:52px; line-height:1; margin-bottom:6px';

    var tit = document.createElement('div');
    tit.textContent = o.titulo || 'Quer continuar?';
    tit.style.cssText = 'font-size:21px; font-weight:bold; color:#ffcc33; margin-bottom:6px';

    var txt = document.createElement('div');
    txt.textContent = o.texto || '';
    txt.style.cssText = 'font-size:14px; opacity:.85; line-height:1.4; margin-bottom:14px';

    var temGrana = CC.saldo() >= preco;

    var bSim = document.createElement('button');
    bSim.textContent = (o.textoBotao || 'Reviver') + ' — 🍄 ' + preco;
    bSim.style.cssText =
      'width:100%; border:none; border-radius:14px; padding:14px; font-size:17px; font-weight:bold;' +
      'font-family:inherit; cursor:pointer; margin-bottom:8px;' +
      (temGrana
        ? 'background:linear-gradient(135deg,#ffcc33,#ff9500); color:#2a1800;'
        : 'background:rgba(255,255,255,.12); color:#bbb; cursor:default;');

    var saldoTxt = document.createElement('div');
    saldoTxt.style.cssText = 'font-size:12px; opacity:.7; margin-bottom:12px';
    saldoTxt.textContent = temGrana
      ? 'Você tem 🍄 ' + CC.saldo().toLocaleString('pt-BR')
      : 'Faltam 🍄 ' + (preco - CC.saldo()) + ' — pegue o presente de amanhã!';

    var bNao = document.createElement('button');
    bNao.textContent = o.textoRecusar || 'Não, acabou 💀';
    bNao.style.cssText =
      'width:100%; border:2px solid rgba(255,255,255,.22); border-radius:14px; padding:11px;' +
      'font-size:14px; font-weight:bold; font-family:inherit; cursor:pointer;' +
      'background:rgba(255,255,255,.07); color:#fff;';

    function recusa() { fecha(); if (o.aoRecusar) o.aoRecusar(); }

    bSim.onclick = function () {
      if (!temGrana) return;
      if (!CC.gasta(preco)) return;
      fecha();
      if (o.aoComprar) o.aoComprar();
    };
    bNao.onclick = recusa;

    cx.append(emo, tit, txt, bSim, saldoTxt, bNao);
    fundo.appendChild(cx);
    document.body.appendChild(fundo);
    aberto = fundo;
    return true;
  }

  /* reviver(opcoes) — atalho pro caso mais comum.
     O preço dobra a cada vez na MESMA partida, pra não virar infinito. */
  var revivesNaPartida = 0;
  function reviver(aoReviver, aoDesistir, base) {
    base = base || 25;
    var preco = base * Math.pow(2, revivesNaPartida);
    return oferece({
      emoji: '💀',
      titulo: 'Você morreu!',
      texto: 'Quer voltar do jeito que estava e continuar jogando?',
      preco: preco,
      textoBotao: '❤️ Reviver',
      aoComprar: function () { revivesNaPartida++; aoReviver(); },
      aoRecusar: aoDesistir
    });
  }
  function novaPartida() { revivesNaPartida = 0; }

  CC.oferece = oferece;
  CC.reviver = reviver;
  CC.novaPartida = novaPartida;
  CC.fechaOferta = fecha;
})();

/* === PRESENTÃO DE CRIADOR ===
   1.000.000 🍄 só pra duas contas, uma única vez cada.
   Só vale se a pessoa estiver logada com esse nome na conta da nuvem. */
(function () {
  var SORTUDOS = ['samuel9', 'davi0'];
  var VALOR = 1000000;
  try {
    var u = (localStorage.getItem('cg_usuario') || '').trim().toLowerCase();
    if (SORTUDOS.indexOf(u) < 0) return;
    var marca = 'cg_presentao_' + u;
    if (localStorage.getItem(marca)) return;       // já recebeu, não dá de novo
    localStorage.setItem(marca, '1');
    window.CoguCoins.ganhaSilencioso(VALOR);
    if (document.readyState === 'loading')
      document.addEventListener('DOMContentLoaded', avisa);
    else avisa();
  } catch (e) {}

  function avisa() {
    try {
      window.CoguCoins.oferece({
        emoji: '🍄',
        titulo: 'PRESENTÃO!',
        texto: 'Você ganhou 1.000.000 de Cogu Coins! Só você e mais uma pessoa ganharam isso.',
        preco: 0,
        textoBotao: 'UHUUUL!',
        textoRecusar: 'Fechar',
        aoComprar: function () {},
        aoRecusar: function () {}
      });
    } catch (e) {}
  }
})();
