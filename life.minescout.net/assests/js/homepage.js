// Function definitions first to prevent "ReferenceError"
// This ensures all functions are defined before being called.

// -------------------- AUTHENTICATION FUNCTIONS --------------------

/**
 * Sets up click listeners for sign-in, sign-up, and sign-out buttons.
 * This function should be called once on page load.
 * @param {object} auth - The Firebase Auth instance.
 */
function setupAuthControls(auth) {
    const signInBtn = document.getElementById('sign-in-btn');
    const signUpBtn = document.getElementById('sign-up-btn');
    const signOutBtn = document.getElementById('signOut-btn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const authMessage = document.getElementById('auth-message');

    // Attach click listeners to buttons
    if (signInBtn && signUpBtn && emailInput && passwordInput) {
        signUpBtn.addEventListener('click', () => {
            // Clear previous error messages
            authMessage.textContent = ''; 
            authMessage.style.color = '';

            const email = emailInput.value;
            const password = passwordInput.value;
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    const displayName = email.split('@')[0];
                    // Setting displayName
                    return user.updateProfile({
                        displayName: displayName
                    });
                    // *** FIX: Removed redundant setPersistence and success UI update. 
                    // The onAuthStateChanged listener handles the success UI. ***
                })
                .catch((error) => {
                    authMessage.textContent = `Error: ${error.message}`;
                    authMessage.style.color = "red";
                });
        });

        signInBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Clear previous error messages
            authMessage.textContent = ''; 
            authMessage.style.color = '';
            
            const email = emailInput.value;
            const password = passwordInput.value;
            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    // *** FIX: Removed redundant setPersistence and success UI update. 
                    // The onAuthStateChanged listener handles the success UI. ***
                })
                .catch((error) => {
                    authMessage.textContent = `Error: ${error.message}`;
                    authMessage.style.color = "red";
                });
        });
    }

    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            auth.signOut().then(() => {
                console.log("Signed out successfully.");
            }).catch(error => {
                console.error("Sign out error:", error);
            });
        });
    }
}

/**
 * Updates the UI elements based on the current user's authentication state.
 * This is called by the `onAuthStateChanged` listener.
 * @param {object|null} user - The Firebase user object or null if signed out.
 */
function updateAuthUI(user) {
    const authContainer = document.getElementById('auth-container');
    const userDisplay = document.getElementById('user-display');
    const userEmailDisplay = document.getElementById('user-email-display');

    if (!authContainer || !userDisplay || !userEmailDisplay) return;

    if (user) {
        authContainer.classList.add('hidden');
        userDisplay.classList.remove('hidden');
        // This is the line that gets the user's name!
        const displayName = user.displayName || user.email.split('@')[0];
        userEmailDisplay.textContent = `Welcome, ${displayName}`;

        // Add success message if authMessage exists and is currently an error
        const authMessage = document.getElementById('auth-message');
        if (authMessage && authMessage.style.color === "red") {
            authMessage.textContent = "Signed in successfully!";
            authMessage.style.color = "green";
        }
    } else {
        authContainer.classList.remove('hidden');
        userDisplay.classList.add('hidden');
    }
}

// -------------------- POSTS, COMMENTS, AND VOTING FUNCTIONS --------------------

/**
 * Initializes voting functionality for all vote sections on the page.
 * @param {object} database - The Firebase Database instance.
 * @param {object|null} user - The Firebase user object or null if logged out.
 */
function setupAllVoting(database, user) {
    const voteSections = document.querySelectorAll('.vote-section');
    if (!voteSections.length) return;

    voteSections.forEach(section => {
        const voteId = section.dataset.voteId;
        if (!voteId) return;

        const buttons = section.querySelectorAll('.vote-btn');
        const options = Array.from(buttons).map(btn => btn.dataset.voteOption);
        const postIdentifier = document.querySelector('main[data-post-id]')?.dataset.postId;
        const firebasePath = postIdentifier ? `votes/${postIdentifier}/${voteId}` : `votes/${voteId}`;
        const voteRef = database.ref(firebasePath);
        const userVoteRef = user ? database.ref(`user-votes/${user.uid}/${voteId}`) : null;

        // Listen for real-time changes to the votes
        voteRef.on('value', (snapshot) => {
            const votes = snapshot.val() || {};
            let totalVotes = 0;
            
            // Calculate total votes and update the UI
            options.forEach(option => {
                votes[option] = votes[option] || 0;
                totalVotes += votes[option];
            });

            options.forEach(option => {
                const count = votes[option];
                const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : (100 / options.length);
                
                const votesEl = section.querySelector(`.${option}-votes`);
                const barEl = section.querySelector(`.vote-bar-${option}`);
                if (votesEl) votesEl.textContent = count;
                if (barEl) barEl.style.width = `${percentage}%`;
            });
        }, (error) => {
            console.error("Error loading votes:", error);
        });

        // Check if the current user has already voted
        if (user && userVoteRef) {
            userVoteRef.once('value').then(snapshot => {
                const userVoteOption = snapshot.val();
                if (userVoteOption) {
                    disableVoting(buttons, userVoteOption);
                } else {
                    enableVoting(buttons, voteRef, userVoteRef);
                }
            });
        } else {
            // If no user is logged in, disable the buttons
            buttons.forEach(button => button.disabled = true);
        }
    });
}

/**
 * Disables voting buttons and marks the user's selected option.
 * @param {NodeList} buttons - The vote buttons.
 * @param {string} userVoteOption - The option the user voted for.
 */
function disableVoting(buttons, userVoteOption) {
    buttons.forEach(button => {
        button.disabled = true;
        if (button.dataset.voteOption === userVoteOption) {
            button.classList.add('voted');
        }
    });
}

/**
 * Enables voting buttons and adds click listeners.
 * @param {NodeList} buttons - The vote buttons.
 * @param {object} voteRef - Firebase reference to the vote counts.
 * @param {object} userVoteRef - Firebase reference to the user's vote history.
 */
function enableVoting(buttons, voteRef, userVoteRef) {
    buttons.forEach(button => {
        button.disabled = false;
        button.addEventListener('click', () => {
            const voteOption = button.dataset.voteOption;
            
            // Perform the transaction to increment the vote count
            const optionRef = voteRef.child(voteOption);
            optionRef.transaction((currentVotes) => (currentVotes || 0) + 1);
            
            // Record the user's vote
            userVoteRef.set(voteOption);

            // Disable buttons after voting
            disableVoting(buttons, voteOption);
        }, { once: true }); // Ensure the event listener only fires once
    });
}

/**
 * Initializes the comment system for a single post.
 * @param {object} database - The Firebase Database instance.
 * @param {object|null} user - The Firebase user object or null.
 */
function setupCommentSystem(database, user) {
    const postMain = document.querySelector('main.post-main');
    const postId = postMain?.dataset.postId;
    if (!postId) return;

    const commentFormContainer = document.querySelector('.comment-form-container');
    const commentsList = document.querySelector('.comments-list');
    const nameInput = document.getElementById('name'); // Get the name input field

    // Always load comments, as this is public content
    loadComments(database, postId);

    // Only show the comment form if the user is signed in
    if (user) {
        commentFormContainer.classList.remove('hidden');
        
        // Autopopulate and disable the name field
        if (nameInput) {
            nameInput.value = user.displayName || user.email.split('@')[0];
            nameInput.disabled = true;
            nameInput.placeholder = 'Your name (signed in)';
        }

        const commentForm = commentFormContainer.querySelector('form');
        if (commentForm) {
            commentForm.addEventListener('submit', (event) => handleCommentSubmission(event, database, postId, user));
        }
    } else {
        commentFormContainer.classList.add('hidden');
        const signInMessage = document.createElement('p');
        signInMessage.textContent = "You must be signed in to post a comment.";
        commentFormContainer.appendChild(signInMessage);
    }
}

/**
 * Fetches and displays comments in real-time.
 * @param {object} database - The Firebase Database instance.
 * @param {string} postId - The unique ID of the post.
 */
function loadComments(database, postId) {
    const commentsList = document.querySelector('.comments-list');
    const showMoreBtn = document.getElementById('show-more-btn');
    if (!commentsList) return;
    
    commentsList.innerHTML = '<p>Loading comments...</p>';
    const commentsRef = database.ref(`comments/${postId}`);

    // Variable to track the expanded state, scoped to the function
    let isExpanded = false;

    // Renders an array of comments to the DOM.
    function renderComments(commentsToRender) {
        commentsList.innerHTML = ''; // Clear the container first
        commentsToRender.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            const timestamp = new Date(comment.timestamp).toLocaleString();
            commentElement.innerHTML = `
                <p class="comment-meta"><strong>${escapeHTML(comment.name)}</strong> on ${timestamp}</p>
                <p>${escapeHTML(comment.comment)}</p>`;
            commentsList.appendChild(commentElement);
        });
    }

    // --- REAL-TIME DATA LISTENER ---
    commentsRef.orderByChild('timestamp').on('value', (snapshot) => {
        if (!snapshot.exists()) {
            commentsList.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
            if (showMoreBtn) showMoreBtn.style.display = 'none';
            return;
        }
        
        const commentsData = snapshot.val();
        // Convert to array and reverse to get latest first
        const commentsArray = Object.values(commentsData).reverse(); 
        const latestComments = commentsArray.slice(0, 3);

        // Render based on the current state (expanded or collapsed)
        if (isExpanded) {
            renderComments(commentsArray);
            if (showMoreBtn) showMoreBtn.textContent = 'Show Less';
        } else {
            renderComments(latestComments);
            if (commentsArray.length > 3) {
                 if (showMoreBtn) showMoreBtn.textContent = `Show More (${commentsArray.length - 3} more)`;
            } else {
                 if (showMoreBtn) showMoreBtn.textContent = 'Show Less';
            }
        }

        if (showMoreBtn) {
            if (commentsArray.length > 3) {
                showMoreBtn.style.display = 'block';
            } else {
                showMoreBtn.style.display = 'none';
            }
        }

    }, (error) => {
        console.error("Error loading comments: ", error);
        commentsList.innerHTML = '<p>Error loading comments. Please check your Firebase rules and configuration.</p>';
        if (showMoreBtn) showMoreBtn.style.display = 'none';
    });

    // --- SEPARATE CLICK HANDLER SETUP for Show More/Less ---
    if (showMoreBtn) {
        // Ensure the handler is only added once
        showMoreBtn.onclick = null; 
        showMoreBtn.addEventListener('click', function toggleComments() {
            // Invert the state
            isExpanded = !isExpanded;
            
            // Fetch data again to re-render based on new state
            commentsRef.once('value').then(snapshot => {
                const commentsData = snapshot.val();
                if (!commentsData) return;
                
                const commentsArray = Object.values(commentsData).reverse();
                const latestComments = commentsArray.slice(0, 3);

                if (isExpanded) {
                    renderComments(commentsArray);
                    showMoreBtn.textContent = 'Show Less';
                } else {
                    renderComments(latestComments);
                    showMoreBtn.textContent = `Show More (${commentsArray.length - 3} more)`;
                }
            }).catch(error => {
                console.error("Error fetching comments for toggle: ", error);
            });
        }, { once: false });
    }
}

// NOTE: The original `displayComments` function was removed as its logic is now within `loadComments` as `renderComments`.

/**
 * Handles the submission of a new comment.
 * @param {object} event - The form submission event.
 * @param {object} database - The Firebase Database instance.
 * @param {string} postId - The unique ID of the post.
 * @param {object} user - The signed-in user object.
 */
function handleCommentSubmission(event, database, postId, user) {
    event.preventDefault();
    const form = event.target;
    const comment = form.querySelector('#comment').value.trim();

    if (comment) {
        const submitButton = form.querySelector('.submit-button');
        submitButton.disabled = true;
        submitButton.textContent = 'Posting...';

        const commentsRef = database.ref(`comments/${postId}`);
        commentsRef.push({
            name: user.displayName || user.email.split('@')[0], // Use display name, or a portion of the email as a fallback
            comment: comment,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            uid: user.uid // Store the user's unique ID for future moderation or features
        }).then(() => {
            form.reset();
        }).catch(error => {
            console.error("Error adding comment: ", error);
            // Replace alert with a more user-friendly message box
            const messageBox = document.createElement('div');
            messageBox.textContent = 'There was an error submitting your comment.';
            messageBox.style.cssText = 'position:fixed; top:20px; right:20px; background-color:red; color:white; padding:10px; border-radius:5px; z-index:1000;';
            document.body.appendChild(messageBox);
            setTimeout(() => {
              messageBox.remove();
            }, 3000); // Remove message after 3 seconds
        }).finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Post Comment';
        });
        
    }
}


// -------------------- Modal and Image Functions --------------------

/**
 * Sets up click listeners for all image modal triggers on the page.
 */
function setupImageModal() {
    const modal = document.getElementById('image-modal');
    const modalImageContainer = document.getElementById('single-image-container');
    const modalComparisonContainer = document.querySelector('.modal-image-comparison-container');
    const closeBtn = document.querySelector('.modal-close');

    // Check if the modal elements exist on the page
    if (!modal || !closeBtn) {
        return; 
    }

    // Attach click listeners to all modal triggers
    document.querySelectorAll('.modal-trigger, .modal-comparison-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const imageUrl = trigger.getAttribute('data-image');
            const imageAlt = trigger.getAttribute('data-alt');
            const figureCaption = trigger.getAttribute('data-caption');

            // Reset modal state
            if (modalImageContainer) modalImageContainer.style.display = 'none';
            if (modalComparisonContainer) modalComparisonContainer.style.display = 'none';
            modal.classList.remove('single-view', 'comparison-view');

            if (trigger.classList.contains('modal-comparison-trigger') && modalComparisonContainer) {
                // Handle comparison modal
                const comparisonImage1 = trigger.getAttribute('data-image-1');
                const comparisonImage2 = trigger.getAttribute('data-image-2');
                const comparisonAlt1 = trigger.getAttribute('data-alt-1');
                const comparisonAlt2 = trigger.getAttribute('data-alt-2');
                const comparisonCaption1 = trigger.getAttribute('data-caption-1');
                const comparisonCaption2 = trigger.getAttribute('data-caption-2');
                
                const fig1 = modalComparisonContainer.querySelector('figure:nth-of-type(1)');
                const img1 = fig1.querySelector('img');
                const caption1 = fig1.querySelector('figcaption');
                img1.src = comparisonImage1;
                img1.alt = comparisonAlt1;
                caption1.textContent = comparisonCaption1;
                
                const fig2 = modalComparisonContainer.querySelector('figure:nth-of-type(2)');
                const img2 = fig2.querySelector('img');
                const caption2 = fig2.querySelector('figcaption');
                img2.src = comparisonImage2;
                img2.alt = comparisonAlt2;
                caption2.textContent = comparisonCaption2;

                modal.classList.add('comparison-view');
                modalComparisonContainer.style.display = 'flex';
            } else if (modalImageContainer) {
                // Handle single image modal
                const modalImage = modalImageContainer.querySelector('img');
                const modalCaption = modalImageContainer.querySelector('figcaption');
                modalImage.src = imageUrl;
                modalImage.alt = imageAlt;
                modalCaption.textContent = figureCaption;
                
                modal.classList.add('single-view');
                modalImageContainer.style.display = 'block';
            }

            modal.classList.add('show');
        });
    });

    // Close the modal when the close button is clicked
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Close the modal when the user clicks outside the content
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.classList.remove('show');
        }
    });

    // Close the modal when the escape key is pressed
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            modal.classList.remove('show');
        }
    });
}

// -------------------- View Controls Functions --------------------

/**
 * Sets up click listeners for the universal view control buttons,
 * ensuring they control all post grids on the page.
 */
function setupViewControls() {
    // Select the first set of view buttons as the universal controls
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // Select ALL post grids on the page, regardless of month
    const postsGrids = document.querySelectorAll('.posts-grid');

    if (!viewButtons.length || !postsGrids.length) {
        return;
    }

    // Since you have multiple sets, we only add listeners to the first set
    // to act as the master controls.
    const masterControls = viewButtons;

    masterControls.forEach(button => {
        button.addEventListener('click', () => {
            const viewMode = button.getAttribute('data-view');
            
            // First, update the visual state of ALL view buttons
            viewButtons.forEach(btn => btn.classList.remove('active'));
            // Then, set the active state on the master buttons
            // that were just clicked.
            masterControls.forEach(btn => {
                if (btn.getAttribute('data-view') === viewMode) {
                    btn.classList.add('active');
                }
            });

            // Loop through every posts grid and update its class
            postsGrids.forEach(grid => {
                grid.classList.remove('view-1', 'view-2', 'view-3');
                grid.classList.add(`view-${viewMode}`);
            });
        });
    });
}

// -------------------- POST SORTING AND RENDERING LOGIC --------------------

/**
 * Renders all posts by grouping them into monthly sections and applying the current view mode.
 * Assumes an initial HTML structure where all post data is in <div class="post-data"> 
 * children inside <div id="all-posts-container">.
 */
function renderPosts() {
    const container = document.getElementById('all-posts-container');
    if (!container) return; // Exit if the container isn't found

    // 1. Get all post data elements
    let posts = Array.from(container.querySelectorAll('.post-data'));
    
    // 2. Sort the posts by date (Newest to Oldest)
    posts.sort(function(a, b) {
        // Retrieve date values from the data-date attribute (YYYY-MM-DD format)
        let dateA = new Date(a.getAttribute('data-date'));
        let dateB = new Date(b.getAttribute('data-date'));
        
        // Sort Descending (Newest first)
        return dateB - dateA; 
    });

    // 3. Group posts by Month and Year
    const groupedPosts = posts.reduce((acc, post) => {
        const dateString = post.getAttribute('data-date');
        const postDate = new Date(dateString);
        
        // Format for the header key (e.g., 'October 2025')
        const headerKey = postDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        
        if (!acc[headerKey]) {
            acc[headerKey] = [];
        }
        acc[headerKey].push(post);
        return acc;
    }, {});

    // Clear the container before re-drawing
    container.innerHTML = ''; 
    
    // Determine the active view mode (default to '1')
    const activeViewButton = document.querySelector('.view-btn.active');
    const activeViewMode = activeViewButton ? activeViewButton.getAttribute('data-view') : '1';
    
    // 4. Render the HTML (Headers and Posts)
    for (const monthHeader in groupedPosts) {
        
        // --- A. Create the Month Header (e.g., "October Posts") ---
        const monthDate = new Date(groupedPosts[monthHeader][0].getAttribute('data-date'));
        const month = monthDate.getMonth() + 1; // getMonth is 0-indexed
        const year = monthDate.getFullYear();
        
        // Create the <section> wrapper for the month
        const monthSection = document.createElement('section');
        monthSection.className = 'month-posts'; 
        
        // Create the <h2> header
        const headerElement = document.createElement('h2');
        headerElement.className = 'month-separator';
        
        // Create the link inside the header
        const link = document.createElement('a');
        // Creates link like 'Archive/archive-10-2025.html'
        link.href = `Archive/archive-${month}-${year}.html`; 
        link.style.textDecoration = 'none';
        link.style.color = 'inherit';
        link.textContent = monthHeader + ' Posts';
        
        headerElement.appendChild(link);
        monthSection.appendChild(headerElement);

        // --- B. Create the Grid for the month's posts ---
        const postsGrid = document.createElement('div');
        postsGrid.className = `posts-grid view-${activeViewMode}`;
        
        groupedPosts[monthHeader].forEach(postElement => {
            // Extract all data from the attributes
            const postLink = postElement.getAttribute('data-link');
            const postImageSrc = postElement.getAttribute('data-image-src');
            const postTitle = postElement.getAttribute('data-title');
            const postSummary = postElement.getAttribute('data-summary');
            const postDate = postElement.getAttribute('data-date');
            const postAuthor = postElement.getAttribute('data-author');
            
            // Format the display date (e.g., "October 23, 2025")
            const displayDate = new Date(postDate).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
            });

            // --- Build the Post Card HTML ---
            const postCardHTML = `
                <article class="post-card">
                    ${postImageSrc ? `<img src="${postImageSrc}" alt="${postTitle}">` : ''}
                    <div class="post-card-content">
                        <h3><a href="${postLink}">${postTitle}</a></h3>
                        <p class="post-meta">Posted on ${displayDate} by ${postAuthor}</p>
                        <p>${postSummary}</p>
                        <a href="${postLink}" class="read-more">Read More...</a>
                    </div>
                </article>
            `;
            postsGrid.innerHTML += postCardHTML;
        });
        
        // Add the grid to the section, and the section to the main container
        monthSection.appendChild(postsGrid);
        container.appendChild(monthSection);
    }

    console.log("Posts sorted, grouped, and rendered with month headers!");
}


// -------------------- Helper Functions --------------------

/**
 * Sets the current year in the copyright element.
 */
function setupCopyrightYear() {
    const copyrightElement = document.getElementById('copyright');
    if (copyrightElement) {
        copyrightElement.textContent = `© ${new Date().getFullYear()} Minescouts Life. All rights reserved.`;
    }
}

/**
 * Gets and displays the current school year.
 */
function getSchoolYear() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0 = Jan, 8 = Sep

  // A simple heuristic: if before September, use last school year's end.
  const schoolYearStart = (currentMonth < 8) ? currentYear - 1 : currentYear;
  const schoolYearEnd = schoolYearStart + 1;

  const schoolYearElement = document.getElementById('school-year');
  if (schoolYearElement) {
    schoolYearElement.textContent = `${schoolYearStart}-${schoolYearEnd}`;
  }
}

/**
 * Sanitizes input to prevent XSS attacks by escaping HTML.
 * @param {string} str - The string to escape.
 * @returns {string} The escaped string.
 */
function escapeHTML(str) {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
}

// -------------------- Main Event Listener --------------------

// This listener ensures all functions are called only after the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Setup (View Controls, Modals, Footer elements)
    setupImageModal();
    setupCopyrightYear();
    getSchoolYear();

    // 2. Render posts BEFORE setting up View Controls
    renderPosts();

    // 3. Setup View Controls after posts are rendered
    setupViewControls(); 
    
    // 4. Firebase Initialization Check
    const checkFirebase = setInterval(() => {
        // Check for all necessary Firebase libraries
        if (typeof firebase !== 'undefined' && typeof firebase.database === 'function' && typeof firebase.auth === 'function') {
            clearInterval(checkFirebase);
            const database = firebase.database();
            const auth = firebase.auth(); // Initialize Firebase Authentication

            if (database && auth) {
                // Set persistence early (Optional, but good practice for "stay signed in")
                // Setting to LOCAL once here ensures that sign-in/up will respect it.
                auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
                    console.log("Firebase Auth persistence set to LOCAL.");

                    // IMPORTANT: Setup auth controls immediately on page load
                    setupAuthControls(auth);

                    // Set up the authentication state listener (The single source of truth for user state)
                    auth.onAuthStateChanged(user => {
                        if (user) {
                            console.log("User is signed in:", user.displayName || user.email);
                            setupAllVoting(database, user);
                            setupCommentSystem(database, user);
                            updateAuthUI(user);
                        } else {
                            console.log("User is signed out.");
                            setupAllVoting(database, null);
                            setupCommentSystem(database, null);
                            updateAuthUI(null);
                        }
                    });
                }).catch(error => {
                    console.error("Error setting Firebase persistence:", error);
                    // Continue with normal setup even if persistence fails
                    setupAuthControls(auth);
                    auth.onAuthStateChanged(user => { /* ... fallback logic ... */ });
                });
            }
        }
    }, 100);
});