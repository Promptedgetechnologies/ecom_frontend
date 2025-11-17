import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

function SignInPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a name to continue.");
      return;
    }
    signIn(name);
    const from = location.state && location.state.from;
    navigate(from || "/account", { replace: true });
  };

  return (
    <div className="page-container" style={{ maxWidth: 420 }}>
      <div className="card" style={{ marginTop: "1rem" }}>
        <h1 style={{ fontSize: "1.4rem", marginTop: 0 }}>Sign in (demo)</h1>
        <p style={{ fontSize: "0.9rem", marginTop: 4 }}>
          This is a simple demo sign-in. It only stores your display name in
          this browser and does not create any real account.
        </p>
        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
          <label style={{ fontSize: "0.85rem", display: "block", marginBottom: 4 }}>
            Your name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            style={{
              width: "100%",
              padding: "0.45rem 0.6rem",
              borderRadius: 4,
              border: "1px solid #d1d5db",
              fontSize: "0.9rem",
            }}
            placeholder="e.g. Rakesh"
          />
          {error && (
            <div style={{ color: "#b91c1c", fontSize: "0.8rem", marginTop: 4 }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{
              marginTop: 10,
              width: "100%",
              padding: "0.55rem 0.75rem",
              borderRadius: 9999,
              border: "none",
              background: "#f97316",
              color: "white",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignInPage;
