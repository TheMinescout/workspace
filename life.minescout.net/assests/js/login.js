// assests/js/login.js

// 1. IMPORT THE CONFIGURATION
import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const authBtn = document.getElementById('auth-btn');
    const toggleLink = document.getElementById('toggle-link');
    const authForm = document.getElementById('auth-form');
    const msg = document.getElementById('auth-message');
    
    let isSignIn = true;

    // 2. TOGGLE SIGN IN / SIGN UP
    if (toggleLink) {
        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            isSignIn = !isSignIn;
            
            // Toggle Visibility
            document.getElementById('username-group').style.display = isSignIn ? 'none' : 'block';
            document.getElementById('password-check-group').style.display = isSignIn ? 'none' : 'block';
            
            // Update Text
            document.querySelector('.login-card h2').textContent = isSignIn ? 'Sign In' : 'Sign Up';
            authBtn.textContent = isSignIn ? 'Sign In' : 'Sign Up';
            toggleLink.textContent = isSignIn ? 'Sign up here' : 'Sign in here';
            
            // Clear errors
            if(msg) msg.textContent = "";
        });
    }

    // 3. HANDLE FORM SUBMISSION
    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // STOP PAGE REFRESH
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if(msg) {
                msg.textContent = "Processing...";
                msg.style.color = "blue";
            }
            
            try {
                if (isSignIn) {
                    // --- LOG IN ---
                    await signInWithEmailAndPassword(auth, email, password); 
                    
                    if(msg) {
                        msg.textContent = "Success! Redirecting...";
                        msg.style.color = "green";
                    }
                    // Go back to previous page or index
                    setTimeout(() => {
                        window.location.href = "index.html"; 
                    }, 1000);
                } else {
                    // --- SIGN UP ---
                    const username = document.getElementById('username').value;
                    const confirm = document.getElementById('password-check').value;
                    
                    if(password !== confirm) throw new Error("Passwords do not match");
                    if(!username) throw new Error("Username required");
                    
                    // Create Auth User
                    const cred = await createUserWithEmailAndPassword(auth, email, password);
                    
                    // Save Username to Database
                    await set(ref(db, 'usernames/' + cred.user.uid), username);
                    
                    if(msg) {
                        msg.textContent = "Account created! Redirecting...";
                        msg.style.color = "green";
                    }
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 1000);
                }
            } catch (error) {
                console.error("Auth Error:", error);
                if(msg) {
                    msg.textContent = error.message;
                    msg.style.color = "red";
                }
            }
        });
    }
});