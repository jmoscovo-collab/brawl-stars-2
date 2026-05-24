// === COGUMELO GAMES — Stats (gratuito, sem backend) ===
let currentGame = null;
let playStartTime = null;
let playerName = null;

function initStats(gameName) {
    currentGame = gameName;
    playStartTime = Date.now();

    playerName = localStorage.getItem('cogumelo_player_name');
    if (!playerName) {
        setTimeout(() => {
            const name = prompt('🍄 Qual seu nome de jogador?');
            playerName = (name && name.trim()) ? name.trim().substring(0, 20) : 'Anônimo';
            localStorage.setItem('cogumelo_player_name', playerName);
            updateStatsDisplay();
        }, 1000);
        playerName = 'Anônimo';
    }

    setInterval(savePlayTime, 10000);
    window.addEventListener('beforeunload', savePlayTime);

    const visits = JSON.parse(localStorage.getItem('cogumelo_visits') || '{}');
    visits.total = (visits.total || 0) + 1;
    visits[gameName] = (visits[gameName] || 0) + 1;
    localStorage.setItem('cogumelo_visits', JSON.stringify(visits));

    createStatsFooter();
    updateStatsDisplay();
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
        corrida: '🏎️ Turbo', space: '🚗 Street', brawl: '🤖 Brawl'
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
