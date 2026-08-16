// === COGUMELO GAMES — Stats (gratuito, sem backend) ===
// 🎮 PS5 se apresenta como "PlayStation" — liga o modo PS5 SOZINHO, sem precisar de código!
try {
    if (/PlayStation/i.test(navigator.userAgent)) localStorage.setItem('cg_ps5', '1');
} catch (e) {}
// 🎮 MODO PS5 (código secreto "estou_no_ps5"): mostra um CONTROLE DE TELA em todo jogo.
// Os botões mandam teclas de teclado — que todo jogo entende — e são clicáveis com o cursor do PS5.
function cgCriaControlePs5(jogo) {
    try {
        if (localStorage.getItem('cg_ps5') !== '1') return;
        if (['home','conta','sugestoes','controle'].indexOf(jogo) >= 0) return;
        if (window.cgPs5Ligado) return;
        window.cgPs5Ligado = true;
        // 🕹️ SEM BOTÕES! O analógico do PS5 move o cursor — e o cursor vira o movimento:
        // cursor na ESQUERDA da tela = andar pra esquerda, DIREITA = direita,
        // EM CIMA = pular, EMBAIXO = abaixar. Segurar ❌ = atacar/confirmar.
        var seguradas = {};
        function manda(tipo, key, code) {
            try {
                var ev = new KeyboardEvent(tipo, { key: key, code: code, bubbles: true, cancelable: true });
                window.dispatchEvent(ev); document.dispatchEvent(ev);
            } catch (e) {}
        }
        function tecla(nome, key, code, ativa) {
            if (ativa && !seguradas[nome]) { seguradas[nome] = true; manda('keydown', key, code); }
            else if (!ativa && seguradas[nome]) { seguradas[nome] = false; manda('keyup', key, code); }
        }
        var mx = innerWidth / 2, my = innerHeight / 2, clicando = false;
        addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; }, true);
        addEventListener('pointerdown', function () { clicando = true; }, true);
        addEventListener('pointerup', function () { clicando = false; }, true);
        addEventListener('pointercancel', function () { clicando = false; }, true);
        (function anda() {
            var W = innerWidth, H = innerHeight;
            tecla('esq',   'ArrowLeft',  'ArrowLeft',  mx < W * 0.34);
            tecla('esq2',  'a',          'KeyA',       mx < W * 0.34);
            tecla('dir',   'ArrowRight', 'ArrowRight', mx > W * 0.66);
            tecla('dir2',  'd',          'KeyD',       mx > W * 0.66);
            tecla('cima',  'ArrowUp',    'ArrowUp',    my < H * 0.28);
            tecla('cima2', 'w',          'KeyW',       my < H * 0.28);
            tecla('pulo',  ' ',          'Space',      my < H * 0.28);
            tecla('baixo', 'ArrowDown',  'ArrowDown',  my > H * 0.8);
            tecla('baixo2','s',          'KeyS',       my > H * 0.8);
            // segurar ❌ (clique) = atacar
            tecla('atq',  'e', 'KeyE', clicando);
            tecla('atq2', 'j', 'KeyJ', clicando);
            requestAnimationFrame(anda);
        })();
    } catch (e) {}
}

// 🎮 Modo PS5: responde "COMPUTADOR" sozinho em QUALQUER tela de "onde você está jogando?"
function cgAutoEscolhePc() {
    try {
        if (localStorage.getItem('cg_ps5') !== '1') return;
        var ultimoClique = 0;
        setInterval(function () {
            try {
                if (Date.now() - ultimoClique < 3000) return;
                // se o jogo tem a função de escolher, usa direto!
                if (typeof window.escolheDisp === 'function') {
                    try { window.escolheDisp('pc'); ultimoClique = Date.now(); return; } catch (e) {}
                }
                var alvo = document.getElementById('ds-pc') || document.getElementById('btnPC') ||
                           document.getElementById('btnPc') || document.getElementById('devPC');
                if (!alvo) {
                    var els = document.querySelectorAll('button, .opt, .option, [onclick], div.label, div');
                    for (var i = 0; i < els.length; i++) {
                        var tx = (els[i].textContent || '').replace(/[^A-Za-z]/g, '').toUpperCase();
                        if (tx === 'COMPUTADOR' && els[i].children.length <= 1) { alvo = els[i]; break; }
                    }
                }
                if (alvo && alvo.offsetParent !== null) {
                    ultimoClique = Date.now();
                    alvo.click(); // o clique "sobe" até quem cuida do botão
                }
            } catch (e) {}
        }, 700);
    } catch (e) {}
}
cgAutoEscolhePc();

let currentGame = null;
let playStartTime = null;
let playerName = null;

function initStats(gameName) {
    currentGame = gameName;
    playStartTime = Date.now();

    playerName = localStorage.getItem('cogumelo_player_name') || 'Anônimo';
    cgCriaControlePs5(gameName);

    setInterval(savePlayTime, 10000);
    window.addEventListener('beforeunload', savePlayTime);

    const visits = JSON.parse(localStorage.getItem('cogumelo_visits') || '{}');
    visits.total = (visits.total || 0) + 1;
    visits[gameName] = (visits[gameName] || 0) + 1;
    localStorage.setItem('cogumelo_visits', JSON.stringify(visits));

    // Barra de estatísticas ESCONDIDA a pedido do Davi (25/07) — pra reativar, descomente:
    // createStatsFooter();
    // updateStatsDisplay();
    incrementGlobalVisits();
}

function savePlayTime() {
    if (!playStartTime || !currentGame) return;
    const elapsed = Math.floor((Date.now() - playStartTime) / 1000);
    if (elapsed < 2) return;
    playStartTime = Date.now();

    const times = JSON.parse(localStorage.getItem('cogumelo_playtime') || '{}');
    times[currentGame] = (times[currentGame] || 0) + elapsed;
    times.total = (times.total || 0) + elapsed;
    localStorage.setItem('cogumelo_playtime', JSON.stringify(times));
    updateStatsDisplay();
    cgAutoSave();
}

// === AUTO-SAVE da conta (roda a cada 10s e ao sair da página) ===
// Se o jogador estiver logado (/conta/), guarda o progresso de todos os jogos na conta.
function cgAutoSave() {
    try {
        const u = localStorage.getItem('cg_usuario');
        if (!u) return;
        const contas = JSON.parse(localStorage.getItem('cg_contas') || '{}');
        if (!contas[u]) contas[u] = { senha: localStorage.getItem('cg_senhaHash') || '' };
        const dados = {};
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!k.startsWith('cg_')) dados[k] = localStorage.getItem(k);
        }
        contas[u].dados = dados;
        contas[u].atualizado = Date.now();
        localStorage.setItem('cg_contas', JSON.stringify(contas));
        // ☁️ sincroniza com a nuvem no máximo a cada 60s
        const h = localStorage.getItem('cg_senhaHash');
        const agora = Date.now();
        const ultimo = parseInt(localStorage.getItem('cg_sync_last') || '0');
        if (h && agora - ultimo > 60000) {
            localStorage.setItem('cg_sync_last', String(agora));
            fetch('https://y67msybrr8.execute-api.sa-east-1.amazonaws.com', {
                method: 'POST', headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ acao: 'salvar', nome: u, senhaHash: h, dados: dados })
            }).then(function(r){
                // conta desativada/senha trocada = desloga NA HORA
                if (r.status === 401) {
                    localStorage.removeItem('cg_usuario');
                    localStorage.removeItem('cg_senhaHash');
                    alert('🚪 Sua conta foi desconectada. Faça login de novo em cogumelogames.com.br/conta/');
                }
            }).catch(function(){});
        }
    } catch (e) {}
}

async function incrementGlobalVisits() {
    try {
        const res = await fetch('https://api.counterapi.dev/v1/cogumelogames-br/visits/up');
        if (res.ok) {
            const data = await res.json();
            const el = document.getElementById('stats-global-visits');
            if (el && data.count) el.textContent = formatNumber(data.count);
        }
    } catch(e) {}
}

function formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n);
}

function formatTime(seconds) {
    if (!seconds || seconds < 1) return '0s';
    if (seconds < 60) return seconds + 's';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'min ' + (seconds % 60) + 's';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h + 'h ' + m + 'min';
}

function createStatsFooter() {
    const footer = document.createElement('div');
    footer.id = 'cogumelo-stats-footer';
    footer.innerHTML = `
        <div class="stats-header" id="stats-toggle">
            <span class="stats-title">📊 Estatísticas</span>
            <span class="stats-mini-info" id="stats-mini"></span>
            <span class="stats-arrow">▲</span>
        </div>
        <div class="stats-body" id="stats-body">
            <div class="stats-player">
                <span class="stats-player-name" id="stats-player-name">Anônimo</span>
                <button class="stats-rename-btn" id="stats-rename">✏️</button>
            </div>
            <div class="stats-row">
                <div class="stats-box stats-box-global">
                    <div class="stats-number" id="stats-global-visits">...</div>
                    <div class="stats-label">Visitas totais (todos)</div>
                </div>
                <div class="stats-box">
                    <div class="stats-number" id="stats-my-visits">0</div>
                    <div class="stats-label">Minhas visitas</div>
                </div>
                <div class="stats-box">
                    <div class="stats-number" id="stats-total-time">0s</div>
                    <div class="stats-label">Meu tempo total</div>
                </div>
            </div>
            <div class="stats-row">
                <div class="stats-box">
                    <div class="stats-number" id="stats-game-time">0s</div>
                    <div class="stats-label">Neste jogo</div>
                </div>
                <div class="stats-box">
                    <div class="stats-number" id="stats-sessions">0</div>
                    <div class="stats-label">Sessões</div>
                </div>
                <div class="stats-box">
                    <div class="stats-number" id="stats-favorite">-</div>
                    <div class="stats-label">Jogo favorito</div>
                </div>
            </div>
            <div class="stats-games" id="stats-games-list"></div>
        </div>
    `;
    document.body.appendChild(footer);

    const style = document.createElement('style');
    style.textContent = `
        #cogumelo-stats-footer {
            position: fixed; bottom: 0; left: 0; right: 0;
            background: rgba(5,5,20,0.97);
            border-top: 2px solid #1a1a3a;
            z-index: 9999;
            font-family: 'Arial', sans-serif;
            backdrop-filter: blur(10px);
        }
        .stats-header {
            display: flex; align-items: center;
            padding: 10px 15px; cursor: pointer;
            gap: 10px;
        }
        .stats-title { color: #ccc; font-size: 12px; font-weight: bold; }
        .stats-mini-info { color: #666; font-size: 11px; flex: 1; }
        .stats-arrow { color: #666; font-size: 10px; transition: transform 0.3s; }
        .stats-body {
            max-height: 0; overflow: hidden; transition: max-height 0.4s ease;
            padding: 0 15px;
        }
        .stats-body.open { max-height: 400px; padding: 0 15px 15px; }
        .stats-player {
            display: flex; align-items: center; gap: 8px;
            margin-bottom: 10px; padding: 6px 12px;
            background: rgba(0,255,136,0.05); border: 1px solid rgba(0,255,136,0.2);
            border-radius: 20px; width: fit-content;
        }
        .stats-player-name { color: #00ff88; font-size: 14px; font-weight: bold; }
        .stats-rename-btn {
            background: none; border: none; cursor: pointer; font-size: 12px;
            opacity: 0.5; transition: opacity 0.2s;
        }
        .stats-rename-btn:hover { opacity: 1; }
        .stats-row { display: flex; gap: 8px; margin-bottom: 8px; }
        .stats-box {
            flex: 1; background: rgba(20,20,50,0.8);
            border: 1px solid #2a2a4a; border-radius: 10px;
            padding: 10px; text-align: center;
        }
        .stats-box-global { border-color: rgba(0,204,255,0.3); background: rgba(0,204,255,0.05); }
        .stats-number { color: #00ff88; font-size: 18px; font-weight: bold; font-family: monospace; }
        .stats-box-global .stats-number { color: #00ccff; }
        .stats-label { color: #666; font-size: 9px; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.5px; }
        .stats-games { display: flex; flex-wrap: wrap; gap: 6px; }
        .stats-game-chip {
            background: rgba(30,30,60,0.8); border: 1px solid #333;
            border-radius: 12px; padding: 4px 12px; font-size: 10px; color: #aaa;
        }
        .stats-game-chip span { color: #00ccff; font-weight: bold; }
        @media (max-width: 600px) {
            .stats-number { font-size: 14px; }
            .stats-box { padding: 7px 5px; }
            .stats-row { gap: 5px; }
        }
    `;
    document.head.appendChild(style);

    document.getElementById('stats-toggle').addEventListener('click', () => {
        const body = document.getElementById('stats-body');
        body.classList.toggle('open');
        const arrow = footer.querySelector('.stats-arrow');
        arrow.textContent = body.classList.contains('open') ? '▼' : '▲';
    });

    document.getElementById('stats-rename').addEventListener('click', (e) => {
        e.stopPropagation();
        const name = prompt('🍄 Novo nome de jogador:', playerName);
        if (name && name.trim()) {
            playerName = name.trim().substring(0, 20);
            localStorage.setItem('cogumelo_player_name', playerName);
            updateStatsDisplay();
        }
    });
}

function updateStatsDisplay() {
    const visits = JSON.parse(localStorage.getItem('cogumelo_visits') || '{}');
    const times = JSON.parse(localStorage.getItem('cogumelo_playtime') || '{}');

    const nameEl = document.getElementById('stats-player-name');
    const myVisitsEl = document.getElementById('stats-my-visits');
    const totalTimeEl = document.getElementById('stats-total-time');
    const gameTimeEl = document.getElementById('stats-game-time');
    const sessionsEl = document.getElementById('stats-sessions');
    const favoriteEl = document.getElementById('stats-favorite');
    const gamesListEl = document.getElementById('stats-games-list');
    const miniEl = document.getElementById('stats-mini');

    if (nameEl) nameEl.textContent = playerName || 'Anônimo';
    if (myVisitsEl) myVisitsEl.textContent = visits.total || 0;
    if (totalTimeEl) totalTimeEl.textContent = formatTime(times.total || 0);
    if (gameTimeEl) gameTimeEl.textContent = formatTime(times[currentGame] || 0);
    if (sessionsEl) sessionsEl.textContent = visits.total || 0;

    if (miniEl) {
        miniEl.textContent = `${playerName || 'Anônimo'} • ${formatTime(times.total || 0)} jogados`;
    }

    const gameNames = {
        home: '🍄 Home', capivara: '🐾 Capivara', clicker: '🍄 Clicker',
        corrida: '🏎️ Turbo', space: '🚗 Street', brawl: '🤖 Arena',
        zombie: '🧟 Zombie', penaltis: '⚽ Pênaltis', ninja: '🥷 Ninja',
        parkour: '🏃 Parkour', labirinto: '👻 Labirinto', prisao: '🔓 Prisão'
    };

    let maxTime = 0, favGame = '-';
    for (const [key, label] of Object.entries(gameNames)) {
        if (times[key] && times[key] > maxTime) {
            maxTime = times[key];
            favGame = label;
        }
    }
    if (favoriteEl) favoriteEl.textContent = favGame;

    if (gamesListEl) {
        let html = '';
        for (const [key, label] of Object.entries(gameNames)) {
            if (times[key] && times[key] > 0) {
                html += `<div class="stats-game-chip">${label}: <span>${formatTime(times[key])}</span></div>`;
            }
        }
        gamesListEl.innerHTML = html || '<div class="stats-game-chip">Jogue para ver seu tempo!</div>';
    }
}
