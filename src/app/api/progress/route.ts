import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (
    !body ||
    typeof body.lessonId !== "string" ||
    !["start", "complete"].includes(body.action)
  ) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { lessonId, action } = body as { lessonId: string; action: "start" | "complete" };

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, moduleId: true, title: true },
  });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  const userId = session.userId;
  const now = new Date();

  if (action === "start") {
    await db.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {},
      create: {
        userId,
        lessonId,
        status: "in_progress",
        startedAt: now,
      },
    });
  } else {
    await db.$transaction([
      db.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        update: { status: "completed", completedAt: now },
        create: {
          userId,
          lessonId,
          status: "completed",
          startedAt: now,
          completedAt: now,
        },
      }),
      db.behaviorEvent.create({
        data: {
          userId,
          eventType: "lesson_completed",
          metadata: {
            lessonId,
            lessonTitle: lesson.title,
            moduleId: lesson.moduleId,
          },
        },
      }),
    ]);
  }

  return NextResponse.json({ ok: true });
}
