import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);

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
      } catch (error) {
        console.error("Error fetching GitHub data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      {user && (
        <div style={{ marginBottom: "20px" }}>
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

      <h2>Repositories</h2>

      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            {repo.name} ⭐ {repo.stargazers_count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;