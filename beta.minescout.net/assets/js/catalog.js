/* Minescout Beta catalogue — single source of truth for PRDS, ATLS and the release log. */
(() => {
  const STATUS = {
    stable: { label: 'STABLE', tone: 'green', meaning: 'Working, published software' },
    experimental: { label: 'EXPERIMENTAL', tone: 'yellow', meaning: 'Actively being developed or tested' },
    archived: { label: 'ARCHIVED', tone: 'dim', meaning: 'No longer actively maintained' },
  };

  const TYPES = {
    release: { label: 'RELEASE NOTE', tone: 'accent' },
    technical: { label: 'TECHNICAL', tone: 'cyan' },
    design: { label: 'DESIGN', tone: 'purple' },
    research: { label: 'RESEARCH', tone: 'green' },
    tutorial: { label: 'TUTORIAL', tone: 'yellow' },
    retrospective: { label: 'RETROSPECTIVE', tone: 'muted' },
    archive: { label: 'ARCHIVE', tone: 'dim' },
  };

  const projects = [
    {
      id: 'crypto-toolkit',
      title: 'Minescout Crypto Toolkit',
      shortTitle: 'Crypto Toolkit',
      tagline: 'A classical cryptography suite with a semi-automated substitution solver.',
      summary: 'Caesar, ROT13, Atbash, Affine, frequency analysis, and a substitution solver in one deployment. Everything runs locally in a single HTML file — no build step, no network calls, no dependencies.',
      status: 'stable',
      version: 'v1.0',
      released: '2026-09-29',
      updated: '2026-09-29',
      category: 'Cryptography',
      stack: 'Single-file HTML · offline',
      image: 'assets/images/projects/crypto-toolkit.png?v=2',
      launch: { label: 'OPEN CRYPTO-TOOLKIT.HTML', href: 'content/projects/crypto-toolkit', kind: 'app' },
      docs: { label: 'RELEASE NOTES', href: 'content/articles/crypto-toolkit-release' },
      source: 'Readable in the single HTML file',
      note: 'Offline-first. Plaintext and ciphertext never leave the page.',
      features: [
        'Caesar cipher with an interactive shift slider and one-click brute force.',
        'ROT13 and Atbash, the self-inverse classics.',
        'Affine cipher with full key validation and modular-inverse decryption.',
        'Live letter-frequency analysis against average English.',
        'Semi-automated substitution solver with a 26-letter tuning grid.',
        'Vigenère bridge for polyalphabetic attacks.',
      ],
      history: [
        { date: '2026', label: 'CONCEPT', title: 'One suite instead of many tools', body: 'The standalone ciphers were useful but scattered. The concept was a single deployment that walked from cipher mechanics to a real attack workflow.' },
        { date: '2026', label: 'PROTOTYPE', title: 'Frequency analysis first', body: 'The letter-frequency chart became the analytical core: it tells you whether you are looking at a monoalphabetic or polyalphabetic problem before you choose a tool.' },
        { date: '2026-09-29', label: 'RELEASE', title: 'v1.0 published', body: 'Caesar brute force, ROT13, Atbash, Affine, frequency analysis, a substitution solver, and a bridge to the Vigenère tool shipped together.' },
        { date: 'NEXT', label: 'ROADMAP', title: 'v2 candidates', body: 'A Kasiski examination widget, Vigenère absorption into the unified interface, and a modern classics tier (XOR, Base64, Morse).' },
      ],
      updates: [
        { date: '2026-09-29', title: 'Crypto Toolkit v1.0 released', note: 'The classical cipher suite shipped as one offline single-file deployment.' },
      ],
    },
    {
      id: 'crypto-toolkit-v2',
      title: 'Crypto Toolkit v2',
      shortTitle: 'Crypto Toolkit v2',
      tagline: 'The next iteration of the classical cryptography suite.',
      summary: 'An in-development branch of the Crypto Toolkit. The roadmap adds a Kasiski examination widget, absorbs Vigenère into the unified interface, and opens a modern classics tier.',
      status: 'experimental',
      version: 'v2 · in development',
      released: null,
      updated: '2026-11-27',
      category: 'Cryptography',
      stack: 'Single-file HTML · planned',
      launch: null,
      docs: { label: 'READ V1 RELEASE NOTES', href: 'content/articles/crypto-toolkit-release' },
      source: 'Not published yet',
      note: 'No build is available yet. Follow this project to see it in the release log.',
      features: [
        'Kasiski examination widget for estimating Vigenère key length.',
        'Vigenère absorption into the unified interface.',
        'Modern classics tier: XOR, Base64, and Morse.',
        'Carry the v1 offline-first constraint forward.',
      ],
      history: [
        { date: '2026-09-29', label: 'BASELINE', title: 'v1.0 shipped', body: 'The first suite established the attack workflow: frequency first, then brute force, then hand-tuned substitution.' },
        { date: '2026-11-27', label: 'PLANNING', title: 'v2 roadmap opened', body: 'The next branch focuses on the two gaps in the v1 workflow: key-length analysis and a unified polyalphabetic interface.' },
        { date: 'NEXT', label: 'BUILD', title: 'Prototype the Kasiski widget', body: 'The first v2 prototype will test coincidence counting directly against the existing frequency chart.' },
      ],
      updates: [
        { date: '2026-11-27', title: 'Crypto Toolkit v2 roadmap opened', note: 'Kasiski examination, unified Vigenère, and a modern classics tier are now tracked as an experimental build.' },
      ],
    },
    {
      id: 'ai-writer',
      title: 'AI Writer Suite',
      shortTitle: 'AI Writer',
      tagline: 'A browser-based HTML generator with AI drafting, assets, preview, and export.',
      summary: 'Compile standalone HTML documents in the browser. Draft with AI, embed images as base64, preview the result, then export HTML, PDF, or clipboard — no server required.',
      status: 'stable',
      version: 'v1.0',
      released: '2025-12-25',
      updated: '2025-12-25',
      category: 'Web tool',
      stack: 'Browser · Cloudflare Worker · Blob API',
      image: 'assets/images/projects/ai-writer.png?v=2',
      launch: { label: 'OPEN AI WRITER', href: 'content/projects/ai-writer', kind: 'app' },
      docs: { label: 'RELEASE NOTES', href: 'content/articles/ai-writer-release' },
      source: 'Not published',
      note: 'The generated document is a standalone file. Images are embedded, not linked.',
      features: [
        'AI drafting through the Minescout worker.',
        'Template engine with {{variable}} injection.',
        'Asset manager that converts images to base64.',
        'Local save state for work in progress.',
        'Live preview and open-in-tab preview.',
        'Export to standalone HTML, PDF, or clipboard.',
      ],
      history: [
        { date: '2025', label: 'CONCEPT', title: 'Documents that travel as one file', body: 'A generated page should not depend on a server, a build, or a folder of assets. The target was one portable HTML file.' },
        { date: '2025', label: 'PROTOTYPE', title: 'Template plus blob', body: 'The first build combined a {{variable}} template engine with in-memory Blob generation and a base64 asset path.' },
        { date: '2025-12-25', label: 'RELEASE', title: 'v1.0 published', body: 'The suite shipped with AI drafting, assets, preview, local save, and HTML/PDF/copy export.' },
        { date: 'NEXT', label: 'MAINTENANCE', title: 'Stable', body: 'No open development branch. Feature requests are still reviewed through the requests channel.' },
      ],
      updates: [
        { date: '2025-12-25', title: 'AI Writer Suite v1.0 released', note: 'A browser-based generator for standalone HTML documents.' },
      ],
    },
    {
      id: 'portfolio-projection',
      title: 'Portfolio Projection',
      shortTitle: 'Portfolio Projection',
      tagline: 'An interactive financial projection tool with phases, growth assumptions, and volatility bands.',
      summary: 'Model compound growth across changing contribution phases. Set a base CAGR and a volatility range, then compare best-case, base-case, and worst-case paths in one chart.',
      status: 'stable',
      version: 'v1.0',
      released: '2025-12-27',
      updated: '2025-12-27',
      category: 'Finance',
      stack: 'Browser · chart engine',
      image: 'assets/images/projects/portfolio-tool.png?v=2',
      launch: { label: 'LAUNCH SIMULATION', href: 'content/projects/portfolio-tool', kind: 'app' },
      docs: { label: 'RELEASE NOTES', href: 'content/articles/portfolio-release' },
      source: 'Readable in the single HTML file',
      note: 'A modeling aid, not financial advice. All inputs stay in the browser.',
      features: [
        'Phased contributions for different life stages.',
        'Base CAGR and volatility assumptions.',
        'Best-case, base-case, and worst-case paths.',
        'High-contrast projection chart.',
      ],
      history: [
        { date: '2025', label: 'CONCEPT', title: 'Projection, not prediction', body: 'A single growth number hides the effect of changing contributions. The tool was built to show phases and ranges instead.' },
        { date: '2025', label: 'PROTOTYPE', title: 'Phase model', body: 'The first model stacked contribution phases and drew a range around a base CAGR.' },
        { date: '2025-12-27', label: 'RELEASE', title: 'v1.0 published', body: 'The projection interface shipped with phased inputs, volatility bands, and a chart engine.' },
        { date: 'NEXT', label: 'MAINTENANCE', title: 'Stable', body: 'No open development branch. The tool remains available as a browser utility.' },
      ],
      updates: [
        { date: '2025-12-27', title: 'Portfolio Projection v1.0 released', note: 'Phased contributions, CAGR assumptions, and volatility scenarios.' },
      ],
    },
    {
      id: 'vigenere-tool',
      title: 'Vigenère Tool',
      shortTitle: 'Vigenère',
      tagline: 'A standalone Vigenère encoder, decoder, and brute-force breaker.',
      summary: 'Runs directly in the browser with no build step. Encrypt, decrypt, or run an intelligent brute-force pass, with an optional dictionary attack when an external API is available.',
      status: 'stable',
      version: 'v1.0',
      released: '2025-12-05',
      updated: '2025-12-05',
      category: 'Cryptography',
      stack: 'Single-file HTML · offline-first',
      image: 'assets/images/projects/vigenere-tool.png?v=2',
      launch: { label: 'OPEN VIGENÈRE TOOL', href: 'content/projects/vigenere-tool', kind: 'app' },
      docs: { label: 'RELEASE NOTES', href: 'content/articles/vigenere-release' },
      source: 'Readable in the single HTML file',
      note: 'The local HTML file is the canonical project entry point.',
      features: [
        'Local encryption and decryption.',
        'Intelligent brute-force pass with candidate scoring.',
        'Dictionary attack when an external API is available.',
        'Runs without an active internet connection.',
      ],
      history: [
        { date: '2025', label: 'CONCEPT', title: 'A local cipher workbench', body: 'The tool began as a way to demonstrate why a polyalphabetic cipher defeats simple frequency analysis.' },
        { date: '2025', label: 'PROTOTYPE', title: 'Break mode', body: 'Encryption and decryption were straightforward. The interesting work was candidate scoring for the auto-break pass.' },
        { date: '2025-12-05', label: 'RELEASE', title: 'v1.0 published', body: 'The standalone browser tool shipped as the canonical Vigenère entry point.' },
        { date: '2026', label: 'INTEGRATION', title: 'Joined the toolkit', body: 'The Vigenère tool now acts as the polyalphabetic tier of the Crypto Toolkit, and is a candidate for absorption in v2.' },
      ],
      updates: [
        { date: '2025-12-05', title: 'Vigenère Tool v1.0 released', note: 'A standalone, offline-first Vigenère utility.' },
      ],
    },
    {
      id: 'cognisearch-v5',
      title: 'Cognisearch v5',
      shortTitle: 'Cognisearch',
      tagline: 'A search and synthesis engine distributed as a downloadable source archive.',
      summary: 'The AI News Synthesis engine rebranded and rebuilt for speed. Cognisearch v5 is a research build distributed as a source archive; it runs locally with Node.js.',
      status: 'stable',
      version: 'v5.0',
      released: '2025-11-30',
      updated: '2025-11-30',
      category: 'Research tool',
      stack: 'Node.js · local server · source archive',
      launch: { label: 'DOWNLOAD V5 PACKAGE · 73 KB', href: 'content/projects/cognisearch-v5.zip', kind: 'download' },
      docs: { label: 'RELEASE NOTES', href: 'content/articles/cognisearch' },
      source: 'Included in the download',
      note: 'A source archive, not a hosted application. Requires Node.js and a local shell.',
      features: [
        'Rebranded from AI News Synthesis with the core logic intact.',
        'Faster synthesis engine in the v5 architecture.',
        'Downloadable source archive with local setup.',
        'Stable branch, maintained as a research build.',
      ],
      history: [
        { date: '2025-10', label: 'ORIGIN', title: 'AI News Synthesis v1', body: 'The original build collected and synthesized news sources into a single research output.' },
        { date: '2025-11', label: 'REBRAND', title: 'Cognisearch', body: 'The engine kept its core logic but took on a clearer name and a faster architecture.' },
        { date: '2025-11-30', label: 'RELEASE', title: 'v5 published', body: 'The v5 source archive shipped with local setup instructions.' },
        { date: 'NEXT', label: 'MAINTENANCE', title: 'No open branch', body: 'The project has not had a release since November 2025. The catalogue records that date instead of implying active development.' },
      ],
      updates: [
        { date: '2025-11-30', title: 'Cognisearch v5 released', note: 'The research engine shipped as a downloadable source archive.' },
      ],
    },
    {
      id: 'ai-news-v1',
      title: 'AI News Synthesis v1',
      shortTitle: 'AI News v1',
      tagline: 'Legacy research build, superseded by Cognisearch v5.',
      summary: 'The first AI News Synthesis archive. Kept for reference and history; it is no longer maintained.',
      status: 'archived',
      version: 'v1.0',
      released: '2025-10-01',
      updated: '2025-10-01',
      category: 'Research tool',
      stack: 'Legacy source archive',
      launch: { label: 'DOWNLOAD LEGACY ARCHIVE', href: 'content/archive/projects/ai-news-v1.zip', kind: 'download' },
      docs: { label: 'ARCHIVED NOTES', href: 'content/archive/articles/news-v1' },
      source: 'Not published',
      note: 'Archived. Use Cognisearch v5 instead.',
      features: [
        'The original synthesis prototype.',
        'Legacy source archive retained for reference.',
      ],
      history: [
        { date: '2025-10-01', label: 'RELEASE', title: 'v1 published', body: 'The first AI News Synthesis build.' },
        { date: '2025-11', label: 'SUPERSEDED', title: 'Rebranded as Cognisearch', body: 'The engine moved to Cognisearch v5. This archive is kept for history only.' },
        { date: 'NOW', label: 'ARCHIVED', title: 'No longer maintained', body: 'The catalogue marks it archived rather than active.' },
      ],
      updates: [
        { date: '2025-10-01', title: 'AI News Synthesis v1 archived', note: 'Superseded by Cognisearch v5.' },
      ],
    },
  ];

  const articles = [
    {
      id: 'ideas-become-software',
      title: 'Ideas Become Software',
      href: 'content/articles/ideas-become-software',
      date: '2026-11-27',
      summary: 'Why Beta is an independent software lab, what changed in the catalogue, and how ATLS, PRDS, and the release log fit together.',
      types: ['design', 'research'],
      project: null,
      read: '5 MIN',
    },
    {
      id: 'crypto-toolkit-release',
      title: 'RELEASE: Minescout Crypto Toolkit',
      href: 'content/articles/crypto-toolkit-release',
      date: '2026-09-29',
      summary: 'The classical cipher suite shipped as one offline single-file deployment, with a workflow for breaking each layer.',
      types: ['release', 'technical'],
      project: 'crypto-toolkit',
      read: '4 MIN',
    },
    {
      id: 'minescout-beta-evolution',
      title: 'The Evolution of Minescout Beta',
      href: 'content/articles/minescout-beta-evolution',
      date: '2026-08-09',
      summary: 'From terminal experiment to research archive: the design history behind the ATLS and PRDS pivot.',
      types: ['design', 'retrospective'],
      project: null,
      read: '6 MIN',
    },
    {
      id: 'vigenere-release',
      title: 'RELEASE: Vigenère Crypto Tool',
      href: 'content/articles/vigenere-release',
      date: '2025-12-05',
      summary: 'The Vigenère workbench shipped as a standalone local HTML file with encryption, decryption, and auto-break.',
      types: ['release'],
      project: 'vigenere-tool',
      read: '2 MIN',
    },
    {
      id: 'cognisearch',
      title: 'RELEASE: Cognisearch v5',
      href: 'content/articles/cognisearch',
      date: '2025-11-30',
      summary: 'AI News Synthesis rebranded as Cognisearch, with a faster v5 architecture and a downloadable source package.',
      types: ['release'],
      project: 'cognisearch-v5',
      read: '3 MIN',
    },
    {
      id: 'ai-writer-release',
      title: 'RELEASE: AI Writer Suite',
      href: 'content/articles/ai-writer-release',
      date: '2025-12-25',
      summary: 'A browser-based generator for standalone HTML documents, with templates, assets, preview, and export.',
      types: ['release'],
      project: 'ai-writer',
      read: '2 MIN',
    },
    {
      id: 'portfolio-release',
      title: 'RELEASE: Portfolio Projection',
      href: 'content/articles/portfolio-release',
      date: '2025-12-27',
      summary: 'A financial modeling tool with phased contributions, CAGR assumptions, and volatility scenarios.',
      types: ['release'],
      project: 'portfolio-projection',
      read: '2 MIN',
    },
    {
      id: 'news-v1',
      title: 'AI News Synthesis v1',
      href: 'content/archive/articles/news-v1',
      date: '2025-10-01',
      summary: 'Legacy release notes for the first synthesis prototype, kept for reference.',
      types: ['archive'],
      project: 'ai-news-v1',
      read: '3 MIN',
    },
  ];

  const dateValue = (iso) => new Date(`${iso}T00:00:00`).getTime();
  articles.sort((a, b) => dateValue(b.date) - dateValue(a.date));

  function formatDate(iso) {
    if (!iso) return '—';
    if (/^\d{4}$/.test(iso)) return iso;
    const value = dateValue(iso);
    if (Number.isNaN(value)) return iso;
    return new Date(value)
      .toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      .toUpperCase();
  }

  function getProject(id) {
    return projects.find((project) => project.id === id) || null;
  }

  function getArticle(id) {
    return articles.find((article) => article.id === id) || null;
  }

  function statusBadge(status) {
    const meta = STATUS[status];
    return meta ? `<span class="status-badge tone-${meta.tone}">${meta.label}</span>` : '';
  }

  function typeBadge(type) {
    const meta = TYPES[type];
    return meta ? `<span class="type-badge tone-${meta.tone}">${meta.label}</span>` : '';
  }

  function followedIds() {
    try {
      const value = JSON.parse(localStorage.getItem('ms_followed_projects') || '[]');
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function isFollowed(id) {
    return followedIds().includes(id);
  }

  function toggleFollow(id) {
    const ids = followedIds();
    const index = ids.indexOf(id);
    if (index >= 0) ids.splice(index, 1);
    else ids.push(id);
    localStorage.setItem('ms_followed_projects', JSON.stringify(ids));
    return ids.includes(id);
  }

  function projectUpdates(project) {
    return (project.updates || []).map((update) => ({
      kind: 'project',
      id: project.id,
      date: update.date,
      title: update.title,
      note: update.note || '',
      status: project.status,
      category: project.category,
      href: `project?id=${encodeURIComponent(project.id)}`,
    }));
  }

  function articleEntry(article) {
    return {
      kind: 'article',
      id: article.id,
      date: article.date,
      title: article.title,
      note: article.summary,
      types: article.types,
      project: article.project,
      href: article.href,
    };
  }

  function activity() {
    const items = [];
    projects.forEach((project) => items.push(...projectUpdates(project)));
    articles.forEach((article) => items.push(articleEntry(article)));
    return items.sort((a, b) => dateValue(b.date) - dateValue(a.date));
  }

  function recentActivity(sinceIso, limit) {
    const since = sinceIso ? new Date(sinceIso).getTime() : null;
    const items = activity().filter((item) => !since || dateValue(item.date) > since);
    return typeof limit === 'number' ? items.slice(0, limit) : items;
  }

  function projectsByStatus(status) {
    return projects.filter((project) => project.status === status);
  }

  window.MS_CATALOG = {
    STATUS,
    TYPES,
    projects,
    articles,
    formatDate,
    getProject,
    getArticle,
    statusBadge,
    typeBadge,
    followedIds,
    isFollowed,
    toggleFollow,
    activity,
    recentActivity,
    projectsByStatus,
  };
})();
