import { useState } from "react";
import * as api from "../../services/api.service";
import "../../styles/Sections/educationsection.css";
import { toast } from "react-toastify";

export default function EducationSection({
  education,
  onAdd,
  onUpdate,
  onRemove,
  resumeId,
}) {
  const [apiLoading, setApiLoading] = useState(false);

  const handleAdd = async () => {
    if (!resumeId || resumeId === "null") {
      toast.error("first save Personal Info!");
      return;
    }
    const newEdu = {
      degree: "",
      institution: "",
      startYear: "",
      endYear: "",
      percentage: "",
    };
    try {
      setApiLoading(true);
      const response = await api.addEducation(resumeId, newEdu);
      console.log("Education added to backend:", response.data);
      onAdd();
    } catch (error) {
      console.error("Error adding education:", error);
      onAdd();
    } finally {
      setApiLoading(false);
    }
  };

  const handleUpdate = async (index, field, value) => {
    onUpdate(index, field, value);
  };

  const handleRemove = async (index) => {
    if (!window.confirm("Remove this education?")) return;
    try {
      setApiLoading(true);
      await api.removeEducation(index);
      console.log("Education removed from backend");
      onRemove(index);
    } catch (error) {
      console.error("Error removing education:", error);
      onRemove(index);
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="education-section">
      <h2 className="section-title"> Education</h2>

      {education.map((edu, index) => (
        <div key={index} className="form-card">
          <div className="card-header">
            <h3>Education #{index + 1}</h3>
            <button
              type="button"
              className="btn-remove"
              onClick={() => handleRemove(index)}
              disabled={apiLoading}
            >
              🗑 Remove
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Degree</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., B.Tech in Computer Science"
              value={edu.degree || ""}
              onChange={(e) => handleUpdate(index, "degree", e.target.value)}
              disabled={apiLoading}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Institution</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., IIT Bombay"
              value={edu.institution || ""}
              onChange={(e) =>
                handleUpdate(index, "institution", e.target.value)
              }
              disabled={apiLoading}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Year</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., 2015"
                value={edu.startYear || ""}
                onChange={(e) =>
                  handleUpdate(index, "startYear", e.target.value)
                }
                disabled={apiLoading}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Year</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., 2019"
                value={edu.endYear || ""}
                onChange={(e) => handleUpdate(index, "endYear", e.target.value)}
                disabled={apiLoading}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Percentage / CGPA</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., 8.5 CGPA or 85%"
              value={edu.percentage || ""}
              onChange={(e) =>
                handleUpdate(index, "percentage", e.target.value)
              }
              disabled={apiLoading}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn-add-section"
        onClick={handleAdd}
        disabled={apiLoading}
      >
        {apiLoading ? "⏳ Adding..." : "+ Add Education"}
      </button>

      {education.length === 0 && (
        <p className="empty-hint">No education details added yet.</p>
      )}
    </div>
  );
}
