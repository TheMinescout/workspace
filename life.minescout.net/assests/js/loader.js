document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. PATH CALCULATION ---
    const path = window.location.pathname;
    const filename = path.split('/').pop() || "index.html"; // Default to index if root
    
    let relativePrefix = "./"; 
    if (path.includes("/pages/") || path.includes("/admin/")) {
        relativePrefix = "../";
    } else if (path.includes("/posts/") || path.includes("/projects/") || path.includes("/archives/")) {
        relativePrefix = "../../";
    }

    // --- 2. SIDEBAR INJECTION ---
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        fetch(relativePrefix + "assests/includes/sidebar.html")
            .then(res => { if(!res.ok) throw new Error("Sidebar missing"); return res.text(); })
            .then(data => {
                // Fix links
                const fixedData = data.replace(/href="\//g, `href="${relativePrefix}`);
                sidebarContainer.innerHTML = fixedData;
                
                // Highlight active link
                const links = sidebarContainer.querySelectorAll('a');
                links.forEach(link => {
                    if (link.getAttribute('href').includes(filename)) {
                        link.style.fontWeight = 'bold';
                        link.style.color = '#2e4d2e';
                    }
                });
            })
            .catch(err => console.error(err));
    }

    // --- 3. COMMENTS INJECTION ---
    // The Manual List of pages that should NOT have comments
    const noCommentsList = [
        "index.html",
        "login.html",
        "account.html",
        "404.html",
        "admin-posting.html",
        "archive.html", // The main archive list
        "archive-2025.html",// Yearly archives
        "tech-tips.html" ,
        "feature-request.html",
        "coding-projects.html",
        "updates.html",
        "beta.html",
        "",
        "",

        // Add any other pages here
    ];

    // Only load comments if the current file is NOT in the list
    if (!noCommentsList.includes(filename)) {
        
        // We inject comments into the <main> tag
        const mainElement = document.querySelector('main');
        
        if (mainElement) {
            fetch(relativePrefix + "assests/includes/comments.html")
                .then(res => { if(!res.ok) throw new Error("Comments file missing"); return res.text(); })
                .then(data => {
                    // Append comments to the bottom of Main
                    mainElement.insertAdjacentHTML('beforeend', data);
                    
                    // IMPORTANT: Tell homepage.js that comments are ready
                    const event = new Event('minescout-comments-ready');
                    document.dispatchEvent(event);
                })
                .catch(err => console.log("Comments skipped or error:", err.message));
        }
    }
});