// views/view-pages-landing.js — Core Landing & Category Pages

export const landingViews = {

  // ── 1. THE MAIN HOMEPAGE ──────────────────────────────────────────
  '/': `
    <style>
      .home-hero-card {
        background: linear-gradient(135deg, var(--md-primary-container), rgba(255,255,255,0.05));
        border: 1px solid var(--md-primary);
        border-radius: var(--radius-lg);
        padding: 40px;
        margin-bottom: 40px;
        box-shadow: var(--shadow-2);
        position: relative;
        overflow: hidden;
      }
      .home-hero-card h1 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 3rem;
        margin-top: 0;
        margin-bottom: 12px;
        line-height: 1.1;
      }
      .home-hero-card p {
        font-size: 1.15rem;
        opacity: 0.85;
        max-width: 600px;
        line-height: 1.6;
        margin-bottom: 24px;
      }
      .home-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 32px;
        margin-bottom: 40px;
      }
      .home-card {
        background: var(--card-bg);
        border: 1px solid var(--md-outline-variant);
        border-radius: var(--radius-md);
        padding: 32px;
        box-shadow: var(--shadow-1);
        transition: all 0.3s var(--motion-standard);
        display: flex;
        flex-direction: column;
      }
      .home-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-2);
        border-color: var(--md-primary);
      }
      .home-card h2 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.6rem;
        margin-top: 0;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--text-color);
      }
      .home-card p {
        font-size: 1rem;
        line-height: 1.6;
        opacity: 0.85;
        margin-bottom: 24px;
        flex-grow: 1;
      }
      .home-card .btn-primary {
        align-self: flex-start;
      }
      .home-metrics-bar {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        background: var(--md-surface-container);
        border: 1px solid var(--md-outline-variant);
        border-radius: var(--radius-md);
        padding: 24px;
        margin-bottom: 40px;
        box-shadow: var(--shadow-1);
      }
      .metric-item {
        text-align: center;
      }
      .metric-value {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 2.2rem;
        font-weight: 700;
        color: var(--md-primary);
        line-height: 1;
        margin-bottom: 6px;
      }
      .metric-label {
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--md-outline);
      }
      @media (max-width: 768px) {
        .home-hero-card { padding: 24px; }
        .home-hero-card h1 { font-size: 2.2rem; }
        .home-grid { grid-template-columns: 1fr; }
      }
    </style>

    <header class="main-header">
      <div class="container site-title-container">
        <div class="site-title-wrapper">
          <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
          <p class="tagline">Life of a Smart Kid</p>
        </div>
      </div>
    </header>

    <div class="main-content-area">
      <div class="container">
        <div class="home-hero-card">
          <h1>Welcome to My Digital Workspace</h1>
          <p>I build things on the internet — from autonomous LLM endpoints to Minecraft server utility ecosystems and responsive physics games. This is where I document my journey.</p>
          <a href="/about" class="btn-primary" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none; padding: 12px 24px; background: var(--md-primary); color: white; border-radius: var(--radius-full); font-weight: bold; font-size: 1rem; transition: 0.2s;">
            <span class="material-symbols-rounded">person</span> Read My Story
          </a>
        </div>

        <div class="home-metrics-bar">
          <div class="metric-item">
            <div class="metric-value">25</div>
            <div class="metric-label">Tech Deep-Dives</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">100%</div>
            <div class="metric-label">Eagle Scout Rank</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">2</div>
            <div class="metric-label">Chaotic Puppies</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">99.9%</div>
            <div class="metric-label">Mainframe Uptime</div>
          </div>
        </div>

        <div class="home-grid">
          <div class="home-card">
            <h2><span class="material-symbols-rounded">terminal</span> Coding & Tech</h2>
            <p>Sift through my software portfolios, AI performance benchmarks, research comparisons, and dynamic codebase status tools.</p>
            <a href="/tech" class="btn-primary" style="text-decoration: none; color: var(--md-primary); font-weight: bold; display: inline-flex; align-items: center; gap: 4px;">
              Explore Tech Tips <span class="material-symbols-rounded">arrow_forward</span>
            </a>
          </div>

          <div class="home-card">
            <h2><span class="material-symbols-rounded">pets</span> Puppy Life</h2>
            <p>Chronicles of the Carleton pack: Monty’s recovery arc, Nigel’s perpetual chaos, backyard sparring, and dietary restrictions.</p>
            <a href="/puppy-life" class="btn-primary" style="text-decoration: none; color: var(--md-primary); font-weight: bold; display: inline-flex; align-items: center; gap: 4px;">
              View timelines <span class="material-symbols-rounded">arrow_forward</span>
            </a>
          </div>

          <div class="home-card">
            <h2><span class="material-symbols-rounded">sports_esports</span> Survival Server</h2>
            <p>Access rules, world checklists, project updates, and maps for the Carly Fam Minecraft Survival Server.</p>
            <a href="/minecraft-server" class="btn-primary" style="text-decoration: none; color: var(--md-primary); font-weight: bold; display: inline-flex; align-items: center; gap: 4px;">
              Launch Server Hub <span class="material-symbols-rounded">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <footer class="main-footer">
      <div class="container">
        <p id="copyright">© 2026 Minescouts Life. All rights reserved.</p>
      </div>
    </footer>
  `,

  // ── 2. TECH TIPS DIRECTORY ───────────────────────────────────────
  '/tech': `
    <style>
      .archive-header {
        margin-bottom: 40px;
        text-align: center;
      }
      .archive-header h1 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 2.8rem;
        margin-bottom: 8px;
      }
      .quarterly-section {
        margin-bottom: 48px;
        border-bottom: 1px solid var(--md-outline-variant);
        padding-bottom: 32px;
      }
      .quarterly-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.8rem;
        color: var(--md-primary);
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .articles-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
      }
      .article-snippet-card {
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
      .article-snippet-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-2);
        border-color: var(--md-primary);
      }
      .article-snippet-card h3 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.3rem;
        margin-top: 0;
        margin-bottom: 12px;
      }
      .article-snippet-card p {
        font-size: 0.95rem;
        opacity: 0.85;
        line-height: 1.5;
        margin-bottom: 16px;
        flex-grow: 1;
      }
      .article-date {
        font-size: 0.8rem;
        color: var(--md-outline);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 8px;
      }
      @media (max-width: 768px) {
        .articles-list { grid-template-columns: 1fr; }
      }
    </style>

    <header class="main-header">
      <div class="container site-title-container">
        <div class="site-title-wrapper">
          <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
          <p class="tagline">Tech Tips Hub</p>
        </div>
      </div>
    </header>

    <div class="main-content-area">
      <div class="container">
        <div class="archive-header">
          <h1>Technical Deep-Dives</h1>
          <p>Documenting tests, system optimizations, and software development.</p>
        </div>

        <!-- 2026 Q2 -->
        <section class="quarterly-section">
          <h2 class="quarterly-title"><span class="material-symbols-rounded">calendar_today</span> 2026 Q2</h2>
          <div class="articles-list">
            <div class="article-snippet-card">
              <div>
                <div class="article-date">June 18, 2026</div>
                <h3>AI Comparison: The Final Review</h3>
                <p>The final showdown ranking Gemini, ChatGPT, Grok, and DeepSeek across programming, reasoning speed, and daily usefulness.</p>
              </div>
              <a href="/tech/ai-comparison" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Article →</a>
            </div>
            <div class="article-snippet-card">
              <div>
                <div class="article-date">May 20, 2026</div>
                <h3>Dynamic Attack Surface Analyzer</h3>
                <p>Building a fully locally-computed Llama-3 threat model tool with canvas particle visualizations.</p>
              </div>
              <a href="/tech/attack-surface-analyzer" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Article →</a>
            </div>
            <div class="article-snippet-card">
              <div>
                <div class="article-date">May 5, 2026</div>
                <h3>SnackTrack M3</h3>
                <p>Developing an interactive dashboard that leverages local LLM engines to estimate nutritional metrics from descriptions.</p>
              </div>
              <a href="/tech/snacktrack-ai" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Article →</a>
            </div>
            <div class="article-snippet-card">
              <div>
                <div class="article-date">April 14, 2026</div>
                <h3>SnackGuard Pro: Theft Detection</h3>
                <p>Implementing client-side camera threat logging to stop pantry thievery with instant bounding-box triggers.</p>
              </div>
              <a href="/tech/snack-guard" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Article →</a>
            </div>
          </div>
        </section>

        <!-- 2026 Q1 -->
        <section class="quarterly-section">
          <h2 class="quarterly-title"><span class="material-symbols-rounded">calendar_today</span> 2026 Q1</h2>
          <div class="articles-list">
            <div class="article-snippet-card">
              <div>
                <div class="article-date">March 15, 2026</div>
                <h3>Mechanical vs. Membrane Keyboards</h3>
                <p>The clicky, tactile click-down reviewing why mechanical key switches reign supreme for PC gaming loops.</p>
              </div>
              <a href="/tech/mech-vs-memb" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Article →</a>
            </div>
            <div class="article-snippet-card">
              <div>
                <div class="article-date">March 2, 2026</div>
                <h3>Nikon D7200 in 2026 Review</h3>
                <p>Testing the sharp legendary 2015 DSLR body against new Mirrorless competitors on dynamic range and battery performance.</p>
              </div>
              <a href="/tech/d7200-review" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Article →</a>
            </div>
            <div class="article-snippet-card">
              <div>
                <div class="article-date">February 12, 2026</div>
                <h3>Terra Cotta Suite</h3>
                <p>Launching a responsive multi-game classic arcade catalog fully driven by LLM code architectures.</p>
              </div>
              <a href="/tech/terra-cotta" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Article →</a>
            </div>
            <div class="article-snippet-card">
              <div>
                <div class="article-date">January 28, 2026</div>
                <h3>OpenScan-AI perfector</h3>
                <p>Building an active client-side scanning layout to process documents with manual cropping frameworks.</p>
              </div>
              <a href="/tech/openscan-ai-battle" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Article →</a>
            </div>
            <div class="article-snippet-card">
              <div>
                <div class="article-date">January 10, 2026</div>
                <h3>GeoMaster Pro Map Quizzer</h3>
                <p>Custom geographical game system running dynamic presets and local lists on a gamified scoreboard.</p>
              </div>
              <a href="/tech/geomaster-pro" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Article →</a>
            </div>
          </div>
        </section>

        <!-- 2025 Q4 -->
        <section class="quarterly-section">
          <h2 class="quarterly-title"><span class="material-symbols-rounded">calendar_today</span> 2025 Q4</h2>
          <div class="articles-list">
            <div class="article-snippet-card">
              <div>
                <div class="article-date">December 3, 2025</div>
                <h3>Gemini 3 Pro vs. ChatGPT Showdown</h3>
                <p>Evaluating literary creativity, local logic puzzles, and JavaScript generation inside raw code setups.</p>
              </div>
              <a href="/tech/gemini3-vs-chatgpt" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Article →</a>
            </div>
            <div class="article-snippet-card">
              <div>
                <div class="article-date">November 15, 2025</div>
                <h3>Gemini Fast vs. GPT-4o Image Gen</h3>
                <p>The rendering test grading photorealism, cursive street-sign spellings, and hand rendering detail.</p>
              </div>
              <a href="/tech/gemini-fast-vs-gpt4o-image" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Article →</a>
            </div>
          </div>
        </section>

        <!-- 2025 Q3 -->
        <section class="quarterly-section">
          <h2 class="quarterly-title"><span class="material-symbols-rounded">calendar_today</span> 2025 Q3</h2>
          <div class="articles-list">
            <div class="article-snippet-card">
              <div>
                <div class="article-date">August 28, 2025</div>
                <h3>Beyond the Screen: Live AI Voice</h3>
                <p>Putting real-time conversation voices through complex audio cues, singing, and packing summaries.</p>
              </div>
              <a href="/tech/ai-live-comparison" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Article →</a>
            </div>
            <div class="article-snippet-card">
              <div>
                <div class="article-date">August 19, 2025</div>
                <h3>AI Benchmarks: Comparing Titans</h3>
                <p>Meta AI analyzes coding, logic, speed, and productivity features across seven mainstream models.</p>
              </div>
              <a href="/tech/ai-benchmarks" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Article →</a>
            </div>
            <div class="article-snippet-card">
              <div>
                <div class="article-date">July 22, 2025</div>
                <h3>AI Image Removal Face-Off</h3>
                <p>A round-by-round voting competition comparing the object erasure capabilities of Gemini against PixelCut.</p>
              </div>
              <a href="/tech/ai-image-removal-competition" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Article →</a>
            </div>
            <div class="article-snippet-card">
              <div>
                <div class="article-date">July 2, 2025</div>
                <h3>AI Model DeepResearch Comparison</h3>
                <p>An in-depth analysis on how engines avoid hallucinating, cite resources, and structure connections.</p>
              </div>
              <a href="/tech/ai-deepresearch-comparison" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Article →</a>
            </div>
          </div>
        </section>

        <!-- Older Q2 2025 -->
        <section class="quarterly-section" style="border-bottom: none;">
          <h2 class="quarterly-title"><span class="material-symbols-rounded">calendar_today</span> 2025 Q2</h2>
          <div class="articles-list">
            <div class="article-snippet-card">
              <div>
                <div class="article-date">May 16, 2025</div>
                <h3>AI Image Generation Face-Off</h3>
                <p>Testing DALL-E, Google Whisk, Midjourney, and Sora on painting styles and conceptual prompts.</p>
              </div>
              <a href="/tech/ai-image-comparison" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Article →</a>
            </div>
            <div class="article-snippet-card">
              <div>
                <div class="article-date">April 30, 2025</div>
                <h3>Android or iOS Comparison</h3>
                <p>Evaluating launch environments, system configurations, and customization capabilities between mobile stacks.</p>
              </div>
              <a href="/tech/phone-comparison" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Article →</a>
            </div>
          </div>
        </section>

      </div>
    </div>

    <footer class="main-footer">
      <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  // ── 3. UPDATES HUBS ──────────────────────────────────────────────
  '/Footer/updates.html': `
    <style>
      .updates-hero {
        text-align: center;
        margin-bottom: 40px;
      }
      .updates-hero h1 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 2.8rem;
        margin-bottom: 8px;
      }
      .updates-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
        margin-bottom: 60px;
      }
      .update-card {
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
      .update-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-2);
        border-color: var(--md-primary);
      }
      .update-card h3 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.3rem;
        margin-top: 0;
        margin-bottom: 12px;
      }
      .update-card p {
        font-size: 0.95rem;
        opacity: 0.85;
        line-height: 1.5;
        margin-bottom: 16px;
        flex-grow: 1;
      }
      .update-badge {
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
        .updates-grid { grid-template-columns: 1fr; }
      }
    </style>

    <header class="main-header">
      <div class="container site-title-container">
        <div class="site-title-wrapper">
          <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
          <p class="tagline">System Updates</p>
        </div>
      </div>
    </header>

    <div class="main-content-area">
      <div class="container">
        <div class="updates-hero">
          <h1>System Logs & Milestones</h1>
          <p>Tracking major portal development updates and life milestones.</p>
        </div>

        <div class="updates-grid">
          <div class="update-card">
            <div>
              <span class="update-badge">Milestone</span>
              <h3>Eagle Scout Rank Achieved</h3>
              <p>On March 11, 2026, I successfully completed my Board of Review after 69 project hours and 21 merit badges!</p>
            </div>
            <a href="/updates/eagle-progress" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Entry →</a>
          </div>

          <div class="update-card">
            <div>
              <span class="update-badge">Launch</span>
              <h3>A New Home: Launching Minescout.net</h3>
              <p>officially unveiling Minescout.net: my new professional portfolio built with Claude 4.6 Sonnet (Extended Thinking).</p>
            </div>
            <a href="/updates/e-portfolio-launch" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Entry →</a>
          </div>

          <div class="update-card">
            <div>
              <span class="update-badge">Open Source</span>
              <h3>We Are Live on GitHub!</h3>
              <p>Opening our central project workspaces and repositories up to the open-source community.</p>
            </div>
            <a href="/updates/github-launch" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Entry →</a>
          </div>

          <div class="update-card">
            <div>
              <span class="update-badge">Software</span>
              <h3>Introducing Our New App</h3>
              <p>Download our specialized Minescouts Life desktop app wrapper, android packages, and AppImages.</p>
            </div>
            <a href="/updates/app-download" style="color: var(--md-primary); font-weight: bold; text-decoration: none;">Read Entry →</a>
          </div>
        </div>
      </div>
    </div>

    <footer class="main-footer">
      <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  // ── 4. PUPPY LIFE ────────────────────────────────────────────────
  '/puppy-life': `
    <style>
      .puppy-hero {
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.03));
        border: 1px solid #f59e0b;
        border-radius: var(--radius-lg);
        padding: 40px;
        margin-bottom: 40px;
        text-align: center;
      }
      .puppy-hero h1 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 2.8rem;
        color: #d97706;
        margin-top: 0;
        margin-bottom: 12px;
      }
      .pack-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 32px;
        margin-bottom: 40px;
      }
      .pack-card {
        background: var(--card-bg);
        border: 1px solid var(--md-outline-variant);
        border-radius: var(--radius-md);
        padding: 32px;
        box-shadow: var(--shadow-1);
        text-align: center;
        transition: all 0.3s var(--motion-standard);
      }
      .pack-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-2);
        border-color: #f59e0b;
      }
      .pack-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: var(--md-surface-container);
        margin: 0 auto 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid #f59e0b;
        color: #d97706;
      }
      .pack-card h3 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.6rem;
        margin-top: 0;
        margin-bottom: 8px;
      }
      .pack-tag {
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        background: rgba(245, 158, 11, 0.15);
        color: #78350f;
        padding: 4px 12px;
        border-radius: var(--radius-full);
        display: inline-block;
        margin-bottom: 16px;
      }
      .pack-card p {
        font-size: 1rem;
        line-height: 1.6;
        opacity: 0.85;
        margin-bottom: 24px;
      }
      @media (max-width: 768px) {
        .pack-grid { grid-template-columns: 1fr; }
      }
    </style>

    <header class="main-header">
      <div class="container site-title-container">
        <div class="site-title-wrapper">
          <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
          <p class="tagline">Puppy Life Archive</p>
        </div>
      </div>
    </header>

    <div class="main-content-area">
      <div class="container">
        <div class="puppy-hero">
          <span class="material-symbols-rounded" style="font-size: 3.5rem; color: #f59e0b;">pets</span>
          <h1>The Carleton Pack</h1>
          <p>Chronicles and medical observations of Monty and Nigel — the ultimate good boys.</p>
        </div>

        <div class="pack-grid">
          <div class="pack-card">
            <div class="pack-avatar">
              <span class="material-symbols-rounded" style="font-size: 3rem;">shield_dog</span>
            </div>
            <h3>Monty</h3>
            <span class="pack-tag">The Resilient Survivor</span>
            <p>Faced the rough patch of 2022, now dominating the couch space on a strict vegan diet. Loyal companion and battlefield veteran.</p>
            <a href="/puppy/monty" style="display: inline-flex; align-items: center; gap: 8px; background: #f59e0b; color: white; padding: 10px 24px; border-radius: var(--radius-full); font-weight: bold; text-decoration: none;">
              Read Documentary →
            </a>
          </div>

          <div class="pack-card">
            <div class="pack-avatar">
              <span class="material-symbols-rounded" style="font-size: 3rem;">cruelty_free</span>
            </div>
            <h3>Nigel</h3>
            <span class="pack-tag">Agent of Chaos</span>
            <p>Perpetual high-energy zoomie loop machine. Dedicated to pestering Monty in back-yard combat. Constant threat to pantry security.</p>
            <a href="/puppy/nigel" style="display: inline-flex; align-items: center; gap: 8px; background: #f59e0b; color: white; padding: 10px 24px; border-radius: var(--radius-full); font-weight: bold; text-decoration: none;">
              Read Documentary →
            </a>
          </div>
        </div>
      </div>
    </div>

    <footer class="main-footer">
      <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  // ── 5. SYSTEM STATUS & ROADMAP ──────────────────────────────────
  '/stats': `
    <style>
      .stats-container {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 32px;
        margin-bottom: 40px;
      }
      .stats-card {
        background: var(--card-bg);
        border: 1px solid var(--md-outline-variant);
        border-radius: var(--radius-md);
        padding: 32px;
        box-shadow: var(--shadow-1);
        margin-bottom: 32px;
      }
      .stats-card h2 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.6rem;
        margin-top: 0;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
      }
      .metric-box {
        background: var(--md-surface-container);
        border: 1px solid var(--md-outline-variant);
        border-radius: var(--radius-md);
        padding: 20px;
        text-align: center;
      }
      .metric-box-val {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 2rem;
        font-weight: 700;
        color: var(--md-primary);
        line-height: 1;
        margin-bottom: 4px;
      }
      .metric-box-lbl {
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--md-outline);
      }
      .roadmap-col {
        background: var(--md-surface-container);
        border-radius: var(--radius-md);
        padding: 20px;
        border: 1px solid var(--md-outline-variant);
      }
      .roadmap-col h3 {
        font-family: 'Space Grotesk', sans-serif;
        margin-top: 0;
        margin-bottom: 16px;
        font-size: 1.2rem;
      }
      .roadmap-task {
        background: var(--card-bg);
        border: 1px solid var(--md-outline-variant);
        border-radius: var(--radius-sm);
        padding: 12px 16px;
        margin-bottom: 12px;
        font-size: 0.9rem;
        box-shadow: var(--shadow-1);
      }
      @media (max-width: 992px) {
        .stats-container { grid-template-columns: 1fr; }
      }
    </style>

    <header class="main-header">
      <div class="container site-title-container">
        <div class="site-title-wrapper">
          <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
          <p class="tagline">Diagnostics Mainframe</p>
        </div>
      </div>
    </header>

    <div class="main-content-area">
      <div class="container">
        <div class="stats-container">
          <div>
            <div class="stats-card">
              <h2><span class="material-symbols-rounded">monitoring</span> Live System Diagnostics</h2>
              <div class="metrics-grid">
                <div class="metric-box">
                  <div class="metric-box-val" style="color: var(--md-success);">Online</div>
                  <div class="metric-box-lbl">Central Node</div>
                </div>
                <div class="metric-box">
                  <div class="metric-box-val">0.05s</div>
                  <div class="metric-box-lbl">Response Delay</div>
                </div>
                <div class="metric-box">
                  <div class="metric-box-val">2.5MB</div>
                  <div class="metric-box-lbl">Payload footprint</div>
                </div>
              </div>
            </div>

            <div class="stats-card">
              <h2><span class="material-symbols-rounded">checklist</span> Roadmaps & Tasks</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                <div class="roadmap-col">
                  <h3>Planned</h3>
                  <div class="roadmap-task">Modularize all Landing templates</div>
                  <div class="roadmap-task">Optimize image render latency</div>
                </div>
                <div class="roadmap-col">
                  <h3>Active</h3>
                  <div class="roadmap-task">Bundle Posts into Quarter blocks</div>
                </div>
                <div class="roadmap-col">
                  <h3>Done</h3>
                  <div class="roadmap-task">Migrate to absolute absolute URLs</div>
                  <div class="roadmap-task">Centralize Firebase credentials</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="stats-card">
              <h2><span class="material-symbols-rounded">account_tree</span> Codebase Stats</h2>
              <ul style="line-height: 2; font-size: 0.95rem; padding-left: 20px;">
                <li>Mainframe: <strong>v3.2 Elite</strong></li>
                <li>Assets Pathing: <strong>Standardized</strong></li>
                <li>Module Loader: <strong>Online</strong></li>
                <li>Tree Size: <strong>25+ nodes</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="main-footer">
      <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  // ── 6. FEATURE REQUESTS BOARD ────────────────────────────────────
  '/pages/feature-request.html': `
    <style>
      .request-container {
        max-width: 600px;
        margin: 40px auto;
      }
      .request-card {
        background: var(--card-bg);
        border: 1px solid var(--md-outline-variant);
        border-radius: var(--radius-lg);
        padding: 40px;
        box-shadow: var(--shadow-2);
      }
      .request-card h1 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 2.2rem;
        margin-top: 0;
        margin-bottom: 8px;
        text-align: center;
      }
      .request-card p {
        text-align: center;
        opacity: 0.85;
        margin-bottom: 32px;
        font-size: 1.05rem;
      }
      .form-group {
        margin-bottom: 24px;
      }
      .form-group label {
        display: block;
        font-weight: 700;
        margin-bottom: 8px;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--md-outline);
      }
      .form-group input, .form-group textarea, .form-group select {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid var(--md-outline-variant);
        border-radius: var(--radius-sm);
        background: var(--md-surface-container);
        color: var(--text-color);
        font-family: inherit;
        font-size: 1rem;
        box-sizing: border-box;
      }
      .form-group input:focus, .form-group textarea:focus {
        border-color: var(--md-primary);
        outline: none;
      }
      .submit-btn {
        width: 100%;
        padding: 16px;
        background: var(--md-primary);
        color: white;
        border: none;
        border-radius: var(--radius-full);
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        box-shadow: var(--shadow-1);
        transition: all 0.2s;
      }
      .submit-btn:hover {
        filter: brightness(0.9);
        transform: translateY(-2px);
        box-shadow: var(--shadow-2);
      }
      @media (max-width: 768px) {
        .request-card { padding: 24px; }
      }
    </style>

    <header class="main-header">
      <div class="container site-title-container">
        <div class="site-title-wrapper">
          <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
          <p class="tagline">Mainframe Feedback</p>
        </div>
      </div>
    </header>

    <div class="main-content-area">
      <div class="container">
        <div class="request-container">
          <div class="request-card">
            <h1>Feature Requests</h1>
            <p>Submit bug reports, feature suggestions, or general feedback directly to my operational log.</p>
            
            <form id="feature-request-form">
              <div class="form-group">
                <label for="req-name">Your Name</label>
                <input type="text" id="req-name" placeholder="John Doe" required />
              </div>
              <div class="form-group">
                <label for="req-type">Request Type</label>
                <select id="req-type">
                  <option value="feature">Feature Suggestion</option>
                  <option value="bug">Bug Report</option>
                  <option value="content">Content Idea</option>
                </select>
              </div>
              <div class="form-group">
                <label for="req-desc">Details</label>
                <textarea id="req-desc" rows="5" placeholder="Explain your request in detail..." required></textarea>
              </div>
              <button type="submit" class="submit-btn">Submit Request</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <footer class="main-footer">
      <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  // ── 7. MINECRAFT SERVER HUB ──────────────────────────────────────
  '/pages/minecraft-server.html': `
    <style>
      .mc-hero {
        background: linear-gradient(135deg, rgba(22, 163, 74, 0.08), rgba(22, 163, 74, 0.03));
        border: 1px solid #16a34a;
        border-radius: var(--radius-lg);
        padding: 40px;
        margin-bottom: 40px;
        text-align: center;
      }
      .mc-hero h1 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 2.8rem;
        color: #16a34a;
        margin-top: 0;
        margin-bottom: 12px;
      }
      .mc-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 32px;
        margin-bottom: 40px;
      }
      .mc-card {
        background: var(--card-bg);
        border: 1px solid var(--md-outline-variant);
        border-radius: var(--radius-md);
        padding: 32px;
        box-shadow: var(--shadow-1);
        margin-bottom: 32px;
      }
      .mc-card h2 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.6rem;
        margin-top: 0;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--text-color);
      }
      .mc-checklist-item {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        font-size: 1rem;
      }
      .mc-checklist-item span.icon {
        color: #16a34a;
        font-weight: bold;
      }
      @media (max-width: 992px) {
        .mc-grid { grid-template-columns: 1fr; }
      }
    </style>

    <header class="main-header">
      <div class="container site-title-container">
        <div class="site-title-wrapper">
          <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
          <p class="tagline">Carly Fam Hub</p>
        </div>
      </div>
    </header>

    <div class="main-content-area">
      <div class="container">
        <div class="mc-hero">
          <span class="material-symbols-rounded" style="font-size: 3.5rem; color: #16a34a;">sports_esports</span>
          <h1>Carly Fam Survival Server</h1>
          <p>The centralized hub for our multi-user private Minecraft community.</p>
        </div>

        <div class="mc-grid">
          <div>
            <div class="mc-card">
              <h2><span class="material-symbols-rounded">verified</span> Active Server Checklist</h2>
              <div class="mc-checklist-item">
                <span class="icon">✓</span>
                <span>Deploy nether-hub transit lines</span>
              </div>
              <div class="mc-checklist-item">
                <span class="icon">✓</span>
                <span>Establish centralized trading zones</span>
              </div>
              <div class="mc-checklist-item">
                <span class="icon">✓</span>
                <span>Secure automated farms footprint</span>
              </div>
            </div>

            <div class="mc-card">
              <h2><span class="material-symbols-rounded">history</span> Recent Expansion Summary</h2>
              <p style="line-height: 1.6; opacity: 0.85; font-size: 1.05rem;">We successfully deployed the v3 base configurations, establishing stable portals, unified trade hubs, and community storage parameters. Standard security logic is active across the mainframe boundaries.</p>
            </div>
          </div>

          <div>
            <div class="mc-card">
              <h2><span class="material-symbols-rounded">info</span> Server Specs</h2>
              <ul style="line-height: 2; padding-left: 20px; font-size: 0.95rem;">
                <li>Hosting Node: <strong>Private Edge</strong></li>
                <li>Minecraft Version: <strong>1.21.x</strong></li>
                <li>Uptime: <strong>99.9% stable</strong></li>
                <li>Max Slots: <strong>10 Players</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="main-footer">
      <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  // ── 8. THE BETA MAINFRAME ─────────────────────────────────────────
  '/beta': `
    <style>
      #matrix-overlay {
        position: fixed; left: 0; width: 100vw; z-index: 9999;
        background-color: black; overflow: hidden;
        top: 50%; transform: translateY(-50%);
        height: 100vh; display: flex; align-items: center; justify-content: center;
        transition: opacity 1.5s ease-out;
      }
      .crawl-text {
        color: #00ff66; font-family: 'Courier New', monospace; font-weight: bold;
        white-space: pre-wrap; font-size: 1.5rem; text-align: center;
        animation: glitch-green 2s infinite;
      }
      #game-area {
        position: relative; width: 100%; height: 450px;
        background: #111; border-radius: var(--radius-md);
        overflow: hidden; border: 2px solid var(--md-primary);
        box-shadow: var(--shadow-2);
        margin: 32px 0;
      }
      .beta-btn {
        background: #00ff66; color: black; border: none;
        font-weight: bold; padding: 12px 24px; border-radius: var(--radius-full);
        font-family: monospace; cursor: pointer; transition: 0.2s;
      }
      .beta-btn:hover {
        background: #00cc55; transform: scale(1.05);
      }
      @keyframes glitch-green {
        0%, 100% { text-shadow: 0 0 4px #00ff66; }
        50% { text-shadow: 0 0 12px #00ff66, 0 0 20px #00ff66; }
      }
    </style>

    <!-- Legendary Matrix Crawl Overlay -->
    <div id="matrix-overlay" onclick="this.style.opacity='0'; setTimeout(()=>this.remove(), 1500)">
      <div class="crawl-text">> INITIALIZING BETA MAINFRAME...<br>> CLICK ANYWHERE TO BYPASS...</div>
    </div>

    <header class="main-header">
      <div class="container site-title-container">
        <div class="site-title-wrapper">
          <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
          <p class="tagline">Beta mainframes</p>
        </div>
      </div>
    </header>

    <div class="main-content-area">
      <div class="container">
        <h1 style="font-family: 'Space Grotesk', sans-serif;">Beta Mainframe Playground</h1>
        <p>This is the experimental sector of the site. Below is the interactive Physics Workspace. Click the button to inject falling particles and test screen-bottom gravitational collisions!</p>
        
        <div style="margin: 20px 0;">
          <button class="beta-btn" onclick="window.spawnGravityParticle?.()">+ INJECT GRAVITY PARTICLE</button>
        </div>

        <div id="game-area">
          <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0.15; font-family: monospace; font-size: 2.5rem; pointer-events: none;">
            PHYSICS AREA
          </div>
        </div>

        <div style="background: var(--md-primary-container); border: 1px solid var(--md-primary); border-radius: var(--radius-md); padding: 20px; color: var(--md-on-primary-container); margin-bottom: 40px;">
          <h4 style="margin-top:0;">Mainframe Notes:</h4>
          <p style="margin:0;">These components use direct canvas/element coordinate mappings. If you resize the container, click "RESET" on the workspace to re-calibrate boundaries.</p>
        </div>
      </div>
    </div>

    <footer class="main-footer">
      <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  // ── 9. CODING PROJECTS WORKSPACE ─────────────────────────────────
  '/pages/coding-projects.html': `
    <style>
      .projects-hero {
        text-align: center;
        margin-bottom: 40px;
      }
      .projects-hero h1 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 2.8rem;
        margin-bottom: 8px;
      }
      .project-portfolio-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 32px;
        margin-bottom: 40px;
      }
      .portfolio-card {
        background: var(--card-bg);
        border: 1px solid var(--md-outline-variant);
        border-radius: var(--radius-md);
        padding: 32px;
        box-shadow: var(--shadow-1);
        transition: all 0.3s var(--motion-standard);
        display: flex;
        flex-direction: column;
      }
      .portfolio-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-2);
        border-color: var(--md-primary);
      }
      .portfolio-card h3 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.4rem;
        margin-top: 0;
        margin-bottom: 12px;
        color: var(--text-color);
      }
      .portfolio-card p {
        font-size: 0.95rem;
        line-height: 1.6;
        opacity: 0.85;
        margin-bottom: 24px;
        flex-grow: 1;
      }
      .stack-tags {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 20px;
      }
      .stack-tag {
        font-size: 0.75rem;
        font-weight: bold;
        background: var(--md-surface-container);
        border: 1px solid var(--md-outline-variant);
        padding: 4px 10px;
        border-radius: var(--radius-full);
        color: var(--md-outline);
      }
      @media (max-width: 768px) {
        .project-portfolio-grid { grid-template-columns: 1fr; }
      }
    </style>

    <header class="main-header">
      <div class="container site-title-container">
        <div class="site-title-wrapper">
          <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
          <p class="tagline">Workspaces</p>
        </div>
      </div>
    </header>

    <div class="main-content-area">
      <div class="container">
        <div class="projects-hero">
          <h1>Coding Projects</h1>
          <p>Explore source repositories, custom web wrappers, and open-source game suites.</p>
        </div>

        <div class="project-portfolio-grid">
          <div class="portfolio-card">
            <h3>SnackGuard Pro</h3>
            <p>A client-side camera threat detection system leveraging computer vision to watch designated treat zones and log unauthorized hands locally.</p>
            <div class="stack-tags">
              <span class="stack-tag">Tensorflow.js</span>
              <span class="stack-tag">HTML5 Canvas</span>
            </div>
            <a href="https://theminescout.github.io/Snack-Guard/" class="btn-primary" target="_blank" style="text-decoration: none; color: var(--md-primary); font-weight: bold;">Launch Project →</a>
          </div>

          <div class="portfolio-card">
            <h3>Terra Cotta Suite</h3>
            <p>An immersive retro games wrapper driving rendering scripts for classic arcade mechanics, built cleanly via interactive AI sessions.</p>
            <div class="stack-tags">
              <span class="stack-tag">JavaScript ES6</span>
              <span class="stack-tag">Tailwind</span>
            </div>
            <a href="https://theminescout.github.io/terra-cotta-game-suite/index.html" class="btn-primary" target="_blank" style="text-decoration: none; color: var(--md-primary); font-weight: bold;">Launch Project →</a>
          </div>

          <div class="portfolio-card">
            <h3>OpenScan-AI</h3>
            <p>Browser-based edge scanner optimizing document margins with manual cropping handles and post-render filters.</p>
            <div class="stack-tags">
              <span class="stack-tag">HTML5</span>
              <span class="stack-tag">CSS3</span>
            </div>
            <a href="https://theminescout.github.io/openscan-ai/main/index.html" class="btn-primary" target="_blank" style="text-decoration: none; color: var(--md-primary); font-weight: bold;">Launch Project →</a>
          </div>
        </div>
      </div>
    </div>

    <footer class="main-footer">
      <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `
};