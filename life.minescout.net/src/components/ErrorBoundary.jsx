import { Component } from "react";

/**
 * Catches render/lifecycle errors anywhere below it and shows a branded
 * recovery panel instead of unmounting the tree to a blank page.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.reload = () => window.location.reload();
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[minescout] render error:", error, info && info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    const detail = String((this.state.error && this.state.error.message) || this.state.error || "Unknown error");

    return (
      <div className="boot-panel" role="alert">
        <div className="boot-card">
          <div className="boot-mark">⛏️</div>
          <h1 className="boot-title">Something broke on this page</h1>
          <p className="boot-text">
            The rest of the site is still fine — this section hit an error while rendering.
            Reloading usually clears it.
          </p>
          <pre className="boot-detail">{detail}</pre>
          <div className="boot-actions">
            <button type="button" className="boot-btn" onClick={this.reload}>Reload</button>
            <a className="boot-btn boot-btn-ghost" href="/">Back to home</a>
          </div>
        </div>
      </div>
    );
  }
}
