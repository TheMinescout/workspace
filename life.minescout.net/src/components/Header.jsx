import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useAdmin } from "../hooks/useAdmin";
import { useUser } from "../hooks/useUser";

export default function Header({ cols, setCols }) {
  const { theme, toggle } = useTheme();
  const { isAdmin, logout: adminLogout } = useAdmin();
  const { user, logout: userLogout } = useUser();

  return (
    <header className="site-header">
      <div className="header-brand">
        <Link to="/" className="header-logo">Life of a Smart Kid</Link>
        <span className="header-tag">minescout.net</span>
      </div>
      <div className="header-actions">
        {setCols && (
          <div className="col-btns">
            {[3,2,1].map(n => (
              <button key={n} className={`col-btn${cols===n?" active":""}`} onClick={()=>setCols(n)} title={`${n} col`}>
                {n === 3 ? "⊞" : n === 2 ? "⊟" : "▬"}
              </button>
            ))}
          </div>
        )}
        <button className="icon-btn" onClick={toggle} title="Toggle theme">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        {isAdmin ? (
          <>
            <div className="user-chip">
              <div className="user-avatar">A</div>
              <span>Admin</span>
            </div>
            <button className="ghost-btn" onClick={adminLogout}>Sign out</button>
          </>
        ) : user ? (
          <>
            <div className="user-chip">
              <div className="user-avatar">{user.username[0].toUpperCase()}</div>
              <span>{user.username}</span>
            </div>
            <button className="ghost-btn" onClick={userLogout}>Sign out</button>
          </>
        ) : (
          <Link to="/login" className="signin-btn">Sign in</Link>
        )}
      </div>
    </header>
  );
}
