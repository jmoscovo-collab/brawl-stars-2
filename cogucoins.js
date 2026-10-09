/* === COGU COINS — a moeda do Cogumelo Games ===
   Vale no site inteiro (diferente das moedas de cada jogo).
   Ganha no presente diário. NÃO dá pra comprar com dinheiro de verdade.
   Guardado em localStorage e, se estiver logado, sobe junto com o save da conta. */
(function () {
  if (window.CoguCoins) return;

  var CHAVE = 'cg_cogucoins';
  var CHAVE_ITENS = 'cg_cogu_itens';

  // essas duas contas têm Cogu Coins INFINITAS: nunca acaba e nunca desconta
  var INFINITOS = ['samuel9', 'davi0'];
  var INFINITO_N = 9007199254740991;   // o maior número que o navegador conta certo

  function ehInfinito() {
    try {
      var u = (localStorage.getItem('cg_usuario') || '').trim().toLowerCase();
      return INFINITOS.indexOf(u) >= 0;
    } catch (e) { return false; }
  }
  // o texto que aparece na tela: ∞ pra quem é infinito, o número pra todo mundo
  function texto() {
    return ehInfinito() ? '∞' : saldo().toLocaleString('pt-BR');
  }

  function leInt(k) {
    try { return parseInt(localStorage.getItem(k) || '0', 10) || 0; } catch (e) { return 0; }
  }
  function saldo() { return ehInfinito() ? INFINITO_N : leInt(CHAVE); }

  function grava(v) {
    try { localStorage.setItem(CHAVE, String(Math.max(0, Math.round(v)))); } catch (e) {}
    pinta();
    try { window.dispatchEvent(new CustomEvent('cogucoins', { detail: saldo() })); } catch (e) {}
  }

  function ganha(n) {
    n = Math.round(n) || 0;
    if (n <= 0 || ehInfinito()) return saldo();
    grava(leInt(CHAVE) + n);
    return saldo();
  }

  // só gasta se tiver; devolve true se conseguiu
  function gasta(n) {
    n = Math.round(n) || 0;
    if (n <= 0 || ehInfinito()) return true;   // infinito: usa à vontade, não desconta
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
    hud.textContent = '🍄 ' + texto();
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
    atualiza: pinta,
    infinito: ehInfinito,
    texto: texto,

    // histórico dos presentes: quem te deu e pra quem você deu
    historico: function () {
      try { return JSON.parse(localStorage.getItem('cg_cogu_hist') || '[]') || []; }
      catch (e) { return []; }
    },
    guardaNoHistorico: function (novos) {
      if (!novos || !novos.length) return;
      try {
        var h = JSON.parse(localStorage.getItem('cg_cogu_hist') || '[]') || [];
        h = novos.concat(h).slice(0, 40);
        localStorage.setItem('cg_cogu_hist', JSON.stringify(h));
        window.dispatchEvent(new CustomEvent('coguhist', { detail: h }));
      } catch (e) {}
    }
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
    txt.style.cssText = 'font-size:14px; opacity:.85; line-height:1.5; margin-bottom:14px; white-space:pre-line';

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
      ? 'Você tem 🍄 ' + CC.texto()
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


/* === RECEBER DOAÇÃO ===
   Alguém te doou? O presente fica guardado no servidor até você abrir o site.
   Aqui a gente pega, soma no seu saldo e avisa quem mandou. */
(function () {
  var API = 'https://y67msybrr8.execute-api.sa-east-1.amazonaws.com';
  var CC = window.CoguCoins;

  function cred() {
    try {
      var u = localStorage.getItem('cg_usuario');
      var s = localStorage.getItem('cg_senhaHash');
      return (u && s) ? { nome: u, senhaHash: s } : null;
    } catch (e) { return null; }
  }

  function coleta() {
    var c = cred();
    if (!c || !window.fetch) return;
    fetch(API, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ acao: 'cogu_pegar', nome: c.nome, senhaHash: c.senhaHash })
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !j.doacoes || !j.doacoes.length) return;
        var total = 0, linhas = [], novas = [];
        j.doacoes.forEach(function (d) {
          var v = Math.max(0, Math.round(Number(d.valor) || 0));
          if (!v) return;
          total += v;
          var quem = String(d.de || 'Alguém').slice(0, 20);
          linhas.push('🍄 ' + quem + ' te deu ' + v.toLocaleString('pt-BR'));
          novas.push({ de: quem, valor: v, ts: Number(d.ts) || Date.now(), tipo: 'recebi' });
        });
        if (!total) return;
        CC.ganhaSilencioso(total);
        CC.guardaNoHistorico(novas);
        if (window.cgNuvem) window.cgNuvem.salva(true);
        CC.oferece({
          emoji: '🎁',
          titulo: 'Você ganhou um presente!',
          texto: linhas.join('\n') +
                 (linhas.length > 1 ? '\n\nTotal: 🍄 ' + total.toLocaleString('pt-BR') : ' Cogu Coins!'),
          preco: 0,
          textoBotao: 'OBRIGADO!',
          textoRecusar: 'Fechar',
          aoComprar: function () {}, aoRecusar: function () {}
        });
      })
      .catch(function () {});
  }

  // só nas páginas "de fora" dos jogos — ninguém quer um popup no meio da partida
  var p = location.pathname.replace(/\/+$/, '');
  var podeAqui = (p === '' || p === '/index.html' || p === '/conta' || p === '/cogucoins' || p === '/loja');
  if (!podeAqui) return;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', coleta);
  else coleta();
})();

/* === NUVEM: a conta vale em QUALQUER aparelho ===
   Tudo que o jogador tem (progresso dos jogos, Cogu Coins, histórico,
   favoritos) sobe pra conta na nuvem sozinho e desce quando ele entra
   em outro aparelho. Quem joga SEM conta perde tudo depois de 15 min. */
(function () {
  var API = 'https://y67msybrr8.execute-api.sa-east-1.amazonaws.com';
  var EXTRAS = ['cg_cogucoins', 'cg_cogu_hist', 'cg_favoritos'];   // chaves cg_ que também viajam
  var TS = 'cg_nuvem_ts';
  function ls(k){ try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v){ try { localStorage.setItem(k, v); } catch (e) {} }
  function cred(){ var u = ls('cg_usuario'), s = ls('cg_senhaHash'); return (u && s) ? { nome: u, senhaHash: s } : null; }
  function entra(k){ return k.indexOf('cg_') !== 0 || EXTRAS.indexOf(k) >= 0; }
  function snapshot(){
    var d = {};
    try { for (var i = 0; i < localStorage.length; i++){ var k = localStorage.key(i); if (entra(k)) d[k] = localStorage.getItem(k); } } catch (e) {}
    return d;
  }
  function aplica(dados){
    var tirar = [];
    try { for (var i = 0; i < localStorage.length; i++){ var k = localStorage.key(i); if (entra(k)) tirar.push(k); } } catch (e) {}
    tirar.forEach(function (k){ try { localStorage.removeItem(k); } catch (e) {} });
    Object.keys(dados || {}).forEach(function (k){ if (entra(k)) set(k, dados[k]); });
  }
  function assina(d){ var s = JSON.stringify(d), h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return s.length + ':' + h; }

  var ultimaAssinatura = null, salvando = false;
  function salva(forca, keepalive){
    var c = cred(); if (!c || !window.fetch) return;
    var d = snapshot(), a = assina(d);
    if (!forca && a === ultimaAssinatura) return;
    if (salvando && !keepalive) return;
    salvando = true; ultimaAssinatura = a;
    var corpo = JSON.stringify({ acao: 'salvar', nome: c.nome, senhaHash: c.senhaHash, dados: d });
    try {
      fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: corpo, keepalive: !!keepalive })
        .then(function (r){
          salvando = false;
          if (r.status === 401){ try { localStorage.removeItem('cg_usuario'); localStorage.removeItem('cg_senhaHash'); } catch (e) {} return null; }
          return r.ok ? r.json() : null;
        })
        .then(function (j){ if (j && j.atualizado) set(TS, String(j.atualizado)); })
        .catch(function (){ salvando = false; ultimaAssinatura = null; });
    } catch (e) { salvando = false; }
  }
  // puxa da nuvem se lá estiver mais novo do que a última vez que ESTE aparelho sincronizou
  function puxa(){
    var c = cred(); if (!c || !window.fetch) return;
    fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ acao: 'entrar', nome: c.nome, senhaHash: c.senhaHash }) })
      .then(function (r){ return r.ok ? r.json() : null; })
      .then(function (j){
        if (!j || !j.ok) return;
        var nuvemTs = Number(j.atualizado) || 0, meuTs = Number(ls(TS)) || 0;
        if (nuvemTs > meuTs){
          var iguais = assina(j.dados || {}) === assina(snapshot());
          set(TS, String(nuvemTs));
          if (!iguais){
            aplica(j.dados);
            ultimaAssinatura = assina(snapshot());
            var g = 'cg_recarregou_' + nuvemTs;
            try { if (!sessionStorage.getItem(g)){ sessionStorage.setItem(g, '1'); location.reload(); return; } } catch (e) {}
          }
        } else if (nuvemTs < meuTs || !nuvemTs) salva(true);   // nuvem está atrás: manda o meu
        ultimaAssinatura = ultimaAssinatura || assina(snapshot());
      })
      .catch(function (){});
  }
  window.cgNuvem = { snapshot: snapshot, aplica: aplica, salva: salva, puxa: puxa, EXTRAS: EXTRAS };

  if (cred()){
    puxa();
    setInterval(function (){ salva(false); }, 15000);
    document.addEventListener('visibilitychange', function (){ if (document.visibilityState === 'hidden') salva(false, true); });
    window.addEventListener('pagehide', function (){ salva(false, true); });
  }

  // ---- sem conta: 15 minutos e perde tudo ----
  var SC = 'cg_semconta_ms', LIMITE = 15 * 60 * 1000, AVISO = 12 * 60 * 1000, avisou = false;
  function apagaTudoSemConta(){
    var tirar = [];
    try { for (var i = 0; i < localStorage.length; i++){ var k = localStorage.key(i); if (entra(k)) tirar.push(k); } } catch (e) {}
    tirar.forEach(function (k){ try { localStorage.removeItem(k); } catch (e) {} });
    set(SC, '0');
  }
  function faixa(txt, cor){
    var f = document.createElement('a'); f.href = '/conta/';
    f.style.cssText = 'position:fixed;left:50%;top:8px;transform:translateX(-50%);z-index:99999;max-width:92vw;background:' + cor +
      ';color:#fff;font:bold 14px Arial;padding:10px 16px;border-radius:14px;text-decoration:none;box-shadow:0 6px 24px rgba(0,0,0,.5);text-align:center;line-height:1.35';
    f.textContent = txt;
    (document.body || document.documentElement).appendChild(f);
    setTimeout(function (){ try { f.remove(); } catch (e) {} }, 12000);
  }
  function tiqueSemConta(){
    if (cred()) return;
    if (document.visibilityState === 'hidden') return;
    var t = (Number(ls(SC)) || 0) + 5000;
    set(SC, String(t));
    if (t >= LIMITE){
      apagaTudoSemConta();
      alert('⏳ Você jogou 15 minutos SEM CONTA e o progresso foi apagado!\n\nCrie uma conta grátis em cogumelogames.com.br/conta/ pra guardar tudo pra sempre, em qualquer aparelho.');
      location.reload();
    } else if (t >= AVISO && !avisou){
      avisou = true;
      faixa('⏳ Sem conta, seu progresso SOME em ' + Math.ceil((LIMITE - t) / 60000) + ' min! Toque aqui pra criar uma conta 🍄', '#c0392b');
    }
  }
  if (!cred()){
    var mostra = function (){ var t = Number(ls(SC)) || 0; if (t < AVISO && t > 0) faixa('👤 Jogando sem conta: o progresso some em ' + Math.ceil((LIMITE - t) / 60000) + ' min. Toque pra criar conta!', '#2d6a4f'); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mostra); else mostra();
    setInterval(tiqueSemConta, 5000);
  }
})();
