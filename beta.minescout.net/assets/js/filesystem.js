/* 
    FILESYSTEM v4.0
    - Added 'secrets' array for hidden files
    - Added content properties for text reading
*/

const FILE_SYSTEM = {
    // PUBLIC ARTICLES
    articles: [
        { 
            cmd: "open_crypto", title: "TOOL: Vigenère Cipher", 
            path: "content/articles/vigenere-release.html", 
            desc: "// Offline Utility", date: "2025-12-05"
        },
        { 
            cmd: "open_cog", title: "RELEASE: Cognisearch (v5)", 
            path: "content/articles/cognisearch.html", 
            desc: "// Optimization Update", date: "2025-11-30"
        }
    ],

    // PUBLIC PROJECTS
    projects: [
        { 
            cmd: "run_writer", title: "AI Writer Suite", 
            path: "content/projects/ai-writer.html", 
            desc: "// HTML Generator" 
        },
        { 
            cmd: "dwn_ai", title: "AI News Synthesis.zip", 
            path: "content/projects/ai-news-synthesis.zip", 
            desc: "// Source Code" 
        }
    ],

    // HIDDEN FILES (Requires 'ls -a' to see)
    secrets: [
        {
            name: "sys_log.txt",
            content: "ERR: UNSTABLE SECTOR DETECTED.\nUser 'TheMinescout' attempted override.\nHint: The admin password for Level 1 access is hidden in the Tech Tips footer."
        },
        {
            name: "project_chimera.enc",
            content: "ENCRYPTED DATA.\nTo decrypt, you need Level 2 Clearance.\nTry running: sudo [password]"
        },
        {
            name: ".config",
            content: "PHYSICS_ENGINE: ACTIVE\nMATRIX_CORE: ONLINE\nDEBUG_MODE: FALSE"
        }
    ]
};