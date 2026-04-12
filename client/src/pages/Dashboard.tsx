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
        // Fetch user
        const userRes = await axios.get("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch repos
        const repoRes = await axios.get(
          "https://api.github.com/user/repos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(userRes.data);
        setRepos(repoRes.data);

        // 🔥 Fetch commits for first repo
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
        console.error("Error fetching GitHub data", error);
      }
    };

    fetchData();
  }, []);

  // 📊 Language chart
  const getLanguageData = (repos: any[]) => {
    const langCount: Record<string, number> = {};

    repos.forEach((repo) => {
      if (repo.language) {
        langCount[repo.language] =
          (langCount[repo.language] || 0) + 1;
      }
    });

    return Object.keys(langCount).map((lang) => ({
      name: lang,
      value: langCount[lang],
    }));
  };

  // 📈 Commit processing
  const processCommits = (commits: any[]) => {
    const map: Record<string, number> = {};

    commits.forEach((commit) => {
      const date = commit.commit.author.date.split("T")[0];
      map[date] = (map[date] || 0) + 1;
    });

    return Object.keys(map).map((date) => ({
      date,
      count: map[date],
    }));
  };

  // 🧠 Insight
  const getTopRepo = () => {
    if (repos.length === 0) return null;

    return repos.reduce((prev, current) =>
      prev.stargazers_count > current.stargazers_count ? prev : current
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📊 Developer Dashboard</h1>

      {/* User */}
      {user && (
        <div style={{ marginBottom: "30px" }}>
          <img
            src={user.avatar_url}
            alt="avatar"
            width={80}
            style={{ borderRadius: "50%" }}
          />
          <h2>{user.name}</h2>
          <p>@{user.login}</p>
        </div>
      )}

      {/* Repos */}
      <h2>📦 Repositories</h2>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <strong>{repo.name}</strong> ⭐ {repo.stargazers_count}
          </li>
        ))}
      </ul>

      {/* Language */}
      <h2 style={{ marginTop: "40px" }}>📊 Language Breakdown</h2>
      <LanguageChart data={getLanguageData(repos)} />

      {/* Commits */}
      <h2 style={{ marginTop: "40px" }}>📈 Commit Activity</h2>
      <CommitChart data={commitData} />

      {/* Insights */}
      <h2 style={{ marginTop: "40px" }}>🧠 Insights</h2>
      <p>
        ⭐ Top Repo: <strong>{getTopRepo()?.name || "N/A"}</strong>
      </p>
    </div>
  );
};

export default Dashboard;