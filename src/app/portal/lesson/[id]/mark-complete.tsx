"use client";

import { useState } from "react";

export function MarkCompleteButton({ lessonId }: { lessonId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleClick() {
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, action: "complete" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong.");
      }

      window.location.reload();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleClick}
        disabled={status === "loading"}
        className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {status === "loading" ? "Saving…" : "Mark as Complete"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400">{errorMsg}</p>
      )}
    </div>
  );
}
