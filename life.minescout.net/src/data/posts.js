import { withBase } from "../lib/base";
import { parseShowDate, publishTime, isPublished, isScheduled } from "../lib/scheduling";

// Re-exported so components keep importing scheduling from here.
export { parseShowDate, publishTime, isPublished, isScheduled };

export const siteConfig = {
  nowBuilding: [
    { title: "Geo Quiz AI", desc: "Training custom models for terrain recognition.", color: "#f97316" },
    { title: "LifeOS v4 React Rebuild", desc: "No more Firebase — file-based posts.", color: "#22c55e" },
    { title: "Eagle Final Paperwork", desc: "Formatting the binder & project reports.", color: "#eab308" },
  ],
  eaglePercent: 100,
};

// The one place that decides which posts a viewer may see. `isAdmin` is the
// value from useAdmin(): true for admins, false/null otherwise (including the
// brief window before the session check resolves, when scheduled posts stay
// hidden). Wrapped in an arrow so filter() does not pass the index as `now`.
export function visiblePosts(posts, isAdmin) {
  const list = Array.isArray(posts) ? posts : [];
  return isAdmin ? list : list.filter(p => isPublished(p));
}

// The category the weekly AI writes to. Matched on the whole word "ai", so
// "AI Posts" (and a bare "AI") count, while "Coding"/"Tech"/"Puppy" never do.
export const AI_CATEGORY = "AI Posts";

function categoryWords(post) {
  return String((post && post.category) || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

export function isAICategory(post) {
  return categoryWords(post).includes("ai");
}

// Posts that belong to a category kept off the home timeline. They are still
// reachable from their own tab and by direct link; they just do not mix into the
// main feed. Today only the AI Posts tab opts out.
export function isHomeHidden(post) {
  return isAICategory(post);
}

// The posts the home timeline shows: everything a viewer may see, minus the
// home-hidden categories.
export function homePosts(posts, isAdmin) {
  return visiblePosts(posts, isAdmin).filter(p => !isHomeHidden(p));
}

// A rejected fetch here would leave the page stuck on "Loading…" and, before
// first paint, trip the boot guard. These degrade to empty content instead.
export async function fetchPosts() {
  try {
    const res = await fetch(withBase("posts/manifest.json?t=" + Date.now()));
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

export async function fetchPost(id) {
  try {
    const res = await fetch(withBase(`posts/${encodeURIComponent(id)}.json?t=` + Date.now()));
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export async function savePost(post) {
  const res = await fetch("/api/save-post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  return res.ok;
}

export async function deletePost(id) {
  const res = await fetch("/api/delete-post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return res.ok;
}

// Sidebar config
export async function fetchSidebarConfig() {
  try {
    const res = await fetch("/api/sidebar-config");
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export async function saveSidebarConfig(config) {
  const res = await fetch("/api/sidebar-config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  return res.ok;
}

// Admin session (password is verified server-side only)
export async function adminLogin(password) {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ password }),
  });
  return res.json().catch(() => ({ ok: false }));
}

export async function adminLogout() {
  await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
}

export async function fetchAdminSession() {
  try {
    const res = await fetch("/api/admin/session", { credentials: "same-origin" });
    if (!res.ok) return { ok: false, isAdmin: false };
    return await res.json();
  } catch { return { ok: false, isAdmin: false }; }
}

// Users
export async function registerUser(username, password) {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function loginUser(username, password) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function logoutUser() {
  await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
}

export async function fetchCurrentUser() {
  try {
    const res = await fetch("/api/me", { credentials: "same-origin" });
    if (!res.ok) return { ok: false };
    return await res.json();
  } catch { return { ok: false }; }
}

// Comments
export async function fetchComments(postId) {
  try {
    const res = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`);
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

export async function fetchAllComments() {
  try {
    const res = await fetch("/api/comments/all", { credentials: "same-origin" });
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

export async function addComment(postId, text) {
  const res = await fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ postId, text }),
  });
  return res.json();
}

export async function deleteComment(commentId) {
  const res = await fetch("/api/comments/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ id: commentId }),
  });
  return res.ok;
}

// Ratings
export async function fetchRatings(postId) {
  try {
    const res = await fetch(`/api/ratings?postId=${encodeURIComponent(postId)}`);
    if (!res.ok) return { up: 0, down: 0, userVote: null };
    return await res.json();
  } catch { return { up: 0, down: 0, userVote: null }; }
}

export async function votePost(postId, vote) {
  const res = await fetch("/api/ratings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ postId, vote }),
  });
  return res.json();
}
