const HomePage = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to LocalWay!</h1>
      <p>Discover local experiences, events, and places near you.</p>
      <button
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          background: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "1rem",
        }}
        onClick={() => alert("Explore coming soon!")}
      >
        Explore Now
      </button>
    </div>
  );
};

export default HomePage;
