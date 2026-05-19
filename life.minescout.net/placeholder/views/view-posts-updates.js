export const postsUpdatesViews = {
      
      '/updates/app-download': `
        <style>
            #user-display a { text-decoration: none; color: white; }
            .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--md-primary); font-weight: 700; text-decoration: none; transition: all 0.3s var(--motion-standard); margin-bottom: 16px; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; }
            .back-link:hover { filter: brightness(0.8); transform: translateX(-4px); }
            .article-card { background: var(--card-bg); border: 1px solid var(--md-outline-variant); border-radius: var(--radius-lg); padding: 40px; box-shadow: var(--shadow-1); }
            .article-card h1 { font-family: 'Space Grotesk', sans-serif; font-size: 2.5rem; color: var(--text-color); margin-bottom: 8px; line-height: 1.2; }
            .post-meta { color: var(--md-outline); font-size: 0.95rem; margin-bottom: 32px; font-weight: 500; }
            .post-content p { font-size: 1.05rem; color: var(--text-color); opacity: 0.9; line-height: 1.8; margin-bottom: 24px; }
            .notice-box { background: var(--md-primary-container); border: 1px solid var(--md-primary); border-radius: var(--radius-md); padding: 20px; margin-bottom: 32px; color: var(--md-on-primary-container); box-shadow: var(--shadow-1); display: flex; align-items: flex-start; gap: 16px; }
            .notice-box p { margin-bottom: 8px; font-size: 1rem; }
            .notice-box p:last-child { margin-bottom: 0; }
            .notice-box a { color: var(--md-primary); font-weight: 700; text-decoration: underline; transition: opacity 0.2s; }
            .notice-box a:hover { opacity: 0.8; }
            .downloads-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 32px; }
            .download-section { background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); border-radius: var(--radius-md); padding: 24px; box-shadow: var(--shadow-1); display: flex; flex-direction: column; align-items: flex-start; transition: all 0.3s var(--motion-standard); }
            .download-section:hover { box-shadow: var(--shadow-2); border-color: var(--md-primary); transform: translateY(-4px); }
            .download-section h4 { font-family: 'Space Grotesk', sans-serif; color: var(--text-color); margin-top: 0; margin-bottom: 16px; font-size: 1.4rem; }
            .download-btn { display: inline-flex; align-items: center; gap: 8px; background-color: var(--md-primary); color: var(--md-on-primary); padding: 12px 24px; border-radius: var(--radius-full); text-decoration: none; font-weight: bold; font-size: 1rem; margin-bottom: 12px; transition: all 0.3s var(--motion-standard); box-shadow: var(--shadow-1); }
            .download-btn:hover { filter: brightness(0.9); transform: translateY(-2px); box-shadow: var(--shadow-2); }
            .version-text { color: var(--md-outline); font-size: 0.85rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em; }
            .version-note { color: var(--md-outline); font-size: 0.85rem; margin-top: 4px; font-style: italic; }
            @media (max-width: 768px) { .article-card { padding: 24px; } .article-card h1 { font-size: 2rem; } }
            .hidden { display: none !important; }
        </style>

        <header class="main-header">
            <div class="container site-title-container">
                <div class="site-title-wrapper">
                    <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                    <p class="tagline">App Install</p>
                </div>
            </div>
        </header>

        <div class="main-content-area">
            <div class="container">
                <main class="post-main" data-post-id="app-download">
                    <a href="/Footer/updates.html" class="back-link">
                        <span class="material-symbols-rounded" style="font-size: 20px;">arrow_back</span>
                        Back to Updates
                    </a>

                    <article class="article-card">
                        <h1>Introducing Our New Minescout Life App!</h1>
                        <p class="post-meta">Created on 9/12/2025, constantly updated</p>

                        <div class="post-content">
                            <div class="notice-box">
                                <span class="material-symbols-rounded" style="color: #b45309; font-size: 28px;">warning</span>
                                <div style="flex:1">
                                    <h4 style="margin: 0 0 6px 0; color: var(--text-color); font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem;">Notice:</h4>
                                    <p style="margin: 0; font-size: 0.95rem; color: var(--text-color); opacity: 0.85;">This is still in development and will have errors. Please send them to <a href="mailto:theminescout@minescout.net">theminescout@minescout.net</a></p>
                                </div>
                            </div>

                            <p>Welcome to the Minescout Life app download page. This app has all the capabilities of the website, with the added bonus of not needing wifi to connect and view. The EXE app is recommended for Windows, the APK is recommended for Android (no guarantee for IOS), and the Linux one should work for all builds, but is tested only on Bazzite. There is no current build for Mac. Download below:</p>

                            <div class="downloads-grid">
                                <div class="download-section">
                                    <h4>Desktop App</h4>
                                    <a href="/app stuff/MinescoutLife-Setup.exe" class="download-btn" download>
                                        <span class="material-symbols-rounded">desktop_windows</span>
                                        Download EXE
                                    </a>
                                    <span class="version-text">V1.2</span>
                                </div>
                                <div class="download-section">
                                    <h4>Phone App</h4>
                                    <a href="/app stuff/app-release.apk" class="download-btn" download>
                                        <span class="material-symbols-rounded">smartphone</span>
                                        Download APK
                                    </a>
                                    <span class="version-text">V1.2</span>
                                </div>
                                <div class="download-section">
                                    <h4>Linux App</h4>
                                    <a href="/app stuff/minescoutlife.appimage" class="download-btn" download>
                                        <span class="material-symbols-rounded">terminal</span>
                                        Download AppImage
                                    </a>
                                    <span class="version-text">V1.1</span>
                                    <span class="version-note">Update, only guaranteed for Bazzite</span>
                                </div>
                            </div>
                        </div>
                    </article>
                </main>
            </div>
        </div>

        <footer class="main-footer">
            <div class="container">
                <p id="copyright">© 2026 Minescouts Life. All rights reserved.</p>
            </div>
        </footer>
      `,

      '/updates/e-portfolio-launch': `
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
            .portfolio-announcement { background: var(--md-surface-container); border: 2px solid var(--md-primary); border-radius: var(--radius-lg); padding: 32px; margin: 40px 0; box-shadow: var(--shadow-1); }
            .portfolio-announcement h2 { margin-top: 24px; border: none; padding: 0; color: var(--text-color); }
            .tech-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--md-primary-container); color: var(--md-on-primary-container); border: 1px solid var(--md-primary); padding: 6px 14px; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 700; font-family: 'DM Sans', sans-serif; margin-bottom: 16px; }
            .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-top: 24px; }
            .feature-item { background: var(--card-bg); padding: 24px; border-radius: var(--radius-md); border-left: 4px solid var(--md-primary); box-shadow: var(--shadow-1); transition: all 0.3s var(--motion-standard); }
            .feature-item:hover { transform: translateY(-2px); box-shadow: var(--shadow-2); }
            .feature-item h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; color: var(--md-primary); margin-top: 0; margin-bottom: 12px; }
            .feature-item p { margin-bottom: 0; font-size: 0.95rem; }
            .visit-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background-color: var(--md-primary); color: var(--md-on-primary); padding: 16px 32px; border-radius: var(--radius-full); text-decoration: none; font-weight: bold; margin-top: 32px; transition: all 0.3s var(--motion-standard); font-size: 1.1rem; box-shadow: var(--shadow-2); }
            .visit-btn:hover { background-color: var(--md-primary); filter: brightness(0.9); transform: translateY(-2px); box-shadow: var(--shadow-3); }
            @media (max-width: 768px) { .article-card { padding: 24px; } .article-card h1 { font-size: 2rem; } .feature-grid { grid-template-columns: 1fr; } }
            .hidden { display: none !important; }
        </style>

        <header class="main-header">
            <div class="container site-title-container">
                <div class="site-title-wrapper">
                    <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                    <p class="tagline">Updates & Announcements</p>
                </div>
            </div>
        </header>

        <div class="main-content-area">
            <div class="container">
                <main class="post-main" data-post-id="minescout-net-launch">
                    <a href="/Footer/updates.html" class="back-link">
                        <span class="material-symbols-rounded" style="font-size: 20px;">arrow_back</span>
                        Back to Updates
                    </a>

                    <article class="article-card">
                        <h1>A New Home: Launching Minescout.net</h1>
                        <p class="post-meta">Posted on 2/22/26 by TheMinescouter</p>

                        <img src="/assests/images/updates/minescout-net-launch.png" 
                             alt="Minescout.net - A New Digital Hub" 
                             class="post-image-full"
                             onerror="this.onerror=null; this.src='https://placehold.co/800x400/e0e0e0/333333?text=Minescout.net+Launch';">
                    
                        <div class="post-content">
                            <p>Big things are happening in the Minescout ecosystem. Today, I’m excited to officially announce the launch of <strong>Minescout.net</strong>—my new professional e-portfolio and future home for AI-driven services.</p>
                            
                            <p>While <em>Minescouts Life</em> will remain the place for my long-form blogs, tech deep-dives, and puppy updates, <strong>Minescout.net</strong> is where I am centralizing my professional identity and future projects.</p>

                            <div class="portfolio-announcement">
                                <span class="tech-badge">
                                    <span class="material-symbols-rounded" style="font-size: 16px;">memory</span>
                                    Built with Claude 4.6 Sonnet (Extended Thinking)
                                </span>
                                <h2>What’s New?</h2>
                                <p>This site wasn't just built to look pretty; it’s designed to be a functional hub for my work. Here is what you can find there right now:</p>
                                
                                <div class="feature-grid">
                                    <div class="feature-item">
                                        <h3>Up-to-Date Resume</h3>
                                        <p>A live, digital version of my professional journey and skill set.</p>
                                    </div>
                                    <div class="feature-item">
                                        <h3>Interactive Comments</h3>
                                        <p>A space for visitors to leave encouraging feedback or get in touch.</p>
                                    </div>
                                </div>
                            </div>

                            <h2>The Future of Minescout.net</h2>
                            <p>This is just Phase 1. Currently, the site serves as a clean, high-performance e-portfolio. However, in the background, I am working on integrating an <strong>AI Service</strong> directly into the domain. Stay tuned for updates on that front as development progresses.</p>

                            <div style="text-align: center; margin: 48px 0 16px;">
                                <a href="https://minescout.net" class="visit-btn" target="_blank">
                                    Visit Minescout.net
                                    <span class="material-symbols-rounded" style="font-size: 20px;">open_in_new</span>
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

      '/updates/eagle-progress': `
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
            .eagle-badge-header { text-align: center; background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05)); padding: 40px 24px; border-radius: var(--radius-lg); border: 2px solid #f59e0b; margin-bottom: 40px; box-shadow: var(--shadow-2); }
            .eagle-badge-header h1 { color: #d97706; margin-top: 16px; margin-bottom: 8px; border: none; }
            .eagle-badge-header .post-meta { margin-bottom: 0; color: var(--text-color); font-weight: 700; }
            .progress-container { margin: 40px 0; }
            .progress-bar-name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1.2rem; margin-bottom: 12px; color: var(--text-color); }
            .progress-bar-wrapper { width: 100%; height: 36px; background-color: var(--md-surface-container); border-radius: var(--radius-full); position: relative; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-outline-variant); }
            .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b); transition: width 1.5s ease-in-out; border-radius: var(--radius-full); position: relative; }
            .progress-bar-fill::after { content: ''; position: absolute; top: 0; left: 0; bottom: 0; right: 0; background-image: linear-gradient(-45deg, rgba(255, 255, 255, .25) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .25) 50%, rgba(255, 255, 255, .25) 75%, transparent 75%); background-size: 50px 50px; animation: move-stripes 2s linear infinite; }
            @keyframes move-stripes { 0% { background-position: 0 0; } 100% { background-position: 50px 50px; } }
            .progress-bar-percent { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 700; color: #78350f; z-index: 2; text-shadow: 0 1px 2px rgba(255,255,255,0.5); }
            .lesson-box { background-color: var(--md-surface-container); border-left: 4px solid var(--md-primary); padding: 24px; margin: 32px 0; color: var(--text-color); line-height: 1.6; border-radius: 0 var(--radius-md) var(--radius-md) 0; box-shadow: var(--shadow-1); }
            .lesson-box strong { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; color: var(--md-primary); display: block; margin-bottom: 8px; }
            .status-badge { display: inline-flex; align-items: center; gap: 6px; background-color: var(--md-success); color: white; padding: 6px 16px; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; margin-bottom: 24px; box-shadow: var(--shadow-1); }
            .official-version-box { background-color: var(--card-bg); border: 2px solid #f59e0b; border-radius: var(--radius-lg); padding: 32px; margin: 48px 0; box-shadow: var(--shadow-2); text-align: center; }
            .official-version-box h2 { color: #d97706; margin-top: 0; border: none; padding-bottom: 0; display: flex; align-items: center; justify-content: center; gap: 8px; }
            @media (max-width: 768px) { .article-card { padding: 24px; } .eagle-badge-header h1 { font-size: 2rem; } }
            .hidden { display: none !important; }
        </style>

        <header class="main-header">
            <div class="container site-title-container">
                <div class="site-title-wrapper">
                    <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                    <p id="dynamic-tagline" class="tagline">Eagle Scout</p>
                </div>
            </div>
        </header>

        <div class="main-content-area">
            <div class="container">
                <main class="post-main" data-post-id="eagle-scout-progress-updates">
                    <a href="/Footer/updates.html" class="back-link">
                        <span class="material-symbols-rounded" style="font-size: 20px;">arrow_back</span>
                        Back to Updates
                    </a>

                    <article class="article-card">
                        <div class="eagle-badge-header">
                            <span class="material-symbols-rounded" style="font-size: 4rem; color: #f59e0b;">workspace_premium</span>
                            <h1>Rank Achieved: Eagle Scout</h1>
                            <p class="post-meta">Official Date: March 11, 2026</p>
                        </div>

                        <img src="/assests/images/updates/Rank Updates.png" 
                             alt="BSA Eagle Scout Progress" 
                             class="post-image-full"
                             onerror="this.onerror=null; this.src='https://placehold.co/800x400/e0e0e0/333333?text=Eagle+Scout+Journey';">

                        <div class="post-content">
                            <div class="progress-container">
                                <div class="progress-bar-name">Final Rank Status</div>
                                <div class="progress-bar-wrapper">
                                    <div class="progress-bar-fill" style="width: 100%;"></div>
                                    <span class="progress-bar-percent">100% COMPLETE</span>
                                </div>
                            </div>

                            <p>On March 11, 2026, I officially completed my Eagle Board of Review. This marks the end of a long journey and the beginning of a lifelong commitment to Scouting values.</p>

                            <hr style="border: 0; height: 1px; background: var(--md-outline-variant); margin: 48px 0;">

                            <h2>Eagle Project: Little Free Library</h2>
                            <div class="status-badge">
                                <span class="material-symbols-rounded" style="font-size: 16px;">check_circle</span>
                                Completed & Installed
                            </div>
                            <p>The Little Free Library was successfully installed in September 2025. It stands as a permanent fixture in the community, representing the culmination of my Eagle Scout project.</p>
                            
                            <div class="lesson-box">
                                <strong>The Leadership Lesson:</strong>
                                "The hardest part was learning to step back. As a leader, I had to trust my team to help. Letting go of control allowed the project to move faster."
                            </div>

                            <div class="official-version-box">
                                <h2><span class="material-symbols-rounded" style="font-size: 32px;">verified</span> Success!</h2>
                                <p style="margin-bottom: 0;">Walking into the Board of Review was the culmination of 69 project hours and 21+ merit badges. I am honored to officially be an Eagle Scout.</p>
                            </div>
                        </div>

                        <h2 style="font-family: 'Space Grotesk', sans-serif; color: var(--text-color); margin-top: 48px;">The End</h2>
                        <p style="color: var(--text-color); opacity: 0.9; line-height: 1.6;">
                            Thanks for following this journey.<br>
                            <strong>The Minescout Scouters.</strong>
                        </p>
                    </article>
                </main>
            </div>
        </div>

        <footer class="main-footer">
            <div class="container">
                <p id="copyright">© 2026 Minescouts Life. All rights reserved.</p>
            </div>
        </footer>
      `
    };