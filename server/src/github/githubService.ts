import axios from "axios";

export const getUserData = async (accessToken: string) => {
  const res = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data;
};

export const getUserRepos = async (accessToken: string) => {
  const res = await axios.get("https://api.github.com/user/repos", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data;
};