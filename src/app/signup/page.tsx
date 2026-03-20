"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "./actions";

const initialState = { error: "" };

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, initialState);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="mt-2 text-sm text-zinc-400">Start learning today</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition"
              placeholder="Min. 8 characters"
            />
          </div>

          {state.error && (
            <p className="text-sm text-red-400">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {pending ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="text-zinc-300 hover:text-white transition">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
