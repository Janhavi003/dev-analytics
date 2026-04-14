const Landing = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10">
            <span className="text-sm font-semibold tracking-tight">DA</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">
              Dev Analytics
            </div>
            <div className="text-xs text-white/60">
              GitHub driven developer insights
            </div>
          </div>
        </div>

        <a
          href="/login"
          className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-black/20 ring-1 ring-white/10 transition hover:bg-white/90"
        >
          Sign in
        </a>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Private by default, uses your token in session
            </div>

            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Turn your GitHub activity into clean, readable insights.
            </h1>

            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/70">
              Visualize commit trends, language breakdown, and highlight signals
              like top repos and activity patterns — in a dashboard that looks
              like a product, not a prototype.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm shadow-emerald-400/20 transition hover:bg-emerald-300"
              >
                Continue with GitHub
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-white/5 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/10"
              >
                Open dashboard
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-sm font-semibold">Language mix</div>
                <div className="mt-1 text-xs text-white/60">
                  Visual breakdown across repos
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-sm font-semibold">Commit activity</div>
                <div className="mt-1 text-xs text-white/60">
                  Spot trends over time
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-sm font-semibold">Highlights</div>
                <div className="mt-1 text-xs text-white/60">
                  Top repos, active day, and more
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-4xl bg-linear-to-r from-emerald-400/20 via-sky-400/10 to-fuchsia-400/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-4xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Dashboard preview</div>
                  <div className="mt-1 text-xs text-white/60">
                    Responsive charts and cards
                  </div>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
                  Live
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-slate-950/30 p-4 ring-1 ring-white/10"
                  >
                    <div className="h-3 w-24 rounded bg-white/20" />
                    <div className="mt-3 h-6 w-16 rounded bg-white/15" />
                    <div className="mt-3 h-2 w-32 rounded bg-white/10" />
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-2xl bg-slate-950/30 p-4 ring-1 ring-white/10">
                <div className="h-3 w-32 rounded bg-white/20" />
                <div className="mt-4 h-32 w-full rounded-xl bg-linear-to-r from-white/5 via-white/10 to-white/5" />
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-16 border-t border-white/10 pt-8 text-sm text-white/50">
          © {new Date().getFullYear()} Dev Analytics
        </footer>
      </main>
    </div>
  );
};

export default Landing;
