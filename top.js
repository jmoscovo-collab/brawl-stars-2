// 🏆 CoguTop — Top 10 de cada jogo (guardado neste aparelho e na nuvem da conta)
// Uso: CoguTop.registra('chuva', 42)  -> devolve a posição (1..10) ou 0
//      CoguTop.html('chuva', 's')     -> <div> com a lista pronta
(function(){
  var MAX = 10;
  function le(jogo){ try { var v = JSON.parse(localStorage.getItem('top_' + jogo)); return Array.isArray(v) ? v : []; } catch(e){ return []; } }
  function grava(jogo, l){ try { localStorage.setItem('top_' + jogo, JSON.stringify(l)); } catch(e){} }
  function nome(){ try { return localStorage.getItem('cg_usuario') || 'Você'; } catch(e){ return 'Você'; } }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function data(){ var d = new Date(); return ('0'+d.getDate()).slice(-2) + '/' + ('0'+(d.getMonth()+1)).slice(-2); }

  var ultimo = {};
  function registra(jogo, valor){
    valor = Math.floor(+valor || 0);
    if(valor <= 0) return 0;
    var l = le(jogo), t = Date.now();
    l.forEach(function(x){ if(x.t >= t) t = x.t + 1; });   // cada partida com marca única
    var item = { n: nome(), v: valor, d: data(), t: t };
    l.push(item);
    l.sort(function(a, b){ return b.v - a.v || a.t - b.t; });
    l = l.slice(0, MAX);
    grava(jogo, l);
    var pos = l.indexOf(item) + 1;
    ultimo[jogo] = pos ? item.t : 0;
    return pos;
  }

  function html(jogo, unidade, titulo){
    var l = le(jogo), u = unidade || '';
    var s = '<div style="background:rgba(0,0,0,.35);border:2px solid #ffd76a;border-radius:14px;padding:8px 12px;margin:8px auto;max-width:320px;width:100%;color:#fff;font-size:15px;text-align:left">';
    s += '<div style="text-align:center;font-weight:bold;color:#ffd76a;margin-bottom:4px">' + (titulo || '🏆 TOP 10') + '</div>';
    if(!l.length) s += '<div style="text-align:center;opacity:.8">Ninguém ainda… seja o primeiro! 🚀</div>';
    var med = ['🥇','🥈','🥉'];
    l.forEach(function(it, i){
      var eu = it.t === ultimo[jogo];
      s += '<div style="display:flex;gap:6px;padding:2px 4px;border-radius:8px' + (eu ? ';background:rgba(255,215,106,.3)' : '') + '">' +
           '<span style="width:28px">' + (med[i] || (i+1) + 'º') + '</span>' +
           '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(it.n) + (eu ? ' ⬅' : '') + '</span>' +
           '<b>' + it.v + u + '</b><span style="opacity:.6;font-size:12px;width:40px;text-align:right">' + esc(it.d) + '</span></div>';
    });
    return s + '</div>';
  }

  window.CoguTop = { registra: registra, html: html, lista: le };
})();
