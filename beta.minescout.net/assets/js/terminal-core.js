/* 
    TERMINAL CORE V5.0 (REVERSE TRANSITION)
    - Global Command Center
    - Admin Whitelist & Security
    - Matrix Rain & Physics
    - Added: Exit Animation for 'main' command
*/

(function() {
    console.log("Initializing Terminal Core v5.0...");

    const ADMIN_EMAIL = "theminescout@minescout.net";
    const APPROVED_ADMINS = [ "theminescout@minescout.net" ];

    // --- 1. STATE & STORAGE ---
    const CONFIG = {
        level: parseInt(localStorage.getItem('ms_access_level')) || 0,
        aliases: JSON.parse(localStorage.getItem('ms_aliases')) || {},
        history: []
    };

    // --- 2. AUTH LISTENER ---
    const checkAuth = setInterval(() => {
        if (typeof firebase !== 'undefined' && firebase.auth) {
            clearInterval(checkAuth);
            firebase.auth().onAuthStateChanged(user => {
                const titleBar = document.querySelector('.cmd-title-bar span');
                if (user && APPROVED_ADMINS.includes(user.email.toLowerCase())) {
                    CONFIG.level = 10;
                    localStorage.setItem('ms_access_level', 10);
                    if(titleBar) titleBar.innerText = "ROOT@MINESCOUT:~ [LVL 10]";
                } else {
                    if (CONFIG.level === 10) { CONFIG.level = 0; localStorage.setItem('ms_access_level', 0); }
                    if(titleBar) titleBar.innerText = `GUEST@MINESCOUT:~ [LVL ${CONFIG.level}]`;
                }
            });
        }
    }, 500);

    // --- 3. CSS INJECTION ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* CMD UI */
        .cmd-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 2147483640; display: flex; justify-content: flex-start; align-items: flex-end; padding: 20px; backdrop-filter: blur(2px); }
        .hidden { display: none !important; }
        .cmd-window { width: 500px; height: 350px; background: rgba(0, 15, 0, 0.98); border: 1px solid #0F0; box-shadow: 0 0 20px rgba(0, 255, 0, 0.2); display: flex; flex-direction: column; font-family: 'Courier New', monospace; color: #0F0; margin-bottom: 20px; transition: height 0.3s; }
        .cmd-title-bar { background: #003300; color: #0F0; padding: 5px 10px; font-weight: bold; font-size: 12px; display: flex; justify-content: space-between; border-bottom: 1px solid #0F0; user-select: none; }
        .cmd-body { padding: 10px; flex-grow: 1; overflow-y: auto; display: flex; flex-direction: column; }
        .cmd-output { flex-grow: 1; margin-bottom: 10px; white-space: pre-wrap; word-wrap: break-word; font-size: 12px; }
        .log-entry { margin-bottom: 2px; }
        .log-secret { color: #005500; } .log-warn { color: #FFD700; } .log-err { color: #FF3333; }
        .ascii-art { font-size: 10px; line-height: 10px; color: #0F0; }
        .input-line { display: flex; align-items: center; border-top: 1px dashed #004400; padding-top: 5px; }
        #global-cmd-input { flex-grow: 1; background: transparent; border: none; color: #fff; font-family: 'Courier New', monospace; font-size: 14px; outline: none; margin-left: 5px; }
        
        /* PHYSICS & VISUALS */
        .physics-active { position: fixed; margin: 0; transform: none; cursor: grab; transition: none; }
        .gravity-fail { transform-origin: center; animation: fallDown 2s forwards; }
        @keyframes fallDown { to { transform: translateY(100vh) rotate(20deg); opacity: 0; } }
        
        /* HIDDEN EGG */
        .hidden-node { position: fixed; width: 50px; height: 50px; z-index: 9000; cursor: help; opacity: 0; transition: opacity 0.5s, background 0.3s; display: flex; align-items: center; justify-content: center; font-family: 'Courier New'; font-weight: bold; font-size: 10px; color: #000; }
        .hidden-node:hover { opacity: 1; background: #0F0; box-shadow: 0 0 15px #0F0; border: 1px dashed #000; }

        /* EXIT ANIMATION (The Reverse Seep) */
        #exit-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: #f3f4f6; /* Main Site Background Color */
            z-index: 2147483647; /* Topmost */
            pointer-events: none;
            clip-path: inset(50% 0 50% 0); /* Start as thin line in middle */
            transition: clip-path 2.5s ease-in-out;
            display: none;
        }
        #exit-overlay.expanding {
            clip-path: inset(0 0 0 0); /* Open to full screen */
        }

        @media (max-width: 600px) { .cmd-overlay { padding: 0; align-items: flex-end; } .cmd-window { width: 100%; border: none; border-top: 2px solid #0F0; } }
    `;
    document.head.appendChild(style);

    // --- 4. HTML INJECTION ---
    if(document.body) {
        const overlayHtml = `
            <div id="exit-overlay"></div> <!-- THE WHITE FLASH -->
            <div id="cmd-overlay" class="cmd-overlay hidden">
                <div class="cmd-window" id="main-terminal">
                    <div class="cmd-title-bar"><span>SYSTEM_BOOTING...</span><span style="cursor:pointer" onclick="window.toggleCmd()">[X]</span></div>
                    <div class="cmd-body">
                        <div id="cmd-history" class="cmd-output">
                            <div class="log-entry">Minescout OS v5.0 initialized...</div>
                            <div class="log-entry">Type 'help' for commands.</div>
                        </div>
                        <div class="input-line"><span>$</span><input type="text" id="global-cmd-input" autocomplete="off"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', overlayHtml);
    }

    // --- 5. LOGIC & COMMANDS ---
    const overlay = document.getElementById('cmd-overlay');
    const input = document.getElementById('global-cmd-input');
    const history = document.getElementById('cmd-history');
    const isDeep = window.location.pathname.includes('content');
    const prefix = isDeep ? '../../' : '';

    window.toggleCmd = function() { overlay.classList.toggle('hidden'); if (!overlay.classList.contains('hidden')) input.focus(); };
    function print(msg, cls = "") {
        const div = document.createElement('div'); div.className = `log-entry ${cls}`; div.innerHTML = msg;
        history.appendChild(div); history.scrollTop = history.scrollHeight;
    }

    input.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            const raw = input.value.trim();
            if (!raw) return;
            print(`$ ${raw}`, "log-entry");
            input.value = "";

            let cmdStr = CONFIG.aliases[raw] || raw;
            const parts = cmdStr.split(' ');
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1);

            const secret = sessionStorage.getItem('egg_code');
            if (secret && cmd === secret.toLowerCase()) {
                window.location.href = isDeep ? '../posts/easteregg.html' : 'content/posts/easteregg.html';
                return;
            }

            switch (cmd) {
                // --- NAVIGATION COMMANDS ---
                case 'main': 
                    // TRIGGER REVERSE ANIMATION
                    const exitLayer = document.getElementById('exit-overlay');
                    print("DISCONNECTING FROM MATRIX...", "log-warn");
                    exitLayer.style.display = 'block';
                    
                    // Allow display:block to render before adding class
                    setTimeout(() => {
                        exitLayer.classList.add('expanding');
                    }, 50);

                    // Redirect when white screen is full
                    setTimeout(() => {
                        window.location.href = "https://life.minescout.net";
                    }, 2500); 
                    break;

                case 'home': case 'return': window.location.href = prefix + 'index.html'; break;
                case 'atls': window.location.href = prefix + 'pages.html'; break;
                case 'prds': window.location.href = prefix + 'projects.html'; break;
                case 'reqs': window.location.href = prefix + 'feature-requests.html'; break;
                case 'email': window.location.href = prefix + 'email.html'; break;
                case 'login': window.location.href = prefix + 'login.html'; break;
                
                case 'logout': 
                    if (typeof firebase !== 'undefined' && firebase.auth) { firebase.auth().signOut().then(() => print("Logged out.", "log-warn")); } 
                    else { print("System loading... please wait.", "log-err"); }
                    break;

                // --- SYSTEM COMMANDS ---
                case 'ls':
                    let out = "FILESYSTEM:\n";
                    if (typeof FILE_SYSTEM !== 'undefined') {
                        FILE_SYSTEM.articles.forEach(f => out += `[ART] ${f.title}\n`);
                        FILE_SYSTEM.projects.forEach(f => out += `[PRJ] ${f.title}\n`);
                        if (args[0] === '-a') {
                            if (CONFIG.level >= 1) FILE_SYSTEM.secrets.forEach(f => out += `<span class="log-secret">[HID] ${f.name}</span>\n`);
                            else { print("ACCESS DENIED: Level 1 Required.", "log-err"); return; }
                        }
                    }
                    print(out); break;

                case 'cat':
                    const fName = args.join(' ');
                    if (typeof FILE_SYSTEM !== 'undefined') {
                        const sFile = FILE_SYSTEM.secrets.find(f => f.name === fName);
                        if (sFile) {
                            if (CONFIG.level >= 1) print(sFile.content, "log-warn");
                            else print("ENCRYPTED. Level 1 required.", "log-err");
                        } else print("File not found.", "log-err");
                    } break;

                case 'stats':
                    print("Scanning...", "log-warn");
                    const start = Date.now();
                    try {
                        await fetch(window.location.href, { method: 'HEAD' });
                        const ping = Date.now() - start;
                        print(`<div class="ascii-art">.--------------.\n| SYS MONITOR  |\n|--------------|\n| PING : ${ping}ms   |\n| LVL  : ${CONFIG.level}     |\n'--------------'</div>`);
                    } catch (e) { print("OFFLINE", "log-err"); }
                    break;

                case 'help':
                    print(`
COMMANDS:
---------
[NAV] atls, prds, reqs, email, home, main
[SYS] ls [-a], cat [file], stats, clear
[USR] login, logout, sudo [pass]
[CFG] alias [x]=[y], unalias [x]
[EXE] vm, snake
                    `);
                    break;
                case 'clear': history.innerHTML = ""; break;
                
                case 'alias':
                    const fullArg = args.join(' ');
                    const [key, val] = fullArg.split('=');
                    if (key && val) { CONFIG.aliases[key.trim()] = val.trim(); localStorage.setItem('ms_aliases', JSON.stringify(CONFIG.aliases)); print(`Alias set: ${key} -> ${val}`, "log-warn"); }
                    else print("Usage: alias name=command");
                    break;
                case 'unalias':
                    if(args[0] === '-all') { CONFIG.aliases={}; localStorage.removeItem('ms_aliases'); print("Aliases cleared.", "log-warn"); }
                    else if(CONFIG.aliases[args[0]]) { delete CONFIG.aliases[args[0]]; localStorage.setItem('ms_aliases', JSON.stringify(CONFIG.aliases)); print(`Removed ${args[0]}`, "log-warn"); }
                    break;

                case 'sudo':
                    if (args[0] === "beta_test") { if(CONFIG.level < 1) { CONFIG.level = 1; localStorage.setItem('ms_access_level', 1); print("ACCESS GRANTED: LEVEL 1", "log-warn"); } else print("Already Level 1+", "log-warn"); }
                    else print("INCORRECT PASSWORD", "log-err");
                    break;

                case 'vm': if (CONFIG.level >= 10) window.location.href = prefix + 'admin-messages.html'; else print("ACCESS DENIED (Lvl 10)", "log-err"); break;
                case 'snake': startSnake(); break;
                
                default:
                    if (typeof window.handlePageCommand === 'function') { const res = window.handlePageCommand(cmd, args); if (res) { print(res === true ? "Executed." : res); return; } }
                    print(`Unknown: '${cmd}'`, "log-err");
            }
        }
    });

    // --- 6. EXTRAS (Snake, Matrix, Physics, Egg) ---
    // (Collapsed for brevity, identical to v4.6 logic)
    function startSnake() {
        history.innerHTML = ""; const cols=20, rows=10; let snake=[{x:5,y:5}], food={x:10,y:5}, dir={x:1,y:0}, score=0, loop;
        function draw() { let b=""; for(let y=0;y<rows;y++){for(let x=0;x<cols;x++){if(snake.some(s=>s.x===x&&s.y===y))b+="O";else if(food.x===x&&food.y===y)b+="*";else b+=".";}b+="\n";} history.innerHTML=`<pre style="line-height:10px;">${b}</pre><div>SCORE: ${score} (Esc to Quit)</div>`; }
        function update() { const h={x:snake[0].x+dir.x, y:snake[0].y+dir.y}; if(h.x<0||h.x>=cols||h.y<0||h.y>=rows||snake.some(s=>s.x===h.x&&s.y===h.y)) { clearInterval(loop); document.removeEventListener('keydown',ctrl); print("GAME OVER.", "log-err"); const pre=history.querySelector('pre'); if(pre){pre.style.display='inline-block';pre.classList.add('gravity-fail');enablePhysics(pre);} return; } snake.unshift(h); if(h.x===food.x&&h.y===food.y){score++;food={x:Math.floor(Math.random()*cols),y:Math.floor(Math.random()*rows)};} else snake.pop(); draw(); }
        function ctrl(e) { if(e.key==='ArrowUp'&&dir.y===0)dir={x:0,y:-1}; if(e.key==='ArrowDown'&&dir.y===0)dir={x:0,y:1}; if(e.key==='ArrowLeft'&&dir.x===0)dir={x:-1,y:0}; if(e.key==='ArrowRight'&&dir.x===0)dir={x:1,y:0}; if(e.key==='Escape'){clearInterval(loop);print("QUIT GAME.");} }
        document.addEventListener('keydown', ctrl); loop = setInterval(update, 150);
    }
    function enablePhysics(el) { if(!el)return; let pos={x:0,y:0},vel={x:Math.random()*4-2,y:-5}; const l=setInterval(()=>{vel.y+=0.5;pos.x+=vel.x;pos.y+=vel.y;el.style.transform=`translate(${pos.x}px,${pos.y}px) rotate(${pos.x*5}deg)`;if(pos.y>500){clearInterval(l);el.style.display='none';}},20); }
    function initMatrix() {
        const canvas = document.getElementById('matrixCanvas'); if (!canvas) return; const ctx = canvas.getContext('2d'); let width, height; function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; } resize(); window.addEventListener('resize', resize);
        const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ'; const fontSize = 16; let columns = width / fontSize; let drops = []; for(let i=0; i<columns; i++) drops[i] = 1;
        const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/"); let ghostCol = -1; let ghostTimer = 0; const GHOST_MSG = "CHECK_THE_CORNERS";
        setInterval(() => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; ctx.fillRect(0, 0, width, height);
            if (isIndex && ghostTimer <= 0 && Math.random() > 0.995) { ghostCol = Math.floor(Math.random() * columns); ghostTimer = 100; } if (ghostTimer > 0) ghostTimer--;
            let isRainbow = false; try { isRainbow = sessionStorage.getItem('egg_rainbow') === 'true'; } catch(e){}
            ctx.font = fontSize + 'px monospace';
            for(let i=0; i<drops.length; i++) { let text = chars[Math.floor(Math.random() * chars.length)]; let fillStyle = '#0F0'; if(isRainbow) { const colors = ['#0F0', '#F0F', '#0FF', '#FF0', '#F00']; fillStyle = colors[Math.floor(Math.random() * colors.length)]; } if (isIndex && i === ghostCol && ghostTimer > 0) { const charIndex = Math.floor(drops[i]) % GHOST_MSG.length; text = GHOST_MSG[charIndex]; fillStyle = '#FFF'; ctx.shadowBlur = 10; ctx.shadowColor = "#FFF"; } else { ctx.shadowBlur = 0; } ctx.fillStyle = fillStyle; ctx.fillText(text, i * fontSize, drops[i] * fontSize); if(drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0; drops[i]++; }
        }, 33);
    }
    function spawnHiddenNode() {
        const path = window.location.pathname; const isIndex = path.endsWith("index.html") || path.endsWith("/"); if (!isIndex) return;
        const egg = document.createElement('div'); egg.className = 'hidden-node'; egg.innerText = "???"; 
        const corners = ['TL', 'TR', 'BL', 'BR']; const pick = corners[Math.floor(Math.random() * corners.length)];
        if(pick === 'TL') { egg.style.top = '0'; egg.style.left = '0'; } if(pick === 'TR') { egg.style.top = '0'; egg.style.right = '0'; } if(pick === 'BL') { egg.style.bottom = '0'; egg.style.left = '0'; } if(pick === 'BR') { egg.style.bottom = '0'; egg.style.right = '0'; }
        egg.onmouseover = () => { egg.innerText = "CLICK"; }; egg.onmouseout = () => { egg.innerText = "???"; };
        egg.onclick = () => { let secretCode = null; try { secretCode = sessionStorage.getItem('egg_code'); } catch(e){} if (!secretCode) { const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; secretCode = ""; for(let i=0; i<4; i++) secretCode += chars.charAt(Math.floor(Math.random() * chars.length)); try { sessionStorage.setItem('egg_code', secretCode); } catch(e){} } console.clear(); console.warn("SYSTEM BREACH DETECTED."); console.log(`%c ACCESS CODE: [ ${secretCode} ]`, "color: black; background: #0F0; font-size: 20px; padding: 10px; border: 2px dashed black;"); alert("ENCRYPTED SIGNAL FOUND.\n\nCheck your Developer Console (F12) to retrieve the Access Code."); };
        document.body.appendChild(egg);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { initMatrix(); setTimeout(spawnHiddenNode, 2000); }); else { initMatrix(); setTimeout(spawnHiddenNode, 2000); }
    document.addEventListener('keydown', (e) => { if((e.key==='/'||e.key==='\\')&&document.activeElement!==input){e.preventDefault();window.toggleCmd();} if(e.key==='Escape')overlay.classList.add('hidden'); });

})();
