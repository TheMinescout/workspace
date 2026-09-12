const KEY = "chop-lab-requests";

export type LabRequest = {
  id: string;
  createdAt: string;
  productSlug: string;
  productName: string;
  name: string;
  email: string;
  studio: string;
  notes: string;
  specs: Record<string, string>;
  estimate: number;
  files: string[];
};

export function loadRequests(): LabRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LabRequest[]) : [];
  } catch {
    return [];
  }
}

export function saveRequest(req: LabRequest) {
  const all = [req, ...loadRequests()].slice(0, 20);
  localStorage.setItem(KEY, JSON.stringify(all));
  return all;
}
