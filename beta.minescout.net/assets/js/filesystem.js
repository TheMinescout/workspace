const FILE_SYSTEM = {
    articles: [
        { cmd:"open_evolution", title:"DESIGN: The Evolution of Minescout Beta", path:"content/articles/minescout-beta-evolution", desc:"From terminal experiment to research archive", date:"2026-08-09" },
        { cmd:"open_vigenere", title:"TOOL: Vigenère Cipher", path:"content/articles/vigenere-release", desc:"Offline cryptography utility", date:"2025-12-05" },
        { cmd:"open_cog", title:"RELEASE: Cognisearch v5", path:"content/articles/cognisearch", desc:"Optimization and naming update", date:"2025-11-30" },
        { cmd:"open_writer", title:"RELEASE: AI Writer", path:"content/articles/ai-writer-release", desc:"Community writing tool release", date:"2025-11-24" },
        { cmd:"open_portfolio", title:"RELEASE: Portfolio Projection", path:"content/articles/portfolio-release", desc:"Projection tool release notes", date:"2025-11-18" }
    ],
    projects: [
        { cmd:"run_writer", title:"AI Writer Suite", path:"content/projects/ai-writer", desc:"Community HTML generator" },
        { cmd:"run_cog", title:"Cognisearch v5", path:"content/projects/cognisearch-v5.zip", desc:"Search / synthesis source archive" },
        { cmd:"run_portfolio", title:"Portfolio Projection", path:"content/projects/portfolio-tool", desc:"Interactive projection tool" },
        { cmd:"run_vigenere", title:"Vigenère Tool", path:"content/projects/vigenere-tool", desc:"Browser-based cipher utility" }
    ],
    archived_projects:[
        { cmd:"run_news_v1", title:"AI News Synthesis v1", path:"content/archive/projects/ai-news-v1.zip", desc:"Legacy source archive" }
    ],
    archived_articles:[
        { cmd:"open_news_v1", title:"AI News Synthesis v1", path:"content/archive/articles/news-v1", desc:"Legacy release notes", date:"2025-10-01" }
    ],
    secrets:[
        {name:"sys_log.txt",content:"ERR: UNSTABLE SECTOR DETECTED.\nUser 'TheMinescout' attempted override.\nHint: the admin password for Level 1 access is hidden in the Tech Tips footer."},
        {name:"project_chimera.enc",content:"ENCRYPTED DATA.\nTo decrypt, you need Level 2 Clearance.\nTry running: sudo [password]"},
        {name:".config",content:"PHYSICS_ENGINE: ACTIVE\nMATRIX_CORE: ONLINE\nDEBUG_MODE: FALSE"}
    ]
};