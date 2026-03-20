import { redirect } from "next/navigation";
import { getCurrentUser, getSession } from "@/lib/auth";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  async function signOut() {
    "use server";
    const session = await getSession();
    session.destroy();
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-white">
            Claude Course
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">{user.name}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm text-zinc-400 hover:text-white transition"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}
