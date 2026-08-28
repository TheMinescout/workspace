/* MINESCOUT TERMINAL CORE V6.0 — LINUX WORKSTATION EDITION
    - Linux shell / workstation visual language
    - Ambient particle field
    - All existing site, vault, game, auth and navigation logic preserved
*/

(function() {
    console.log("Initializing Minescout Terminal Core v6.0 (Linux Workstation Edition)...");

    const ADMIN_EMAIL = "theminescout@minescout.net";
    const APPROVED_ADMINS = [ "theminescout@minescout.net" ];

    // --- DATA VAULT (now: "Context Memory") ---
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

    const CONFIG = {
        level: 0,
        aliases: JSON.parse(localStorage.getItem('ms_aliases')) || {},
        history: []
    };

    // --- API HELPERS ---
    async function vaultRequest(path, options = {}) {
        const username = window.currentUser?.username;
        if (!username) throw new Error("Authentication required. Please log in to use Context Memory.");

        const requestOptions = { ...options };
        let body = {};
        if (requestOptions.body) {
            try { body = JSON.parse(requestOptions.body); } catch (_) { body = {}; }
        }
        body.username = username;
        requestOptions.body = JSON.stringify(body);

        const response = await fetch(`${VAULT_API}${path}`, {
            credentials: "include",
            ...requestOptions,
            headers: { "Content-Type": "application/json", ...(requestOptions.headers || {}) }
        });

        let data = {};
        try { data = await response.json(); } catch (_) {}
        if (!response.ok) throw new Error(data.error || data.message || `API error HTTP ${response.status}`);
        return data;
    }

    // --- AI CHAT ---
    async function askAI(question) {
        print(`> Sending to Minescout AI: "${question}"`, "log-warn");
        const loadingId = "ai_" + Date.now();
        print(`<div id="${loadingId}" class="holo-loading">❯ Awaiting response…  ▋</div>`);

        const workerUrl = `https://thomas-chat.tmcarleton11.workers.dev/ask`;
        try {
            const response = await fetch(workerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: question, username: window.currentUser?.username || "guest" })
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            let answerText = "";
            const ct = response.headers.get("content-type");
            if (ct && ct.includes("application/json")) {
                const d = await response.json();
                answerText = d.answer || d.response || d.text || JSON.stringify(d);
            } else {
                answerText = await response.text();
            }

            const el = document.getElementById(loadingId);
            if (el) el.remove();
            print(`> Minescout AI:\n${answerText.trim()}`, "log-secret");
        } catch (error) {
            const el = document.getElementById(loadingId);
            if (el) el.remove();
            print(`> Connection error: ${error.message}`, "log-err");
        }
    }

    // --- VAULT STATE ---
    function vaultSetState(data) {
        VAULT_STATE.level = Math.max(0, Math.min(VAULT_MAX_LEVEL, Number(data.level) || 0));
        VAULT_STATE.highestLevel = Math.max(VAULT_STATE.level, Math.min(VAULT_MAX_LEVEL, Number(data.highestLevel) || 0));
        VAULT_STATE.unlockedFiles = Array.isArray(data.unlockedFiles) ? data.unlockedFiles : [];
        if (VAULT_STATE.level < 10) CONFIG.level = VAULT_STATE.level;

        const titleBar = document.getElementById("terminal-title");
        if (titleBar && !(window.currentUser && APPROVED_ADMINS.includes(window.currentUser.username.toLowerCase()))) {
            titleBar.innerText = `minescout@beta:~ [context L${VAULT_STATE.level}]`;
        }
        const depth = document.getElementById("boot-depth");
        if (depth) depth.textContent = String(VAULT_STATE.level);
    }

    async function vaultLoadState(silent = false) {
        try {
            const data = await vaultRequest("", { method: "GET" });
            vaultSetState(data);
            return data;
        } catch (error) {
            if (!silent) print(`> ${error.message}`, "log-err");
            return null;
        }
    }

    function vaultHexNoise(length) {
        const chars = "0123456789ABCDEFabcdef·∷⟩⟨";
        let out = "";
        for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
        return out;
    }

    function vaultRenderPuzzle(message = "") {
        let output =
`CONTEXT MEMORY PROBE v5.0
═══════════════════════════════
Identify the token to expand context window

Current depth : L${VAULT_STATE.level}
Stake value   : ${VAULT_STATE.stake}
Attempts left : ${"▪ ".repeat(VAULT_STATE.attempts)}

`;
        if (message) output += `${message}\n\n`;

        VAULT_STATE.words.forEach((word, index) => {
            const address = `0x${(4000 + index * 24).toString(16).toUpperCase()}`;
            output += `${address}  ${vaultHexNoise(6)} ${word} ${vaultHexNoise(6)}\n`;
        });

        output += `\nType '$ probe select [TOKEN]' to attempt.\nType '$ probe abort' to exit.`;
        print(output);
    }

    async function vaultStart(stake) {
        await vaultLoadState(true);
        if (!window.currentUser) { print("> Authentication required to use Context Memory.", "log-err"); return true; }
        if (VAULT_STATE.level >= VAULT_MAX_LEVEL) {
            print(`> Maximum context depth reached (L${VAULT_STATE.level}).\n> L10 access is granted by admin only.`, "log-warn");
            return true;
        }
        if (VAULT_STATE.level === 0 && stake !== 0) {
            print("> L0 training requires no stake.\n> Usage:\n  $ probe\n  $ probe confirm", "log-err");
            return true;
        }
        if (VAULT_STATE.level > 0 && (!Number.isInteger(stake) || stake < 1 || stake > VAULT_STATE.level)) {
            print(`> Invalid stake.\n> Current depth: L${VAULT_STATE.level}\n> Valid range: 1–${VAULT_STATE.level}`, "log-err");
            return true;
        }
        try {
            const data = await vaultRequest("/hack/start", { method: "POST", body: JSON.stringify({ stake }) });
            VAULT_STATE.active = true;
            VAULT_STATE.sessionId = data.sessionId;
            VAULT_STATE.stake = stake;
            VAULT_STATE.attempts = Number(data.attempts || VAULT_MAX_ATTEMPTS);
            VAULT_STATE.words = Array.isArray(data.words) ? data.words.map(w => String(w).toUpperCase()) : [];
            vaultRenderPuzzle(data.message || "");
        } catch (error) {
            print(`> Probe initialization failed:\n  ${error.message}`, "log-err");
        }
        return true;
    }

    async function vaultGuess(word) {
        word = String(word || "").trim().toUpperCase();
        if (!VAULT_STATE.active) { print("> No active probe session.", "log-err"); return true; }
        if (!VAULT_STATE.words.includes(word)) {
            print(`> Token not found in memory map.\n> Valid tokens:\n${VAULT_STATE.words.map(w => "  · " + w).join("\n")}`, "log-err");
            return true;
        }
        try {
            const data = await vaultRequest("/hack/guess", {
                method: "POST",
                body: JSON.stringify({ sessionId: VAULT_STATE.sessionId, guess: word })
            });
            if (data.attemptsRemaining !== undefined) VAULT_STATE.attempts = Number(data.attemptsRemaining);

            if (data.result === "win") {
                VAULT_STATE.active = false; VAULT_STATE.sessionId = null; VAULT_STATE.words = [];
                await vaultLoadState(true);
                print(
`══════════════════════════════════
✓ CONTEXT EXPANDED
══════════════════════════════════

${data.message || "Token accepted. Context window extended."}

Current depth  : L${VAULT_STATE.level}
Highest depth  : L${VAULT_STATE.highestLevel}

New memory segments may be available.
Try:\n  $ ls -a\n  $ cat access_L${VAULT_STATE.level}.txt`, "log-secret");
                return true;
            }

            if (data.result === "loss") {
                VAULT_STATE.active = false; VAULT_STATE.sessionId = null; VAULT_STATE.words = [];
                await vaultLoadState(true);
                print(
`══════════════════════════════════
✗ CONTEXT COLLAPSED
══════════════════════════════════

${data.message || "Incorrect token. Context depth reduced."}

Current depth  : L${VAULT_STATE.level}
Highest depth  : L${VAULT_STATE.highestLevel}

Previously unlocked files remain accessible. Try:\n  $ ls -a`, "log-err");
                return true;
            }

            vaultRenderPuzzle(`✗ Wrong token.\nSimilarity: ${Number(data.matches) || 0}/${word.length}`);
        } catch (error) {
            print(`> Network error:\n  ${error.message}`, "log-err");
        }
        return true;
    }

    async function vaultAbort() {
        if (!VAULT_STATE.active) { print("> No active probe session."); return true; }
        try {
            await vaultRequest("/hack/abort", { method: "POST", body: JSON.stringify({ sessionId: VAULT_STATE.sessionId }) });
        } catch (error) { print(`> ${error.message}`, "log-err"); }
        VAULT_STATE.active = false; VAULT_STATE.sessionId = null; VAULT_STATE.words = []; VAULT_STATE.stake = 0;
        print("> Probe terminated. No depth change.", "log-warn");
        return true;
    }

    async function vaultHackCommand(args) {
        const sub = String(args[0] || "").toLowerCase();

        if (VAULT_STATE.active) {
            if (sub === "select") return vaultGuess(args[1]);
            if (sub === "abort") return vaultAbort();
            print("> Probe active.\n  $ probe select <TOKEN>\n  $ probe abort", "log-warn");
            return true;
        }

        await vaultLoadState(true);

        if (sub === "confirm") {
            const stake = args[1] === undefined ? 0 : Number.parseInt(args[1], 10);
            if (VAULT_STATE.level === 0 && stake === 0) return vaultStart(0);
            if (VAULT_STATE.level > 0 && Number.isInteger(stake) && stake >= 1 && stake <= VAULT_STATE.level) return vaultStart(stake);
            print(`> Invalid confirmation.\n  Current depth: L${VAULT_STATE.level}`, "log-err");
            return true;
        }

        if (VAULT_STATE.level >= VAULT_MAX_LEVEL) { print("> Maximum context depth reached.", "log-warn"); return true; }

        if (VAULT_STATE.level === 0) {
            print(`CONTEXT MEMORY PROBE\n════════════════════\n\nTarget : L0 → L1\nStake  : none\n\nType:\n  $ probe confirm`);
            return true;
        }

        const stake = Number.parseInt(args[0], 10);
        if (!Number.isInteger(stake) || stake < 1 || stake > VAULT_STATE.level) {
            print(`> Stake required.\n  Current depth : L${VAULT_STATE.level}\n  Valid range   : 1–${VAULT_STATE.level}\n\nUsage:\n  $ probe <STAKE>\n  $ probe 2`, "log-err");
            return true;
        }

        print(`CONTEXT MEMORY PROBE\n════════════════════\n\nCurrent depth   : L${VAULT_STATE.level}\nStake           : ${stake}\n\nPotential gain  : +${stake * 2} levels\nPotential loss  : -${stake} levels\n\nType:\n  $ probe confirm ${stake}`);
        return true;
    }

    async function vaultList(hidden) {
        await vaultLoadState(true);
        if (!hidden) {
            let out = "WORKSPACE:\n";
            if (typeof FILE_SYSTEM !== 'undefined') {
                FILE_SYSTEM.articles.forEach(f => out += `  [article] ${f.title}\n`);
                FILE_SYSTEM.projects.forEach(f => out += `  [project] ${f.title}\n`);
            }
            out += "\nUse '$ ls -a' to inspect context memory files.";
            print(out);
            return true;
        }

        let output = `CONTEXT_MEMORY/\n═══════════════════════════════\nCurrent depth  : L${VAULT_STATE.level}\nHighest depth  : L${VAULT_STATE.highestLevel}\n\n`;
        for (const [name, required] of VAULT_FILES) {
            const unlocked = VAULT_STATE.unlockedFiles.includes(name) || VAULT_STATE.highestLevel >= required;
            output += unlocked ? `  [unlocked] ${name}\n` : `  [locked ] ${name}\n`;
        }
        output += `\nUse '$ cat <filename>' to read an accessible file.`;
        print(output);
        return true;
    }

    async function vaultCat(name) {
        if (!name) { print("> Usage: cat <filename>", "log-err"); return true; }
        const definition = VAULT_FILES.find(file => file[0] === name);
        if (!definition) return false;

        await vaultLoadState(true);
        const required = definition[1];
        const unlocked = VAULT_STATE.unlockedFiles.includes(name) || VAULT_STATE.highestLevel >= required;

        if (!unlocked) {
            print(`> Access denied.\n  File     : ${name}\n  Required : L${required}\n  Current  : L${VAULT_STATE.highestLevel}`, "log-err");
            return true;
        }
        try {
            const data = await vaultRequest(`/files/${encodeURIComponent(name)}`, { method: "GET" });
            print(data.content || "[empty file]");
        } catch (error) {
            print(`> File read error:\n  ${error.message}`, "log-err");
        }
        return true;
    }

    // --- AUTH ---
    function applyAuthState(user) {
        const titleBar = document.getElementById("terminal-title");
        if (user && APPROVED_ADMINS.includes(user.username.toLowerCase())) {
            CONFIG.level = 10;
            if (titleBar) titleBar.innerText = "root@minescout [depth: 10]";
        } else {
            if (CONFIG.level === 10) CONFIG.level = 0;
            vaultLoadState(true);
        }
    }
    document.addEventListener('auth-ready', (e) => applyAuthState(e.detail.user));
    if (window.authReady && window.currentUser) applyAuthState(window.currentUser);


    // --- MAIN TERMINAL UI ---
    // The landing page IS the terminal. There is intentionally no modal,
    // overlay, popup, launcher window, or secondary command console.
    function ensureTerminal() {
        const host = document.getElementById("main-terminal-host");
        if (!host) return null;

        host.innerHTML = `
            <section class="ms-terminal" id="main-terminal" aria-label="Minescout terminal">
                <header class="cmd-title-bar">
                    <div class="cmd-title-left">
                        <span class="cmd-terminal-icon">›_</span>
                        <span id="terminal-title">minescout@beta:~</span>
                    </div>
                    <div class="cmd-title-right">
                        <span class="cmd-session">TTY1</span>
                        <span class="cmd-status"><i></i> ONLINE</span>
                    </div>
                </header>
                <div class="cmd-body">
                    <div id="cmd-history" class="cmd-output" role="log" aria-live="polite">
                        <div class="boot-block">
                            <div class="boot-brand">MINESCOUT</div>
                            <div class="boot-rule">────────────────────────────────────────────────────────</div>
                            <div class="log-entry boot-welcome">Welcome to the Minescout AI research preview!</div>
                            <pre class="ascii-art boot-ascii">█▀▄▀█ ▀█▀ █▄░█ █▀▀ █▀ █▀▀ █▀█ █░█ ▀█▀
█░▀░█ ░█░ █░▀█ ██▄ ▄█ █▄▄ █▄█ █▄█ ░█░

█▄▄ █▀▀ ▀█▀ ▄▀█
█▄█ ██▄ ░█░ █▀█</pre>
                            <div class="boot-meta">
                                <span>[ research-preview ]</span>
                                <span>[ linux / tty1 ]</span>
                                <span>[ context: L<span id="boot-depth">0</span> ]</span>
                            </div>
                            <div class="boot-divider"></div>
                            <div class="log-entry">System initialized. Terminal ready.</div>
                            <div class="log-entry text-dim">Type <span class="cmd-accent">help</span> for available commands.</div>
                            <div class="log-entry text-dim">Use <span class="cmd-accent">Tab</span> for completion · <span class="cmd-accent">↑/↓</span> for history · <span class="cmd-accent">Ctrl+L</span> to clear.</div>
                        </div>
                    </div>
                    <div class="input-line">
                        <span class="shell-prompt">minescout@beta:~$</span>
                        <input type="text" id="global-cmd-input" aria-label="Terminal command" autocomplete="off" spellcheck="false" autofocus>
                    </div>
                    <div class="terminal-footer">
                        <span>MINESCOUT BETA</span>
                        <span id="terminal-clock">--:--:--</span>
                    </div>
                </div>
            </section>
        `;
        return document.getElementById("main-terminal");
    }

    const terminal = ensureTerminal();
    const input = document.getElementById("global-cmd-input");
    const history = document.getElementById("cmd-history");

    const isDeep = window.location.pathname.includes("content");
    const prefix = isDeep ? "../../" : "";

    if (!terminal || !input || !history) {
        // Secondary pages no longer spawn a modal terminal. Their legacy
        // "open terminal" controls route back to the real terminal homepage.
        window.toggleCmd = function() {
            // Secondary pages have a real, deterministic exit destination.
            // Articles return to ATLS; projects return to PRDS.
            const path = window.location.pathname.toLowerCase();
            if (path.includes("/content/articles/")) {
                window.location.href = prefix + "pages";
                return;
            }
            if (path.includes("/content/projects/")) {
                window.location.href = prefix + "projects";
                return;
            }
            window.location.href = prefix + "index";
        };
        console.warn("Minescout Terminal Core: secondary page; terminal controls route to the main TTY.");
        return;
    }

    window.toggleCmd = function() {
        // Kept for backwards compatibility with older pages.
        // It never opens a popup; it simply focuses the real terminal.
        input.focus();
        terminal.classList.add("terminal-focus");
        window.setTimeout(() => terminal.classList.remove("terminal-focus"), 220);
    };

    function print(msg, cls = "") {
        const div = document.createElement("div");
        div.className = `log-entry ${cls}`;
        div.innerHTML = msg;
        history.appendChild(div);
        history.scrollTop = history.scrollHeight;
    }

    function updateClock() {
        const clock = document.getElementById("terminal-clock");
        if (clock) clock.textContent = new Date().toLocaleTimeString([], { hour12: false });
    }
    updateClock();
    setInterval(updateClock, 1000);

    function updateDepthDisplay() {
        const depth = document.getElementById("boot-depth");
        if (depth) depth.textContent = String(VAULT_STATE.level ?? CONFIG.level ?? 0);
        const titleBar = document.getElementById("terminal-title");
        if (titleBar && window.currentUser && APPROVED_ADMINS.includes(window.currentUser.username.toLowerCase())) {
            titleBar.textContent = "root@minescout:~";
        }
    }
    window.addEventListener("minescout-depth-change", updateDepthDisplay);

    const commandHistory = [];
    let historyIndex = -1;
    const COMMANDS = [
        "help","home","return","atls","prds","reqs","email","main","ls","cat",
        "probe","stats","clear","login","logout","sudo","alias","unalias",
        "ask","chat","holo","gen-avatar","snake","vm","ack","dismiss","clear_err","err"
    ];

    function completeCommand() {
        const value = input.value;
        const caret = input.selectionStart ?? value.length;
        const beforeCaret = value.slice(0, caret);
        if (beforeCaret.includes(" ")) return;

        const match = COMMANDS.find(c => c.startsWith(beforeCaret.toLowerCase()));
        if (match) {
            input.value = match + value.slice(caret);
            input.setSelectionRange(match.length, match.length);
        }
    }

    input.addEventListener("keydown", async (e) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (!commandHistory.length) return;
            historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
            input.value = commandHistory[commandHistory.length - 1 - historyIndex] || "";
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!commandHistory.length) return;
            historyIndex = Math.max(historyIndex - 1, -1);
            input.value = historyIndex < 0 ? "" : (commandHistory[commandHistory.length - 1 - historyIndex] || "");
            return;
        }

        if (e.key === "Tab") {
            e.preventDefault();
            completeCommand();
            return;
        }

        if (e.ctrlKey && e.key.toLowerCase() === "l") {
            e.preventDefault();
            history.innerHTML = "";
            return;
        }

        if (e.ctrlKey && e.key.toLowerCase() === "u") {
            e.preventDefault();
            input.value = "";
            return;
        }

        if (e.key !== "Enter") return;

        const raw = input.value.trim();
        if (!raw) return;

        commandHistory.push(raw);
        if (commandHistory.length > 50) commandHistory.shift();
        historyIndex = -1;

        print(`<span class="shell-prompt">minescout@beta:~$</span> ${escapeHtml(raw)}`);
        input.value = "";

        let cmdStr = CONFIG.aliases[raw] || raw;
        const parts = cmdStr.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
        const cmd = (parts[0] || "").toLowerCase();
        const args = parts.slice(1).map(v => v.replace(/^"|"$/g, ""));

        const secret = sessionStorage.getItem("egg_code");
        if (secret && cmd === secret.toLowerCase()) {
            window.location.href = isDeep ? "../posts/easteregg" : "content/posts/easteregg";
            return;
        }

        switch (cmd) {
            case "main":
                print("> Returning to main site…", "log-warn");
                window.location.href = "https://life.minescout.net";
                break;

            case "home":
            case "return":
                window.location.href = prefix + "index";
                break;

            case "atls":
                window.location.href = prefix + "pages";
                break;

            case "prds":
                window.location.href = prefix + "projects";
                break;

            case "reqs":
                window.location.href = prefix + "feature-requests";
                break;

            case "email":
                window.location.href = prefix + "email";
                break;

            case "login":
                window.location.href = prefix + "login";
                break;

            case "logout":
                if (window.MS_AUTH) {
                    print("> Signing out…", "log-warn");
                    window.MS_AUTH.signOut();
                } else {
                    print("> Forcing local sign-out…", "log-warn");
                    localStorage.removeItem("ms_session");
                    setTimeout(() => window.location.href = prefix + "login", 500);
                }
                break;

            case "ls":
                if (args[0] === "-a") {
                    await vaultList(true);
                    break;
                }
                let out = "WORKSPACE:\n";
                if (typeof FILE_SYSTEM !== "undefined") {
                    FILE_SYSTEM.articles.forEach(f => out += `  [article] ${f.title}\n`);
                    FILE_SYSTEM.projects.forEach(f => out += `  [project] ${f.title}\n`);
                }
                print(out);
                break;

            case "cat": {
                const fName = args.join(" ");
                if (VAULT_FILES.some(file => file[0] === fName)) {
                    await vaultCat(fName);
                    break;
                }
                if (typeof FILE_SYSTEM !== "undefined") {
                    const sFile = FILE_SYSTEM.secrets.find(f => f.name === fName);
                    if (sFile) {
                        if (CONFIG.level >= 1) print(sFile.content, "log-warn");
                        else print("> Context depth L1 required.", "log-err");
                    } else {
                        print("> File not found.", "log-err");
                    }
                }
                break;
            }

            case "probe":
            case "hack":
                await vaultHackCommand(args);
                updateDepthDisplay();
                break;

            case "ask":
            case "chat": {
                const question = args.join(" ").trim();
                if (!question) {
                    print("> Usage: ask [your question]", "log-err");
                    break;
                }
                await askAI(question);
                break;
            }

            case "stats": {
                print("> Measuring…", "log-warn");
                const start = Date.now();
                try {
                    await fetch(window.location.href, { method: "HEAD", cache: "no-store" });
                    const ping = Date.now() - start;
                    print(
`┌────────────────────────┐
│  SYSTEM STATUS         │
├────────────────────────┤
│ ping   : ${String(ping).padEnd(6)} ms │
│ depth  : L${String(VAULT_STATE.level).padEnd(7)} │
│ tty    : tty1          │
│ state  : ONLINE        │
└────────────────────────┘`
                    );
                } catch (e) {
                    print("> Offline or unreachable.", "log-err");
                }
                break;
            }

            case "help":
                print(`
MINESCOUT TERMINAL
────────────────────────────────────────
Navigation
  home / return     index
  atls              articles
  prds              projects
  reqs              feature requests
  email             contact
  main              return to Minescout Life

Workspace
  ls [-a]           list files / context memory
  cat [file]        read a file
  probe [stake]     expand context memory
  stats             connection/system status
  clear             clear terminal output

Auth
  login / logout
  sudo [pass]       elevate test access
  vm                admin panel (L10 only)

Tools
  ask [query]       chat with Minescout AI
  holo [desc]       generate an image
  snake             play snake
  alias x=y         create an alias
  unalias x         remove an alias

Keyboard
  Tab               command completion
  ↑ / ↓             command history
  Ctrl+L            clear screen
  Ctrl+U            clear input
`);
                break;

            case "clear":
                history.innerHTML = "";
                break;

            case "alias": {
                const fullArg = args.join(" ");
                const eq = fullArg.indexOf("=");
                if (eq > 0) {
                    const key = fullArg.slice(0, eq).trim();
                    const val = fullArg.slice(eq + 1).trim();
                    CONFIG.aliases[key] = val;
                    localStorage.setItem("ms_aliases", JSON.stringify(CONFIG.aliases));
                    print(`> Alias set: ${key} → ${val}`, "log-warn");
                } else {
                    print("> Usage: alias name=command", "log-err");
                }
                break;
            }

            case "unalias":
                if (args[0] === "-all") {
                    CONFIG.aliases = {};
                    localStorage.removeItem("ms_aliases");
                    print("> All aliases cleared.", "log-warn");
                } else if (CONFIG.aliases[args[0]]) {
                    delete CONFIG.aliases[args[0]];
                    localStorage.setItem("ms_aliases", JSON.stringify(CONFIG.aliases));
                    print(`> Removed: ${args[0]}`, "log-warn");
                } else {
                    print(`> Alias not found: ${args[0]}`, "log-err");
                }
                break;

            case "sudo":
                if (args[0] === "beta_test") {
                    if (CONFIG.level < 1) {
                        CONFIG.level = 1;
                        print("> Access elevated to L1.", "log-warn");
                        updateDepthDisplay();
                    } else {
                        print("> Already L1+.", "log-warn");
                    }
                } else {
                    print("> Incorrect passphrase.", "log-err");
                }
                break;

            case "vm":
                if (CONFIG.level >= 10) {
                    window.location.href = prefix + "admin-messages";
                } else {
                    print("> Access denied. L10 required.", "log-err");
                }
                break;

            case "snake":
                startSnake();
                break;

            case "gen-avatar":
            case "holo": {
                const imgPrompt = args.join(" ").trim();
                if (!imgPrompt) {
                    print("> Usage: holo [description]", "log-err");
                    break;
                }
                print(`> Generating: "${escapeHtml(imgPrompt)}"…`, "log-warn");
                const imgId = "holo_" + Date.now();
                print(`<div id="${imgId}" class="holo-container holo-loading">> Rendering image… ▋</div>`);
                const workerUrl = "https://thomas-chat.tmcarleton11.workers.dev/holo";
                fetch(`${workerUrl}?prompt=${encodeURIComponent(imgPrompt)}`)
                    .then(res => {
                        if (!res.ok) throw new Error("Network error");
                        return res.blob();
                    })
                    .then(blob => {
                        const url = URL.createObjectURL(blob);
                        const el = document.getElementById(imgId);
                        if (el) {
                            el.className = "holo-container";
                            el.innerHTML = `<img src="${url}" class="holo-image" alt="Generated image">`;
                        }
                        print("> Image ready.", "log-secret");
                    })
                    .catch(error => {
                        const el = document.getElementById(imgId);
                        if (el) {
                            el.className = "holo-container log-err";
                            el.innerText = `> Image generation failed: ${error.message}`;
                        }
                    });
                break;
            }

            default:
                if (typeof window.handlePageCommand === "function") {
                    const res = window.handlePageCommand(cmd, args);
                    if (res) {
                        print(res === true ? "> Done." : res);
                        return;
                    }
                }
                print(`> Unknown command: '${escapeHtml(cmd)}'. Type 'help' for a list.`, "log-err");
        }
    });

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Slash is a focus shortcut, not a popup shortcut.
    document.addEventListener("keydown", e => {
        if ((e.key === "/" || e.key === "\\") && document.activeElement !== input) {
            e.preventDefault();
            input.focus();
        }
    });

    // Apply auth state after the real terminal exists.
    document.addEventListener("auth-ready", e => {
        applyAuthState(e.detail.user);
        updateDepthDisplay();
    });
    if (window.authReady && window.currentUser) applyAuthState(window.currentUser);
    updateDepthDisplay();

    // Make the terminal feel like a real TTY on first load.
    window.setTimeout(() => input.focus(), 120);
    // --- SNAKE ---
    function startSnake() {
        history.innerHTML = "";
        const cols = 20, rows = 10;
        let snake = [{x:5,y:5}], food = {x:10,y:5}, dir = {x:1,y:0}, score = 0, loop;
        function draw() {
            let b = "";
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    if (snake.some(s => s.x===x && s.y===y)) b += "▪";
                    else if (food.x===x && food.y===y) b += "◆";
                    else b += "·";
                }
                b += "\n";
            }
            history.innerHTML = `<pre style="line-height:12px;color:var(--accent)">${b}</pre><div style="color:var(--text-dim)">score: ${score}  (esc to quit)</div>`;
        }
        function update() {
            const h = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
            if (h.x<0||h.x>=cols||h.y<0||h.y>=rows||snake.some(s=>s.x===h.x&&s.y===h.y)) {
                clearInterval(loop); document.removeEventListener('keydown', ctrl);
                print("> Game over. Score: " + score, "log-err");
                const pre = history.querySelector('pre');
                if (pre) { pre.style.display='inline-block'; pre.classList.add('gravity-fail'); enablePhysics(pre); }
                return;
            }
            snake.unshift(h);
            if (h.x===food.x && h.y===food.y) { score++; food={x:Math.floor(Math.random()*cols),y:Math.floor(Math.random()*rows)}; }
            else snake.pop();
            draw();
        }
        function ctrl(e) {
            if (e.key==='ArrowUp'&&dir.y===0) dir={x:0,y:-1};
            if (e.key==='ArrowDown'&&dir.y===0) dir={x:0,y:1};
            if (e.key==='ArrowLeft'&&dir.x===0) dir={x:-1,y:0};
            if (e.key==='ArrowRight'&&dir.x===0) dir={x:1,y:0};
            if (e.key==='Escape') { clearInterval(loop); document.removeEventListener('keydown',ctrl); print("> Quit. Score: "+score); }
        }
        document.addEventListener('keydown', ctrl);
        loop = setInterval(update, 150);
    }

    function enablePhysics(el) {
        if (!el) return;
        let pos={x:0,y:0}, vel={x:Math.random()*4-2, y:-5};
        const l = setInterval(() => {
            vel.y += 0.5; pos.x += vel.x; pos.y += vel.y;
            el.style.transform = `translate(${pos.x}px,${pos.y}px) rotate(${pos.x*5}deg)`;
            if (pos.y > 500) { clearInterval(l); el.style.display='none'; }
        }, 20);
    }

    // --- AMBIENT PARTICLE FIELD (replaces matrix rain) ---
    function initAmbient() {
        const canvas = document.getElementById('matrixCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width, height;
        function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', resize);

        // Floating particles
        const particles = [];
        const PARTICLE_COUNT = 60;
        const CHARS = "01abcdef><{}[]()";
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vy: 0.2 + Math.random() * 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                char: CHARS[Math.floor(Math.random() * CHARS.length)],
                alpha: 0.05 + Math.random() * 0.15,
                size: 11 + Math.floor(Math.random() * 5),
                timer: Math.floor(Math.random() * 80)
            });
        }

        let isRainbow = false;
        setInterval(() => {
            ctx.clearRect(0, 0, width, height);
            try { isRainbow = sessionStorage.getItem('egg_rainbow') === 'true'; } catch(e){}

            for (const p of particles) {
                p.timer--;
                if (p.timer <= 0) {
                    p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
                    p.timer = 40 + Math.floor(Math.random() * 60);
                }
                p.x += p.vx; p.y += p.vy;
                if (p.y > height + 20) { p.y = -20; p.x = Math.random() * width; }
                if (p.x < -20) p.x = width + 20;
                if (p.x > width + 20) p.x = -20;

                const color = isRainbow
                    ? `hsla(${Math.random()*360},80%,70%,${p.alpha})`
                    : `rgba(218, 119, 86, ${p.alpha})`;
                ctx.fillStyle = color;
                ctx.font = `${p.size}px 'JetBrains Mono', monospace`;
                ctx.fillText(p.char, p.x, p.y);
            }
        }, 40);
    }

    function spawnHiddenNode() {
        const path = window.location.pathname;
        const isIndex = path.endsWith("index") || path.endsWith("/");
        if (!isIndex) return;
        const egg = document.createElement('div');
        egg.className = 'hidden-node'; egg.innerText = "?";
        const corners = ['TL','TR','BL','BR'];
        const pick = corners[Math.floor(Math.random() * corners.length)];
        if (pick==='TL') { egg.style.top='0'; egg.style.left='0'; }
        if (pick==='TR') { egg.style.top='0'; egg.style.right='0'; }
        if (pick==='BL') { egg.style.bottom='0'; egg.style.left='0'; }
        if (pick==='BR') { egg.style.bottom='0'; egg.style.right='0'; }
        egg.onmouseover = () => egg.innerText = "!";
        egg.onmouseout = () => egg.innerText = "?";
        egg.onclick = () => {
            let secretCode = null;
            try { secretCode = sessionStorage.getItem('egg_code'); } catch(e){}
            if (!secretCode) {
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                secretCode = "";
                for (let i=0; i<4; i++) secretCode += chars.charAt(Math.floor(Math.random()*chars.length));
                try { sessionStorage.setItem('egg_code', secretCode); } catch(e){}
            }
            console.clear();
            console.warn("Anomaly detected.");
            console.log(`%c ACCESS CODE: [ ${secretCode} ]`, "color: #1a1a1e; background: #da7756; font-size: 20px; padding: 10px; border-radius: 3px;");
            alert("Encrypted signal found.\n\nCheck the Developer Console (F12) for your access code.");
        };
        document.body.appendChild(egg);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { initAmbient(); setTimeout(spawnHiddenNode, 2000); });
    } else {
        initAmbient(); setTimeout(spawnHiddenNode, 2000);
    }

    document.addEventListener('keydown', (e) => {
        if ((e.key==='/'||e.key==='\\') && document.activeElement !== input) { e.preventDefault(); window.toggleCmd(); }
        if (e.key==='Escape') overlay.classList.add('hidden');
    });

    window.DataVault = { state: VAULT_STATE, refresh: vaultLoadState, hack: vaultHackCommand, list: vaultList, cat: vaultCat, abort: vaultAbort };
})();
