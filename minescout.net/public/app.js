// app.js — Application Logic & Routing

import { views } from './views.js?v=2';

// ── 1. SIDEBAR CONFIGURATION ──────────────────────────────────────
const MAIN_MENU = [
  { label: 'Home',   href: '/' },
  { label: 'Work',   href: '/work' },
  { label: 'Blog',   href: '/blog' },
  { label: 'Resume', href: '/resume' },
  { label: 'About',  href: '/about' }
];

const MAIN_SECONDARY = [
  { label: 'AI Services', href: '/ai' },
  { label: 'Contact',     href: '/contact' },
  { label: 'Guestbook',   href: '/guestbook' },
  { label: 'Now',         href: '/now' },
  { label: 'Ask',         href: '/ask' }
];

const AI_MENU = [
  { label: 'Overview',       href: '/ai' },
  { label: 'Pricing',        href: '/ai/pricing' },
  { label: 'Client Work',    href: '/ai/clients' },
  { label: 'The Process',    href: '/ai/process' },
  { label: 'Live Demo',      href: '/ai/demo/' }, 
  { label: 'Tools I Use',    href: '/ai/tools' },
  { label: 'ROI Calculator', href: '/ai/roi' }
];

const AI_SECONDARY = [
  { label: 'Enquire',      href: '/ai/intake' },
  { label: 'Legal',        href: '/ai/legal' },
  { label: 'Portfolio',    href: '/' },
  { label: 'Ask AI',       href: '/ask' },
  { label: 'Client Portal',href: '/portal' },
];

let sidebarNav, sidebarSecondary, ownerText, aside, overlay, hamBtn;

function buildLinks(links, currentPath) {
  return links.map(link => {
    let isActive = false;
    if (link.href === '/' && currentPath === '/') isActive = true;
    else if (link.href === '/ai' && (currentPath === '/ai' || currentPath === '/ai/')) isActive = true;
    else if (link.href !== '/' && link.href !== '/ai' && currentPath.startsWith(link.href)) isActive = true;

    const activeClass = isActive ? ' class="active"' : '';
    return `<a href="${link.href}"${activeClass}>${link.label}</a>`;
  }).join('\n');
}

function updateSidebarNav(path) {
  if (!sidebarNav || !sidebarSecondary) return;
  const isAiSite = path.startsWith('/ai') || path.startsWith('/hq') || path === '/legal' || path === '/portal';
  
  sidebarNav.innerHTML = buildLinks(isAiSite ? AI_MENU : MAIN_MENU, path);
  sidebarSecondary.innerHTML = buildLinks(isAiSite ? AI_SECONDARY : MAIN_SECONDARY, path);

  const owner = isAiSite ? 'Minescout AI' : 'Thomas Carleton';
  ownerText.textContent = `\u00A9 ${new Date().getFullYear()} ${owner}`;
}

function closeSidebarNav() {
  if(aside) aside.classList.remove('open');
  if(hamBtn) hamBtn.classList.remove('open');
  if(overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function initSidebar() {
  overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  
  aside = document.createElement('aside');
  aside.className = 'sidebar';
  aside.innerHTML = `
    <div class="sidebar-header">
      <div class="sidebar-logo-wrap">
        <img src="/assets/favicon.png" alt="TC" class="sidebar-logo" />
        <div>
          <div class="sidebar-name">Thomas Carleton</div>
          <div class="sidebar-tagline">minescout.net</div>
        </div>
      </div>
      <button class="hamburger" id="hamburger" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
    </div>
    <nav class="sidebar-nav" id="sidebar-nav"></nav>
    <div class="sidebar-spacer"></div>
    <div class="sidebar-secondary" id="sidebar-secondary"></div>
    <div class="sidebar-bottom" id="copyright"></div>
  `;

  document.body.insertBefore(aside, document.body.firstChild);
  document.body.insertBefore(overlay, document.body.firstChild);

  sidebarNav = document.getElementById('sidebar-nav');
  sidebarSecondary = document.getElementById('sidebar-secondary');
  ownerText = document.getElementById('copyright');
  hamBtn = aside.querySelector('#hamburger');

  if (hamBtn) {
    hamBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (aside.classList.contains('open')) {
        closeSidebarNav();
      } else {
        aside.classList.add('open');
        hamBtn.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  overlay.onclick = closeSidebarNav;
  window.addEventListener('resize', () => { if (window.innerWidth > 768) closeSidebarNav(); });
}

// ── 2. PAGE INITIALIZERS ────────────────────────────────────────

let fbDb = null;
let askKnowledgeBase = "";
let askHistory = [];

async function initAskChat() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const badge = document.getElementById('status-badge');
  const chatWin = document.getElementById('chat-window');
  if (!input) return;

  if (askHistory.length > 0) {
    const emptyState = document.getElementById('chat-empty');
    if (emptyState) emptyState.remove();
    askHistory.forEach(msg => addMessage(msg.role, msg.content, chatWin));
  }

  if (fbDb) {
    input.disabled = false; sendBtn.disabled = false;
    input.placeholder = "Ask about FRC, Minescout AI, Eagle Scout...";
    badge.innerText = "● System Online (Context Synced)";
    badge.className = "status-badge status-online";
    setupChatListeners(input, sendBtn, chatWin);
    return;
  }

  askKnowledgeBase = `STRICT SYSTEM ROLE: You are the AI Assistant representing Thomas Carleton and Minescout AI.
Your ONLY truth is the live context provided below. If a user asks about a project, service, or stat that is NOT in this text, say you don't have that information.
Identity: Speak as an extension of Thomas/Minescout. Be highly professional, technical, and concise. Do NOT hallucinate skills or metrics.

CRITICAL PRICING & AVAILABILITY RULES:
- Digital Remodel: $499 setup + $29/mo (or $0/mo self-hosted).
- Full AI Upgrade: $749 setup + $59/mo.
- Charter Partner: $0 setup, $0/mo (Free). Requires a signed testimonial and 12 months of feedback. Exactly 3 spots are currently available.

LIVE SCRAPED CONTEXT:\n`;

  try {
    const { getApp, getApps, initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    const { getFirestore, collection, getDocs, query, where } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

    const firebaseConfig = {
      apiKey: "AIzaSyAmZbRI37rbHWGaOSVomMdcG-IvHMf6S3Y",
      authDomain: "minescout-5533a.firebaseapp.com",
      projectId: "minescout-5533a",
      storageBucket: "minescout-5533a.firebasestorage.app",
      messagingSenderId: "639262143843",
      appId: "1:639262143843:web:4fe407d3b15a4c885a8f56",
      measurementId: "G-VD5NNWE1MK"
    };
    
    const fbApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    fbDb = getFirestore(fbApp);
    const CLIENT_ID = '5mAIDPwf9kNmNTk3pAQPDfIP9Z93';

    async function scrapePageText(path, label) {
      try {
        let html = views[path] ? views[path] : "";
        if (!html) return "";
        const doc = new DOMParser().parseFromString(html, 'text/html');
        doc.querySelectorAll('script, style, nav, footer, iframe').forEach(el => el.remove());
        const mainContent = doc.querySelector('main') || doc.body;
        let cleanText = mainContent.textContent.replace(/\s+/g, ' ').trim();
        return `\n--- SOURCE: ${label} (${path}) ---\n${cleanText.substring(0, 3500)}\n`;
      } catch (e) { return ""; }
    }

    const results = await Promise.allSettled([
      scrapePageText('/resume', 'RESUME & EXPERIENCE'),
      scrapePageText('/ai', 'MINESCOUT AI PLATFORM'),
      scrapePageText('/', 'PORTFOLIO & WORK'),
      getDocs(query(collection(fbDb, 'clients', CLIENT_ID, 'corrections'), where('status', '==', 'applied'))),
      getDocs(collection(fbDb, 'clients', CLIENT_ID, 'faqs'))
    ]);

    if (results[0].status === 'fulfilled') askKnowledgeBase += results[0].value;
    if (results[1].status === 'fulfilled') askKnowledgeBase += results[1].value;
    if (results[2].status === 'fulfilled') askKnowledgeBase += results[2].value;
    if (results[3].status === 'fulfilled') results[3].value.forEach(d => { askKnowledgeBase += `\nFACT OVERRIDE: ${d.data().question} -> ${d.data().correction}`; });
    if (results[4].status === 'fulfilled') results[4].value.forEach(d => { askKnowledgeBase += `\nFAQ OVERRIDE: ${d.data().question} -> ${d.data().answer}`; });

    if (input) {
      input.disabled = false; 
      sendBtn.disabled = false;
      input.placeholder = "Ask about FRC, Minescout AI, Eagle Scout...";
      badge.innerText = "● System Online (Context Synced)"; 
      badge.className = "status-badge status-online";
      setupChatListeners(input, sendBtn, chatWin);
    }
  } catch(e) { console.error("KB Error:", e); }
}

function setupChatListeners(input, sendBtn, chatWin) {
  window.sendMessage = async function() {
    const text = input.value.trim();
    if (!text || sendBtn.disabled) return;

    const emptyState = document.getElementById('chat-empty');
    if (emptyState) emptyState.remove();

    addMessage('user', text, chatWin);
    askHistory.push({ role: 'user', content: text });
    input.value = ''; sendBtn.disabled = true;

    const typing = addTyping(chatWin);
    try {
      const res = await fetch('https://thomas-chat.tmcarleton11.workers.dev', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: askHistory, client_id: '5mAIDPwf9kNmNTk3pAQPDfIP9Z93', system_override: askKnowledgeBase, temperature: 0.1 })
      });
      const data = await res.json();
      typing.remove();
      
      const responseText = data.content || '';
      const msgEl = addMessage('assistant', '', chatWin);
      const bubble = msgEl.querySelector('.msg-bubble');
      
      let currentHTML = '';
      for (let i = 0; i < responseText.length; i++) {
        currentHTML += responseText[i] === '\n' ? '<br/>' : responseText[i];
        bubble.innerHTML = currentHTML;
        chatWin.scrollTop = chatWin.scrollHeight;
        await new Promise(r => setTimeout(r, 5)); 
      }
      
      askHistory.push({ role: 'assistant', content: responseText });
    } catch(err) {
      typing.remove();
      addMessage('assistant', 'Network disruption. Unable to reach Minescout Edge Worker.', chatWin);
    }
    sendBtn.disabled = false; input.focus();
  };
  input.onkeydown = function(e) { if (e.key === 'Enter') window.sendMessage(); };
}

function addMessage(role, text, chatWin) {
  const msg = document.createElement('div'); msg.className = `msg ${role}`;
  const cleanText = text.replace(/\n/g, '<br/>');
  msg.innerHTML = `<div class="msg-bubble">${cleanText}</div>`;
  chatWin.appendChild(msg); chatWin.scrollTop = chatWin.scrollHeight;
  return msg;
}

function addTyping(chatWin) {
  const wrap = document.createElement('div'); wrap.className = 'msg assistant';
  wrap.innerHTML = `<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  chatWin.appendChild(wrap); chatWin.scrollTop = chatWin.scrollHeight;
  return wrap;
}

async function initGuestbook() {
  try {
    const { getApp, getApps, initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
    const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, orderBy, query, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

    const firebaseConfig = {
      apiKey: "AIzaSyAmZbRI37rbHWGaOSVomMdcG-IvHMf6S3Y",
      authDomain: "minescout-5533a.firebaseapp.com",
      projectId: "minescout-5533a",
    };
    const fbApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const gbDb = getFirestore(fbApp);

    function esc(str) { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

    async function loadEntries() {
      const container = document.getElementById('gb-entries');
      if (!container) return; 
      const q = query(collection(gbDb, 'guestbook'), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      if (snap.empty) { container.innerHTML = '<p class="gb-empty">No entries yet — be the first!</p>'; return; }
      container.innerHTML = '';
      snap.forEach(docSnap => {
        const d = docSnap.data();
        const date = d.timestamp?.toDate ? d.timestamp.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now';
        const entry = document.createElement('div'); entry.className = 'gb-entry';
        entry.innerHTML = `
          <div class="gb-entry-main">
            <div class="gb-entry-name">${esc(d.name)}${d.location ? ' · <span style="font-weight:300;color:var(--muted)">' + esc(d.location) + '</span>' : ''}</div>
            <div class="gb-entry-date">${date}</div>
            <div class="gb-entry-message">${esc(d.message)}</div>
          </div>
          <button class="gb-delete" title="Delete entry" onclick="window._deleteEntry('${docSnap.id}', this)">✕</button>
        `;
        container.appendChild(entry);
      });
    }

    const submitBtn = document.getElementById('gb-submit');
    if(submitBtn) {
      submitBtn.onclick = async () => {
        const name = document.getElementById('gb-name').value.trim();
        const location = document.getElementById('gb-location').value.trim();
        const message = document.getElementById('gb-message').value.trim();
        if (!name || !message) return alert('Name and message required.');
        submitBtn.disabled = true; submitBtn.textContent = 'Posting...';
        try {
          await addDoc(collection(gbDb, 'guestbook'), { name, location, message, timestamp: serverTimestamp() });
          document.getElementById('gb-name').value = ''; document.getElementById('gb-location').value = ''; document.getElementById('gb-message').value = '';
          await loadEntries();
        } catch (err) { alert('Something went wrong.'); }
        submitBtn.disabled = false; submitBtn.textContent = 'Post to Guestbook';
      };
    }

    window._deleteEntry = async (id, btn) => {
      if (!confirm('Delete this entry?')) return;
      try { await deleteDoc(doc(gbDb, 'guestbook', id)); btn.closest('.gb-entry').remove(); }
      catch (err) { alert('Could not delete.'); }
    };

    const ADMIN_PIN = '1294';
    window.gbShowPin = () => { document.getElementById('admin-pin-wrap').classList.add('visible'); document.getElementById('admin-pin').focus(); };
    window.gbCheckPin = () => {
      if (document.getElementById('admin-pin').value === ADMIN_PIN) {
        document.getElementById('gb-wrap').classList.add('admin-mode');
        document.getElementById('admin-pin-wrap').classList.remove('visible');
      } else { alert('Incorrect PIN.'); document.getElementById('admin-pin').value = ''; }
    };
    const pinInput = document.getElementById('admin-pin');
    if(pinInput) pinInput.onkeydown = e => { if (e.key === 'Enter') window.gbCheckPin(); };

    loadEntries();
  } catch(e) { console.error("Guestbook Error:", e); }
}

function initHQ() {
  const WORKER_URL = "https://backend.tmcarleton11.workers.dev/"; 
  const MASTER_SITE_ID = "minescout_master_registry"; 
  
  let hqState = {
    isAuthed: false, adminKey: "", registry: { nodes: [] }, loading: false,
    showAddModal: false, newNode: { id: '', name: '', url: '', tier: 'Digital Remodel' }
  };

  function getTierClass(tier) {
    if (tier.includes('Charter')) return 'tier-charter';
    if (tier.includes('AI')) return 'tier-ai';
    return 'tier-classic';
  }

  function getTierPrice(tier) {
    if (tier.includes('Charter')) return '$0/mo';
    if (tier.includes('AI')) return '$59/mo';
    return '$29/mo';
  }

  function calculateMRR() {
    return hqState.registry.nodes.reduce((total, node) => {
      if (node.tier.includes('AI')) return total + 59;
      if (node.tier.includes('Remodel')) return total + 29;
      return total;
    }, 0);
  }

  window.hqAuth = async () => {
    hqState.loading = true; renderHQ();
    try {
      const res = await fetch(WORKER_URL, { headers: { 'X-Site-Id': MASTER_SITE_ID } });
      if (res.ok) {
        const data = await res.json();
        hqState.registry = (data && data.nodes) ? data : {
          nodes: [
            { id: "handmadebyjayme", name: "Jayme M. Carleton", url: "https://jaymecarleton.com", tier: "Charter Spot", lastSync: "2026-03-15" },
            { id: "smith_cole_legal", name: "Smith & Cole Legal", url: "https://smithcole.com", tier: "Full AI Upgrade", lastSync: "2026-03-10" }
          ]
        };
      } else {
        hqState.registry = { nodes: [{ id: "handmadebyjayme", name: "Jayme M. Carleton", url: "https://jaymecarleton.com", tier: "Charter Spot", lastSync: "2026-03-15" }] };
      }
      hqState.isAuthed = true;
    } catch (e) { alert("Could not connect to Edge Network."); }
    hqState.loading = false; renderHQ();
  };

  window.hqSaveRegistry = async (updated) => {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Site-Id': MASTER_SITE_ID },
      body: JSON.stringify({ key: hqState.adminKey, data: updated })
    });
    if (res.ok) {
      hqState.registry = updated; hqState.showAddModal = false;
      hqState.newNode = { id: '', name: '', url: '', tier: 'Digital Remodel' };
      renderHQ();
    } else { alert("Invalid Reason Key. Cannot save to Master Registry."); }
  };

  window.hqAddNode = () => {
    const updated = {
      nodes: [...hqState.registry.nodes, { 
        ...hqState.newNode, 
        id: hqState.newNode.id.toLowerCase().replace(/[^a-z0-9_]/g, ''),
        lastSync: new Date().toISOString().split('T')[0] 
      }]
    };
    window.hqSaveRegistry(updated);
  };

  window.hqRemoveNode = (index) => {
    if(!confirm("Are you sure you want to remove this node from the registry?")) return;
    const updated = { nodes: [...hqState.registry.nodes] };
    updated.nodes.splice(index, 1);
    window.hqSaveRegistry(updated);
  };

  window.hqToggleModal = (show) => { hqState.showAddModal = show; renderHQ(); };

  function renderHQ() {
    const root = document.getElementById('hq-root');
    if (!root) return;

    if (!hqState.isAuthed) {
      root.innerHTML = '<div class="hq-overlay"><div class="hq-modal-card" style="text-align: center">' +
        '<h2 style="font-family:var(--sans); font-weight:700; margin-bottom:2rem">MINESCOUT HQ</h2>' +
        '<div class="hq-input-group">' +
          '<input type="password" id="hq-key-input" placeholder="Master Key..." value="' + hqState.adminKey + '" style="text-align:center; font-size:1.2rem; letter-spacing:0.2em; padding:10px; border:1px solid #ccc; border-radius:4px;" />' +
        '</div>' +
        '<button class="hq-btn hq-primary" onclick="window.hqAuth()" style="width:100%; padding:15px; margin-top:10px;">' +
          (hqState.loading ? 'INITIALIZING...' : 'AUTHORIZE TERMINAL') +
        '</button></div></div>';
      
      const keyInput = document.getElementById('hq-key-input');
      keyInput.oninput = e => hqState.adminKey = e.target.value;
      keyInput.onkeydown = e => { if(e.key === 'Enter') window.hqAuth() };
      keyInput.focus();
      return;
    }

    const nodesHtml = hqState.registry.nodes.map((node, i) => 
      '<div class="hq-node-card">' +
        '<div class="hq-node-header">' +
          '<div><div class="hq-node-id">' + node.id + '</div><div class="hq-node-name">' + node.name + '</div></div>' +
          '<span class="hq-tier-badge ' + getTierClass(node.tier) + '">' + node.tier + '</span>' +
        '</div>' +
        '<div class="hq-node-details">' +
          '<div class="hq-detail-row"><span class="hq-detail-label">PROD_URL</span><span class="hq-detail-value hq-link"><a href="' + node.url + '" target="_blank">' + node.url.replace('https://', '') + '</a></span></div>' +
          '<div class="hq-detail-row"><span class="hq-detail-label">LAST_SYNC</span><span class="hq-detail-value">' + node.lastSync + '</span></div>' +
          '<div class="hq-detail-row"><span class="hq-detail-label">REVENUE</span><span class="hq-detail-value" style="color: #4caf82">' + getTierPrice(node.tier) + '</span></div>' +
        '</div>' +
        '<div class="hq-node-actions">' +
          '<a href="' + node.url + '#admin" target="_blank" class="hq-btn hq-primary">Open Backstage</a>' +
          '<button class="hq-btn hq-danger" onclick="window.hqRemoveNode(' + i + ')">Unlink</button>' +
        '</div>' +
      '</div>'
    ).join('');

    let modalHtml = '';
    if (hqState.showAddModal) {
      modalHtml = 
        '<div class="hq-overlay"><div class="hq-modal-card">' +
          '<h3 style="font-family:var(--sans); margin-bottom:2rem">Provision New Client</h3>' +
          '<div class="hq-input-group"><label>Minescout Site ID</label><input id="hq-new-id" value="' + hqState.newNode.id + '" placeholder="Lowercase, no spaces" /></div>' +
          '<div class="hq-input-group"><label>Client / Business Name</label><input id="hq-new-name" value="' + hqState.newNode.name + '" placeholder="Jane\'s Bakery LLC" /></div>' +
          '<div class="hq-input-group"><label>Production URL</label><input id="hq-new-url" value="' + hqState.newNode.url + '" placeholder="https://..." /></div>' +
          '<div class="hq-input-group"><label>Service Tier</label><select id="hq-new-tier">' +
            '<option value="Digital Remodel" ' + (hqState.newNode.tier === 'Digital Remodel' ? 'selected' : '') + '>Digital Remodel ($29/mo)</option>' +
            '<option value="Full AI Upgrade" ' + (hqState.newNode.tier === 'Full AI Upgrade' ? 'selected' : '') + '>Full AI Upgrade ($59/mo)</option>' +
            '<option value="Charter Spot" ' + (hqState.newNode.tier === 'Charter Spot' ? 'selected' : '') + '>Charter Spot ($0/mo - 1yr)</option>' +
          '</select></div>' +
          '<div style="display:flex; gap:10px; margin-top:2rem">' +
            '<button class="hq-btn" onclick="window.hqToggleModal(false)">Cancel</button>' +
            '<button class="hq-btn hq-primary" onclick="window.hqAddNode()">Provision Node</button>' +
          '</div>' +
        '</div></div>';
    }

    root.innerHTML = 
      '<div class="hq-terminal">' +
        '<header class="hq-header">' +
          '<div class="hq-brand"><h1><span class="hq-status-indicator"></span> MINESCOUT COMMAND</h1></div>' +
          '<div class="hq-stats-bar">' +
            '<div class="hq-stat-item"><span class="hq-stat-label">Active Nodes</span><span class="hq-stat-value">' + hqState.registry.nodes.length + '</span></div>' +
            '<div class="hq-stat-item"><span class="hq-stat-label">Projected MRR</span><span class="hq-stat-value" style="color:#4caf82">$' + calculateMRR() + '</span></div>' +
          '</div>' +
        '</header>' +
        '<div class="hq-node-grid">' + nodesHtml + '<button class="hq-add-node-btn" onclick="window.hqToggleModal(true)">+ PROVISION NEW NODE</button></div>' +
        modalHtml +
      '</div>';

    if(hqState.showAddModal) {
      document.getElementById('hq-new-id').oninput = e => hqState.newNode.id = e.target.value;
      document.getElementById('hq-new-name').oninput = e => hqState.newNode.name = e.target.value;
      document.getElementById('hq-new-url').oninput = e => hqState.newNode.url = e.target.value;
      document.getElementById('hq-new-tier').onchange = e => hqState.newNode.tier = e.target.value;
    }
  }
  renderHQ();
}

function initROI() {
  const CHAT_WORKER = 'https://thomas-chat.tmcarleton11.workers.dev/';

  window.calcROI = function() {
    const volEl = document.getElementById('volume');
    if (!volEl) return; 
    
    const vol = parseFloat(volEl.value) || 0;
    const time = parseFloat(document.getElementById('time').value) || 0;
    const traffic = parseFloat(document.getElementById('traffic').value) || 0;
    const val = parseFloat(document.getElementById('value').value) || 0;
    const cov = (parseFloat(document.getElementById('aiCoverage').value) || 80) / 100;
    
    const planEl = document.getElementById('plan');
    const monthlyCost = parseInt(planEl.value);
    const setupCost = parseInt(planEl.options[planEl.selectedIndex].getAttribute('data-setup'));

    const monthlyHours = (vol * time * 4.33) / 60; 
    const hourlyRate = 35; 
    const efficiencyValue = (monthlyHours * cov) * hourlyRate;

    const leadIncrease = traffic * 0.02; 
    const conversionToSale = 0.25; 
    const growthValue = leadIncrease * conversionToSale * val;

    const totalMonthlyImpact = efficiencyValue + growthValue;
    const net = totalMonthlyImpact - monthlyCost;
    const totalAnnualImpact = net * 12;
    const paybackMo = net > 0 ? (setupCost / net) : null;

    document.getElementById('hours-saved').innerText = (monthlyHours * cov).toFixed(1);
    document.getElementById('new-leads').innerText = (leadIncrease * conversionToSale).toFixed(1);
    document.getElementById('total-impact').innerText = '$' + Math.round(totalAnnualImpact).toLocaleString();
    
    const netEl = document.getElementById('netMonthly');
    netEl.innerText = net >= 0 ? '+$' + net.toFixed(0) : '-$' + Math.abs(net).toFixed(0);
    netEl.style.color = net >= 0 ? '#4caf82' : '#ff4d1c';

    if (paybackMo !== null) {
      document.getElementById('payback').innerText = paybackMo < 1 ? '< 1 mo' : paybackMo.toFixed(1) + ' mos';
    } else {
      document.getElementById('payback').innerText = 'Adjust';
    }

    const vt = document.getElementById('verdict-text');
    const aiBtn = document.getElementById('ai-verdict-btn');
    
    if(vt) vt.innerHTML = `<strong>Projected Net: ${net >= 0 ? '+$' : '-$'}${Math.abs(net).toFixed(0)}/month.</strong> Click below for a detailed AI analysis based on these specific numbers.`;
    
    if (aiBtn) {
      aiBtn.style.display = 'inline-block';
      aiBtn.textContent = "✨ Generate Custom AI Analysis";
    }
  };

  window.getAIVerdict = function() {
    const vt = document.getElementById('verdict-text');
    if (!vt) return;
    
    const vol = document.getElementById('volume').value;
    const traffic = document.getElementById('traffic').value;
    const val = document.getElementById('value').value;
    const planEl = document.getElementById('plan');
    const planName = planEl.options[planEl.selectedIndex].text;
    
    const netMonthly = document.getElementById('netMonthly').innerText;
    const hoursSaved = document.getElementById('hours-saved').innerText;
    const totalImpact = document.getElementById('total-impact').innerText;
    const payback = document.getElementById('payback').innerText;
    const isNegative = netMonthly.includes('-');

    const btn = document.getElementById('ai-verdict-btn');
    
    vt.innerHTML = '<span class="ai-loading">Consulting Minescout AI...</span>';
    btn.style.display = 'none';

    const prompt = `You are a Lead Architect and technical advisor for Minescout AI. A potential client just used our ROI calculator.
    
    Their Business Inputs:
    - Weekly inquiries: ${vol}
    - Monthly website visitors: ${traffic}
    - Value of a new customer: $${val}
    - Selected Plan: ${planName}
    
    Calculated Outcomes:
    - Projected Net Monthly Value: ${netMonthly}
    - Hours Saved per month: ${hoursSaved}
    - Annual Financial Impact: ${totalImpact}
    - Payback Period: ${payback}

    Write exactly 1 short paragraph analyzing these numbers. 
    CRITICAL INSTRUCTION: Be brutally honest and objective. Ensure your analysis perfectly aligns with the selected plan rules: 1. Digital Remodel ($499 + $29/mo), 2. Full AI Upgrade ($749 + $59/mo).
    If the "Projected Net Monthly Value" is negative (shows a loss), you MUST politely advise them that Minescout AI is NOT a good financial fit for them right now, explaining that their current traffic/inquiry volume doesn't justify the infrastructure cost yet. Tell them to wait until they scale.
    If the net value is positive, write a compelling summary of why they should upgrade, focusing on the financial ROI, payback period, and hours reclaimed. 
    Speak directly and professionally to the client ("you"). Do not use markdown headers or greetings. Make it candid and sharp.`;

    fetch(CHAT_WORKER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Please analyze my projected ROI honestly." }],
        system_override: prompt,
        temperature: 0.5 
      })
    })
    .then(res => res.json())
    .then(async data => {
      const text = data.content || "Based on your metrics, the selected plan offers a strong return on investment.";
      vt.innerHTML = '<strong>Minescout AI Analysis:</strong> <span id="roi-typing"></span>';
      const typeSpan = document.getElementById('roi-typing');
      
      for (let i = 0; i < text.length; i++) {
        typeSpan.innerHTML += text[i] === '\n' ? '<br/>' : text[i];
        await new Promise(r => setTimeout(r, 5));
      }
      
      btn.style.display = 'inline-block';
      btn.textContent = "✨ Recalculate AI Analysis";
    })
    .catch(async err => {
      let fallbackText = isNegative 
        ? `Based on your inputs, upgrading right now would result in a net loss of ${netMonthly}. Your current traffic and inquiry volume do not justify the cost of this infrastructure. We recommend holding off until your operation scales further.`
        : `Based on your inputs, generating ${netMonthly} in net monthly value makes the ${planName.split('—')[0]} a highly logical choice. You recover your costs rapidly while reclaiming ${hoursSaved} hours a month.`;
        
      vt.innerHTML = '<strong>Architect\'s Assessment:</strong> <span id="roi-typing"></span>';
      const typeSpan = document.getElementById('roi-typing');
      
      for (let i = 0; i < fallbackText.length; i++) {
        typeSpan.innerHTML += fallbackText[i] === '\n' ? '<br/>' : fallbackText[i];
        await new Promise(r => setTimeout(r, 5));
      }
      
      btn.style.display = 'inline-block';
      btn.textContent = "✨ Retry AI Analysis";
    });
  };

  window.calcROI(); 
}

function initAudit() {
  const WORKER_API_URL = "https://backend.tmcarleton11.workers.dev/audit"; 
  let currentMode = 'auto';

  const dateEl = document.getElementById('auto-date');
  if (dateEl) {
    dateEl.innerText = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  window.setAuditMode = function(mode) {
    currentMode = mode;
    document.getElementById('btn-auto').classList.toggle('active', mode === 'auto');
    document.getElementById('btn-manual').classList.toggle('active', mode === 'manual');
    document.getElementById('panel-auto').style.display = mode === 'auto' ? 'block' : 'none';
    document.getElementById('panel-manual').style.display = mode === 'manual' ? 'block' : 'none';
    document.getElementById('scan-status').innerText = mode === 'auto' ? 'System Ready (Network Mode)' : 'System Ready (Air-Gap Mode)';
    document.getElementById('scan-status').className = 'status-text';
  };

  window.runAuditScan = async function() {
    const statusEl = document.getElementById('scan-status');
    if (!statusEl) return;
    
    let targetUrl = "";
    const isCharterOffer = document.getElementById('charter-toggle').checked;
    let recType = "full"; 
    let findings = [];
    let hasChatWidget = false;

    if (currentMode === 'manual') {
      targetUrl = document.getElementById('manual-url').value;
      const htmlCode = document.getElementById('manual-code').value;
      recType = document.getElementById('manual-rec-type').value; 
      
      if (!targetUrl || !htmlCode) { alert("Please enter both the URL and paste the source HTML code."); return; }
      
      statusEl.className = 'status-text scanning';
      statusEl.innerText = 'Analyzing Provided Source Code...';
      await new Promise(r => setTimeout(r, 500)); 

      const lowerHtml = htmlCode.toLowerCase();
      hasChatWidget = lowerHtml.includes('intercom') || lowerHtml.includes('drift') || lowerHtml.includes('chat widget') || lowerHtml.includes('chat-bubble') || lowerHtml.includes('tidio');

      if (lowerHtml.includes('wp-content') || lowerHtml.includes('wordpress')) {
        findings.push({ title: "Legacy CMS Architecture", badge: "Sub-Optimal", type: "warn", desc: "Target is utilizing WordPress. This monolithic architecture relies on outdated plugin ecosystems, leading to slower load times and security vulnerabilities compared to modern Headless networks." });
      }
      if (lowerHtml.includes('mailto:') || lowerHtml.includes('<form')) {
        if (!hasChatWidget) findings.push({ title: "Asynchronous Conversion Flow", badge: "Critical Friction", type: "fail", desc: "Relying on static web forms and email links. This creates a 12-24 hour delay in lead response time, causing high-intent customers to abandon the site before getting logistical answers." });
      }
      if (!lowerHtml.includes('gtag') && !lowerHtml.includes('google-analytics') && !lowerHtml.includes('fbq')) {
        findings.push({ title: "Missing Telemetry", badge: "Blind Spot", type: "warn", desc: "No modern conversion tracking (Google Analytics 4 / Meta Pixel) detected. Unable to properly measure traffic sources or optimize lead generation." });
      }
    } 
    else {
      targetUrl = document.getElementById('target-url').value;
      if (!targetUrl) { alert("Please enter a URL first."); return; }
      if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

      statusEl.className = 'status-text scanning';
      statusEl.innerText = 'Transmitting to Cloudflare Edge...';

      try {
        const res = await fetch(WORKER_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: targetUrl })
        });

        if (!res.ok) throw new Error("Worker request failed.");
        
        const data = await res.json();
        findings = data.findings || [];
        hasChatWidget = data.hasChatWidget || false;
        recType = hasChatWidget ? 'remodel' : 'full';

      } catch (err) {
        alert("Network heavily restricted by firewall. Please switch to 'Manual Override' mode and paste the source code directly.");
        statusEl.className = 'status-text';
        statusEl.innerText = 'Network Blocked - Use Manual Mode';
        return;
      }
    }

    if (recType === 'full' && !hasChatWidget) {
      findings.push({
        title: "AI Integration Status", badge: "Missing", type: "fail",
        desc: "No autonomous agent detected. Competitors utilizing custom LLM (Large Language Model) agents are currently capturing off-hours traffic and instantly pre-qualifying leads."
      });
    } else if (hasChatWidget) {
      findings.push({
        title: "Third-Party Chat Script", badge: "Sub-Optimal", type: "warn",
        desc: "External chat widget detected. Third-party scripts often increase payload size and latency. Moving to a native, edge-deployed solution improves core performance."
      });
    }

    let displayUrl = targetUrl.replace(/^https?:\/\//, '').replace('www.', '');
    const domain = displayUrl.split('/')[0];
    const businessName = domain.split('.')[0].toUpperCase();

    document.getElementById('out-url').innerText = domain;
    document.getElementById('out-name').innerText = businessName;

    const resultsDiv = document.getElementById('audit-results');
    resultsDiv.innerHTML = '';
    
    findings.forEach(f => {
      resultsDiv.innerHTML += `
        <div class="diag-card ${f.type}">
          <div class="diag-title">
            <span>${f.title}</span>
            <span class="diag-badge">${f.badge}</span>
          </div>
          <div class="diag-desc">${f.desc}</div>
        </div>
      `;
    });

    if(findings.length === 0) {
      resultsDiv.innerHTML = '<p style="color: var(--success); font-weight: bold;">Initial scan complete. Infrastructure appears modern and optimized. Recommend focusing strictly on AI integration payload.</p>';
    }

    const solutionBox = document.getElementById('audit-solution');
    let solHtml = "";

    if (recType === 'full') {
      if (isCharterOffer) {
        solHtml = '<h3>The Minescout Upgrade (Charter Phase)</h3>' +
          '<p>We are selecting 3 local Charter Partners this month to receive a complete architectural overhaul at <strong style="color: var(--accent);">zero setup cost</strong>.</p>' +
          '<p style="margin-top: 10px;"><strong>1. Custom AI Integration:</strong> We will train an autonomous Llama-3 AI assistant on your exact pricing and policies. It will live on your site, answering client questions instantly, 24/7, and routing qualified leads directly to your inbox.<br>' +
          '<strong>2. Headless Edge Architecture:</strong> Complete migration to our multi-tenant Edge network, delivering enterprise-grade speed, security, and a private Admin Dashboard.</p>';
      } else {
        solHtml = '<h3>The Minescout Upgrade</h3>' +
          '<p>To resolve these conversion bottlenecks, we recommend a complete architectural overhaul tailored to your specific operational needs.</p>' +
          '<p style="margin-top: 10px;"><strong>1. Custom AI Integration:</strong> We will train an autonomous Llama-3 AI assistant on your exact pricing and policies. It will live on your site, answering client questions instantly, 24/7, and routing qualified leads directly to your inbox.<br>' +
          '<strong>2. Headless Edge Architecture:</strong> Complete migration to our multi-tenant Edge network, delivering enterprise-grade speed, security, and a private Admin Dashboard.</p>';
      }
    } else { 
      if (isCharterOffer) {
        solHtml = '<h3>The Minescout Architectural Remodel (Charter Phase)</h3>' +
          '<p>We are selecting 3 local Charter Partners this month to receive a complete architectural overhaul at <strong style="color: var(--accent);">zero setup cost</strong>.</p>' +
          '<p style="margin-top: 10px;"><strong>1. Headless Edge Architecture:</strong> Complete migration to our multi-tenant Edge network, delivering enterprise-grade speed, security, and a private Admin Dashboard.<br>' +
          '<strong>2. Conversion Optimization:</strong> Streamlining user flows, modernizing visual fidelity, and removing legacy plugins to ensure maximum lead capture efficiency.</p>';
      } else {
        solHtml = '<h3>The Minescout Architectural Remodel</h3>' +
          '<p>To resolve these structural bottlenecks, we recommend a complete architectural remodel tailored to your specific operational needs.</p>' +
          '<p style="margin-top: 10px;"><strong>1. Headless Edge Architecture:</strong> Complete migration to our multi-tenant Edge network, delivering enterprise-grade speed, security, and a private Admin Dashboard.<br>' +
          '<strong>2. Conversion Optimization:</strong> Streamlining user flows, modernizing visual fidelity, and removing legacy plugins to ensure maximum lead capture efficiency.</p>';
      }
    }

    solutionBox.innerHTML = solHtml;

    statusEl.className = 'status-text done';
    statusEl.innerText = 'Scan Complete';
    document.getElementById('doc-stamp').innerText = "Audit Generated";
  };
}

function initIntake() {
  if (!window.html2pdf) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    document.head.appendChild(script);
  }

  const dateEl = document.getElementById('p_date');
  if (dateEl) {
    dateEl.innerText = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  window.openIntakePreview = function() {
    document.getElementById('p_client').innerText = document.getElementById('f_business').value;
    document.getElementById('p_business').innerText = document.getElementById('f_business').value;
    document.getElementById('p_contact').innerText = document.getElementById('f_contact').value;
    document.getElementById('p_website').innerText = document.getElementById('f_website').value || "None provided";
    document.getElementById('p_contactInfo').innerText = document.getElementById('f_email').value + " | " + document.getElementById('f_phone').value;
    
    document.getElementById('p_faqs').innerText = document.getElementById('f_faqs').value;
    document.getElementById('p_pricing').innerText = document.getElementById('f_pricing').value;
    document.getElementById('p_logistics').innerText = document.getElementById('f_logistics').value;
    document.getElementById('p_tone').innerText = document.getElementById('f_tone').value;

    document.getElementById('previewModal').style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
  };

  window.closeIntakePreview = function() {
    document.getElementById('previewModal').style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  window.submitIntakeToCloudflare = async function() {
    document.getElementById('previewModal').style.display = 'none';
    document.getElementById('loading-screen').style.display = 'block';

    const element = document.getElementById('pdfDocument');
    element.setAttribute('contenteditable', 'false');

    const opt = {
      margin:       0.5,
      filename:     'Minescout_Intelligence_File.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      if (!window.html2pdf) throw new Error("PDF Library is still loading...");

      const pdfBase64 = await html2pdf().set(opt).from(element).outputPdf('datauristring');
      
      const clientEmail = document.getElementById('f_email').value;
      const clientName = document.getElementById('f_business').value;
      const WORKER_URL = 'https://thomas-chat.tmcarleton11.workers.dev/intake'; 

      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName,
          clientEmail: clientEmail,
          pdfAttachment: pdfBase64 
        })
      });

      document.getElementById('loading-screen').innerHTML = `
        <h2 style="font-family: var(--serif); color: #10b981; margin-bottom: 10px;">Transmission Complete</h2>
        <p style="color: var(--muted);">Your Intelligence File has been securely submitted to the Minescout Engine.</p>
        <p style="color: var(--muted);">A confirmation copy has been sent to ${clientEmail}.</p>
      `;

    } catch (err) {
      console.error(err);
      alert("There was an issue connecting to the edge network. Please try again.");
      document.getElementById('loading-screen').style.display = 'none';
      document.getElementById('previewModal').style.display = 'flex';
      element.setAttribute('contenteditable', 'true');
    }
  };
}

function initPricing() {
  window.toggleFaq = function(btn) {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  };

  const CHAT_WORKER = 'https://thomas-chat.tmcarleton11.workers.dev/';
  
  const planQuizEl = document.getElementById('plan-quiz');
  const openQuizBtn = document.getElementById('open-plan-quiz');

  if (openQuizBtn && planQuizEl) {
    openQuizBtn.addEventListener('click', function () {
      planQuizEl.classList.remove('is-hidden');
      planQuizEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const TOTAL_STEPS = 4;
  const progressFill = document.getElementById('quiz-progress');
  const quizBody = document.getElementById('quiz-body');
  const quizResult = document.getElementById('quiz-result');
  const resultTitle = document.getElementById('quiz-result-title');
  const resultDesc = document.getElementById('quiz-result-desc');
  const resultCta = document.getElementById('quiz-result-cta');
  const retryBtn = document.getElementById('quiz-retry');

  let step = 1;
  let selections = {}; 

  function updateProgress() {
    const pct = step <= TOTAL_STEPS ? (step / TOTAL_STEPS) * 100 : 100;
    if (progressFill) progressFill.style.width = pct + '%';
  }

  function goToStep(s) {
    step = s;
    document.querySelectorAll('.plan-quiz-step').forEach(function(el) {
      el.classList.toggle('active', parseInt(el.getAttribute('data-step'), 10) === step);
    });
    updateProgress();

    const backBtn = document.getElementById('quiz-back');
    const nextBtn = document.getElementById('quiz-next');
    
    if (backBtn) backBtn.style.visibility = step > 1 ? 'visible' : 'hidden';
    
    if (nextBtn) {
      if (selections[step]) {
        nextBtn.disabled = false;
      } else {
        nextBtn.disabled = true;
      }
      nextBtn.textContent = step === TOTAL_STEPS ? 'See Recommendation' : 'Next Step';
    }
  }

  function showResult() {
    if (quizBody) quizBody.style.display = 'none';
    const nav = document.querySelector('.plan-quiz-nav');
    if (nav) nav.style.display = 'none';
    if (quizResult) quizResult.classList.add('active');
    if (progressFill) progressFill.style.width = '100%';

    let userAnswers = [];
    let remodelScore = 0;
    let aiScore = 0;
    
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      if (selections[i]) {
        remodelScore += selections[i].r;
        aiScore += selections[i].a;
        userAnswers.push(`Q: ${selections[i].qText} | A: ${selections[i].aText}`);
      }
    }
    
    if (resultTitle) resultTitle.innerHTML = '<span class="ai-loading">Consulting Minescout AI...</span>';
    if (resultDesc) resultDesc.innerHTML = '';
    if (resultCta) resultCta.style.display = 'none';

    const systemPrompt = `You are a technical sales advisor for Minescout AI. A potential client just finished a quiz about their website needs.
    Based on their answers, you must explicitly decide which of these two plans is best:
    1. "Digital Remodel" ($499 + $29/mo) - Best if they just want a modern site, have a strict budget, or don't get repetitive questions.
    2. "Full AI Upgrade" ($749 + $59/mo) - Best if they miss leads, spend time answering the same questions, or want 24/7 automated support.

    Format your response EXACTLY like this:
    PLAN: [Digital Remodel OR Full AI Upgrade]
    REASON: [1-2 paragraphs explaining exactly why this plan is the perfect fit based on their specific answers. Speak directly to the client ("you").]`;

    fetch(CHAT_WORKER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: "user", content: "My quiz answers:\n" + userAnswers.join("\n") }],
        system_override: systemPrompt,
        temperature: 0.4
      })
    })
    .then(res => res.json())
    .then(async data => {
      const text = data.content || "";
      let planName = "Digital Remodel";
      let reasonText = text;

      if (text.includes("PLAN:") && text.includes("REASON:")) {
        const parts = text.split("REASON:");
        planName = parts[0].replace("PLAN:", "").trim();
        reasonText = parts[1].trim();
      } else if (text.toLowerCase().includes("full ai upgrade")) {
        planName = "Full AI Upgrade";
      }

      planName = planName.replace(/\*/g, '');

      if (resultTitle) resultTitle.textContent = planName;
      if (resultDesc) {
        resultDesc.textContent = '';
        for (let i = 0; i < reasonText.length; i++) {
          resultDesc.innerHTML += reasonText[i] === '\n' ? '<br/>' : reasonText[i];
          await new Promise(r => setTimeout(r, 5));
        }
      }
      
      if (resultCta) {
        resultCta.textContent = 'Get started with ' + planName;
        resultCta.href = '/contact';
        resultCta.style.display = 'inline-flex';
      }
    })
    .catch(async err => {
      var recommendFullAI = aiScore >= remodelScore;
      var recommendedPlan = recommendFullAI ? 'Full AI Upgrade' : 'Digital Remodel';
      
      if (resultTitle) resultTitle.textContent = recommendedPlan;
      if (resultDesc) {
        resultDesc.textContent = '';
        let fallbackReason = recommendFullAI 
          ? 'You want a modern site and get enough repeat questions or after-hours interest that an AI assistant will pay off. The Full AI Upgrade gives you a complete remodel plus a custom-trained assistant that answers as your business, provides after-hours coverage, and works 24/7. Rate: $749 setup, then $59/mo.'
          : 'You need a better website first, and you’re either keeping ongoing costs minimal or not yet sure you need an AI layer. The Digital Remodel is a one-time $499 build for a fast, modern front door. You can add the AI later when you’re ready. Optional $29/mo for managed hosting.';
        
        for (let i = 0; i < fallbackReason.length; i++) {
          resultDesc.innerHTML += fallbackReason[i] === '\n' ? '<br/>' : fallbackReason[i];
          await new Promise(r => setTimeout(r, 5));
        }
      }
      if (resultCta) {
        resultCta.textContent = 'Get started with ' + recommendedPlan;
        resultCta.href = '/contact';
        resultCta.style.display = 'inline-flex';
      }
    });
  }

  function resetQuiz() {
    step = 1;
    selections = {};
    document.querySelectorAll('.plan-quiz-opt').forEach(el => el.classList.remove('selected'));
    if (quizBody) quizBody.style.display = '';
    const nav = document.querySelector('.plan-quiz-nav');
    if (nav) nav.style.display = 'flex';
    if (quizResult) quizResult.classList.remove('active');
    goToStep(1);
  }

  if (planQuizEl) {
    planQuizEl.addEventListener('click', function(e) {
      var opt = e.target.closest('.plan-quiz-opt');
      if (opt) {
        const stepEl = opt.closest('.plan-quiz-step');
        const stepNum = parseInt(stepEl.getAttribute('data-step'), 10);
        
        stepEl.querySelectorAll('.plan-quiz-opt').forEach(el => el.classList.remove('selected'));
        opt.classList.add('selected');
        
        selections[stepNum] = {
          qText: stepEl.querySelector('.plan-quiz-q').textContent,
          aText: opt.textContent,
          r: parseInt(opt.getAttribute('data-remodel'), 10) || 0,
          a: parseInt(opt.getAttribute('data-ai'), 10) || 0
        };
        
        const nextBtn = document.getElementById('quiz-next');
        if (nextBtn) nextBtn.disabled = false;
        return;
      }

      if (e.target.closest('#quiz-next')) {
        if (step >= TOTAL_STEPS) showResult();
        else goToStep(step + 1);
        return;
      }

      if (e.target.closest('#quiz-back')) {
        if (step > 1) goToStep(step - 1);
        return;
      }
    });
  }

  if (retryBtn) retryBtn.addEventListener('click', resetQuiz);
}

function initLegal() {
  const dateEl = document.getElementById('legal-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
}
function initResume() {
  window.downloadResume = function() {
    // 1. Save the original page title
    const originalTitle = document.title;
    
    // 2. Set the title to the exact file name you want the PDF to save as
    document.title = "Thomas Carleton Resume";
    
    // 3. Trigger the browser's native, ATS-friendly print dialog
    window.print();
    
    // 4. Restore the original website title after the dialog closes
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };
}
async function initAdmin() {
  const { getApp, getApps, initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
  const { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
  const { getFirestore, doc, getDoc, setDoc, addDoc, getDocs, collection, query, where, deleteDoc, serverTimestamp, limit, updateDoc, writeBatch } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

  const firebaseConfig = {
    apiKey: "AIzaSyAmZbRI37rbHWGaOSVomMdcG-IvHMf6S3Y",
    authDomain: "minescout-5533a.firebaseapp.com",
    projectId: "minescout-5533a"
  };

  const app  = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const db   = getFirestore(app);

  let currentAdmin = null;
  let allClients   = [];
  let pendingDeleteId = null;
  let bypassAuthCheck = false;

  window.showPanel = function(id, el) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.sidenav a').forEach(a => a.classList.remove('active'));
    document.getElementById('panel-' + id).classList.add('active');
    if (el) el.classList.add('active');
    return false;
  };

  function hideLoading() { const ls = document.getElementById('admin-loading-screen'); if(ls) { ls.style.opacity = '0'; setTimeout(() => ls.style.display = 'none', 300); } }
  function showLoginScreen() { const ls = document.getElementById('login-screen'); if(ls) ls.style.display = 'flex'; }
  function showAdmin() { const a = document.getElementById('admin'); if(a) a.style.display = 'block'; }
  function openModal(id)  { document.getElementById(id).classList.add('open'); }
  window.closeModal = id => document.getElementById(id).classList.remove('open');
  function showErr(msg) { const el = document.getElementById('l-err'); if(el) { el.textContent = msg; el.style.display = 'block'; } }
  
  let toastT;
  window.showToast = function(msg, type='') {
    const el = document.getElementById('toast');
    if(el) {
      el.textContent = msg; el.className = 'toast show ' + type;
      clearTimeout(toastT);
      toastT = setTimeout(() => el.className = 'toast', 3200);
    }
  };
  function esc(str) { return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  window.doLogin = async function() {
    const email = document.getElementById('l-email').value.trim();
    const pass  = document.getElementById('l-pass').value;
    const btn   = document.getElementById('l-btn');
    const err   = document.getElementById('l-err');
    if (!email || !pass) { showErr('Enter email and password.'); return; }
    btn.disabled = true; btn.textContent = 'Signing in...'; err.style.display = 'none';
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) {
      btn.disabled = false; btn.textContent = 'Sign In';
      showErr("Sign-in failed. Try again.");
    }
  };
  
  document.addEventListener('keydown', e => { if (e.key === 'Enter') window.doLogin?.(); });

  window.doSignOut = async function() { await signOut(auth); window.location.reload(); };

  async function loadAll() { await loadClients(); await loadAllCorrections(); }

  async function loadClients() {
    try {
      const snap = await getDocs(collection(db, 'clients'));
      allClients = [];
      for (const d of snap.docs) {
        const bizSnap   = await getDoc(doc(db, 'clients', d.id, 'data', 'businessInfo'));
        const statsSnap = await getDoc(doc(db, 'clients', d.id, 'data', 'stats'));
        const faqSnap   = await getDocs(collection(db, 'clients', d.id, 'faqs'));
        const biz       = bizSnap.exists()   ? bizSnap.data()   : {};
        const stats     = statsSnap.exists() ? statsSnap.data() : {};
        allClients.push({ uid: d.id, email: biz.email || '', name: biz.name || 'Unnamed client', plan: biz.plan || 'Unknown', total: stats.total || 0, faqCount: faqSnap.size, biz });
      }
      renderClientList(); updateDashStats();
    } catch (err) { console.error('loadClients error:', err); }
  }

  async function loadAllCorrections() {
    try {
      let all = [];
      for (const client of allClients) {
        const corrSnap = await getDocs(query(collection(db, 'clients', client.uid, 'corrections'), where('status', '==', 'pending'), limit(50)));
        corrSnap.forEach(d => all.push({ id: d.id, clientId: client.uid, clientName: client.name, ...d.data() }));
      }
      renderCorrections(all);
      const dp = document.getElementById('d-pending');
      const pcl = document.getElementById('pending-count-label');
      if(dp) dp.textContent = all.length;
      if(pcl) pcl.textContent = all.length + ' pending';
    } catch (err) { console.error(err); }
  }

  function renderClientList() {
    const dashList    = document.getElementById('dash-client-list');
    const clientsList = document.getElementById('clients-list');
    if (allClients.length === 0) {
      dashList.innerHTML = clientsList.innerHTML = '<div class="empty-state">No clients yet. Create one with the New Client tab.</div>';
      return;
    }
    const html = allClients.map(c => `
      <div class="client-row">
        <div><div class="client-name">${esc(c.name)}</div><div class="client-meta">${esc(c.email || c.uid)} &nbsp;&middot;&nbsp; ${esc(c.plan)} &nbsp;&middot;&nbsp; ${c.faqCount} FAQs &nbsp;&middot;&nbsp; ${c.total} conversations</div></div>
        <div class="client-actions"><span class="tag tag-active">Active</span><button class="btn btn-ghost btn-sm" onclick="openClientModal('${c.uid}')">View</button><button class="btn btn-danger btn-sm" onclick="confirmDelete('${c.uid}','${esc(c.name)}')">Delete</button></div>
      </div>
    `).join('');
    dashList.innerHTML = clientsList.innerHTML = html;
  }

  function updateDashStats() {
    const dc = document.getElementById('d-clients');
    const dco = document.getElementById('d-convos');
    if(dc) dc.textContent = allClients.length;
    if(dco) dco.textContent = allClients.reduce((s, c) => s + (c.total || 0), 0);
  }

  function renderCorrections(corrections) {
    const list = document.getElementById('corrections-list');
    if (corrections.length === 0) { list.innerHTML = '<div class="empty-state">No pending corrections. Great job!</div>'; return; }
    list.innerHTML = corrections.map(c => `
      <div class="corr-row" id="corr-row-${c.id}">
        <div><div class="corr-col-label">Client</div><div class="corr-text">${esc(c.clientName)}</div><div class="corr-q" style="margin-top:0.5rem;">${esc(c.question || '—')}</div></div>
        <div><div class="corr-col-label">Correct answer</div><div class="corr-text">${esc(c.correction || '—')}</div>${c.wrongAnswer ? `<div class="corr-col-label" style="margin-top:0.5rem;">AI said (wrong)</div><div class="corr-text" style="text-decoration:line-through;opacity:0.6;">${esc(c.wrongAnswer)}</div>` : ''}</div>
        <div style="display:flex;flex-direction:column;gap:0.4rem;"><button class="btn btn-green btn-sm" onclick="markApplied('${c.clientId}','${c.id}')">Mark applied</button><span class="tag tag-pending" style="text-align:center;">Pending</span></div>
      </div>
    `).join('');
  }

  window.openClientModal = async function(uid) {
    const c = allClients.find(x => x.uid === uid);
    if (!c) return;
    document.getElementById('cm-title').textContent = c.name;
    document.getElementById('cm-uid').textContent   = uid;
    document.getElementById('cm-email').textContent = c.email || '(no email stored)';
    document.getElementById('cm-plan').textContent  = c.plan;
    document.getElementById('cm-convos').textContent = c.total;
    const faqSnap = await getDocs(collection(db, 'clients', uid, 'faqs'));
    const faqs = [];
    faqSnap.forEach(d => faqs.push(d.data()));
    document.getElementById('cm-faqs').innerHTML = faqs.length ? faqs.map(f => `<div style="margin-bottom:0.5rem;"><strong style="color:var(--fg);">Q:</strong> ${esc(f.question)}<br><strong style="color:var(--fg);">A:</strong> ${esc(f.answer)}</div>`).join('') : '<span style="color:var(--muted);">No FAQs yet.</span>';
    document.getElementById('cm-delete-btn').onclick = () => { closeModal('client-modal'); confirmDelete(uid, c.name); };
    openModal('client-modal');
  };

  window.confirmDelete = function(uid, name) {
    pendingDeleteId = uid;
    document.getElementById('del-client-name').textContent = name;
    openModal('delete-modal');
    document.getElementById('del-confirm-btn').onclick = () => deleteClient(uid);
  };

  async function deleteClient(uid) {
    try {
      const subcols = ['faqs', 'corrections', 'conversations'];
      for (const col of subcols) {
        const snap = await getDocs(collection(db, 'clients', uid, col));
        const batch = writeBatch(db);
        snap.forEach(d => batch.delete(d.ref));
        await batch.commit();
      }
      for (const docName of ['businessInfo', 'stats']) await deleteDoc(doc(db, 'clients', uid, 'data', docName)).catch(() => {});
      await deleteDoc(doc(db, 'clients', uid)).catch(() => {});
      closeModal('delete-modal'); closeModal('client-modal');
      showToast('Client data deleted.', 'ok');
      allClients = allClients.filter(c => c.uid !== uid);
      renderClientList(); updateDashStats();
    } catch (err) { showToast('Error deleting client.', 'err'); }
  }

  window.markApplied = async function(clientId, corrId) {
    try {
      await updateDoc(doc(db, 'clients', clientId, 'corrections', corrId), { status: 'applied' });
      document.getElementById('corr-row-' + corrId)?.remove();
      showToast('Marked as applied ✓', 'ok');
      const pendingRows = document.querySelectorAll('#corrections-list .corr-row').length;
      document.getElementById('d-pending').textContent = pendingRows;
      document.getElementById('pending-count-label').textContent = pendingRows + ' pending';
      if (pendingRows === 0) document.getElementById('corrections-list').innerHTML = '<div class="empty-state">No pending corrections. Great job!</div>';
    } catch (err) { showToast('Error updating correction.', 'err'); }
  };

  let ncFaqCount = 0;
  window.addNcFaqRow = function() {
    const id = ncFaqCount++;
    const row = document.createElement('div');
    row.id = 'nc-faq-' + id;
    row.style.cssText = 'border:1px solid var(--border);border-radius:4px;padding:0.85rem;margin-bottom:0.75rem;background:var(--light);';
    row.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.6rem;">
        <span style="font-size:0.6rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted);">FAQ #${id+1}</span>
        <button class="btn btn-ghost btn-sm" onclick="document.getElementById('nc-faq-${id}').remove()">Remove</button>
      </div>
      <div class="field"><label>Question</label><input type="text" id="nc-faq-q-${id}" placeholder="e.g. What are your hours?" /></div>
      <div class="field"><label>Answer</label><textarea id="nc-faq-a-${id}" placeholder="e.g. We are open Mon–Fri 9am–5pm."></textarea></div>
    `;
    document.getElementById('nc-faqs').appendChild(row);
  };

  window.createClient = async function() {
    const email  = document.getElementById('nc-email').value.trim();
    const pass   = document.getElementById('nc-pass').value.trim();
    const name   = document.getElementById('nc-name').value.trim();
    const phone  = document.getElementById('nc-phone').value.trim();
    const addr   = document.getElementById('nc-address').value.trim();
    const site   = document.getElementById('nc-website').value.trim();
    const plan   = document.getElementById('nc-plan').value;
    const hours  = document.getElementById('nc-hours').value.trim();
    const desc   = document.getElementById('nc-description').value.trim();
    const svc    = document.getElementById('nc-services').value.trim();

    if (!email || !pass || !name) { showToast('Email, password, and business name are required.', 'err'); return; }
    if (pass.length < 6) { showToast('Password must be at least 6 characters.', 'err'); return; }

    const btn      = document.getElementById('nc-submit-btn');
    const progress = document.getElementById('seed-progress');
    btn.disabled   = true; btn.textContent = 'Creating...';
    progress.style.display = 'block'; progress.innerHTML = '';

    const step = (icon, text) => progress.innerHTML += `<div class="seed-step"><span class="seed-step-icon">${icon}</span>${text}</div>`;

    try {
      step('⏳', 'Creating Firebase account...');
      const apiKey  = firebaseConfig.apiKey;
      const signUpRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, returnSecureToken: false })
      });
      const signUpData = await signUpRes.json();
      if (signUpData.error) throw new Error(signUpData.error.message);
      
      const uid = signUpData.localId;
      step('✅', `Account created (UID: ${uid.slice(0,8)}...)`);

      step('⏳', 'Writing business info to Firestore...');
      await setDoc(doc(db, 'clients', uid, 'data', 'businessInfo'), {
        name, phone, address: addr, website: site, plan, hours, description: desc, services: svc, email, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      step('✅', 'Business info saved.');

      await setDoc(doc(db, 'clients', uid, 'data', 'stats'), { total: 0, thumbsUp: 0, thumbsDown: 0 });

      const faqContainer = document.getElementById('nc-faqs');
      const faqRows = faqContainer.querySelectorAll('[id^="nc-faq-"]');
      let faqCount = 0;
      for (const row of faqRows) {
        const id = row.id.replace('nc-faq-', '');
        const q  = document.getElementById('nc-faq-q-' + id)?.value.trim();
        const a  = document.getElementById('nc-faq-a-' + id)?.value.trim();
        if (q && a) {
          await addDoc(collection(db, 'clients', uid, 'faqs'), { question: q, answer: a, createdAt: serverTimestamp() });
          faqCount++;
        }
      }
      if (faqCount > 0) step('✅', `${faqCount} FAQ(s) seeded.`);

      await setDoc(doc(db, 'clients', uid), { createdAt: serverTimestamp() });

      step('🎉', `Done! Send ${email} their temp password: ${pass}`);
      showToast('Client created successfully ✓', 'ok');

      ['nc-email','nc-pass','nc-name','nc-phone','nc-address','nc-website','nc-hours','nc-description','nc-services']
        .forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
      document.getElementById('nc-faqs').innerHTML = ''; ncFaqCount = 0;

      await loadClients();
    } catch (err) { step('❌', 'Error: ' + err.message); showToast('Error: ' + err.message, 'err'); } 
    finally { btn.disabled = false; btn.textContent = 'Create client account'; }
  };

  onAuthStateChanged(auth, async user => {
    if (bypassAuthCheck) return;
    if (!user) { hideLoading(); showLoginScreen(); return; }

    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (!adminDoc.exists()) {
        hideLoading(); await signOut(auth); window.location.href = '/portal'; return;
      }
      currentAdmin = user;
      const aul = document.getElementById('admin-user-label');
      if(aul) aul.textContent = user.email;
      hideLoading(); showAdmin(); await loadAll();
    } catch (e) {
      hideLoading(); await signOut(auth); showLoginScreen(); showErr('Access denied. This page is admin-only.');
    }
  });
}

async function initPortal() {
  const { getApp, getApps, initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
  const { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
  const { getFirestore, doc, getDoc, collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

  const firebaseConfig = {
    apiKey: "AIzaSyAmZbRI37rbHWGaOSVomMdcG-IvHMf6S3Y",
    authDomain: "minescout-5533a.firebaseapp.com",
    projectId: "minescout-5533a"
  };

  const app  = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const db   = getFirestore(app);

  let currentClientUid = null;

  window.portalLogin = async function() {
    const email = document.getElementById('p-email').value.trim();
    const pass  = document.getElementById('p-pass').value;
    const btn   = document.getElementById('p-login-btn');
    const err   = document.getElementById('p-err');
    
    if (!email || !pass) { err.innerText = "Enter email and password."; err.style.display = "block"; return; }
    
    btn.disabled = true; btn.innerText = "Verifying..."; err.style.display = "none";
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) {
      btn.disabled = false; btn.innerText = "Sign In";
      err.innerText = "Invalid credentials. Contact Minescout support."; err.style.display = "block";
    }
  };

  window.portalSignOut = async function() {
    await signOut(auth);
    window.location.reload();
  };

  window.submitCorrection = async function() {
    const q = document.getElementById('corr-q').value.trim();
    const a = document.getElementById('corr-a').value.trim();
    const btn = document.getElementById('corr-submit');
    const msg = document.getElementById('corr-msg');

    if (!q || !a) { alert("Please fill out both fields."); return; }
    
    btn.disabled = true; btn.innerText = "Submitting...";
    try {
      await addDoc(collection(db, 'clients', currentClientUid, 'corrections'), {
        question: q,
        correction: a,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      document.getElementById('corr-q').value = '';
      document.getElementById('corr-a').value = '';
      msg.style.display = "block";
      setTimeout(() => msg.style.display = "none", 4000);
    } catch (e) {
      alert("Error submitting. Please try again.");
    }
    btn.disabled = false; btn.innerText = "Submit to Minescout";
  };

  onAuthStateChanged(auth, async user => {
    if (user) {
      currentClientUid = user.uid;
      document.getElementById('portal-login').style.display = 'none';
      document.getElementById('portal-dash').style.display = 'block';

      try {
        const bizSnap = await getDoc(doc(db, 'clients', user.uid, 'data', 'businessInfo'));
        const statsSnap = await getDoc(doc(db, 'clients', user.uid, 'data', 'stats'));
        
        if (bizSnap.exists()) {
          document.getElementById('pd-name').innerText = bizSnap.data().name;
          document.getElementById('pd-plan').innerText = `Active Plan: ${bizSnap.data().plan}`;
        }
        if (statsSnap.exists()) {
          document.getElementById('pd-convos').innerText = statsSnap.data().total || 0;
        }
      } catch (e) { console.error("Error loading dashboard", e); }

    } else {
      document.getElementById('portal-login').style.display = 'block';
      document.getElementById('portal-dash').style.display = 'none';
    }
  });
}


// ── 3. BOOTSTRAP ROUTER ──────────────────────────────────────────────────
let appElement;

function render(path) {
  const cleanPath = path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path;
  const finalPath = (path === '/ai/demo/') ? '/ai/demo/' : cleanPath;
  const content = views[finalPath] || views['404'];
  
  appElement.innerHTML = content;
  updateSidebarNav(path); 
  window.scrollTo(0, 0);

  // Initialize page-specific logic
  if (finalPath === '/ask') initAskChat();
  else if (finalPath === '/resume') initResume();
  else if (finalPath === '/guestbook') initGuestbook();
  else if (finalPath === '/hq') initHQ();
  else if (finalPath === '/ai/roi') initROI();
  else if (finalPath === '/ai/generator/audit') initAudit();
  else if (finalPath === '/ai/intake' || finalPath === '/ai/info') initIntake();
  else if (finalPath === '/ai/pricing') initPricing();
  else if (finalPath === '/ai/legal' || finalPath === '/legal') initLegal();
  else if (finalPath === '/ai/admin' || finalPath === '/admin') initAdmin();
  else if (finalPath === '/portal' || finalPath === '/ai/clients/portal') initPortal();
}

function navigate(path) {
  window.history.pushState({}, '', path);
  render(path);
}

function initRouter() {
  appElement = document.getElementById('app');
  
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href')) {
      const href = link.getAttribute('href');
      if (link.getAttribute('target') === '_blank' || href.startsWith('http')) return;

      if (href.startsWith('/')) {
        e.preventDefault();
        navigate(href);
        if (window.innerWidth <= 768) closeSidebarNav();
      }
    }
  });

  // Handle Contact Form inside SPA
  document.addEventListener('submit', async (e) => {
    if (e.target && e.target.id === 'contact-form') {
      e.preventDefault();
      const form = e.target;
      const btn = form.querySelector('#form-btn');
      const success = document.getElementById('form-success');
      btn.disabled = true; btn.innerText = 'Transmitting...';

      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      const htmlBody = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e8e4dd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1a1916; padding: 20px; text-align: center;">
            <h2 style="margin: 0; color: #ffffff; font-family: Georgia, serif; letter-spacing: 0.1em; text-transform: uppercase; font-size: 16px;">Minescout AI / Operations</h2>
          </div>
          <div style="padding: 30px 20px;">
            <p style="font-size: 12px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; color: #ff4d1c; margin-bottom: 5px;">New Inquiry</p>
            <h1 style="margin-top: 0; font-size: 24px; color: #1a1916;">You have a new message.</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <div style="background-color: #f9f8f6; padding: 15px; border-left: 3px solid #ff4d1c; color: #1a1916; font-size: 14px; white-space: pre-wrap;">${message}</div>
          </div>
        </div>
      `;

      const payload = {
        to: ["tmcarleton11@gmail.com"],
        subject: `New Inquiry from ${name}`,
        htmlBody: htmlBody,
        fromName: "Minescout Contact Form"
      };

      try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbz7MJE7mNY1A-SvbdHGV3yI6-ftBElB1wOth4MqEABvJXLI5SNzeqiG2r7PJBpWvcAiOg/exec", { 
          method: 'POST', 
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
        
        if (res.ok) { 
          form.style.display = 'none'; 
          success.classList.add('visible'); 
        } else throw new Error("GAS Script rejected.");
      } catch (err) {
        alert('Could not reach the routing server. Please try emailing directly.');
        btn.disabled = false; btn.innerText = 'Send Message';
      }
    }
  });

  window.addEventListener('popstate', () => render(window.location.pathname));
}

function boot() {
  initSidebar();
  initRouter();
  render(window.location.pathname);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}