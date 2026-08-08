import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "../components/Header";
import {
  fetchPosts, fetchPost, savePost,
  fetchSidebarConfig, saveSidebarConfig,
  fetchAllComments, deleteComment,
} from "../data/posts";
import { useAdmin } from "../hooks/useAdmin";
import { useTheme } from "../hooks/useTheme";

const CATS = ["Tech","App","Eagle","Coding","Puppy","Update"];

function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""); }

const EMPTY = { title:"", category:"Tech", summary:"", heroImage:"", linkText:"Read Entry", content:"", date:"", publishDate:"" };

async function generateAISummary(title, content, category) {
  try {
    const res = await fetch("https://thomas-chat.tmcarleton11.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: "minescout_life",
        system_override: "You are a blog summarizer. Write a single engaging sentence (under 20 words) summarizing the post for a card teaser. No quotes, no prefix.",
        messages: [{ role: "user", content: `Title: ${title}\nCategory: ${category}\nContent snippet: ${content.replace(/<[^>]+>/g,"").slice(0,400)}` }],
        temperature: 0.3,
      }),
    });
    const d = await res.json();
    return d.content || null;
  } catch { return null; }
}

export default function Admin() {
  const { isAdmin, logout } = useAdmin();
  const [tab, setTab]         = useState("posts");
  const [posts, setPosts]     = useState([]);
  const [form, setForm]       = useState(EMPTY);
  const [editId, setEditId]   = useState(null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [preview, setPreview] = useState(false);
  const [genSummary, setGenSummary] = useState(false);

  // Sidebar config state
  const [sidebarCfg, setSidebarCfg] = useState(null);
  const [sidebarSaving, setSidebarSaving] = useState(false);
  const [sidebarSaved, setSidebarSaved] = useState(false);

  // Comments state
  const [comments, setComments] = useState([]);
  const [deletingComment, setDeletingComment] = useState(null);

  useTheme();

  useEffect(() => { fetchPosts().then(setPosts); }, []);
  useEffect(() => {
    if (tab === "sidebar") fetchSidebarConfig().then(cfg => cfg && Object.keys(cfg).length && setSidebarCfg(cfg));
    if (tab === "comments") fetchAllComments().then(setComments);
  }, [tab]);

  if (!isAdmin) return <Navigate to="/login" replace/>;

  const sorted = [...posts].sort((a,b)=>b.timestamp-a.timestamp);

  const startEdit = async (id) => {
    const p = await fetchPost(id);
    if (!p) return alert("Couldn't load post.");
    setForm({
      title: p.title||"", category: p.category||"Tech",
      summary: p.summary||"", heroImage: p.heroImage||"",
      linkText: p.linkText||"Read Entry", content: p.content||"",
      date: p.date||"", publishDate: p.publishDate||"",
    });
    setEditId(id);
    setTab("edit");
    window.scrollTo(0,0);
  };

  const deletePostHandler = async (id) => {
    if (!confirm(`Delete "${posts.find(p=>p.id===id)?.title}"? This cannot be undone.`)) return;
    setDeleting(id);
    const res = await fetch("/api/delete-post", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({id})
    });
    if (res.ok) setPosts(prev => prev.filter(p=>p.id!==id));
    else alert("Delete failed — make sure dev server is running.");
    setDeleting(null);
  };

  const handleGenerateSummary = async () => {
    if (!form.title) return alert("Add a title first.");
    setGenSummary(true);
    const s = await generateAISummary(form.title, form.content, form.category);
    if (s) setForm(f => ({ ...f, summary: s }));
    setGenSummary(false);
  };

  const handleSave = async e => {
    e.preventDefault();
    if (!form.title || !form.summary) return alert("Title and summary are required.");
    setSaving(true);
    const id = editId || slugify(form.title)+"-"+new Date().getFullYear();
    const existing = editId ? posts.find(p=>p.id===editId) : null;
    const post = {
      id,
      title: form.title,
      category: form.category,
      summary: form.summary,
      heroImage: form.heroImage,
      content: form.content,
      linkText: form.linkText||"Read Entry",
      linkUrl: `/post/${id}`,
      date: form.date || new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),
      timestamp: existing?.timestamp || Date.now(),
      publishDate: form.publishDate || null,
      backLabel: form.category==="Puppy"?"Puppy Life":form.category==="Eagle"?"Updates":form.category==="App"?"Coding Projects":"Tech Tips",
      backHref:  form.category==="Puppy"?"/pages/puppy-life":form.category==="Eagle"?"/pages/updates":form.category==="App"?"/pages/coding-projects":"/pages/tech-tips",
    };
    const ok = await savePost(post);
    setSaving(false);
    if (ok) {
      setSaved(true);
      setPosts(prev => {
        const idx = prev.findIndex(p=>p.id===id);
        const entry = {id,title:post.title,category:post.category,summary:post.summary,heroImage:post.heroImage,timestamp:post.timestamp,linkUrl:post.linkUrl,linkText:post.linkText,publishDate:post.publishDate};
        if(idx>=0){const n=[...prev];n[idx]=entry;return n;} else return [entry,...prev];
      });
      if (!editId) { setForm(EMPTY); setEditId(null); }
      setTimeout(()=>setSaved(false),3000);
    } else {
      alert("Save failed — make sure the dev server is running (npm run dev).");
    }
  };

  const cancelEdit = () => { setForm(EMPTY); setEditId(null); setTab("posts"); };

  const handleSidebarSave = async () => {
    setSidebarSaving(true);
    await saveSidebarConfig(sidebarCfg);
    setSidebarSaving(false);
    setSidebarSaved(true);
    setTimeout(() => setSidebarSaved(false), 3000);
  };

  const handleDeleteComment = async (id) => {
    if (!confirm("Delete this comment?")) return;
    setDeletingComment(id);
    await deleteComment(id);
    setComments(prev => prev.filter(c => c.id !== id));
    setDeletingComment(null);
  };

  const defaultSidebarCfg = {
    nowBuilding: [
      { title: "Geo Quiz AI", desc: "Training custom models for terrain recognition.", color: "#f97316" },
      { title: "LifeOS v4 React Rebuild", desc: "No more Firebase — file-based posts.", color: "#22c55e" },
      { title: "Eagle Final Paperwork", desc: "Formatting the binder & project reports.", color: "#eab308" },
    ],
    eaglePercent: 100,
    aiReflectionEnabled: true,
  };

  const cfg = sidebarCfg || defaultSidebarCfg;

  const tabStyle = t => `tab-btn${tab===t?" active":""}`;

  const isScheduled = (p) => p.publishDate && new Date(p.publishDate) > new Date();

  return (
    <>
      <Header/>
      <div className="admin-page">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Dashboard</h1>
            <p className="admin-sub">{posts.length} posts published</p>
          </div>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            <Link to="/" className="ghost-btn">← Site</Link>
            <button className="ghost-btn" onClick={logout}>Sign out</button>
          </div>
        </div>

        <div className="tab-bar">
          <button className={tabStyle("posts")} onClick={()=>setTab("posts")}>📝 Posts ({posts.length})</button>
          <button className={tabStyle("new")} onClick={()=>{setEditId(null);setForm(EMPTY);setTab("new");}}>➕ New</button>
          {editId && <button className={tabStyle("edit")} onClick={()=>setTab("edit")}>✏️ {posts.find(p=>p.id===editId)?.title?.slice(0,24)}…</button>}
          <button className={tabStyle("comments")} onClick={()=>setTab("comments")}>💬 Comments</button>
          <button className={tabStyle("sidebar")} onClick={()=>setTab("sidebar")}>⚙️ Sidebar</button>
        </div>

        {/* ALL POSTS TABLE */}
        {tab==="posts" && (
          <div className="admin-card">
            <h2 className="admin-card-title">All Posts</h2>
            <table className="posts-table">
              <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {sorted.map(p=>(
                  <tr key={p.id}>
                    <td style={{fontWeight:600,color:"var(--ink)"}}>{p.title}</td>
                    <td><span className={`cat-chip chip-${p.category?.toLowerCase()}`}>{p.category}</span></td>
                    <td style={{color:"var(--ink-4)"}}>
                      {p.date||new Date(p.timestamp).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
                    </td>
                    <td>
                      {isScheduled(p)
                        ? <span style={{fontSize:"11px",color:"#f97316",fontWeight:600}}>⏰ Scheduled</span>
                        : <span style={{fontSize:"11px",color:"var(--accent)",fontWeight:600}}>✓ Live</span>}
                    </td>
                    <td>
                      <div style={{display:"flex",gap:"6px"}}>
                        <Link to={`/post/${p.id}`} className="btn-edit" target="_blank">View</Link>
                        <button className="btn-edit" onClick={()=>startEdit(p.id)}>Edit</button>
                        <button className="btn-delete" onClick={()=>deletePostHandler(p.id)} disabled={deleting===p.id}>
                          {deleting===p.id?"…":"Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* NEW / EDIT FORM */}
        {(tab==="new"||tab==="edit") && (
          <form onSubmit={handleSave}>
            <div className="admin-card">
              <h2 className="admin-card-title">{editId?"Edit Post":"New Post"}</h2>
              {editId && <p style={{fontSize:"13px",color:"var(--ink-3)",marginBottom:"20px"}}>Editing: <strong>{editId}</strong></p>}

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}>
                <div className="form-group" style={{gridColumn:"1/-1"}}>
                  <label className="form-label">Title *</label>
                  <input className="form-input" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Post title…" required/>
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                    {CATS.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date <span style={{fontWeight:400,textTransform:"none",color:"var(--ink-4)"}}>shown on post</span></label>
                  <input className="form-input" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} placeholder="e.g. June 30, 2026"/>
                </div>
                <div className="form-group" style={{gridColumn:"1/-1"}}>
                  <label className="form-label">
                    Scheduled Publish Date
                    <span style={{fontWeight:400,textTransform:"none",color:"var(--ink-4)",marginLeft:6}}>leave blank to publish immediately</span>
                  </label>
                  <input className="form-input" type="datetime-local" value={form.publishDate} onChange={e=>setForm(f=>({...f,publishDate:e.target.value}))}/>
                  {form.publishDate && <p style={{fontSize:"12px",color:"#f97316",marginTop:"4px"}}>⏰ Will be hidden from the timeline until {new Date(form.publishDate).toLocaleString()}</p>}
                </div>
                <div className="form-group" style={{gridColumn:"1/-1"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"6px"}}>
                    <label className="form-label" style={{margin:0}}>Summary * <span style={{fontWeight:400,textTransform:"none",color:"var(--ink-4)"}}>shown on timeline card</span></label>
                    <button type="button" className="ghost-btn" style={{padding:"4px 10px",fontSize:"11px"}} onClick={handleGenerateSummary} disabled={genSummary}>
                      {genSummary ? "✨ Generating…" : "✨ AI Generate"}
                    </button>
                  </div>
                  <textarea className="form-textarea" value={form.summary} onChange={e=>setForm(f=>({...f,summary:e.target.value}))} rows={2} placeholder="1-2 sentence teaser…" required/>
                </div>
                <div className="form-group" style={{gridColumn:"1/-1"}}>
                  <label className="form-label">Hero Image Path <span style={{fontWeight:400,textTransform:"none",color:"var(--ink-4)"}}>e.g. /assests/images/tech/my-photo.png</span></label>
                  <input className="form-input" value={form.heroImage} onChange={e=>setForm(f=>({...f,heroImage:e.target.value}))} placeholder="/assests/images/tech/title.png"/>
                  {form.heroImage && <img src={form.heroImage} alt="preview" style={{marginTop:"8px",maxHeight:"100px",borderRadius:"8px",border:"1px solid var(--rule)"}} onError={e=>e.target.style.display="none"}/>}
                </div>
                <div className="form-group">
                  <label className="form-label">Button text</label>
                  <input className="form-input" value={form.linkText} onChange={e=>setForm(f=>({...f,linkText:e.target.value}))} placeholder="Read Entry"/>
                </div>
              </div>

              <div className="form-group">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
                  <label className="form-label">Post Content (HTML) *</label>
                  <button type="button" className="ghost-btn" style={{padding:"4px 10px",fontSize:"11px"}} onClick={()=>setPreview(p=>!p)}>
                    {preview?"✏️ Edit":"👁 Preview"}
                  </button>
                </div>
                {!preview ? (
                  <>
                    <textarea
                      className="html-editor"
                      value={form.content}
                      onChange={e=>setForm(f=>({...f,content:e.target.value}))}
                      placeholder={`<h2>Introduction</h2>\n<p>Write your post content here using HTML...</p>`}
                    />
                    <p className="editor-hint">
                      Write plain HTML. Use <code>&lt;h2&gt;</code> for headings, <code>&lt;p&gt;</code> for paragraphs, <code>&lt;img src="..."&gt;</code> for images, <code>&lt;ul&gt;&lt;li&gt;</code> for lists, <code>&lt;strong&gt;</code> for bold.
                    </p>
                  </>
                ) : (
                  <div className="article-body" style={{padding:"20px",background:"var(--paper-2)",border:"1px solid var(--rule)",borderRadius:"var(--radius-s)",minHeight:"200px"}} dangerouslySetInnerHTML={{__html:form.content||"<p><em>Nothing to preview yet.</em></p>"}}/>
                )}
              </div>

              <div style={{display:"flex",gap:"12px",alignItems:"center",flexWrap:"wrap"}}>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Saving…" : saved ? "✓ Saved!" : editId ? "💾 Save Changes" : "🚀 Publish Post"}
                </button>
                {editId && <button type="button" className="ghost-btn" onClick={cancelEdit}>Cancel</button>}
                {saved && <span className="save-success">{editId?"Changes saved!":"Post is live on the timeline!"}</span>}
              </div>
            </div>
          </form>
        )}

        {/* COMMENTS TAB */}
        {tab==="comments" && (
          <div className="admin-card">
            <h2 className="admin-card-title">All Comments ({comments.length})</h2>
            {comments.length === 0 ? (
              <p style={{color:"var(--ink-4)",padding:"20px 0"}}>No comments yet.</p>
            ) : (
              <table className="posts-table">
                <thead><tr><th>Post</th><th>User</th><th>Comment</th><th>Date</th><th>Action</th></tr></thead>
                <tbody>
                  {[...comments].sort((a,b)=>b.timestamp-a.timestamp).map(c=>(
                    <tr key={c.id}>
                      <td style={{color:"var(--accent)",fontSize:"12px"}}>{c.postId}</td>
                      <td style={{fontWeight:600}}>{c.username}</td>
                      <td style={{maxWidth:"300px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.text}</td>
                      <td style={{color:"var(--ink-4)",fontSize:"12px"}}>{new Date(c.timestamp).toLocaleDateString()}</td>
                      <td>
                        <button className="btn-delete" onClick={()=>handleDeleteComment(c.id)} disabled={deletingComment===c.id}>
                          {deletingComment===c.id?"…":"Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* SIDEBAR CONFIG TAB */}
        {tab==="sidebar" && (
          <div className="admin-card">
            <h2 className="admin-card-title">Sidebar Configuration</h2>
            <p style={{fontSize:"13px",color:"var(--ink-4)",marginBottom:"24px"}}>Edit the "Now Building" items and sidebar settings.</p>

            <div className="form-group">
              <label className="form-label">Eagle Scout Progress (%)</label>
              <input className="form-input" type="number" min="0" max="100"
                value={cfg.eaglePercent ?? 100}
                onChange={e=>setSidebarCfg(c=>({...(c||defaultSidebarCfg), eaglePercent: parseInt(e.target.value)||0}))}
                style={{maxWidth:"120px"}}
              />
            </div>

            <div className="form-group">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
                <label className="form-label" style={{margin:0}}>Now Building Items</label>
                <button type="button" className="ghost-btn" style={{fontSize:"12px",padding:"4px 10px"}}
                  onClick={()=>setSidebarCfg(c=>({...(c||defaultSidebarCfg), nowBuilding:[...((c||defaultSidebarCfg).nowBuilding||[]),{title:"",desc:"",color:"#6366f1"}]}))}>
                  + Add Item
                </button>
              </div>
              {(cfg.nowBuilding||[]).map((item, i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 2fr 80px 36px",gap:"8px",marginBottom:"10px",alignItems:"center"}}>
                  <input className="form-input" placeholder="Project name" value={item.title}
                    onChange={e=>setSidebarCfg(c=>{const nb=[...(c||defaultSidebarCfg).nowBuilding];nb[i]={...nb[i],title:e.target.value};return{...(c||defaultSidebarCfg),nowBuilding:nb};})}/>
                  <input className="form-input" placeholder="Short description" value={item.desc}
                    onChange={e=>setSidebarCfg(c=>{const nb=[...(c||defaultSidebarCfg).nowBuilding];nb[i]={...nb[i],desc:e.target.value};return{...(c||defaultSidebarCfg),nowBuilding:nb};})}/>
                  <input type="color" value={item.color} style={{height:"38px",padding:"2px",borderRadius:"6px",border:"1px solid var(--rule)",width:"100%",background:"none",cursor:"pointer"}}
                    onChange={e=>setSidebarCfg(c=>{const nb=[...(c||defaultSidebarCfg).nowBuilding];nb[i]={...nb[i],color:e.target.value};return{...(c||defaultSidebarCfg),nowBuilding:nb};})}/>
                  <button type="button" onClick={()=>setSidebarCfg(c=>{const nb=(c||defaultSidebarCfg).nowBuilding.filter((_,j)=>j!==i);return{...(c||defaultSidebarCfg),nowBuilding:nb};})}
                    style={{background:"none",border:"1px solid var(--rule)",borderRadius:"6px",cursor:"pointer",color:"var(--ink-4)",fontSize:"16px",lineHeight:1}}>×</button>
                </div>
              ))}
            </div>

            <div style={{display:"flex",gap:"12px",alignItems:"center"}}>
              <button className="btn-primary" onClick={handleSidebarSave} disabled={sidebarSaving}>
                {sidebarSaving?"Saving…":sidebarSaved?"✓ Saved!":"💾 Save Sidebar"}
              </button>
              {sidebarSaved && <span className="save-success">Sidebar updated!</span>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
