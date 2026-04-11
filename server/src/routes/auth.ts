import express from "express";
import passport from "../config/passport";

const router = express.Router();

// Step 1: Redirect to GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user", "repo"] })
);

// Step 2: Callback
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

export default router;