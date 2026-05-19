// views/view-pages-archive.js — Consolidated Archive System

export const archiveViews = {

  // ── 1. ARCHIVE HUB DIRECTORY ─────────────────────────────────────
  '/archive': `
    <style>
        .archive-header {
            text-align: center;
            margin-bottom: 40px;
        }
        .archive-header h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 2.8rem;
            margin-top: 0;
            margin-bottom: 12px;
        }
        .archive-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            margin-bottom: 60px;
        }
        .archive-card {
            background: var(--card-bg);
            border: 1px solid var(--md-outline-variant);
            border-radius: var(--radius-md);
            padding: 24px;
            box-shadow: var(--shadow-1);
            transition: all 0.3s var(--motion-standard);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .archive-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-2);
            border-color: var(--md-primary);
        }
        .archive-card-image {
            width: 100%;
            height: 180px;
            object-fit: cover;
            border-radius: var(--radius-sm);
            margin-bottom: 16px;
            border: 1px solid var(--md-outline-variant);
        }
        .archive-card h3 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.4rem;
            margin-top: 0;
            margin-bottom: 12px;
        }
        .archive-card p {
            font-size: 0.95rem;
            opacity: 0.85;
            line-height: 1.5;
            margin-bottom: 20px;
            flex-grow: 1;
        }
        .archive-badge {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background: var(--md-primary-container);
            color: var(--md-on-primary-container);
            padding: 4px 10px;
            border-radius: var(--radius-full);
            display: inline-block;
            margin-bottom: 12px;
        }
        @media (max-width: 768px) {
            .archive-grid { grid-template-columns: 1fr; }
        }
    </style>

    <header class="main-header">
        <div class="container site-title-container">
            <div class="site-title-wrapper">
                <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                <p class="tagline">System Chronicles</p>
            </div>
        </div>
    </header>

    <div class="main-content-area">
        <div class="container">
            <div class="archive-header">
                <h1>Archives Hub</h1>
                <p>Select a collection year below to view monthly logs and structural publications.</p>
            </div>

            <div class="archive-grid">
                <!-- 2026 Collection -->
                <div class="archive-card">
                    <div>
                        <img src="/assests/images/archive/2026-hub.png" class="archive-card-image" onerror="this.onerror=null; this.src='https://placehold.co/600x400/e0e0e0/333333?text=2026+Collection';" alt="2026" />
                        <span class="archive-badge">Current Year</span>
                        <h3>2026 Collection</h3>
                        <p>Explore our active tech portfolios, hardware logs, and puppy timelines published throughout 2026.</p>
                    </div>
                    <a href="/archive/2026" class="btn-primary" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Explore Year →</a>
                </div>

                <!-- 2025 Collection -->
                <div class="archive-card">
                    <div>
                        <img src="/assests/images/archive/2025-hub.png" class="archive-card-image" onerror="this.onerror=null; this.src='https://placehold.co/600x400/e0e0e0/333333?text=2025+Collection';" alt="2025" />
                        <span class="archive-badge">Archived</span>
                        <h3>2025 Collection</h3>
                        <p>Revisit foundational benchmarks, interactive voting contests, and early AI comparison metrics.</p>
                    </div>
                    <a href="/archive/2025" class="btn-primary" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Explore Year →</a>
                </div>
            </div>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  // ── 2. DYNAMIC YEAR ARCHIVE ──────────────────────────────────────
  '/archive/year': `
    <style>
        .archive-header {
            text-align: center;
            margin-bottom: 40px;
        }
        .archive-header h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 2.8rem;
            margin-top: 0;
            margin-bottom: 12px;
        }
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--md-primary);
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s var(--motion-standard);
            margin-bottom: 16px;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .back-link:hover {
            filter: brightness(0.8);
            transform: translateX(-4px);
        }
        .month-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            margin-bottom: 60px;
        }
        .month-card {
            background: var(--card-bg);
            border: 1px solid var(--md-outline-variant);
            border-radius: var(--radius-md);
            padding: 24px;
            box-shadow: var(--shadow-1);
            transition: all 0.3s var(--motion-standard);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .month-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-2);
            border-color: var(--md-primary);
        }
        .month-card-image {
            width: 100%;
            height: 160px;
            object-fit: cover;
            border-radius: var(--radius-sm);
            margin-bottom: 16px;
            border: 1px solid var(--md-outline-variant);
        }
        .month-card h3 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.3rem;
            margin-top: 0;
            margin-bottom: 12px;
        }
        .month-card p {
            font-size: 0.95rem;
            opacity: 0.85;
            line-height: 1.5;
            margin-bottom: 20px;
            flex-grow: 1;
        }
        .month-badge {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background: var(--md-primary-container);
            color: var(--md-on-primary-container);
            padding: 4px 10px;
            border-radius: var(--radius-full);
            display: inline-block;
            margin-bottom: 12px;
        }
        @media (max-width: 768px) {
            .month-grid { grid-template-columns: 1fr; }
        }
    </style>

    <header class="main-header">
        <div class="container site-title-container">
            <div class="site-title-wrapper">
                <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                <p class="tagline" id="year-tagline">Yearly Archive</p>
            </div>
        </div>
    </header>

    <div class="main-content-area">
        <div class="container">
            <a href="/archive" class="back-link">
                <span class="material-symbols-rounded" style="font-size: 20px;">arrow_back</span>
                Back to Archives
            </a>

            <div class="archive-header">
                <h1 id="year-title">Loading Collection...</h1>
                <p>Browse through monthly timelines, project publishes, and hardware metrics.</p>
            </div>

            <div class="month-grid" id="month-cards-container">
                <!-- Dynamically populated monthly cards will load here -->
            </div>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  // ── 3. DYNAMIC MONTH ARCHIVE (AUTO-WORKS FOR ALL 24 MONTHS) ──────
  '/archive/month': `
    <style>
        .archive-header {
            text-align: center;
            margin-bottom: 40px;
        }
        .archive-header h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 2.8rem;
            margin-top: 0;
            margin-bottom: 8px;
        }
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--md-primary);
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s var(--motion-standard);
            margin-bottom: 16px;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .back-link:hover {
            filter: brightness(0.8);
            transform: translateX(-4px);
        }
        .posts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 32px;
            margin-bottom: 60px;
        }
        .post-card {
            background: var(--card-bg);
            border: 1px solid var(--md-outline-variant);
            border-radius: var(--radius-md);
            padding: 24px;
            box-shadow: var(--shadow-1);
            transition: all 0.3s var(--motion-standard);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .post-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-2);
            border-color: var(--md-primary);
        }
        .post-image-wrapper {
            width: 100%;
            height: 180px;
            overflow: hidden;
            border-radius: var(--radius-sm);
            margin-bottom: 16px;
            border: 1px solid var(--md-outline-variant);
        }
        .post-image-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .post-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.3rem;
            margin-top: 0;
            margin-bottom: 8px;
        }
        .post-meta {
            font-size: 0.85rem;
            color: var(--md-outline);
            margin-bottom: 12px;
            font-weight: 600;
        }
        .post-excerpt {
            font-size: 0.95rem;
            line-height: 1.6;
            opacity: 0.85;
            margin-bottom: 20px;
            flex-grow: 1;
        }
        .category-pill {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background: var(--md-primary-container);
            color: var(--md-on-primary-container);
            padding: 4px 10px;
            border-radius: var(--radius-full);
            display: inline-block;
            margin-bottom: 12px;
        }
        .empty-state {
            grid-column: 1 / -1;
            text-align: center;
            background: var(--md-surface-container);
            border: 1px dashed var(--md-outline-variant);
            border-radius: var(--radius-md);
            padding: 60px 24px;
        }
        .empty-state h3 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.5rem;
            margin-top: 0;
            margin-bottom: 8px;
        }
        .empty-state p {
            font-size: 1rem;
            color: var(--md-outline);
            margin-bottom: 0;
        }
        @media (max-width: 768px) {
            .posts-grid { grid-template-columns: 1fr; }
        }
    </style>

    <header class="main-header">
        <div class="container site-title-container">
            <div class="site-title-wrapper">
                <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                <p class="tagline" id="month-tagline">Monthly Archive</p>
            </div>
        </div>
    </header>

    <div class="main-content-area">
        <div class="container">
            <a href="/archive" id="month-back-link" class="back-link">
                <span class="material-symbols-rounded" style="font-size: 20px;">arrow_back</span>
                Back to Year
            </a>

            <div class="archive-header">
                <h1 id="month-title">Loading Month...</h1>
                <p>Viewing articles, logs, and updates matching this calendar window.</p>
            </div>

            <div class="posts-grid" id="month-posts-container">
                <!-- Dynamically populated monthly posts will load here -->
            </div>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `
};