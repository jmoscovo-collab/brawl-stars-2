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
    hud.textContent = '🪙 ' + saldo().toLocaleString('pt-BR');
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
      d.textContent = '+' + n + ' 🪙';
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
