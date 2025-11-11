import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/api";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav>
      <div>
        <Link to="/dashboard">🏠 Dashboard</Link>
        <Link to="/add-pet">➕ Add Pet</Link>
        <Link to="/devices">📱 Devices</Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {user.name && <span>👋 Hello, {user.name}</span>}
        {token && (
          <button
            onClick={handleLogout}
            style={{
              background: "#e53e3e",
              border: "none",
              padding: "6px 12px",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
            }}
          >
            🚪 Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
