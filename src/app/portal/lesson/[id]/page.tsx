import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CompleteButton } from "./complete-button";
import { LessonContent } from "./lesson-content";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  const lesson = await db.lesson.findUnique({
    where: { id },
    include: { module: true },
  });

  if (!lesson) notFound();

  // Auto-start: upsert progress record with startedAt if not already tracking
  const progress = await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user!.id, lessonId: id } },
    update: {},
    create: {
      userId: user!.id,
      lessonId: id,
      status: "not_started",
      startedAt: new Date(),
    },
  });

  const isCompleted = progress.status === "completed";

  // Find next lesson in this module by order
  const nextLesson = await db.lesson.findFirst({
    where: {
      moduleId: lesson.moduleId,
      order: { gt: lesson.order },
    },
    orderBy: { order: "asc" },
    select: { id: true, title: true },
  });

  return (
    <div className="max-w-2xl">
      {/* Back */}
      <Link
        href={`/portal/module/${lesson.moduleId}`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition mb-8"
      >
        ← {lesson.module.title}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">
            {lesson.module.title}
          </span>
          <span className="text-zinc-700">·</span>
          <span className="text-xs text-zinc-500">{lesson.readTime} min read</span>
          {isCompleted && (
            <>
              <span className="text-zinc-700">·</span>
              <span className="text-xs text-emerald-500 font-medium">Completed</span>
            </>
          )}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
        <p className="mt-2 text-zinc-400">{lesson.subtitle}</p>
      </div>

      {/* Content */}
      <div className="mb-12">
        <LessonContent content={lesson.content} />
      </div>

      {/* Footer actions */}
      <div className="border-t border-zinc-800 pt-8 flex items-center justify-between">
        <div>
          {!isCompleted ? (
            <CompleteButton lessonId={lesson.id} moduleId={lesson.moduleId} />
          ) : (
            <div className="flex items-center gap-2 text-sm text-emerald-500">
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8l4 4 6-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Lesson completed
            </div>
          )}
        </div>

        {nextLesson ? (
          <Link
            href={`/portal/lesson/${nextLesson.id}`}
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            Next: {nextLesson.title} →
          </Link>
        ) : (
          <Link
            href={`/portal/module/${lesson.moduleId}`}
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            Back to module →
          </Link>
        )}
      </div>
    </div>
  );
}
