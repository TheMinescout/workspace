(() => {
  const isArticle = document.body.classList.contains('article-page') || /\/content\/(archive\/)?articles\//.test(location.pathname);
  if (!isArticle) return;

  const match = location.pathname.match(/^(.*\/content\/)(?:archive\/)?articles\//);
  const root = match ? match[1].replace(/content\/$/, '') : '../../';
  const articlesUrl = root + 'pages';

  const leave = () => { window.location.assign(articlesUrl); };
  window.leaveArticle = leave;

  document.querySelectorAll('.instruction').forEach(btn => {
    btn.onclick = leave;
    btn.setAttribute('role','button');
    btn.setAttribute('tabindex','0');
    btn.setAttribute('aria-label','Return to articles');
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); leave(); }
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' || (e.altKey && e.key === 'ArrowLeft')) {
      e.preventDefault(); leave();
    }
  });

  const nav = document.querySelector('.article-nav');
  if (nav) {
    const first = nav.querySelector('a');
    if (first) { first.href = articlesUrl; first.textContent = '← ATLS / ARTICLES'; }
    const home = nav.querySelectorAll('a')[1];
    if (home) { home.href = root + 'index'; home.textContent = '⌂ MINESCOUT'; }
  }
})();
