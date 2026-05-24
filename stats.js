// === COGUMELO GAMES — Stats System (Firebase) ===
// Config do Firebase — substituir com dados do projeto real
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "cogumelo-games.firebaseapp.com",
    databaseURL: "https://cogumelo-games-default-rtdb.firebaseio.com",
    projectId: "cogumelo-games",
    storageBucket: "cogumelo-games.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:xxxxxxxxxxxxxxxx"
};

let firebaseApp, firebaseAuth, firebaseDb;
let currentUser = null;
let playStartTime = null;
let currentGame = null;

function initStats(gameName) {
    currentGame = gameName;
    if (typeof firebase === 'undefined') return;

    if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
    }
    firebaseAuth = firebase.auth();
    firebaseDb = firebase.database();

    // Count visit
    firebaseDb.ref('stats/totalVisits').transaction(v => (v || 0) + 1);
    firebaseDb.ref('stats/gameVisits/' + gameName).transaction(v => (v || 0) + 1);

    // Auth state
    firebaseAuth.onAuthStateChanged(user => {
        currentUser = user;
        renderStatsFooter();
        if (user) {
            firebaseDb.ref('users/' + user.uid).update({
                name: user.displayName,
                photo: user.photoURL,
                lastSeen: Date.now()
            });
        }
    });

    // Start tracking play time
    playStartTime = Date.now();
    window.addEventListener('beforeunload', savePlayTime);
    setInterval(savePlayTime, 30000);

    // Render footer
    createStatsFooter();
    loadStats();
}

function loginGoogle() {
    if (!firebaseAuth) return;
    const provider = new firebase.auth.GoogleAuthProvider();
    firebaseAuth.signInWithPopup(provider);
}

function logoutGoogle() {
    if (!firebaseAuth) return;
    savePlayTime();
    firebaseAuth.signOut();
}

function savePlayTime() {
    if (!currentUser || !playStartTime || !currentGame) return;
    const elapsed = Math.floor((Date.now() - playStartTime) / 1000);
    if (elapsed < 2) return;
    playStartTime = Date.now();
    firebaseDb.ref('playtime/' + currentUser.uid + '/' + currentGame).transaction(v => (v || 0) + elapsed);
    firebaseDb.ref('playtime/' + currentUser.uid + '/total').transaction(v => (v || 0) + elapsed);
}

function formatTime(seconds) {
    if (seconds < 60) return seconds + 's';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'min';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h + 'h ' + m + 'min';
}

function createStatsFooter() {
    const footer = document.createElement('div');
    footer.id = 'cogumelo-stats-footer';
    footer.innerHTML = `
        <div class="stats-container">
            <div class="stats-header">
                <span class="stats-title">🍄 Cogumelo Games — Estatísticas</span>
                <button id="stats-login-btn" class="stats-btn" onclick="loginGoogle()">Entrar com Google</button>
            </div>
            <div class="stats-row">
                <div class="stats-box">
                    <div class="stats-number" id="stats-visits">-</div>
                    <div class="stats-label">Visitas totais</div>
                </div>
                <div class="stats-box">
                    <div class="stats-number" id="stats-online">-</div>
                    <div class="stats-label">Jogadores</div>
                </div>
                <div class="stats-box">
                    <div class="stats-number" id="stats-my-time">-</div>
                    <div class="stats-label">Meu tempo</div>
                </div>
            </div>
            <div class="stats-leaderboard">
                <div class="stats-lb-title">🏆 Top Jogadores (tempo total)</div>
                <div id="stats-lb-list"></div>
            </div>
            <div class="stats-user" id="stats-user-info" style="display:none"></div>
        </div>
    `;
    document.body.appendChild(footer);

    const style = document.createElement('style');
    style.textContent = `
        #cogumelo-stats-footer {
            position: fixed; bottom: 0; left: 0; right: 0;
            background: linear-gradient(to top, rgba(5,5,20,0.98), rgba(10,10,30,0.95));
            border-top: 1px solid #333;
            padding: 12px 15px;
            z-index: 9999;
            font-family: 'Arial', sans-serif;
            max-height: 45vh;
            overflow-y: auto;
            transform: translateY(calc(100% - 44px));
            transition: transform 0.3s ease;
        }
        #cogumelo-stats-footer:hover, #cogumelo-stats-footer.open {
            transform: translateY(0);
        }
        .stats-container { max-width: 700px; margin: 0 auto; }
        .stats-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; cursor: pointer; }
        .stats-title { color: #fff; font-size: 13px; font-weight: bold; }
        .stats-btn { padding: 5px 14px; font-size: 11px; font-weight: bold; background: #4285f4; color: #fff; border: none; border-radius: 15px; cursor: pointer; }
        .stats-btn:hover { background: #3367d6; }
        .stats-btn.logout { background: #666; }
        .stats-row { display: flex; gap: 10px; margin-bottom: 10px; }
        .stats-box { flex: 1; background: rgba(30,30,60,0.8); border: 1px solid #333; border-radius: 8px; padding: 8px; text-align: center; }
        .stats-number { color: #00ff88; font-size: 18px; font-weight: bold; font-family: monospace; }
        .stats-label { color: #888; font-size: 10px; margin-top: 2px; }
        .stats-leaderboard { background: rgba(20,20,50,0.8); border: 1px solid #333; border-radius: 8px; padding: 10px; }
        .stats-lb-title { color: #ffcc00; font-size: 12px; font-weight: bold; margin-bottom: 8px; }
        .stats-lb-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .stats-lb-name { color: #fff; font-size: 12px; display: flex; align-items: center; gap: 6px; }
        .stats-lb-name img { width: 18px; height: 18px; border-radius: 50%; }
        .stats-lb-time { color: #00ccff; font-size: 12px; font-family: monospace; }
        .stats-lb-rank { color: #888; font-size: 11px; min-width: 20px; }
        .stats-user { color: #aaa; font-size: 11px; margin-top: 8px; text-align: center; }
        @media (max-width: 600px) {
            .stats-row { flex-direction: row; gap: 6px; }
            .stats-number { font-size: 14px; }
            #cogumelo-stats-footer { padding: 8px 10px; }
        }
    `;
    document.head.appendChild(style);

    // Toggle on tap for mobile
    footer.querySelector('.stats-header').addEventListener('click', () => {
        footer.classList.toggle('open');
    });
}

function loadStats() {
    if (!firebaseDb) return;

    // Total visits
    firebaseDb.ref('stats/totalVisits').on('value', snap => {
        const el = document.getElementById('stats-visits');
        if (el) el.textContent = (snap.val() || 0).toLocaleString();
    });

    // Total unique players
    firebaseDb.ref('users').on('value', snap => {
        const el = document.getElementById('stats-online');
        if (el) el.textContent = snap.numChildren();
    });

    // Leaderboard (top 5 by total time)
    firebaseDb.ref('playtime').orderByChild('total').limitToLast(10).on('value', snap => {
        const list = [];
        snap.forEach(child => {
            list.push({ uid: child.key, total: child.val().total || 0 });
        });
        list.sort((a, b) => b.total - a.total);
        renderLeaderboard(list.slice(0, 5));
    });

    // My play time
    if (currentUser) {
        firebaseDb.ref('playtime/' + currentUser.uid + '/total').on('value', snap => {
            const el = document.getElementById('stats-my-time');
            if (el) el.textContent = formatTime(snap.val() || 0);
        });
    }
}

async function renderLeaderboard(list) {
    const container = document.getElementById('stats-lb-list');
    if (!container) return;

    let html = '';
    const medals = ['🥇', '🥈', '🥉', '4.', '5.'];
    for (let i = 0; i < list.length; i++) {
        const entry = list[i];
        const userSnap = await firebaseDb.ref('users/' + entry.uid).once('value');
        const user = userSnap.val() || {};
        const name = user.name || 'Jogador';
        const photo = user.photo || '';
        html += `
            <div class="stats-lb-row">
                <span class="stats-lb-rank">${medals[i]}</span>
                <span class="stats-lb-name">
                    ${photo ? `<img src="${photo}" alt="">` : ''}
                    ${name}
                </span>
                <span class="stats-lb-time">${formatTime(entry.total)}</span>
            </div>
        `;
    }
    container.innerHTML = html || '<div style="color:#666;font-size:11px;text-align:center">Nenhum jogador ainda</div>';
}

function renderStatsFooter() {
    const btn = document.getElementById('stats-login-btn');
    if (!btn) return;
    if (currentUser) {
        btn.textContent = 'Sair (' + (currentUser.displayName || 'User') + ')';
        btn.className = 'stats-btn logout';
        btn.onclick = logoutGoogle;
        // Update my time
        if (firebaseDb) {
            firebaseDb.ref('playtime/' + currentUser.uid + '/total').on('value', snap => {
                const el = document.getElementById('stats-my-time');
                if (el) el.textContent = formatTime(snap.val() || 0);
            });
        }
    } else {
        btn.textContent = 'Entrar com Google';
        btn.className = 'stats-btn';
        btn.onclick = loginGoogle;
        const el = document.getElementById('stats-my-time');
        if (el) el.textContent = '-';
    }
}
