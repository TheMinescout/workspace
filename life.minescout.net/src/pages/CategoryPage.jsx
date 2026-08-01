import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import { fetchPosts } from "../data/posts";
import { useTheme } from "../hooks/useTheme";

const CFG = {
  "coding-projects": {title:"Coding Projects",span:"Archive",sub:"Apps, tools, and dev projects.",filter:p=>["app","coding","dev"].some(k=>(p.category||"").toLowerCase().includes(k))},
  "tech-tips":       {title:"Tech Tips",span:"Archive",sub:"Reviews, comparisons, and discoveries.",filter:p=>(p.category||"").toLowerCase().includes("tech")},
  "updates":         {title:"Updates",span:"Archive",sub:"Launches, announcements, and milestones.",filter:p=>(p.category||"").toLowerCase().includes("update")||(p.category||"").toLowerCase().includes("eagle")},
  "puppy-life":      {title:"Puppy Life",span:"Archive",sub:"Monty and Nigel — the Carleton Pack.",filter:p=>(p.category||"").toLowerCase().includes("puppy")},
  "minecraft-server":{title:"Minecraft Server",span:"Archive",sub:"Updates from the MineScout survival server.",filter:p=>(p.category||"").toLowerCase().includes("minecraft")},
  "beta":            {title:"Beta",span:"Archive",sub:"Experimental features and early access.",filter:p=>(p.category||"").toLowerCase().includes("beta")||(p.id||"").includes("beta")},
  "stats":           {title:"Stats",span:"Dashboard",sub:"Site analytics and achievement tracking.",isStats:true},
  "feature-request": {title:"Feature Requests",span:"Board",sub:"Suggest new features for MineScout Life.",isFeature:true},
};

export default function CategoryPage({ slug }) {
  const [posts, setPosts] = useState([]);
  useTheme();
  useEffect(() => { fetchPosts().then(setPosts); }, []);
  const cfg = CFG[slug]||{title:"Category",span:"Archive",sub:"",filter:()=>true};
  const filtered = cfg.filter ? posts.filter(cfg.filter).sort((a,b)=>b.timestamp-a.timestamp) : [];

  return (
    <>
      <Header/>
      <section className="hero">
        <div className="hero-eyebrow"><span className="live-dot"/> Category</div>
        <h1 className="hero-title">{cfg.title} <em>{cfg.span}</em></h1>
        <p className="hero-sub">{cfg.sub}</p>
      </section>
      <div className="page-layout">
        <main>
          {cfg.isStats  && <StatsPanel posts={posts}/>}
          {cfg.isFeature && <FeaturePanel/>}
          {!cfg.isStats && !cfg.isFeature && (
            <div className="posts-grid c1">
              {posts.length===0 && <p style={{color:"var(--ink-4)"}}>Loading…</p>}
              {posts.length>0&&filtered.length===0 && <p style={{color:"var(--ink-4)"}}>No posts here yet.</p>}
              {filtered.map(p=><PostCard key={p.id} post={p}/>)}
            </div>
          )}
        </main>
        <Sidebar posts={posts}/>
      </div>
      <footer className="site-footer"><p>Life of a Smart Kid · v4.0</p></footer>
    </>
  );
}

function StatsPanel({posts}) {
  const cats={};
  posts.forEach(p=>{cats[p.category]=(cats[p.category]||0)+1;});
  return (
    <div className="admin-card">
      <h2 className="admin-card-title">Site Stats</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:"10px",marginBottom:"28px"}}>
        {[["📝","Total Posts",posts.length],["💻","Tech Posts",posts.filter(p=>p.category?.toLowerCase().includes("tech")).length],["📱","Apps",posts.filter(p=>p.category?.toLowerCase().includes("app")).length],["🦅","Eagle %","100%"]].map(([i,l,v])=>(
          <div key={l} className="stat-card" style={{cursor:"default"}}><span className="stat-icon">{i}</span><div className="stat-info"><span className="stat-val">{v}</span><span className="stat-lbl">{l}</span></div></div>
        ))}
      </div>
      {Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([c,n])=>(
        <div key={c} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--rule)",fontSize:"14px"}}>
          <span style={{color:"var(--ink-2)",fontWeight:600}}>{c}</span>
          <span style={{color:"var(--accent)",fontWeight:700}}>{n}</span>
        </div>
      ))}
    </div>
  );
}

function FeaturePanel() {
  return (
    <div className="admin-card">
      <h2 className="admin-card-title">Feature Requests</h2>
      <p style={{color:"var(--ink-3)",marginBottom:"16px"}}>Got an idea? Email <a href="mailto:theminescout@minescout.net" style={{color:"var(--accent)"}}>theminescout@minescout.net</a></p>
      <div style={{background:"var(--accent-bg)",border:"1px solid rgba(45,106,79,.2)",borderRadius:"var(--radius-s)",padding:"16px",color:"var(--ink-3)",fontSize:"14px"}}>
        💡 Request board coming in v4.1
      </div>
    </div>
  );
}
