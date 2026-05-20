import { db, auth } from "./firebase-config.js";
import { ref, onValue, push, remove, runTransaction, onDisconnect, set, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const ADMIN_EMAIL = 'theminescout@minescout.net';
let selectedSourceId = null; // Track the first clicked card

// EXPORT THE INIT FUNCTION
export function initFeatures() {
    console.log("Features initializing...");
    initThemeToggle();
    
    const sidebarInterval = setInterval(() => {
        const githubContainer = document.getElementById('github-stats-container');
        if (githubContainer) {
            clearInterval(sidebarInterval); 
            initGithubWidget();
            initWebStats();
        }
    }, 200);

    const roadmapInterval = setInterval(() => {
        if(document.querySelector('.roadmap-container')) {
            clearInterval(roadmapInterval);
            initLiveRoadmap();
        }
    }, 200);

    if(document.querySelector('.code-runner')) {
        initCodeRunners();
    }
}

// --- ROADMAP LOGIC ---
function initLiveRoadmap() {
    const treeContainer = document.getElementById('tree-visualizer');
    const roadmapRef = ref(db, 'roadmap');
    const connectionsRef = ref(db, 'roadmap_connections');

    // 1. Listen for Roadmap Cards
    onValue(roadmapRef, (snapshot) => {
        const data = snapshot.val() || {};
        
        // Clear lists
        document.querySelectorAll('.roadmap-col .list').forEach(el => el.innerHTML = '');
        
        const grouped = { planned: [], progress: [], done: [] };

        Object.keys(data).forEach(key => {
            const item = { ...data[key], id: key };
            if(!grouped[item.status]) item.status = 'planned';
            grouped[item.status].push(item);
            
            const list = document.querySelector(`#col-${item.status} .list`);
            
            if (list) {
                const card = document.createElement('div');
                card.className = 'roadmap-card';
                card.id = `card-${key}`; 
                
                // IMPORTANT: Add the click listener for connections
                card.onclick = (e) => handleCardClick(e, key);

                card.innerHTML = `
                    ${item.title} 
                    <span class="roadmap-tag">${item.tag}</span>
                    <span class="btn-delete-item" onclick="event.stopPropagation(); window.deleteRoadmapItem('${key}')">×</span>
                `;
                list.appendChild(card);
            }
        });

        // Auto-delete if > 3 items
        Object.keys(grouped).forEach(status => {
            const items = grouped[status];
            if (items.length > 3) {
                items.sort((a, b) => a.timestamp - b.timestamp);
                const oldest = items[0];
                window.deleteRoadmapItem(oldest.id, true);
            }
        });

        // Update UI
        drawConnections(); 
        renderTreeDiagram(grouped, treeContainer);
        setTimeout(checkAdminUI, 1000); 
    });

    // 2. Listen for Connections (Lines)
    onValue(connectionsRef, () => drawConnections());

    setupRoadmapInput('input-planned', 'btn-planned', 'planned');
    setupRoadmapInput('input-progress', 'btn-progress', 'progress');
    setupRoadmapInput('input-done', 'btn-done', 'done');
    
    window.addEventListener('resize', drawConnections);
}

// --- CLICK TO CONNECT LOGIC ---
function handleCardClick(e, key) {
    const user = auth.currentUser;
    // Only allow Admin to connect cards
    if (!user || user.email !== ADMIN_EMAIL) return;

    const card = document.getElementById(`card-${key}`);

    if (selectedSourceId === null) {
        // First Selection
        selectedSourceId = key;
        card.classList.add('selected-for-connect');
    } else if (selectedSourceId === key) {
        // Deselect if clicking the same card
        selectedSourceId = null;
        card.classList.remove('selected-for-connect');
    } else {
        // Second Selection -> Connect
        const sourceId = selectedSourceId;
        const targetId = key;
        
        push(ref(db, 'roadmap_connections'), {
            from: sourceId,
            to: targetId
        });

        // Cleanup UI
        const sourceCard = document.getElementById(`card-${sourceId}`);
        if(sourceCard) sourceCard.classList.remove('selected-for-connect');
        selectedSourceId = null;
    }
}

// --- DRAW SVG LINES ---
async function drawConnections() {
    const svg = document.getElementById('roadmap-lines');
    if (!svg) return;
    
    // Reset SVG
    svg.innerHTML = '';

    get(ref(db, 'roadmap_connections')).then((snapshot) => {
        const connections = snapshot.val() || {};
        const container = document.querySelector('.roadmap-container');
        if(!container) return;
        const containerRect = container.getBoundingClientRect();
        
        Object.keys(connections).forEach(connKey => {
            const conn = connections[connKey];
            const cardA = document.getElementById(`card-${conn.from}`);
            const cardB = document.getElementById(`card-${conn.to}`);

            if (cardA && cardB) {
                const rectA = cardA.getBoundingClientRect();
                const rectB = cardB.getBoundingClientRect();

                // Calculate center points relative to container scroll/position
                const x1 = (rectA.left + rectA.width / 2) - containerRect.left + container.scrollLeft;
                const y1 = (rectA.top + rectA.height / 2) - containerRect.top;
                const x2 = (rectB.left + rectB.width / 2) - containerRect.left + container.scrollLeft;
                const y2 = (rectB.top + rectB.height / 2) - containerRect.top;

                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", x1);
                line.setAttribute("y1", y1);
                line.setAttribute("x2", x2);
                line.setAttribute("y2", y2);
                
                // Allow deleting lines
                line.onclick = (e) => {
                    e.stopPropagation(); // Don't click cards underneath
                    if(auth.currentUser?.email === ADMIN_EMAIL && confirm("Delete connection?")) {
                        remove(ref(db, `roadmap_connections/${connKey}`));
                    }
                };
                
                // Style for line
                line.style.stroke = "#5a8a5a";
                line.style.strokeWidth = "3";
                line.style.cursor = "pointer";
                line.style.pointerEvents = "auto";
                
                svg.appendChild(line);
            }
        });
    });
}

function setupRoadmapInput(inputId, btnId, status) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    if(!input || !btn) return;

    const saveTask = () => {
        const text = input.value.trim();
        const tagSelect = input.parentElement.querySelector('.roadmap-tag-select');
        const tag = tagSelect ? tagSelect.value : "General";
        if (text) {
            push(ref(db, 'roadmap'), { title: text, tag: tag, status: status, timestamp: Date.now() }).then(() => input.value = '');
        }
    };
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') saveTask(); });
    btn.addEventListener('click', (e) => { e.preventDefault(); saveTask(); });
}

window.deleteRoadmapItem = async function(key, skipConfirm = false) {
    if(skipConfirm || confirm("Remove this item?")) {
        await remove(ref(db, `roadmap/${key}`));
        
        // Remove associated connections
        get(ref(db, 'roadmap_connections')).then(snap => {
            const conns = snap.val() || {};
            Object.keys(conns).forEach(k => {
                if(conns[k].from === key || conns[k].to === key) {
                    remove(ref(db, `roadmap_connections/${k}`));
                }
            });
        });
    }
};

function checkAdminUI() {
    const user = auth.currentUser;
    const isAdmin = user && user.email === ADMIN_EMAIL;
    document.querySelectorAll('.roadmap-input-group').forEach(el => el.style.display = isAdmin ? 'flex' : 'none');
    document.querySelectorAll('.btn-delete-item').forEach(el => el.style.display = isAdmin ? 'block' : 'none');
}

function renderTreeDiagram(data, container) {
    if(!container) return;
    let html = `<h3>Project Evolution Tree</h3>`;
    html += `<div class="tree-level"><span class="level-label">Foundation</span>` + data.done.map(t => `<div class="tree-node done">${t.title}</div>`).join('') + `</div>`;
    html += `<div class="tree-level"><span class="level-label">Building</span>` + data.progress.map(t => `<div class="tree-node progress">${t.title}</div>`).join('') + `</div>`;
    html += `<div class="tree-level"><span class="level-label">Future</span>` + data.planned.map(t => `<div class="tree-node planned">${t.title}</div>`).join('') + `</div>`;
    container.innerHTML = html;
}

// --- OTHER FEATURES ---
function initWebStats() {
    const presenceRef = ref(db, 'analytics/active_visitors');
    const connectedRef = ref(db, '.info/connected');
    const myPresenceRef = push(presenceRef);
    onValue(connectedRef, (snap) => { if (snap.val() === true) { set(myPresenceRef, true).catch(console.error); onDisconnect(myPresenceRef).remove(); } });
    onValue(presenceRef, (snap) => { 
        const el = document.getElementById('stat-live-users'); 
        if(el) { el.textContent = snap.numChildren() || 1; el.style.color = '#10b981'; if(!el.classList.contains('pulse-live')) el.classList.add('pulse-live'); } 
    });
    const viewsRef = ref(db, 'analytics/total_views');
    if (!sessionStorage.getItem('view_counted')) { runTransaction(viewsRef, (current) => (current || 0) + 1); sessionStorage.setItem('view_counted', 'true'); }
    onValue(viewsRef, (snap) => { const el = document.getElementById('stat-total-views'); if(el) el.textContent = (snap.val() || 0).toLocaleString(); });
    const countriesRef = ref(db, 'analytics/countries');
    if (!sessionStorage.getItem('country_logged')) { fetch('https://ipapi.co/json/').then(res => res.json()).then(data => { if (data.country_name) { const countryRef = ref(db, `analytics/countries/${data.country_name}`); runTransaction(countryRef, (current) => (current || 0) + 1); sessionStorage.setItem('country_logged', 'true'); } }).catch(console.warn); }
    onValue(countriesRef, (snap) => { const listEl = document.getElementById('stat-top-countries'); if (!listEl) return; const data = snap.val() || {}; const sorted = Object.entries(data).sort(([,a], [,b]) => b - a).slice(0, 3); listEl.innerHTML = sorted.map(([country, count]) => `<div style="display:flex; justify-content:space-between; font-size:0.85em; margin-top:2px;"><span>${country}</span> <span>${count}</span></div>`).join(''); });
}

function initThemeToggle() {
    if(document.querySelector('.glitch-overlay')) return; 
    const overlay = document.createElement('div'); overlay.className = 'glitch-overlay'; document.body.appendChild(overlay);
    const btn = document.getElementById('theme-toggle'); if (!btn) return;
    const savedTheme = localStorage.getItem('theme'); if (savedTheme === 'dark') document.body.setAttribute('data-theme', 'dark');
    btn.addEventListener('click', () => { document.body.classList.add('glitch-active'); setTimeout(() => { const current = document.body.getAttribute('data-theme'); const newTheme = current === 'dark' ? 'light' : 'dark'; document.body.setAttribute('data-theme', newTheme); localStorage.setItem('theme', newTheme); document.body.classList.remove('glitch-active'); }, 300); });
}

function initGithubWidget() {
    const container = document.getElementById('github-stats-container');
    const USERNAME = 'TheMinescout'; 
    fetch(`https://api.github.com/users/${USERNAME}`).then(res => res.json()).then(data => { container.innerHTML = `<div class="github-widget"><div class="gh-header"><img src="${data.avatar_url}" class="gh-avatar"><div><strong>${data.login}</strong><br><a href="${data.html_url}" target="_blank" style="color:#58a6ff;font-size:0.8em">View Profile</a></div></div><div class="gh-stats"><span>📦 ${data.public_repos} Repos</span><span>👥 ${data.followers} Followers</span></div></div>`; }).catch(err => { container.innerHTML = `<small style="color:#999;">Github Offline</small>`; });
}

function initCodeRunners() {
    document.querySelectorAll('.code-runner').forEach(runner => { const btn = runner.querySelector('.btn-run'); const textarea = runner.querySelector('textarea'); const preview = runner.querySelector('.preview-box'); btn.addEventListener('click', () => { const iframe = document.createElement('iframe'); iframe.style.width = "100%"; iframe.style.height = "100%"; iframe.style.border = "none"; preview.innerHTML = ""; preview.appendChild(iframe); const doc = iframe.contentWindow.document; doc.open(); doc.write(textarea.value); doc.close(); }); });
}