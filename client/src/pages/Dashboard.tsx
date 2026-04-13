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

        if (repoRes.data.length > 0) {
          const firstRepo = repoRes.data[0];

          const commitRes = await axios.get(
            "http://localhost:5000/auth/commits",
            {
              params: {
                token,
                owner: firstRepo.owner.login,
                repo: firstRepo.name,
              },
            }
          );

          setCommitData(processCommits(commitRes.data));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const getLanguageData = (repos: any[]) => {
    const map: Record<string, number> = {};
    repos.forEach((r) => {
      if (r.language) map[r.language] = (map[r.language] || 0) + 1;
    });

    return Object.keys(map).map((key) => ({
      name: key,
      value: map[key],
    }));
  };

  const processCommits = (commits: any[]) => {
    const map: Record<string, number> = {};
    commits.forEach((c) => {
      const d = c.commit.author.date.split("T")[0];
      map[d] = (map[d] || 0) + 1;
    });

    return Object.keys(map).map((d) => ({
      date: d,
      count: map[d],
    }));
  };

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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">🚀 Developer Analytics</h1>

      {/* User Card */}
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

      {/* Stats Cards */}
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

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">📊 Languages</h2>
          <LanguageChart data={getLanguageData(repos)} />
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">📈 Commits</h2>
          <CommitChart data={commitData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;