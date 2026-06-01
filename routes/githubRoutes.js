const express = require("express");
const router = express.Router();

// ✅ FIX: import controller correctly
const githubController = require("../controllers/githubController");

// ✅ SAFETY CHECK (prevents crash)
if (
  !githubController.analyzeProfile ||
  !githubController.getProfiles ||
  !githubController.getProfile
) {
  throw new Error("Controller functions not exported correctly");
}

// ROUTES
router.get("/analyze/:username", githubController.analyzeProfile);
router.get("/profiles", githubController.getProfiles);
router.get("/profile/:username", githubController.getProfile);

module.exports = router;