// This file contains the complete JavaScript logic for the login page,
// including user authentication and UI updates.

/**
 * Initializes Firebase Authentication and sets up event listeners.
 * This function should be called once the DOM is fully loaded.
 */
function initLogin() {
    // Wait until the Firebase library and its modules are loaded
    const checkFirebase = setInterval(() => {
        if (typeof firebase !== 'undefined' && typeof firebase.auth === 'function') {
            clearInterval(checkFirebase);
            
            const auth = firebase.auth();
            
            // Set up event listeners for the authentication buttons
            setupAuthControls(auth);

            // Listen for changes in the authentication state to update the UI
            auth.onAuthStateChanged(user => {
                updateAuthUI(user);
            });
        }
    }, 100);
}

/**
 * Sets up click listeners for sign-in and sign-up buttons.
 * @param {object} auth - The Firebase Auth instance.
 */
function setupAuthControls(auth) {
    const signInBtn = document.getElementById('sign-in-btn');
    const signUpBtn = document.getElementById('sign-up-btn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const authMessage = document.getElementById('auth-message');

    // Get the previous page URL for redirection after login/signup
    const referrer = document.referrer;
    // Set a fallback URL if the referrer is empty
    const redirectUrl = referrer && referrer.length > 0 ? referrer : 'homepage.html';

    // Add event listener for the sign-up button
    if (signUpBtn) {
        signUpBtn.addEventListener('click', () => {
            const email = emailInput.value;
            const password = passwordInput.value;
            
            // Validate that email and password are not empty
            if (!email || !password) {
                displayMessage(authMessage, "Please enter an email and password.", "red");
                return;
            }

            // Create a new user with email and password
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Get the user object from the credential
                    const user = userCredential.user;
                    // Set the display name immediately after account creation
                    const displayName = email.split('@')[0];
                    return user.updateProfile({
                        displayName: displayName
                    }).then(() => {
                        // Crucial step: Set the persistence to LOCAL
                        // This ensures the user stays signed in across browser sessions
                        return auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                            .then(() => {
                                displayMessage(authMessage, "Account created successfully! You are now signed in.", "green");
                                // Redirect to the previous page after a successful sign-up
                                setTimeout(() => {
                                    window.location.href = redirectUrl;
                                }, 1500);
                            });
                    });
                })
                .catch((error) => {
                    // Handle and display any authentication errors
                    displayMessage(authMessage, `Error: ${error.message}`, "red");
                });
        });
    }

    // Add event listener for the sign-in button
    if (signInBtn) {
        signInBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;
            
            // Validate that email and password are not empty
            if (!email || !password) {
                displayMessage(authMessage, "Please enter an email and password.", "red");
                return;
            }

            // Sign in the user with email and password
            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    // Crucial step: Set the persistence to LOCAL
                    // This ensures the user stays signed in across browser sessions
                    return auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                        .then(() => {
                            displayMessage(authMessage, "Signed in successfully!", "green");
                            // Redirect to the previous page after a successful sign-in
                            setTimeout(() => {
                                window.location.href = redirectUrl;
                            }, 1500);
                        });
                })
                .catch((error) => {
                    // Handle and display any authentication errors
                    displayMessage(authMessage, `Error: ${error.message}`, "red");
                });
        });
    }
}

/**
 * Updates the UI elements based on the current user's authentication state.
 * @param {object|null} user - The Firebase user object or null if signed out.
 */
function updateAuthUI(user) {
    const authContainer = document.getElementById('auth-container');
    const userDisplay = document.getElementById('user-display');
    const userEmailDisplay = document.getElementById('user-email-display');

    if (!authContainer || !userDisplay || !userEmailDisplay) {
        console.error("Missing UI elements. Please check your HTML for required IDs.");
        return;
    }

    if (user) {
        // If a user is signed in, hide the login form and show the user info
        authContainer.classList.add('hidden');
        userDisplay.classList.remove('hidden');
        const displayName = user.displayName || user.email.split('@')[0];
        userEmailDisplay.textContent = `Welcome, ${displayName}! You are signed in.`;

    } else {
        // If no user is signed in, hide the user info and show the login form
        authContainer.classList.remove('hidden');
        userDisplay.classList.add('hidden');
    }
}

/**
 * Helper function to display messages to the user.
 * @param {HTMLElement} element - The DOM element to display the message in.
 * @param {string} message - The message text.
 * @param {string} color - The text color.
 */
function displayMessage(element, message, color) {
    element.textContent = message;
    element.style.color = color;
}


// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', initLogin);
