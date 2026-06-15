import { useMemo, useEffect, useState } from "react";
import {
  FaTimes,
  FaInfoCircle,
  FaRobot,
  FaSpinner,
  FaAddressCard,
  FaBriefcase,
  FaGraduationCap,
  FaProjectDiagram,
  FaFileAlt,
  FaTools,
  FaExclamationTriangle,
  FaLightbulb,
  FaThumbsUp,
  FaCheckCircle
} from "react-icons/fa";
import { calculateATSScore, getScoreColor } from "../utils/atsScorer";
import "../styles/atsscoremodal.css";

const CATEGORIES = [
  { key: "contactInfo", label: "Contact Info", icon: FaAddressCard },
  { key: "summary", label: "Summary", icon: FaFileAlt },
  { key: "skills", label: "Skills", icon: FaTools },
  { key: "experience", label: "Experience", icon: FaBriefcase },
  { key: "education", label: "Education", icon: FaGraduationCap },
  { key: "projects", label: "Projects", icon: FaProjectDiagram },
];

export default function ATSScoreModal({ data, onClose }) {
  const result = useMemo(() => calculateATSScore(data), [data]);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = result.totalScore;
    const step = end / 40;

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [result.totalScore]);

  const RADIUS = 52;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const offset = CIRCUMFERENCE - (animatedScore / 100) * CIRCUMFERENCE;

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const impactColor = {
    high: { bg: "#fef2f2", text: "#dc2626", label: "🔴 High Impact" },
    medium: { bg: "#fffbeb", text: "#d97706", label: "🟡 Medium Impact" },
    low: { bg: "#f0fdf4", text: "#16a34a", label: "🟢 Low Impact" },
  };

  return (
    <div className="ats-overlay" onClick={onClose}>
      <div className="ats-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ats-header">
          <h2 className="ats-title">ATS Score Analysis</h2>
          <button
            className="ats-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        <div className="ats-modal-body">
          <div className="ats-score-section">
            <div className="ats-circle-wrapper">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r={RADIUS}
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="12"
                />
                <circle
                  cx="70"
                  cy="70"
                  r={RADIUS}
                  fill="none"
                  stroke={getScoreColor(result.totalScore)}
                  strokeWidth="12"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                  style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
                />
              </svg>

              <div className="ats-circle-text">
                <div className="ats-score-num-group">
                  <span
                    className="ats-score-num"
                    style={{ color: getScoreColor(result.totalScore) }}
                  >
                    {animatedScore}
                  </span>
                  <span className="ats-score-100">/100</span>
                </div>
                <span
                  className="ats-score-label"
                  style={{ color: getScoreColor(result.totalScore) }}
                >
                  {result.label}
                </span>
              </div>
            </div>

            <p className="ats-score-message">
  {result.totalScore >= 75 ? (
    <>
      <FaCheckCircle style={{ color: "#16a34a", marginRight: 6 }} />
      Your resume is ready for ATS!
    </>
  ) : result.totalScore >= 50 ? (
    <>
      <FaThumbsUp style={{ color: "#2563eb", marginRight: 6 }} />
      A few improvements can boost your score
    </>
  ) : (
    <>
      <FaExclamationTriangle style={{ color: "#d97706", marginRight: 6 }} />
   Improve your resume for better chances
    </>
  )}
</p>
          </div>

          <div className="ats-breakdown">
            <h3 className="ats-breakdown-title">Section-wise Breakdown</h3>

            {CATEGORIES.map(({ key, label, icon: Icon }) => {
              const cat = result.breakdown[key];
              const color = getScoreColor(cat.percentage);

              return (
                <div key={key} className="ats-category">
                  <div className="ats-cat-header">
                    <span className="ats-cat-label">
                      <span className="ats-icon">
                        <Icon />
                      </span>
                      {label}
                    </span>
                    <span className="ats-cat-points" style={{ color }}>
                      {cat.score}{" "}
                      <span className="ats-max-pts">/ {cat.maxScore} pts</span>
                    </span>
                  </div>

                  <div className="ats-bar-bg">
                    <div
                      className="ats-bar-fill"
                      style={{ width: `${cat.percentage}%`, background: color }}
                    />
                  </div>

                  <p className="ats-feedback">{cat.feedback}</p>

                  {cat.tips && (
                    <div className="ats-tip">
                      <FaInfoCircle className="ats-tip-icon" />
                      <span>{cat.tips}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="ats-footer">
          <p>
            <FaLightbulb/> <strong>Pro Tip:</strong> Make sure to add relevant keywords from the job description to your skills and experience sections.
          </p>
        </div>
      </div>
    </div>
  );
}
