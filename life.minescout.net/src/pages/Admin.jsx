import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "../components/Header";
import { fetchPosts, fetchPost, savePost } from "../data/posts";
import { useAdmin } from "../hooks/useAdmin";
import { useTheme } from "../hooks/useTheme";

const CATS = ["Tech","App","Eagle","Coding","Puppy","Update"];

function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""); }

const EMPTY = { title:"", category:"Tech", summary:"", heroImage:"", linkText:"Read Entry", content:"", date:"" };

export default function Admin() {
  const { isAdmin, logout } = useAdmin();
  const [tab, setTab]         = useState("posts");
  const [posts, setPosts]     = useState([]);
  const [form, setForm]       = useState(EMPTY);
  const [editId, setEditId]   = useState(null); // null = new post
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [preview, setPreview] = useState(false);
  useTheme();

  useEffect(() => { fetchPosts().then(setPosts); }, []);

  if (!isAdmin) return <Navigate to="/login" replace/>;

  const sorted = [...posts].sort((a,b)=>b.timestamp-a.timestamp);

  // Load a post for editing
  const startEdit = async (id) => {
    const p = await fetchPost(id);
    if (!p) return alert("Couldn't load post.");
    setForm({
      title: p.title||"", category: p.category||"Tech",
      summary: p.summary||"", heroImage: p.heroImage||"",
      linkText: p.linkText||"Read Entry", content: p.content||"",
      date: p.date||"",
    });
    setEditId(id);
    setTab("edit");
    window.scrollTo(0,0);
  };

  // Delete post
  const deletePost = async (id) => {
    if (!confirm(`Delete "${posts.find(p=>p.id===id)?.title}"? This cannot be undone.`)) return;
    setDeleting(id);
    const res = await fetch("/api/delete-post", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({id})
    });
    if (res.ok) {
      setPosts(prev => prev.filter(p=>p.id!==id));
    } else {
      alert("Delete failed — make sure dev server is running.");
    }
    setDeleting(null);
  };

  // Save (new or edit)
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
      backLabel: form.category==="Puppy"?"Puppy Life":form.category==="Eagle"?"Updates":form.category==="App"?"Coding Projects":"Tech Tips",
      backHref:  form.category==="Puppy"?"/pages/puppy-life":form.category==="Eagle"?"/pages/updates":form.category==="App"?"/pages/coding-projects":"/pages/tech-tips",
    };
    const ok = await savePost(post);
    setSaving(false);
    if (ok) {
      setSaved(true);
      setPosts(prev => {
        const idx = prev.findIndex(p=>p.id===id);
        const entry = {id,title:post.title,category:post.category,summary:post.summary,heroImage:post.heroImage,timestamp:post.timestamp,linkUrl:post.linkUrl,linkText:post.linkText};
        if(idx>=0){const n=[...prev];n[idx]=entry;return n;} else return [entry,...prev];
      });
      if (!editId) { setForm(EMPTY); setEditId(null); }
      setTimeout(()=>setSaved(false),3000);
    } else {
      alert("Save failed — make sure the dev server is running (npm run dev).");
    }
  };

  const cancelEdit = () => { setForm(EMPTY); setEditId(null); setTab("posts"); };

  const tabStyle = t => `tab-btn${tab===t?" active":""}`;
  const field = (key, value, label, type="text", hint="") => (
    <div className="form-group">
      <label className="form-label">{label}{hint&&<span style={{fontWeight:400,textTransform:"none",letterSpacing:0,color:"var(--ink-4)",marginLeft:"6px"}}>{hint}</span>}</label>
      <input className="form-input" type={type} value={value} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} />
    </div>
  );

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
          <button className={tabStyle("posts")} onClick={()=>setTab("posts")}>📝 All Posts ({posts.length})</button>
          <button className={tabStyle("new")} onClick={()=>{setEditId(null);setForm(EMPTY);setTab("new");}}>➕ New Post</button>
          {editId && <button className={tabStyle("edit")} onClick={()=>setTab("edit")}>✏️ Editing: {posts.find(p=>p.id===editId)?.title?.slice(0,30)}…</button>}
        </div>

        {/* ALL POSTS TABLE */}
        {tab==="posts" && (
          <div className="admin-card">
            <h2 className="admin-card-title">All Posts</h2>
            <table className="posts-table">
              <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {sorted.map(p=>(
                  <tr key={p.id}>
                    <td style={{fontWeight:600,color:"var(--ink)"}}>{p.title}</td>
                    <td><span className={`cat-chip chip-${p.category?.toLowerCase()}`}>{p.category}</span></td>
                    <td style={{color:"var(--ink-4)"}}>
                      {p.date||new Date(p.timestamp).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
                    </td>
                    <td>
                      <div style={{display:"flex",gap:"6px"}}>
                        <Link to={`/post/${p.id}`} className="btn-edit" target="_blank">View</Link>
                        <button className="btn-edit" onClick={()=>startEdit(p.id)}>Edit</button>
                        <button className="btn-delete" onClick={()=>deletePost(p.id)} disabled={deleting===p.id}>
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
                  <label className="form-label">Summary * <span style={{fontWeight:400,textTransform:"none",color:"var(--ink-4)"}}>shown on timeline card</span></label>
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
                      placeholder={`<h2>Introduction</h2>\n<p>Write your post content here using HTML...</p>\n<h2>Section heading</h2>\n<p>More content...</p>\n<img src="/assests/images/tech/photo.png" alt="description">`}
                    />
                    <p className="editor-hint">
                      Write plain HTML. Use <code>&lt;h2&gt;</code> for headings, <code>&lt;p&gt;</code> for paragraphs, <code>&lt;img src="..."&gt;</code> for images (files go in your existing assests/images/ folder and are served at that path), <code>&lt;ul&gt;&lt;li&gt;</code> for lists, <code>&lt;strong&gt;</code> for bold, <code>&lt;a href="..."&gt;</code> for links, <code>&lt;blockquote&gt;</code> for quotes, <code>&lt;table&gt;</code> for tables, <code>&lt;hr&gt;</code> for dividers.
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
      </div>
    </>
  );
}
