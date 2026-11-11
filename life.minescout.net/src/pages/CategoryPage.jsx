import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import { fetchPosts, visiblePosts } from "../data/posts";
import { useTheme } from "../hooks/useTheme";
import { useAdmin } from "../hooks/useAdmin";

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
  const { isAdmin } = useAdmin();
  useTheme();
  useEffect(() => { fetchPosts().then(data => setPosts(visiblePosts(data, isAdmin))); }, [isAdmin]);
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
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function submitRequest(event) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const title = String(data.get("title") || "").trim();
    const priority = String(data.get("priority") || "Normal");
    const description = String(data.get("description") || "").trim();
    if (!title || !description) {
      setStatus("Please add a title and description.");
      return;
    }

    const escapeHtml = value => value.replace(/[&<>"']/g, char => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    }[char]));
    const safe = value => escapeHtml(value).replace(/\n/g, "<br>");
    const htmlBody = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1916">
        <div style="background:#1a1916;padding:20px;color:#fff">
          <h2 style="margin:0;font-family:Georgia,serif">Minescout Life / Feature Request</h2>
        </div>
        <div style="padding:24px;border:1px solid #e8e4dd">
          <p><strong>Request:</strong> ${safe(title)}</p>
          <p><strong>Submitted by:</strong> ${safe(name || "Not provided")}</p>
          <p><strong>Reply email:</strong> ${safe(email || "Not provided")}</p>
          <p><strong>Priority:</strong> ${safe(priority)}</p>
          <div style="margin-top:18px;padding:16px;background:#f9f8f6;border-left:3px solid #2d6a4f;white-space:normal">
            ${safe(description)}
          </div>
        </div>
      </div>
    `;
    const payload = {
      to: ["theminescout@minescout.net"],
      subject: `Minescout Life Feature Request: ${title}`,
      htmlBody,
      fromName: "Minescout Life Feature Requests"
    };

    setSending(true);
    setStatus("Sending request…");
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbz7MJE7mNY1A-SvbdHGV3yI6-ftBElB1wOth4MqEABvJXLI5SNzeqiG2r7PJBpWvcAiOg/exec", {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Email service rejected the request.");
      form.reset();
      setStatus("Request sent. Thanks for helping improve Minescout Life!");
    } catch {
      setStatus("Could not send the request right now. Please email theminescout@minescout.net directly.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="admin-card request-card">
      <h2 className="admin-card-title">Feature Requests</h2>
      <p className="request-intro">Have an idea for Minescout Life? Send it over. Requests go directly to <a href="mailto:theminescout@minescout.net">theminescout@minescout.net</a>.</p>
      <form className="request-form" onSubmit={submitRequest}>
        <div className="form-group">
          <label className="form-label" htmlFor="request-name">Name / handle <span>Optional</span></label>
          <input className="form-input" id="request-name" name="name" maxLength="100" autoComplete="name" placeholder="What should I call you?"/>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="request-email">Email <span>Optional, for a reply</span></label>
          <input className="form-input" id="request-email" name="email" type="email" maxLength="254" autoComplete="email" placeholder="you@example.com"/>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="request-title">Feature title</label>
          <input className="form-input" id="request-title" name="title" required maxLength="160" placeholder="What should be added or improved?"/>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="request-priority">Priority</label>
          <select className="form-select" id="request-priority" name="priority" defaultValue="Normal">
            <option>Low</option><option>Normal</option><option>High</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="request-description">Description</label>
          <textarea className="form-textarea" id="request-description" name="description" required maxLength="5000" rows="7" placeholder="What problem would this solve? How would you use it?"/>
        </div>
        <button className="btn-primary request-submit" type="submit" disabled={sending}>{sending ? "Sending…" : "Send feature request →"}</button>
        {status && <p className="request-status" role="status" aria-live="polite">{status}</p>}
      </form>
    </div>
  );
}
