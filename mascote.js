// Mascote Cogumelo — aparece em todos os jogos.
// 1a vez no jogo: da dicas. Depois: fica torcendo ("Boa!").
(function () {
    try {
        var jogo = location.pathname.split('/').filter(Boolean)[0] || 'home';

        // ===== MASCOTES (o escolhido aparece nos jogos; troque na pagina /conta/) =====
        function lsInt(k) { try { return parseInt(localStorage.getItem(k) || '0', 10) || 0; } catch (e) { return 0; } }
        window.MASCOTES = [
            { id: 'cogumelo', emoji: '🍄', nome: 'Cogu', missao: null },
            { id: 'capivara', emoji: '🦫', nome: 'Capi', missao: null },
            { id: 'bola', emoji: '⚽', nome: 'Bolão', missao: { texto: 'Consiga 300 moedas no Pênaltis', chave: 'penaltis_moedas', meta: 300, jogo: 'Pênaltis' } },
            { id: 'peixe', emoji: '🐟', nome: 'Peixão', missao: { texto: 'Junte R$ 10.000 na Pescaria Maluca', chave: 'pescaria_dinheiro', meta: 10000, jogo: 'Pescaria' } },
            { id: 'aviao', emoji: '✈️', nome: 'Turbinho', missao: { texto: 'Vença 3 corridas na Corrida no Céu', chave: 'avc_vitorias', meta: 3, jogo: 'Corrida no Céu' } },
            { id: 'carro', emoji: '🏎️', nome: 'Zoom', missao: { texto: 'Consiga 150 moedas no Turbo Racing', chave: 'corrida_coins', meta: 150, jogo: 'Turbo Racing' } },
            { id: 'ninja', emoji: '🥷', nome: 'Sombra', missao: { texto: 'Pegue 60 moedas no Cogumelo Parkour', chave: 'parkour2d_moedas', meta: 60, jogo: 'Cogumelo Parkour' } },
            { id: 'dino', emoji: '🦖', nome: 'Rex', missao: { texto: 'Pegue 100 moedas na Fuga do Dino', chave: 'dino_moedas', meta: 100, jogo: 'Fuga do Dino' } },
            { id: 'zumbi', emoji: '🧟', nome: 'Zumbão', missao: { texto: 'Consiga 150 moedas no jogo de Zumbi', chave: 'zombie_coins', meta: 150, jogo: 'Zumbi' } },
            { id: 'mineiro', emoji: '⛏️', nome: 'Mineirinho', missao: { texto: 'Junte 300 moedas no total no Cavando Fundo', chave: 'cavando_totalMoedas', meta: 300, jogo: 'Cavando Fundo' } },
            { id: 'campeao', emoji: '🏆', nome: 'Campeão', missao: { texto: 'Junte 600 moedas no Álbum de Figurinhas', chave: 'figurinhas_moedas', meta: 600, jogo: 'Figurinhas' } },
            { id: 'policia', emoji: '🚓', nome: 'Xerife', missao: { texto: 'Consiga 150 moedas no Polícia VS Ladrão', chave: 'ladrao_coins', meta: 150, jogo: 'Polícia VS Ladrão' } },
            { id: 'lutador', emoji: '🥊', nome: 'Soquinho', missao: { texto: 'Chegue no nível 8 da Luta de Capivara', chave: 'luta_desbloqueado', meta: 8, jogo: 'Luta de Capivara' } },
            { id: 'anjo', emoji: '🪽', nome: 'Asinha', missao: { texto: 'Faça 10 pontos no Cogumelo Voador', chave: 'voador_recorde', meta: 10, jogo: 'Cogumelo Voador' } }
        ];
        window.mascoteProgresso = function (m) { return m.missao ? lsInt(m.missao.chave) : 0; };
        window.mascoteLiberado = function (m) { return !m.missao || lsInt(m.missao.chave) >= m.missao.meta; };
        function mascoteAtual() {
            var id = '';
            try { id = localStorage.getItem('mascote_escolhido') || 'cogumelo'; } catch (e) { id = 'cogumelo'; }
            for (var i = 0; i < window.MASCOTES.length; i++) {
                var m = window.MASCOTES[i];
                if (m.id === id && window.mascoteLiberado(m)) return m;
            }
            return window.MASCOTES[0];
        }
        var meuMascote = mascoteAtual();
        if (jogo === 'conta') return; // na pagina de conta so usamos os dados (sem balao)
        try { if (localStorage.getItem('mascote_escondido') === '1') return; } catch (e) {} // escondido nas opcoes ⚙️

        var DICAS = {
            aviao: ['Bem-vindo à Corrida no Céu! ✈️ Use as setas ou WASD pra voar!', 'Aperta ESPAÇO pra usar o TURBO! 🔥', 'Cuidado com as montanhas e os outros aviões!', 'Ganhe corridas pra comprar aviões novos na loja! 🛒'],
            brawl: ['Bem-vindo à Arena Cogumelo! ⚔️ Mova com WASD e ataque com o mouse!', 'No modo ONLINE você luta contra jogadores de verdade! 🌐'],
            capivara: ['Ajude a capivara! 🦫 Toque ou use as setas pra desviar!', 'Quanto mais longe você vai, mais pontos ganha!'],
            cavando: ['Bem-vindo ao Cavando Fundo! ⛏️ Clique nos blocos pra minerar!', 'Quanto mais fundo, mais raros os minérios! 💎', 'Cuidado com a lava e o gás lá embaixo! 🌋', 'Use o elevador pra voltar rapidinho e vender na loja!'],
            chuva: ['Chuva de Cogumelos! 🍄 Pegue os cogumelos bons que caem do céu!', 'Desvie dos ruins... eles tiram pontos!'],
            clicker: ['Clique no cogumelo pra ganhar pontos! 🍄', 'Compre melhorias pra clicar sozinho!'],
            cozinha: ['Bem-vindo à Cozinha da Capivara! 🦫🍳', 'Aperte os ingredientes NA ORDEM do pedido, de baixo pra cima!', 'Entregou rápido e sem erro = gorjeta EM DOBRO! 💰', 'Junte moedas pra comprar chapéus pra capivara! 🎩'],
            corrida: ['Bem-vindo ao Turbo Racing! 🏎️ Setas ou WASD pra dirigir!', 'Ganhe corridas e gire a roleta a cada 1 hora! 🎰', 'Carros mais raros são mais rápidos!'],
            desenha: ['Desenha e Adivinha! 🎨 Um desenha, os outros adivinham!', 'No modo online você joga com amigos de verdade!'],
            dino: ['Fuja do T-Rex! 🦖 Desvie dos obstáculos correndo!', 'Não olha pra trás... ele tá vindo! 😱'],
            estaciona: ['Estacione o carro na vaga sem bater! 🚗', 'Vá devagar nas curvas apertadas!'],
            furacao: ['Você é o furacão! 🌪️ Engula tudo pra crescer!', 'Segure o mouse ou use WASD pra andar!', 'No ONLINE você pode engolir outros jogadores! 😈'],
            labirinto: ['Ache a saída do labirinto! 🌀', 'Alguns caminhos são enganação... explore tudo!'],
            ladrao: ['Polícia VS Ladrão! 🚓 Aperte o botão vermelho na hora certa!', 'São 250 níveis... será que você chega no final?'],
            luta: ['Luta de Capivara! 🦫🥊 Pule e dê golpes pra vencer!', 'São 100 níveis e 14 skins pra desbloquear!'],
            ninja: ['Vire um ninja! 🥷 Pule entre as plataformas!', 'O tempo é seu inimigo... seja rápido!'],
            parkour: ['Parkour 3D! 🏃 Pule de plataforma em plataforma!', 'Se cair, começa de novo... calma e precisão!'],
            parkour2d: ['Cogumelo Parkour! 🍄 Pule com ESPAÇO — tem PULO DUPLO!', 'Cuidado com a lava e os espinhos! 🌋', 'Pegue as moedas pra comprar skins na loja!'],
            penaltis: ['Hora do pênalti! ⚽ Clique onde quer chutar!', 'Na defesa, clique pro goleiro pular!', 'Ganhe níveis pra desbloquear bolas incríveis — tem até a CURVA MASTER! 🍌'],
            pescaria: ['Pescaria Maluca! 🎣 Jogue a linha e espere fisgar!', 'Quando fisgar, CLIQUE RÁPIDO pra puxar o peixe!', 'Peixes lendários são raríssimos... boa sorte! ✨', 'Compre varas melhores pra pegar peixes mais raros!'],
            prisao: ['Fuja da prisão! 🚔 Ache o caminho sem ser pego!', 'Cada nível fica mais difícil... pense antes de correr!'],
            quiz: ['Quiz Cogumelo! 🧠 Responda certo pra ganhar pontos!', 'No modo online, quem responde mais rápido ganha mais!'],
            sorte: ['Sorte do Cogumelo! 🍀 Gire e torça pela sorte grande!', 'Volte todo dia pra tentar de novo!'],
            space: ['Street Drive! 🚙 Dirija desviando do trânsito!', 'Quanto mais longe, mais pontos!'],
            voador: ['Cogumelo Voador! 🪽 Toque ou aperte ESPAÇO pra bater as asas!', 'Passe entre os canos sem encostar!'],
            zombie: ['Sobreviva aos zumbis! 🧟 Atire e não pare de andar!', 'Pegue kits e comida entre as ondas!', 'No celular, use o joystick da bolinha!']
        };
        var dicas = DICAS[jogo] || ['Divirta-se! 🍄', 'Qualquer coisa, eu tô aqui torcendo por você!'];

        var CONSOLO = ['Você consegue! 💪', 'Não desiste! 🍄', 'Quase! Tenta de novo! 🔁', 'Errar faz parte, bora de novo! 💚', 'Na próxima você ganha! ⭐', 'Respira fundo... e VAI! 🚀', 'Tô com você, tenta mais uma vez! 🤗', 'Você tá quase lá, eu vi! 👀'];
        var APOIO = ['Boa! 🔥', 'Você é fera! 💪', 'Mandou bem! ⭐', 'Uau, tá jogando muito! 😎', 'Continue assim! 🚀', 'Tô torcendo por você! 🍄', 'Que jogada! 👏', 'Você consegue! 💚', 'Incrível! ✨', 'Ninguém te segura! 🏆'];

        // CSS + HTML do mascote
        var css = document.createElement('style');
        css.textContent = '#mascoteCogu{position:fixed;left:8px;bottom:10px;z-index:9999;display:flex;align-items:flex-end;gap:6px;pointer-events:none;max-width:min(72vw,330px);font-family:Arial,sans-serif;}' +
            '#mascoteCogu .cara{font-size:40px;animation:pulaMascCogu 2.6s ease-in-out infinite;filter:drop-shadow(0 3px 6px #000);}' +
            '@keyframes pulaMascCogu{0%,100%{transform:translateY(0) rotate(-3deg);}50%{transform:translateY(-7px) rotate(3deg);}}' +
            '#mascoteCogu .fala{background:#fff;color:#222;border-radius:14px;padding:7px 11px;font-size:13px;font-weight:bold;box-shadow:0 3px 10px rgba(0,0,0,0.6);position:relative;opacity:0;transition:opacity .3s,transform .3s;transform:translateY(6px);}' +
            '#mascoteCogu.falando .fala{opacity:1;transform:translateY(0);}' +
            '#mascoteCogu .fala::after{content:"";position:absolute;left:-7px;bottom:9px;border:7px solid transparent;border-right-color:#fff;}';
        document.head.appendChild(css);

        var box = document.createElement('div');
        box.id = 'mascoteCogu';
        box.innerHTML = '<span class="cara">' + meuMascote.emoji + '</span><span class="fala" id="mascoteCoguFala">Oi!</span>';
        var fala = null, timer = null;

        function monta() {
            if (!document.body) return;
            document.body.appendChild(box);
            fala = document.getElementById('mascoteCoguFala');
            comeca();
            vigiaDerrota();
        }

        function diz(frase, ms) {
            if (!fala) return;
            fala.textContent = frase;
            box.classList.add('falando');
            if (timer) clearTimeout(timer);
            timer = setTimeout(function () { box.classList.remove('falando'); }, ms || 4000);
        }

        function comeca() {
            var chave = 'mascote_viu_' + jogo;
            var jaVeio = false;
            try { jaVeio = !!localStorage.getItem(chave); } catch (e) {}
            if (!jaVeio) {
                try { localStorage.setItem(chave, '1'); } catch (e) {}
                var i = 0;
                var proxima = function () {
                    if (i >= dicas.length) { apoiar(); return; }
                    diz(dicas[i], 4600);
                    i++;
                    setTimeout(proxima, 5200);
                };
                setTimeout(proxima, 1200);
            } else {
                setTimeout(function () { diz(APOIO[Math.floor(Math.random() * APOIO.length)]); }, 8000);
                apoiar();
            }
        }

        function apoiar() {
            var loop = function () {
                var espera = 35000 + Math.random() * 50000; // 35 a 85 segundos
                setTimeout(function () {
                    diz(APOIO[Math.floor(Math.random() * APOIO.length)]);
                    loop();
                }, espera);
            };
            loop();
        }

        // Detecta derrota na tela (ex: "game over", "você perdeu") e consola o jogador
        var RE_DERROTA = /game ?over|voc[eê] perdeu|perdeu!|derrota|fim de jogo|tente (de novo|novamente)|voc[eê] (caiu|morreu|bateu)|n[aã]o foi dessa vez/i;
        var ultimoConsolo = 0;
        function talvezConsola(txt) {
            if (!txt || txt.length > 400 || !RE_DERROTA.test(txt)) return;
            var agora = new Date().getTime();
            if (agora - ultimoConsolo < 20000) return; // no maximo 1 consolo a cada 20s
            ultimoConsolo = agora;
            setTimeout(function () { diz(CONSOLO[Math.floor(Math.random() * CONSOLO.length)], 4500); }, 900);
        }
        function vigiaDerrota() {
            try {
                var IGNORA = /^(joyBola|joyBase|pedidos|hudTopo|maoHud|bandeja|timerBar|mascoteCogu)$/;
                function ignorado(t) {
                    for (var n = t; n && n.getAttribute; n = n.parentNode) {
                        if (IGNORA.test(n.id || '')) return true;
                        if (n === box) return true;
                    }
                    return false;
                }
                new MutationObserver(function (muts) {
                    for (var i = 0; i < muts.length; i++) {
                        var m = muts[i];
                        if (ignorado(m.target)) continue;
                        if (m.type === 'characterData') { talvezConsola(m.target.data); continue; }
                        if (m.type === 'attributes') { talvezConsola(m.target.textContent); continue; }
                        for (var j = 0; j < m.addedNodes.length; j++) talvezConsola(m.addedNodes[j].textContent);
                    }
                }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['style'] });
            } catch (e) {}
        }

        if (document.body) monta();
        else document.addEventListener('DOMContentLoaded', monta);
    } catch (e) { /* mascote nunca pode quebrar o jogo */ }
})();
