export const techViews2026Q2 = {
  
  '/tech/snack-guard': `
    <style>
        #user-display a { text-decoration: none; color: white; }
        .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--md-primary); font-weight: 700; text-decoration: none; transition: all 0.3s var(--motion-standard); margin-bottom: 16px; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .back-link:hover { filter: brightness(0.8); transform: translateX(-4px); }
        .article-card { background: var(--card-bg); border: 1px solid var(--md-outline-variant); border-radius: var(--radius-lg); padding: 40px; box-shadow: var(--shadow-1); }
        .article-card h1 { font-family: 'Space Grotesk', sans-serif; font-size: 2.5rem; color: var(--text-color); margin-bottom: 8px; line-height: 1.2; }
        .post-meta { color: var(--md-outline); font-size: 0.95rem; margin-bottom: 32px; font-weight: 500; }
        .post-image-full { width: 100%; height: auto; border-radius: var(--radius-md); margin-bottom: 32px; box-shadow: var(--shadow-2); border: 1px solid var(--md-outline-variant); }
        .post-content h2 { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; color: var(--md-primary); margin-top: 48px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid var(--md-outline-variant); }
        .post-content p { font-size: 1.05rem; color: var(--text-color); opacity: 0.9; line-height: 1.8; margin-bottom: 24px; }
        .official-version-box { background-color: var(--md-surface-container); border: 1px solid var(--md-outline-variant); border-radius: var(--radius-lg); padding: 32px; margin: 48px 0 24px; box-shadow: var(--shadow-1); text-align: center; border-top: 4px solid var(--md-primary); }
        .official-version-box h2 { color: var(--md-primary); margin-top: 0; border: none; padding-bottom: 0; }
        .github-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background-color: var(--md-primary); color: var(--md-on-primary); padding: 14px 28px; border-radius: var(--radius-full); text-decoration: none; font-weight: bold; margin-bottom: 16px; transition: all 0.3s var(--motion-standard); font-size: 1.05rem; box-shadow: var(--shadow-2); }
        .github-btn:hover { filter: brightness(0.9); transform: translateY(-2px); box-shadow: var(--shadow-3); }
        @media (max-width: 768px) { .article-card { padding: 24px; } .article-card h1 { font-size: 2rem; } }
        .hidden { display: none !important; }
    </style>

    <header class="main-header">
        <div class="container site-title-container">
            <div class="site-title-wrapper">
                <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                <p class="tagline">Tech Tips</p>
            </div>
        </div>
    </header>

    <div class="main-content-area">
        <div class="container">
            <main class="post-main" data-post-id="snack-guard">
                <a href="/tech" class="back-link">
                    <span class="material-symbols-rounded" style="font-size: 20px;">arrow_back</span>
                    Back to Tech Tips
                </a>

                <article class="article-card">
                    <h1>SnackGuard Pro: AI-Powered Theft Detection</h1>
                    <p class="post-meta">Posted on April 14, 2026 by TheMinescouter</p>

                    <img src="/assests/images/tech/snackguard/Title.png" 
                         alt="SnackGuard Pro Title" 
                         class="post-image-full" 
                         onerror="this.onerror=null; this.src='https://placehold.co/800x400/e0e0e0/333333?text=SnackGuard+Pro';">
                    
                    <div class="post-content">
                        <p>Tired of your snacks mysteriously disappearing from your desk? Meet SnackGuard Pro, an experimental AI-powered computer vision system designed to detect and log any unauthorized hands reaching for your treats.</p>
                        
                        <p>We built this using lightweight browser-based object detection models so it runs locally, respecting your privacy while keeping your pantry safe. It alerts you whenever a hand enters the designated "Snack Zone" within your webcam's field of view.</p>
                        
                        <div class="official-version-box">
                            <h2>🍿 Ready to Guard Your Stash?</h2>
                            <p style="margin-bottom: 24px;">SnackGuard Pro is open-source, free, and live right now. Stop the snack theft today.</p>
                            
                            <a href="https://theminescout.github.io/Snack-Guard/" class="github-btn" target="_blank">
                                <span class="material-symbols-rounded">cookie</span>
                                Access SnackGuard Pro
                            </a>
                            <br>
                            <a href="https://github.com/TheMinescout/Snack-Guard" style="color: var(--md-outline); text-decoration: underline; font-size: 0.95rem; font-weight: 500;" target="_blank">View Source on GitHub</a>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  '/tech/snacktrack-ai': `
    <style>
        #user-display a { text-decoration: none; color: white; }
        .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--md-primary); font-weight: 700; text-decoration: none; transition: all 0.3s var(--motion-standard); margin-bottom: 16px; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .back-link:hover { filter: brightness(0.8); transform: translateX(-4px); }
        .article-card { background: var(--card-bg); border: 1px solid var(--md-outline-variant); border-radius: var(--radius-lg); padding: 40px; box-shadow: var(--shadow-1); }
        .article-card h1 { font-family: 'Space Grotesk', sans-serif; font-size: 2.5rem; color: var(--text-color); margin-bottom: 8px; line-height: 1.2; }
        .post-meta { color: var(--md-outline); font-size: 0.95rem; margin-bottom: 32px; font-weight: 500; }
        .post-image-full { width: 100%; height: auto; border-radius: var(--radius-md); margin-bottom: 32px; box-shadow: var(--shadow-2); border: 1px solid var(--md-outline-variant); }
        .post-content h2 { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; color: var(--md-primary); margin-top: 48px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid var(--md-outline-variant); }
        .post-content p { font-size: 1.05rem; color: var(--text-color); opacity: 0.9; line-height: 1.8; margin-bottom: 24px; }
        .post-content a { color: var(--md-primary); font-weight: 600; text-decoration: none; transition: all 0.2s; }
        .post-content a:hover { text-decoration: underline; filter: brightness(0.8); }
        .disclaimer { font-size: 0.9rem; color: var(--md-outline); font-style: italic; background: var(--md-surface-container); padding: 16px; border-radius: var(--radius-md); border-left: 4px solid var(--md-outline); margin-top: 32px; }
        .ai-notification { display: flex; align-items: center; gap: 12px; background: var(--md-primary-container); color: var(--md-on-primary-container); border: 1px solid var(--md-primary); padding: 16px; border-radius: var(--radius-md); font-size: 0.95rem; margin-top: 24px; }
        @media (max-width: 768px) { .article-card { padding: 24px; } .article-card h1 { font-size: 2rem; } }
        .hidden { display: none !important; }
    </style>

    <header class="main-header">
        <div class="container site-title-container">
            <div class="site-title-wrapper">
                <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                <p class="tagline">Tech Tips</p>
            </div>
        </div>
    </header>

    <div class="main-content-area">
        <div class="container">
            <main class="post-main" data-post-id="snacktrack-ai">
                <a href="/tech" class="back-link">
                    <span class="material-symbols-rounded" style="font-size: 20px;">arrow_back</span>
                    Back to Tech Tips
                </a>

                <article class="article-card">
                    <h1>SnackTrack M3</h1>
                    <p class="post-meta">Posted on May 05, 2026 by TheMinescouter</p>

                    <img src="/assests/images/tech/snacktrack/Title.png" 
                         alt="SnackTrack M3 Interface" 
                         class="post-image-full" 
                         onerror="this.onerror=null; this.src='https://placehold.co/800x400/e0e0e0/333333?text=SnackTrack+M3';">
                    
                    <div class="post-content">
                        <p>We've combined AI with simple daily logging to help you keep tabs on your snacking habits seamlessly. The new SnackTrack M3 interface is built to be fast and visually beautiful, giving you intelligent nutritional estimates on the fly.</p>
                        
                        <h2>Why Track With AI?</h2>
                        <p>Rather than manually looking up the nutritional values for everything you grab throughout the day, SnackTrack uses integrated LLMs to instantly estimate the caloric and macronutrient impact based entirely on casual descriptions. Pair it perfectly with <a href="/tech/snack-guard">Snack Guard</a> to help you maintain healthy habits across the board.</p>

                        <p class="disclaimer"><strong>Disclaimer:</strong> SnackTrack is a tool for logging and estimating nutritional intake. AI estimates are generated for convenience and should not replace professional medical advice. Always consult with a healthcare provider or certified nutritionist regarding your diet and health goals.</p>
                        
                        <div class="ai-notification">
                            <span class="material-symbols-rounded" style="font-size: 24px;">psychology</span>
                            <span><strong>Written by AI:</strong> This article was generated by an artificial intelligence assistant based on project documentation and an interview simulation with the developer.</span>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  '/tech/attack-surface-analyzer': `
    <style>
        #user-display a { text-decoration: none; color: white; }
        .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--md-primary); font-weight: 700; text-decoration: none; transition: all 0.3s var(--motion-standard); margin-bottom: 16px; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .back-link:hover { filter: brightness(0.8); transform: translateX(-4px); }
        .article-card { background: var(--card-bg); border: 1px solid var(--md-outline-variant); border-radius: var(--radius-lg); padding: 40px; box-shadow: var(--shadow-1); }
        .article-card h1 { font-family: 'Space Grotesk', sans-serif; font-size: 2.5rem; color: var(--text-color); margin-bottom: 8px; line-height: 1.2; }
        .post-meta { color: var(--md-outline); font-size: 0.95rem; margin-bottom: 32px; font-weight: 500; }
        .post-image-full { width: 100%; height: auto; border-radius: var(--radius-md); margin-bottom: 32px; box-shadow: var(--shadow-2); border: 1px solid var(--md-outline-variant); }
        .post-content h2 { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; color: var(--md-primary); margin-top: 48px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid var(--md-outline-variant); }
        .post-content p { font-size: 1.05rem; color: var(--text-color); opacity: 0.9; line-height: 1.8; margin-bottom: 24px; }
        .btn-container { display: flex; gap: 16px; margin-top: 32px; flex-wrap: wrap; }
        .github-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background-color: var(--md-primary); color: var(--md-on-primary); padding: 14px 28px; border-radius: var(--radius-full); text-decoration: none; font-weight: bold; transition: all 0.3s var(--motion-standard); font-size: 1.05rem; box-shadow: var(--shadow-2); }
        .github-btn:hover { filter: brightness(0.9); transform: translateY(-2px); box-shadow: var(--shadow-3); }
        @media (max-width: 768px) { .article-card { padding: 24px; } .article-card h1 { font-size: 2rem; } .btn-container { flex-direction: column; } }
        .hidden { display: none !important; }
    </style>

    <header class="main-header">
        <div class="container site-title-container">
            <div class="site-title-wrapper">
                <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                <p class="tagline">Tech Tips</p>
            </div>
        </div>
    </header>

    <div class="main-content-area">
        <div class="container">
            <main class="post-main" data-post-id="attack-surface-release">
                <a href="/tech" class="back-link">
                    <span class="material-symbols-rounded" style="font-size: 20px;">arrow_back</span>
                    Back to Tech Tips
                </a>

                <article class="article-card">
                    <h1>Building a Dynamic Attack Surface Analyzer</h1>
                    <p class="post-meta">Posted on May 20, 2026 by TheMinescouter</p>

                    <img src="/assests/images/tech/attack-surface/Title.png" 
                         alt="Attack Surface Analyzer UI" 
                         class="post-image-full" 
                         onerror="this.onerror=null; this.src='https://placehold.co/800x400/e0e0e0/333333?text=Attack+Surface+Analyzer';">
                    
                    <div class="post-content">
                        <p>Discover how we built a Llama-3 powered, zero-retention Dynamic Attack Surface Analyzer for interactive threat modeling. This tool allows security enthusiasts and developers to quickly visualize the vulnerability footprint of theoretical network setups without storing sensitive infrastructure data.</p>
                        
                        <p>Want to see how the encrypted URL routing, prompt engineering, and interactive particle background work under the hood? You can try out the live tool or view the source repository to deploy your own version.</p>

                        <div class="btn-container">
                            <a href="https://life.minescout.net/projects/Cyber_Attack_Surface_Analyzer/index.html" class="github-btn" target="_blank">
                                <span class="material-symbols-rounded">open_in_new</span> Launch Live Tool
                            </a>
                            <a href="https://github.com/minescouts/attack-surface-analyzer" class="github-btn" target="_blank" style="background-color: var(--md-outline-variant); color: var(--text-color);">
                                <span class="material-symbols-rounded">code</span> View Code
                            </a>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,
};