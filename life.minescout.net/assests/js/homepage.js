// assests/js/homepage.js
import { db, auth } from "./firebase-config.js";
import { ref, onValue, push, serverTimestamp, runTransaction } 
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    initGridControls();
    initModals();
    initVoting();
    initComments();
    // Sidebar highlight handled by loader.js now
});

// --- GRID CONTROLS ---
function initGridControls() {
    const gridButtons = document.querySelectorAll('.view-btn');
    const postsContainer = document.getElementById('posts-container') || document.getElementById('all-posts-container');

    if (gridButtons.length > 0 && postsContainer) {
        const savedView = localStorage.getItem('gridView') || '3';
        postsContainer.className = `posts-grid view-${savedView}`;
        
        const activeBtn = document.querySelector(`.view-btn[data-view="${savedView}"]`);
        if (activeBtn) {
            gridButtons.forEach(b => b.classList.remove('active'));
            activeBtn.classList.add('active');
        }

        gridButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.getAttribute('data-view');
                postsContainer.className = `posts-grid view-${view}`;
                gridButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                localStorage.setItem('gridView', view);
            });
        });
    }
}

// --- IMAGE MODALS ---
function initModals() {
    const modal = document.getElementById('image-modal');
    if (!modal) return;

    document.querySelectorAll('.modal-trigger').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            // Basic modal logic - ensure you have the HTML for the modal in your page/footer
            modal.classList.add('show');
        });
    });
    
    // Close logic...
    const closeBtn = modal.querySelector('.modal-close');
    if(closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('show'));
}

// --- VOTING SYSTEM ---
function initVoting() {
    const voteSections = document.querySelectorAll('.vote-section');
    if (voteSections.length === 0) return;

    const postMain = document.querySelector('main.post-main');
    const postId = postMain ? postMain.dataset.postId : null;

    voteSections.forEach(section => {
        const voteId = section.dataset.voteId;
        if (!voteId) return;

        const dbPath = postId ? `votes/${postId}/${voteId}` : `votes/${voteId}`;
        const voteRef = ref(db, dbPath);

        // Listen for updates
        onValue(voteRef, (snapshot) => {
            const data = snapshot.val() || {};
            let total = 0;
            Object.values(data).forEach(val => total += (val || 0));

            section.querySelectorAll('[class*="vote-bar-"]').forEach(bar => {
                // Get option name from class (e.g. vote-bar-Gemini -> Gemini)
                const optionName = Array.from(bar.classList).find(c => c.startsWith('vote-bar-')).replace('vote-bar-', '');
                const score = data[optionName] || 0;
                const percent = total === 0 ? 0 : Math.round((score / total) * 100);
                
                bar.style.width = `${percent}%`;
                const span = bar.querySelector('span');
                if(span) span.textContent = score;
            });
        });

        // Handle Clicks
        section.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const user = auth.currentUser;
                if (!user) {
                    alert("Please sign in to vote!");
                    return;
                }
                const option = btn.dataset.voteOption;
                const optionRef = ref(db, `${dbPath}/${option}`);
                
                try {
                    await runTransaction(optionRef, (votes) => (votes || 0) + 1);
                    btn.textContent = "Voted!";
                    section.querySelectorAll('.vote-btn').forEach(b => b.disabled = true);
                } catch (error) {
                    console.error("Vote failed", error);
                }
            });
        });
    });
}

// --- COMMENTS SYSTEM ---
function initComments() {
    const commentSection = document.querySelector('.comments-section');
    if (!commentSection) return;

    const postMain = document.querySelector('main.post-main');
    const postId = postMain ? postMain.dataset.postId : null;
    if (!postId) return;

    const list = commentSection.querySelector('.comments-list');
    const form = commentSection.querySelector('form');

    // Load Comments
    onValue(ref(db, `comments/${postId}`), (snapshot) => {
        list.innerHTML = "";
        const data = snapshot.val();
        if (!data) {
            list.innerHTML = "<p>No comments yet.</p>";
            return;
        }
        // Sort newest first
        Object.values(data)
            .sort((a, b) => b.timestamp - a.timestamp)
            .forEach(c => {
                const div = document.createElement('div');
                div.className = "comment";
                div.innerHTML = `
                    <div class="comment-meta"><strong>${escapeHtml(c.name)}</strong></div>
                    <p>${escapeHtml(c.comment)}</p>
                `;
                list.appendChild(div);
            });
    });

    // Post Comment
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = auth.currentUser;
            const nameInput = form.querySelector('input[name="name"]');
            const commentInput = form.querySelector('textarea[name="comment"]');
            
            // Auto-fill name if logged in
            let name = nameInput.value;
            if (user && user.email && !name) name = user.email.split('@')[0];

            if (!commentInput.value) return;

            try {
                await push(ref(db, `comments/${postId}`), {
                    name: name,
                    comment: commentInput.value,
                    timestamp: serverTimestamp(),
                    uid: user ? user.uid : "anon"
                });
                commentInput.value = "";
            } catch (err) {
                alert("Error posting: " + err.message);
            }
        });
    }
}

function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}