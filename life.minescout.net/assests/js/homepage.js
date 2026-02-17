// assests/js/homepage.js

import { initFeatures } from "./features.js";
import { db, auth } from "./firebase-config.js";
import { ref, onValue, push, serverTimestamp, runTransaction } 
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    initGridControls();
    initModals();
    initVoting();
    initComments(); // Now robust with auto-retry
    initFeatures(); 
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

    const modalImg = modal.querySelector('img');
    const modalCaption = modal.querySelector('figcaption');

    document.querySelectorAll('.modal-trigger').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const src = this.getAttribute('data-image-src');
            const caption = this.getAttribute('data-caption');
            if (modalImg) modalImg.src = src;
            if (modalCaption) modalCaption.textContent = caption;
            modal.classList.add('show');
        });
    });
    
    const closeBtn = modal.querySelector('.modal-close');
    if(closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('show'));
    
    window.addEventListener('click', (e) => { 
        if (e.target === modal) modal.classList.remove('show'); 
    });
    
    document.addEventListener('keydown', (e) => { 
        if (e.key === "Escape" && modal.classList.contains('show')) modal.classList.remove('show'); 
    });
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

        onValue(voteRef, (snapshot) => {
            const data = snapshot.val() || {};
            let total = 0;
            Object.values(data).forEach(val => total += (val || 0));

            section.querySelectorAll('[class*="vote-bar-"]').forEach(bar => {
                const optionName = Array.from(bar.classList).find(c => c.startsWith('vote-bar-')).replace('vote-bar-', '');
                const score = data[optionName] || 0;
                const percent = total === 0 ? 0 : Math.round((score / total) * 100);
                
                bar.style.width = `${percent}%`;
                const span = bar.querySelector('span');
                if(span) span.textContent = score;
            });
        });

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

// --- COMMENTS SYSTEM (UPDATED WITH RETRY LOGIC) ---
function initComments() {
    const postMain = document.querySelector('main.post-main');
    if (!postMain) return; // Not a post page

    const postId = postMain.dataset.postId;
    if (!postId) return;

    // 1. Wait for Loader to inject HTML
    const commentInterval = setInterval(() => {
        const commentSection = document.querySelector('.comments-section');
        const form = document.querySelector('.comments-section form');
        const list = document.querySelector('.comments-list');

        if (commentSection && form && list) {
            clearInterval(commentInterval); // Stop waiting
            console.log("Comments HTML found. connecting Firebase...");
            
            // 2. Load Comments
            loadComments(list, postId);

            // 3. Attach Submit Listener
            attachCommentSubmit(form, postId);
            
            // 4. Auto-fill name if logged in
            const nameInput = form.querySelector('input[name="name"]');
            if (auth.currentUser && nameInput) {
                const user = auth.currentUser;
                nameInput.value = user.displayName || user.email.split('@')[0];
                nameInput.readOnly = true;
                nameInput.style.backgroundColor = "#f0f0f0";
            }
        }
    }, 500); // Check every 500ms
}

function loadComments(list, postId) {
    onValue(ref(db, `comments/${postId}`), (snapshot) => {
        list.innerHTML = "";
        const data = snapshot.val();
        
        if (!data) {
            list.innerHTML = '<p style="text-align:center; color:#888;">No comments yet. Be the first!</p>';
            return;
        }
        
        // Sort newest first
        Object.values(data)
            .sort((a, b) => b.timestamp - a.timestamp)
            .forEach(c => {
                const date = new Date(c.timestamp).toLocaleString();
                const div = document.createElement('div');
                div.className = "comment";
                div.style = "background: #fff; border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px;";
                div.innerHTML = `
                    <div style="font-size: 0.85em; color: #666; margin-bottom: 5px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                        <strong>${escapeHtml(c.name)}</strong> • ${date}
                    </div>
                    <div style="color: #333;">${escapeHtml(c.comment)}</div>
                `;
                list.appendChild(div);
            });
    });
}

function attachCommentSubmit(form, postId) {
    // Remove old listeners to prevent duplicates
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        
        if (!user) {
            alert("You must be logged in to comment.");
            return;
        }

        const nameInput = newForm.querySelector('input[name="name"]');
        const commentInput = newForm.querySelector('textarea[name="comment"]');
        
        if (!commentInput.value.trim()) return;

        const btn = newForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = "Posting...";
        btn.disabled = true;

        try {
            await push(ref(db, `comments/${postId}`), {
                name: nameInput.value,
                comment: commentInput.value,
                timestamp: serverTimestamp(),
                uid: user.uid
            });
            commentInput.value = ""; // Clear box
        } catch (err) {
            alert("Error posting: " + err.message);
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}

function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
