const KEY = "chop-lab-requests";

export type StoredAttachment = {
  filename: string;
  contentType: string;
  /** Base64 content without a `data:` prefix. */
  content: string;
};

export type DeliveryStatus = {
  studioOk: boolean;
  receiptOk: boolean;
  at: string;
  /** Transport error from the last attempt, so the queue can show why it failed. */
  error?: string;
};

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
  /** Kept so a failed delivery can be resent from this device. */
  attachments?: StoredAttachment[];
  /** True when the files were too large for local storage. */
  attachmentsOmitted?: boolean;
  delivery?: DeliveryStatus;
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

function persist(all: LabRequest[]) {
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function saveRequest(req: LabRequest): LabRequest[] {
  const all = [req, ...loadRequests()].slice(0, 20);
  try {
    persist(all);
    return all;
  } catch {
    // Attachment base64 can overflow the storage quota. Keep the request and
    // flag it so the delivery queue can ask for the file again.
    const slim = all.map((r) =>
      r.id === req.id ? { ...r, attachments: undefined, attachmentsOmitted: true } : r,
    );
    try {
      persist(slim);
    } catch {
      // Nothing left to drop; the in-memory list still works for this session.
    }
    return slim;
  }
}

export function updateRequest(id: string, patch: Partial<LabRequest>): LabRequest[] {
  const all = loadRequests().map((r) => (r.id === id ? { ...r, ...patch } : r));
  try {
    persist(all);
  } catch {
    // Ignore quota failures; the caller still gets the updated list.
  }
  return all;
}

export function removeRequest(id: string): LabRequest[] {
  const all = loadRequests().filter((r) => r.id !== id);
  try {
    persist(all);
  } catch {
    // Ignore quota failures.
  }
  return all;
}

/** Requests the studio has not confirmed receiving (or whose receipt failed). */
export function undeliveredRequests(all: LabRequest[]): LabRequest[] {
  return all.filter((r) => !r.delivery?.studioOk || !r.delivery?.receiptOk);
}
