"use client";
import { useRef, useState, useEffect } from "react";

export default function FilesField({
  packRef,
}: { packRef?: React.MutableRefObject<(() => void) | null> }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  function uniq(list: File[]) {
    const seen = new Set<string>();
    const out: File[] = [];
    for (const f of list) {
      const key = `${f.name}:${f.size}:${f.lastModified}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(f);
      }
    }
    return out;
  }

  function add(list: FileList | File[]) {
    setFiles(prev => uniq([...prev, ...Array.from(list)]));
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) add(e.target.files);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files?.length) add(e.dataTransfer.files);
  }

  function removeAt(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (inputRef.current) inputRef.current.value = "";
  }

  function clearAll() {
    setFiles([]);
    if (inputRef.current) inputRef.current.value = "";
  }

  useEffect(() => {
    if (!packRef) return;
    packRef.current = () => {
      if (!inputRef.current) return;
      const dt = new DataTransfer();
      for (const f of files) dt.items.add(f);
      inputRef.current.files = dt.files;
    };
  }, [files, packRef]);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        name="files"
        multiple
        className="hidden"
        onChange={onInputChange}
      />

      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600"
      >
        <div className="flex items-center gap-3">
          <p className="mb-2">Drag & drop files here, or click to select</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border px-3 py-1.5"
          >
            Choose files
          </button>
          {files.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="ml-auto rounded-lg border px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
              aria-label="Clear all files"
              title="Clear all"
            >
              Clear all
            </button>
          )}
        </div>
        
        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {files.map((f, i) => (
              <li
                key={`${f.name}-${f.lastModified}-${f.size}-${i}`}
                className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2"
              >
                <span className="flex-1 truncate text-xs">
                  {f.name} <span className="text-slate-400">({f.size} bytes)</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="rounded-md border px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
                  aria-label={`Remove ${f.name}`}
                  title="Remove"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
