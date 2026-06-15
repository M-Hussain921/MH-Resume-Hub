import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as adminApi from "../../services/admin.service";
import {
  FaFileAlt,
  FaCalendarDay,
  FaCalendarWeek,
  FaEye,
} from "react-icons/fa";
import "../../styles/admin.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getStats();
        setStats(data.data);
      } catch (err) {
        if (err.response?.status === 401) {
          adminApi.removeToken();
          navigate("/admin/login");
          return;
        }
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); 
  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="admin-error-box" style={{margin:"2rem"}}>{error}</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Dashboard</h1>

      <div className="stats-cards">
        <div className="stat-card">
          <FaFileAlt className="stat-icon stat-icon--blue" />
          <div>
            <p className="stat-number">{stats.overview.totalResumes}</p>
            <p className="stat-label">Total Resumes</p>
          </div>
        </div>

        <div className="stat-card">
          <FaCalendarDay className="stat-icon stat-icon--green" />
          <div>
            <p className="stat-number">{stats.overview.todayResumes}</p>
            <p className="stat-label">Created Today</p>
          </div>
        </div>

        <div className="stat-card">
          <FaCalendarWeek className="stat-icon stat-icon--purple" />
          <div>
            <p className="stat-number">{stats.overview.weekResumes}</p>
            <p className="stat-label">This Week</p>
          </div>
        </div>
      </div>

      <div className="admin-grid-2">

        <div className="admin-card">
          <h2 className="card-title">Recent Resumes</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Template</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentResumes.length === 0 ? (
                <tr>
                  <td colSpan={3} className="table-empty">No resumes yet</td>
                </tr>
              ) : (
                stats.recentResumes.map((r) => (
                  <tr key={r._id}>
                    <td>{r.personalInfo?.fullName || "—"}</td>
                    <td>
                      <span className="badge">{r.templateName || "—"}</span>
                    </td>
                    <td>
                      <button
                        className="btn-icon-sm btn-view"
                        onClick={() => navigate(`/admin/resumes/${r._id}`)}
                        title="View resume"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <h2 className="card-title">Top Skills</h2>

          {stats.topSkills.length === 0 ? (
            <p className="table-empty">No skills data yet</p>
          ) : (
            <div className="skills-chart">
              {stats.topSkills.map((s, i) => {
                const maxCount = stats.topSkills[0].count;
                const pct = Math.round((s.count / maxCount) * 100);

                return (
                  <div key={i} className="skill-bar-row">
                    <span className="skill-bar-name">{s.skill}</span>
                    <div className="skill-bar-bg">
                      <div
                        className="skill-bar-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="skill-bar-count">{s.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {stats.templateStats.length > 0 && (
        <div className="admin-card" style={{ marginTop: "1.5rem" }}>
          <h2 className="card-title">Template Usage</h2>
          <div className="template-badges">
            {stats.templateStats.map((t, i) => (
              <div key={i} className="template-stat">
                <span className="badge badge--large">{t.template}</span>
                <span className="template-count">{t.count} resumes</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}