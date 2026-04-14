import { useEffect, useState } from "react";
import axios from "axios";
import LanguageChart from "../components/LanguageChart";
import CommitChart from "../components/CommitChart";

interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  // Add other fields as needed
}

interface GitHubRepo {
  name: string;
  owner: { login: string };
  language: string | null;
  stargazers_count: number;
}

interface Commit {
  commit: {
    author: {
      date: string;
    };
  };
}

interface ProcessedCommit {
  date: string;
  count: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [commitData, setCommitData] = useState<ProcessedCommit[]>([]);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) return;
    setHasToken(true);

    const fetchData = async () => {
      try {
        const userRes = await axios.get("https://api.github.com/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const repoRes = await axios.get(
          "https://api.github.com/user/repos",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(userRes.data);
        setRepos(repoRes.data);

        // 🔥 Multi-repo commits
        const selectedRepos = repoRes.data.slice(0, 5);
        let allCommits: Commit[] = [];

        for (const repo of selectedRepos) {
          try {
            const res = await axios.get(
              "http://localhost:5000/auth/commits",
              {
                params: {
                  token,
                  owner: repo.owner.login,
                  repo: repo.name,
                },
              }
            );

            allCommits = [...allCommits, ...res.data];
          } catch {
            console.log("Skipping repo:", repo.name);
          }
        }

        setCommitData(processCommits(allCommits));
      } catch {
        console.error("Error fetching data");
      }
    };

    fetchData();
  }, []);

  // 📊 Language breakdown
  const getLanguageData = (repos: GitHubRepo[]) => {
    const map: Record<string, number> = {};
    repos.forEach((r) => {
      if (r.language) {
        map[r.language] = (map[r.language] || 0) + 1;
      }
    });

    return Object.keys(map).map((key) => ({
      name: key,
      value: map[key],
    }));
  };

  // 📈 Commit processing
  const processCommits = (commits: Commit[]) => {
    const map: Record<string, number> = {};
    commits.forEach((c) => {
      const date = c.commit.author.date.split("T")[0];
      map[date] = (map[date] || 0) + 1;
    });

    return Object.keys(map).map((date) => ({
      date,
      count: map[date],
    }));
  };

  // 🧠 Basic insights
  const getTopRepo = () => {
    if (!repos.length) return null;
    return repos.reduce((a, b) =>
      a.stargazers_count > b.stargazers_count ? a : b
    );
  };

  const getTopLanguage = () => {
    const data = getLanguageData(repos);
    if (!data.length) return "N/A";
    return data.reduce((a, b) => (a.value > b.value ? a : b)).name;
  };

  const getMostActiveDay = () => {
    if (!commitData.length) return "N/A";

    const map: Record<string, number> = {};
    commitData.forEach((d) => {
      const day = new Date(d.date).toLocaleDateString("en-US", {
        weekday: "long",
      });
      map[day] = (map[day] || 0) + d.count;
    });

    return Object.keys(map).reduce((a, b) =>
      map[a] > map[b] ? a : b
    );
  };

  // 🤖 AI Insights

  const getCodingTime = () => {
    if (!commitData.length) return "N/A";

    let morning = 0;
    let afternoon = 0;
    let night = 0;

    commitData.forEach((d) => {
      const hour = new Date(d.date).getHours();

      if (hour < 12) morning++;
      else if (hour < 18) afternoon++;
      else night++;
    });

    if (night > morning && night > afternoon) return "Evenings";
    if (morning > afternoon) return "Mornings";
    return "Afternoons";
  };

  const getConsistency = () => {
    if (!commitData.length) return "Low";

    const activeDays = commitData.length;

    if (activeDays > 20) return "Very consistent";
    if (activeDays > 10) return "Consistent";
    return "Getting started";
  };

  const getCodingFocus = () => {
    const frontendLangs = ["JavaScript", "TypeScript", "HTML", "CSS"];
    const backendLangs = ["Python", "Java", "Go"];

    let frontend = 0;
    let backend = 0;

    repos.forEach((repo) => {
      if (repo.language && frontendLangs.includes(repo.language)) frontend++;
      if (repo.language && backendLangs.includes(repo.language)) backend++;
    });

    if (frontend > backend) return "Frontend";
    if (backend > frontend) return "Backend";
    return "Full stack";
  };

  const getActivityLevel = () => {
    const total = commitData.reduce((sum, d) => sum + d.count, 0);

    if (total > 200) return "High";
    if (total > 50) return "Moderate";
    return "Low";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm text-slate-400">Dev Analytics</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Developer dashboard
            </h1>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              Home
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-emerald-400/15 transition hover:bg-emerald-300"
            >
              Connect GitHub
            </a>
          </div>
        </div>

      {/* User */}
      {user && (
        <div className="mt-8 flex items-center gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
          <img
            src={user.avatar_url}
            alt={`${user.login} avatar`}
            className="h-14 w-14 rounded-2xl ring-1 ring-white/10"
          />
          <div>
            <h2 className="text-lg font-semibold leading-tight">
              {user.name || user.login}
            </h2>
            <p className="text-sm text-slate-400">@{user.login}</p>
          </div>
        </div>
      )}

      {!hasToken && (
        <div className="mt-8 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-base font-semibold">Connect GitHub to begin</div>
          <div className="mt-2 max-w-2xl text-sm text-slate-400">
            Your dashboard URL needs a token query param from the GitHub OAuth
            flow. Use the button above to sign in.
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
          <div className="text-xs font-medium text-slate-400">Repositories</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">
            {repos.length}
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
          <div className="text-xs font-medium text-slate-400">Top language</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">
            {getTopLanguage()}
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
          <div className="text-xs font-medium text-slate-400">Top repo</div>
          <div className="mt-2 truncate text-base font-semibold tracking-tight">
            {getTopRepo()?.name || "N/A"}
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
          <div className="text-xs font-medium text-slate-400">Most active day</div>
          <div className="mt-2 text-base font-semibold tracking-tight">
            {getMostActiveDay()}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
          <h2 className="text-sm font-semibold text-slate-100">
            Language breakdown
          </h2>
          <div className="mt-1 text-xs text-slate-400">
            Based on primary language per repo
          </div>
          <LanguageChart data={getLanguageData(repos)} />
        </div>

        <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
          <h2 className="text-sm font-semibold text-slate-100">
            Commit activity
          </h2>
          <div className="mt-1 text-xs text-slate-400">
            Aggregated across selected repositories
          </div>
          <CommitChart data={commitData} />
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
        <h2 className="text-sm font-semibold text-slate-100">Insights</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-slate-950/40 p-4 ring-1 ring-white/10">
            <div className="text-xs font-medium text-slate-400">
              Preferred time
            </div>
            <div className="mt-2 text-base font-semibold">{getCodingTime()}</div>
          </div>
          <div className="rounded-xl bg-slate-950/40 p-4 ring-1 ring-white/10">
            <div className="text-xs font-medium text-slate-400">Consistency</div>
            <div className="mt-2 text-base font-semibold">
              {getConsistency()}
            </div>
          </div>
          <div className="rounded-xl bg-slate-950/40 p-4 ring-1 ring-white/10">
            <div className="text-xs font-medium text-slate-400">Focus</div>
            <div className="mt-2 text-base font-semibold">{getCodingFocus()}</div>
          </div>
          <div className="rounded-xl bg-slate-950/40 p-4 ring-1 ring-white/10">
            <div className="text-xs font-medium text-slate-400">
              Activity level
            </div>
            <div className="mt-2 text-base font-semibold">
              {getActivityLevel()}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;