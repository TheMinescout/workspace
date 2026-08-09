/*
    MINESCOUT AUTH v1.0
    - Replaces firebase-config.js / Firebase Auth entirely
    - Verifies users against life.minescout.net/data/users.json
    - SHA-256 password hashing (client-side, matches Life's hash format)
    - Fires 'auth-ready' event with { user } detail (user is null if not logged in)
*/

(function () {

    const USERS_URL = 'https://life.minescout.net/data/users.json';
    const SESSION_KEY = 'ms_session'; // stores { username, loggedInAt }

    // ── Helpers ────────────────────────────────────────────────────────────────

    async function sha256(str) {
        const buf = await crypto.subtle.digest(
            'SHA-256',
            // Add the salt here so the hashes match Life exactly
            new TextEncoder().encode(str + "ms_salt_2026") 
        );
        return Array.from(new Uint8Array(buf))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    async function fetchUsers() {
        try {
            const res = await fetch(USERS_URL + '?_=' + Date.now()); // cache-bust
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return await res.json();
        } catch (e) {
            console.error('[MineScout Auth] Could not reach users.json:', e);
            return null;
        }
    }

    function getSession() {
        try {
            return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
        } catch { return null; }
    }

    function setSession(username) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            username,
            loggedInAt: Date.now()
        }));
    }

    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
    }

    // ── Public API ─────────────────────────────────────────────────────────────

    window.MS_AUTH = {

        // Attempt login. Returns { ok: true } or { ok: false, error: '...' }
        async login(username, password) {
            const users = await fetchUsers();
            if (!users) return { ok: false, error: 'Could not reach auth server. Try again.' };

            const hash = await sha256(password);
            const match = users.find(
                u => u.username.toLowerCase() === username.toLowerCase()
                  && u.passwordHash === hash
            );

            if (!match) return { ok: false, error: 'DENIED: Invalid credentials.' };

            setSession(match.username);
            return { ok: true, username: match.username };
        },

        // Returns the current user object or null
        async getCurrentUser() {
            const session = getSession();
            if (!session) return null;

            // Live-verify: make sure the user still exists in users.json
            const users = await fetchUsers();
            if (!users) {
                // Network down — trust the local session rather than log out
                return { username: session.username };
            }

            const found = users.find(
                u => u.username.toLowerCase() === session.username.toLowerCase()
            );
            return found ? { username: found.username } : null;
        },

        signOut() {
            clearSession();
            window.location.href = 'login.html';
        }
    };

    // ── Boot: fire 'auth-ready' ─────────────────────────────────────────────────

    MS_AUTH.getCurrentUser().then(user => {
        window.currentUser = user;  // convenience global
        window.authReady = true;
        document.dispatchEvent(new CustomEvent('auth-ready', { detail: { user } }));
        console.log('[MineScout Auth] Ready. User:', user ? user.username : 'GUEST');
    });

})();
