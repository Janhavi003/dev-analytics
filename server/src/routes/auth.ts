import express from "express";
import passport from "../config/passport";
import { getUserData, getUserRepos } from "../github/githubService";

const router = express.Router();

// Redirect to GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user", "repo"] })
);

// Callback from GitHub
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  async (req, res) => {
    try {
      const { accessToken } = req.user as any;

      // Fetch data from GitHub
      const user = await getUserData(accessToken);
      const repos = await getUserRepos(accessToken);

      console.log("User:", user.login);
      console.log("Repos:", repos.length);

      // TEMP: redirect to frontend with token
      res.redirect(`http://localhost:5173/dashboard?token=${accessToken}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch GitHub data" });
    }
  }
);

export default router;