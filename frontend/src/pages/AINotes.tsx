import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../Components/Sidebar";
import DotGrid from "../Components/DotGrid";
import { useSidebar } from "../hooks/useSidebar";

type GeneratedNote = {
  id: string;
  title: string;
  content: string | null;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  quality: "SIMPLE" | "BALANCED" | "DETAILED";
  createdAt: string;
};

export default function AINotes() {
  const { collapsed } = useSidebar();

  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<"SIMPLE" | "BALANCED" | "DETAILED">(
    "BALANCED"
  );
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState<GeneratedNote[]>([]);
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<GeneratedNote | null>(null);

  const backend = useMemo(
    () => import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001",
    []
  );

  const fetchList = useCallback(async () => {
    const res = await fetch(`${backend}/api/ainotes`, {
      credentials: "include",
    });
    if (!res.ok) return;
    const data = (await res.json()) as GeneratedNote[];
    setNotes(data);
  }, [backend]);

  const poll = useCallback(
    async (id: string) => {
      const res = await fetch(`${backend}/api/ainotes/${id}`, {
        credentials: "include",
      });
      if (!res.ok) return;
      const item = (await res.json()) as GeneratedNote;
      setNotes((prev) => prev.map((n) => (n.id === id ? item : n)));
      if (item.status === "PROCESSING" || item.status === "QUEUED") {
        setTimeout(() => poll(id), 1500);
      } else {
        setCreatingId(null);
      }
    },
    [backend]
  );

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("quality", quality.toLowerCase());
    if (title.trim()) form.append("title", title.trim());
    const res = await fetch(`${backend}/api/ainotes`, {
      method: "POST",
      credentials: "include",
      body: form,
    });
    if (!res.ok) return;
    const { id } = (await res.json()) as { id: string };
    setCreatingId(id);
    await fetchList();
    poll(id);
  }

  const [deleteTarget, setDeleteTarget] = useState<GeneratedNote | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const performDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await fetch(`${backend}/api/ainotes/${deleteTarget.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setIsDeleting(false);
    if (!res.ok) return;
    setNotes((prev) => prev.filter((n) => n.id !== deleteTarget.id));
    if (activeNote?.id === deleteTarget.id) setActiveNote(null);
    setDeleteTarget(null);
  }, [backend, deleteTarget, activeNote?.id]);

  return (
    <div className="min-h-screen h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-neutral-900 dark:to-neutral-950 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 min-h-screen h-full w-full opacity-60 z-0">
        <DotGrid
          dotSize={3}
          gap={24}
          baseColor="#312e81"
          activeColor="#6366f1"
          proximity={80}
        />
      </div>
      <div className="flex min-h-screen h-full">
        <Sidebar />
        <div
          className={`flex-1 min-h-screen h-full overflow-auto p-6 transition-all duration-500 delay-100 relative z-10 ${
            collapsed ? "md:ml-20" : "md:ml-72"
          }`}
        >
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="order-1 md:order-1 md:col-span-1">
              <div className="bg-white dark:bg-neutral-900 dark:text-gray-100 rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-semibold mb-4">AI Notes</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">PDF file</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="block w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Title (optional)
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Quality</label>
                    <div className="flex gap-2">
                      {["SIMPLE", "BALANCED", "DETAILED"].map((q) => (
                        <label
                          key={q}
                          className={`px-3 py-1.5 rounded-md border cursor-pointer ${
                            quality === q
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="quality"
                            className="hidden"
                            checked={
                              quality ===
                              (q as "SIMPLE" | "BALANCED" | "DETAILED")
                            }
                            onChange={() =>
                              setQuality(
                                q as "SIMPLE" | "BALANCED" | "DETAILED"
                              )
                            }
                          />
                          {q}
                        </label>
                      ))}
                    </div>
                  </div>
                  <button
                    disabled={!file || !!creatingId}
                    className="w-full rounded-lg bg-blue-600 text-white py-2.5 font-semibold disabled:opacity-60"
                  >
                    {creatingId ? "Processing..." : "Generate Notes"}
                  </button>
                </form>
              </div>
            </div>

            <div className="order-2 md:order-2 md:col-span-2">
              <div className="bg-white dark:bg-neutral-900 dark:text-gray-100 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold mb-3">My AI Notes</h3>
                <div className="space-y-4">
                  {notes.map((n) => (
                    <div
                      key={n.id}
                      className="rounded-lg border border-gray-200 dark:border-neutral-700 p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold truncate mr-3">
                          {n.title}
                        </div>
                        <div className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-neutral-800">
                          {n.quality} · {n.status}
                        </div>
                      </div>
                      <div className="text-sm whitespace-pre-wrap">
                        {n.content
                          ? n.content.slice(0, 800) +
                            (n.content.length > 800 ? "\u2026" : "")
                          : n.status === "FAILED"
                          ? "Failed to generate notes."
                          : "Processing..."}
                      </div>
                      <div className="mt-3 flex justify-end">
                        <div className="flex items-center gap-2">
                          <button
                            className="rounded-md border border-gray-300 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800"
                            onClick={() => setActiveNote(n)}
                            disabled={!n.content}
                            title={
                              !n.content ? "Notes not ready yet" : undefined
                            }
                          >
                            View full note
                          </button>
                          <button
                            className="rounded-md border border-red-300 text-red-700 dark:border-red-600 dark:text-red-400 px-3 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/30"
                            onClick={() => setDeleteTarget(n)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {notes.length === 0 && (
                    <div className="text-sm opacity-70">
                      No AI notes yet. Upload a PDF to get started.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeNote && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setActiveNote(null)}
          />
          <div className="relative z-10 w-full max-w-3xl max-h-[85vh] rounded-xl border border-white/15 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold truncate max-w-[60vw]">
                  {activeNote.title}
                </h4>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-neutral-800">
                  {activeNote.quality} · {activeNote.status}
                </span>
              </div>
              <button
                className="rounded-md border border-gray-300 dark:border-neutral-700 px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800"
                onClick={() => setActiveNote(null)}
                aria-label="Close"
              >
                Close
              </button>
            </div>
            <div
              className="px-4 py-4 overflow-y-auto"
              style={{ maxHeight: "calc(85vh - 48px)" }}
            >
              <div className="whitespace-pre-wrap text-sm">
                {activeNote.content || "No content available."}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="rounded-md border border-red-300 text-red-700 dark:border-red-600 dark:text-red-400 px-3 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/30"
                  onClick={() => setDeleteTarget(activeNote)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-white/15 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-2xl">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-neutral-800 font-semibold">
              Delete AI Note
            </div>
            <div className="px-5 py-4 text-sm">
              Are you sure you want to permanently delete
              <span className="font-medium"> {deleteTarget.title}</span>?
            </div>
            <div className="px-5 py-4 flex items-center justify-end gap-2 border-t border-gray-200 dark:border-neutral-800">
              <button
                className="rounded-md border border-gray-300 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="rounded-md border border-red-300 text-red-700 dark:border-red-600 dark:text-red-400 px-3 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-60"
                onClick={performDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
