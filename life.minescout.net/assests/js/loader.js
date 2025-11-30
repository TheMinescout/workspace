document.addEventListener("DOMContentLoaded", function() {
    const sidebarContainer = document.getElementById('sidebar-container');
    
    if (sidebarContainer) {
        // 1. Calculate how deep we are in the folder structure
        // We look for specific folder names to determine depth
        const path = window.location.pathname;
        let relativePrefix = "./"; // Default for index.html

        if (path.includes("/pages/") || path.includes("/admin/")) {
            relativePrefix = "../";
        } else if (path.includes("/posts/") || path.includes("/projects/") || path.includes("/archives/")) {
            // These folders are usually 2 levels deep (e.g. posts/tech/file.html)
            relativePrefix = "../../";
        }

        // 2. Construct the path to the sidebar file
        const sidebarUrl = relativePrefix + "assests/includes/sidebar.html";

        // 3. Fetch and Inject
        fetch(sidebarUrl)
            .then(response => {
                if (!response.ok) throw new Error(`Could not find sidebar at ${sidebarUrl}`);
                return response.text();
            })
            .then(data => {
                // 4. Fix the links inside the sidebar HTML before injecting
                // This replaces the root slash "/" with the correct relative path
                // e.g. href="/index.html" becomes href="../../index.html"
                const fixedData = data.replace(/href="\//g, `href="${relativePrefix}`);
                
                sidebarContainer.innerHTML = fixedData;
                
                // 5. Highlight the active link
                const currentFilename = path.split('/').pop();
                const links = sidebarContainer.querySelectorAll('a');
                links.forEach(link => {
                    if (link.getAttribute('href').includes(currentFilename)) {
                        link.style.fontWeight = 'bold';
                        link.style.color = '#2e4d2e';
                    }
                });
            })
            .catch(error => {
                console.error('Sidebar Error:', error);
                sidebarContainer.innerHTML = `<p style="color:red; padding:10px;">Error loading sidebar. check console.</p>`;
            });
    }
});