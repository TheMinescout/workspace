// =========================================
// VIEW: POSTS / ARTICLES
// =========================================

export const render = () => `
    <div style="display:flex; justify-content:center; align-items:center; height:100%;">
        <div class="code-block">
            <h2 style="border-bottom:1px dashed #0F0; padding-bottom:10px; margin-bottom:10px;">// DIRECTORY: /var/www/articles/</h2>
            <div id="file-list-container"></div>

            <!-- ARCHIVE SECTION -->
            <h2 class="archive-header" style="border-bottom: 1px dashed #555; padding-bottom: 10px; margin-bottom: 10px; margin-top: 30px; color: #555;">// LEGACY_STORAGE (OLD_VERSIONS)</h2>
            <div id="archive-list-container" class="archive-item"></div>
        </div>
    </div>
`;

export const init = () => {
    // 1. POPULATE ACTIVE FILES
    const listContainer = document.getElementById('file-list-container');
    if (listContainer && window.FILE_SYSTEM && window.FILE_SYSTEM.articles) {
        listContainer.innerHTML = ''; // Clear previous view data
        window.FILE_SYSTEM.articles.forEach(item => {
            const div = document.createElement('div');
            div.className = 'var-line';
            div.innerHTML = `<span class="keyword">const</span> ${item.cmd} = <span class="string">"${item.title}"</span>;<span class="comment">${item.desc}</span>`;
            div.onclick = () => window.location.location = item.path;
            listContainer.appendChild(div);
        });
    }

    // 2. POPULATE ARCHIVED FILES
    const archiveContainer = document.getElementById('archive-list-container');
    if (archiveContainer && window.FILE_SYSTEM) {
        archiveContainer.innerHTML = ''; // Clear previous view data
        if (window.FILE_SYSTEM.archived_articles && window.FILE_SYSTEM.archived_articles.length > 0) {
            window.FILE_SYSTEM.archived_articles.forEach(item => {
                const div = document.createElement('div');
                div.className = 'var-line';
                // Archived items look dimmer inline
                div.innerHTML = `<span class="keyword" style="color:#888">const</span> ${item.cmd} = <span class="string" style="color:#aaa">"${item.title}"</span>;<span class="comment" style="color:#555">${item.desc}</span>`;
                div.onclick = () => window.location.location = item.path;
                archiveContainer.appendChild(div);
            });
        } else {
            archiveContainer.innerHTML = "<div style='padding:10px; color:#333;'>// NO LEGACY DATA FOUND</div>";
        }
    }

    // 3. COMMAND HANDLER FOR THIS VIEW
    window.handlePageCommand = function(cmd) {
        let found = window.FILE_SYSTEM.articles.find(a => a.cmd === cmd);
        
        if (!found && window.FILE_SYSTEM.archived_articles) {
            found = window.FILE_SYSTEM.archived_articles.find(a => a.cmd === cmd);
        }

        if (found) {
            window.location.location = found.path;
            return true;
        }
        return null;
    };
};