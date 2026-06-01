const axios = require("axios");
const db = require("../config/db");

// 🔥 ANALYZE GITHUB PROFILE
const analyzeProfile = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const response = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "GitHub-Profile-Analyzer",
        },
      }
    );

    const user = response.data;

    // Age calculation
    const createdDate = new Date(user.created_at);
    const today = new Date();
    const accountAge =
      today.getFullYear() -
      createdDate.getFullYear() -
      (today < new Date(createdDate.setFullYear(today.getFullYear()))
        ? 1
        : 0);

    // Score
    const popularityScore =
      (user.followers || 0) + (user.public_repos || 0) * 2;

    const sql = `
      INSERT INTO profiles (
        username,
        name,
        bio,
        public_repos,
        followers,
        following,
        company,
        location,
        github_url,
        account_age_years,
        popularity_score
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        bio = VALUES(bio),
        public_repos = VALUES(public_repos),
        followers = VALUES(followers),
        following = VALUES(following),
        company = VALUES(company),
        location = VALUES(location),
        github_url = VALUES(github_url),
        account_age_years = VALUES(account_age_years),
        popularity_score = VALUES(popularity_score)
    `;

    db.query(
      sql,
      [
        user.login,
        user.name,
        user.bio,
        user.public_repos,
        user.followers,
        user.following,
        user.company,
        user.location,
        user.html_url,
        accountAge,
        popularityScore,
      ],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({
          success: true,
          message: "Profile analyzed successfully",
          data: {
            username: user.login,
            name: user.name,
            followers: user.followers,
            repos: user.public_repos,
            following: user.following,
            popularityScore,
            accountAge,
          },
        });
      }
    );
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.message,
      });
    }

    res.status(500).json({ error: error.message });
  }
};

// 🔥 GET ALL PROFILES
const getProfiles = (req, res) => {
  db.query("SELECT * FROM profiles", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// 🔥 GET SINGLE PROFILE
const getProfile = (req, res) => {
  db.query(
    "SELECT * FROM profiles WHERE username = ?",
    [req.params.username],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result[0]);
    }
  );
};

// ✅ IMPORTANT EXPORT (THIS FIXES YOUR ERROR)
module.exports = {
  analyzeProfile,
  getProfiles,
  getProfile,
};