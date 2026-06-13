import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as adminApi from "../../services/admin.service";
import {
  FaArrowLeft,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
  FaSpinner,
} from "react-icons/fa";
import "../../styles/Admin.css";

export default function AdminResumeDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await adminApi.getResumeDetails(id);
        setResume(data.data);
      } catch (err) {
        if (err.response?.status === 401) {
          adminApi.removeToken();
          navigate("/admin/login");
        } else if (err.response?.status === 404) {
          navigate("/admin/resumes"); 
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this resume permanently?")) return;
    setDeleting(true);
    try {
      await adminApi.deleteResume(id);
      navigate("/admin/resumes");
    } catch {
      alert("Delete failed!");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <FaSpinner className="spin" /> Loading resume...
      </div>
    );
  }

  if (!resume) return null;

  const info = resume.personalInfo || {};

  return (
    <div className="admin-page">
      <div className="admin-detail-header">
        <button
          className="btn-back"
          onClick={() => navigate("/admin/resumes")}
        >
          <FaArrowLeft /> Back to Resumes
        </button>

        <h1 className="admin-page-title" style={{ margin: 0 }}>
          {info.fullName || "Resume Detail"}
        </h1>

        <button
          className="btn-delete-red"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <><FaSpinner className="spin" /> Deleting...</>
          ) : (
            <><FaTrash /> Delete Resume</>
          )}
        </button>
      </div>

      <div className="admin-card">
        <h2 className="card-title">Contact Information</h2>
        <div className="detail-contact-grid">
          {info.email && (
            <p className="detail-contact-item">
              <FaEnvelope /> {info.email}
            </p>
          )}
          {info.phone && (
            <p className="detail-contact-item">
              <FaPhone /> {info.phone}
            </p>
          )}
          {(info.city || info.state) && (
            <p className="detail-contact-item">
              <FaMapMarkerAlt />{" "}
              {[info.city, info.state].filter(Boolean).join(", ")}
            </p>
          )}
          {info.linkedInUrl && (
            <p className="detail-contact-item">
              <FaLinkedin />{" "}
              <a href={info.linkedInUrl} target="_blank" rel="noreferrer">
                {info.linkedInUrl}
              </a>
            </p>
          )}
          {info.githubUrl && (
            <p className="detail-contact-item">
              <FaGithub />{" "}
              <a href={info.githubUrl} target="_blank" rel="noreferrer">
                {info.githubUrl}
              </a>
            </p>
          )}
        </div>

        {info.summary && (
          <p className="detail-summary">{info.summary}</p>
        )}
      </div>

      {resume.skills?.length > 0 && (
        <div className="admin-card">
          <h2 className="card-title">
            Skills <span className="count-badge">({resume.skills.length})</span>
          </h2>
          <div className="detail-skills-list">
            {resume.skills.map((s, i) => (
              <span key={i} className="badge">{s}</span>
            ))}
          </div>
        </div>
      )}

      {resume.experience?.length > 0 && (
        <div className="admin-card">
          <h2 className="card-title">
            Experience <span className="count-badge">({resume.experience.length})</span>
          </h2>
          {resume.experience.map((exp, i) => (
            <div key={i} className="detail-entry">
              <div className="detail-entry-top">
                <div>
                  <strong>{exp.position || "—"}</strong>
                  {exp.company && <span className="at-company"> @ {exp.company}</span>}
                </div>
                <span className="detail-date-range">
                  {exp.startDate} — {exp.isCurrentJob ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.description && (
                <p className="detail-entry-desc">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {resume.education?.length > 0 && (
        <div className="admin-card">
          <h2 className="card-title">
            Education <span className="count-badge">({resume.education.length})</span>
          </h2>
          {resume.education.map((edu, i) => (
            <div key={i} className="detail-entry">
              <div className="detail-entry-top">
                <div>
                  <strong>{edu.degree || "—"}</strong>
                  {edu.institution && (
                    <span className="at-company"> — {edu.institution}</span>
                  )}
                </div>
                <span className="detail-date-range">
                  {edu.startDate} — {edu.endDate}
                  {edu.percentage && ` | ${edu.percentage}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {resume.projects?.length > 0 && (
        <div className="admin-card">
          <h2 className="card-title">
            Projects <span className="count-badge">({resume.projects.length})</span>
          </h2>
          {resume.projects.map((proj, i) => (
            <div key={i} className="detail-entry">
              <div className="detail-entry-top">
                <strong>{proj.title || "—"}</strong>
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noreferrer"
                    className="project-ext-link"
                  >
                    View →
                  </a>
                )}
              </div>
              {proj.description && (
                <p className="detail-entry-desc">{proj.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}