// scripts/sidebar.js — Final Ultimate Fix

(function() {
  function initSidebar() {
    const PATH = window.location.pathname;

    // ── Configuration ────────────────────────────────────────────────
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
      { label: 'Overview',       href: '/ai/' },
      { label: 'Pricing',        href: '/ai/pricing' },
      { label: 'Client Work',    href: '/ai/clients' },
      { label: 'The Process',    href: '/ai/process' },
      { label: 'Live Demo',      href: '/ai/demo' },
      { label: 'Tools I Use',    href: '/ai/tools' },
      { label: 'ROI Calculator', href: '/ai/roi' }
    ];

    const AI_SECONDARY = [
      { label: 'Enquire',      href: '/contact' },
      { label: 'Legal',        href: '/ai/legal' },
      { label: 'Portfolio',    href: '/' },
      { label: 'Ask AI',       href: '/ask' },
      { label: 'Client Login', href: '/ai/clients/login' }
    ];

    let isAiSite = PATH.startsWith('/ai');
    const primaryLinks   = isAiSite ? AI_MENU : MAIN_MENU;
    const secondaryLinks = isAiSite ? AI_SECONDARY : MAIN_SECONDARY;

    function buildLinks(links) {
      return links.map(link => {
        let activeClass = '';
        if (link.href === '/' && PATH === '/') {
          activeClass = ' class="active"';
        } else if (link.href === '/ai/' && (PATH === '/ai' || PATH === '/ai/')) {
          activeClass = ' class="active"';
        } else if (link.href.length > 1 && PATH.startsWith(link.href)) {
           const nextChar = PATH.charAt(link.href.length);
           if (!nextChar || nextChar === '/') activeClass = ' class="active"';
        }
        return `<a href="${link.href}"${activeClass}>${link.label}</a>`;
      }).join('\n');
    }

    // ── Injection ────────────────────────────────────────────────────
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.id = 'nav-overlay';

    const aside = document.createElement('aside');
    aside.className = 'sidebar';
    aside.id = 'sidebar';
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
      <nav class="sidebar-nav">${buildLinks(primaryLinks)}</nav>
      <div class="sidebar-spacer"></div>
      <div class="sidebar-secondary">${buildLinks(secondaryLinks)}</div>
      <div class="sidebar-bottom" id="copyright"></div>
    `;

    const hamBtn = aside.querySelector('#hamburger');

    // Add to DOM
    document.body.appendChild(overlay);
    document.body.appendChild(aside);

    // Copyright
    const year = new Date().getFullYear();
    const owner = isAiSite ? 'Minescout AI' : 'Thomas Carleton';
    document.getElementById('copyright').textContent = `\u00A9 ${year} ${owner}`;

    // ── Logic ────────────────────────────────────────────────────────
    function openNav() {
      aside.classList.add('open');
      if (hamBtn) hamBtn.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      aside.classList.remove('open');
      if (hamBtn) hamBtn.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (hamBtn) {
      hamBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        aside.classList.contains('open') ? closeNav() : openNav();
      });
    }

    overlay.onclick = closeNav;

    aside.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => { if (window.innerWidth <= 768) closeNav(); });
    });

    window.addEventListener('resize', () => { if (window.innerWidth > 768) closeNav(); });
  }

  // Ensure it runs only when the body exists
  if (document.body) {
    initSidebar();
  } else {
    document.addEventListener('DOMContentLoaded', initSidebar);
  }
})();