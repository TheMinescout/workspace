// assests/js/auth.js

// IMPORT from your new config file
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const ADMIN_EMAIL = 'theminescout@minescout.net';

// --- THE MAIN USER LOGIC ---
onAuthStateChanged(auth, async (user) => {
    // 1. Get HTML Elements (These must exist on every page)
    const authContainer = document.getElementById('auth-container');
    const userDisplay = document.getElementById('user-display');
    const userEmailDisplay = document.getElementById('user-email-display');
    const adminPanel = document.getElementById('admin-panel'); 

    if (user) {
        // --- USER IS LOGGED IN ---
        const isAdmin = user.email === ADMIN_EMAIL;
        
        // Toggle UI
        if(authContainer) authContainer.style.display = 'none';
        if(userDisplay) userDisplay.classList.remove('hidden');

        // Fetch Username from Database
        const usernameRef = ref(db, `usernames/${user.uid}`);
        const snapshot = await get(usernameRef);
        const username = snapshot.exists() ? snapshot.val() : user.email;

        // Update Text
        if(userEmailDisplay) {
            if (isAdmin) {
                userEmailDisplay.textContent = `Admin: ${username}`;
                if (adminPanel) adminPanel.classList.remove('hidden');
            } else {
                userEmailDisplay.textContent = username;
                if (adminPanel) adminPanel.classList.add('hidden');
            }
        }
    } else {
        // --- USER IS LOGGED OUT ---
        if(authContainer) authContainer.style.display = 'block';
        if(userDisplay) userDisplay.classList.add('hidden');
        if(adminPanel) adminPanel.classList.add('hidden');
    }
});

// --- SIGN OUT LOGIC ---
const signOutBtn = document.getElementById('signOut-btn');
if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                window.location.href = "/index.html"; 
            })
            .catch(err => console.error("Sign out failed:", err));
    });
}