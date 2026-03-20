import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  const [mod, progressRecords] = await Promise.all([
    db.module.findUnique({
      where: { id },
      include: {
        lessons: { orderBy: { order: "asc" } },
      },
    }),
    db.lessonProgress.findMany({
      where: { userId: user!.id, status: "completed" },
      select: { lessonId: true },
    }),
  ]);

  if (!mod) notFound();

  const completedIds = new Set(progressRecords.map((p) => p.lessonId));
  const completed = mod.lessons.filter((l) => completedIds.has(l.id)).length;
  const total = mod.lessons.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <Link
        href="/portal"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition mb-8"
      >
        ← Back
      </Link>

      {/* Module header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{mod.title}</h1>
        <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
          {mod.description}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 w-48 rounded-full bg-zinc-800">
            <div
              className="h-1.5 rounded-full bg-white transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-zinc-500">
            {completed} of {total} completed
          </span>
        </div>
      </div>

      {/* Lesson list */}
      <div className="flex flex-col gap-2">
        {mod.lessons.map((lesson, index) => {
          const isCompleted = completedIds.has(lesson.id);
          return (
            <Link
              key={lesson.id}
              href={`/portal/lesson/${lesson.id}`}
              className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 hover:border-zinc-700 transition"
            >
              {/* Index / checkmark */}
              <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center border border-zinc-700 bg-zinc-800 group-hover:border-zinc-600 transition">
                {isCompleted ? (
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className="text-xs text-zinc-500">{index + 1}</span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-100 group-hover:text-white transition">
                  {lesson.title}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500 truncate">
                  {lesson.subtitle}
                </p>
              </div>

              {/* Read time */}
              <span className="shrink-0 text-xs text-zinc-600">
                {lesson.readTime} min
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
