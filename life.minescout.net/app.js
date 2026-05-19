// app.js — Application Logic & Routing

// ── 0. IMPORT MODULAR VIEWS ───────────────────────────────────────
import { postsUpdatesViews } from './views/posts/view-posts-updates.js';
import { puppyViews } from './views/posts/view-posts-puppies.js';
import { betaViews } from './views/posts/view-posts-beta.js';
import { landingViews } from './views/view-pages-landing.js';
import { analyticsViews } from './views/view-pages-analitics.js';
import { adminViews } from './views/view-admin.js';
import { archiveViews } from './views/view-pages-archive.js';

// Bundle view templates into the central single-page state machine
const views = {
  ...postsUpdatesViews,
  ...puppyViews,
  ...betaViews,
  ...landingViews,
  ...analyticsViews,
  ...adminViews,
  ...archiveViews,
  
  // 404 Fallback
  '404': `
    <div class="container" style="padding: 40px 20px; text-align: center;">
      <h1>404 - Page Not Found</h1>
      <a href="/">Go Home</a>
    </div>
  `
};

// ── 1. GLOBAL FIREBASE INITIALIZATION ──────────────────────────────
let globalFirebaseApp = null;
let fbDb = null;
let fbAuth = null;

async function getFirebaseApp() {
  if (globalFirebaseApp) return { app: globalFirebaseApp, db: fbDb, auth: fbAuth };
  try {
    const { getApp, getApps, initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');

    const firebaseConfig = {
      apiKey: "AIzaSyAmZbRI37rbHWGaOSVomMdcG-IvHMf6S3Y",
      authDomain: "minescout-5533a.firebaseapp.com",
      projectId: "minescout-5533a"
    };
    
    globalFirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    fbDb = getFirestore(globalFirebaseApp);
    fbAuth = getAuth(globalFirebaseApp);
    return { app: globalFirebaseApp, db: fbDb, auth: fbAuth };
  } catch (e) {
    console.error("Firebase init failed:", e);
    return { app: null, db: null, auth: null };
  }
}

// ── 2. SIDEBAR LOGIC ──────────────────────────────────────────────
const MAIN_MENU = [
  { label: 'Home',    href: '/' },
  { label: 'Updates', href: '/Footer/updates.html' },
  { label: 'Archive', href: '/archive' },
  { label: 'About',   href: '/about' }
];

let sidebarNav, ownerText, aside, overlay, hamBtn;

function buildLinks(links, currentPath) {
  return links.map(link => {
    let isActive = false;
    if (link.href === '/' && currentPath === '/') isActive = true;
    else if (link.href !== '/' && currentPath.startsWith(link.href)) isActive = true;

    const activeClass = isActive ? ' class="active"' : '';
    return `<a href="${link.href}"${activeClass}>${link.label}</a>`;
  }).join('\n');
}

function updateSidebarNav(path) {
  if (!sidebarNav) return;
  sidebarNav.innerHTML = buildLinks(MAIN_MENU, path);
  ownerText.textContent = `\u00A9 ${new Date().getFullYear()} Minescouts Life`;
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
        <img src="/assests/images/favicon.png" alt="ML" class="sidebar-logo" onerror="this.style.display='none'" />
        <div>
          <div class="sidebar-name">Minescouts Life</div>
          <div class="sidebar-tagline">life.minescout.net</div>
        </div>
      </div>
      <button class="hamburger" id="hamburger" aria-label="Toggle navigation">
        <span>☰</span>
      </button>
    </div>
    <nav class="sidebar-nav" id="sidebar-nav"></nav>
    <div class="sidebar-spacer"></div>
    <div class="sidebar-bottom" id="copyright"></div>
  `;

  document.body.insertBefore(aside, document.body.firstChild);
  document.body.insertBefore(overlay, document.body.firstChild);

  sidebarNav = document.getElementById('sidebar-nav');
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

// ── 3. DYNAMIC ARCHIVE INITIALIZERS ──────────────────────────────
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

function initArchiveYear() {
  const container = document.getElementById('month-cards-container');
  if (!container) return;

  const pathParts = window.location.pathname.split('/');
  const year = parseInt(pathParts[2], 10);
  
  document.getElementById('year-title').innerText = `${year} Collection`;
  document.getElementById('year-tagline').innerText = `Yearly Archive • ${year}`;

  let maxMonth = 12;
  if (year === new Date().getFullYear()) {
    maxMonth = new Date().getMonth() + 1;
  }

  let html = '';
  for (let i = maxMonth - 1; i >= 0; i--) {
    const monthName = MONTH_NAMES[i];
    const monthNum = i + 1;

    html += `
      <article class="month-card">
        <div>
          <img src="/assests/images/archive/${monthName} Archive.png" 
               class="month-card-image" 
               onerror="this.onerror=null; this.src='https://placehold.co/600x400/e0e0e0/333333?text=${monthName}+${year}';" 
               alt="${monthName} ${year}" />
          <span class="month-badge">Monthly Log</span>
          <h3>${monthName} ${year}</h3>
          <p>Browse through technical publications, system benchmarks, and diary updates logged in ${monthName}.</p>
        </div>
        <a href="/archive/${year}/${monthNum}" class="btn-primary" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">View Month →</a>
      </article>
    `;
  }
  container.innerHTML = html;
}

async function initArchiveMonth() {
  const container = document.getElementById('month-posts-container');
  if (!container) return;

  const pathParts = window.location.pathname.split('/');
  const year = parseInt(pathParts[2], 10);
  const monthNum = parseInt(pathParts[3], 10);
  const monthName = MONTH_NAMES[monthNum - 1];

  document.getElementById('month-title').innerText = `${monthName} ${year}`;
  document.getElementById('month-tagline').innerText = `Calendar logs matching ${monthName} ${year}`;
  document.getElementById('month-back-link').setAttribute('href', `/archive/${year}`);

  container.innerHTML = '<div class="empty-state"><h3>Searching nodes...</h3><p>Connecting to database node...</p></div>';

  await getFirebaseApp();
  if (!fbDb) {
    container.innerHTML = '<div class="empty-state"><h3>Database Connection Lost</h3><p>Failed to load articles from Firebase.</p></div>';
    return;
  }

  try {
    const { collection, getDocs, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    const q = query(collection(fbDb, 'content'), orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    
    let html = '';
    let matchesCount = 0;

    snap.forEach(docSnap => {
      const post = docSnap.data();
      const dateObj = new Date(post.timestamp);
      
      if (dateObj.getFullYear() === year && (dateObj.getMonth() + 1) === monthNum) {
        matchesCount++;
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        const imgHtml = post.imageUrl 
          ? `<div class="post-image-wrapper"><img src="${post.imageUrl}" onerror="this.onerror=null; this.src='https://placehold.co/600x400/e0e0e0/333333?text=Image+Unavailable';" alt="" /></div>` 
          : `<div class="post-image-wrapper" style="background: var(--md-surface-container); display:flex; align-items:center; justify-content:center; color: var(--md-outline);"><span class="material-symbols-rounded" style="font-size:48px;">article</span></div>`;

        html += `
          <article class="post-card" data-post-id="${docSnap.id}">
            ${imgHtml}
            <div class="post-card-content">
              <span class="category-pill">${post.category || 'General'}</span>
              <h3 class="post-title"><a href="${post.linkUrl || '#'}">${post.title || 'Untitled Post'}</a></h3>
              <div class="post-meta">${dateStr}</div>
              <p class="post-excerpt">${post.summary || 'No summary provided.'}</p>
              <div style="margin-top:auto;">
                 <a href="${post.linkUrl || '#'}" class="read-more" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">
                      ${post.linkText || 'Read More →'}
                 </a>
              </div>
            </div>
          </article>
        `;
      }
    });

    if (matchesCount === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No Entries Logged</h3>
          <p>No content logs were published to life.minescout.net in ${monthName} ${year}.</p>
        </div>
      `;
    } else {
      container.innerHTML = html;
    }
  } catch (err) {
    console.error("Archive fetch error:", err);
    container.innerHTML = '<div class="empty-state"><h3>Fatal Execution Error</h3><p>An error occurred query processing.</p></div>';
  }
}

// ── 4. BOOTSTRAP ROUTER ──────────────────────────────────────────────────
let appElement;

function render(path) {
  const cleanPath = path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path;
  const finalPath = (path === '/ai/demo/') ? '/ai/demo/' : cleanPath;
  
  let content = views[finalPath];
  if (!content) {
    if (/^\/archive\/\d{4}\/\d{1,2}$/.test(finalPath)) {
      content = views['/archive/month'];
    } else if (/^\/archive\/\d{4}$/.test(finalPath)) {
      content = views['/archive/year'];
    }
  }
  
  if (!content) content = views['404'];
  
  appElement.innerHTML = content;
  updateSidebarNav(path); 
  window.scrollTo(0, 0);

  if (/^\/archive\/\d{4}$/.test(finalPath)) {
    initArchiveYear();
  } else if (/^\/archive\/\d{4}\/\d{1,2}$/.test(finalPath)) {
    initArchiveMonth();
  }
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
      if (link.getAttribute('target') === '_blank' || href.startsWith('http') || href.startsWith('mailto:')) return;

      if (href.startsWith('/')) {
        e.preventDefault();
        navigate(href);
        if (window.innerWidth <= 768) closeSidebarNav();
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