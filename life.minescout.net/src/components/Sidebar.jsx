import { Link, useLocation } from "react-router-dom";
import { siteConfig } from "../data/posts";
import { useEffect, useState } from "react";

const NAV = [
  { label: "Home",             href: "/" },
  { label: "Coding Projects",  href: "/pages/coding-projects" },
  { label: "Tech Tips",        href: "/pages/tech-tips" },
  { label: "Updates",          href: "/pages/updates" },
  { label: "Puppy Life",       href: "/pages/puppy-life" },
  { label: "Minecraft Server", href: "/pages/minecraft-server" },
  { label: "Beta",             href: "/pages/beta" },
  { label: "Stats",            href: "/pages/stats" },
  { label: "Feature Request",  href: "/pages/feature-request" },
];

function AIInsight({ posts }) {
  const [text, setText] = useState(null);
  useEffect(() => {
    if (!posts?.length) return;
    const recent = posts.slice(0,8).map(p=>`- ${p.title} (${p.category})`).join("\n");
    fetch("https://thomas-chat.tmcarleton11.workers.dev/",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({client_id:"minescout_life",system_override:"You are an AI in a student dashboard. Analyze recent posts and write 1-2 short encouraging sentences about momentum and focus. No quotes.",messages:[{role:"user",content:`Analyze:\n${recent}`}],temperature:0.3})
    }).then(r=>r.json()).then(d=>setText(d.content||null))
      .catch(()=>setText("Solid momentum lately — the mix of tech reviews and builds shows real range."));
  }, [posts?.length]);
  return (
    <p className="ai-insight">
      {text===null ? <><span className="ai-pulse"/>Reflecting...</> : `"${text}"`}
    </p>
  );
}

export default function Sidebar({ posts=[], yearFilter, setYear, allYears=[] }) {
  const { pathname } = useLocation();
  const grouped = {};
  posts.forEach(p => { const y=new Date(p.timestamp).getFullYear(); grouped[y]=(grouped[y]||0)+1; });

  const today = new Date(); today.setHours(0,0,0,0);
  const postMap = {};
  posts.forEach(p => { const d=new Date(p.timestamp); d.setHours(0,0,0,0); postMap[d.getTime()]=(postMap[d.getTime()]||0)+1; });

  return (
    <aside className="sidebar">
      {/* Nav */}
      <div className="sidebar-mod">
        <div className="sidebar-head">📂 Browse</div>
        <div className="sidebar-body">
          {NAV.map(n => <Link key={n.href} to={n.href} className={`sidebar-nav-link${pathname===n.href?" active":""}`}>{n.label}</Link>)}
        </div>
      </div>

      {/* AI reflection */}
      <div className="sidebar-mod">
        <div className="sidebar-head">✨ AI Reflection</div>
        <div className="sidebar-body"><AIInsight posts={posts}/></div>
      </div>

      {/* Now building */}
      <div className="sidebar-mod">
        <div className="sidebar-head">🔴 Now Building</div>
        <div className="sidebar-body">
          <div className="now-building-list">
            {siteConfig.nowBuilding.map((item,i) => (
              <div key={i} className="now-building-item">
                <div className="nb-dot" style={{background:item.color,boxShadow:`0 0 0 0 ${item.color}`}}/>
                <div>
                  <div className="nb-title">{item.title}</div>
                  <div className="nb-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="sidebar-mod">
        <div className="sidebar-head">🔥 90-Day Activity</div>
        <div className="sidebar-body">
          <div className="heatmap-grid">
            {Array.from({length:91},(_,i)=>{
              const d=new Date(today); d.setDate(d.getDate()-(90-i));
              const count=postMap[d.getTime()]||0;
              return <div key={i} className="heatmap-cell" title={`${count||"No"} posts · ${d.toLocaleDateString()}`}
                style={count>0?{background:`rgba(45,106,79,${Math.min(count*.3+.3,1)})`}:{}} />;
            })}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"10px",color:"var(--ink-4)",marginTop:"6px"}}>
            <span>Less</span><span>More</span>
          </div>
        </div>
      </div>

      {/* Archive — click to filter by year (only shown on home page via setYear prop) */}
      <div className="sidebar-mod">
        <div className="sidebar-head">📅 Timeline</div>
        <div className="sidebar-body">
          {Object.keys(grouped).sort((a,b)=>b-a).map(year => (
            <div key={year}
              className="archive-item"
              style={{cursor: setYear?"pointer":"default", background: yearFilter===parseInt(year)?"var(--accent-bg)":"", color: yearFilter===parseInt(year)?"var(--accent)":""}}
              onClick={()=>setYear && setYear(parseInt(year))}>
              <span>{year} archive</span>
              <span className="archive-count">{grouped[year]}</span>
            </div>
          ))}
          {setYear && (
            <div className="archive-item" style={{cursor:"pointer",marginTop:"4px"}}
              onClick={()=>setYear("all")}>
              <span style={{color:"var(--ink-4)"}}>Show all years</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
