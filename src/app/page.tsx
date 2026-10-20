import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-slate-950 text-slate-100">
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-15" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[550px] rounded-full bg-indigo-600/15 blur-[150px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-violet-600/15 blur-[130px]" />

      {/* Nav */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
            <div className="h-full w-full rounded-[10px] bg-slate-950/80 flex items-center justify-center backdrop-blur-sm">
              <svg
                className="w-5 h-5 text-indigo-400"
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
          <span className="font-semibold text-lg tracking-tight text-white">
            Auth<span className="text-indigo-400">Flow</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-medium text-slate-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-16 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-300 mb-6 backdrop-blur-md">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Production-Ready Authentication Suite
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Modern, secure authentication <br />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            built for the future.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Streamlined authentication with real-time Zod validation, responsive ergonomics, accessible inputs, and seamless security.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/signup"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all hover:from-indigo-400 hover:to-violet-500 hover:scale-[1.02] active:scale-[0.99]"
          >
            Create an account
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:border-slate-700 hover:text-white"
          >
            Sign in to existing account
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left w-full max-w-2xl">
          <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-200">Zod 4 Validated</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Strict schema checks</p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-200">Accessible UI</p>
            <p className="text-[11px] text-slate-500 mt-0.5">WCAG AAA compliant</p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-200">Strength Meter</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Real-time entropy</p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-200">Fast & Responsive</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Turbopack optimized</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-600 border-t border-slate-800/40">
        AuthFlow &copy; 2026 - Professional Next.js Authentication
      </footer>
    </div>
  );
}
