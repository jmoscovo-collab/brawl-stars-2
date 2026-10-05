/* === COGUMELO GAMES — trocar Cogu Coins pela moeda DE CADA JOGO ===
   Põe um botãozinho 🍄 no canto. Clicou, abre a telinha de troca: você
   escolhe um pacote (ou escreve quanto quer) e as Cogu Coins viram a moeda
   daquele jogo. Só vai num sentido — moeda de jogo NUNCA vira Cogu Coin.

   Cada jogo chama assim, dizendo onde ele guarda a moeda dele:
     cgCoguLoja({ chave:'golf_coins', nome:'moedas', emoji:'🪙' });
     cgCoguLoja({ chave:'capivara_run_progress', campo:'coins' });   // dentro de um JSON
*/
window.cgCoguLoja = function (op) {
  op = op || {};
  var CHAVE = op.chave;
  var CAMPO = op.campo || null;
  var NOME = op.nome || 'moedas';
  var EMOJI = op.emoji || '🪙';
  var TAXA = op.taxa || 40;           // quantas moedas do jogo cada 🍄 vale
  var baixo = op.botaoEmBaixo || 166;
  if (!CHAVE) return;

  // os pacotes: quanto maior, melhor a troca
  var PACOTES = [1, 5, 15, 40, 100, 250];
  function bonus(n) {                 // 1x no mínimo, até 1.8x no pacotão
    if (n >= 250) return 1.8;
    if (n >= 100) return 1.55;
    if (n >= 40) return 1.33;
    if (n >= 15) return 1.16;
    return 1;
  }
  function quantoDa(n) { return Math.round(n * TAXA * bonus(n)); }

  // ---- lê e grava a moeda do jogo do jeitinho que ele guarda ----
  function leTudo() {
    try { return localStorage.getItem(CHAVE); } catch (e) { return null; }
  }
  function saldoDoJogo() {
    var raw = leTudo();
    if (raw === null) return 0;
    try {
      var v = JSON.parse(raw);
      if (CAMPO) return Number((v && v[CAMPO]) || 0) || 0;
      return Number(v) || 0;
    } catch (e) {
      return parseInt(raw, 10) || 0;   // guardado como texto puro
    }
  }
  function soma(n) {
    var raw = leTudo();
    try {
      if (raw === null) {
        localStorage.setItem(CHAVE, CAMPO ? JSON.stringify((function(){ var o={}; o[CAMPO]=n; return o; })()) : String(n));
        return true;
      }
      var v;
      try { v = JSON.parse(raw); } catch (e) { v = null; }
      if (v !== null && typeof v === 'object' && CAMPO) {
        v[CAMPO] = (Number(v[CAMPO]) || 0) + n;
        localStorage.setItem(CHAVE, JSON.stringify(v));
      } else if (typeof v === 'number') {
        localStorage.setItem(CHAVE, JSON.stringify(v + n));
      } else {
        localStorage.setItem(CHAVE, String((parseInt(raw, 10) || 0) + n));
      }
      return true;
    } catch (e) { return false; }
  }

  // ---- a telinha ----
  function abre() {
    var CC = window.CoguCoins;
    if (document.getElementById('cg-coguloja')) return;

    var fundo = document.createElement('div');
    fundo.id = 'cg-coguloja';
    fundo.style.cssText =
      'position:fixed; inset:0; z-index:2147483100; background:rgba(5,2,20,.93);' +
      'display:flex; flex-direction:column; align-items:center; justify-content:flex-start;' +
      'gap:10px; padding:22px 16px; overflow-y:auto; color:#fff;' +
      'font-family:Arial,Helvetica,sans-serif;';

    function txt(t, css) {
      var d = document.createElement('div');
      d.innerHTML = t; d.style.cssText = css || '';
      return d;
    }
    fundo.appendChild(txt('🍄➡️' + EMOJI, 'font-size:44px;line-height:1'));
    fundo.appendChild(txt('Trocar Cogu Coins', 'font-size:22px;font-weight:bold;text-align:center'));
    fundo.appendChild(txt('As <b>Cogu Coins</b> valem no site inteiro. Aqui elas viram <b>' + NOME +
      '</b> ' + EMOJI + ' desse jogo.', 'font-size:13.5px;opacity:.85;text-align:center;max-width:360px;line-height:1.5'));

    var saldo = txt('', 'background:rgba(10,5,24,.8);border:2px solid #ffcc33;color:#ffcc33;' +
      'border-radius:16px;padding:7px 15px;font-size:15px;font-weight:bold');
    fundo.appendChild(saldo);
    function pintaSaldo() {
      saldo.innerHTML = '🍄 ' + (CC ? CC.texto() : '0') + ' &nbsp;·&nbsp; ' +
        EMOJI + ' ' + saldoDoJogo().toLocaleString('pt-BR');
    }
    pintaSaldo();

    if (!CC) {
      fundo.appendChild(txt('Não consegui carregar suas Cogu Coins. Tente recarregar a página.',
        'font-size:13px;color:#ff9b9b;text-align:center'));
    } else {
      var grade = document.createElement('div');
      grade.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%;max-width:360px';
      PACOTES.forEach(function (n) {
        var b = document.createElement('button');
        var pode = CC.saldo() >= n;
        b.style.cssText =
          'border-radius:14px;padding:12px 4px;font-size:13px;font-weight:bold;cursor:pointer;' +
          'font-family:inherit;line-height:1.35;' +
          (pode ? 'background:rgba(255,204,51,.14);border:2px solid #ffcc33;color:#ffcc33;'
                : 'background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.15);color:#889;cursor:default;');
        b.innerHTML = '🍄 ' + n + '<br><small style="opacity:.8">' + EMOJI + ' ' +
          quantoDa(n).toLocaleString('pt-BR') + '</small>';
        if (pode) b.onclick = function () { troca(n); };
        grade.appendChild(b);
      });
      fundo.appendChild(grade);

      // escrever o valor que quiser
      var cx = document.createElement('div');
      cx.style.cssText = 'width:100%;max-width:360px;background:rgba(255,204,51,.09);' +
        'border:2px solid rgba(255,204,51,.45);border-radius:16px;padding:12px;' +
        'display:flex;flex-direction:column;gap:8px';
      cx.appendChild(txt('✏️ Ou escreva quanto você quer', 'font-size:13px;font-weight:bold;color:#ffcc33'));
      var inp = document.createElement('input');
      inp.type = 'number'; inp.min = '1'; inp.max = '1000000';
      inp.placeholder = 'Quantas Cogu Coins?';
      inp.style.cssText = 'width:100%;padding:11px 13px;font-size:16px;border-radius:12px;' +
        'border:2px solid #6a4a2a;background:rgba(10,5,20,.9);color:#fff;outline:none;' +
        'font-family:inherit;text-align:center';
      var previa = txt('', 'font-size:13px;opacity:.85;text-align:center');
      var btOk = document.createElement('button');
      btOk.style.cssText = 'width:100%;border:none;border-radius:13px;padding:12px;font-size:15px;' +
        'font-weight:bold;font-family:inherit;cursor:pointer';
      function atualiza() {
        var n = Math.floor(Number(inp.value));
        var ok = isFinite(n) && n >= 1 && n <= 1000000 && CC.saldo() >= n;
        previa.innerHTML = (inp.value.trim() && isFinite(n) && n >= 1)
          ? ('🍄 ' + n.toLocaleString('pt-BR') + ' vira <b style="color:#ffcc33">' + EMOJI + ' ' +
             quantoDa(n).toLocaleString('pt-BR') + '</b>')
          : 'Escreva de 1 até 1.000.000.';
        btOk.disabled = !ok;
        btOk.textContent = ok ? ('Trocar por ' + EMOJI + ' ' + quantoDa(n).toLocaleString('pt-BR'))
                              : (inp.value.trim() ? 'Você não tem tudo isso 😅' : 'Trocar');
        btOk.style.background = ok ? 'linear-gradient(135deg,#ffcc33,#ff9500)' : 'rgba(255,255,255,.12)';
        btOk.style.color = ok ? '#2a1800' : '#998';
      }
      inp.addEventListener('input', atualiza);
      btOk.onclick = function () {
        var n = Math.floor(Number(inp.value));
        if (isFinite(n) && n >= 1 && n <= 1000000) troca(n);
      };
      atualiza();
      cx.append(inp, previa, btOk);
      fundo.appendChild(cx);
    }

    fundo.appendChild(txt('⚠️ <b>Só vai num sentido!</b> ' + NOME + ' do jogo <b>NUNCA</b> viram Cogu Coins.',
      'font-size:12px;color:#ff9b9b;border:2px solid rgba(255,92,92,.4);border-radius:12px;' +
      'padding:8px 11px;background:rgba(255,92,92,.1);text-align:center;max-width:360px;line-height:1.45'));

    var fechar = document.createElement('button');
    fechar.textContent = '✖ Fechar';
    fechar.style.cssText = 'margin-top:4px;padding:11px 24px;font-size:15px;font-weight:bold;cursor:pointer;' +
      'background:rgba(255,255,255,.12);border:2px solid rgba(255,255,255,.25);border-radius:14px;' +
      'color:#fff;font-family:inherit';
    fechar.onclick = fecha;
    fundo.appendChild(fechar);
    document.body.appendChild(fundo);

    function troca(n) {
      if (!CC.gasta(n)) return;
      var ganhou = quantoDa(n);
      if (!soma(ganhou)) { CC.ganhaSilencioso(n); return; }
      // o jogo já leu a moeda dele na memória, então a página recarrega
      // pra ele enxergar o dinheiro novo na hora
      fundo.textContent = '';
      fundo.appendChild(txt('🎉', 'font-size:60px'));
      fundo.appendChild(txt('+' + ganhou.toLocaleString('pt-BR') + ' ' + EMOJI + ' ' + NOME + '!',
        'font-size:22px;font-weight:bold;color:#ffcc33;text-align:center'));
      fundo.appendChild(txt('Abrindo o jogo de novo pra você usar...',
        'font-size:13px;opacity:.8;text-align:center'));
      setTimeout(function () { location.reload(); }, 1200);
    }
    function fecha() {
      var e = document.getElementById('cg-coguloja');
      if (e) e.remove();
    }
  }

  // ---- o botãozinho no canto ----
  function criaBotao() {
    if (!document.body || document.getElementById('cg-coguloja-btn')) return;
    var b = document.createElement('button');
    b.id = 'cg-coguloja-btn';
    b.type = 'button';
    b.title = 'Trocar Cogu Coins por ' + NOME + ' desse jogo';
    b.textContent = '🍄';
    b.style.cssText =
      'position:fixed; right:10px; bottom:' + baixo + 'px; z-index:2147482050;' +
      'width:44px; height:44px; border-radius:50%; border:2px solid #ffcc33;' +
      'background:rgba(10,5,24,.8); color:#fff; font-size:21px; cursor:pointer; padding:0;' +
      'line-height:1; display:flex; align-items:center; justify-content:center;';
    b.onclick = function (e) { e.preventDefault(); e.stopPropagation(); abre(); };
    document.body.appendChild(b);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', criaBotao);
  else criaBotao();

  return { abre: abre, saldoDoJogo: saldoDoJogo };
};
