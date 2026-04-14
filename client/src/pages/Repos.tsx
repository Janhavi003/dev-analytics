import { useEffect, useMemo, useState } from "react";
import axios from "axios";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  private: boolean;
}

type SortKey = "stars" | "updated" | "name";

const Repos = () => {
  const token = useMemo(
    () => new URLSearchParams(window.location.search).get("token"),
    []
  );

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updated");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchRepos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const perPage = 100;
        let page = 1;
        let all: GitHubRepo[] = [];

        while (true) {
          const res = await axios.get<GitHubRepo[]>(
            "https://api.github.com/user/repos",
            {
              headers: { Authorization: `Bearer ${token}` },
              params: { per_page: perPage, page, sort: "updated" },
            }
          );

          all = all.concat(res.data);
          if (res.data.length < perPage) break;
          page += 1;
        }

        setRepos(all);
      } catch {
        setError("Could not load repositories. Please reconnect GitHub.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, [token]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? repos.filter((r) => {
          const hay = `${r.full_name} ${r.description ?? ""} ${
            r.language ?? ""
          }`.toLowerCase();
          return hay.includes(q);
        })
      : repos;

    const sorted = [...base].sort((a, b) => {
      if (sortKey === "stars") return b.stargazers_count - a.stargazers_count;
      if (sortKey === "name") return a.full_name.localeCompare(b.full_name);
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });

    return sorted;
  }, [query, repos, sortKey]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm text-slate-400">Dev Analytics</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Repositories
            </h1>
            <div className="mt-2 text-sm text-slate-400">
              {token ? (
                <>
                  Showing <span className="font-semibold text-slate-200">{filtered.length}</span>{" "}
                  of <span className="font-semibold text-slate-200">{repos.length}</span>
                </>
              ) : (
                <>Connect GitHub to view your repositories.</>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={token ? `/dashboard?token=${encodeURIComponent(token)}` : "/dashboard"}
              className="inline-flex items-center justify-center rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              Back to dashboard
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-emerald-400/15 transition hover:bg-emerald-300"
            >
              Connect GitHub
            </a>
          </div>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl bg-rose-500/10 p-5 ring-1 ring-rose-400/20">
            <div className="text-sm font-semibold text-rose-200">Error</div>
            <div className="mt-1 text-sm text-rose-100/80">{error}</div>
          </div>
        )}

        {!token && (
          <div className="mt-8 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="text-base font-semibold">No token found</div>
            <div className="mt-2 max-w-2xl text-sm text-slate-400">
              Open this page from the dashboard card so it includes{" "}
              <span className="font-mono">?token=...</span> in the URL.
            </div>
          </div>
        )}

        {token && (
          <>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-slate-400">
                  Search
                </label>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, language, or description"
                  className="mt-2 w-full rounded-xl bg-slate-950/40 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 placeholder:text-slate-500 outline-none transition focus:ring-2 focus:ring-emerald-400/40"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400">Sort</label>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="mt-2 w-full rounded-xl bg-slate-950/40 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 outline-none transition focus:ring-2 focus:ring-emerald-400/40"
                >
                  <option value="updated">Recently updated</option>
                  <option value="stars">Most stars</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-white/5 ring-1 ring-white/10">
              {isLoading ? (
                <div className="p-6 text-sm text-slate-400">Loading repositories…</div>
              ) : filtered.length === 0 ? (
                <div className="p-6 text-sm text-slate-400">
                  No repositories match your search.
                </div>
              ) : (
                <ul className="divide-y divide-white/10">
                  {filtered.map((r) => (
                    <li key={r.id} className="p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <a
                              href={r.html_url}
                              target="_blank"
                              rel="noreferrer"
                              className="truncate text-sm font-semibold text-slate-100 hover:underline"
                            >
                              {r.full_name}
                            </a>
                            {r.private && (
                              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-slate-200 ring-1 ring-white/10">
                                Private
                              </span>
                            )}
                            {r.language && (
                              <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[11px] font-medium text-emerald-200 ring-1 ring-emerald-400/20">
                                {r.language}
                              </span>
                            )}
                          </div>
                          {r.description && (
                            <div className="mt-1 line-clamp-2 text-sm text-slate-400">
                              {r.description}
                            </div>
                          )}
                          <div className="mt-3 text-xs text-slate-500">
                            Updated {new Date(r.updated_at).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2 text-xs text-slate-300">
                          <div className="rounded-xl bg-slate-950/40 px-3 py-2 ring-1 ring-white/10">
                            <div className="text-slate-400">Stars</div>
                            <div className="mt-1 font-semibold text-slate-100">
                              {r.stargazers_count}
                            </div>
                          </div>
                          <div className="rounded-xl bg-slate-950/40 px-3 py-2 ring-1 ring-white/10">
                            <div className="text-slate-400">Forks</div>
                            <div className="mt-1 font-semibold text-slate-100">
                              {r.forks_count}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Repos;

