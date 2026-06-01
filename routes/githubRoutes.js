const express = require("express");
const router = express.Router();
const githubController = require("../controllers/githubController");

if (
  !githubController.analyzeProfile ||
  !githubController.getProfiles ||
  !githubController.getProfile
) {
  throw new Error("Controller functions not exported correctly");
}

router.get("/analyze/:username", githubController.analyzeProfile);
router.get("/profiles", githubController.getProfiles);
router.get("/profile/:username", githubController.getProfile);

module.exports = router;
