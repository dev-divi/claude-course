"use server";

import { compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function loginAction(
  _prev: { error: string },
  formData: FormData
) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Invalid email or password." };
  }

  const valid = await compare(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  const session = await getSession();
  session.userId = user.id;
  session.role = user.role;
  await session.save();

  redirect("/portal");
}
