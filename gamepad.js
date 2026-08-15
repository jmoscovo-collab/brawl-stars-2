// === COGUMELO GAMES — suporte a CONTROLE (PS5 DualSense, PS4, Xbox) ===
// Traduz o controle pra teclas do teclado, então todo jogo de teclado funciona no PS5!
(function(){
    var apertadas = {}; // o que o controle está segurando agora
    var avisou = false;

    function manda(tipo, key, code){
        try {
            var ev = new KeyboardEvent(tipo, { key: key, code: code, bubbles: true, cancelable: true });
            window.dispatchEvent(ev);
            document.dispatchEvent(ev);
        } catch(e){}
    }
    function tecla(nome, key, code, ativa){
        if(ativa && !apertadas[nome]){ apertadas[nome] = true; manda('keydown', key, code); }
        else if(!ativa && apertadas[nome]){ apertadas[nome] = false; manda('keyup', key, code); }
    }
    function mostraAviso(){
        if(avisou) return;
        avisou = true;
        var d = document.createElement('div');
        d.textContent = '🎮';
        d.style.cssText = 'position:fixed;top:10px;left:50%;transform:translateX(-50%);font-size:40px;z-index:99999;pointer-events:none;transition:opacity 1s;';
        document.body.appendChild(d);
        setTimeout(function(){ d.style.opacity = '0'; }, 2000);
        setTimeout(function(){ d.remove(); }, 3200);
    }

    function loop(){
        var pads = navigator.getGamepads ? navigator.getGamepads() : [];
        var p = null;
        for(var i=0;i<pads.length;i++) if(pads[i] && pads[i].connected){ p = pads[i]; break; }
        if(p){
            mostraAviso();
            var ax = p.axes[0] || 0, ay = p.axes[1] || 0;
            var b = function(i){ return !!(p.buttons[i] && p.buttons[i].pressed); };
            // direcional + analógico esquerdo = setas
            tecla('esq',  'ArrowLeft',  'ArrowLeft',  b(14) || ax < -0.35);
            tecla('dir',  'ArrowRight', 'ArrowRight', b(15) || ax >  0.35);
            tecla('cima', 'ArrowUp',    'ArrowUp',    b(12) || ay < -0.5);
            tecla('baixo','ArrowDown',  'ArrowDown',  b(13) || ay >  0.5);
            // ❌ = pular/espaço | ⬜ = E (ataque) | 🔺 = X | ⭕ = Enter
            tecla('pulo',   ' ',     'Space', b(0));
            tecla('ataque', 'e',     'KeyE',  b(2));
            tecla('extra',  'x',     'KeyX',  b(3));
            tecla('enter',  'Enter', 'Enter', b(1) || b(9));
            // R2/L2 também atacam (mais fácil!)
            tecla('atq2', 'j', 'KeyJ', b(7) || b(6));
        }
        requestAnimationFrame(loop);
    }
    addEventListener('gamepadconnected', mostraAviso);
    requestAnimationFrame(loop);
})();
