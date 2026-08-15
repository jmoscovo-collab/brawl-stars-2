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
        try{ if(localStorage.getItem('cg_ps5')==='1') { avisou = true; return; } }catch(e){}
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
            // ❌ = AVANÇAR sempre (pula, confirma, começa)
            tecla('pulo',  ' ',     'Space', b(0));
            tecla('enter', 'Enter', 'Enter', b(0) || b(1) || b(9));
            // ⬜ = E (ataque) | R2/L2 também atacam
            tecla('ataque', 'e', 'KeyE', b(2));
            tecla('atq2',   'j', 'KeyJ', b(7) || b(6));
            // 🕹️ analógico DIREITO = girar a câmera (jogos 3D)
            var rx = p.axes[2] || 0, ry = p.axes[3] || 0;
            if(Math.abs(rx) > 0.25 || Math.abs(ry) > 0.25){
                try {
                    var mv = new MouseEvent('mousemove', { bubbles:true, movementX: rx*14, movementY: ry*14,
                        clientX: innerWidth/2, clientY: innerHeight/2 });
                    Object.defineProperty(mv, 'movementX', { value: rx*14 });
                    Object.defineProperty(mv, 'movementY', { value: ry*14 });
                    (document.querySelector('canvas') || document).dispatchEvent(mv);
                    document.dispatchEvent(mv);
                } catch(e){}
            }
        }
        requestAnimationFrame(loop);
    }
    addEventListener('gamepadconnected', mostraAviso);
    requestAnimationFrame(loop);
})();
