import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { db } from "./db";

export type SessionData = {
  userId: string;
  role: string;
};

const sessionOptions = {
  cookieName: "session",
  password: process.env.SESSION_SECRET!,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session.userId) return null;

  return db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      contactMethod: true,
      createdAt: true,
    },
  });
}
