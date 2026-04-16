import express from "express";
import passport from "../config/passport";
import {
  getUserData,
  getUserRepos,
  getRepoCommits,
} from "../github/githubService";

const router = express.Router();

// GitHub login
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user", "repo"] })
);

// Callback
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  async (req, res) => {
    try {
      const { accessToken } = req.user as any;

      // redirect to frontend with token
      res.redirect(`https://github-dev-analytics.vercel.app/dashboard?token=${accessToken}`);
    } catch (error) {
      res.status(500).json({ error: "Auth failed" });
    }
  }
);

// 🔥 NEW: Commits route
router.get("/commits", async (req, res) => {
  try {
    const { token, owner, repo } = req.query as any;

    const commits = await getRepoCommits(token, owner, repo);

    res.json(commits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch commits" });
  }
});

export default router;