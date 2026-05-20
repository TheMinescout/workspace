import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your Config
const firebaseConfig = {
    apiKey: "AIzaSyAZE1qCY8YCZLrZ2EWT0QTFRoBVHvabqDM",
    authDomain: "minescout-life-4a668.firebaseapp.com",
    databaseURL: "https://minescout-life-4a668-default-rtdb.firebaseio.com",
    projectId: "minescout-life-4a668",
    storageBucket: "minescout-life-4a668.appspot.com",
    messagingSenderId: "351393417322",
    appId: "1:351393417322:web:92c9a92a50e60890136213",
    measurementId: "G-RFP78TP9KZ"
};

const ADMIN_EMAIL = 'theminescout@minescout.net';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// --- THE MAIN USER LOGIC ---
onAuthStateChanged(auth, async (user) => {
    // 1. Get HTML Elements (These must exist on every page)
    const authContainer = document.getElementById('auth-container');
    const userDisplay = document.getElementById('user-display');
    const userEmailDisplay = document.getElementById('user-email-display');
    const adminPanel = document.getElementById('admin-panel'); // Optional, might not exist on all pages

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
                // Show Admin Panel if it exists on this page
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
                // Determine where to redirect based on current location
                // If deep in folders, go back to root
                window.location.href = "/index.html"; 
            })
            .catch(err => console.error("Sign out failed:", err));
    });
}

// Export auth/db in case other scripts need them
export { auth, db, app };