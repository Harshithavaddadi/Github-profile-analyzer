import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeProfile = async () => {
    if (!username) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`/api/analyze/${username}`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Error fetching data");
      }

      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚀 GitHub Profile Analyzer</h1>

        <div style={styles.row}>
          <input
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <button onClick={analyzeProfile} style={styles.button}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {data && (
          <div style={styles.result}>
            <h2>{data.username}</h2>

            <div style={styles.grid}>
              <div style={styles.box}>
                👤 Name: {data.name || "Not Available"}
              </div>

              <div style={styles.box}>
                👥 Followers: {data.followers}
              </div>

              <div style={styles.box}>
                📦 Repos: {data.repos}
              </div>

              <div style={styles.box}>
                ➡️ Following: {data.following}
              </div>

              <div style={styles.box}>
                📅 Age: {data.accountAge} yrs
              </div>

              <div
                style={{
                  ...styles.score,
                  background:
                    data.popularityScore > 100 ? "#22c55e" : "#f59e0b",
                }}
              >
                ⭐ Popularity Score: {data.popularityScore} / 1000
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
  },
  card: {
    width: "90%",
    maxWidth: "600px",
    background: "#1e293b",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  row: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  input: {
    padding: "10px",
    width: "60%",
    borderRadius: "8px",
    border: "none",
  },
  button: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  result: {
    marginTop: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginTop: "10px",
  },
  box: {
    background: "#334155",
    padding: "10px",
    borderRadius: "8px",
  },
  score: {
    gridColumn: "span 2",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "bold",
  },
};

export default App;