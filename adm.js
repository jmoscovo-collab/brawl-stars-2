/* === COGUMELO GAMES — painel ADM do Davi ===
   Abre digitando "adm" no teclado (ou segurando o 🍄 das Cogu Coins no celular)
   e colocando o código secreto. O código NÃO fica aqui: só um "embaralhado" dele
   (SHA-256), que não dá pra desembaralhar.
   Ele mexe só nas coisas DESTE aparelho (Cogu Coins e o save do jogo aberto).
   Banir e dar coisas pra outros jogadores precisa do servidor (só o Julio mexe). */
(function () {
  if (window.cgAdm) return;
  var HASH = '740039111479ca345679b69c20d4f072a1aec6b828f0753cf1a3524ea82f9043';
  var MAX = 1e12;
  var painel = null;

  function sha(t) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode('cogumelo-adm:' + t)).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    });
  }
  function liberado() { try { return sessionStorage.getItem('cg_adm') === '1'; } catch (e) { return false; } }
  function pede() {
    if (liberado()) return abre();
    var c = prompt('🔐 Código secreto do ADM:');
    if (!c) return;
    if (!window.crypto || !crypto.subtle) { alert('Esse navegador não deixa abrir o painel 😕'); return; }
    sha(c.trim()).then(function (h) {
      if (h === HASH) { try { sessionStorage.setItem('cg_adm', '1'); } catch (e) {} abre(); }
      else alert('❌ Código errado!');
    });
  }

  // ---- acha o save do jogo que está aberto ----
  var NOMES_SAVE = ['save', 'SAVE', 'sv', 'estado', 'dados', 'progresso', 'jogador', 'player'];
  var NOMES_GRAVA = ['grava', 'salva', 'salvar', 'gravar', 'salvaJogo', 'saveGame', 'salvaLoja', 'salvaSave'];
  function global(n) { try { return (0, eval)('typeof ' + n + '!=="undefined"?' + n + ':undefined'); } catch (e) { return undefined; } }
  function achaSave() {
    for (var i = 0; i < NOMES_SAVE.length; i++) { var s = global(NOMES_SAVE[i]); if (s && typeof s === 'object' && !Array.isArray(s)) return s; }
    return null;
  }
  function gravaJogo() {
    for (var i = 0; i < NOMES_GRAVA.length; i++) { var f = global(NOMES_GRAVA[i]); if (typeof f === 'function') { try { f(); } catch (e) {} return true; } }
    return false;
  }
  function numeros(o, pre, out, prof) {
    for (var k in o) {
      if (!Object.prototype.hasOwnProperty.call(o, k) || k.charAt(0) === '_') continue;
      var v = o[k];
      if (typeof v === 'number' && isFinite(v)) out.push({ obj: o, k: k, nome: pre + k });
      else if (v && typeof v === 'object' && !Array.isArray(v) && prof < 1) numeros(v, pre + k + '.', out, prof + 1);
    }
    return out;
  }

  // ---- tela ----
  function el(tag, css, html) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (html != null) e.innerHTML = html; return e; }
  var BT = 'font:bold 13px Arial;border:2px solid #000;border-radius:8px;padding:6px 10px;cursor:pointer;background:#ffcc33;color:#000;margin:2px';
  var IN = 'font:14px Arial;width:120px;padding:5px;border-radius:6px;border:2px solid #555;background:#111;color:#fff';
  function secao(t) { return el('div', 'font:bold 15px Arial;color:#ffcc33;margin:14px 0 6px', t); }
  function fecha() { if (painel) { painel.remove(); painel = null; } }
  function abre() {
    fecha();
    painel = el('div', 'position:fixed;inset:0;z-index:2147483600;background:rgba(5,2,20,.88);overflow-y:auto;padding:16px;font-family:Arial,Helvetica,sans-serif;color:#fff');
    var cx = el('div', 'max-width:560px;margin:0 auto;background:#1a1530;border:3px solid #ffcc33;border-radius:16px;padding:14px');
    painel.appendChild(cx);
    cx.appendChild(el('div', 'font:bold 22px Arial;text-align:center;color:#ffcc33', '🛠️ PAINEL ADM'));
    cx.appendChild(el('div', 'font-size:12px;opacity:.75;text-align:center;margin-top:4px', 'Mexe só nas coisas deste aparelho • jogo: ' + (location.pathname || '/')));

    // Cogu Coins
    cx.appendChild(secao('🍄 Cogu Coins'));
    var cc = window.CoguCoins;
    var lin = el('div', '');
    lin.appendChild(el('span', 'margin-right:8px', 'Você tem: <b>' + (cc ? (cc.saldo() >= 9e15 ? '∞' : cc.saldo().toLocaleString('pt-BR')) : '?') + '</b>'));
    var qc = el('input', IN); qc.type = 'number'; qc.value = '1000'; lin.appendChild(qc);
    var bc = el('button', BT, '➕ DAR');
    bc.onclick = function () { var n = Math.min(MAX, Math.max(0, Math.round(+qc.value || 0))); if (cc && n) { cc.ganha(n); try { if (window.cgNuvem) cgNuvem.salva(); } catch (e) {} } abre(); };
    lin.appendChild(bc); cx.appendChild(lin);

    // save do jogo
    var s = achaSave();
    cx.appendChild(secao('🎮 Números do save deste jogo'));
    if (!s) cx.appendChild(el('div', 'font-size:13px;opacity:.8', 'Não achei o save desse jogo (ou essa página não é um jogo).'));
    else {
      var campos = numeros(s, '', [], 0);
      if (!campos.length) cx.appendChild(el('div', 'font-size:13px;opacity:.8', 'Esse save não tem números pra mudar.'));
      campos.forEach(function (c) {
        var l = el('div', 'display:flex;align-items:center;gap:6px;margin:3px 0;font-size:13px');
        l.appendChild(el('span', 'flex:1;overflow:hidden;text-overflow:ellipsis', c.nome));
        var i = el('input', IN); i.type = 'number'; i.value = c.obj[c.k]; l.appendChild(i);
        var b = el('button', BT, 'OK');
        b.onclick = function () { var v = Number(i.value); if (!isFinite(v)) return; c.obj[c.k] = Math.max(-MAX, Math.min(MAX, v)); gravaJogo(); b.textContent = '✅'; setTimeout(function () { b.textContent = 'OK'; }, 900); };
        l.appendChild(b); cx.appendChild(l);
      });
      cx.appendChild(el('div', 'font-size:11px;opacity:.6;margin-top:4px', 'Mudou e o jogo não atualizou? Saia e entre de novo no jogo.'));
    }

    // extras do Ovo de Dragão
    if (/^\/ovos/.test(location.pathname) && s && global('RAR') && global('ESP_K')) {
      var RAR = global('RAR'), ESP = global('ESP'), ESP_K = global('ESP_K'), MUT = global('MUT') || {};
      cx.appendChild(secao('🥚 Ovo de Dragão'));
      var sr = el('select', IN); RAR.forEach(function (r, i) { var o = el('option', '', r.n); o.value = i; sr.appendChild(o); });
      var sm = el('select', IN); [['', 'sem mutação']].concat(Object.keys(MUT).map(function (k) { return [k, MUT[k].n]; })).forEach(function (m) { var o = el('option', '', m[1]); o.value = m[0]; sm.appendChild(o); });
      var nv = el('input', IN); nv.type = 'number'; nv.value = '1'; nv.min = 1; nv.max = 40; nv.style.width = '60px';
      var l1 = el('div', 'display:flex;flex-wrap:wrap;gap:6px;align-items:center'); l1.appendChild(sr); l1.appendChild(sm); cx.appendChild(l1);
      var l2 = el('div', 'display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:6px');
      var bo = el('button', BT, '🥚 DAR OVO');
      bo.onclick = function () {
        if (s.ovos.length >= 6) return alert('A mochila já tem 6 ovos!');
        var r = +sr.value, ops = ESP_K.filter(function (k) { return ESP[k].r === r && k !== 'passarinho'; });
        s.ovos.push({ r: r, esp: ops[Math.floor(Math.random() * ops.length)], mut: sm.value || '' }); gravaJogo(); bo.textContent = '✅ OVO NA MOCHILA'; setTimeout(function () { bo.textContent = '🥚 DAR OVO'; }, 1200);
      };
      var bp = el('button', BT, '🐉 DAR PET (nível ↓)');
      bp.onclick = function () {
        if (s.pets.length >= 12) return alert('Você já tem 12 pets!');
        var r = +sr.value, ops = ESP_K.filter(function (k) { return ESP[k].r === r; }), esp = ops[Math.floor(Math.random() * ops.length)];
        var n = Math.max(1, Math.min(40, Math.round(+nv.value || 1)));
        s.pets.push({ id: 'adm' + Date.now().toString(36), esp: esp, r: r, nv: n, xp: 0, fome: 100, limpo: 100, alegria: 100, energia: 100, mut: sm.value || '' });
        if (s.indice) s.indice[esp] = 1;
        try { var mp = global('montaPetsMundo'); if (typeof mp === 'function') mp(); } catch (e) {}
        gravaJogo(); bp.textContent = '✅ ' + ESP[esp].n; setTimeout(function () { bp.textContent = '🐉 DAR PET (nível ↓)'; }, 1500);
      };
      l2.appendChild(bo); l2.appendChild(bp); l2.appendChild(el('span', 'font-size:12px', 'nível:')); l2.appendChild(nv); cx.appendChild(l2);
    }

    cx.appendChild(secao('🚫 Banir / dar pra outros jogadores'));
    cx.appendChild(el('div', 'font-size:12px;opacity:.75;line-height:1.5', 'Isso precisa do servidor (só o seu pai mexe). Quando ele fizer, esse pedaço do painel vai funcionar aqui!'));
    var rod = el('div', 'text-align:center;margin-top:16px');
    var bf = el('button', BT, '✖ FECHAR'); bf.onclick = fecha; rod.appendChild(bf);
    var bs = el('button', BT + ';background:#ff6b6b', '🔒 SAIR DO MODO ADM'); bs.onclick = function () { try { sessionStorage.removeItem('cg_adm'); } catch (e) {} fecha(); };
    rod.appendChild(bs); cx.appendChild(rod);
    document.body.appendChild(painel);
  }

  // ---- como abre: digitar "adm" ou segurar o 🍄 no celular ----
  var seq = '';
  window.addEventListener('keydown', function (e) {
    var t = e.target && e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
    if (!e.key || e.key.length !== 1) return;
    seq = (seq + e.key.toLowerCase()).slice(-3);
    if (seq === 'adm') { seq = ''; pede(); }
  });
  var segura = null;
  document.addEventListener('touchstart', function (e) {
    var h = e.target && e.target.closest && e.target.closest('#cg-cogucoins');
    if (!h) return;
    segura = setTimeout(function () { segura = 'ok'; pede(); }, 1500);
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (segura === 'ok') { e.preventDefault(); segura = null; return; }
    if (segura) { clearTimeout(segura); segura = null; }
  }, { passive: false });
  document.addEventListener('click', function (e) {
    if (segura === 'ok' && e.target.closest && e.target.closest('#cg-cogucoins')) { e.preventDefault(); segura = null; }
  }, true);

  window.cgAdm = { abre: function () { if (liberado()) abre(); else pede(); } };
})();
