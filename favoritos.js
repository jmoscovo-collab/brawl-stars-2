/* === JOGOS FAVORITOS ===
   Segura o dedo (ou o mouse) em cima de um jogo que aparece um coraçãozinho.
   Clicou no coração, o jogo vira favorito: sobe pro topo do site e aparece
   no seu perfil. Fica guardado em localStorage ('cg_favoritos'). */
(function () {
  if (window.__cgFavoritos) return;
  window.__cgFavoritos = true;

  var CHAVE = 'cg_favoritos';
  var SEGURAR_MS = 450;

  function leFavs() {
    try { return JSON.parse(localStorage.getItem(CHAVE) || '[]') || []; }
    catch (e) { return []; }
  }
  function gravaFavs(l) {
    try { localStorage.setItem(CHAVE, JSON.stringify(l)); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent('cgfavoritos', { detail: l })); } catch (e) {}
  }

  // guarda o endereço, o nome e o emoji — o perfil usa isso pra desenhar a lista
  function dadosDoCard(a) {
    var nome = a.querySelector('.game-name');
    var ico = a.querySelector('.game-icon');
    return {
      href: a.getAttribute('href'),
      nome: nome ? nome.textContent.trim() : (a.getAttribute('href') || '').replace(/\//g, ''),
      icone: ico ? ico.textContent.trim() : '🎮'
    };
  }
  function ehFav(href) {
    return leFavs().some(function (f) { return f.href === href; });
  }

  window.cgFavoritos = { lista: leFavs, ehFav: ehFav };

  var grade = document.querySelector('.games-grid');
  if (!grade) return;

  var css = document.createElement('style');
  css.textContent =
    '.game-card{position:relative}' +
    '.cg-cor{position:absolute; top:7px; left:7px; z-index:5; width:26px; height:26px; border-radius:50%;' +
    ' border:none; padding:0; cursor:pointer; font-size:14px; line-height:26px; text-align:center;' +
    ' background:rgba(8,8,24,.78); color:#fff; opacity:0; transform:scale(.6);' +
    ' transition:opacity .16s, transform .16s; pointer-events:none; font-family:Arial,Helvetica,sans-serif;}' +
    '.game-card.cg-revela .cg-cor, .game-card.cg-fav .cg-cor{opacity:1; transform:scale(1); pointer-events:auto;}' +
    '.game-card.cg-fav{border-color:#ff5c8a !important;}' +
    '.cg-cor:active{transform:scale(1.25);}' +
    '@media (hover:hover){ .game-card:hover .cg-cor{opacity:.6; transform:scale(1); pointer-events:auto;} }';
  document.head.appendChild(css);

  var cards = Array.prototype.slice.call(grade.querySelectorAll('a.game-card'));

  cards.forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href) return;

    var cor = document.createElement('button');
    cor.type = 'button';
    cor.className = 'cg-cor';
    cor.setAttribute('aria-label', 'Favoritar');
    a.appendChild(cor);

    function pinta() {
      var f = ehFav(href);
      cor.textContent = f ? '❤️' : '🤍';
      cor.title = f ? 'Tirar dos favoritos' : 'Pôr nos favoritos';
      a.classList.toggle('cg-fav', f);
    }
    pinta();

    cor.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var l = leFavs();
      if (ehFav(href)) l = l.filter(function (f) { return f.href !== href; });
      else l.unshift(dadosDoCard(a));
      gravaFavs(l);
      pinta();
      ordena();
    });
    // o clique no coração não pode abrir o jogo
    cor.addEventListener('mousedown', function (e) { e.stopPropagation(); });
    cor.addEventListener('touchstart', function (e) { e.stopPropagation(); }, { passive: true });

    // --- segurar o dedo revela o coração ---
    var t = null, segurou = false;
    function comeca() {
      segurou = false;
      clearTimeout(t);
      t = setTimeout(function () {
        segurou = true;
        cards.forEach(function (c) { if (c !== a) c.classList.remove('cg-revela'); });
        a.classList.add('cg-revela');
        if (navigator.vibrate) { try { navigator.vibrate(18); } catch (e) {} }
      }, SEGURAR_MS);
    }
    function solta() { clearTimeout(t); }

    a.addEventListener('touchstart', comeca, { passive: true });
    a.addEventListener('touchend', solta);
    a.addEventListener('touchmove', solta, { passive: true });
    a.addEventListener('touchcancel', solta);
    a.addEventListener('mousedown', comeca);
    a.addEventListener('mouseup', solta);
    a.addEventListener('mouseleave', function () { solta(); a.classList.remove('cg-revela'); });

    // segurou pra favoritar? então esse clique não abre o jogo
    a.addEventListener('click', function (e) {
      if (segurou) { e.preventDefault(); segurou = false; }
    });

    a.addEventListener('contextmenu', function (e) {
      if (a.classList.contains('cg-revela')) e.preventDefault();
    });
  });

  // clicou fora: esconde os corações revelados
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.game-card')) return;
    cards.forEach(function (c) { c.classList.remove('cg-revela'); });
  });

  // --- favoritos sobem pro topo da lista ---
  function ordena() {
    var favs = leFavs().map(function (f) { return f.href; });
    for (var i = favs.length - 1; i >= 0; i--) {
      var a = grade.querySelector('a.game-card[href="' + favs[i].replace(/"/g, '') + '"]');
      if (a) grade.insertBefore(a, grade.firstChild);
    }
  }
  ordena();
})();
