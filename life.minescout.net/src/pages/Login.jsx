import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAdmin } from "../hooks/useAdmin";
import { useUser } from "../hooks/useUser";
import { useTheme } from "../hooks/useTheme";

export default function Login() {
  // Modes: "user" | "register" | "admin" | "forgot" | "verify" | "reset"
  const [mode, setMode] = useState("user"); 
  
  // Form inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [inputCode, setInputCode] = useState("");
  
  // Reset Flow State
  const [generatedCode, setGeneratedCode] = useState("");
  const [resetTarget, setResetTarget] = useState(""); // Holds the stripped email/username

  // UI State
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  
  const { login: adminLogin } = useAdmin();
  const { login: userLogin, register, resetPassword, user } = useUser(); // Added resetPassword here
  const nav = useNavigate();
  useTheme();

  const submit = async e => {
    e.preventDefault();
    setBusy(true); 
    setError("");
    setMessage("");

    // --- ADMIN LOGIN ---
    if (mode === "admin") {
      setTimeout(() => {
        if (adminLogin(pw)) nav("/admin");
        else { setError("Wrong admin password."); setPw(""); }
        setBusy(false);
      }, 350);
      return;
    }

    // --- REGISTER ---
    if (mode === "register") {
      const res = await register(username, pw);
      if (res.ok) nav("/");
      else { setError(res.error || "Registration failed."); }
      setBusy(false);
      return;
    }

    // --- STEP 1: FORGOT PASSWORD (Send Code) ---
    if (mode === "forgot") {
      // Strip special characters to match how your database saves usernames
      const mappedUsername = email.replace(/[^a-zA-Z0-9_]/g, "");
      setResetTarget(mappedUsername); 

      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(code); 

      const payload = {
  to: [email], // The real email for Google Apps Script
  subject: "Your Password Reset Code - Minescouts Life",
  fromName: "Minescout Security",
  htmlBody: `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #faf8f5; padding: 40px 20px; text-align: center; color: #1a1814;">
      <div style="max-width: 400px; margin: 0 auto; background-color: #ffffff; border: 1px solid #ddd9d0; border-radius: 20px; padding: 40px 36px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); text-align: center;">
        
        <!-- Header using Lora serif font -->
        <h2 style="font-family: 'Lora', Georgia, serif; font-size: 24px; font-weight: 700; color: #1a1814; margin: 0 0 8px;">Security Notice</h2>
        
        <!-- Subtitle -->
        <p style="font-size: 14px; color: #6b6158; margin: 0 0 24px; line-height: 1.6;">
          We received a request to reset your password. Use the 4-digit code below to regain access to your dashboard.
        </p>
        
        <!-- The Code Block (Using paper-2 background and your accent green) -->
        <div style="background-color: #f2efe9; border: 1px solid #ddd9d0; border-radius: 12px; padding: 16px; font-size: 32px; font-weight: 700; color: #2d6a4f; letter-spacing: 8px; margin: 0 0 24px;">
          ${code}
        </div>
        
        <!-- Warning / Error styled box -->
        <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 12px; font-size: 13px; color: #991b1b; margin-bottom: 24px;">
          <strong>Important:</strong> Do not refresh the page while entering this code. It will expire in 15 minutes.
        </div>
        
        <!-- Footer text -->
        <p style="font-size: 12px; color: #9e9188; margin: 0;">
          If you did not request this, please ignore this email.
        </p>
        
      </div>
    </div>
  `
};

      try {
        // 🚨 REPLACE WITH YOUR NEW GOOGLE APPS SCRIPT URL 🚨
        await fetch("https://script.google.com/macros/s/AKfycbz7MJE7mNY1A-SvbdHGV3yI6-ftBElB1wOth4MqEABvJXLI5SNzeqiG2r7PJBpWvcAiOg/exec", {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        
        setMessage("A 4-digit code has been sent to your email.");
        setMode("verify"); 
      } catch (err) {
        setError("Failed to send reset email. Please try again later.");
      }
      setBusy(false);
      return;
    }

    // --- STEP 2: VERIFY CODE ---
    if (mode === "verify") {
      if (inputCode === generatedCode) {
        setMessage("Code verified! Please enter your new password.");
        setMode("reset");
      } else {
        setError("Invalid 4-digit code. Please try again.");
      }
      setBusy(false);
      return;
    }

    // --- STEP 3: RESET PASSWORD ---
    if (mode === "reset") {
      // Call the backend to update the password using the stripped username
      const res = await resetPassword(resetTarget, newPassword);
      
      if (res && res.ok) {
        setMessage("Password successfully reset! You can now log in.");
        setMode("user");
        setPw("");
        setNewPassword("");
        setInputCode("");
      } else {
        setError(res?.error || "Failed to reset password. User may not exist.");
      }
      setBusy(false);
      return;
    }

    // --- USER LOGIN ---
    const res = await userLogin(username, pw);
    if (res.ok) nav("/");
    else { setError(res.error || "Wrong username or password."); }
    setBusy(false);
  };

  if (user) {
    return (
      <>
        <Header/>
        <div className="auth-page">
          <div className="auth-card">
            <div className="auth-icon">👤</div>
            <h2 className="auth-title">Signed in as <strong>{user.username}</strong></h2>
            <p className="auth-sub">You're all set!</p>
            <Link to="/" className="auth-submit" style={{display:"block",textDecoration:"none",textAlign:"center"}}>← Back to site</Link>
          </div>
        </div>
      </>
    );
  }

  // Dynamic titles and icons
  const getIcon = () => {
    if (mode === "admin") return "🛡️";
    if (mode === "register") return "✨";
    if (["forgot", "verify", "reset"].includes(mode)) return "🔑";
    return "👋";
  };

  const getTitle = () => {
    if (mode === "admin") return "Admin sign in";
    if (mode === "register") return "Create account";
    if (mode === "forgot") return "Reset Password";
    if (mode === "verify") return "Enter Code";
    if (mode === "reset") return "New Password";
    return "Sign in";
  };

  return (
    <>
      <Header/>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-icon">{getIcon()}</div>
          <h2 className="auth-title">{getTitle()}</h2>
          
          {/* Hide tabs during the reset flow to focus the user */}
          {!["forgot", "verify", "reset"].includes(mode) && (
            <div style={{display:"flex",gap:"6px",marginBottom:"20px",justifyContent:"center"}}>
              <button onClick={()=>{setMode("user");setError("");setMessage("");}} style={{
                padding:"6px 14px",borderRadius:"99px",fontSize:"12px",fontWeight:700,cursor:"pointer",
                border:"1px solid var(--rule)",
                background:mode==="user"?"var(--accent)":"transparent",
                color:mode==="user"?"white":"var(--ink-3)"
              }}>Sign In</button>
              <button onClick={()=>{setMode("register");setError("");setMessage("");}} style={{
                padding:"6px 14px",borderRadius:"99px",fontSize:"12px",fontWeight:700,cursor:"pointer",
                border:"1px solid var(--rule)",
                background:mode==="register"?"var(--accent)":"transparent",
                color:mode==="register"?"white":"var(--ink-3)"
              }}>Register</button>
              <button onClick={()=>{setMode("admin");setError("");setMessage("");}} style={{
                padding:"6px 14px",borderRadius:"99px",fontSize:"12px",fontWeight:700,cursor:"pointer",
                border:"1px solid var(--rule)",
                background:mode==="admin"?"var(--accent)":"transparent",
                color:mode==="admin"?"white":"var(--ink-3)"
              }}>Admin</button>
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}
          {message && <div style={{color: "var(--accent)", fontSize: "14px", marginBottom: "15px", fontWeight: "bold"}}>{message}</div>}

          <form onSubmit={submit}>
            {/* Standard Username/Password Fields */}
            {(mode === "user" || mode === "register") && (
              <div className="form-group" style={{textAlign:"left"}}>
                <label className="form-label">Email</label>
                <input className="form-input" type="text" value={username} onChange={e=>setUsername(e.target.value)} required autoFocus autoComplete="username"/>
              </div>
            )}
            
            {(mode === "user" || mode === "register" || mode === "admin") && (
              <div className="form-group" style={{textAlign:"left"}}>
                <label className="form-label">Password</label>
                <input className="form-input" type="password" value={pw} onChange={e=>setPw(e.target.value)} required autoFocus={mode==="admin"} autoComplete="current-password"/>
              </div>
            )}

            {/* STEP 1: Email Input for Forgot Mode */}
            {mode === "forgot" && (
              <div className="form-group" style={{textAlign:"left"}}>
                <label className="form-label">Account Email</label>
                <input className="form-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoFocus/>
              </div>
            )}

            {/* STEP 2: Code Input for Verify Mode */}
            {mode === "verify" && (
              <div className="form-group" style={{textAlign:"left"}}>
                <label className="form-label">4-Digit Code</label>
                <input 
                  className="form-input" 
                  type="text" 
                  maxLength="4" 
                  value={inputCode} 
                  onChange={e=>setInputCode(e.target.value)} 
                  required 
                  autoFocus 
                  style={{letterSpacing: "4px", fontSize: "18px", textAlign: "center"}}
                />
              </div>
            )}

            {/* STEP 3: New Password Input for Reset Mode */}
            {mode === "reset" && (
              <div className="form-group" style={{textAlign:"left"}}>
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required autoFocus/>
              </div>
            )}

            {/* Forgot Password Trigger Link */}
            {mode === "user" && (
              <div style={{textAlign: "right", marginBottom: "15px"}}>
                <span onClick={() => { setMode("forgot"); setError(""); setMessage(""); }} style={{fontSize: "12px", color: "var(--accent)", cursor: "pointer"}}>
                  Forgot Password?
                </span>
              </div>
            )}

            {/* Dynamic Submit Button */}
            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? "…" 
                : mode === "admin" ? "Sign In as Admin" 
                : mode === "register" ? "Create Account" 
                : mode === "forgot" ? "Send Code"
                : mode === "verify" ? "Verify Code"
                : mode === "reset" ? "Reset Password"
                : "Sign In"}
            </button>
            
            {/* Cancel Button for the Reset Flow */}
            {["forgot", "verify", "reset"].includes(mode) && (
              <button 
                type="button" 
                onClick={() => { setMode("user"); setError(""); setMessage(""); setInputCode(""); }}
                style={{marginTop: "10px", width: "100%", padding: "10px", background: "transparent", border: "none", color: "var(--ink-3)", cursor: "pointer", fontSize: "14px"}}
              >
                Cancel / Return to Login
              </button>
            )}
          </form>
          
          <div className="auth-back"><Link to="/">← Back to site</Link></div>
        </div>
      </div>
    </>
  );
}