// views/view-pages-analitics.js — Account, Gateways & Fallbacks

export const analyticsViews = {

  // ── 1. USER LOGIN ENTRYWAY ───────────────────────────────────────
  '/login': `
    <style>
        .auth-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 70vh;
            padding: 24px 16px;
        }
        .auth-card {
            background: var(--card-bg);
            border: 1px solid var(--md-outline-variant);
            border-radius: var(--radius-lg);
            padding: 40px;
            width: 100%;
            max-width: 440px;
            box-shadow: var(--shadow-2);
            box-sizing: border-box;
        }
        .auth-card h2 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 2rem;
            margin-top: 0;
            margin-bottom: 8px;
            text-align: center;
            color: var(--text-color);
        }
        .auth-subtitle {
            text-align: center;
            color: var(--md-outline);
            font-size: 0.95rem;
            margin-bottom: 32px;
            font-weight: 500;
        }
        .form-group {
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
        }
        .form-group label {
            font-weight: 700;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--md-outline);
            margin-bottom: 8px;
        }
        .form-group input {
            padding: 12px 16px;
            border: 1px solid var(--md-outline-variant);
            border-radius: var(--radius-sm);
            font-family: inherit;
            font-size: 1rem;
            background: var(--md-surface-container);
            color: var(--text-color);
            box-sizing: border-box;
            transition: border-color 0.2s;
        }
        .form-group input:focus {
            border-color: var(--md-primary);
            outline: none;
        }
        .btn-auth-primary {
            width: 100%;
            padding: 14px;
            background: var(--md-primary);
            color: var(--md-on-primary);
            border: none;
            border-radius: var(--radius-full);
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            box-shadow: var(--shadow-1);
            transition: all 0.3s var(--motion-standard);
            margin-top: 12px;
        }
        .btn-auth-primary:hover {
            filter: brightness(0.9);
            transform: translateY(-2px);
            box-shadow: var(--shadow-2);
        }
        .btn-auth-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
        }
        .auth-error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid #ef4444;
            color: #ef4444;
            padding: 12px 16px;
            border-radius: var(--radius-sm);
            font-size: 0.9rem;
            margin-bottom: 24px;
            text-align: center;
            font-weight: 500;
        }
        @media (max-width: 480px) {
            .auth-card { padding: 24px; }
        }
    </style>

    <header class="main-header">
        <div class="container site-title-container">
            <div class="site-title-wrapper">
                <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                <p class="tagline">Secure Gateway</p>
            </div>
        </div>
    </header>

    <div class="main-content-area">
        <div class="container auth-wrapper">
            <div class="auth-card">
                <h2>Sign In</h2>
                <div class="auth-subtitle">Welcome back to your dashboard portal</div>
                
                <form id="login-form">
                    <div class="form-group">
                        <label for="login-email">Email Address</label>
                        <input type="email" id="login-email" placeholder="you@minescout.net" required autocomplete="email" />
                    </div>
                    <div class="form-group" style="margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <label for="login-password" style="margin-bottom: 0;">Password</label>
                            <a href="/forgot-password" style="font-size: 0.8rem; font-weight: 600; color: var(--md-primary); text-decoration: none;">Forgot password?</a>
                        </div>
                        <input type="password" id="login-password" placeholder="••••••••" required autocomplete="current-password" />
                    </div>
                    <button type="submit" class="btn-auth-primary">Sign In</button>
                    <div id="login-error" class="auth-error" style="display:none; margin-top:15px;"></div>
                    
                    <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--md-outline-variant);">
                        <a href="/signup" style="color: var(--text-color); font-size: 0.95rem; font-weight: bold; text-decoration: none;">Need an account? <span style="color: var(--md-primary);">Sign Up</span></a>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  // ── 2. USER SIGNUP ENTRYWAY ───────────────────────────────────────
  '/signup': `
    <style>
        .auth-wrapper { display: flex; justify-content: center; align-items: center; min-height: 70vh; padding: 24px 16px; }
        .auth-card { background: var(--card-bg); border: 1px solid var(--md-outline-variant); border-radius: var(--radius-lg); padding: 40px; width: 100%; max-width: 440px; box-shadow: var(--shadow-2); box-sizing: border-box; }
        .auth-card h2 { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; margin-top: 0; margin-bottom: 8px; text-align: center; color: var(--text-color); }
        .auth-subtitle { text-align: center; color: var(--md-outline); font-size: 0.95rem; margin-bottom: 32px; font-weight: 500; }
        .form-group { margin-bottom: 20px; display: flex; flex-direction: column; }
        .form-group label { font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--md-outline); margin-bottom: 8px; }
        .form-group input { padding: 12px 16px; border: 1px solid var(--md-outline-variant); border-radius: var(--radius-sm); font-family: inherit; font-size: 1rem; background: var(--md-surface-container); color: var(--text-color); box-sizing: border-box; transition: border-color 0.2s; }
        .form-group input:focus { border-color: var(--md-primary); outline: none; }
        .btn-auth-primary { width: 100%; padding: 14px; background: var(--md-primary); color: var(--md-on-primary); border: none; border-radius: var(--radius-full); font-weight: 700; font-size: 1rem; cursor: pointer; box-shadow: var(--shadow-1); transition: all 0.3s var(--motion-standard); margin-top: 12px; }
        .btn-auth-primary:hover { filter: brightness(0.9); transform: translateY(-2px); box-shadow: var(--shadow-2); }
        .btn-auth-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
        .auth-error { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; padding: 12px 16px; border-radius: var(--radius-sm); font-size: 0.9rem; margin-bottom: 24px; text-align: center; font-weight: 500; }
        @media (max-width: 480px) { .auth-card { padding: 24px; } }
    </style>

    <header class="main-header">
        <div class="container site-title-container">
            <div class="site-title-wrapper">
                <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                <p class="tagline">Account Registration</p>
            </div>
        </div>
    </header>

    <div class="main-content-area">
        <div class="container auth-wrapper">
            <div class="auth-card">
                <h2>Create Account</h2>
                <p class="auth-subtitle">Join the Minescouts Life platform.</p>
                <form id="signup-form">
                    <div class="form-group">
                        <label for="signup-email">Email Address</label>
                        <input type="email" id="signup-email" required placeholder="you@email.com">
                    </div>
                    <div class="form-group">
                        <label for="signup-password">Password</label>
                        <input type="password" id="signup-password" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="btn-auth-primary">Sign Up</button>
                    <div id="signup-error" class="auth-error" style="display:none; margin-top:15px;"></div>
                    <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--md-outline-variant);">
                        <a href="/login" style="color: var(--text-color); font-size: 0.95rem; font-weight: bold; text-decoration: none;">Already have an account? <span style="color: var(--md-primary);">Login</span></a>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  // ── 3. FORGOT PASSWORD ──────────────────────────────────────────
  '/forgot-password': `
    <style>
        .auth-wrapper { display: flex; justify-content: center; align-items: center; min-height: 70vh; padding: 24px 16px; }
        .auth-card { background: var(--card-bg); border: 1px solid var(--md-outline-variant); border-radius: var(--radius-lg); padding: 40px; width: 100%; max-width: 440px; box-shadow: var(--shadow-2); box-sizing: border-box; }
        .auth-card h2 { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; margin-top: 0; margin-bottom: 8px; text-align: center; color: var(--text-color); }
        .auth-subtitle { text-align: center; color: var(--md-outline); font-size: 0.95rem; margin-bottom: 32px; font-weight: 500; }
        .form-group { margin-bottom: 20px; display: flex; flex-direction: column; }
        .form-group label { font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--md-outline); margin-bottom: 8px; }
        .form-group input { padding: 12px 16px; border: 1px solid var(--md-outline-variant); border-radius: var(--radius-sm); font-family: inherit; font-size: 1rem; background: var(--md-surface-container); color: var(--text-color); box-sizing: border-box; transition: border-color 0.2s; }
        .form-group input:focus { border-color: var(--md-primary); outline: none; }
        .btn-auth-primary { width: 100%; padding: 14px; background: var(--md-primary); color: var(--md-on-primary); border: none; border-radius: var(--radius-full); font-weight: 700; font-size: 1rem; cursor: pointer; box-shadow: var(--shadow-1); transition: all 0.3s var(--motion-standard); margin-top: 12px; }
        .btn-auth-primary:hover { filter: brightness(0.9); transform: translateY(-2px); box-shadow: var(--shadow-2); }
        .btn-auth-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
        .auth-error { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; padding: 12px 16px; border-radius: var(--radius-sm); font-size: 0.9rem; margin-bottom: 24px; text-align: center; font-weight: 500; }
        @media (max-width: 480px) { .auth-card { padding: 24px; } }
    </style>

    <header class="main-header">
        <div class="container site-title-container">
            <div class="site-title-wrapper">
                <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                <p class="tagline">Account Recovery</p>
            </div>
        </div>
    </header>

    <div class="main-content-area">
        <div class="container auth-wrapper">
            <div class="auth-card">
                <h2>Reset Password</h2>
                <p class="auth-subtitle">Enter your email to receive a 6-digit recovery code.</p>
                <form id="forgot-form">
                    <div class="form-group">
                        <label for="forgot-email">Email Address</label>
                        <input type="email" id="forgot-email" required placeholder="you@email.com">
                    </div>
                    <button type="submit" class="btn-auth-primary">Send Recovery Code</button>
                    <div id="forgot-message" class="auth-error" style="display:none; margin-top:15px;"></div>
                    <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--md-outline-variant);">
                        <a href="/login" style="color: var(--md-primary); font-size: 0.95rem; font-weight: bold; text-decoration: none;">← Back to Login</a>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  // ── 4. RESET PASSWORD ───────────────────────────────────────────
  '/reset-password': `
    <style>
        .auth-wrapper { display: flex; justify-content: center; align-items: center; min-height: 70vh; padding: 24px 16px; }
        .auth-card { background: var(--card-bg); border: 1px solid var(--md-outline-variant); border-radius: var(--radius-lg); padding: 40px; width: 100%; max-width: 440px; box-shadow: var(--shadow-2); box-sizing: border-box; }
        .auth-card h2 { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; margin-top: 0; margin-bottom: 8px; text-align: center; color: var(--text-color); }
        .auth-subtitle { text-align: center; color: var(--md-outline); font-size: 0.95rem; margin-bottom: 32px; font-weight: 500; }
        .form-group { margin-bottom: 20px; display: flex; flex-direction: column; }
        .form-group label { font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--md-outline); margin-bottom: 8px; }
        .form-group input { padding: 12px 16px; border: 1px solid var(--md-outline-variant); border-radius: var(--radius-sm); font-family: inherit; font-size: 1rem; background: var(--md-surface-container); color: var(--text-color); box-sizing: border-box; transition: border-color 0.2s; }
        .form-group input:focus { border-color: var(--md-primary); outline: none; }
        .btn-auth-primary { width: 100%; padding: 14px; background: var(--md-primary); color: var(--md-on-primary); border: none; border-radius: var(--radius-full); font-weight: 700; font-size: 1rem; cursor: pointer; box-shadow: var(--shadow-1); transition: all 0.3s var(--motion-standard); margin-top: 12px; }
        .btn-auth-primary:hover { filter: brightness(0.9); transform: translateY(-2px); box-shadow: var(--shadow-2); }
        .btn-auth-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
        .auth-error { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; padding: 12px 16px; border-radius: var(--radius-sm); font-size: 0.9rem; margin-bottom: 24px; text-align: center; font-weight: 500; }
        @media (max-width: 480px) { .auth-card { padding: 24px; } }
    </style>

    <header class="main-header">
        <div class="container site-title-container">
            <div class="site-title-wrapper">
                <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                <p class="tagline">Account Recovery</p>
            </div>
        </div>
    </header>

    <div class="main-content-area">
        <div class="container auth-wrapper">
            <div class="auth-card">
                <h2>Create New Password</h2>
                <p class="auth-subtitle">Check your email for the 6-digit verification code.</p>
                <form id="reset-form">
                    <div class="form-group">
                        <label for="reset-email">Email Address</label>
                        <input type="email" id="reset-email" required placeholder="you@email.com">
                    </div>
                    <div class="form-group">
                        <label for="reset-code">6-Digit Code</label>
                        <input type="text" id="reset-code" required placeholder="123456" maxlength="6" style="letter-spacing: 4px; text-align: center; font-size: 1.2rem;">
                    </div>
                    <div class="form-group">
                        <label for="reset-password-new">New Password</label>
                        <input type="password" id="reset-password-new" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="btn-auth-primary">Confirm & Reset</button>
                    <div id="reset-error" class="auth-error" style="display:none; margin-top:15px;"></div>
                </form>
            </div>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  // ── 5. ACCOUNT MANAGEMENT PORTAL ────────────────────────────────
  '/account': `
    <style>
        .account-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 70vh;
            padding: 40px 16px;
        }
        .account-card {
            background: var(--card-bg);
            border: 1px solid var(--md-outline-variant);
            border-radius: var(--radius-lg);
            padding: 40px;
            width: 100%;
            max-width: 520px;
            box-shadow: var(--shadow-2);
            box-sizing: border-box;
            margin-bottom: 32px;
        }
        .account-card h2 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.8rem;
            margin-top: 0;
            margin-bottom: 24px;
            color: var(--text-color);
            border-bottom: 2px solid var(--md-outline-variant);
            padding-bottom: 12px;
        }
        .account-status-banner {
            width: 100%;
            padding: 12px 16px;
            border-radius: var(--radius-sm);
            font-size: 0.95rem;
            margin-bottom: 24px;
            text-align: center;
            font-weight: 500;
            box-sizing: border-box;
        }
        .account-status-banner.success {
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid var(--md-success);
            color: var(--md-success);
        }
        .account-status-banner.error {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid #ef4444;
            color: #ef4444;
        }
        .form-row {
            margin-bottom: 24px;
            display: flex;
            flex-direction: column;
        }
        .form-row label {
            font-weight: 700;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--md-outline);
            margin-bottom: 8px;
        }
        .form-row input {
            padding: 12px 16px;
            border: 1px solid var(--md-outline-variant);
            border-radius: var(--radius-sm);
            font-family: inherit;
            font-size: 1rem;
            background: var(--md-surface-container);
            color: var(--text-color);
            box-sizing: border-box;
        }
        .form-row input:focus {
            border-color: var(--md-primary);
            outline: none;
        }
        .btn-account-submit {
            padding: 12px 24px;
            background: var(--md-primary);
            color: var(--md-on-primary);
            border: none;
            border-radius: var(--radius-full);
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s var(--motion-standard);
            box-shadow: var(--shadow-1);
        }
        .btn-account-submit:hover {
            filter: brightness(0.9);
            transform: translateY(-2px);
            box-shadow: var(--shadow-2);
        }
        @media (max-width: 580px) {
            .account-card { padding: 24px; }
        }
    </style>

    <header class="main-header">
        <div class="container site-title-container">
            <div class="site-title-wrapper">
                <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                <p class="tagline">Profile Settings</p>
            </div>
        </div>
    </header>

    <div class="main-content-area">
        <div class="container account-wrapper">
            
            <div id="account-status" class="account-status-banner" style="display: none;"></div>

            <!-- Profile Settings -->
            <div class="account-card">
                <h2>Security Preferences</h2>
                
                <form id="email-form">
                    <div class="form-row">
                        <label for="new-email">Update Email Address</label>
                        <input type="email" id="new-email" placeholder="enter new email address..." required />
                    </div>
                    <button type="submit" class="btn-account-submit">Save New Email</button>
                </form>
            </div>

            <!-- Password Credentials -->
            <div class="account-card">
                <h2>Change Password</h2>
                
                <form id="password-form">
                    <div class="form-row">
                        <label for="new-password">New Password</label>
                        <input type="password" id="new-password" placeholder="enter at least 6 characters..." required autocomplete="new-password" />
                    </div>
                    <div class="form-row">
                        <label for="confirm-password">Confirm Password</label>
                        <input type="password" id="confirm-password" placeholder="re-enter new password..." required autocomplete="new-password" />
                    </div>
                    <button type="submit" class="btn-account-submit">Update Password</button>
                </form>
            </div>

        </div>
    </div>

    <footer class="main-footer">
        <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  // ── 6. PAGE NOT FOUND (404 ERRORS) ────────────────────────────────
  '/404': `
    <style>
        .error-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 65vh;
            padding: 40px 16px;
        }
        .error-card {
            background: var(--card-bg);
            border: 1px solid var(--md-outline-variant);
            border-radius: var(--radius-lg);
            padding: 48px;
            text-align: center;
            max-width: 500px;
            box-shadow: var(--shadow-2);
        }
        .error-code {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 6rem;
            font-weight: 700;
            color: var(--md-primary);
            line-height: 1;
            margin-bottom: 16px;
            letter-spacing: -0.05em;
        }
        .error-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.8rem;
            margin-top: 0;
            margin-bottom: 16px;
            color: var(--text-color);
        }
        .error-text {
            font-size: 1.05rem;
            line-height: 1.6;
            opacity: 0.85;
            margin-bottom: 32px;
            color: var(--text-color);
        }
        .btn-home {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: var(--md-primary);
            color: var(--md-on-primary);
            padding: 14px 28px;
            border-radius: var(--radius-full);
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s var(--motion-standard);
            box-shadow: var(--shadow-1);
        }
        .btn-home:hover {
            filter: brightness(0.9);
            transform: translateY(-2px);
            box-shadow: var(--shadow-2);
        }
        @media (max-width: 480px) {
            .error-card { padding: 32px 24px; }
            .error-code { font-size: 4.5rem; }
        }
    </style>

    <header class="main-header">
        <div class="container site-title-container">
            <div class="site-title-wrapper">
                <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                <p class="tagline">Lost in Transmission</p>
            </div>
        </div>
    </header>

    <div class="main-content-area">
        <div class="container error-wrapper">
            <div class="error-card">
                <div class="error-code">404</div>
                <h2 class="error-title">Lost Your Way?</h2>
                <p class="error-text">The path you followed seems to have vanished. The page you're looking for might have been moved or renamed, but we can help you find your way back home.</p>
                <a href="/" class="btn-home">
                    <span class="material-symbols-rounded">home</span>
                    Go back to homepage
                </a>
            </div>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container text-center">
            <p>Email: <a href="mailto:theminescout@minescout.net" style="color: var(--md-primary); font-weight: 600;">theminescout@minescout.net</a></p>
            <p id="copyright" style="margin-top: 8px;">© 2026 Minescouts Life. All rights reserved.</p>
        </div>
    </footer>
  `
};