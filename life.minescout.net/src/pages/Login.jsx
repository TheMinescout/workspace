import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAdmin } from "../hooks/useAdmin";
import { useUser } from "../hooks/useUser";
import { useTheme } from "../hooks/useTheme";

export default function Login() {
  // Modes: "user" | "register" | "admin"
  const [mode, setMode] = useState("user");

  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const { login: adminLogin } = useAdmin();
  const { login: userLogin, register, user } = useUser();
  const nav = useNavigate();
  useTheme();

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      if (mode === "admin") {
        const ok = await adminLogin(pw);
        if (ok) nav("/admin");
        else { setError("Wrong admin password."); setPw(""); }
        return;
      }

      if (mode === "register") {
        const res = await register(username, pw);
        if (res?.ok) nav("/");
        else setError(res?.error || "Registration failed.");
        return;
      }

      const res = await userLogin(username, pw);
      if (res?.ok) nav("/");
      else setError(res?.error || "Wrong username or password.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
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

  const getIcon = () => {
    if (mode === "admin") return "🛡️";
    if (mode === "register") return "✨";
    return "👋";
  };

  const getTitle = () => {
    if (mode === "admin") return "Admin sign in";
    if (mode === "register") return "Create account";
    return "Sign in";
  };

  const tabStyle = value => ({
    padding:"6px 14px",borderRadius:"99px",fontSize:"12px",fontWeight:700,cursor:"pointer",
    border:"1px solid var(--rule)",
    background:mode===value?"var(--accent)":"transparent",
    color:mode===value?"white":"var(--ink-3)"
  });

  return (
    <>
      <Header/>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-icon">{getIcon()}</div>
          <h2 className="auth-title">{getTitle()}</h2>

          <div style={{display:"flex",gap:"6px",marginBottom:"20px",justifyContent:"center"}}>
            <button onClick={()=>{setMode("user");setError("");}} style={tabStyle("user")}>Sign In</button>
            <button onClick={()=>{setMode("register");setError("");}} style={tabStyle("register")}>Register</button>
            <button onClick={()=>{setMode("admin");setError("");}} style={tabStyle("admin")}>Admin</button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={submit}>
            {(mode === "user" || mode === "register") && (
              <div className="form-group" style={{textAlign:"left"}}>
                <label className="form-label">Email</label>
                <input className="form-input" type="text" value={username} onChange={e=>setUsername(e.target.value)} required autoFocus autoComplete="username"/>
              </div>
            )}

            <div className="form-group" style={{textAlign:"left"}}>
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={pw} onChange={e=>setPw(e.target.value)} required autoFocus={mode==="admin"}
                autoComplete={mode==="register" ? "new-password" : "current-password"}
                minLength={mode==="register" ? 8 : undefined}/>
              {mode === "register" && (
                <p style={{fontSize:"11px",color:"var(--ink-4)",marginTop:"4px"}}>At least 8 characters.</p>
              )}
            </div>

            {mode === "user" && (
              <div style={{textAlign: "right", marginBottom: "15px"}}>
                <span style={{fontSize: "12px", color: "var(--ink-4)"}}>
                  Forgot password? Ask the site admin to reset it.
                </span>
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? "…"
                : mode === "admin" ? "Sign In as Admin"
                : mode === "register" ? "Create Account"
                : "Sign In"}
            </button>
          </form>

          <div className="auth-back"><Link to="/">← Back to site</Link></div>
        </div>
      </div>
    </>
  );
}
