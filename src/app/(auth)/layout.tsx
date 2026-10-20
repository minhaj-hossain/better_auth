import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden overflow-y-auto bg-slate-950 text-slate-100">
      {/* Background Decorative Gradients & Mesh */}
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-15" />
      
      {/* Glowing Ambient Blobs */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-[128px] animate-pulse-slow" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-600/20 blur-[140px] animate-pulse-slow" />
      <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[160px]" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between shrink-0">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
            <div className="h-full w-full rounded-[10px] bg-slate-950/80 flex items-center justify-center backdrop-blur-sm">
              <svg
                className="w-4.5 h-4.5 text-indigo-400 group-hover:text-indigo-300 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base sm:text-lg tracking-tight text-white group-hover:text-indigo-200 transition-colors">
              Auth<span className="text-indigo-400">Flow</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              v1.0
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Home
        </Link>
      </header>

      {/* Main Form Centerpiece */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-4 sm:py-8 my-auto">
        <div className="w-full max-w-[460px] animate-fade-in my-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-800/40 shrink-0">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>256-bit SSL encrypted connection</span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="#terms"
            className="hover:text-slate-300 transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="#privacy"
            className="hover:text-slate-300 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="#help"
            className="hover:text-slate-300 transition-colors"
          >
            Help Center
          </Link>
        </div>
      </footer>
    </div>
  );
}
