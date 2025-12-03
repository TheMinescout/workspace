/* 
    TERMINAL CORE V2.6 (GHOST MESSAGES)
    - Global Command Center
    - Interactive Physics
    - Subliminal "Check Corners" Hint in Matrix Rain
*/

(function() {
    console.log("Initializing Terminal Core V2.6...");

    // 1. INJECT CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .cmd-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; justify-content: flex-start; align-items: flex-end; padding: 20px; backdrop-filter: blur(1px); }
        .hidden { display: none !important; }
        .cmd-window { width: 450px; background: rgba(0, 15, 0, 0.95); border: 1px solid #0F0; box-shadow: 0 0 15px rgba(0, 255, 0, 0.3); display: flex; flex-direction: column; font-family: 'Courier New', monospace; color: #0F0; margin-bottom: 20px; }
        .cmd-title-bar { background: #003300; color: #0F0; padding: 8px 12px; font-weight: bold; font-size: 14px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #0F0; user-select: none; }
        .close-btn { background: transparent; color: #0F0; padding: 0 6px; cursor: pointer; border: 1px solid transparent; font-weight: bold; }
        .close-btn:hover { border-color: #0F0; box-shadow: 0 0 5px #0F0; background: #002200; }
        .cmd-body { padding: 15px; display: flex; flex-direction: column; gap: 10px; }
        .input-line { display: flex; align-items: center; gap: 10px; border-bottom: 1px dashed #004400; padding-bottom: 5px; }
        #global-cmd-input { flex-grow: 1; background: transparent; border: none; color: #fff; font-family: 'Courier New', monospace; font-size: 16px; outline: none; }
        #global-cmd-input::placeholder { color: #005500; }
        #global-cmd-output { color: #FF3333; font-family: 'Courier New', monospace; font-size: 12px; min-height: 15px; margin-top: 5px; white-space: pre-wrap; }
        
        .hidden-node { position: fixed; width: 50px; height: 50px; z-index: 9000; cursor: help; opacity: 0; transition: opacity 0.5s, background 0.3s; display: flex; align-items: center; justify-content: center; font-family: 'Courier New'; font-weight: bold; font-size: 10px; color: #000; }
        .hidden-node:hover { opacity: 1; background: #0F0; box-shadow: 0 0 15px #0F0; border: 1px dashed #000; }
        .physics-active { cursor: grab !important; user-select: none; }
        .physics-active:active { cursor: grabbing !important; }
        .gravity-fail { transform-origin: center; animation: fallDown 2s forwards; }
        @keyframes fallDown { to { transform: translateY(100vh) rotate(20deg); opacity: 0; } }

        @media (max-width: 600px) { .cmd-overlay { align-items: flex-end; padding: 0; } .cmd-window { width: 100%; margin-bottom: 0; border: none; border-top: 2px solid #0F0; } }
    `;
    document.head.appendChild(style);

    // 2. APPLY VISUAL STATES
    function applyVisuals() {
        if (sessionStorage.getItem('egg_flip') === 'true') document.body.style.transform = "scaleY(-1)";
        else document.body.style.transform = "none";

        if (sessionStorage.getItem('egg_invert') === 'true') document.body.style.filter = "invert(1) hue-rotate(180deg)";
        else document.body.style.filter = "none";
    }
    applyVisuals();

    // 3. PHYSICS ENGINE
    let physicsLoop;
    function enablePhysics() {
        if (sessionStorage.getItem('egg_gravity') !== 'true') return;
        const box = document.querySelector('.content-box') || document.querySelector('.manual-block') || document.querySelector('.code-block') || document.querySelector('.playground') || document.querySelector('.login-box') || document.querySelector('.form-block');
        if (!box) return;

        box.classList.add('physics-active');
        box.style.position = 'fixed'; box.style.margin = '0'; box.style.transform = 'none';
        
        let posX = box.offsetLeft, posY = box.offsetTop;
        let velX = 0, velY = 0;
        const gravity = 0.8, friction = 0.98, bounce = 0.7;
        let isDragging = false, dragStartX = 0, dragStartY = 0, lastMouseX = 0, lastMouseY = 0;

        function update() {
            if (!isDragging) {
                velY += gravity; velX *= friction;
                posX += velX; posY += velY;
                if (posY + box.offsetHeight > window.innerHeight) { posY = window.innerHeight - box.offsetHeight; velY *= -bounce; if(Math.abs(velY) < gravity * 2) velY = 0; }
                else if (posY < 0) { posY = 0; velY *= -bounce; }
                if (posX + box.offsetWidth > window.innerWidth) { posX = window.innerWidth - box.offsetWidth; velX *= -bounce; }
                else if (posX < 0) { posX = 0; velX *= -bounce; }
            }
            box.style.left = posX + 'px'; box.style.top = posY + 'px';
            physicsLoop = requestAnimationFrame(update);
        }

        box.addEventListener('mousedown', startDrag); box.addEventListener('touchstart', startDrag, {passive: false});
        function startDrag(e) { isDragging = true; velX = 0; velY = 0; const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX; const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY; dragStartX = clientX - posX; dragStartY = clientY - posY; lastMouseX = clientX; lastMouseY = clientY; window.addEventListener('mousemove', onDrag); window.addEventListener('touchmove', onDrag, {passive: false}); window.addEventListener('mouseup', stopDrag); window.addEventListener('touchend', stopDrag); }
        function onDrag(e) { if (!isDragging) return; e.preventDefault(); const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX; const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY; velX = (clientX - lastMouseX); velY = (clientY - lastMouseY); lastMouseX = clientX; lastMouseY = clientY; posX = clientX - dragStartX; posY = clientY - dragStartY; }
        function stopDrag() { isDragging = false; window.removeEventListener('mousemove', onDrag); window.removeEventListener('touchmove', onDrag); window.removeEventListener('mouseup', stopDrag); window.removeEventListener('touchend', stopDrag); }
        update();
    }
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enablePhysics); else enablePhysics();

    // 4. UI INJECTION
    const overlayHtml = `
        <div id="cmd-overlay" class="cmd-overlay hidden">
            <div class="cmd-window">
                <div class="cmd-title-bar"><span>SYSTEM_ROOT_CMD</span><span class="close-btn" onclick="window.toggleCmd()">[X]</span></div>
                <div class="cmd-body">
                    <div style="font-size: 12px; opacity: 0.8;">Enter system command or directory:</div>
                    <div class="input-line"><span>></span><input type="text" id="global-cmd-input" autocomplete="off" placeholder="_"></div>
                    <div id="global-cmd-output"></div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', overlayHtml);

    // 5. EASTER EGG (INDEX ONLY)
    function spawnHiddenNode() {
        const path = window.location.pathname;
        const isIndex = path.endsWith("index.html") || path.endsWith("/") || path.endsWith("/mineScout/");
        if (!isIndex) return;
        const egg = document.createElement('div'); egg.className = 'hidden-node'; egg.innerText = "???"; 
        const corners = ['TL', 'TR', 'BL', 'BR']; const pick = corners[Math.floor(Math.random() * corners.length)];
        if(pick === 'TL') { egg.style.top = '0'; egg.style.left = '0'; } if(pick === 'TR') { egg.style.top = '0'; egg.style.right = '0'; } if(pick === 'BL') { egg.style.bottom = '0'; egg.style.left = '0'; } if(pick === 'BR') { egg.style.bottom = '0'; egg.style.right = '0'; }
        egg.onmouseover = () => { egg.innerText = "CLICK"; }; egg.onmouseout = () => { egg.innerText = "???"; };
        egg.onclick = () => {
            let secretCode = sessionStorage.getItem('egg_code');
            if (!secretCode) { const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; secretCode = ""; for(let i=0; i<4; i++) secretCode += chars.charAt(Math.floor(Math.random() * chars.length)); sessionStorage.setItem('egg_code', secretCode); }
            console.clear(); console.warn("SYSTEM BREACH DETECTED."); console.log(`%c ACCESS CODE: [ ${secretCode} ]`, "color: black; background: #0F0; font-size: 20px; padding: 10px; border: 2px dashed black;");
            alert("ENCRYPTED SIGNAL FOUND.\n\nCheck your Developer Console (F12) to retrieve the Access Code.");
        };
        document.body.appendChild(egg);
    }
    setTimeout(spawnHiddenNode, 2000);

    // 6. GLOBAL MATRIX RAIN (WITH GHOST MESSAGE)
    function initGlobalMatrix() {
        const canvas = document.getElementById('matrixCanvas'); if (!canvas) return;
        const ctx = canvas.getContext('2d'); let width, height;
        function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; } resize(); window.addEventListener('resize', resize);
        
        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const chars = katakana + latin;
        
        const fontSize = 16; let columns = width / fontSize; let drops = []; for(let i=0; i<columns; i++) drops[i] = 1;

        // GHOST MESSAGE LOGIC
        const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/") || window.location.pathname.endsWith("/mineScout/");
        let ghostCol = -1;
        let ghostTimer = 0;
        const GHOST_MSG = "CHECK_THE_CORNERS";

        setInterval(() => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; ctx.fillRect(0, 0, width, height);
            
            // Randomly trigger ghost message on Index page
            if (isIndex && ghostTimer <= 0 && Math.random() > 0.995) {
                ghostCol = Math.floor(Math.random() * columns);
                ghostTimer = 100; // Duration of effect
            }
            if (ghostTimer > 0) ghostTimer--;

            const isRainbow = sessionStorage.getItem('egg_rainbow') === 'true';
            
            ctx.font = fontSize + 'px monospace';
            
            for(let i=0; i<drops.length; i++) {
                let text = chars[Math.floor(Math.random() * chars.length)];
                let fillStyle = '#0F0';

                // Rainbow Mode Override
                if(isRainbow) {
                    const colors = ['#0F0', '#F0F', '#0FF', '#FF0', '#F00'];
                    fillStyle = colors[Math.floor(Math.random() * colors.length)];
                }

                // Ghost Message Override (Higher Priority)
                if (isIndex && i === ghostCol && ghostTimer > 0) {
                    // Calculate which letter of the message to show based on row
                    const charIndex = Math.floor(drops[i]) % GHOST_MSG.length;
                    text = GHOST_MSG[charIndex];
                    fillStyle = '#FFF'; // Bright White
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = "#FFF";
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fillStyle = fillStyle;
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if(drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        }, 33);
    }
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initGlobalMatrix); else initGlobalMatrix();

    // 7. COMMAND LOGIC
    const overlay = document.getElementById('cmd-overlay');
    const input = document.getElementById('global-cmd-input');
    const output = document.getElementById('global-cmd-output');
    const isDeep = window.location.pathname.includes('content');
    const prefix = isDeep ? '../../' : '';

    window.toggleCmd = function() {
        if (overlay.classList.contains('hidden')) { overlay.classList.remove('hidden'); input.value = ''; output.innerText = ''; output.style.color = 'red'; setTimeout(() => input.focus(), 100); } 
        else { overlay.classList.add('hidden'); }
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === '/' || e.key === '\\' || e.key === '?') { if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') { e.preventDefault(); window.toggleCmd(); } }
        if (e.key === 'Escape') overlay.classList.add('hidden');
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const raw = input.value.trim(); const parts = raw.split(' '); const cmd = parts[0].toLowerCase(); const args = parts.slice(1).join(' ');
            input.value = ''; 
            const secret = sessionStorage.getItem('egg_code');
            if (secret && cmd === secret.toLowerCase()) { window.location.href = isDeep ? '../posts/easteregg.html' : 'content/posts/easteregg.html'; return; }
            output.innerText = "";

            switch(cmd) {
                case 'main': window.location.href = "https://life.minescout.net"; return;
                case 'home': case 'return': case 'root': window.location.href = prefix + 'index.html'; return;
                case 'email': case 'mail': window.location.href = prefix + 'email.html'; return;
                case 'atls': window.location.href = prefix + 'pages.html'; return;
                case 'prds': window.location.href = prefix + 'projects.html'; return;
                case 'reqs': window.location.href = prefix + 'feature-requests.html'; return;
                case 'help': window.location.href = prefix + 'help.html'; return;
                case 'login': window.location.href = prefix + 'login.html'; return;
                // ... inside switch(cmd) ...

                case 'logout': 
                    if (typeof firebase !== 'undefined' && firebase.auth) { 
                        firebase.auth().signOut().then(() => { 
                            output.style.color = '#0F0'; 
                            output.innerText = "Logged out successfully."; 
                        }); 
                    } else { 
                        output.innerText = "System loading... please wait."; 
                    } 
                    return;

                // ... rest of code ...
                case 'exit': window.toggleCmd(); return;
            }
            if (typeof window.handlePageCommand === 'function') { const result = window.handlePageCommand(cmd, args); if (result === true) return; if (typeof result === 'string') { output.innerText = result; return; } }
            output.innerText = `Error: Command '${cmd}' unrecognized.`;
        }
    });
})();