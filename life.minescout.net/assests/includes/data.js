/**
 * MINESCOUT LIFE OS - CENTRAL DATA STORE
 * Update your active projects, stats, and configurations here.
 */

export const siteData = {
    // Projects actively being worked on (Shows in the sidebar)
    nowBuilding: [
        { 
            title: "Geo Quiz AI", 
            desc: "Training custom models for terrain recognition.", 
            color: "var(--danger)" // Red pulse
        },
        { 
            title: "LifeOS v3 Timeline", 
            desc: "Implementing modular sidebars & dynamic data.", 
            color: "var(--success)" // Green pulse
        },
        { 
            title: "Eagle Final Paperwork", 
            desc: "Formatting the binder & project reports.", 
            color: "var(--warning)" // Orange pulse
        }
    ],

    // Configuration for the Hero Dashboard Stats
    config: {
        eagleBadgesRequired: 21,
        defaultFilter: "all"
    }
};
