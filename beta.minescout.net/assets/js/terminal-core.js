/* TERMINAL CORE V5.0 (REVERSE TRANSITION + DATA VAULT + AI CHAT)
    - Global Command Center
    - Admin Whitelist & Security
    - Matrix Rain & Physics
    - Added: Exit Animation for 'main' command
    - Added: Account-Backed Data Vault Hacking System
    - Added: AI Questioning System
*/

(function() {
    console.log("Initializing Terminal Core v5.0 with Data Vault and AI...");

    const ADMIN_EMAIL = "theminescout@minescout.net";
    const APPROVED_ADMINS = [ "theminescout@minescout.net" ];

    // --- DATA VAULT CONFIG & STATE ---
    const VAULT_API = "https://life.minescout.net/api/vault";
    const VAULT_MAX_LEVEL = 9;
    const VAULT_MAX_ATTEMPTS = 4;

    const VAULT_STATE = {
        active: false,
        sessionId: null,
        stake: 0,
        attempts: VAULT_MAX_ATTEMPTS,
        words: [],
        level: 0,
        highestLevel: 0,
        unlockedFiles: []
    };

    const VAULT_FILES = [
        ["README.txt", 0],
        ["vault_status.dat", 0],
        ["access_L1.txt", 1],
        ["access_L2.txt", 2],
        ["access_L3.txt", 3],
        ["access_L4.txt", 4],
        ["access_L5.txt", 5],
        ["access_L6.enc", 6],
        ["access_L7.enc", 7],
        ["access_L8.enc", 8],
        ["root_fragment.dat", 9]
    ];

    // --- 1. STATE & STORAGE ---
    const CONFIG = {
        level: 0,
        aliases: JSON.parse(localStorage.getItem('ms_aliases')) || {},
        history: []
    };

    // --- VAULT & AI API HELPERS ---
    async function vaultRequest(path, options = {}) {
        const username = window.currentUser?.username;

        if (!username) {
            throw new Error("LOGIN REQUIRED: Authenticate before using the Data Vault.");
        }

        const requestOptions = { ...options };
        let body = {};

        if (requestOptions.body) {
            try {
                body = JSON.parse(requestOptions.body);
            } catch (_) {
                body = {};
            }
        }

        body.username = username;
        requestOptions.body = JSON.stringify(body);

        const response = await fetch(
            `${VAULT_API}${path}`,
            {
                credentials: "include",
                ...requestOptions,
                headers: {
                    "Content-Type": "application/json",
                    ...(requestOptions.headers || {})
                }
            }
        );

        let data = {};
        try {
            data = await response.json();
        } catch (_) {}

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.message ||
                `Vault API returned HTTP ${response.status}`
            );
        }

        return data;
    }

    // --- NEW: AI CHAT HELPER ---
    async function askAI(question) {
        print(`[AI] TRANSMITTING QUERY: "${question}"...`, "log-warn");
        
        const loadingId = "ai_" + Date.now();
        print(`<div id="${loadingId}" class="holo-loading">>[ ████████░░ ] AWAITING COGNITIVE RESPONSE...</div>`);

        // Replace this URL with your actual Cloudflare worker endpoint for chat
        const workerUrl = `https://thomas-chat.tmcarleton11.workers.dev/ask`;

        try {
            const response = await fetch(workerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    prompt: question,
                    username: window.currentUser?.username || "GUEST"
                })
            });

            if (!response.ok) throw new Error(`Signal lost (HTTP ${response.status})`);

            let answerText = "";
            const contentType = response.headers.get("content-type");
            
            // Support both JSON responses and plain text responses from the worker
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                answerText = data.answer || data.response || data.text || JSON.stringify(data);
            } else {
                answerText = await response.text();
            }

            // Remove loading animation
            const loadingDiv = document.getElementById(loadingId);
            if (loadingDiv) loadingDiv.remove();

            // Print AI response with typing-style pre-wrap
            print(`[AI RESPONSE]\n${answerText.trim()}`, "log-secret");

        } catch (error) {
            const loadingDiv = document.getElementById(loadingId);
            if (loadingDiv) loadingDiv.remove();
            print(`[AI] CONNECTION FAILED: ${error.message}`, "log-err");
        }
    }

    function vaultSetState(data) {
        VAULT_STATE.level =
            Math.max(0, Math.min(VAULT_MAX_LEVEL, Number(data.level) || 0));

        VAULT_STATE.highestLevel =
            Math.max(
                VAULT_STATE.level,
                Math.min(VAULT_MAX_LEVEL, Number(data.highestLevel) || 0)
            );

        VAULT_STATE.unlockedFiles =
            Array.isArray(data.unlockedFiles)
                ? data.unlockedFiles
                : [];

        if (VAULT_STATE.level < 10) {
            CONFIG.level = VAULT_STATE.level;
        }

        const titleBar = document.querySelector(".cmd-title-bar span");
        if (titleBar && !(window.currentUser &&
            APPROVED_ADMINS.includes(window.currentUser.username.toLowerCase()))) {
            titleBar.innerText =
                `GUEST@MINESCOUT:~ [LVL ${VAULT_STATE.level}]`;
        }
    }

    async function vaultLoadState(silent = false) {
        try {
            const data = await vaultRequest("", { method: "GET" });
            vaultSetState(data);
            return data;
        } catch (error) {
            if (!silent) {
                print(`[VAULT] ${error.message}`, "log-err");
            }
            return null;
        }
    }

    function vaultHexNoise(length) {
        const chars = "0123456789ABCDEF!@#$%^*()_+-=[]{}|;:,.<>?";
        let out = "";
        for (let i = 0; i < length; i++) {
            out += chars[Math.floor(Math.random() * chars.length)];
        }
        return out;
    }

    function vaultRenderPuzzle(message = "") {
        let output =
`ROCO COGNITIVE BREAKOUT ENGINES v5.0
=====================================
ENTER PASSWORD TO OVERRIDE SECURITY BLOCKS

CURRENT ACCESS: L${VAULT_STATE.level}
STAKE VALUE: ${VAULT_STATE.stake}
ATTEMPTS REMAINING: ${"█ ".repeat(VAULT_STATE.attempts)}

`;

        if (message) {
            output += `${message}\n\n`;
        }

        VAULT_STATE.words.forEach((word, index) => {
            const address = `0x${(4000 + index * 24).toString(16).toUpperCase()}`;
            output += `${address}  ${vaultHexNoise(6)}${word}${vaultHexNoise(6)}\n`;
        });

        output +=
`
Type '$ hack select [WORD]' to attempt extraction.
Type '$ hack abort' to terminate the session.`;

        print(output);
    }

    async function vaultStart(stake) {
        await vaultLoadState(true);

        if (!window.currentUser) {
            print("LOGIN REQUIRED: The Data Vault is account-bound.", "log-err");
            return true;
        }

        if (VAULT_STATE.level >= VAULT_MAX_LEVEL) {
            print(
`[SYSTEM BLOCK]

CURRENT ACCESS: L${VAULT_STATE.level}

Maximum gameplay clearance reached.
LEVEL 10 CANNOT BE OBTAINED THROUGH GAMEPLAY.`,
                "log-warn"
            );
            return true;
        }

        if (VAULT_STATE.level === 0 && stake !== 0) {
            print(
`LEVEL 0 TRAINING REQUIRES NO STAKE.

Use:
  $ hack
  $ hack confirm`,
                "log-err"
            );
            return true;
        }

        if (
            VAULT_STATE.level > 0 &&
            (!Number.isInteger(stake) || stake < 1 || stake > VAULT_STATE.level)
        ) {
            print(
`INVALID STAKE

CURRENT ACCESS: L${VAULT_STATE.level}
VALID STAKE: 1-${VAULT_STATE.level}`,
                "log-err"
            );
            return true;
        }

        try {
            const data = await vaultRequest("/hack/start", {
                method: "POST",
                body: JSON.stringify({ stake })
            });

            VAULT_STATE.active = true;
            VAULT_STATE.sessionId = data.sessionId;
            VAULT_STATE.stake = stake;
            VAULT_STATE.attempts = Number(data.attempts || VAULT_MAX_ATTEMPTS);
            VAULT_STATE.words = Array.isArray(data.words)
                ? data.words.map(word => String(word).toUpperCase())
                : [];

            vaultRenderPuzzle(data.message || "");
        } catch (error) {
            print(
`HACK INITIALIZATION FAILED

${error.message}

No clearance was changed.`,
                "log-err"
            );
        }

        return true;
    }

    async function vaultGuess(word) {
        word = String(word || "").trim().toUpperCase();

        if (!VAULT_STATE.active) {
            print("NO ACTIVE HACKING SESSION.", "log-err");
            return true;
        }

        if (!VAULT_STATE.words.includes(word)) {
            print(
`ERR: WORD NOT FOUND IN ACTIVE HEX MEMORY DUMP.

VALID CANDIDATES:
${VAULT_STATE.words.join("\n")}`,
                "log-err"
            );
            return true;
        }

        try {
            const data = await vaultRequest("/hack/guess", {
                method: "POST",
                body: JSON.stringify({
                    sessionId: VAULT_STATE.sessionId,
                    guess: word
                })
            });

            if (data.attemptsRemaining !== undefined) {
                VAULT_STATE.attempts = Number(data.attemptsRemaining);
            }

            if (data.result === "win") {
                VAULT_STATE.active = false;
                VAULT_STATE.sessionId = null;
                VAULT_STATE.words = [];

                await vaultLoadState(true);

                print(
`========================================
[!] ACCESS GRANTED
========================================

${data.message || "Security matrix bypass accepted."}

CURRENT CLEARANCE: L${VAULT_STATE.level}
HIGHEST CLEARANCE: L${VAULT_STATE.highestLevel}

New archive segments may now be available.

Try:
  $ ls -a
  $ cat access_L${VAULT_STATE.level}.txt`,
                    "log-warn"
                );

                return true;
            }

            if (data.result === "loss") {
                VAULT_STATE.active = false;
                VAULT_STATE.sessionId = null;
                VAULT_STATE.words = [];

                await vaultLoadState(true);

                print(
`========================================
[X] ACCESS DENIED
========================================

${data.message || "Security trace detected."}

CURRENT CLEARANCE: L${VAULT_STATE.level}
HIGHEST CLEARANCE: L${VAULT_STATE.highestLevel}

Previously discovered archive files remain unlocked.

Try:
  $ ls -a`,
                    "log-err"
                );

                return true;
            }

            vaultRenderPuzzle(
`ACCESS DENIED.
LIKENESS METRIC: ${Number(data.matches) || 0}/${word.length}`
            );
        } catch (error) {
            print(
`NETWORK ERROR

${error.message}

No clearance was modified.`,
                "log-err"
            );
        }

        return true;
    }

    async function vaultAbort() {
        if (!VAULT_STATE.active) {
            print("NO ACTIVE HACKING SESSION.");
            return true;
        }

        try {
            await vaultRequest("/hack/abort", {
                method: "POST",
                body: JSON.stringify({
                    sessionId: VAULT_STATE.sessionId
                })
            });
        } catch (error) {
            print(`[VAULT] ${error.message}`, "log-err");
        }

        VAULT_STATE.active = false;
        VAULT_STATE.sessionId = null;
        VAULT_STATE.words = [];
        VAULT_STATE.stake = 0;

        print(
`[MEMORY MAP RELEASED]

Hacking session terminated.
No clearance was changed.`,
            "log-warn"
        );

        return true;
    }

    async function vaultHackCommand(args) {
        const sub = String(args[0] || "").toLowerCase();

        if (VAULT_STATE.active) {
            if (sub === "select") return vaultGuess(args[1]);
            if (sub === "abort") return vaultAbort();

            print(
`[HACKING MATRIX ACTIVE]

Use:
  $ hack select <WORD>
or:
  $ hack abort`,
                "log-warn"
            );
            return true;
        }

        await vaultLoadState(true);

        if (sub === "confirm") {
            const stake = args[1] === undefined ? 0 : Number.parseInt(args[1], 10);

            if (VAULT_STATE.level === 0 && stake === 0) return vaultStart(0);
            if (VAULT_STATE.level > 0 && Number.isInteger(stake) && stake >= 1 && stake <= VAULT_STATE.level) {
                return vaultStart(stake);
            }

            print(
`INVALID CONFIRMATION

Current access: L${VAULT_STATE.level}

Level 0:
  $ hack
  $ hack confirm

Level 1-8:
  $ hack <stake>
  $ hack confirm <stake>`,
                "log-err"
            );
            return true;
        }

        if (VAULT_STATE.level >= VAULT_MAX_LEVEL) {
            print("MAXIMUM GAMEPLAY CLEARANCE REACHED.", "log-warn");
            return true;
        }

        if (VAULT_STATE.level === 0) {
            print(
`DATA VAULT ENTRY VECTOR
=======================

TARGET:
  LEVEL 0 -> LEVEL 1

STAKE:
  NONE

Type:
  $ hack confirm`
            );
            return true;
        }

        const stake = Number.parseInt(args[0], 10);

        if (!Number.isInteger(stake) || stake < 1 || stake > VAULT_STATE.level) {
            print(
`STAKE ALLOCATION REQUIRED

CURRENT ACCESS: L${VAULT_STATE.level}
VALID STAKE: 1-${VAULT_STATE.level}

Usage:
  $ hack <STAKE_AMOUNT>

Example:
  $ hack 2`,
                "log-err"
            );
            return true;
        }

        print(
`DATA VAULT ENTRY
================

CURRENT CLEARANCE: L${VAULT_STATE.level}
STAKE: ${stake}

POTENTIAL WIN: +${stake * 2} LEVELS
POTENTIAL LOSS: -${stake} LEVELS

Type:
  $ hack confirm ${stake}`
        );

        return true;
    }

    async function vaultList(hidden) {
        await vaultLoadState(true);

        if (!hidden) {
            print(
`FILESYSTEM:
[ART] ${typeof FILE_SYSTEM !== "undefined" ? "Articles" : "SYSTEM"}
[PRJ] ${typeof FILE_SYSTEM !== "undefined" ? "Projects" : "Data Vault"}

Use '$ ls -a' to inspect restricted archive entries.`
            );
            return true;
        }

        let output =
`DATA_VAULT/
=====================================
CURRENT ACCESS : L${VAULT_STATE.level}
HIGHEST ACCESS : L${VAULT_STATE.highestLevel}

`;

        for (const [name, required] of VAULT_FILES) {
            const unlocked = VAULT_STATE.unlockedFiles.includes(name) || VAULT_STATE.highestLevel >= required;
            output += unlocked ? `[HID] ${name}\n` : `[???] ${name}\n`;
        }

        output += `\nUse '$ cat <filename>' to read an accessible record.`;
        print(output);
        return true;
    }

    async function vaultCat(name) {
        if (!name) {
            print("Usage: cat <filename>", "log-err");
            return true;
        }

        const definition = VAULT_FILES.find(file => file[0] === name);
        if (!definition) return false;

        await vaultLoadState(true);

        const required = definition[1];
        const unlocked = VAULT_STATE.unlockedFiles.includes(name) || VAULT_STATE.highestLevel >= required;

        if (!unlocked) {
            print(
`ACCESS DENIED

FILE: ${name}
REQUIRED CLEARANCE: L${required}
HIGHEST CLEARANCE: L${VAULT_STATE.highestLevel}`,
                "log-err"
            );
            return true;
        }

        try {
            const data = await vaultRequest(`/files/${encodeURIComponent(name)}`, { method: "GET" });
            print(data.content || "[EMPTY RECORD]");
        } catch (error) {
            print(`FILE READ ERROR\n\n${error.message}`, "log-err");
        }

        return true;
    }

    // --- 2. AUTH LISTENER ---
    function applyAuthState(user) {
        const titleBar = document.querySelector('.cmd-title-bar span');
        if (user && APPROVED_ADMINS.includes(user.username.toLowerCase())) {
            CONFIG.level = 10;
            if (titleBar) titleBar.innerText = "ROOT@MINESCOUT:~ [LVL 10]";
        } else {
            if (CONFIG.level === 10) { CONFIG.level = 0; }
            vaultLoadState(true);
        }
    }
    document.addEventListener('auth-ready', (e) => applyAuthState(e.detail.user));
    if (window.authReady && window.currentUser) {
        applyAuthState(window.currentUser);
    }

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
        
        /* AI HOLOGRAM STYLES */
        .holo-container { margin: 10px 0; }
        .holo-image {
            max-width: 100%;
            max-height: 280px;
            width: auto;
            height: auto;
            object-fit: contain;
            display: block;
            border: 1px dashed #0F0;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.4);
            filter: sepia(100%) hue-rotate(70deg) saturate(300%) contrast(150%) brightness(80%);
            image-rendering: pixelated; 
            image-rendering: crisp-edges;
            opacity: 0.9;
        }
        .holo-loading { color: #FFD700; font-weight: bold; animation: blink 1s infinite; }

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
            background-color: #f3f4f6;
            z-index: 2147483647;
            pointer-events: none;
            clip-path: inset(50% 0 50% 0);
            transition: clip-path 2.5s ease-in-out;
            display: none;
        }
        #exit-overlay.expanding {
            clip-path: inset(0 0 0 0);
        }

        @media (max-width: 600px) { .cmd-overlay { padding: 0; align-items: flex-end; } .cmd-window { width: 100%; border: none; border-top: 2px solid #0F0; } }
    `;
    document.head.appendChild(style);

    // --- 4. HTML INJECTION ---
    if(document.body) {
        const overlayHtml = `
            <div id="exit-overlay"></div>
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
                    const exitLayer = document.getElementById('exit-overlay');
                    print("DISCONNECTING FROM MATRIX...", "log-warn");
                    exitLayer.style.display = 'block';
                    setTimeout(() => {
                        exitLayer.classList.add('expanding');
                    }, 50);
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
                    if (window.MS_AUTH) { 
                        print("Logging out...", "log-warn"); 
                        window.MS_AUTH.signOut(); 
                    } else { 
                        print("Auth script missing. Forcing local disconnect...", "log-warn"); 
                        localStorage.removeItem('ms_session');
                        setTimeout(() => window.location.href = 'login.html', 800);
                    }
                    break;

                // --- SYSTEM COMMANDS ---
                case 'ls':
                    if (args[0] === '-a') {
                        await vaultList(true);
                        break;
                    }
                    let out = "FILESYSTEM:\n";
                    if (typeof FILE_SYSTEM !== 'undefined') {
                        FILE_SYSTEM.articles.forEach(f => out += `[ART] ${f.title}\n`);
                        FILE_SYSTEM.projects.forEach(f => out += `[PRJ] ${f.title}\n`);
                    }
                    print(out);
                    break;

                case 'cat':
                    const fName = args.join(' ');
                    if (VAULT_FILES.some(file => file[0] === fName)) {
                        await vaultCat(fName);
                        break;
                    }
                    if (typeof FILE_SYSTEM !== 'undefined') {
                        const sFile = FILE_SYSTEM.secrets.find(f => f.name === fName);
                        if (sFile) {
                            if (CONFIG.level >= 1) print(sFile.content, "log-warn");
                            else print("ENCRYPTED. Level 1 required.", "log-err");
                        } else print("File not found.", "log-err");
                    }
                    break;

                case 'hack':
                    await vaultHackCommand(args);
                    break;

                // --- AI COMMANDS ---
                case 'ask':
                case 'chat':
                    const question = args.join(' ').trim();
                    if (!question) {
                        print("USAGE: ask [your question]", "log-err");
                        break;
                    }
                    await askAI(question);
                    break;

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
[SYS] ls [-a], cat [file], hack, stats, clear
[USR] login, logout, sudo [pass]
[CFG] alias [x]=[y], unalias [x]
[EXE] vm, snake, holo, ask [query]
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
                    if (args[0] === "beta_test") { if(CONFIG.level < 1) { CONFIG.level = 1; print("ACCESS GRANTED: LEVEL 1", "log-warn"); } else print("Already Level 1+", "log-warn"); }
                    else print("INCORRECT PASSWORD", "log-err");
                    break;

                case 'vm': if (CONFIG.level >= 10) window.location.href = prefix + 'admin-messages.html'; else print("ACCESS DENIED (Lvl 10)", "log-err"); break;
                case 'snake': startSnake(); break;
                case 'gen-avatar':
                case 'holo':
                    const imgPrompt = args.join(' ').trim();
                    if (!imgPrompt) { 
                        print("USAGE: holo [description]", "log-err"); 
                        break; 
                    }
                    
                    print(`[AI] INITIALIZING FLUX.1 ENGINE...`, "log-warn");
                    print(`[AI] TRANSMITTING: "${imgPrompt}"...`, "log-warn");
                    
                    const imgId = "holo_" + Date.now();
                    print(`<div id="${imgId}" class="holo-container holo-loading">>[ ████████░░ ] DECRYPTING VISUAL DATA...</div>`);
                    
                    const workerUrl = `https://thomas-chat.tmcarleton11.workers.dev/holo`;
                    
                    fetch(`${workerUrl}?prompt=${encodeURIComponent(imgPrompt)}`)
                        .then(res => {
                            if (!res.ok) throw new Error("Network drop");
                            return res.blob();
                        })
                        .then(blob => {
                            const localUrl = URL.createObjectURL(blob);
                            const container = document.getElementById(imgId);
                            container.className = "holo-container";
                            container.innerHTML = `<img src="${localUrl}" class="holo-image">`;
                            print("[AI] HOLOGRAM LINK ESTABLISHED.", "log-secret");
                            history.scrollTop = history.scrollHeight;
                        })
                        .catch(() => {
                            const container = document.getElementById(imgId);
                            container.className = "holo-container log-err";
                            container.innerText = "ERROR: SIGNAL INTERCEPTED OR LOST.";
                        });
                    break;
                default:
                    if (typeof window.handlePageCommand === 'function') { const res = window.handlePageCommand(cmd, args); if (res) { print(res === true ? "Executed." : res); return; } }
                    print(`Unknown: '${cmd}'`, "log-err");
            }
        }
    });

    // --- 6. EXTRAS (Snake, Matrix, Physics, Egg) ---
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

    window.DataVault = {
        state: VAULT_STATE,
        refresh: vaultLoadState,
        hack: vaultHackCommand,
        list: vaultList,
        cat: vaultCat,
        abort: vaultAbort
    };

})();