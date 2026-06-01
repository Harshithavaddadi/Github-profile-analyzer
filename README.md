# GitHub Profile Analyzer API

Backend service built with Node.js, Express.js, MySQL, and the GitHub public API. It analyzes a GitHub user's public profile, stores useful insights in MySQL, and exposes APIs to read stored profile analysis results.

## Live URLs

Frontend:

https://github-profile-analyzer-kappa.vercel.app

API base URL:

https://github-profile-analyzer-kappa.vercel.app/api

## Tech Stack

- Node.js
- Express.js
- MySQL
- GitHub Public API
- React frontend

## Features

- Fetch GitHub public profile details by username
- Store analysis results in MySQL
- Update an existing analyzed profile when the same username is analyzed again
- Fetch all stored profiles
- Fetch one stored profile by username
- Simple popularity score based on followers and public repositories

## API Endpoints

Analyze and store a GitHub profile:

```http
GET /api/analyze/:username
```

Example:

```http
GET /api/analyze/octocat
```

Fetch all stored profiles:

```http
GET /api/profiles
```

Fetch one stored profile:

```http
GET /api/profile/:username
```

Example:

```http
GET /api/profile/octocat
```

Health check:

```http
GET /health
```

## Database Setup

Import the schema:

```bash
mysql -u root -p < database/schema.sql
```

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=github_analyzer
DB_PORT=3306
```

For Vercel or any deployed server, these same variables must be added as production environment variables. The live API can store data only if the MySQL database is hosted online and reachable from Vercel.

## Local Setup

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm start
```

Run the React app locally:

```bash
npm run build
```

## Submission Notes

- Database schema/export is available at `database/schema.sql`.
- The API uses MySQL for persistent storage.
- A local MySQL database works for local testing.
- A hosted MySQL database is required for production deployment on Vercel.

Made by Harshitha Vaddadi.
