console.log("App Version: 1.03");

/* ========================================= */
/* SYSTEM DIAGNOSTICS CHECK                  */
/* ========================================= */
window.addEventListener('DOMContentLoaded', () => {
    console.log(">> Initiating System Check...");
    
    // Array of critical system components to check
    const coreItems = [
        { name: 'Matrix Background', check: () => document.getElementById('matrixCanvas') },
        { name: 'SPA Mount Point (#app)', check: () => document.getElementById('app') },
        { name: 'CMD Overlay', check: () => document.getElementById('cmd-overlay') },
        { name: 'CMD Input', check: () => document.getElementById('global-cmd-input') },
        { name: 'File System Engine', check: () => window.FILE_SYSTEM }
    ];

    let allPassed = true;

    // Iterate through and test each item
    coreItems.forEach(item => {
        if (item.check()) {
            console.log(`>> System Check: ${item.name} [ IS A GO ]`);
        } else {
            console.warn(`>> System Check: ${item.name} [ FAILED ]`);
            allPassed = false;
        }
    });
    
    if (allPassed) {
        console.log(">> System check complete, all systems nominal. Passing onto next item...");
    } else {
        console.warn(">> System check complete with errors. Core features may malfunction.");
    }
});

/* ========================================= */
/* IN-MEMORY DATA STORE & FILE SYSTEM        */
/* ========================================= */
window.MESSAGES = [
    { id: '1', sender: 'System', subject: 'Initialization', desc: 'System online. All nodes active.', read: false, priority: 'LOW', timestamp: Date.now() }
];

window.FILE_SYSTEM = {
    articles: [
        { cmd: 'read_aiwriter', title: 'AI Writer Assistant', desc: '// DOM Generator', path: '/article/ai-writer' },
        { cmd: 'read_cognisearch', title: 'Cognisearch (v5)', desc: '// Branch: Stable', path: '/article/cognisearch' },
        { cmd: 'read_openscan', title: 'OpenScan-AI Pro', desc: '// PWA Scanner', path: '/article/openscan' },
        { cmd: 'read_portfolio', title: 'Portfolio Simulator', desc: '// Financial Utility', path: '/article/portfolio' },
        { cmd: 'read_vigenere', title: 'Vigenère Crypto Tool', desc: '// Standalone Utility', path: '/article/vigenere' }
    ],
    projects: [
        { cmd: 'run_aiwriter', title: 'AI Writer Tool', desc: '// Web Application', path: 'content/projects/ai-writer.html' },
        { cmd: 'run_openscan', title: 'OpenScan-AI', desc: '// Vision Hub', path: 'content/projects/openscan-tool.html' },
        { cmd: 'run_portfolio', title: 'Portfolio Sim', desc: '// Financial Engine', path: 'content/projects/portfolio-tool.html' }
    ],
    archived_articles: [
        { cmd: 'read_newsv1', title: 'News Synthesis V1', desc: '// DEPRECATED', path: '/archive/news-v1' }
    ],
    projects: [
        { cmd: 'run_aiwriter', title: 'AI Writer Tool', desc: '// Web Application', path: 'content/projects/ai-writer.html' },
        { cmd: 'run_openscan', title: 'OpenScan-AI', desc: '// Vision Hub', path: 'content/projects/openscan-tool.html' },
        { cmd: 'run_portfolio', title: 'Portfolio Sim', desc: '// Financial Engine', path: 'content/projects/portfolio-tool.html' }
    ],
    archived_articles: [
        { cmd: 'read_newsv1', title: 'News Synthesis V1', desc: '// DEPRECATED', path: '#/archive/news-v1' }
    ],
    archived_projects: [
        { cmd: 'get_newsv1', title: 'News Synthesis Source', desc: '// Legacy zip', path: 'views/archive/projects/ai-news-v1.zip' }
    ]
};

window.currentUser = null;
window.isAdmin = false;
const ADMIN_EMAIL = "identity@minescout.net";

/* ========================================= */
/* INLINE TEMPLATES (Static core views)      */
/* ========================================= */
const views = {
    '/': () => `
        <div class="terminal-container">
            <div id="main-box" class="content-box">
                <div style="width:80px; height:80px; border-radius:50%; border:2px solid var(--green); margin:0 auto 1rem auto; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:30px;">MS</div>
                <h1 class="glitch" data-text="BETA ACCESS">BETA ACCESS</h1>
                <div class="terminal-text">
                    <p id="user-display">> USER_ID: GUEST</p>
                    <p id="device-display">> DEVICE: DETECTING...</p>
                    <p id="sys-status">> STATUS: INITIALIZING...</p>
                    <p class="system-hint">> SYSTEM_MSG: CMD 'help' AVAILABLE</p>
                    <br>
                    <div class="blink-instruction" onclick="window.toggleCmd()">[ CLICK HERE OR PRESS '/' TO RUN ]</div>
                </div>
            </div>
        </div>
    `,
    '/login': () => `
        <div style="display:flex; justify-content:center; align-items:center; height:100%;">
            <div class="login-box">
                <h2 style="border-bottom: 2px dashed var(--green); padding-bottom: 15px; margin-bottom: 25px; text-align: center;">// SECURITY CHECKPOINT</h2>
                <div class="input-group"><input type="email" id="login-email" placeholder="identity@minescout.net"></div>
                <div class="input-group"><input type="password" id="login-password" placeholder="********"></div>
                <button class="action-btn" id="login-btn" onclick="attemptLogin()">[ AUTHENTICATE ]</button>
                <div id="login-error" style="color:var(--red); text-align:center; margin-top:10px; min-height:20px;"></div>
            </div>
        </div>
    `,
    '/admin-messages': () => `
        <div id="lockout" style="display:none; height:100%; justify-content:center; align-items:center; color:var(--red); font-size:2rem; font-weight:bold;">ACCESS DENIED</div>
        <div id="main-interface" style="display:none;">
            <div class="header"><span>// INBOX</span><span style="background:#003300; padding:2px 8px; font-weight:bold;">SECURE</span></div>
            <div id="inbox-view" style="flex-grow:1; overflow-y:auto; padding:10px;"></div>
            <div id="message-view" style="display:none; flex-grow:1; padding:20px; overflow-y:auto;">
                <div class="view-frame">
                    <div style="border-bottom:1px solid #004400; padding-bottom:10px;">
                        <button onclick="closeMessage()" class="action-btn" style="width:auto; padding:5px 15px; margin-bottom:15px; display:inline-block;">[ BACK TO INBOX ]</button>
                        <div id="view-subject" style="font-weight:bold; font-size:1.2rem;"></div>
                        <div id="view-sender" style="font-size:0.8rem; color:#88ff88;"></div>
                    </div>
                    <div id="view-body" style="white-space: pre-wrap; line-height: 1.5; color: #ccffcc; margin: 15px 0;"></div>
                </div>
            </div>
        </div>
    `,
    '/email': () => `
        <div style="display:flex; justify-content:center; align-items:center; height:100%;">
            <div class="email-client" style="position:relative;">
                <div class="client-header"><span>MAIL_CLIENT_V1.0</span><span>SECURE_SMTP_TUNNEL</span></div>
                <div class="field-row">
                    <div class="field-label">TO:</div>
                    <div class="field-input"><input type="text" value="theminescout@minescout.net" readonly style="color:#555; cursor:not-allowed;"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">FROM:</div>
                    <div class="field-input"><input type="text" id="email-sender" placeholder="Your Name / Email"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">SUBJ:</div>
                    <div class="field-input"><input type="text" id="email-subject" placeholder="Subject..."></div>
                </div>
                <div style="flex-grow: 1; display: flex; flex-direction: column;">
                    <textarea id="email-body" placeholder="Compose message..." style="flex-grow:1; padding:15px; line-height:1.5; background:transparent; border:none; color:var(--green); font-family:inherit; resize:none; outline:none;"></textarea>
                </div>
                <div style="border-top:1px solid var(--green); padding:10px; display:flex; justify-content:flex-end; background:#001100;">
                    <button class="action-btn" style="width:auto; padding:10px 30px; display:inline-block;" onclick="sendEmail()">[ SEND ]</button>
                </div>
                <div id="status-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); display:none; justify-content:center; align-items:center; flex-direction:column; z-index:10;">
                    <div id="status-text" style="font-size: 1.5rem; font-weight: bold;">ENCRYPTING...</div>
                    <div style="width:200px; height:20px; border:1px solid var(--green); margin-top:20px;"><div id="fill-bar" style="width:0%; height:100%; background:var(--green);"></div></div>
                </div>
            </div>
        </div>
    `,
    '/feature-requests': () => `
        <div style="display:flex; justify-content:center; align-items:center; height:100%;">
            <div class="form-block" style="padding:20px; width:600px;">
                <h2 style="border-bottom: 2px solid var(--green); padding-bottom: 10px; margin-bottom: 15px;">// UPLINK: FEATURE_REQ</h2>
                <div class="input-group"><input type="text" id="req-sender" placeholder="Sender Name (Optional)"></div>
                <div class="input-group"><input type="text" id="req-subject" placeholder="Subject / Feature Title"></div>
                <div class="input-group">
                    <select id="req-priority">
                        <option value="LOW">LOW PRIORITY</option>
                        <option value="MED">MED PRIORITY</option>
                        <option value="HIGH">HIGH PRIORITY</option>
                    </select>
                </div>
                <div class="input-group"><textarea id="req-desc" rows="4" placeholder="Description..."></textarea></div>
                <button class="action-btn" onclick="transmitData()">[ TRANSMIT DATA ]</button>
                <div id="req-prog-cont" style="display:none; width:100%; height:10px; background:#003300; margin-top:15px;"><div id="req-prog-bar" style="height:100%; background:var(--green); width:0%;"></div></div>
                <div id="req-status-msg" style="text-align:center; margin-top:10px; font-weight:bold;"></div>
            </div>
        </div>
    `,
    '/projects': () => `
        <div style="display:flex; justify-content:center; align-items:center; height:100%;">
            <div class="code-block projects-block">
                <h2 style="border-bottom:1px dashed var(--cyan); padding-bottom:10px; margin-bottom:10px;">// REPOSITORY: /var/www/projects/</h2>
                <div id="project-list-container"></div>
                <h2 style="border-bottom:1px dashed #005555; padding-bottom:10px; margin:30px 0 10px 0; color:#005555;">// LEGACY_BUILDS (UNSTABLE)</h2>
                <div id="archive-project-list-container"></div>
            </div>
        </div>
    `,
    '/404': () => `
        <div style="display:flex; justify-content:center; align-items:center; height:100%;">
            <div class="error-container">
                <h1>404</h1>
                <h2 style="color:#fff; margin-top:10px;">SIGNAL LOST</h2>
                <p>> ERROR: The requested directory path does not exist.<br>> STATUS: Connection Terminated.<br>> ADVICE: Return to the root node immediately.</p>
                <a href="javascript:void(0)" onclick="window.navigateTo('/')" class="action-btn" style="width:auto; display:inline-block; margin-top:30px;">Re-Establish Connection</a>
            </div>
        </div>
    `
};

/* ========================================= */
/* ES MODULE ROUTER ENGINE                   */
/* ========================================= */
let matrixTheme = 'green';
window.handlePageCommand = null;

// New Global Navigation Function
window.navigateTo = function(path) {
    window.history.pushState(null, '', path);
    router();
};

async function router() {
    const path = window.location.pathname || '/';
    const parts = path.split('/'); 
    const baseRoute = '/' + (parts[1] || ''); // Extracts '/article', '/pages', etc.
    const appDiv = document.getElementById('app');
    
    // Reset Matrix
    matrixTheme = (baseRoute === '/404') ? 'red' : (baseRoute === '/projects') ? 'cyan' : 'green';

    try {
        // DYNAMIC ES MODULE IMPORTS
        if (baseRoute === '/pages') {
            const module = await import('./views/view-posts.js');
            appDiv.innerHTML = module.render();
            module.init();
        } 
        else if (baseRoute === '/article') {
            const module = await import('./views/view-articles.js');
            const articleId = parts[2]; // e.g. 'ai-writer'
            appDiv.innerHTML = module.render(articleId);
            module.init(articleId);
        } 
        else if (baseRoute === '/archive') {
            const module = await import('./views/archive/posts-archive.js');
            const archiveId = parts[2]; // e.g. 'news-v1'
            appDiv.innerHTML = module.render(archiveId);
            module.init(archiveId);
        } 
        else if (baseRoute === '/glitch') {
            const module = await import('./views/view-glitch.js'); // Assuming Easter Egg renamed to this
            appDiv.innerHTML = module.render();
            module.init();
        } 
        // STATIC INLINE ROUTES
        else {
            const renderFunc = views[baseRoute] || views['/404'];
            appDiv.innerHTML = renderFunc();
            if(!views[baseRoute]) matrixTheme = 'red';
            executeViewLogic(baseRoute);
        }
    } catch (error) {
        console.error("Routing Error (Module missing or path invalid):", error);
        appDiv.innerHTML = views['/404']();
        matrixTheme = 'red';
        executeViewLogic('/404');
    }
}

window.addEventListener('popstate', router);
window.addEventListener('DOMContentLoaded', router);

/* ========================================= */
/* INLINE VIEW CONTROLLERS                   */
/* ========================================= */
function executeViewLogic(path) {
    window.handlePageCommand = null;

    if (path === '/') {
        const isMobile = window.innerWidth <= 600 || navigator.userAgent.toLowerCase().includes("mobile");
        const devDisplay = document.getElementById('device-display');
        if(isMobile) { devDisplay.innerText = "> DEVICE: MOBILE_TERMINAL"; devDisplay.style.color = "var(--gold)"; }
        else { devDisplay.innerText = "> DEVICE: DESKTOP_STATION"; }

        const userDisplay = document.getElementById('user-display');
        const statusEl = document.getElementById('sys-status');
        const boxEl = document.getElementById('main-box');

        if (window.currentUser) {
            const idLabel = window.isAdmin ? "ADMIN_ID" : "USER_ID";
            if(window.isAdmin) userDisplay.style.color = "var(--gold)";
            userDisplay.innerText = `> ${idLabel}: ${window.currentUser.email.split('@')[0].toUpperCase()}`;
            
            if (window.isAdmin) {
                const unread = window.MESSAGES.filter(m => !m.read).length;
                if (unread > 0) {
                    statusEl.innerText = "ERROR : ADMIN ALERT (TYPE ERR)";
                    statusEl.className = "status-error";
                    boxEl.classList.add('error-state');
                } else {
                    statusEl.innerText = "> STATUS: UNLOCKED";
                    statusEl.className = "";
                    boxEl.classList.remove('error-state');
                }
            } else {
                statusEl.innerText = "> STATUS: UNLOCKED";
                statusEl.className = "";
            }
        } else {
            userDisplay.innerText = "> USER_ID: GUEST";
            statusEl.innerText = "> STATUS: UNLOCKED";
            boxEl.classList.remove('error-state');
        }

        window.handlePageCommand = (cmd) => {
            if (cmd === 'vm' && window.isAdmin) { window.navigateTo('/admin-messages'); return true; }
            if (cmd === 'err') return window.isAdmin ? `> CRITICAL: NEW ENCRYPTED SIGNALS.` : `SYSTEM NORMAL.`;
            if (cmd === 'login') { window.navigateTo('/login'); return true; }
            if (cmd === 'glitch') { window.navigateTo('/glitch'); return true; }
            return null;
        };
    } 

    else if (path === '/projects') {
        const executeProject = (projPath) => {
            // Handle Direct Downloads vs Opening App Links
            if (projPath.endsWith('.zip') || projPath.endsWith('.exe')) {
                const link = document.createElement('a');
                link.href = projPath;
                link.download = projPath.split('/').pop();
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                window.open(projPath, '_blank');
            }
        };

        const pList = document.getElementById('project-list-container');
        window.FILE_SYSTEM.projects.forEach(item => {
            const div = document.createElement('div');
            div.className = 'var-line';
            div.innerHTML = `<span class="keyword">const</span> ${item.cmd} = <span class="string">"${item.title}"</span>;<span class="comment">${item.desc}</span>`;
            div.onclick = () => executeProject(item.path);
            pList.appendChild(div);
        });
        
        const aList = document.getElementById('archive-project-list-container');
        window.FILE_SYSTEM.archived_projects.forEach(item => {
            const div = document.createElement('div');
            div.className = 'var-line';
            div.style.opacity = '0.6';
            div.innerHTML = `<span class="keyword" style="color:#888">const</span> ${item.cmd} = <span class="string" style="color:#aaa">"${item.title}"</span>;<span class="comment" style="color:#444">${item.desc}</span>`;
            div.onclick = () => executeProject(item.path);
            aList.appendChild(div);
        });

        window.handlePageCommand = function(cmd) {
            let found = window.FILE_SYSTEM.projects.find(p => p.cmd === cmd);
            if (!found) found = window.FILE_SYSTEM.archived_projects.find(p => p.cmd === cmd);
            
            if (found) { executeProject(found.path); return true; }
            return null;
        };
    }

    else if (path === '/admin-messages') {
        if (!window.isAdmin) {
            document.getElementById('lockout').style.display = 'flex';
            setTimeout(() => window.navigateTo('/'), 2000);
            return;
        }
        document.getElementById('main-interface').style.display = 'flex';
        window.renderInboxList();
    }
}

/* ========================================= */
/* GLOBAL ACTIONS (Auth, Forms, Inbox)       */
/* ========================================= */
window.attemptLogin = function() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    const err = document.getElementById('login-error');
    const btn = document.getElementById('login-btn');

    if(!email || !pass) { err.innerText = "CREDENTIALS MISSING"; return; }
    btn.innerText = "VERIFYING..."; err.innerText = "";

    setTimeout(() => {
        window.currentUser = { email: email, uid: 'local-' + Date.now() };
        window.isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        btn.innerText = "ACCESS GRANTED"; 
        setTimeout(() => window.navigateTo("/"), 1000);
    }, 800);
};

window.sendEmail = function() {
    const sender = document.getElementById('email-sender').value;
    const subject = document.getElementById('email-subject').value;
    const body = document.getElementById('email-body').value;
    if (!sender || !subject || !body) return alert("ALL FIELDS REQUIRED.");

    document.getElementById('status-overlay').style.display = 'flex';
    let width = 0;
    const int = setInterval(() => {
        if (width >= 100) {
            clearInterval(int);
            window.MESSAGES.push({ id: Date.now().toString(), sender: sender, subject: subject, desc: body, priority: "EMAIL", read: false, timestamp: Date.now() });
            document.getElementById('status-text').innerText = "SENT SUCCESSFULLY.";
            document.getElementById('status-text').style.color = "var(--green)";
            setTimeout(() => window.navigateTo("/"), 1000);
        } else {
            width += 15;
            document.getElementById('fill-bar').style.width = Math.min(width, 100) + '%';
        }
    }, 100);
};

window.transmitData = function() {
    const sender = document.getElementById('req-sender').value || "Guest";
    const subject = document.getElementById('req-subject').value;
    const desc = document.getElementById('req-desc').value;
    const priority = document.getElementById('req-priority').value;
    const status = document.getElementById('req-status-msg');
    
    if(!subject || !desc) { status.style.color='red'; status.innerText="ERROR: NULL DATA"; return; }

    document.getElementById('req-prog-cont').style.display='block';
    let w=0; 
    const int = setInterval(()=>{
        if(w>=100){
            clearInterval(int);
            window.MESSAGES.push({ id: Date.now().toString(), sender: sender, subject: subject, desc: desc, priority: priority, read: false, timestamp: Date.now() });
            status.style.color='var(--green)'; status.innerText="UPLOAD COMPLETE.";
            setTimeout(()=>window.navigateTo('/'), 1000);
        } else { 
            w+=10; document.getElementById('req-prog-bar').style.width=w+'%'; 
        }
    }, 50);
};

window.renderInboxList = function() {
    const inboxEl = document.getElementById('inbox-view');
    inboxEl.style.display = 'block'; 
    document.getElementById('message-view').style.display = 'none';
    inboxEl.innerHTML = '';
    
    if(window.MESSAGES.length === 0) return inboxEl.innerHTML = "<div style='padding:20px; color:#555;'>// NO MESSAGES FOUND</div>";

    [...window.MESSAGES].reverse().forEach(msg => {
        const div = document.createElement('div');
        div.className = msg.read ? 'msg-bar read' : 'msg-bar unread';
        div.onclick = () => window.openMessage(msg);
        div.innerHTML = `<span>${msg.subject}</span><span>${msg.sender}</span>`;
        inboxEl.appendChild(div);
    });
};

window.openMessage = function(msg) {
    msg.read = true;
    document.getElementById('inbox-view').style.display = 'none';
    document.getElementById('message-view').style.display = 'block';
    document.getElementById('view-subject').innerText = msg.subject;
    document.getElementById('view-sender').innerText = msg.sender;
    document.getElementById('view-body').innerText = msg.desc;
};
window.closeMessage = () => window.renderInboxList();

/* ========================================= */
/* GLOBAL TERMINAL LOGIC                     */
/* ========================================= */
window.toggleCmd = function() {
    const overlay = document.getElementById('cmd-overlay');
    const input = document.getElementById('global-cmd-input');
    if (overlay.style.display === 'none') { overlay.style.display = 'block'; input.focus(); } 
    else { overlay.style.display = 'none'; }
}

document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault(); window.toggleCmd();
    }
    if (e.key === 'Enter' && document.activeElement.id === 'global-cmd-input') {
        const cmdStr = document.activeElement.value.trim();
        document.activeElement.value = '';
        
        const parts = cmdStr.split(' ');
        const cmd = parts[0].toLowerCase();
        
        // Native SPA Routing aliases
        const routeMap = { 'home': '/', 'login': '/login', 'projects': '/projects', 'pages': '/pages', 'email': '/email', 'uplink': '/feature-requests', 'inbox': '/admin-messages' };
        if (routeMap[cmd]) {
            window.navigateTo(routeMap[cmd]);
            window.toggleCmd();
        } else if (window.handlePageCommand) {
            const res = window.handlePageCommand(cmd, parts.slice(1));
            if (res && typeof res === 'string') alert(res); 
        }
    }
});

/* ========================================= */
/* MATRIX BACKGROUND ENGINE                  */
/* ========================================= */
const c = document.getElementById('matrixCanvas');
if (c) {
    const ctx = c.getContext('2d');
    function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);
    
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fontSize = 16;
    let columns = Math.floor(c.width / fontSize);
    let drops = Array(columns).fill(1);

    setInterval(() => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, c.width, c.height);
        
        // HTML Canvas ctx.fillStyle does NOT support CSS variables natively. 
        // Using direct Hex codes ensures the text colors render correctly.
        if (matrixTheme === 'red') ctx.fillStyle = Math.random() > 0.9 ? '#0F0' : '#FF3333';
        else if (matrixTheme === 'cyan') ctx.fillStyle = '#00FFFF';
        else ctx.fillStyle = '#0F0';
        
        ctx.font = fontSize + 'px monospace';
        for(let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if(drops[i] * fontSize > c.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }, 33);
}