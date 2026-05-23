// app.js — Application Logic & Routing (Dynamic Cloudflare Hub)

// ── 0. DYNAMIC VIEWS OBJECT ───────────────────────────────────────
// All views are now dynamically loaded from external module files!
// No hardcoded HTML or static posts remain in this core file.
const views = {};

// ── 1. BULLETPROOF ASYNCHRONOUS IMPORT LOADER ──────────────────────
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
      console.warn(`[Module Loader Warning] Skipping unresolvable file: "${mod.path}".`, err);
    }
  }
}

// ── 2. CLOUDFLARE WORKER DIRECT ENDPOINTS ─────────────────────────
const CLOUDFLARE_API_BASE = 'https://minescout-api.tmcarleton11.workers.dev';

const COMMENT_KEY_MAP = {
  "ai-comparison-final": "ai-comparison-gemini-chatgpt-grok-deepseek",
  "ai-live-comparison": "ai-live-voice-comparison",
  "ai-post-test-copilot": "ai-post-test-copiolt",
  "ai-post-test-meta": "ai-post-test-main",
  "snacktrack-ai": "snacktrack-m3",
  "attack-surface-release": "attack-surface-analyzer"
};

async function fetchFromCloudflareKV() {
  try {
    const response = await fetch(`${CLOUDFLARE_API_BASE}/api/content`);
    if (!response.ok) throw new Error('KV network response was not successful');
    return await response.json();
  } catch (err) {
    return [];
  }
}

async function fetchComments(postId) {
  const dbPostId = COMMENT_KEY_MAP[postId] || postId;
  try {
    const res = await fetch(`${CLOUDFLARE_API_BASE}/api/comments?postId=${encodeURIComponent(dbPostId)}`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return await res.json();
  } catch (err) {
    return [];
  }
}

async function postComment(postId, name, text) {
  const dbPostId = COMMENT_KEY_MAP[postId] || postId;
  try {
    const res = await fetch(`${CLOUDFLARE_API_BASE}/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: dbPostId, name, text, timestamp: Date.now() })
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

// Global Auth Disconnect Function
window.logoutAdmin = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('user_email');
  navigate('/');
};

// ── 3. INTERACTIVE DISCUSSION ELEMENT SETUP ───────────────────────
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

              <div id="comment-error-feedback" style="display: none; color: #ef4444; margin-top: 15px; font-weight: 600; font-size: 0.9rem;">
                  ⚠️ Failed to submit comment. Please check your connection and try again.
              </div>
          </form>
      </div>

      <div class="comments-list" id="comments-list-mount" style="display: flex; flex-direction: column; gap: 20px;">
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
  if (articleCard.querySelector('.comments-container-wrapper')) return;

  const commentsWrapper = document.createElement('div');
  commentsWrapper.className = 'comments-container-wrapper';
  commentsWrapper.innerHTML = COMMENTS_TEMPLATE;
  articleCard.appendChild(commentsWrapper);

  const form = document.getElementById('comment-submission-form');
  const listMount = document.getElementById('comments-list-mount');
  const errorFeedback = document.getElementById('comment-error-feedback');

  const renderCommentsList = async () => {
    listMount.innerHTML = `<p style="color: var(--md-outline); font-style: italic;">Loading discussion thread...</p>`;
    const comments = await fetchComments(postId);
    if (comments.length === 0) {
      listMount.innerHTML = `<p style="color: var(--md-outline); font-style: italic;">No comments yet. Be the first to share your thoughts!</p>`;
      return;
    }
    listMount.innerHTML = comments.map(c => `
      <div class="comment" style="background: var(--bg-glass); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 18px;">
        <div class="comment-meta" style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
          <span class="comment-author" style="font-weight: 700; color: var(--text-primary); font-size: 14px;">${escapeHTML(c.name)}</span>
          <span class="comment-time" style="color: var(--text-muted); font-size: 12px;">${new Date(c.timestamp).toLocaleDateString()}</span>
        </div>
        <div class="comment-text" style="color: var(--text-secondary); line-height: 1.6; font-size: 14px;">${escapeHTML(c.comment || c.text)}</div>
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
      if (errorFeedback) errorFeedback.style.display = 'none';

      const success = await postComment(postId, nameInput.value.trim(), textInput.value.trim());
      if (success) {
        textInput.value = '';
        await renderCommentsList();
      } else {
        if (errorFeedback) errorFeedback.style.display = 'block';
      }
      submitBtn.disabled = false;
      submitBtn.innerText = 'Post Comment';
    });
  }
}

// ── 4. SIDEBAR NAVIGATION ─────────────────────────────────────────
const MAIN_MENU = [
  { label: 'Home',    href: '/' },
  { label: 'Updates', href: '/Footer/updates.html' },
  { label: 'Archive', href: '/archive' },
  { label: 'About',   href: '/about' }
];

let sidebarNav, ownerText, aside, overlay, hamBtn;

function buildLinks(links, currentPath) {
  return links.map(link => {
    // Handling dynamic onClick actions (like Sign Out)
    if (link.onClick) {
        return `<a href="#" onclick="${link.onClick}; return false;" style="${link.style || ''}">${link.label}</a>`;
    }
    let isActive = false;
    if (link.href === '/' && currentPath === '/') isActive = true;
    else if (link.href !== '/' && currentPath.startsWith(link.href)) isActive = true;

    const activeClass = isActive ? ' class="active"' : '';
    const styleAttr = link.style ? ` style="${link.style}"` : '';
    return `<a href="${link.href}"${activeClass}${styleAttr}>${link.label}</a>`;
  }).join('\n');
}

function updateSidebarNav(path) {
  if (!sidebarNav) return;
  
  const dynamicMenu = [...MAIN_MENU];
  const email = localStorage.getItem('user_email');
  const hasToken = localStorage.getItem('admin_token');

  // Conditionally inject the Admin link ONLY if they are the admin
  if (hasToken && email === 'theminescout@minescout.net') {
    dynamicMenu.push({ label: 'Admin Deck', href: '/admin' });
  }

  // Inject a Sign In / Sign Out button directly into the Sidebar
  if (hasToken) {
    dynamicMenu.push({ 
        label: '<span class="material-symbols-rounded" style="font-size:18px; margin-right:6px; vertical-align:middle;">logout</span> Sign Out', 
        href: '#', 
        onClick: 'window.logoutAdmin()', 
        style: 'color: var(--md-outline); margin-top: 16px; border-top: 1px solid var(--md-outline-variant); padding-top: 16px;' 
    });
  } else {
    dynamicMenu.push({ 
        label: '<span class="material-symbols-rounded" style="font-size:18px; margin-right:6px; vertical-align:middle;">login</span> Sign In / Register', 
        href: '/login', 
        style: 'color: var(--md-primary); margin-top: 16px; border-top: 1px solid var(--md-outline-variant); padding-top: 16px; font-weight: bold;' 
    });
  }

  sidebarNav.innerHTML = buildLinks(dynamicMenu, path);
  ownerText.textContent = `\u00A9 ${new Date().getFullYear()} Minescouts Life`;
}

function closeSidebarNav() {
  if(aside) aside.classList.remove('open');
  if(overlay) overlay.className = 'nav-overlay';
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

function ensureHeaderToggle() {
  const headerContainer = document.querySelector('.site-title-container');
  if (headerContainer) {
    if (!headerContainer.querySelector('.header-menu-trigger')) {
      const trigger = document.createElement('button');
      trigger.className = 'header-menu-trigger';
      trigger.innerHTML = '<span class="material-symbols-rounded">menu</span>';
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (aside) {
          aside.classList.add('open');
          overlay.className = 'nav-overlay active';
          document.body.style.overflow = 'hidden';
        }
      });
      headerContainer.insertBefore(trigger, headerContainer.firstChild);
    }

    let rightControls = headerContainer.querySelector('.header-right-controls');
    if (!rightControls) {
        rightControls = document.createElement('div');
        rightControls.className = 'header-right-controls';
        rightControls.style.cssText = 'display: flex; align-items: center; gap: 16px; margin-left: auto;';
        headerContainer.appendChild(rightControls);
    }
    
    let authDiv = rightControls.querySelector('.header-auth');
    if (!authDiv) {
        authDiv = document.createElement('div');
        authDiv.className = 'header-auth';
        authDiv.style.cssText = 'display: flex; align-items: center; gap: 12px;';
        rightControls.appendChild(authDiv);
    }
    
    if (localStorage.getItem('admin_token')) {
        const email = localStorage.getItem('user_email');
        const isAdmin = email === 'theminescout@minescout.net';
        
        authDiv.innerHTML = `
          ${isAdmin ? `
          <a href="/admin" style="display: flex; align-items: center; gap: 4px; background: var(--md-primary-container); color: var(--md-primary); padding: 6px 12px; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 0.9rem;">
            <span class="material-symbols-rounded" style="font-size: 18px;">admin_panel_settings</span>
            Deck
          </a>` : ''}
          <button onclick="window.logoutAdmin()" style="display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid var(--md-outline-variant); color: var(--text-color); padding: 6px 12px; border-radius: 20px; font-weight: bold; font-size: 0.9rem; cursor: pointer; transition: 0.2s;">
            <span class="material-symbols-rounded" style="font-size: 18px;">logout</span>
            Sign Out
          </button>
        `;
    } else {
        authDiv.innerHTML = `
          <a href="/login" style="color: var(--text-color); text-decoration: none; font-weight: bold; font-size: 0.9rem;">Login</a>
          <a href="/signup" style="background: var(--md-primary); color: white; padding: 6px 16px; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 0.9rem; box-shadow: var(--shadow-1);">Sign Up</a>
        `;
    }

    if (!rightControls.querySelector('#theme-toggle-btn')) {
      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'theme-toggle-btn';
      toggleBtn.className = 'theme-toggle-btn';
      toggleBtn.style.cssText = 'background: transparent; border: none; color: var(--text-color); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 8px; border-radius: 50%; transition: background 0.2s;';
      
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      toggleBtn.innerHTML = `<span class="material-symbols-rounded" id="theme-toggle-icon" style="font-size: 22px;">${currentTheme === 'dark' ? 'light_mode' : 'dark_mode'}</span>`;
      
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        const icon = document.getElementById('theme-toggle-icon');
        if (icon) icon.textContent = next === 'dark' ? 'light_mode' : 'dark_mode';
      });
      rightControls.appendChild(toggleBtn);
    }
  }
}

// ── 5. DYNAMIC ARCHIVE INITIALIZERS ──────────────────────────────
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

  const posts = window.DYNAMIC_POSTS || [];

  posts.forEach(post => {
    const dateObj = new Date(post.timestamp);
    if (dateObj.getFullYear() === year && (dateObj.getMonth() + 1) === monthNum) {
      matchesCount++;
      const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const defaultImg = `https://placehold.co/600x400/e0e0e0/333333?text=${encodeURIComponent(post.title)}`;
      const postImg = post.imageUrl ? post.imageUrl : defaultImg;

      html += `
        <article class="post-card" data-post-id="${post.id || 'dynamic-post'}">
          <div class="post-image-wrapper">
            <img src="${postImg}" onerror="this.onerror=null; this.src='${defaultImg}';" alt="${escapeHTML(post.title)}" />
          </div>
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
    container.innerHTML = `<div class="empty-state"><h3>No Entries Logged</h3><p>No content logs were published to life.minescout.net in ${monthName} ${year}.</p></div>`;
  } else {
    container.innerHTML = html;
  }
}

function initHomepagePosts() {
  const container = document.getElementById('homepage-posts-container');
  if (!container) return;

  const posts = window.DYNAMIC_POSTS || [];
  
  if (!posts || posts.length === 0) {
      container.innerHTML = `<div class="empty-state"><h3>Mainframe Disconnected</h3><p>Could not load dynamic posts from the Cloudflare Database.</p></div>`;
      return;
  }

  const posts2026 = posts.filter(post => new Date(post.timestamp).getFullYear() === 2026);

  if (posts2026.length === 0) {
    container.innerHTML = `<div class="empty-state"><h3>No 2026 Articles Found</h3><p>Please check back later or review previous logs in <a href="/archive/2025" style="color: var(--md-primary); text-decoration: underline; font-weight: bold;">Last Year's Archive (2025)</a>.</p></div>`;
    return;
  }

  const monthlyGroups = {};
  posts2026.forEach(post => {
    const d = new Date(post.timestamp);
    const mIndex = d.getMonth();
    const groupKey = `${mIndex.toString().padStart(2, '0')}-${MONTH_NAMES[mIndex]}`;
    if (!monthlyGroups[groupKey]) monthlyGroups[groupKey] = [];
    monthlyGroups[groupKey].push(post);
  });

  const sortedMonthKeys = Object.keys(monthlyGroups).sort((a, b) => b.localeCompare(a));

  let html = '';
  sortedMonthKeys.forEach(groupKey => {
    const monthName = groupKey.split('-')[1];
    const monthlyPostsList = monthlyGroups[groupKey].sort((a, b) => b.timestamp - a.timestamp);

    html += `
      <div class="month-group-heading" style="grid-column: 1 / -1; margin-top: 32px; margin-bottom: 16px; border-bottom: 1px solid var(--md-outline-variant); padding-bottom: 8px;">
        <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; color: var(--md-primary); display: flex; align-items: center; gap: 8px; margin: 0;">
          <span class="material-symbols-rounded">calendar_month</span> ${monthName} 2026
        </h3>
      </div>
    `;

    monthlyPostsList.forEach(post => {
      const dateStr = new Date(post.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const defaultImg = `https://placehold.co/600x400/e0e0e0/333333?text=${encodeURIComponent(post.title)}`;
      const postImg = post.imageUrl ? post.imageUrl : defaultImg;

      html += `
        <article class="post-card">
          <div class="post-image-wrapper">
            <img src="${postImg}" onerror="this.onerror=null; this.src='${defaultImg}';" alt="${escapeHTML(post.title)}" />
          </div>
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
    });
  });

  html += `
    <div style="grid-column: 1 / -1; text-align: center; margin-top: 48px; margin-bottom: 16px;">
      <a href="/archive/2025" class="btn-primary" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none; padding: 12px 24px; border: 1px solid var(--md-primary); background: transparent; color: var(--md-primary); border-radius: var(--radius-full); font-weight: bold; font-size: 1rem; transition: 0.2s;">
        <span class="material-symbols-rounded">history</span> See Last Year's Posts (2025)
      </a>
    </div>
  `;

  container.innerHTML = html;
}

// ── 6. AUTHENTICATION HANDLERS ────────────────────────────────────
function initLoginHandler() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const btn = loginForm.querySelector('button');
        const errDiv = document.getElementById('login-error');

        btn.disabled = true;
        btn.innerText = 'Authenticating...';
        errDiv.style.display = 'none';

        try {
          const res = await fetch(`${CLOUDFLARE_API_BASE}/api/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();

          if (data.success) {
            localStorage.setItem('admin_token', data.token);
            localStorage.setItem('user_email', email); // Crucial for tracking roles!
            
            // Redirect based on role
            if (email === 'theminescout@minescout.net') {
                navigate('/admin'); 
            } else {
                navigate('/'); // Standard users get sent to the homepage
            }
          } else {
            errDiv.innerText = data.error || 'Access Denied. Invalid credentials.';
            errDiv.style.display = 'block';
          }
        } catch(err) {
           errDiv.innerText = 'Connection to mainframe failed.';
           errDiv.style.display = 'block';
        }
        btn.disabled = false;
        btn.innerText = 'Access Mainframe';
      });
    }
}

function initSignupHandler() {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const btn = signupForm.querySelector('button');
        const errDiv = document.getElementById('signup-error');

        btn.disabled = true;
        btn.innerText = 'Registering...';
        errDiv.style.display = 'none';

        try {
          const res = await fetch(`${CLOUDFLARE_API_BASE}/api/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();

          if (data.success) {
            if (data.token) {
                localStorage.setItem('admin_token', data.token);
                localStorage.setItem('user_email', email);
            }
            if (email === 'theminescout@minescout.net') {
                navigate('/admin'); 
            } else {
                navigate('/');
            }
          } else {
            errDiv.innerText = data.error || 'Failed to create account. Please check credentials.';
            errDiv.style.display = 'block';
          }
        } catch(err) {
           errDiv.innerText = 'Connection to Cloudflare failed. Be sure /api/signup is deployed on the Worker.';
           errDiv.style.display = 'block';
        }
        btn.disabled = false;
        btn.innerText = 'Sign Up';
      });
    }
}

function initForgotPasswordHandler() {
    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) {
      forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value;
        const btn = forgotForm.querySelector('button');
        const msgDiv = document.getElementById('forgot-message');

        btn.disabled = true;
        btn.innerText = 'Sending...';
        msgDiv.style.display = 'none';
        msgDiv.style.background = 'rgba(239, 68, 68, 0.1)';
        msgDiv.style.color = '#ef4444';
        msgDiv.style.borderColor = '#ef4444';

        try {
          const res = await fetch(`${CLOUDFLARE_API_BASE}/api/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          const data = await res.json();

          if (data.success) {
            msgDiv.style.background = 'rgba(16, 185, 129, 0.1)';
            msgDiv.style.color = 'var(--md-success)';
            msgDiv.style.borderColor = 'var(--md-success)';
            msgDiv.innerText = 'Recovery code sent! Redirecting...';
            msgDiv.style.display = 'block';
            
            setTimeout(() => {
              navigate('/reset-password');
            }, 2000);
          } else {
            msgDiv.innerText = data.error || 'Failed to send recovery code.';
            msgDiv.style.display = 'block';
            btn.disabled = false;
            btn.innerText = 'Send Recovery Code';
          }
        } catch(err) {
           msgDiv.innerText = 'Connection to server failed.';
           msgDiv.style.display = 'block';
           btn.disabled = false;
           btn.innerText = 'Send Recovery Code';
        }
      });
    }
}

function initResetPasswordHandler() {
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
      resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('reset-email').value;
        const resetCode = document.getElementById('reset-code').value;
        const newPassword = document.getElementById('reset-password-new').value;
        const btn = resetForm.querySelector('button');
        const errDiv = document.getElementById('reset-error');

        btn.disabled = true;
        btn.innerText = 'Verifying...';
        errDiv.style.display = 'none';

        try {
          const res = await fetch(`${CLOUDFLARE_API_BASE}/api/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, resetCode, newPassword })
          });
          const data = await res.json();

          if (data.success) {
            alert("Password successfully reset! You can now log in.");
            navigate('/login'); 
          } else {
            errDiv.innerText = data.error || 'Invalid or expired code.';
            errDiv.style.display = 'block';
            btn.disabled = false;
            btn.innerText = 'Confirm & Reset';
          }
        } catch(err) {
           errDiv.innerText = 'Connection to server failed.';
           errDiv.style.display = 'block';
           btn.disabled = false;
           btn.innerText = 'Confirm & Reset';
        }
      });
    }
}

// ── 7. BOOTSTRAP ROUTER ──────────────────────────────────────────────────
let appElement;

function render(path) {
  const cleanPath = path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path;
  const finalPath = (path === '/ai/demo/') ? '/ai/demo/' : cleanPath;
  
  // Guard the admin route strictly!
  if (finalPath === '/admin') {
    const token = localStorage.getItem('admin_token');
    const email = localStorage.getItem('user_email');
    
    // If not logged in at all, bounce to login
    if (!token) {
        navigate('/login');
        return;
    }
    // If logged in, but not the authorized admin, bounce to home
    if (email !== 'theminescout@minescout.net') {
        navigate('/');
        return;
    }
  }

  let content = views[finalPath];
  if (!content) {
    if (/^\/archive\/\d{4}\/\d{1,2}$/.test(finalPath)) content = views['/archive/month'];
    else if (/^\/archive\/\d{4}$/.test(finalPath)) content = views['/archive/year'];
  }
  
  // Fallback to 404 page if no route matches
  if (!content) content = views['/404'] || views['404'] || '<h1>404 - Page Not Found</h1>';
  
  appElement.innerHTML = content;
  updateSidebarNav(path); 
  ensureHeaderToggle(); 
  window.scrollTo(0, 0);

  // Initialize Route-Specific Logic
  if (finalPath === '/login') initLoginHandler();
  if (finalPath === '/signup') initSignupHandler();
  if (finalPath === '/forgot-password') initForgotPasswordHandler();
  if (finalPath === '/reset-password') initResetPasswordHandler();
  if (finalPath === '/') initHomepagePosts();

  if (finalPath !== '/') {
    const postMain = appElement.querySelector('main[data-post-id]');
    if (postMain) {
      const postId = postMain.getAttribute('data-post-id');
      if (postId) setupComments(postMain, postId);
    }
  }

  if (/^\/archive\/\d{4}$/.test(finalPath)) initArchiveYear();
  else if (/^\/archive\/\d{4}\/\d{1,2}$/.test(finalPath)) initArchiveMonth();
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
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  await loadModules(); 
  try {
    window.DYNAMIC_POSTS = await fetchFromCloudflareKV();
  } catch(e) {
    console.warn("Could not load dynamic posts from Cloudflare.", e);
    window.DYNAMIC_POSTS = [];
  }
  render(window.location.pathname);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}