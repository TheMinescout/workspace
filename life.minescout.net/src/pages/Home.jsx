import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import { fetchPosts, siteConfig } from "../data/posts";
import { useAdmin } from "../hooks/useAdmin";

const CURRENT_YEAR = new Date().getFullYear();

const CAT_FILTERS = [
  {key:"all",   label:"All",    icon:"📝"},
  {key:"tech",  label:"Tech",   icon:"💻"},
  {key:"app",   label:"Apps",   icon:"📱"},
  {key:"eagle", label:"Eagle",  icon:"🦅"},
];

function filterByCategory(all, key) {
  if (key==="all") return all;
  return all.filter(p => {
    const c=(p.category||"").toLowerCase();
    if (key==="tech")  return c.includes("tech");
    if (key==="app")   return c.includes("app");
    if (key==="eagle") return c.includes("eagle")||c.includes("scout");
    return true;
  });
}

export default function Home() {
  const [posts, setPosts]       = useState([]);
  const [catFilter, setCat]     = useState("all");
  const [yearFilter, setYear]   = useState(CURRENT_YEAR); // default: current year only
  const [cols, setCols]         = useState(1);
  const [counts, setCounts]     = useState({total:0,tech:0,app:0});
  const { isAdmin } = useAdmin();

  useEffect(() => {
    fetchPosts().then(data => {
      setPosts(data);
      const tech = data.filter(p=>p.category?.toLowerCase().includes("tech")).length;
      const app  = data.filter(p=>p.category?.toLowerCase().includes("app")).length;
      const anim = (setter, target) => {
        const start = performance.now();
        const step = now => {
          const p = Math.min((now-start)/700,1);
          setter(Math.floor((1-Math.pow(1-p,4))*target));
          if(p<1) requestAnimationFrame(step); else setter(target);
        };
        requestAnimationFrame(step);
      };
      anim(v=>setCounts(c=>({...c,total:v})), data.length);
      anim(v=>setCounts(c=>({...c,tech:v})),  tech);
      anim(v=>setCounts(c=>({...c,app:v})),   app);
    });
  }, []);

  // Available years from all posts
  const allYears = [...new Set(posts.map(p=>new Date(p.timestamp).getFullYear()))].sort((a,b)=>b-a);

  // Apply both filters
  const filtered = filterByCategory(posts, catFilter)
    .filter(p => yearFilter === "all" || new Date(p.timestamp).getFullYear() === yearFilter)
    .sort((a,b)=>b.timestamp-a.timestamp);

  const grouped = {};
  filtered.forEach(p=>{const y=new Date(p.timestamp).getFullYear();if(!grouped[y])grouped[y]=[];grouped[y].push(p);});

  const statVals = {all:counts.total, tech:counts.tech, app:counts.app, eagle:`${siteConfig.eaglePercent}%`};
  const isFiltered = catFilter!=="all" || yearFilter!==CURRENT_YEAR;

  return (
    <>
      <Header cols={cols} setCols={setCols}/>
      <section className="hero">
        <div className="hero-eyebrow"><span className="live-dot"/> Live from MineScout</div>
        <h1 className="hero-title">The Life of a<br/><em>Smart Builder.</em></h1>
        <p className="hero-sub">Coding. AI experiments. Eagle Scout milestones. Dogs. Student life. Documented in real-time.</p>
        <div className="stat-row">
          {CAT_FILTERS.map(f=>(
            <div key={f.key} className={`stat-card${catFilter===f.key?" active":""}`}
              onClick={()=>{setCat(f.key);document.getElementById("timeline")?.scrollIntoView({behavior:"smooth",block:"start"});}}>
              <span className="stat-icon">{f.icon}</span>
              <div className="stat-info">
                <span className="stat-val">{statVals[f.key]}</span>
                <span className="stat-lbl">{f.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="page-layout">
        <main id="timeline">
          {isAdmin && (
            <div className="admin-banner">
              <div className="admin-banner-info">
                <span style={{fontSize:"20px"}}>🛡️</span>
                <div>
                  <div className="admin-banner-text">Admin Access Active</div>
                  <div className="admin-banner-sub">Viewing as administrator</div>
                </div>
              </div>
              <Link to="/admin" className="admin-link-btn">Dashboard →</Link>
            </div>
          )}

          {/* Filter / year bar */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px",flexWrap:"wrap",gap:"8px"}}>
            {/* Year tabs */}
            <div style={{display:"flex",gap:"4px",flexWrap:"wrap"}}>
              {[CURRENT_YEAR, ...allYears.filter(y=>y!==CURRENT_YEAR)].map(y=>(
                <button key={y}
                  onClick={()=>setYear(y)}
                  style={{
                    padding:"4px 12px", borderRadius:"99px", fontSize:"12px", fontWeight:700,
                    border:"1px solid var(--rule)", cursor:"pointer", transition:"all .15s",
                    background: yearFilter===y ? "var(--accent)" : "transparent",
                    color: yearFilter===y ? "white" : "var(--ink-3)",
                  }}>
                  {y}
                </button>
              ))}
              {yearFilter!=="all" && allYears.length>1 && (
                <button onClick={()=>setYear("all")}
                  style={{padding:"4px 12px",borderRadius:"99px",fontSize:"12px",fontWeight:700,border:"1px solid var(--rule)",cursor:"pointer",color:"var(--ink-4)",background:"transparent"}}>
                  All years
                </button>
              )}
            </div>

            {/* Clear cat filter */}
            {catFilter!=="all" && (
              <div className="filter-bar visible" style={{margin:0}}>
                <span className="filter-label">Category: <strong>{CAT_FILTERS.find(f=>f.key===catFilter)?.label}</strong></span>
                <button className="clear-btn" onClick={()=>setCat("all")}>Clear ✕</button>
              </div>
            )}
          </div>

          {posts.length===0 && <div style={{padding:"60px 0",textAlign:"center",color:"var(--ink-4)"}}>Loading posts…</div>}

          <div className={`posts-grid c${cols}`}>
            {Object.keys(grouped).sort((a,b)=>b-a).map(year=>(
              <div key={year} style={{display:"contents"}}>
                <div className="year-sep" style={{gridColumn:"1/-1"}}>
                  <div className="year-pip"/><div className="year-label">{year}</div><div className="year-line"/>
                </div>
                {grouped[year].map(p=><PostCard key={p.id} post={p}/>)}
              </div>
            ))}
            {posts.length>0 && filtered.length===0 && (
              <div style={{padding:"40px",textAlign:"center",color:"var(--ink-4)",gridColumn:"1/-1"}}>
                No posts for this filter. <button style={{color:"var(--accent)",fontWeight:700,background:"none",border:"none",cursor:"pointer"}} onClick={()=>{setCat("all");setYear(CURRENT_YEAR);}}>Reset</button>
              </div>
            )}
          </div>
        </main>
        <Sidebar posts={posts} yearFilter={yearFilter} setYear={setYear} allYears={allYears}/>
      </div>
      <footer className="site-footer"><p>Life of a Smart Kid · v4.0 React Edition · <a href="/admin">Admin</a></p></footer>
    </>
  );
}
