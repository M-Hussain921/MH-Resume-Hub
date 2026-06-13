import { useState } from "react";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { MdOutlineFormatAlignLeft } from "react-icons/md";
import { FaLock, FaUser, FaSpinner } from "react-icons/fa";
import "../../styles/Admin.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAdminAuth();

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!username.trim() || !password.trim()) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError(""); 

    try {
      const data=await login(username, password);
        saveToken(data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-logo">
          <MdOutlineFormatAlignLeft className="logo-big-icon" />
          <h1>Resume Builder</h1>
          <p>Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">

          {error && <div className="admin-error-box">{error}</div>}

          <div className="admin-input-group">
            <FaUser className="admin-input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="off"
              autoFocus
            />
          </div>

          <div className="admin-input-group">
            <FaLock className="admin-input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? (
              <><FaSpinner className="spin" /> Logging in...</>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}