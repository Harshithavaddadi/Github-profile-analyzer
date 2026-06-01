const axios = require("axios");
const db = require("../config/db");

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
    const createdDate = new Date(user.created_at);
    const today = new Date();
    const accountAge =
      today.getFullYear() -
      createdDate.getFullYear() -
      (today < new Date(createdDate.setFullYear(today.getFullYear()))
        ? 1
        : 0);

    const popularityScore =
      (user.followers || 0) + (user.public_repos || 0) * 2;

    const profileData = {
      username: user.login,
      name: user.name,
      bio: user.bio,
      publicRepos: user.public_repos,
      repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      company: user.company,
      location: user.location,
      githubUrl: user.html_url,
      accountAge,
      popularityScore,
    };

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

    await db.execute(sql, [
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
    ]);

    res.json({
      success: true,
      message: "Profile analyzed and stored successfully",
      data: profileData,
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.message,
      });
    }

    res.status(500).json({ error: error.message });
  }
};

const getProfiles = async (req, res) => {
  try {
    const [profiles] = await db.execute(
      "SELECT * FROM profiles ORDER BY analyzed_at DESC"
    );
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const [profiles] = await db.execute(
      "SELECT * FROM profiles WHERE username = ?",
      [req.params.username]
    );

    if (!profiles.length) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(profiles[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  analyzeProfile,
  getProfiles,
  getProfile,
};
