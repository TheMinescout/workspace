// views/view-admin.js — Admin Mainframe & Content Publishing Board

export const adminViews = {

  '/admin': `
    <style>
        .admin-wrapper {
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 32px;
            margin-bottom: 40px;
            align-items: start;
        }
        .admin-nav {
            background: var(--card-bg);
            border: 1px solid var(--md-outline-variant);
            border-radius: var(--radius-lg);
            padding: 24px;
            box-shadow: var(--shadow-1);
        }
        .admin-nav h3 {
            font-family: 'Space Grotesk', sans-serif;
            margin-top: 0;
            margin-bottom: 16px;
            font-size: 1.2rem;
            color: var(--md-primary);
            border-bottom: 2px solid var(--md-outline-variant);
            padding-bottom: 8px;
        }
        .admin-nav-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 12px 16px;
            background: transparent;
            border: none;
            color: var(--text-color);
            text-align: left;
            font-family: inherit;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            border-radius: var(--radius-sm);
            transition: all 0.2s;
            margin-bottom: 8px;
        }
        .admin-nav-btn:hover, .admin-nav-btn.active {
            background: var(--md-primary-container);
            color: var(--md-on-primary-container);
        }
        .admin-panel-card {
            background: var(--card-bg);
            border: 1px solid var(--md-outline-variant);
            border-radius: var(--radius-lg);
            padding: 40px;
            box-shadow: var(--shadow-2);
        }
        .admin-panel-card h2 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.8rem;
            margin-top: 0;
            margin-bottom: 24px;
            color: var(--text-color);
            border-bottom: 2px solid var(--md-outline-variant);
            padding-bottom: 12px;
        }
        .form-group {
            margin-bottom: 24px;
            display: flex;
            flex-direction: column;
        }
        .form-group label {
            font-weight: 700;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--md-outline);
            margin-bottom: 8px;
        }
        .form-group input, .form-group textarea, .form-group select {
            padding: 12px 16px;
            border: 1px solid var(--md-outline-variant);
            border-radius: var(--radius-sm);
            font-family: inherit;
            font-size: 1rem;
            background: var(--md-surface-container);
            color: var(--text-color);
            box-sizing: border-box;
            transition: border-color 0.2s;
        }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
            border-color: var(--md-primary);
            outline: none;
        }
        .btn-publish {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 14px 28px;
            background: var(--md-primary);
            color: var(--md-on-primary);
            border: none;
            border-radius: var(--radius-full);
            font-weight: bold;
            font-size: 1rem;
            cursor: pointer;
            box-shadow: var(--shadow-1);
            transition: all 0.3s var(--motion-standard);
        }
        .btn-publish:hover {
            filter: brightness(0.9);
            transform: translateY(-2px);
            box-shadow: var(--shadow-2);
        }
        .feedback-item {
            background: var(--md-surface-container);
            border: 1px solid var(--md-outline-variant);
            border-radius: var(--radius-md);
            padding: 24px;
            margin-bottom: 16px;
            box-shadow: var(--shadow-1);
            transition: transform 0.2s;
        }
        .feedback-item:hover {
            transform: translateY(-2px);
        }
        .feedback-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            border-bottom: 1px solid var(--md-outline-variant);
            padding-bottom: 8px;
        }
        .feedback-title {
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 700;
            font-size: 1.1rem;
            color: var(--text-color);
        }
        .feedback-type {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background: var(--md-primary-container);
            color: var(--md-on-primary-container);
            padding: 4px 10px;
            border-radius: var(--radius-full);
        }
        .feedback-body {
            font-size: 0.95rem;
            line-height: 1.6;
            opacity: 0.85;
            color: var(--text-color);
            margin-bottom: 16px;
        }
        .feedback-actions {
            display: flex;
            gap: 12px;
        }
        .btn-action-small {
            padding: 8px 16px;
            background: var(--md-outline-variant);
            border: none;
            border-radius: var(--radius-full);
            font-size: 0.85rem;
            font-weight: 700;
            cursor: pointer;
            transition: 0.2s;
        }
        .btn-action-small:hover {
            background: var(--md-primary);
            color: white;
        }
        @media (max-width: 992px) {
            .admin-wrapper {
                grid-template-columns: 1fr;
            }
        }
    </style>

    <header class="main-header">
        <div class="container site-title-container">
            <div class="site-title-wrapper">
                <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                <p class="tagline">Admin Mainframe</p>
            </div>
        </div>
    </header>

    <div class="main-content-area">
        <div class="container admin-wrapper">
            <!-- Sidebar navigation panel -->
            <aside class="admin-nav">
                <h3>Control Deck</h3>
                <button class="admin-nav-btn active" id="tab-publish" onclick="window.switchAdminTab?.('publish')">
                    <span class="material-symbols-rounded">edit_document</span>
                    Publish Content
                </button>
                <button class="admin-nav-btn" id="tab-feedback" onclick="window.switchAdminTab?.('feedback')">
                    <span class="material-symbols-rounded">chat_bubble_outline</span>
                    Feature Board
                </button>
            </aside>

            <!-- Active Deck Workspace -->
            <main class="admin-content-deck">
                <!-- PANEL: PUBLISH -->
                <div id="panel-publish" class="admin-panel-card">
                    <h2>Publish New Content</h2>
                    <form id="admin-content-form">
                        <div class="form-group">
                            <label for="post-type">Content Type</label>
                            <select id="post-type" onchange="window.toggleAdminPostFields?.(this.value)">
                                <option value="blog">Blog Post</option>
                                <option value="announcement">System Announcement</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="post-title">Content Title</label>
                            <input type="text" id="post-title" placeholder="e.g. Navigating the New Architecture..." required />
                        </div>

                        <div id="blog-only-fields">
                            <div class="form-group">
                                <label for="post-category">Category</label>
                                <select id="post-category">
                                    <option value="tech">Tech Tips</option>
                                    <option value="puppy">Puppy Life</option>
                                    <option value="beta">Beta Hub</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="post-image">Image URL</label>
                                <input type="text" id="post-image" placeholder="e.g. /assests/images/updates/main.png" />
                            </div>
                            <div class="form-group">
                                <label for="post-link">Route URL Path</label>
                                <input type="text" id="post-link" placeholder="e.g. /tech/my-awesome-post" />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="post-body">Content Body / Summary Text</label>
                            <textarea id="post-body" rows="6" placeholder="Enter detailed article summaries or announcement notes here..." required></textarea>
                        </div>

                        <button type="submit" class="btn-publish">
                            <span class="material-symbols-rounded">publish</span>
                            Publish Post
                        </button>
                    </form>
                </div>

                <!-- PANEL: FEEDBACK -->
                <div id="panel-feedback" class="admin-panel-card" style="display: none;">
                    <h2>Feature Request Board</h2>
                    <div id="feedback-items-container">
                        <div class="feedback-item">
                            <div class="feedback-header">
                                <span class="feedback-title">System Boot complete</span>
                                <span class="feedback-type">Feature Suggestion</span>
                            </div>
                            <div class="feedback-body">No pending requests are registered on the database node currently.</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `
};