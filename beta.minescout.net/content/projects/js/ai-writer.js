/*
    AI WRITER SUITE LOGIC v42.0
    - Standalone: no Firebase, no Puter, no external deps
    - AI via Cloudflare Worker
    - Local saves via IndexedDB
    - Live preview, PDF export, copy
*/

// --- 1. GLOBAL VARIABLES ---
let assets = [];
let adminMode = false;

const DB_NAME = "MinescoutDB_v30";
let db;

// --- 2. INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    initDB();

    const inputContent = document.getElementById("inp-content");
    if(inputContent) {
        inputContent.addEventListener("input", (e) => {
            document.getElementById("char-count").innerText = e.target.value.length + " CHARS";
        });
        if(!inputContent.value) inputContent.value = "<!-- AI Content will appear here -->";
    }
});

// --- 3. ADMIN LOGIC ---
function checkAdminCode() {
    const code = document.getElementById("admin-code").value;
    const fields = document.querySelector(".admin-fields");

    if (code === "TheMinescout") {
        fields.classList.add("admin-active");
        adminMode = true;
        log("ADMIN ACCESS GRANTED.", "log-warn");
    } else {
        fields.classList.remove("admin-active");
        adminMode = false;
    }
}

// --- 4. TAB SYSTEM ---
function setTab(name) {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));

    const tabs = Array.from(document.querySelectorAll(".tab"));
    const order = ["editor", "assets", "preview", "logs"];
    const idx = order.indexOf(name);
    if(idx > -1) tabs[idx].classList.add("active");

    document.getElementById("panel-" + name).classList.add("active");
    if (name === "preview") refreshPreview();
}

function openPreviewTab() { setTab("preview"); }

// --- 5. COMPILATION ---
function stripScripts(html) {
    return html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
               .replace(/\[\[SCRIPT[\s\S]*?\[\[CLOSE_SCRIPT\]\]/g, "");
}

function compileHTML() {
    const title = document.getElementById("inp-title").value || "Untitled";
    const bodyContent = document.getElementById("inp-content").value;
    const dateStr = new Date().toLocaleDateString();
    let template = "";

    if (adminMode) {
        const src = document.getElementById("prod-template").innerHTML;
        const txt = document.createElement("textarea");
        txt.innerHTML = src;
        template = txt.value
            .replace(/\[\[SCRIPT/g, "<script>")
            .replace(/\[\[CLOSE_SCRIPT\]\]/g, "</script>")
            .replace(/<script[^>]*>[\s\S]*?<\/script>/g, "");

        const cat = document.getElementById("prod-category").value;
        const pid = document.getElementById("prod-id").value || title.replace(/[^a-z0-9]/gi, "-").toLowerCase();
        const auth = document.getElementById("prod-author").value;
        const headImg = document.getElementById("prod-img").value || "default.png";
        const vars = { category: cat, post_id: pid, back_link: "#", author: auth, header_image: headImg };
        for (const k in vars) template = template.replace(new RegExp("{{" + k + "}}", "g"), vars[k]);
        log("BUILDING: PRODUCTION TEMPLATE.", "#FFD700");
    } else {
        template = document.getElementById("inp-template").innerHTML;
        log("BUILDING: BETA TEMPLATE.", "#0F0");
    }

    let result = template
        .replace(/{{title}}/g, title)
        .replace(/{{date}}/g, dateStr)
        .replace(/{{AI}}/g, bodyContent)
        .replace(/{{author}}/g, document.getElementById("prod-author").value || "AI Writer");

    assets.forEach(function(a) {
        if (!a.base64) return;
        const media = a.type === "video"
            ? '<div class="media-container"><video src="' + a.base64 + '" style="width:100%;max-height:600px;" controls></video><div class="media-caption">' + a.label + '</div></div>'
            : '<div class="media-container"><img src="' + a.base64 + '" style="width:100%;max-height:600px;" alt="' + a.label + '"><div class="media-caption">' + a.label + '</div></div>';
        result = result.replace(a.tag, media);
    });

    return result;
}

// --- 6. PREVIEW ---
function refreshPreview() {
    const html = compileHTML();
    const frame = document.getElementById("preview-frame");
    if (frame) frame.src = "data:text/html;charset=utf-8," + encodeURIComponent(stripScripts(html));
    log("Preview refreshed.", "log-new");
}

function openPreviewInTab() {
    const html = compileHTML();
    const blob = new Blob([html], {type: "text/html"});
    window.open(URL.createObjectURL(blob), "_blank");
}

// --- 7. ASSET MANAGER ---
async function addAsset() {
    const fi = document.getElementById("media-file");
    const f = fi ? fi.files[0] : null;
    const label = document.getElementById("media-label").value;
    if (!f || !label) { log("Missing file or label.", "log-err"); return; }
    log("Encoding asset...", "log-warn");
    try {
        const b64 = await toBase64(f);
        const tag = "{{media_" + (assets.length + 1) + "}}";
        assets.push({ tag: tag, label: label, base64: b64, type: f.type.startsWith("video") ? "video" : "img" });
        renderAssets();
        log("Asset Added: " + tag, "log-new");
        fi.value = "";
        document.getElementById("media-label").value = "";
    } catch(e) { log("Encoding Failed: " + e.message, "log-err"); }
}

function renderAssets() {
    const list = document.getElementById("asset-list");
    list.innerHTML = "";
    assets.forEach(function(a, i) {
        list.innerHTML += '<div class="asset-item"><span><strong>' + a.tag + '</strong>: ' + a.label + '</span><span style="color:#f85149;cursor:pointer;" onclick="deleteAsset(' + i + ')">[X]</span></div>';
    });
}

function deleteAsset(i) { assets.splice(i, 1); renderAssets(); }

function toBase64(f) {
    return new Promise(function(res, rej) {
        const rd = new FileReader();
        rd.readAsDataURL(f);
        rd.onload = function() { res(rd.result); };
        rd.onerror = function(e) { rej(e); };
    });
}

// --- 8. DATABASE ---
function initDB() {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = function(e) {
        db = e.target.result;
        if (!db.objectStoreNames.contains("projects"))
            db.createObjectStore("projects", {keyPath: "title"});
    };
    r.onsuccess = function(e) {
        db = e.target.result;
        document.getElementById("storage-stat").innerText = "STORAGE: INDEXED_DB (READY)";
        log("DB Connected.", "log-new");
        loadProjects();
    };
}

function saveProject() {
    const t = document.getElementById("inp-title").value;
    const c = document.getElementById("inp-content").value;
    if (!t) { alert("Title Required"); return; }
    const tx = db.transaction("projects", "readwrite");
    tx.objectStore("projects").put({title: t, content: c, date: new Date().toLocaleString(), assets: assets});
    tx.oncomplete = function() { log("Saved Locally.", "log-new"); };
    loadProjects();
}

function loadProjects() {
    const l = document.getElementById("saved-list");
    if (!l) return;
    l.innerHTML = "";
    const tx = db.transaction("projects", "readonly");
    tx.objectStore("projects").openCursor().onsuccess = function(e) {
        const c = e.target.result;
        if (c) {
            const d = c.value;
            const s = d.title.replace(/'/g, "\\'");
            l.innerHTML += '<div class="project-item"><span onclick="loadOne(\'' + s + '\')">' + d.title + '</span><span class="del-proj" onclick="deleteProj(\'' + s + '\')">X</span></div>';
            c.continue();
        }
    };
}

function loadOne(t) {
    db.transaction("projects", "readonly").objectStore("projects").get(t).onsuccess = function(e) {
        const d = e.target.result;
        document.getElementById("inp-title").value = d.title;
        document.getElementById("inp-content").value = d.content;
        assets = d.assets || [];
        renderAssets();
        setTab("editor");
        log("Project Loaded.", "log-new");
    };
}

function deleteProj(t) {
    if (confirm("Delete?")) {
        db.transaction("projects", "readwrite").objectStore("projects").delete(t).oncomplete = function() { loadProjects(); };
    }
}

// --- 9. AI GENERATION ---
const WORKER_URL = "https://thomas-chat.tmcarleton11.workers.dev";

// Free web search via DuckDuckGo + Wikipedia (no API keys required)
async function searchWeb(query) {
    var parts = [];

    // Source 1: DuckDuckGo Instant Answers
    try {
        var ddgUrl = "https://api.duckduckgo.com/?q=" + encodeURIComponent(query) + "&format=json&no_html=1&skip_disambig=1";
        var ddgRes = await fetch(ddgUrl);
        var ddg = await ddgRes.json();
        if (ddg.AbstractText) parts.push("DDG SUMMARY: " + ddg.AbstractText);
        if (ddg.Answer) parts.push("DDG ANSWER: " + ddg.Answer);
        if (ddg.Definition) parts.push("DDG DEFINITION: " + ddg.Definition);
    } catch(e) {}

    // Source 2: Wikipedia (OpenSearch + REST summary, both support CORS)
    try {
        // Try shorter query if full one returns nothing
        var searchTerms = [query];
        var separators = [" vs ", " vs ", " vs.", ":", " - ", " vs "];
        for (var si = 0; si < separators.length; si++) {
            var idx = query.indexOf(separators[si]);
            if (idx > 0) { searchTerms.push(query.substring(0, idx)); break; }
        }
        var wikiResult = null;
        for (var ti = 0; ti < searchTerms.length && !wikiResult; ti++) {
            var wikiSearch = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + encodeURIComponent(searchTerms[ti]) + "&limit=3&format=json&origin=*";
            var wsRes = await fetch(wikiSearch);
            var ws = await wsRes.json();
            if (ws && ws[1] && ws[1].length > 0) {
                var pageTitle = ws[1][0];
                var summaryUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(pageTitle);
                var suRes = await fetch(summaryUrl);
                if (suRes.ok) {
                    var su = await suRes.json();
                    if (su.extract && su.extract.length > 0) {
                        wikiResult = "WIKIPEDIA (" + (su.title || pageTitle) + "): " + su.extract.substring(0, 600);
                    }
                }
            }
        }
        if (wikiResult) parts.push(wikiResult);
    } catch(e) {}

    return parts.length > 0 ? parts.join("\n\n") : null;
}

async function generateAI() {
    const title = document.getElementById("inp-title").value;
    const prompt = document.getElementById("ai-prompt").value;
    const cur = document.getElementById("inp-content").value;
    const btn = document.querySelector(".btn-ai");
    if (!title) { alert("Title Required"); return; }
    btn.innerText = "SEARCHING...";

    // Optional web search for current info
    var webContext = "";
    var webCheck = document.getElementById("web-search");
    if (webCheck && webCheck.checked) {
        log("Searching web for current info...", "log-warn");
        var searchQuery = title;
        if (prompt) searchQuery += " " + prompt;
        var result = await searchWeb(searchQuery);
        if (result) {
            webContext = "CURRENT WEB RESEARCH (up-to-date):\n" + result + "\n\n";
            log("Web search results obtained.", "log-new");
        } else {
            webContext = "WEB SEARCH: No current data found.\n\n";
            log("Web search returned no results.", "log-warn");
        }
    }

    btn.innerText = "THINKING...";
    const ctx = assets.map(function(a) { return "Insert " + a.tag + " for '" + a.label + "'"; }).join("\n");
    const msg = webContext + "Role: Tech Writer. Task: Write HTML body. Title: " + title + ". Request: " + prompt + ". Assets: " + ctx + ". Current: " + cur + ". Base your answer on the web research if available. Return HTML tags only.";
    try {
        const res = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [{ role: "user", content: msg }], temperature: 0.3 })
        });
        const data = await res.json();
        document.getElementById("inp-content").value = (data.content || data.answer || "").replace(/```html/g, "").replace(/```/g, "");
        log("AI Content Generated.", "log-new");
    } catch(e) { log("AI Error: " + e.message, "log-err"); }
    finally { btn.innerText = "[ \u2728 GENERATE ]"; }
}

// --- 10. EXPORT ---
function openExportMenu() { document.getElementById("export-modal").style.display = "flex"; }
function closeExportMenu() { document.getElementById("export-modal").style.display = "none"; }

async function doExport(type) {
    closeExportMenu();
    const title = document.getElementById("inp-title").value || "project";
    const html = compileHTML();
    const sn = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    if (type === "html") {
        const b = new Blob([html], {type: "text/html"});
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = sn + ".html";
        a.click();
        log("HTML exported.", "log-new");
    } else if (type === "pdf") {
        const b = new Blob([html], {type: "text/html"});
        const u = URL.createObjectURL(b);
        const w = window.open(u, "_blank");
        if (w) w.focus();
        setTimeout(function() { URL.revokeObjectURL(u); }, 30000);
        log("PDF: Cmd/Ctrl+P in new tab, select 'Save as PDF'.", "log-warn");
    } else if (type === "copy") {
        try {
            await navigator.clipboard.writeText(html);
            alert("Code Copied!");
            log("Content copied to clipboard.", "log-new");
        } catch(e) {
            const ta = document.createElement("textarea");
            ta.value = html;
            ta.style.cssText = "position:fixed;left:-9999px;opacity:0";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            alert("Code Copied!");
            log("Content copied to clipboard.", "log-new");
        }
    }
}

// --- UTILS ---
function log(msg, cls) {
    const div = document.createElement("div");
    div.className = cls || "";
    div.innerText = "> " + msg;
    document.getElementById("system-log").prepend(div);
}