/* === COGUMELO GAMES — Central de avisos + convites (roda em TODOS os jogos) ===
   Mostra no canto: avisos publicados pelos operadores e convites de amigos. */
(function(){
  if (window.__cgAvisos) return; window.__cgAvisos = true;
  var API = 'https://y67msybrr8.execute-api.sa-east-1.amazonaws.com';

  var css = document.createElement('style');
  css.textContent =
    '#cg-notif{position:fixed;top:8px;right:8px;z-index:2147483000;display:flex;flex-direction:column;gap:8px;' +
    'font-family:Arial,sans-serif;max-width:min(340px,92vw);pointer-events:none}' +
    '.cg-card{background:rgba(12,12,32,.96);border:2px solid #00ff88;border-radius:14px;padding:10px 12px;' +
    'color:#fff;font-size:14px;box-shadow:0 6px 24px rgba(0,0,0,.5);pointer-events:auto;animation:cgIn .25s}' +
    '.cg-card.aviso{border-color:#ffd700}' +
    '.cg-card .cg-tit{font-weight:bold;margin-bottom:4px}' +
    '.cg-card button{margin:6px 6px 0 0;padding:7px 12px;border:none;border-radius:9px;font-weight:bold;' +
    'font-size:13px;cursor:pointer;background:linear-gradient(135deg,#00ff88,#00ccff);color:#08281a;font-family:inherit}' +
    '.cg-card button.no{background:#445;color:#fff}' +
    '@keyframes cgIn{from{transform:translateX(40px);opacity:0}to{transform:none;opacity:1}}';
  document.head.appendChild(css);

  var box = document.createElement('div'); box.id = 'cg-notif';
  (document.body || document.documentElement).appendChild(box);

  function card(html, classe){
    var d = document.createElement('div');
    d.className = 'cg-card' + (classe ? ' ' + classe : '');
    d.innerHTML = html;
    box.appendChild(d);
    return d;
  }
  function beep(){
    try{
      var a = new (window.AudioContext||window.webkitAudioContext)();
      [700,950].forEach(function(f,i){
        var o=a.createOscillator(), g=a.createGain();
        o.frequency.value=f; g.gain.value=0.07;
        g.gain.exponentialRampToValueAtTime(0.001, a.currentTime+0.25+i*0.12);
        o.connect(g); g.connect(a.destination); o.start(a.currentTime+i*0.12); o.stop(a.currentTime+0.4+i*0.12);
      });
    }catch(e){}
  }
  function api(corpo){
    return fetch(API,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(corpo)})
      .then(function(r){ return r.json(); });
  }
  function usuario(){ return localStorage.getItem('cg_usuario')||''; }
  function senha(){ return localStorage.getItem('cg_senhaHash')||''; }

  // ---- avisos globais (todo mundo vê, logado ou não) ----
  function checaAvisos(){
    api({acao:'avisos'}).then(function(r){
      if(!r || !r.avisos) return;
      var vistos = JSON.parse(localStorage.getItem('cg_avisos_vistos')||'[]');
      r.avisos.slice(0,3).forEach(function(a){
        var id = String(a.ts);
        if(vistos.indexOf(id) >= 0) return;
        vistos.push(id);
        var c = card('<div class="cg-tit">📢 Recado do Cogumelo Games</div>' +
                     '<div>'+String(a.texto).replace(/[<>]/g,'')+'</div>' +
                     '<div style="color:#889;font-size:11px;margin-top:4px">— '+String(a.de).replace(/[<>]/g,'')+'</div>' +
                     '<button class="no">OK</button>', 'aviso');
        c.querySelector('button').onclick = function(){ c.remove(); };
        beep();
      });
      localStorage.setItem('cg_avisos_vistos', JSON.stringify(vistos.slice(-40)));
    }).catch(function(){});
  }

  // ---- convites de amigos (só logado) ----
  var convitesMostrados = {};
  function checaConvites(){
    if(!usuario() || !senha()) return;
    api({acao:'convites', nome:usuario(), senhaHash:senha()}).then(function(r){
      if(!r || !r.convites) return;
      r.convites.forEach(function(cv){
        var id = cv.de + '|' + cv.sala;
        var aceitos = JSON.parse(localStorage.getItem('cg_convites_aceitos')||'[]');
        var recusados = JSON.parse(localStorage.getItem('cg_convites_recusados')||'[]');
        if(convitesMostrados[id] || aceitos.indexOf(id)>=0 || recusados.indexOf(id)>=0) return;
        convitesMostrados[id] = true;
        var c = card('<div class="cg-tit">⚽ ' + String(cv.de).replace(/[<>]/g,'') + ' te chamou!</div>' +
                     '<div>Partida amistosa de Pênaltis</div>' +
                     '<button class="sim">✅ Aceitar</button><button class="no">❌ Recusar</button>');
        c.querySelector('.sim').onclick = function(){
          c.remove();                                   // some na hora
          var ac = JSON.parse(localStorage.getItem('cg_convites_aceitos')||'[]');
          ac.push(id); localStorage.setItem('cg_convites_aceitos', JSON.stringify(ac.slice(-30)));
          location.href = '/penaltis/?sala=' + encodeURIComponent(cv.sala) + '&de=' + encodeURIComponent(cv.de);
        };
        c.querySelector('.no').onclick = function(){
          c.remove();
          var re = JSON.parse(localStorage.getItem('cg_convites_recusados')||'[]');
          re.push(id); localStorage.setItem('cg_convites_recusados', JSON.stringify(re.slice(-30)));
        };
        // ignorou? o cartão some sozinho em 10 segundos
        setTimeout(function(){ if(c.parentNode) c.remove(); }, 10000);
        beep();
      });
    }).catch(function(){});
  }

  function ciclo(){ checaAvisos(); checaConvites(); }
  ciclo();
  setInterval(ciclo, 15000);
  window.cgNotifCard = card;   // pros jogos usarem se quiserem
})();
