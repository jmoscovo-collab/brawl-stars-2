/* === 🏆 MODO RANQUEADO (v662) ===
   Rank POR JOGO: Bronze → Prata → Ouro → Platina → Diamante → Lendário → Mestre → Campeão → Mega Campeão → ULTRA.
   Cada rank tem 3 divisões (III, II, I) de 100 pontos. Ultra não tem teto.
   O jogo chama:  CgRank.resultado('ganhou' | 'perdeu' | 'empate')   (só partidas contra robô/online, nunca 2 jogadores no mesmo PC)
   Proteção: perder tira pontos, mas NUNCA te tira do rank que você já alcançou (só da divisão).
   Chegou num rank novo pela 1ª vez = ganha Cogu Coins. Home: botão 🏆 Ranks mostra o rank de todos os jogos. */
(function () {
  var RANKS = [
    ['Bronze', '🥉', '#cd7f32', 0], ['Prata', '🥈', '#c8d2dc', 20], ['Ouro', '🥇', '#ffd23a', 40],
    ['Platina', '💠', '#4fe0d0', 60], ['Diamante', '💎', '#5ab4ff', 100], ['Lendário', '🔥', '#ff7a2a', 150],
    ['Mestre', '👑', '#c060ff', 200], ['Campeão', '🏆', '#ff3a6a', 300], ['Mega Campeão', '🌟', '#ffe066', 400],
    ['ULTRA', '⚡', '#7dff9a', 600]
  ];
  var POR_RANK = 300, DIV = 100, ULTRA = (RANKS.length - 1) * POR_RANK;
  var GANHA = 30, PERDE = 15, EMPATE = 5;
  var NOMES = { brawl: ['Arena Cogumelo 1', '🤖'], arena2: ['Arena Cogumelo 2', '🥊'], luta: ['Luta de Capivara', '🦫'],
    volei: ['Vôlei do Cogu', '🏐'], hockey: ['Cogu Hockey 3D', '🏒'], futebol: ['Cogu Futebol', '⚽'],
    caboguerra: ['Cabo de Guerra', '🪢'], bolas: ['Bola vs Bola', '⚔️'], chefoes: ['Cogu vs Chefões', '🔥'] };
  var ROMANO = ['III', 'II', 'I'];

  function leJ(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
  function gravaJ(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function chave(p) { return 'rank_' + p; }
  function dados(p) { var d = leJ(chave(p), {}); return { pts: d.pts || 0, v: d.v || 0, d: d.d || 0, e: d.e || 0, seq: d.seq || 0, max: d.max || 0, premios: d.premios || [] }; }
  function info(pts) {
    var i = Math.min(RANKS.length - 1, Math.floor(pts / POR_RANK)), r = RANKS[i];
    if (i === RANKS.length - 1) return { i: i, nome: r[0], ico: r[1], cor: r[2], div: '', txt: r[0] + ' ' + (pts - ULTRA) + ' pts', pct: 100, falta: 0 };
    var dentro = pts - i * POR_RANK, dv = Math.floor(dentro / DIV), resto = dentro % DIV;
    return { i: i, nome: r[0], ico: r[1], cor: r[2], div: ROMANO[dv], txt: r[0] + ' ' + ROMANO[dv], pct: resto, falta: DIV - resto };
  }
  function pastaAtual() { return location.pathname.split('/')[1] || ''; }
  function fmt(n) { return Number(n).toLocaleString('pt-BR'); }

  function estilo() {
    if (document.getElementById('cgRankCss')) return;
    var s = document.createElement('style'); s.id = 'cgRankCss';
    s.textContent = '#cgRankPop{position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:2147481700;width:min(340px,92vw);box-sizing:border-box;' +
      'background:linear-gradient(160deg,#1a1440,#2a0a30);border:3px solid #ffd23a;border-radius:18px;padding:12px 14px;color:#fff;' +
      'font:15px Arial,Helvetica,sans-serif;text-align:center;box-shadow:0 6px 26px rgba(0,0,0,.6);transition:opacity .5s}' +
      '#cgRankPop .cgrB{height:10px;border-radius:6px;background:rgba(255,255,255,.15);margin:8px 0 4px;overflow:hidden}' +
      '#cgRankPop .cgrB div{height:100%;border-radius:6px;transition:width .8s}' +
      '#cgRankPop button,#cgRankPainel button{border:none;border-radius:10px;padding:7px 14px;font:bold 14px Arial,Helvetica,sans-serif;cursor:pointer;margin:4px}' +
      '#cgRankPainel{position:fixed;inset:0;z-index:2147481800;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;padding:16px;font:15px Arial,Helvetica,sans-serif}' +
      '#cgRankPainel .cgrC{background:linear-gradient(160deg,#1a1440,#2a0a30);border:3px solid #ffd23a;border-radius:20px;padding:16px;max-width:440px;width:100%;max-height:90vh;overflow:auto;color:#fff;text-align:center;box-sizing:border-box}' +
      '#cgRankPainel .cgrL{display:flex;align-items:center;gap:10px;padding:7px 10px;margin:5px 0;border-radius:12px;background:rgba(255,255,255,.07);text-align:left}' +
      '@keyframes cgrPula{0%{transform:scale(.3)}60%{transform:scale(1.3)}100%{transform:scale(1)}}';
    document.head.appendChild(s);
  }

  function popup(p, antes, depois, delta, subiu, premio, protegido) {
    estilo();
    var velho = document.getElementById('cgRankPop'); if (velho) velho.remove();
    var a = info(antes), b = info(depois), d = document.createElement('div');
    d.id = 'cgRankPop';
    var sinal = delta > 0 ? '+' + delta : String(delta);
    var corD = delta > 0 ? '#7dff9a' : delta < 0 ? '#ff6a6a' : '#fff';
    d.innerHTML = '<div style="font-size:12px;opacity:.75;letter-spacing:1px">🏆 RANQUEADO</div>' +
      (subiu ? '<div style="font-size:46px;animation:cgrPula .7s">' + b.ico + '</div><div style="font-size:19px;font-weight:bold;color:' + b.cor + '">SUBIU PRA ' + b.nome.toUpperCase() + '! 🎉</div>'
             : '<div style="font-size:34px">' + b.ico + '</div><div style="font-size:18px;font-weight:bold;color:' + b.cor + '">' + b.txt + '</div>') +
      '<div style="font-size:20px;font-weight:bold;color:' + corD + '">' + sinal + ' pontos</div>' +
      (b.falta ? '<div class="cgrB"><div style="width:' + a.pct + '%;background:' + b.cor + '"></div></div><div style="font-size:12px;opacity:.8">faltam ' + b.falta + ' pra subir</div>' : '') +
      (premio ? '<div style="color:#ffd23a;font-weight:bold;margin-top:4px">🍄 +' + premio + ' Cogu Coins de prêmio!</div>' : '') +
      (protegido ? '<div style="font-size:12px;opacity:.8">🛡️ Proteção: você não cai de rank!</div>' : '') +
      '<div><button data-v="1" style="background:#ffd23a;color:#3a1a00">Ver ranks</button><button data-x="1" style="background:rgba(255,255,255,.15);color:#fff">OK</button></div>';
    document.body.appendChild(d);
    setTimeout(function () { var bar = d.querySelector('.cgrB div'); if (bar) bar.style.width = (subiu ? b.pct : b.pct) + '%'; }, 60);
    d.querySelector('[data-v]').onclick = function () { d.remove(); painel(p); };
    d.querySelector('[data-x]').onclick = function () { d.remove(); };
    setTimeout(function () { if (d.parentNode) d.style.opacity = '0'; }, 6500);
    setTimeout(function () { if (d.parentNode) d.remove(); }, 7100);
  }

  function painel(p) {
    estilo();
    var velho = document.getElementById('cgRankPainel'); if (velho) velho.remove();
    var m = document.createElement('div'); m.id = 'cgRankPainel';
    var html = '<div class="cgrC"><div style="font-size:36px">🏆</div><div style="font-size:21px;font-weight:bold;color:#ffd23a">MODO RANQUEADO</div>';
    if (p) {
      var dd = dados(p), r = info(dd.pts), nm = NOMES[p] ? NOMES[p][0] : p;
      html += '<div style="opacity:.8;margin-bottom:6px">' + nm + '</div>' +
        '<div style="font-size:44px">' + r.ico + '</div><div style="font-size:20px;font-weight:bold;color:' + r.cor + '">' + r.txt + '</div>' +
        (r.falta ? '<div style="height:10px;border-radius:6px;background:rgba(255,255,255,.15);margin:8px 0 4px;overflow:hidden"><div style="height:100%;width:' + r.pct + '%;background:' + r.cor + '"></div></div><div style="font-size:12px;opacity:.8">' + r.pct + '/100 · faltam ' + r.falta + ' pra subir</div>' : '') +
        '<div style="margin:8px 0;font-size:14px">✅ ' + dd.v + ' vitórias · ❌ ' + dd.d + ' derrotas' + (dd.seq > 1 ? ' · 🔥 ' + dd.seq + ' seguidas' : '') + '</div>' +
        '<div style="text-align:left">' + RANKS.map(function (k, i) {
          var chegou = dd.max >= i * POR_RANK, aqui = r.i === i;
          return '<div class="cgrL" style="' + (aqui ? 'background:rgba(255,210,58,.22);border:2px solid ' + k[2] : '') + (chegou ? '' : ';opacity:.45') + '">' +
            '<span style="font-size:26px">' + k[1] + '</span><div style="flex:1"><b style="color:' + k[2] + '">' + k[0] + '</b>' + (aqui ? ' ⬅ você' : '') +
            '<div style="font-size:12px;opacity:.8">' + fmt(i * POR_RANK) + ' pts' + (k[3] ? ' · prêmio 🍄 ' + k[3] : '') + '</div></div>' + (chegou ? '✅' : '🔒') + '</div>';
        }).join('') + '</div>' +
        '<div style="font-size:12px;opacity:.75;margin-top:8px">Vitória +' + GANHA + ' (+5 por vitória seguida, até +15) · Derrota −' + PERDE + ' · Empate +' + EMPATE + '<br>🛡️ Você nunca cai do rank que já alcançou!</div>';
    } else {
      var lista = Object.keys(NOMES).map(function (k) { return { p: k, d: dados(k) }; }).sort(function (a, b) { return b.d.pts - a.d.pts; });
      html += '<div style="font-size:13px;opacity:.85;margin:4px 0 8px">Cada jogo tem seu rank! Ganhe partidas contra o robô ou online pra subir de Bronze até ⚡ ULTRA.</div><div style="text-align:left">' +
        lista.map(function (o) {
          var r = info(o.d.pts), nm = NOMES[o.p];
          return '<a class="cgrL" href="/' + o.p + '/" style="color:#fff;text-decoration:none"><span style="font-size:24px">' + nm[1] + '</span><div style="flex:1"><b>' + nm[0] + '</b>' +
            '<div style="font-size:12px;opacity:.8">' + (o.d.v + o.d.d + o.d.e ? '✅ ' + o.d.v + ' · ❌ ' + o.d.d : 'ainda não jogou ranqueado') + '</div></div>' +
            '<span style="font-size:22px">' + r.ico + '</span><b style="color:' + r.cor + ';font-size:13px;white-space:nowrap">' + r.txt + '</b></a>';
        }).join('') + '</div>';
    }
    html += '<button data-x="1" style="background:#ff2a6a;color:#fff;margin-top:12px;padding:10px 28px;font-size:16px">Fechar</button></div>';
    m.innerHTML = html;
    m.onclick = function (e) { if (e.target === m) m.remove(); };
    m.querySelector('[data-x]').onclick = function () { m.remove(); };
    document.body.appendChild(m);
  }

  var ultimoEm = 0;
  function resultado(tipo, pasta) {
    var p = pasta || pastaAtual();
    if (!p || !NOMES[p]) return;
    var agora = Date.now(); if (agora - ultimoEm < 3000) return; ultimoEm = agora;   // não contar 2x a mesma partida
    var dd = dados(p), antes = dd.pts, delta;
    if (tipo === 'ganhou') { delta = GANHA + Math.min(15, dd.seq * 5); dd.v++; dd.seq++; }
    else if (tipo === 'perdeu') { delta = -PERDE; dd.d++; dd.seq = 0; }
    else { delta = EMPATE; dd.e++; }
    var piso = info(antes).i * POR_RANK;                                    // 🛡️ não cai de rank
    dd.pts = Math.max(piso, antes + delta);
    var ia = info(antes).i, ib = info(dd.pts).i, subiu = ib > ia, premio = 0;
    if (subiu && dd.premios.indexOf(ib) < 0) {
      dd.premios.push(ib); premio = RANKS[ib][3];
      try { if (premio && window.CoguCoins) window.CoguCoins.ganha(premio); } catch (e) {}
    }
    dd.max = Math.max(dd.max, dd.pts);
    gravaJ(chave(p), dd);
    try { popup(p, antes, dd.pts, dd.pts - antes, subiu, premio, antes + delta < piso); } catch (e) {}
  }

  window.CgRank = { resultado: resultado, painel: painel, info: info, dados: dados, RANKS: RANKS, NOMES: NOMES };
})();
