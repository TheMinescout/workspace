/* 
    FIREBASE CONFIGURATION & LOADER V3.1
    - Auto-loads Firebase SDKs (No need to put them in HTML)
    - Initializes App & Analytics
    - Triggers 'firebase-ready' event when safe to use
*/

(function() {
    // 1. CONFIGURATION
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

    // 2. SDK LIST (App must be first)
    const sdks = [
        "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
        "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js",
        "https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js",
        "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics-compat.js"
    ];

    // 3. LOADER LOGIC
    let loadedCount = 0;

    function loadScript(url) {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (document.querySelector(`script[src="${url}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Load App first, then the rest in parallel
    loadScript(sdks[0])
        .then(() => {
            return Promise.all(sdks.slice(1).map(url => loadScript(url)));
        })
        .then(() => {
            console.log("Firebase SDKs Loaded.");
            initializeFirebase();
        })
        .catch(err => console.error("Failed to load Firebase:", err));

    // 4. INITIALIZATION
    function initializeFirebase() {
        if (typeof firebase !== 'undefined' && !firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            
            // Start Analytics
            if (typeof firebase.analytics === 'function') {
                firebase.analytics();
                initCustomAnalytics(); // Run tracker
            }

            // TELL THE WEBSITE WE ARE READY
            const event = new Event('firebase-ready');
            window.firebaseReady = true; // Flag for late scripts
            document.dispatchEvent(event);
            console.log("Firebase Initialized & Ready Event Fired.");
        }
    }

    // 5. CUSTOM ANALYTICS TRACKER
    function initCustomAnalytics() {
        try {
            const analytics = firebase.analytics();
            const auth = firebase.auth();
            
            let path = window.location.pathname;
            if (path === '/' || path.endsWith('/')) path = 'index.html';
            const cleanName = path.replace(/^\/|[\.\#\$\/\[\]]/g, '_');

            const storageKey = `tracked_${cleanName}`;
            const lastVisit = sessionStorage.getItem(storageKey);
            const now = Date.now();
            // 30 min cooldown
            if (lastVisit && (now - lastVisit < 30 * 60 * 1000)) return; 

            sessionStorage.setItem(storageKey, now);

            auth.onAuthStateChanged(user => {
                if (user) {
                    analytics.setUserId(user.uid);
                    analytics.setUserProperties({ account_type: 'registered' });
                } else {
                    analytics.setUserProperties({ account_type: 'guest' });
                }
                analytics.logEvent('screen_view', {
                    firebase_screen: cleanName,
                    screen_name: cleanName,
                    page_location: window.location.href,
                    page_title: document.title
                });
            });
        } catch (e) { console.warn(e); }
    }

})();