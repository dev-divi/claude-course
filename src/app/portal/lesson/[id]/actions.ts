"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function markLessonComplete(lessonId: string, moduleId: string) {
  const session = await getSession();
  if (!session.userId) return;

  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.userId, lessonId } },
    update: { status: "completed", completedAt: new Date() },
    create: {
      userId: session.userId,
      lessonId,
      status: "completed",
      startedAt: new Date(),
      completedAt: new Date(),
    },
  });

  revalidatePath(`/portal/lesson/${lessonId}`);
  revalidatePath(`/portal/module/${moduleId}`);
  revalidatePath("/portal");
}
