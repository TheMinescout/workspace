import { Link } from "react-router-dom";

function chipClass(cat) {
  const c = (cat||"").toLowerCase();
  if (c.includes("tech"))   return "chip-tech";
  if (c.includes("app"))    return "chip-app";
  if (c.includes("eagle"))  return "chip-eagle";
  if (c.includes("coding")) return "chip-coding";
  if (c.includes("puppy"))  return "chip-puppy";
  return "chip-update";
}

export default function PostCard({ post }) {
  const date = post.date || new Date(post.timestamp).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
  return (
    <div className="post-card">
      <div className="card-meta">
        <span className={`cat-chip ${chipClass(post.category)}`}>{post.category||"Update"}</span>
        <span className="card-date">{date}</span>
      </div>
      <h2 className="card-title">{post.title}</h2>
      <p className="card-summary">{post.summary}</p>
      {post.heroImage && (
        <img
          src={post.heroImage}
          alt={post.title}
          className="card-hero-img"
          onError={e => e.target.style.display = "none"}
        />
      )}
      <div className="card-footer">
        <Link to={`/post/${post.id}`} className="read-link">
          {post.linkText || "Read entry"} →
        </Link>
      </div>
    </div>
  );
}
