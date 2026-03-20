"use client";

import { useTransition } from "react";
import { markLessonComplete } from "./actions";

export function CompleteButton({
  lessonId,
  moduleId,
}: {
  lessonId: string;
  moduleId: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(() => markLessonComplete(lessonId, moduleId))
      }
      disabled={pending}
      className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {pending ? "Saving…" : "Mark Complete"}
    </button>
  );
}
