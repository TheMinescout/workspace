// =========================================
// VIEW: ARTICLE READER (GNU NANO EMULATOR)
// =========================================

const ARTICLE_DB = {
    'ai-writer': {
        file: 'ai-writer.txt',
        theme: '#0F0',
        actionCmd: 'run',
        actionPath: '#/project/ai-writer',
        content: `<h1>RELEASE: AI Writer Assistant (Web Tool)</h1>
<p>Date: Dec 25, 2025 | Type: DOM Generator</p>

-----------------------------------------------------------
SYSTEM ENTRY: AUTOMATED CONTENT GENERATION
-----------------------------------------------------------

We have deployed a new browser-based tool to the Projects directory: **The AI Writer Assistant**.

This tool allows you to rapidly compile single-file HTML documents by injecting text and images into a pre-defined code structure.

**CAPABILITIES:**
1.  **Blob Generation:** Compiles code instantly in-memory. No server required.
2.  **Base64 Encoding:** Upload an image, and it is converted to text string data, making the final HTML file completely standalone (portable).
3.  **Template Engine:** Uses {{variable}} logic to inject content.

**ACCESS:**
> <a href="#/project/ai-writer">OPEN_AI_WRITER.EXE</a>

**HOW TO USE:**
1.  Enter your Title and Main Text.
2.  Upload an image (optional).
3.  Modify the HTML Template on the left if desired.
4.  Click **INITIALIZE GENERATION**.
5.  Click **OPEN PREVIEW** to view your generated site in a Blob URL.

-----------------------------------------------------------
END OF LOG
-----------------------------------------------------------`
    },
    'cognisearch': {
        file: 'cognisearch.txt',
        theme: '#00FFFF',
        actionCmd: 'download',
        actionPath: '#/download/cognisearch-v5.zip',
        content: `<h1>RELEASE: Cognisearch (v5)</h1>
<p>Date: Nov 30, 2025 | Branch: Stable</p>

-----------------------------------------------------------
SYSTEM ENTRY: DEPLOYMENT PROTOCOL
-----------------------------------------------------------

Notice: "AI News Synthesis" has been rebranded to "Cognisearch".
The core logic remains, but the engine is faster.

Step 1: Acquire Source
Download the updated V5 architecture.
> <a href="#/download/cognisearch-v5.zip">Download Package [73MB]</a>

Step 2: Terminal Access
Open your local shell:
- macOS: Terminal
- Windows: PowerShell / CMD

Step 3: Navigation
Move to the directory:
<code>cd Downloads/cognisearch</code>

Step 4: Dependencies
Install node modules:
<code>npm install</code>

Step 5: Initialization
Launch the development server:
<code>npm run dev</code>

-----------------------------------------------------------
END OF LOG
-----------------------------------------------------------`
    },
    'openscan': {
        file: 'openscan-release.txt',
        theme: '#00FFFF',
        actionCmd: 'run',
        actionPath: '#/project/openscan-tool',
        content: `<h1>RELEASE: OpenScan-AI Pro</h1>
<p>Date: Jan 16, 2026 | Type: Progressive Web App (PWA)</p>

-----------------------------------------------------------
SYSTEM ENTRY: COMPUTER VISION DEPLOYMENT
-----------------------------------------------------------

We have deployed a new privacy-focused document scanner that runs entirely in the browser memory. 
Unlike traditional apps, OpenScan-AI Pro performs all processing locally using OpenCV.js and Tesseract.js. 
NO DATA IS SENT TO THE CLOUD.

> <a href="#/project/openscan-tool">LAUNCH_HUB.EXE</a>

<h2>// CORE FEATURES</h2>
1. **Smart Scanning:**
   - Real-time Edge Detection (OpenCV convex hull analysis).
   - Stability Ring: Auto-captures when camera is steady.
   - Resolution Control: 4K / 1080p / 720p support.

2. **On-Device Processing:**
   - Perspective Warp: Flattens angled photos into 2D documents.
   - Filters: Original, B&W (High Contrast), and Rotation tools.

3. **Intelligent Tools:**
   - **OCR:** Extract text from images using Tesseract Neural Nets.
   - **PDF Export:** Compile scans into encrypted PDF files.
   - **Cloud Integration:** Uses native iOS/Android Share Sheets.

<h2>// TECH STACK</h2>
- Frontend: HTML5, CSS3, Vanilla JS
- Vision: OpenCV.js (v4.x)
- OCR: Tesseract.js
- PDF: jsPDF

-----------------------------------------------------------
END OF LOG
-----------------------------------------------------------`
    },
    'portfolio': {
        file: 'finance-release.txt',
        theme: '#00FF00',
        actionCmd: 'run',
        actionPath: '#/project/portfolio-tool',
        content: `<h1>RELEASE: Portfolio Simulator</h1>
<p>Date: Dec 27, 2025 | Type: Financial Utility</p>

-----------------------------------------------------------
SYSTEM ENTRY: ASSET PROJECTION ENGINE
-----------------------------------------------------------

We have deployed a new financial modeling tool to the Projects directory.
This tool visualizes compound interest and portfolio growth over time using a terminal-based interface.

**CAPABILITIES:**
1.  **Phased Contributions:** Model different life stages (e.g., investing heavy for 5 years, then coasting).
2.  **Volatility Simulation:** Visualizes Best Case, Base Case, and Worst Case scenarios based on CAGR variance.
3.  **Neon Visualization:** Renders data using a high-contrast chart engine.

**ACCESS:**
> <a href="#/project/portfolio-tool">LAUNCH_SIMULATION</a>

**HOW TO USE:**
1.  Enter your Initial Capital.
2.  Set your Base Growth Rate (CAGR) and Volatility Range.
3.  Add "Phases" to simulate changing monthly contributions over specific time periods.
4.  Click **[ RUN PROJECTION ]**.

-----------------------------------------------------------
END OF LOG
-----------------------------------------------------------`
    },
    'vigenere': {
        file: 'crypto-release.txt',
        theme: '#0F0',
        actionCmd: 'download',
        actionPath: '#/download/vigenere-tool.zip',
        content: `<h1>RELEASE: Vigenère Crypto Tool (Offline)</h1>
<p>Date: Dec 05, 2025 | Type: Standalone Utility</p>

-----------------------------------------------------------
SYSTEM ENTRY: TOOL DEPLOYMENT
-----------------------------------------------------------

We have compiled the Vigenère Cracker into a standalone local file.
This ensures you can perform cryptographic operations without an active internet connection (Air-Gapped Mode).

FEATURES:
1. Local Encryption/Decryption.
2. Dictionary Attack (Requires Internet for API).
3. Brute Force Engine.

> <a href="#/download/vigenere-tool.zip">DOWNLOAD_TOOLKIT.ZIP</a>

INSTRUCTIONS:
1. Download the archive.
2. Unzip to your local machine.
3. Open \`vigenere-tool.html\` in your browser.

-----------------------------------------------------------
END OF LOG
-----------------------------------------------------------`
    }
};

export const render = (articleId) => {
    // Determine the article dynamically (fallback to finding it via URL hash if argument is empty)
    const id = articleId || window.location.location.split('/').pop();
    const article = ARTICLE_DB[id] || { 
        file: 'error.txt', 
        theme: '#FF3333', 
        content: '<h1>404 // FILE NOT FOUND</h1><p>The requested document could not be located in the archive.</p>' 
    };

    return `
        <style>
            .nano-wrapper { background-color: #111; color: #ccc; min-height: 100vh; width: 100%; padding: 20px; padding-bottom: 100px; font-family: 'Courier New', monospace; box-sizing: border-box; }
            .editor-header { background: #fff; color: #000; padding: 5px; font-weight: bold; display: flex; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
            .nano-content { max-width: 800px; margin: 20px auto; white-space: pre-wrap; line-height: 1.5; }
            .nano-content h1 { color: ${article.theme}; border-bottom: 1px double ${article.theme}; margin-bottom: 15px; }
            .nano-content h2 { color: ${article.theme}; margin-top: 30px; }
            .nano-content a { color: ${article.theme}; text-decoration: underline; cursor: pointer; }
            .nano-content code { background: #333; color: #fff; padding: 2px 5px; }
            .nano-content ul { list-style-type: square; color: #88ff88; margin-left: 20px;}
            .instruction { position: fixed; bottom: 10px; right: 10px; background: ${article.theme}; color: #000; padding: 5px 10px; font-weight: bold; cursor: pointer; z-index: 100; }
        </style>

        <div class="nano-wrapper">
            <div class="editor-header">
                <span>GNU nano 6.0</span>
                <span>File: ${article.file}</span>
                <span>Modified</span>
            </div>

            <div class="nano-content">
                ${article.content}
            </div>

            <div class="instruction" onclick="window.location.location = '/pages'">
                [ ^X EXIT ] (Click or Type 'back')
            </div>
        </div>
    `;
};

export const init = (articleId) => {
    const id = articleId || window.location.location.split('/').pop();
    const article = ARTICLE_DB[id];

    // Localized Command Handler
    window.handlePageCommand = function(cmd) {
        if (cmd === 'return' || cmd === 'back' || cmd === 'exit') { 
            window.location.location = '/pages'; 
            return true; 
        }
        
        // Handle specific actions for tools (e.g. 'run', 'download', 'get')
        if (article && article.actionCmd) {
            if (cmd === article.actionCmd || (article.actionCmd === 'download' && cmd === 'get')) {
                // If it's a download link, execute it native style
                if (article.actionPath.includes('download')) {
                    alert(`Initiating download for ${article.file}...`);
                    // In a real app, you would create an invisible <a> tag and click it here
                } else {
                    window.location.location = article.actionPath;
                }
                return true;
            }
        }
        
        return null;
    };
};