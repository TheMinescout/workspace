/**
 * MINESCOUT LIFE OS - DYNAMIC SIDEBAR INJECTOR
 * Loads the category and archive navigation into the sidebar container.
 */

export function initSidebar() {
    const container = document.getElementById('sidebar-nav-container');
    if (!container) return;

    // Inject the Categories and Archives with V3 Elite CSS classes
    container.innerHTML = `
        <div class="sidebar-module">
            <div class="sidebar-module-header">
                <span class="sidebar-module-icon">📂</span>
                <span class="sidebar-module-title">Categories</span>
            </div>
            <div class="sidebar-module-body sidebar" style="padding: 8px;">
                <ul>
                    <li><a href="/index.html">Home</a></li>
                    <li><a href="/pages/coding-projects.html">Coding Projects</a></li>
                    <li><a href="/pages/tech-tips.html">Tech Tips</a></li>
                    <li><a href="/pages/updates.html">Updates</a></li>
                    <li><a href="/pages/puppy-life.html">Puppy Life</a></li>
                    <li><a href="/pages/minecraft-server.html">Minecraft Server</a></li>
                    <li><a href="/pages/beta.html">Beta</a></li>
                    <li><a href="/pages/stats.html">Stats</a></li>
                    <li><a href="/posts/updates/app-download.html">App Install</a></li>
                    <li><a href="/pages/feature-request.html">Feature Request</a></li>
                </ul>
            </div>
        </div>

        <div class="sidebar-module">
            <div class="sidebar-module-header">
                <span class="sidebar-module-icon">🗄️</span>
                <span class="sidebar-module-title">Archives</span>
            </div>
            <div class="sidebar-module-body sidebar" style="padding: 8px;">
                <ul>
                    <li><a href="/archives/archive.html">Archive Log</a></li>
                </ul>
            </div>
        </div>
    `;
}
