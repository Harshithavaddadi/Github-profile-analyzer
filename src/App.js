import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeProfile = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`/api/analyze/${username.trim()}`);
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
        <h1 style={styles.title}>GitHub Profile Analyzer</h1>

        <div style={styles.row}>
          <input
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyzeProfile()}
            style={styles.input}
          />

          <button onClick={analyzeProfile} style={styles.button}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {data && (
          <div style={styles.result}>
            <h2 style={styles.username}>{data.username}</h2>

            <div style={styles.grid}>
              <div style={styles.box}>
                <span style={styles.label}>Name</span>
                <span>{data.name || "Not Available"}</span>
              </div>

              <div style={styles.box}>
                <span style={styles.label}>Followers</span>
                <span>{data.followers}</span>
              </div>

              <div style={styles.box}>
                <span style={styles.label}>Repositories</span>
                <span>{data.repos}</span>
              </div>

              <div style={styles.box}>
                <span style={styles.label}>Following</span>
                <span>{data.following}</span>
              </div>

              <div style={styles.box}>
                <span style={styles.label}>Account Age</span>
                <span>{data.accountAge} years</span>
              </div>

              <div
                style={{
                  ...styles.score,
                  background:
                    data.popularityScore > 100 ? "#22c55e" : "#f59e0b",
                }}
              >
                <span style={styles.label}>Popularity Score</span>
                <span>{data.popularityScore} / 1000</span>
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
    padding: "20px",
  },
  card: {
    width: "90%",
    maxWidth: "620px",
    background: "#1e293b",
    padding: "30px",
    borderRadius: "8px",
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
    borderRadius: "6px",
    border: "none",
  },
  button: {
    padding: "10px 15px",
    borderRadius: "6px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
  },
  error: {
    color: "#f87171",
    marginTop: "10px",
  },
  result: {
    marginTop: "20px",
  },
  username: {
    marginBottom: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginTop: "10px",
  },
  box: {
    background: "#334155",
    padding: "12px",
    borderRadius: "6px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    color: "#cbd5e1",
    textTransform: "uppercase",
  },
  score: {
    gridColumn: "span 2",
    padding: "12px",
    borderRadius: "6px",
    fontWeight: "bold",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
};

export default App;
