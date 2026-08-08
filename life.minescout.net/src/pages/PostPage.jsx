import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Comments from "../components/Comments";
import { fetchPost, fetchPosts } from "../data/posts";
import { useTheme } from "../hooks/useTheme";
import { useAdmin } from "../hooks/useAdmin";

function chipClass(cat) {
  const c=(cat||"").toLowerCase();
  if(c.includes("tech"))  return "chip-tech";
  if(c.includes("app"))   return "chip-app";
  if(c.includes("eagle")) return "chip-eagle";
  if(c.includes("puppy")) return "chip-puppy";
  return "chip-update";
}

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost]       = useState(null);
  const [allPosts, setAll]    = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdmin();
  useTheme();

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPost(id), fetchPosts()]).then(([p, all]) => {
      setPost(p); setAll(all); setLoading(false); window.scrollTo(0,0);
    });
  }, [id]);

  if (loading) return (<><Header/><div style={{padding:"80px",textAlign:"center",color:"var(--ink-4)"}}>Loading…</div></>);
  if (!post)   return (<><Header/><div style={{padding:"80px",textAlign:"center"}}><p>Post not found.</p><Link to="/" className="read-link">← Home</Link></div></>);

  const isScheduled = post.publishDate && new Date(post.publishDate) > new Date();
  const date = post.date || new Date(post.timestamp).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});

  return (
    <>
      <Header/>
      <div className="post-page-layout">
        <main>
          <Link to={post.backHref||"/"} className="back-link">← {post.backLabel||"Back"}</Link>

          {isAdmin && isScheduled && (
            <div style={{background:"#fff3cd",border:"1px solid #f97316",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",fontSize:"13px",color:"#92400e"}}>
              ⏰ <strong>Admin preview</strong> — this post is scheduled and won't appear on the timeline until {new Date(post.publishDate).toLocaleString()}
            </div>
          )}

          <div className="article-card">
            <div className="card-meta" style={{marginBottom:"12px"}}>
              <span className={`cat-chip ${chipClass(post.category)}`}>{post.category}</span>
            </div>
            <h1 className="article-title">{post.title}</h1>
            <p className="article-meta">{date}</p>

            {post.heroImage && (
              <img src={post.heroImage} alt={post.title} className="article-hero"
                onError={e=>e.target.style.display="none"}/>
            )}

            <div className="article-body" dangerouslySetInnerHTML={{__html: post.content}}/>
          </div>

          <div style={{marginTop:"28px",display:"flex",justifyContent:"space-between"}}>
            <Link to={post.backHref||"/"} className="back-link">← {post.backLabel}</Link>
            <Link to="/" style={{fontSize:"12px",color:"var(--ink-4)"}}>Home</Link>
          </div>

          <Comments postId={id} />
        </main>
        <Sidebar posts={allPosts}/>
      </div>
      <footer className="site-footer"><p>Life of a Smart Kid · v5.0</p></footer>
    </>
  );
}
