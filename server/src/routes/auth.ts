import express from "express";
import passport from "../config/passport";
import { getRepoCommits } from "../github/githubService";

const router = express.Router();

// 🔐 GitHub login
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user", "repo"] })
);

// 🔁 GitHub callback
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  async (req, res) => {
    try {
      const { accessToken } = req.user as any;

      const CLIENT_URL = process.env.CLIENT_URL;

      // ❌ No fallback — force correct config
      if (!CLIENT_URL) {
        console.error("❌ CLIENT_URL is not set");
        return res.status(500).send("Server configuration error");
      }

      console.log("✅ Redirecting to:", CLIENT_URL);

      res.redirect(`${CLIENT_URL}/dashboard?token=${accessToken}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Auth failed" });
    }
  }
);

// 📊 Commits API
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