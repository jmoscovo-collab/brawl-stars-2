// === COGUMELO GAMES — Stats (sem backend) ===
let currentGame = null;
let playStartTime = null;

function initStats(gameName) {
    currentGame = gameName;
    playStartTime = Date.now();

    // Track play time every 10s
    setInterval(savePlayTime, 10000);
    window.addEventListener('beforeunload', savePlayTime);

    // Count visit
    const visits = JSON.parse(localStorage.getItem('cogumelo_visits') || '{}');
    visits.total = (visits.total || 0) + 1;
    visits[gameName] = (visits[gameName] || 0) + 1;
    localStorage.setItem('cogumelo_visits', JSON.stringify(visits));

    createStatsFooter();
    updateStatsDisplay();
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
            <span class="stats-arrow">▲</span>
        </div>
        <div class="stats-body" id="stats-body">
            <div class="stats-row">
                <div class="stats-box">
                    <div class="stats-number" id="stats-visits">0</div>
                    <div class="stats-label">Minhas visitas</div>
                </div>
                <div class="stats-box">
                    <div class="stats-number" id="stats-total-time">0s</div>
                    <div class="stats-label">Tempo total jogado</div>
                </div>
                <div class="stats-box">
                    <div class="stats-number" id="stats-game-time">0s</div>
                    <div class="stats-label">Neste jogo</div>
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
            background: rgba(5,5,20,0.95);
            border-top: 1px solid #333;
            z-index: 9999;
            font-family: 'Arial', sans-serif;
        }
        .stats-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 8px 15px; cursor: pointer;
        }
        .stats-title { color: #ccc; font-size: 12px; font-weight: bold; }
        .stats-arrow { color: #666; font-size: 10px; transition: transform 0.3s; }
        .stats-body {
            max-height: 0; overflow: hidden; transition: max-height 0.3s ease;
            padding: 0 15px;
        }
        .stats-body.open { max-height: 300px; padding: 0 15px 12px; }
        .stats-row { display: flex; gap: 8px; margin-bottom: 8px; }
        .stats-box { flex: 1; background: rgba(20,20,50,0.8); border: 1px solid #2a2a4a; border-radius: 8px; padding: 8px; text-align: center; }
        .stats-number { color: #00ff88; font-size: 16px; font-weight: bold; font-family: monospace; }
        .stats-label { color: #666; font-size: 9px; margin-top: 2px; }
        .stats-games { display: flex; flex-wrap: wrap; gap: 6px; }
        .stats-game-chip { background: rgba(30,30,60,0.8); border: 1px solid #333; border-radius: 12px; padding: 3px 10px; font-size: 10px; color: #aaa; }
        .stats-game-chip span { color: #00ccff; font-weight: bold; }
        @media (max-width: 600px) {
            .stats-number { font-size: 13px; }
            .stats-box { padding: 6px; }
        }
    `;
    document.head.appendChild(style);

    // Toggle
    document.getElementById('stats-toggle').addEventListener('click', () => {
        const body = document.getElementById('stats-body');
        body.classList.toggle('open');
        const arrow = footer.querySelector('.stats-arrow');
        arrow.textContent = body.classList.contains('open') ? '▼' : '▲';
    });
}

function updateStatsDisplay() {
    const visits = JSON.parse(localStorage.getItem('cogumelo_visits') || '{}');
    const times = JSON.parse(localStorage.getItem('cogumelo_playtime') || '{}');

    const visitsEl = document.getElementById('stats-visits');
    const totalTimeEl = document.getElementById('stats-total-time');
    const gameTimeEl = document.getElementById('stats-game-time');
    const gamesListEl = document.getElementById('stats-games-list');

    if (visitsEl) visitsEl.textContent = visits.total || 0;
    if (totalTimeEl) totalTimeEl.textContent = formatTime(times.total || 0);
    if (gameTimeEl) gameTimeEl.textContent = formatTime(times[currentGame] || 0);

    // Per-game breakdown
    if (gamesListEl) {
        const gameNames = { home: '🍄 Home', capivara: '🐾 Capivara', clicker: '🍄 Clicker', corrida: '🏎️ Turbo', space: '🚗 Street', brawl: '🤖 Brawl' };
        let html = '';
        for (const [key, label] of Object.entries(gameNames)) {
            if (times[key] && times[key] > 0) {
                html += `<div class="stats-game-chip">${label}: <span>${formatTime(times[key])}</span></div>`;
            }
        }
        gamesListEl.innerHTML = html;
    }
}
