import { useEffect, useState } from "react";
import axios from "axios";
import LanguageChart from "../components/LanguageChart";
import CommitChart from "../components/CommitChart";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [commitData, setCommitData] = useState<any[]>([]);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        // 👤 User
        const userRes = await axios.get("https://api.github.com/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 📦 Repos
        const repoRes = await axios.get(
          "https://api.github.com/user/repos",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(userRes.data);
        setRepos(repoRes.data);

        // 🔥 MULTI-REPO COMMITS (top 5 repos)
        const selectedRepos = repoRes.data.slice(0, 5);
        let allCommits: any[] = [];

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
          } catch (err) {
            console.log("Skipping repo:", repo.name);
          }
        }

        setCommitData(processCommits(allCommits));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 📊 Language breakdown
  const getLanguageData = (repos: any[]) => {
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
  const processCommits = (commits: any[]) => {
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

  // 🧠 Insights
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

  const getWeekendCoding = () => {
    let weekend = 0;
    let weekday = 0;

    commitData.forEach((d) => {
      const day = new Date(d.date).getDay();
      if (day === 0 || day === 6) weekend += d.count;
      else weekday += d.count;
    });

    return weekend > weekday
      ? "Weekend Coder 🧘"
      : "Weekday Warrior 💼";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">
        🚀 Developer Analytics Dashboard
      </h1>

      {/* 👤 User Card */}
      {user && (
        <div className="bg-white p-4 rounded-2xl shadow mb-6 flex items-center gap-4">
          <img
            src={user.avatar_url}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">@{user.login}</p>
          </div>
        </div>
      )}

      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Repos</p>
          <h2 className="text-xl font-bold">{repos.length}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Top Language</p>
          <h2 className="text-xl font-bold">{getTopLanguage()}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Top Repo</p>
          <h2 className="text-sm font-bold">
            {getTopRepo()?.name || "N/A"}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Active Day</p>
          <h2 className="text-sm font-bold">
            {getMostActiveDay()}
          </h2>
        </div>
      </div>

      {/* 📊 Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">📊 Language Breakdown</h2>
          <LanguageChart data={getLanguageData(repos)} />
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">📈 Commit Activity</h2>
          <CommitChart data={commitData} />
        </div>
      </div>

      {/* 🧠 Insights */}
      <div className="bg-white p-4 rounded-2xl shadow mt-6">
        <h2 className="font-semibold mb-2">🧠 Developer Insights</h2>
        <ul className="list-disc pl-5">
          <li>
            ⭐ Top Repo: <strong>{getTopRepo()?.name || "N/A"}</strong>
          </li>
          <li>
            💻 Favorite Language: <strong>{getTopLanguage()}</strong>
          </li>
          <li>
            📅 Most Active Day: <strong>{getMostActiveDay()}</strong>
          </li>
          <li>
            ⚡ Coding Style: <strong>{getWeekendCoding()}</strong>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;