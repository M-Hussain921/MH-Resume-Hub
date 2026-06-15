import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import {
  FaChartBar,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdOutlineFormatAlignLeft } from "react-icons/md";
import "../../styles/admin.css";

export default function AdminLayout() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">

        <div className="sidebar-logo" onClick={() => navigate("/admin/dashboard")}>
          <MdOutlineFormatAlignLeft />
          <span>Admin Panel</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link--active" : ""}`
            }
          >
            <FaChartBar /> Dashboard
          </NavLink>

          <NavLink
            to="/admin/resumes"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link--active" : ""}`
            }
          >
            <FaFileAlt /> Resumes
          </NavLink>
        </nav>

        <button className="sidebar-logout" onClick={logout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}