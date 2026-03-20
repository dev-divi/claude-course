"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function signupAction(
  _prev: { error: string },
  formData: FormData
) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  // Validation
  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await hash(password, 12);

  const user = await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      contactMethod: "email",
      role: "student",
    },
  });

  const session = await getSession();
  session.userId = user.id;
  session.role = user.role;
  await session.save();

  redirect("/portal");
}
