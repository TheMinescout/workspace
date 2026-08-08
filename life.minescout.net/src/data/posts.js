export const siteConfig = {
  nowBuilding: [
    { title: "Geo Quiz AI", desc: "Training custom models for terrain recognition.", color: "#f97316" },
    { title: "LifeOS v4 React Rebuild", desc: "No more Firebase — file-based posts.", color: "#22c55e" },
    { title: "Eagle Final Paperwork", desc: "Formatting the binder & project reports.", color: "#eab308" },
  ],
  adminPassword: "minescout2026",
  eaglePercent: 100,
};

export async function fetchPosts() {
  const res = await fetch("/posts/manifest.json?t=" + Date.now());
  if (!res.ok) return [];
  return res.json();
}

export async function fetchPost(id) {
  const res = await fetch(`/posts/${id}.json?t=` + Date.now());
  if (!res.ok) return null;
  return res.json();
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
    return res.json();
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

// Users
export async function registerUser(username, password) {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function updateUserPassword(username, newPassword) {
  const res = await fetch("/api/reset-password", { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, newPassword }),
  });
  return res.json();
}

export async function loginUser(username, password) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

// Comments
export async function fetchComments(postId) {
  try {
    const res = await fetch(`/api/comments?postId=${postId}`);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchAllComments() {
  try {
    const res = await fetch("/api/comments/all");
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function addComment(postId, username, text) {
  const res = await fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId, username, text }),
  });
  return res.json();
}

export async function deleteComment(commentId) {
  const res = await fetch("/api/comments/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: commentId }),
  });
  return res.ok;
}

// Ratings
export async function fetchRatings(postId) {
  try {
    const res = await fetch(`/api/ratings?postId=${postId}`);
    if (!res.ok) return { up: 0, down: 0, userVote: null };
    return res.json();
  } catch { return { up: 0, down: 0, userVote: null }; }
}

export async function votePost(postId, username, vote) {
  const res = await fetch("/api/ratings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId, username, vote }),
  });
  return res.json();
}
