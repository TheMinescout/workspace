import assert from "node:assert/strict";
import { test } from "node:test";
import {
  loadRequests,
  removeRequest,
  saveRequest,
  undeliveredRequests,
  updateRequest,
  type LabRequest,
} from "./requests.ts";

type StorageOptions = { rejectAttachmentWrites?: boolean };

function withBrowserStorage<T>(run: () => T, options: StorageOptions = {}): T {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const values = new Map<string, string>();
  const storage = {
    get length() {
      return values.size;
    },
    clear() {
      values.clear();
    },
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    key(index: number) {
      return [...values.keys()][index] ?? null;
    },
    removeItem(key: string) {
      values.delete(key);
    },
    setItem(key: string, value: string) {
      if (
        options.rejectAttachmentWrites &&
        (JSON.parse(value) as LabRequest[]).some((item) => item.attachments?.length)
      ) {
        throw new Error("QuotaExceededError");
      }
      values.set(key, value);
    },
  } as Storage;

  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
  try {
    return run();
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else Reflect.deleteProperty(globalThis, "window");
    if (previousStorage) Object.defineProperty(globalThis, "localStorage", previousStorage);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
}

function request(overrides: Partial<LabRequest> = {}): LabRequest {
  return {
    id: "CL-TEST-001",
    createdAt: "2026-11-25T12:00:00.000Z",
    productSlug: "custom-tool",
    productName: "Custom tool",
    name: "Test Customer",
    email: "customer@example.com",
    studio: "Test Studio",
    notes: "Test request",
    specs: { width: "80 mm" },
    estimate: 120,
    files: ["sketch.png"],
    ...overrides,
  };
}

test("loadRequests is safe during server rendering", () => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  Reflect.deleteProperty(globalThis, "window");
  try {
    assert.deepEqual(loadRequests(), []);
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
  }
});

test("saveRequest persists attachment data for a later resend", () =>
  withBrowserStorage(() => {
    const item = request({
      attachments: [
        { filename: "sketch.png", contentType: "image/png", content: "aGVsbG8=" },
      ],
    });
    const saved = saveRequest(item);
    assert.equal(saved.length, 1);
    assert.deepEqual(loadRequests()[0].attachments, item.attachments);
    assert.equal(loadRequests()[0].attachmentsOmitted, undefined);
  }));

test("saveRequest preserves the request and flags attachments when storage quota is exceeded", () =>
  withBrowserStorage(
    () => {
      const saved = saveRequest(
        request({
          attachments: [
            { filename: "large-model.stl", contentType: "model/stl", content: "c2FtcGxl" },
          ],
        }),
      );
      assert.equal(saved.length, 1);
      assert.equal(saved[0].attachments, undefined);
      assert.equal(saved[0].attachmentsOmitted, true);
      assert.equal(loadRequests()[0].attachmentsOmitted, true);
      assert.deepEqual(loadRequests()[0].files, ["sketch.png"]);
    },
    { rejectAttachmentWrites: true },
  ));

test("undeliveredRequests keeps requests until both studio and receipt sends succeed", () => {
  const pending = request();
  const studioFailed = request({
    id: "CL-TEST-002",
    delivery: { studioOk: false, receiptOk: true, at: "2026-11-25T12:01:00.000Z" },
  });
  const receiptFailed = request({
    id: "CL-TEST-003",
    delivery: { studioOk: true, receiptOk: false, at: "2026-11-25T12:02:00.000Z" },
  });
  const delivered = request({
    id: "CL-TEST-004",
    delivery: { studioOk: true, receiptOk: true, at: "2026-11-25T12:03:00.000Z" },
  });

  assert.deepEqual(
    undeliveredRequests([pending, studioFailed, receiptFailed, delivered]).map((item) => item.id),
    ["CL-TEST-001", "CL-TEST-002", "CL-TEST-003"],
  );
});

test("updateRequest records delivery state and removeRequest clears the local record", () =>
  withBrowserStorage(() => {
    saveRequest(request());
    const updated = updateRequest("CL-TEST-001", {
      delivery: {
        studioOk: true,
        receiptOk: true,
        at: "2026-11-25T12:04:00.000Z",
      },
      attachments: undefined,
    });
    assert.equal(undeliveredRequests(updated).length, 0);
    assert.equal(loadRequests()[0].delivery?.studioOk, true);
    assert.deepEqual(removeRequest("CL-TEST-001"), []);
    assert.deepEqual(loadRequests(), []);
  }));
