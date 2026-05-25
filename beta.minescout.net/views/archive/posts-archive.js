// =========================================
// VIEW: ARCHIVED READER (GNU NANO EMULATOR)
// =========================================

const ARCHIVE_DB = {
    'news-v1': {
        file: 'news-v1_legacy.txt',
        theme: '#008800',
        actionCmd: 'download',
        actionPath: '#/download/ai-news-v1.zip',
        content: `<h1>[ARCHIVE] News Synthesis V1</h1>
<p>Date: Nov 16, 2025 | Status: DEPRECATED</p>

-----------------------------------------------------------
WARNING: THIS VERSION IS NO LONGER SUPPORTED
-----------------------------------------------------------

Step 1: Legacy Source
This download contains the Alpha build. Use at your own risk.
> <a href="#/download/ai-news-v1.zip">Download Legacy .zip</a>

Step 2: Terminal Access
Open your local shell:
- macOS: Terminal
- Windows: PowerShell / CMD

Step 3: Navigation
Move to the directory:
<code>cd Downloads/ai-news-legacy</code>

-----------------------------------------------------------
END OF ARCHIVE
-----------------------------------------------------------`
    }
    // You can easily add more legacy posts here in the future
};

export const render = (archiveId) => {
    // Determine the archive post dynamically via passed ID or URL hash
    const id = archiveId || window.location.location.split('/').pop();
    const article = ARCHIVE_DB[id] || { 
        file: 'error_legacy.txt', 
        theme: '#880000', 
        content: '<h1>404 // ARCHIVE NOT FOUND</h1><p>The requested legacy document could not be located in cold storage.</p>' 
    };

    return `
        <style>
            /* RAW TERMINAL STYLE - ARCHIVE MODE (Dimmer) */
            .archive-wrapper { background-color: #050505; color: #888; min-height: 100vh; width: 100%; padding: 20px; padding-bottom: 100px; font-family: 'Courier New', monospace; box-sizing: border-box; }
            .archive-header { background: #333; color: #000; padding: 5px; font-weight: bold; display: flex; justify-content: space-between; position: sticky; top: 0; z-index: 100; border-bottom: 2px solid #555; }
            .archive-content { max-width: 800px; margin: 20px auto; white-space: pre-wrap; line-height: 1.5; }
            
            /* Links and headings in archive are dimmer */
            .archive-content h1 { color: ${article.theme}; border-bottom: 1px double ${article.theme}; margin-bottom: 15px; }
            .archive-content h2 { color: ${article.theme}; margin-top: 30px; }
            .archive-content a { color: ${article.theme}; text-decoration: underline; cursor: pointer; }
            .archive-content code { background: #222; color: #aaa; padding: 2px 5px; }
            
            /* Footer Hint */
            .archive-instruction { position: fixed; bottom: 10px; right: 10px; background: ${article.theme}; color: #000; padding: 5px 10px; font-weight: bold; cursor: pointer; z-index: 100; }
        </style>

        <div class="archive-wrapper">
            <div class="archive-header">
                <span>GNU nano 4.0 (READ ONLY)</span>
                <span>File: ${article.file}</span>
                <span>[ARCHIVED]</span>
            </div>

            <div class="archive-content">
                ${article.content}
            </div>

            <div class="archive-instruction" onclick="window.location.location = '/pages'">
                [ ^X EXIT ] (Click or Type 'back')
            </div>
        </div>
    `;
};

export const init = (archiveId) => {
    const id = archiveId || window.location.location.split('/').pop();
    const article = ARCHIVE_DB[id];

    // Localifzed Command Handler for Archive Mode
    window.handlePageCommand = function(cmd) {
        if (cmd === 'return' || cmd === 'back' || cmd === 'exit') { 
            window.location.location = '/pages'; 
            return true; 
        }
        
        // Handle specific actions for legacy files
        if (article && article.actionCmd) {
            if (cmd === article.actionCmd || (article.actionCmd === 'download' && cmd === 'get')) {
                if (article.actionPath.includes('download')) {
                    alert(`Initiating legacy download for ${article.file}...`);
                    // In a live environment, attach to an invisible <a> tag and click
                } else {
                    window.location.location = article.actionPath;
                }
                return true;
            }
        }
        
        return null;
    };
};