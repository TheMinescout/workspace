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
