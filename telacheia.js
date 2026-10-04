/* === COGUMELO GAMES — botão de TELA CHEIA (roda em todos os jogos) ===
   Põe um botãozinho no canto que faz o jogo ocupar a tela inteira.
   Funciona com clique, com a tecla F e no celular. Some sozinho quando
   não dá pra usar (alguns navegadores de iPhone não deixam). */
(function () {
  if (window.__cgTelaCheia) return;
  window.__cgTelaCheia = true;

  var el = document.documentElement;

  function temSuporte() {
    return !!(el.requestFullscreen || el.webkitRequestFullscreen ||
              el.webkitRequestFullScreen || el.msRequestFullscreen);
  }
  function estaCheia() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement ||
              document.webkitCurrentFullScreenElement || document.msFullscreenElement);
  }
  function entra() {
    var f = el.requestFullscreen || el.webkitRequestFullscreen ||
            el.webkitRequestFullScreen || el.msRequestFullscreen;
    if (f) { try { f.call(el); } catch (e) {} }
  }
  function sai() {
    var f = document.exitFullscreen || document.webkitExitFullscreen ||
            document.webkitCancelFullScreen || document.msExitFullscreen;
    if (f) { try { f.call(document); } catch (e) {} }
  }
  function alterna() { estaCheia() ? sai() : entra(); }

  if (!temSuporte()) return;   // navegador não deixa: nem mostra o botão

  var btn = document.createElement('button');
  btn.id = 'cg-telacheia-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Tela cheia');
  btn.style.cssText =
    'position:fixed; right:10px; bottom:62px; z-index:2147482000;' +
    'width:44px; height:44px; border-radius:50%; border:2px solid rgba(255,255,255,.35);' +
    'background:rgba(10,10,30,.72); color:#fff; font-size:19px; cursor:pointer;' +
    'padding:0; line-height:1; display:flex; align-items:center; justify-content:center;' +
    'font-family:Arial,Helvetica,sans-serif; opacity:.92; touch-action:manipulation;';

  function pinta() {
    btn.textContent = estaCheia() ? '✕' : '⛶';
    btn.title = estaCheia() ? 'Sair da tela cheia (F)' : 'Tela cheia (F)';
  }

  btn.onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    alterna();
  };

  function coloca() {
    (document.body || document.documentElement).appendChild(btn);
    pinta();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', coloca);
  else coloca();

  ['fullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'].forEach(function (ev) {
    document.addEventListener(ev, pinta);
  });

  // tecla F — mas não atrapalha quem está digitando num campo
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'f' && e.key !== 'F') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var a = document.activeElement;
    if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable)) return;
    e.preventDefault();
    alterna();
  });

  window.cgTelaCheia = { entra: entra, sai: sai, alterna: alterna, estaCheia: estaCheia };
})();
