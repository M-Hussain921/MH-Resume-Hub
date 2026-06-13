import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as adminApi from "../../services/admin.service";
import { useDebounce } from "../../hooks/useDebounce"; 
import {
  FaSearch,
  FaEye,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
} from "react-icons/fa";
import "../../styles/Admin.css";

export default function AdminResumes() {
  const [resumes, setResumes]         = useState([]);
  const [pagination, setPagination]   = useState({});
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [page, setPage]               = useState(1);
  const [selected, setSelected]       = useState([]); 
  const [deleting, setDeleting]       = useState(false);

  const navigate = useNavigate();

  const debouncedSearch = useDebounce(search, 500);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllResumes({
        page,
        limit: 10,
        search: debouncedSearch,
      });
      setResumes(data.data.resumes);
      setPagination(data.data.pagination);
      setSelected([]); 
    } catch (err) {
      if (err.response?.status === 401) {
        adminApi.removeToken();
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, navigate]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resume permanently?")) return;
    try {
      await adminApi.deleteResume(id);
      fetchResumes(); 
    } catch {
      alert("Delete failed!");
    }
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    if (!window.confirm(`Delete ${selected.length} resume(s) permanently?`)) return;
    setDeleting(true);
    try {
      await adminApi.bulkDeleteResumes(selected);
      fetchResumes();
    } catch {
      alert("Bulk delete failed!");
    } finally {
      setDeleting(false);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id) 
        : [...prev, id]            
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === resumes.length) {
      setSelected([]); 
    } else {
      setSelected(resumes.map((r) => r._id)); 
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">All Resumes</h1>

      <div className="admin-toolbar">
        <div className="admin-search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {selected.length > 0 && (
          <button
            className="btn-bulk-delete"
            onClick={handleBulkDelete}
            disabled={deleting}
          >
            {deleting
              ? <><FaSpinner className="spin" /> Deleting...</>
              : <><FaTrash /> Delete ({selected.length})</>
            }
          </button>
        )}
      </div>

      {loading ? (
        <div className="admin-loading">
          <FaSpinner className="spin" /> Loading resumes...
        </div>
      ) : (
        <>
          <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selected.length === resumes.length && resumes.length > 0}
                      onChange={toggleSelectAll}
                      title="Select all"
                    />
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Template</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resumes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="table-empty">
                      {debouncedSearch
                        ? `No results for "${debouncedSearch}"`
                        : "No resumes found"}
                    </td>
                  </tr>
                ) : (
                  resumes.map((r) => (
                    <tr
                      key={r._id}
                      className={selected.includes(r._id) ? "row-selected" : ""}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.includes(r._id)}
                          onChange={() => toggleSelect(r._id)}
                        />
                      </td>
                      <td>{r.personalInfo?.fullName || "—"}</td>
                      <td>{r.personalInfo?.email || "—"}</td>
                      <td>
                        <span className="badge">{r.templateName || "—"}</span>
                      </td>
                      <td>{formatDate(r.createdAt)}</td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="btn-icon-sm btn-view"
                            onClick={() => navigate(`/admin/resumes/${r._id}`)}
                            title="View"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn-icon-sm btn-delete"
                            onClick={() => handleDelete(r._id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="admin-pagination">
              <button
                className="page-btn"
                disabled={!pagination.hasPrevPage}
                onClick={() => setPage((p) => p - 1)}
              >
                <FaChevronLeft />
              </button>

              <span className="page-info">
                Page <strong>{pagination.currentPage}</strong> of{" "}
                <strong>{pagination.totalPages}</strong>{" "}
                <span className="page-total">({pagination.totalResumes} total)</span>
              </span>

              <button
                className="page-btn"
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}