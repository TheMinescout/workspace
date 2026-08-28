/* 
    AI WRITER SUITE LOGIC v41.0 
    - Fixes "Sad Tab" Crash by stripping scripts from Blob Previews
    - Optimized Base64 handling
*/

// --- 1. GLOBAL VARIABLES ---
let assets = [];
let currentUser = null;
let adminMode = false;
let currentMode = 'raw';

const DB_NAME = "MinescoutDB_v30";
const STORE_NAME = "projects";
let db;

// --- 2. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initDB();
    loadLibrary(); 
    
    // Firebase Auth Listener
    if (typeof firebase !== 'undefined') {
        firebase.auth().onAuthStateChanged((user) => {
            currentUser = user;
            const badge = document.getElementById('auth-status');
            if(user) {
                const name = user.email.split('@')[0].toUpperCase();
                badge.innerText = `USER: ${name}`;
                badge.style.background = "#004400";
            } else {
                badge.innerText = "GUEST MODE (READ ONLY)";
                badge.style.background = "#333";
            }
        });
    }

    // Char Count Listener
    const inputContent = document.getElementById('inp-content');
    if(inputContent) {
        inputContent.addEventListener('input', (e) => {
            document.getElementById('char-count').innerText = e.target.value.length + " CHARS";
        });
        // Default text if empty
        if(!inputContent.value) inputContent.value = "<!-- AI Content will appear here -->";
    }

});

// --- 3. ADMIN LOGIC ---
function checkAdminCode() {
    const code = document.getElementById('admin-code').value;
    const fields = document.querySelector('.admin-fields');
    
    if (code === "TheMinescout") { 
        fields.classList.add('admin-active'); 
        adminMode = true; 
        log("ADMIN ACCESS GRANTED.", "log-warn"); 
    } else { 
        fields.classList.remove('admin-active'); 
        adminMode = false; 
    }
}

// --- 4. TAB SYSTEM ---
function setTab(name) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const targetIndex = ['editor','assets','library','logs'].indexOf(name);
    if(targetIndex > -1) tabs[targetIndex].classList.add('active');
    
    document.getElementById(`panel-${name}`).classList.add('active');
}

function switchTab(mode) { 
    syncContent(); 
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); 
    document.getElementById(`tab-${mode}`).classList.add('active'); 
    
    document.getElementById('inp-content').style.display = 'none'; 
    document.getElementById('view-visual').style.display = 'none'; 
    document.getElementById('view-fancy').style.display = 'none'; 
    
    if (mode === 'raw') {
        document.getElementById('inp-content').style.display = 'block'; 
    } 
    else if (mode === 'visual') {
        document.getElementById('view-visual').style.display = 'block'; 
        document.getElementById('view-visual').innerHTML = document.getElementById('inp-content').value;
    } 
    else if (mode === 'fancy') {
        document.getElementById('view-fancy').style.display = 'block'; 
        renderFancy();
    } 
    currentMode = mode; 
}

function syncContent() { 
    const r = document.getElementById('inp-content');
    const v = document.getElementById('view-visual'); 
    if(!r || !v) return;
    if (currentMode === 'visual') {
        r.value = v.innerHTML; 
    }
}

function renderFancy() { 
    let c = document.getElementById('inp-content').value; 
    c = c.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
         .replace(/(&lt;\/?[a-z0-9]+)(.*?)(\/?&gt;)/gi, '<span class="tag-name">$1</span>$2<span class="tag-name">$3</span>'); 
    document.getElementById('view-fancy').innerHTML = c; 
}

// --- 5. COMPILATION & BLOB PREVIEW ---

// HELPER: Strip Scripts for Safe Preview
function stripScripts(html) {
    // Removes script tags to prevent recursion crashes in Blob
    return html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
               .replace(/\[\[SCRIPT[\s\S]*?\[\[CLOSE_SCRIPT\]\]/g, "");
}

function startCompilation() {
    syncContent();
    const title = document.getElementById('inp-title').value || "Untitled";
    const bodyContent = document.getElementById('inp-content').value;
    
    let previewTemplate = "";
    let downloadTemplate = "";
    
    // A. SELECT TEMPLATE
    if (adminMode) {
        const prodSource = document.getElementById('prod-template').innerHTML;
        
        // Decode for Download
        const txt = document.createElement('textarea');
        txt.innerHTML = prodSource;
        let decoded = txt.value.replace(/\[\[SCRIPT/g, '<script').replace(/\[\[CLOSE_SCRIPT\]\]/g, '</script>');
        
        downloadTemplate = decoded;
        // For preview, we use the RAW source but we will STRIP scripts later
        previewTemplate = decoded; 

        // Vars
        const cat = document.getElementById('prod-category').value;
        const pid = document.getElementById('prod-id').value || title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        const auth = document.getElementById('prod-author').value;
        const headImg = document.getElementById('prod-img').value || "default.png";
        
        const catMap = { "Tech Tips": "pages/tech-tips", "Coding Projects": "pages/coding-projects", "Updates": "pages/updates", "Puppy Life": "pages/puppy-life", "Minecraft Server": "pages/minecraft-server", "Beta": "beta", "General": "../index" };
        const backUrl = `../../${catMap[cat] || 'index'}`;

        const vars = { category: cat, post_id: pid, back_link: backUrl, author: auth, header_image: headImg };
        for (let key in vars) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            downloadTemplate = downloadTemplate.replace(regex, vars[key]);
            previewTemplate = previewTemplate.replace(regex, vars[key]);
        }
        log("BUILDING: PRODUCTION READY CODE.", "#FFD700");
    } else {
        const stdSource = `<!DOCTYPE html><html><head><title>{{title}}</title><link rel="stylesheet" href="assets/css/style.css"><style>body{background:#111;color:#eee;font-family:sans-serif;padding:20px;max-width:800px;margin:0 auto;}img,video{max-width:100%;}</style></head><body><h1>{{title}}</h1>{{AI}}</body></html>`;
        downloadTemplate = stdSource;
        previewTemplate = stdSource;
        log("BUILDING: BETA STANDALONE CODE.", "#0F0");
    }
    
    const dateStr = new Date().toLocaleDateString();
    
    // B. PREPARE PREVIEW (STRIP SCRIPTS & ADD BASE)
    const baseTag = `<base href="${window.location.origin}/">`;
    previewTemplate = stripScripts(previewTemplate); // CRITICAL CRASH FIX
    previewTemplate = previewTemplate.replace("<head>", `<head>${baseTag}`);
    
    [downloadTemplate, previewTemplate].forEach((tpl, i) => {
        let res = tpl.replace(/{{title}}/g, title)
                     .replace(/{{date}}/g, dateStr)
                     .replace(/{{AI}}/g, bodyContent);
        
        if (i === 0) downloadTemplate = res;
        else previewTemplate = res;
    });

    // C. INJECT ASSETS
    let used = 0;
    assets.forEach((asset) => {
        let mediaHtml = "";
        const widthStyle = asset.width || "100%"; 
        
        if (asset.base64) {
            if (asset.type === 'video') {
                mediaHtml = `<div class="media-container"><video src="${asset.base64}" style="width:${widthStyle}; max-height:600px;" controls loop muted playsinline></video><div class="media-caption">${asset.label}</div></div>`;
            } else {
                mediaHtml = `<div class="media-container"><img src="${asset.base64}" style="width:${widthStyle}; max-height:600px;" alt="${asset.label}"><div class="media-caption">${asset.label}</div></div>`;
            }
            
            // Preview Injection
            if(previewTemplate.includes(asset.tag)) previewTemplate = previewTemplate.replace(asset.tag, mediaHtml);
            else previewTemplate = previewTemplate.replace("</div>", `${mediaHtml}</div>`);

            // Download Injection
            if(downloadTemplate.includes(asset.tag)) downloadTemplate = downloadTemplate.replace(asset.tag, mediaHtml);
            else {
                if (downloadTemplate.includes('</article>')) downloadTemplate = downloadTemplate.replace("</article>", `${mediaHtml}</article>`);
                else if (downloadTemplate.includes('</body>')) downloadTemplate = downloadTemplate.replace("</body>", `${mediaHtml}</body>`);
            }
            used++;
        }
    });

    // D. CREATE BLOBS
    const blobPrev = new Blob([previewTemplate], { type: 'text/html' });
    
    // Revoke old blob to save memory
    if(window.globalPreviewBlob) URL.revokeObjectURL(window.globalPreviewBlob);
    window.globalPreviewBlob = URL.createObjectURL(blobPrev);

    const blobDown = new Blob([downloadTemplate], { type: 'text/html' });
    if(window.globalDownloadBlob) URL.revokeObjectURL(window.globalDownloadBlob);
    window.globalDownloadBlob = URL.createObjectURL(blobDown);
    
    log(`COMPILED. ${used} Assets inserted.`, "#0F0");
}

function openCurrentInNewTab() {
    // Trigger compilation first to ensure blob exists
    startCompilation();
    setTimeout(() => {
        if(window.globalPreviewBlob) {
            window.open(window.globalPreviewBlob, '_blank');
            log("Opened in New Tab.", "log-new");
        } else {
            log("Error: Blob not ready.", "log-err");
        }
    }, 500); // Short delay to let Blob generate
}

function openExportMenu() { document.getElementById('export-modal').style.display='flex'; }
function closeExportMenu() { document.getElementById('export-modal').style.display='none'; }

function doExport(type) {
    if (!window.globalDownloadBlob) { startCompilation(); }

    setTimeout(() => {
        const title = document.getElementById('inp-title').value || "project";
        
        if (type === 'html') {
            const a = document.createElement('a');
            a.href = window.globalDownloadBlob;
            a.download = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".html";
            a.click();
        } 
        else if (type === 'copy' || type === 'txt') {
            const reader = new FileReader();
            reader.onload = function() {
                const result = reader.result;
                if (type === 'copy') {
                    navigator.clipboard.writeText(result);
                    alert("Code Copied!");
                } else {
                    const blobTxt = new Blob([result], {type: "text/plain"});
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blobTxt);
                    a.download = title + ".txt";
                    a.click();
                }
            };
            reader.readAsText(window.globalDownloadBlob);
        }
        closeExportMenu();
    }, 500);
}


// --- 6. ASSET MANAGER ---
async function addAsset() {
    const file = document.getElementById('media-file').files[0];
    const label = document.getElementById('media-label').value;
    if(!file || !label) { log("Missing file or label.", "log-err"); return; }
    
    log("Encoding asset...", "log-warn");
    try {
        const b64 = await toBase64(file);
        const tag = `{{media_${assets.length + 1}}}`;
        assets.push({ tag, label, b64, type: file.type.startsWith('video') ? 'video' : 'img' });
        renderAssets();
        log(`Asset Added: ${tag}`, "log-new");
        document.getElementById('media-file').value = "";
    } catch(e) { log("Encoding Failed", "log-err"); }
}

function renderAssets() {
    const list = document.getElementById('asset-list');
    list.innerHTML = "";
    assets.forEach((a, i) => {
        list.innerHTML += `<div class="asset-item"><span><strong>${a.tag}</strong>: ${a.label}</span><span style="color:red; cursor:pointer;" onclick="deleteAsset(${i})">[X]</span></div>`;
    });
}
function deleteAsset(i) { assets.splice(i, 1); renderAssets(); }

const toBase64 = f => new Promise((r,j)=>{const rd=new FileReader(); rd.readAsDataURL(f); rd.onload=()=>r(rd.result); rd.onerror=e=>j(e)});

// --- 7. DATABASE ---
function initDB() { 
    const r = indexedDB.open(DB_NAME, 1); 
    r.onupgradeneeded = e => { db = e.target.result; if(!db.objectStoreNames.contains('projects')) db.createObjectStore('projects', {keyPath:"title"}); }; 
    r.onsuccess = e => { db = e.target.result; document.getElementById('storage-stat').innerText = "STORAGE: INDEXED_DB (READY)"; log("DB Connected.", "log-new"); loadProjects(); }; 
}
function saveProject() {
    const t = document.getElementById('inp-title').value;
    const c = document.getElementById('inp-content').value;
    if(!t) { alert("Title Required"); return; }
    const tx = db.transaction("projects", "readwrite");
    tx.objectStore("projects").put({title:t, content:c, date: new Date().toLocaleString(), assets: assets});
    tx.oncomplete = () => log("Saved Locally.", "log-new");
    loadProjects();
}
function loadProjects() {
    const l = document.getElementById('saved-list'); l.innerHTML = "";
    const tx = db.transaction("projects", "readonly");
    tx.objectStore("projects").openCursor().onsuccess = e => {
        const c = e.target.result;
        if(c) {
            const d = c.value;
            l.innerHTML += `<div class="project-item"><span onclick="loadOne('${d.title}')">${d.title}</span><span class="del-proj" onclick="deleteProj('${d.title}')">X</span></div>`;
            c.continue();
        }
    };
}
function loadOne(t) {
    db.transaction("projects", "readonly").objectStore("projects").get(t).onsuccess = e => {
        const d = e.target.result;
        document.getElementById('inp-title').value = d.title;
        document.getElementById('inp-content').value = d.content;
        assets = d.assets || [];
        renderAssets();
        setTab('editor');
        log("Project Loaded.", "log-new");
    };
}
function deleteProj(t) { if(confirm("Delete?")) { db.transaction("projects", "readwrite").objectStore("projects").delete(t).oncomplete = () => loadProjects(); } }

// --- 8. AI GEN ---
async function generateAI() {
    const title = document.getElementById('inp-title').value;
    const prompt = document.getElementById('ai-prompt').value;
    const current = document.getElementById('inp-content').value;
    const btn = document.querySelector('.btn-ai');
    if(!title) { alert("Title Required"); return; }
    btn.innerText = "THINKING...";
    let assetCtx = assets.map(a => `Insert ${a.tag} for "${a.label}"`).join("\n");
    const fullPrompt = `Role: Tech Writer. Task: Write HTML body. Title: ${title}. Request: ${prompt}. Assets: ${assetCtx}. Current: ${current}. Return HTML tags only.`;
    try {
        const res = await puter.ai.chat(fullPrompt);
        document.getElementById('inp-content').value = res.message?.content.replace(/```html/g,"").replace(/```/g,"") || res;
        log("AI Content Generated.", "log-new");
    } catch(e) { log("AI Error", "log-err"); }
    finally { btn.innerText = "[ ✨ GENERATE ]"; }
}

// --- 9. COMMUNITY ---
function loadLibrary() {
    const grid = document.getElementById('lib-grid');
    firebase.database().ref('community_posts').limitToLast(20).once('value').then(snap => {
        grid.innerHTML = "";
        if(!snap.exists()) { grid.innerHTML = "<div style='color:#555'>No posts yet.</div>"; return; }
        const posts = [];
        snap.forEach(c => posts.push(c.val()));
        posts.reverse();
        posts.forEach(p => {
            const json = encodeURIComponent(JSON.stringify(p));
            grid.innerHTML += `<div class="lib-card" onclick="viewShared('${json}')"><div class="lib-title">${p.title}</div><div class="lib-meta">AUTHOR: ${p.author}</div></div>`;
        });
    });
}
function viewShared(jsonStr) {
    const p = JSON.parse(decodeURIComponent(jsonStr));
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${p.title}</title><style>body{background:#000;color:#0F0;font-family:'Courier New',monospace;padding:40px;line-height:1.6;}.container{max-width:800px;margin:0 auto;border:1px solid #0F0;padding:20px;}h1{color:#0FF;border-bottom:1px dashed #0F0;padding-bottom:10px;}a{color:#0F0;}</style></head><body><div class="container"><h1>${p.title}</h1><div>${p.content}</div><div style="margin-top:50px;border-top:1px dashed #0F0;padding-top:10px;text-align:center;">GENERATED BY MINESCOUT AI</div></div></body></html>`;
    const blob = new Blob([html], {type: "text/html"});
    window.open(URL.createObjectURL(blob), '_blank');
}
async function publishToCommunity() {
    if(!currentUser) { alert("Login Required"); return; }
    const t = document.getElementById('inp-title').value;
    const c = document.getElementById('inp-content').value;
    if(!t || !c) return;
    const check = await puter.ai.chat(`Is safe? "${c}" Reply SAFE/UNSAFE.`);
    if(check.message?.content.includes("UNSAFE")) { alert("Unsafe Content"); return; }
    firebase.database().ref('community_posts').push({
        title: t, author: currentUser.email.split('@')[0], uid: currentUser.uid, content: c, date: new Date().toISOString()
    });
    alert("Published!"); loadLibrary();
}

// --- UTILS ---
function log(msg, cls) {
    const div = document.createElement('div');
    div.className = cls || "";
    div.innerText = `> ${msg}`;
    document.getElementById('system-log').prepend(div);
}

