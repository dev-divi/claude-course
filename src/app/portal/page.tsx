import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function PortalPage() {
  const user = await getCurrentUser();

  const [modules, progressRecords] = await Promise.all([
    db.module.findMany({
      orderBy: { order: "asc" },
      include: {
        lessons: {
          orderBy: { order: "asc" },
          select: { id: true },
        },
      },
    }),
    db.lessonProgress.findMany({
      where: { userId: user!.id, status: "completed" },
      select: { lessonId: true },
    }),
  ]);

  const completedIds = new Set(progressRecords.map((p) => p.lessonId));
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalCompleted = completedIds.size;
  const overallPct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  const firstName = user!.name.split(" ")[0];

  return (
    <div>
      {/* Header */}
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {totalCompleted} of {totalLessons} lessons completed
          </p>
          <div className="mt-3 h-1.5 w-64 rounded-full bg-zinc-800">
            <div
              className="h-1.5 rounded-full bg-white transition-all"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
        <Link
          href="/portal/skills"
          className="text-sm text-zinc-400 hover:text-white transition"
        >
          Skills directory →
        </Link>
      </div>

      {/* Module cards */}
      <div className="grid gap-4">
        {modules.map((mod) => {
          const modCompleted = mod.lessons.filter((l) =>
            completedIds.has(l.id)
          ).length;
          const modTotal = mod.lessons.length;
          const modPct =
            modTotal > 0 ? Math.round((modCompleted / modTotal) * 100) : 0;

          return (
            <Link
              key={mod.id}
              href={`/portal/modules/${mod.id}`}
              className="group block rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:border-zinc-700 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-medium text-zinc-100 group-hover:text-white transition">
                    {mod.title}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                    {mod.description}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-zinc-500 mt-0.5">
                  {modTotal} {modTotal === 1 ? "lesson" : "lessons"}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-1 rounded-full bg-zinc-800">
                  <div
                    className="h-1 rounded-full bg-zinc-400 transition-all"
                    style={{ width: `${modPct}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-500">
                  {modCompleted}/{modTotal}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
