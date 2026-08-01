import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useTheme } from "../hooks/useTheme";
export default function NotFound() {
  useTheme();
  return (
    <>
      <Header/>
      <div className="not-found">
        <div className="not-found-icon">🔍</div>
        <h1>404</h1>
        <p>This page doesn't exist in the MineScout timeline.</p>
        <Link to="/" className="btn-primary">← Back home</Link>
      </div>
    </>
  );
}
