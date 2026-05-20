document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Determine Path Depth
    const path = window.location.pathname;
    const filename = path.split('/').pop() || "index.html";
    
    let relativePrefix = "./"; 
    if (path.includes("/pages/") || path.includes("/admin/")) {
        relativePrefix = "../";
    } else if (path.includes("/posts/") || path.includes("/projects/") || path.includes("/archives/")) {
        relativePrefix = "../../";
    }

    // 2. Load Sidebar
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        fetch(relativePrefix + "assests/includes/sidebar.html")
            .then(res => res.text())
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
            .catch(err => console.error("Sidebar Load Error:", err));
    }

    // 3. Load Comments (If allowed)
    const noCommentsList = [
        "index.html", "login.html", "account.html", "404.html", 
        "admin-posting.html", "archive.html", "stats.html", "feature-request.html", "tech-tips.html", "coding-projects.html",
        "updates.html", "beta.html", "app-install.html", ""
    ];

    if (!noCommentsList.includes(filename)) {
        const mainElement = document.querySelector('main');
        // Only inject if main exists and we haven't already injected (check for class)
        if (mainElement && !document.querySelector('.comments-section')) {
            fetch(relativePrefix + "assests/includes/comments.html")
                .then(res => res.text())
                .then(data => {
                    mainElement.insertAdjacentHTML('beforeend', data);
                })
                .catch(err => console.log("Comments Load Error:", err));
        }
    }
});
