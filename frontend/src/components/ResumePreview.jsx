import { useState } from "react";
import {
  FaChartLine,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaExternalLinkAlt,
  FaFileAlt,
  FaCode,
  FaBriefcase,
  FaGraduationCap,
  FaRocket,
} from "react-icons/fa";
import { MdPreview } from "react-icons/md";
import ATSScoreModal from "./ATSScoreModal";
import "./../styles/ResumePreview.css";

export default function ResumePreview({ data, onClose }) {
  const [showATSScore, setShowATSScore] = useState(false);

  const formatUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  const personal = data.personal || {};

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr || dateStr === "") return "";
    if (dateStr === "Present") return "Present";

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("/");
      const date = new Date(`${year}-${month}-${day}`);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });
      }
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          });
        }
      } catch {
        return "";
      }
    }

    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });
      }
    } catch {
      return "";
    }

    return "";
  };

  const getExpDateRange = (exp) => {
    const start = formatDateForDisplay(exp.startDate);
    const end = exp.isCurrentJob
      ? "Present"
      : formatDateForDisplay(exp.endDate);
    if (!start && !end) return "";
    if (!start) return end;
    if (!end) return start;
    return `${start} – ${end}`;
  };

  const hasAnyData =
    personal.fullName ||
    personal.summary ||
    (data.skills && data.skills.length > 0) ||
    (data.experience && data.experience.length > 0) ||
    (data.education && data.education.length > 0) ||
    (data.projects && data.projects.length > 0);

  const contactItems = [
    personal.phone && {
      type: "text",
      icon: <FaPhone />,
      value: personal.phone,
    },
    personal.location && {
      type: "text",
      icon: <FaMapMarkerAlt />,
      value: personal.location,
    },
    personal.email && {
      type: "text",
      icon: <FaEnvelope />,
      value: personal.email,
    },
    personal.linkedin && {
      type: "link",
      icon: <FaLinkedin />,
      label: "LinkedIn",
      url: personal.linkedin,
    },
    personal.github && {
      type: "link",
      icon: <FaGithub />,
      label: "GitHub",
      url: personal.github,
    },
  ].filter(Boolean);

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h2 className="preview-title">
          <MdPreview className="preview-title-icon" />
          Live Preview
        </h2>
        <button className="ats-score-btn" onClick={() => setShowATSScore(true)}>
          <FaChartLine /> ATS Score
        </button>
      </div>

      <div id="resume-paper" className="resume-paper">
        {!hasAnyData ? (
          <div className="empty-preview-message">
            <div className="empty-icon">
              <FaFileAlt />
            </div>
            <p>Fill the form to see the preview</p>
          </div>
        ) : (
          <>
            <h1 className="resume-name">{personal.fullName || "Name"}</h1>

            {contactItems.length > 0 && (
              <div className="contact-line">
                {contactItems.map((item, idx) => (
                  <span key={idx} className="contact-item-wrapper">
                    {idx > 0 && <span className="pipe">|</span>}
                    {item.type === "text" ? (
                      <span className="contact-item">
                        <span className="contact-icon">{item.icon}</span>
                        {item.value}
                      </span>
                    ) : (
                      <a
                        href={formatUrl(item.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-item contact-link"
                      >
                        <span className="contact-icon">{item.icon}</span>
                        {item.label}
                        <FaExternalLinkAlt className="external-icon" />
                      </a>
                    )}
                  </span>
                ))}
              </div>
            )}

            <div className="resume-divider" />

            {personal.summary && (
              <section className="resume-section">
                <h3 className="sec-heading">
                  <FaFileAlt className="section-icon" /> SUMMARY
                </h3>
                <p className="summary-text">{personal.summary}</p>
              </section>
            )}

            {data.skills && data.skills.length > 0 && (
              <section className="resume-section">
                <h3 className="sec-heading">
                  <FaCode className="section-icon" /> SKILLS
                </h3>
                <div className="skills-container">
                  {data.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {data.experience && data.experience.length > 0 && (
              <section className="resume-section">
                <h3 className="sec-heading">
                  <FaBriefcase className="section-icon" /> EXPERIENCE
                </h3>
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="entry-block">
                    <div className="entry-header">
                      <div className="entry-left">
                        <span className="entry-title">{exp.title || "—"}</span>
                        {exp.company && (
                          <span className="entry-subtitle">{exp.company}</span>
                        )}
                      </div>
                      <span className="entry-date">{getExpDateRange(exp)}</span>
                    </div>
                    {exp.description && (
                      <p className="entry-desc">{exp.description}</p>
                    )}
                  </div>
                ))}
              </section>
            )}

            {data.education && data.education.length > 0 && (
              <section className="resume-section">
                <h3 className="sec-heading">
                  <FaGraduationCap className="section-icon" /> EDUCATION
                </h3>
                {data.education.map((edu, idx) => (
                  <div key={idx} className="entry-block">
                    <div className="entry-header">
                      <div className="entry-left">
                        <span className="entry-title">{edu.degree || "—"}</span>
                        {edu.institution && (
                          <span className="entry-subtitle">
                            {edu.institution}
                          </span>
                        )}
                      </div>
                      <div className="entry-right">
                        {(edu.startYear || edu.endYear) && (
                          <span className="entry-date">
                            {edu.startYear}
                            {edu.startYear && edu.endYear ? " – " : ""}
                            {edu.endYear}
                          </span>
                        )}
                        {edu.percentage && (
                          <span className="edu-percent">{edu.percentage}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {data.projects && data.projects.length > 0 && (
              <section className="resume-section">
                <h3 className="sec-heading">
                  <FaRocket className="section-icon" /> PROJECTS
                </h3>
                {data.projects.map((proj, idx) => (
                  <div key={idx} className="entry-block">
                    <div className="entry-header">
                      <div className="entry-left">
                        <span className="entry-title">
                          {proj.name || "—"}
                          {proj.link && (
                            <a
                              href={formatUrl(proj.link)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-link"
                            >
                              <FaExternalLinkAlt /> View
                            </a>
                          )}
                        </span>
                        {proj.technologies && (
                          <span className="project-tech">
                            <FaCode className="tech-icon" /> {proj.technologies}
                          </span>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className="entry-desc">{proj.description}</p>
                    )}
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </div>

      <p className="preview-note">⚡ Live preview — exactly as it will print</p>

      {showATSScore && (
        <ATSScoreModal data={data} onClose={() => setShowATSScore(false)} />
      )}
    </div>
  );
}
