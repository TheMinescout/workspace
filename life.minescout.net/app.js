// app.js — Application Logic & Routing (Manual Post Hybrid & Direct Cloudflare Comments)

// ── 0. MODULE CONFIGURATION & RUNTIME DEFINITIONS ─────────────────
const views = {
  // Static fallback views and profiles run out-of-the-box
  '/about': `
    <header class="main-header">
      <div class="container site-title-container">
        <div class="site-title-wrapper">
          <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
          <p class="tagline">About the Creator</p>
        </div>
      </div>
    </header>
    <div class="main-content-area">
      <div class="container">
        <article class="article-card">
          <h1>About Minescouts Life</h1>
          <p class="post-meta">System Profile • Active Build</p>
          <div class="post-content">
            <p>Welcome! I'm an ambitious builder, coder, and Eagle Scout. This digital space represents my live portfolio, software playgrounds, and chronicled observations of our family dogs, Monty and Nigel.</p>
            <h2>What I Build</h2>
            <p>I develop dynamic web applications, interactive physics systems, local AI models, and secure server environments. You can track my projects directly inside the coding projects sector or play around in the Beta Mainframe.</p>
            <h2>Scouting & Leadership</h2>
            <p>Having successfully achieved my Eagle Scout rank in March 2026, I enjoy applying structured project management, team collaboration, and community-centric development principles to everything I design.</p>
          </div>
        </article>
      </div>
    </div>
    <footer class="main-footer">
      <div class="container"><p>© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,
  
  '404': `
    <div class="container" style="padding: 40px 20px; text-align: center;">
      <h1>404 - Page Not Found</h1>
      <a href="/">Go Home</a>
    </div>
  `
};

// ── 1. MANUALLY MANAGED POSTS DATABASE ─────────────────────────────
// Edit, add, or remove items from this list whenever you make a new post!
const SYSTEM_POSTS = [
  {
    "id": "gemini3-vs-chatgpt-battle",
    "title": "Gemini 3 Pro vs. ChatGPT: The Ultimate Showdown",
    "category": "Tech Tips",
    "timestamp": 1764720000000,
    "summary": "Google just released Gemini 3 Pro, and everyone is asking: Is it finally better than ChatGPT? I put both models through three rigorous tests to find out.",
    "imageUrl": "assests/images/tech/gemini3-vs-chatgpt/Title.png",
    "linkUrl": "/tech/gemini3-vs-chatgpt",
    "linkText": "Read Article →"
  },
  {
    "id": "snack-guard",
    "title": "SnackGuard Pro: AI-Powered Theft Detection",
    "category": "Tech Tips",
    "timestamp": 1765152000000,
    "summary": "Tired of your snacks mysteriously disappearing from your desk? Meet SnackGuard Pro, an experimental AI-powered computer vision system designed to detect and log any unauthorized hands reaching for your treats.",
    "imageUrl": "assests/images/tech/snackguard/Title.png",
    "linkUrl": "/tech/snack-guard",
    "linkText": "Read Article →"
  },
  {
    "id": "montys-life",
    "title": "The Resilience of Monty: A Documentary Journey",
    "category": "Puppy Life",
    "timestamp": 1760662400000,
    "summary": "In the quiet corners of the Carleton home, a survivor reigns supreme. Monty, a dog who has faced the trials of a 'rough patch' in 2022, has emerged not just as a pet, but as a legend of domestic resilience.",
    "imageUrl": "assests/images/puppy-life/Monty-Life-Homepage.png",
    "linkUrl": "/puppy/monty",
    "linkText": "Read Documentary →"
  }
];

// ── 2. BULLETPROOF ASYNCHRONOUS IMPORT LOADER ──────────────────────
// Dynamically loads page layouts without breaking if files are missing
async function loadModules() {
  const modulesToLoad = [
    { path: './views/posts/view-posts-updates.js', name: 'postsUpdatesViews' },
    { path: './views/posts/view-posts-puppies.js', name: 'puppyViews' },
    { path: './views/posts/view-posts-beta.js', name: 'betaViews' },
    { path: './views/view-pages-landing.js', name: 'landingViews' },
    { path: './views/view-pages-analitics.js', name: 'analyticsViews' },
    { path: './views/view-admin.js', name: 'adminViews' },
    { path: './views/view-pages-archive.js', name: 'archiveViews' },
    { path: './views/posts/view-tech-2025q2.js', name: 'techViews2025Q2' },
    { path: './views/posts/view-tech-2025q3.js', name: 'techViews2025Q3' },
    { path: './views/posts/view-tech-2025q4.js', name: 'techViews2025Q4' },
    { path: './views/posts/view-tech-2026q1.js', name: 'techViews2026Q1' },
    { path: './views/posts/view-tech-2026q2.js', name: 'techViews2026Q2' }
  ];

  for (const mod of modulesToLoad) {
    try {
      const importedModule = await import(mod.path);
      if (importedModule && importedModule[mod.name]) {
        Object.assign(views, importedModule[mod.name]);
      }
    } catch (err) {
      console.warn(`[Module Loader Warning] Skipping unresolvable file: "${mod.path}". Mainframe remains stable.`, err);
    }
  }
}

// ── 3. CLOUDFLARE WORKER DIRECT ENDPOINTS ─────────────────────────
const CLOUDFLARE_API_BASE = 'https://minescout-api.tmcarleton11.workers.dev';

// Fetches comments associated with a specific postId
async function fetchComments(postId) {
  try {
    const res = await fetch(`${CLOUDFLARE_API_BASE}/api/comments?postId=${encodeURIComponent(postId)}`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return await res.json();
  } catch (err) {
    console.warn('[Cloudflare KV Comments] Could not load comments:', err);
    return [];
  }
}

// Sends a new comment payload to Cloudflare KV Namespace
async function postComment(postId, name, text) {
  try {
    const res = await fetch(`${CLOUDFLARE_API_BASE}/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, name, text, timestamp: Date.now() })
    });
    return res.ok;
  } catch (err) {
    console.error('[Cloudflare KV Comments Error] Post failed:', err);
    return false;
  }
}

// ── 4. INTERACTIVE DISCUSSION ELEMENT SETUP ───────────────────────
const COMMENTS_TEMPLATE = `
  <section class="comments-section" style="margin-top: 60px; border-top: 1px solid var(--md-outline-variant); padding-top: 40px;">
      <h2 style="font-size: 1.5rem; margin-bottom: 25px; color: var(--text-color); font-family: 'Space Grotesk', sans-serif; font-weight: 700;">Discussion</h2>

      <div class="comment-form-container" style="background: var(--md-surface-container); padding: 25px; border-radius: var(--radius-lg); border: 1px solid var(--md-outline-variant); margin-bottom: 40px; box-shadow: var(--shadow-1);">
          <h3 style="margin-top: 0; font-size: 1.1rem; margin-bottom: 20px; font-weight: 600; color: var(--text-color); font-family: 'Space Grotesk', sans-serif;">Leave a Comment</h3>
          
          <form id="comment-submission-form">
              <div class="form-group" style="margin-bottom: 15px;">
                  <label for="comment-author-name" style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 0.85rem; color: var(--md-outline); text-transform: uppercase;">Name</label>
                  <input type="text" id="comment-author-name" required placeholder="Your Name" 
                         style="width: 100%; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--md-outline-variant); background: var(--bg-void); color: var(--text-color); outline: none;">
              </div>
              
              <div class="form-group" style="margin-bottom: 20px;">
                  <label for="comment-body-text" style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 0.85rem; color: var(--md-outline); text-transform: uppercase;">Comment</label>
                  <textarea id="comment-body-text" rows="4" required placeholder="Share your thoughts..." 
                            style="width: 100%; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--md-outline-variant); background: var(--bg-void); color: var(--text-color); outline: none; resize: vertical;"></textarea>
              </div>
              
              <button type="submit" class="submit-button" style="display: inline-flex; align-items: center; justify-content: center; background-color: var(--md-primary); color: white; padding: 10px 24px; border-radius: var(--radius-full); font-weight: 600; border: none; cursor: pointer; transition: all 0.2s;">
                  Post Comment
              </button>
          </form>
      </div>

      <div class="comments-list" id="comments-list-mount" style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Comments injected dynamically -->
      </div>
  </section>
`;

function escapeHTML(str) {
  if (!str) return '';
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

async function setupComments(postContainer, postId) {
  const articleCard = postContainer.querySelector('.article-card') || postContainer;
  
  const commentsWrapper = document.createElement('div');
  commentsWrapper.className = 'comments-container-wrapper';
  commentsWrapper.innerHTML = COMMENTS_TEMPLATE;
  articleCard.appendChild(commentsWrapper);

  const form = document.getElementById('comment-submission-form');
  const listMount = document.getElementById('comments-list-mount');

  const renderCommentsList = async () => {
    listMount.innerHTML = `<p style="color: var(--md-outline); font-style: italic;">Loading discussion thread...</p>`;
    const comments = await fetchComments(postId);
    if (comments.length === 0) {
      listMount.innerHTML = `<p style="color: var(--md-outline); font-style: italic;">No comments yet. Be the first to share your thoughts!</p>`;
      return;
    }
    listMount.innerHTML = comments.map(c => `
      <div class="comment" style="background: var(--bg-glass); border: 1px solid var(--md-outline-variant); border-radius: var(--radius-md); padding: 18px;">
        <div class="comment-meta" style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; border-bottom: 1px solid var(--md-outline-variant); padding-bottom: 8px;">
          <span class="comment-author" style="font-weight: 700; color: var(--text-color); font-size: 14px;">${escapeHTML(c.name)}</span>
          <span class="comment-time" style="color: var(--md-outline); font-size: 12px;">${new Date(c.timestamp).toLocaleDateString()}</span>
        </div>
        <div class="comment-text" style="color: var(--text-secondary); line-height: 1.6; font-size: 14px;">${escapeHTML(c.text)}</div>
      </div>
    `).join('');
  };

  await renderCommentsList();

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('comment-author-name');
      const textInput = document.getElementById('comment-body-text');
      const submitBtn = form.querySelector('button');

      submitBtn.disabled = true;
      submitBtn.innerText = 'Posting...';

      const success = await postComment(postId, nameInput.value.trim(), textInput.value.trim());
      if (success) {
        textInput.value = '';
        await renderCommentsList();
      } else {
        alert('Failed to submit comment. Please verify your connection.');
      }
      submitBtn.disabled = false;
      submitBtn.innerText = 'Post Comment';
    });
  }
}

// ── 5. SIDEBAR NAVIGATION ─────────────────────────────────────────
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
  if(overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function initSidebar() {
  overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  
  aside = document.createElement('aside');
  aside.className = 'sidebar-nav-left';
  aside.innerHTML = `
    <div class="sidebar-header">
      <div class="sidebar-logo-wrap">
        <img src="assests/images/favicon.png" alt="ML" class="sidebar-logo" onerror="this.onerror=null; this.src='https://placehold.co/100/7c5aff/ffffff?text=ML';" />
        <div>
          <div class="sidebar-name">Minescouts Life</div>
          <div class="sidebar-tagline">life.minescout.net</div>
        </div>
      </div>
      <button class="hamburger" id="hamburger" aria-label="Toggle navigation">
        <span class="material-symbols-rounded">close</span>
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
      closeSidebarNav();
    });
  }

  overlay.onclick = closeSidebarNav;
}

// Dynamic injection of the Hamburger Menu Button in the top header
function ensureHeaderToggle() {
  const headerContainer = document.querySelector('.site-title-container');
  if (headerContainer && !headerContainer.querySelector('.header-menu-trigger')) {
    const trigger = document.createElement('button');
    trigger.className = 'header-menu-trigger';
    trigger.innerHTML = '<span class="material-symbols-rounded">menu</span>';
    trigger.ariaLabel = 'Open Navigation Menu';
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (aside) {
        aside.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
    headerContainer.insertBefore(trigger, headerContainer.firstChild);
  }
}

// ── 6. DYNAMIC ARCHIVE INITIALIZERS ──────────────────────────────
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
          <img src="assests/images/archive/${monthName} Archive.png" 
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

  let html = '';
  let matchesCount = 0;

  SYSTEM_POSTS.forEach(post => {
    const dateObj = new Date(post.timestamp);
    
    if (dateObj.getFullYear() === year && (dateObj.getMonth() + 1) === monthNum) {
      matchesCount++;
      const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      const imgHtml = post.imageUrl 
        ? `<div class="post-image-wrapper"><img src="${post.imageUrl}" onerror="this.onerror=null; this.src='https://placehold.co/600x400/e0e0e0/333333?text=Image+Unavailable';" alt="" /></div>` 
        : `<div class="post-image-wrapper" style="background: var(--md-surface-container); display:flex; align-items:center; justify-content:center; color: var(--md-outline);"><span class="material-symbols-rounded" style="font-size:48px;">article</span></div>`;

      html += `
        <article class="post-card" data-post-id="${post.id || 'dynamic-post'}">
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
}

// ── 7. BOOTSTRAP ROUTER ──────────────────────────────────────────────────
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
  ensureHeaderToggle(); // Inject the header menu button dynamically on render!
  window.scrollTo(0, 0);

  // Initialize comment boards dynamically for any rendered page with an ID tag!
  const postMain = appElement.querySelector('[data-post-id]');
  if (postMain) {
    const postId = postMain.getAttribute('data-post-id');
    if (postId) {
      setupComments(postMain, postId);
    }
  }

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

async function boot() {
  initSidebar();
  initRouter();
  await loadModules(); // Safely bootstrap all templates
  render(window.location.pathname);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}