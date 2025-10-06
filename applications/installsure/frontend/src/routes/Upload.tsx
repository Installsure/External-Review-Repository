import { useEffect, useRef, useState } from "react";

type Props = { apiBase?: string };
const MAX_SIZE = 200 * 1024 * 1024; // 200MB demo limit
const ACCEPT = ["image/", "application/pdf", "video/"];

export default function Upload({ apiBase = "http://localhost:8000" }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const onPick = (f: File | null) => {
    setError(null);
    if (!f) return setFile(null);
    if (f.size > MAX_SIZE) return setError("File too large (limit 200MB).");
    if (!ACCEPT.some((p) => f.type.startsWith(p))) return setError("Unsupported file type.");
    setFile(f);
  };

  const onUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setError(null);
    const form = new FormData();
    form.set("file", file, file.name);
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch(`${apiBase}/upload`, {
        method: "POST",
        body: form,
        signal: ac.signal,
      });

      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      setProgress(100);
    } catch (e: any) {
      if (e?.name !== "AbortError") setError(e?.message ?? "Upload failed.");
    } finally {
      setUploading(false);
      abortRef.current = null;
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Upload</h1>
      <input
        type="file"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        className="block"
      />
      {file && <div className="text-sm opacity-80">Selected: {file.name} ({(file.size/1024/1024).toFixed(1)} MB)</div>}
      {progress > 0 && <div className="text-sm">Progress: {progress}%</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="flex gap-2">
        <button
          disabled={!file || uploading}
          onClick={onUpload}
          className="px-4 py-2 rounded-xl shadow"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <button
          disabled={!uploading}
          onClick={() => abortRef.current?.abort()}
          className="px-4 py-2 rounded-xl shadow"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

