const mysql = require("mysql2");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

function buildPoolConfigFromDatabaseUrl(urlStr) {
  try {
    const url = new URL(urlStr);
    return {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname ? url.pathname.replace(/^\//, "") : undefined,
      port: url.port ? Number(url.port) : 3306,
    };
  } catch (err) {
    return null;
  }
}

// If DATABASE_URL is provided, use MySQL pool (hosted provider)
if (process.env.DATABASE_URL) {
  const poolCfg = buildPoolConfigFromDatabaseUrl(process.env.DATABASE_URL) || {};
  if (process.env.DB_SSL === "true") {
    poolCfg.ssl = { rejectUnauthorized: process.env.DB_SSL_REJECT === "true" };
  }
  const db = mysql.createPool(Object.assign(poolCfg, {
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }));

  module.exports = db.promise();
} else {
  // Fallback: use in-memory DB on Vercel (read-only filesystem) or local JSON file for local dev
  const isVercel = !!process.env.VERCEL;
  const DB_PATH = path.join(__dirname, "..", "database", "localdb.json");

  // Local file-backed DB (for development)
  function readDbFile() {
    try {
      if (!fs.existsSync(DB_PATH)) {
        return { profiles: [] };
      }
      const raw = fs.readFileSync(DB_PATH, "utf8");
      return JSON.parse(raw);
    } catch (err) {
      return { profiles: [] };
    }
  }

  function writeDbFile(obj) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(obj, null, 2));
    } catch (err) {
      // ignore write errors (e.g., read-only FS on serverless)
    }
  }

  // In-memory DB (fast, ephemeral) — required for serverless deployments where filesystem is read-only
  const inMemory = { profiles: [] };

  const jsonDb = {
    execute: async (sql, params) => {
      const normalized = sql.trim().toUpperCase();
      const dbObj = isVercel ? inMemory : readDbFile();
      const profiles = dbObj.profiles || [];

      if (normalized.startsWith("INSERT INTO PROFILES")) {
        const [username, name, bio, public_repos, followers, following, company, location, github_url, account_age_years, popularity_score] = params;
        const now = new Date().toISOString();
        const existingIdx = profiles.findIndex(p => p.username === username);
        const record = {
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
          popularity_score,
          analyzed_at: now,
        };

        if (existingIdx >= 0) {
          profiles[existingIdx] = Object.assign(profiles[existingIdx], record);
        } else {
          profiles.push(record);
        }

        dbObj.profiles = profiles;
        if (!isVercel) writeDbFile(dbObj);

        return [{ affectedRows: 1 }, undefined];
      }

      if (normalized.startsWith("SELECT * FROM PROFILES WHERE")) {
        const username = params && params[0];
        const found = profiles.filter(p => p.username === username);
        return [found, undefined];
      }

      if (normalized.startsWith("SELECT * FROM PROFILES")) {
        const rows = profiles.slice().sort((a, b) => {
          const ta = new Date(a.analyzed_at || 0).getTime();
          const tb = new Date(b.analyzed_at || 0).getTime();
          return tb - ta;
        });
        return [rows, undefined];
      }

      return [[], undefined];
    }
  };

  module.exports = jsonDb;
}
