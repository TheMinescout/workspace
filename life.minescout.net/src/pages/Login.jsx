import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAdmin } from "../hooks/useAdmin";
import { useTheme } from "../hooks/useTheme";

export default function Login() {
  const [pw, setPw]       = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy]   = useState(false);
  const { login } = useAdmin();
  const nav = useNavigate();
  useTheme();

  const submit = e => {
    e.preventDefault(); setBusy(true); setError("");
    setTimeout(() => {
      if (login(pw)) nav("/admin");
      else { setError("Wrong password — try again."); setPw(""); }
      setBusy(false);
    }, 350);
  };

  return (
    <>
      <Header/>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-icon">🛡️</div>
          <h2 className="auth-title">Admin sign in</h2>
          <p className="auth-sub">Enter your password to continue</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="form-group" style={{textAlign:"left"}}>
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={pw} onChange={e=>setPw(e.target.value)} required autoFocus style={{textAlign:"center",letterSpacing:"3px"}}/>
            </div>
            <button type="submit" className="auth-submit" disabled={busy}>{busy?"Checking…":"Sign In"}</button>
          </form>
          <div className="auth-back"><Link to="/">← Back to site</Link></div>
        </div>
      </div>
    </>
  );
}
