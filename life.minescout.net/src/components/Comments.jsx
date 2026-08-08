import { useState, useEffect } from "react";
import { fetchComments, addComment, votePost } from "../data/posts";
import { useUser } from "../hooks/useUser";
import { Link } from "react-router-dom";

export default function Comments({ postId }) {
  const { user } = useUser();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ratings, setRatings] = useState({ up: 0, down: 0, userVote: null });
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    if (!postId) return;
    fetchComments(postId).then(setComments);
    fetch(`/api/ratings?postId=${postId}`)
      .then(r => r.json())
      .then(r => setRatings(r))
      .catch(() => {});

    // Load user vote from session
    const storedVote = sessionStorage.getItem(`vote_${postId}`);
    if (storedVote) setRatings(prev => ({ ...prev, userVote: storedVote }));
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    setSubmitting(true);
    const res = await addComment(postId, user.username, text.trim());
    if (res.ok) {
      setComments(prev => [...prev, res.comment]);
      setText("");
    }
    setSubmitting(false);
  };

  const handleVote = async (vote) => {
    if (!user || voting) return;
    setVoting(true);
    const res = await votePost(postId, user.username, vote);
    if (res.ok) {
      setRatings({ up: res.up, down: res.down, userVote: res.userVote });
      if (res.userVote) sessionStorage.setItem(`vote_${postId}`, res.userVote);
      else sessionStorage.removeItem(`vote_${postId}`);
    }
    setVoting(false);
  };

  return (
    <div className="comments-section">
      {/* Ratings */}
      <div className="ratings-row">
        <span className="ratings-label">Was this helpful?</span>
        <button
          className={`vote-btn vote-up${ratings.userVote==="up"?" voted":""}`}
          onClick={() => handleVote("up")}
          disabled={!user || voting}
          title={user ? "Thumbs up" : "Sign in to vote"}
        >
          👍 {ratings.up}
        </button>
        <button
          className={`vote-btn vote-down${ratings.userVote==="down"?" voted":""}`}
          onClick={() => handleVote("down")}
          disabled={!user || voting}
          title={user ? "Thumbs down" : "Sign in to vote"}
        >
          👎 {ratings.down}
        </button>
        {!user && <span className="ratings-hint"><Link to="/login">Sign in</Link> to vote</span>}
      </div>

      {/* Comments */}
      <h3 className="comments-title">Comments ({comments.length})</h3>

      {comments.length === 0 && (
        <p className="comments-empty">No comments yet. Be the first!</p>
      )}

      <div className="comments-list">
        {comments.map(c => (
          <div key={c.id} className="comment">
            <div className="comment-header">
              <span className="comment-author">{c.username}</span>
              <span className="comment-date">{new Date(c.timestamp).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
            </div>
            <p className="comment-text">{c.text}</p>
          </div>
        ))}
      </div>

      {/* Add comment */}
      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="comment-form-header">
            <span className="comment-form-user">Commenting as <strong>{user.username}</strong></span>
          </div>
          <textarea
            className="comment-input"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write a comment…"
            rows={3}
            required
          />
          <button type="submit" className="btn-primary" disabled={submitting || !text.trim()}>
            {submitting ? "Posting…" : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className="comment-signin-prompt">
          <Link to="/login" className="btn-primary" style={{textDecoration:"none",display:"inline-block"}}>Sign in to comment</Link>
          <span style={{marginLeft:"12px",fontSize:"13px",color:"var(--ink-4)"}}>Don't have an account? <Link to="/login">Register free</Link></span>
        </div>
      )}
    </div>
  );
}
