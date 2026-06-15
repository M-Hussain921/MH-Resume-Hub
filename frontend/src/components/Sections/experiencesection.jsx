import { useState } from "react";
import * as api from "../../services/api.service";
import "../../styles/Sections/experiencesection.css";
import { toast } from "react-toastify";

export default function ExperienceSection({
  resumeId,
  experience,
  onAdd,
  onUpdate,
  onRemove,
}) {
  const [apiLoading, setApiLoading] = useState(false);

  const handleAdd = async () => {
    if (!resumeId || resumeId === 'null') {
    toast.error("Pehle Personal Info save karo!");
    return;}
    const cleanId = typeof resumeId === "object" ? resumeId?._id : resumeId;
    if (!cleanId || cleanId === "[object Object]") {
      toast(
        "Please fill Personal Info and click the global 'Save' button first to register this resume!",
      );
      return;
    }

    const newExp = {
      company: "New Company",
      position: "New Position",
      startDate: "Jan 2026",
      endDate: "Present",
      isCurrentJob: true,
      description: "Describe your role here...",
    };

    try {
      setApiLoading(true);

      const response = await api.addExperience(cleanId, newExp);
      console.log("Experience added to backend:", response.data);

      onAdd(newExp);
    } catch (error) {
      console.error("Error adding experience:", error);
      alert("Failed to sync new experience block with cloud database.");
    } finally {
      setApiLoading(false);
    }
  };

  const handleUpdate = (index, field, value) => {
    onUpdate(index, field, value);
  };

  const handleRemove = async (index,expId) => {
    if (!window.confirm("Remove this experience?")) return;

    const cleanId = typeof resumeId === "object" ? resumeId?._id : resumeId;
     const targetIndexOrId = expId || index;

    try {
      setApiLoading(true);

      await api.removeExperience(cleanId, targetIndexOrId);
      console.log("Experience removed from backend");

      onRemove(index);
    } catch (error) {
      console.error("Error removing experience:", error);

      onRemove(index);
    } finally {
      setApiLoading(false);
    }
  };

  const handleCurrentJobChange = (index, isChecked) => {
  handleUpdate(index, "isCurrentJob", isChecked);
  // handleUpdate(index, "endDate", isChecked ? "" : "");
};

  return (
    <div className="experience-section">
      <h2 className="section-title">Work Experience</h2>

      {experience.map((exp, index) => (
        <div key={exp._id || index} className="form-card">
          <div className="card-header">
            <h3>Experience #{index + 1}</h3>
            <button
              type="button"
              className="btn-remove"
              onClick={() => handleRemove(index, exp._id)}
              disabled={apiLoading}
            >
              🗑 Remove
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Job Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Senior Frontend Developer"
              value={exp.position || exp.title || ""}
              onChange={(e) =>
                handleUpdate(index, "position", e.target.value)
              }
              disabled={apiLoading}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Google, Microsoft"
              value={exp.company || ""}
              onChange={(e) =>
                handleUpdate(index, "company", e.target.value)
              }
              disabled={apiLoading}
              autoComplete="off"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="month"
                className="form-input"
                value={exp.startDate || ""}
                onChange={(e) =>
                  handleUpdate(index, "startDate", e.target.value)
                }
                disabled={apiLoading}
                autoComplete="off"
                max={new Date().toISOString().slice(0, 7)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              {exp.isCurrentJob ? (
  
    <div className="present-badge">Present</div>
  ) : (
    <input
      type="month"
      className="form-input"
      value={exp.endDate || ""}
      onChange={(e) => handleUpdate(index, "endDate", e.target.value)}
      disabled={apiLoading}
      autoComplete="off"
      max={new Date().toISOString().slice(0, 7)} 
    />
  )}
            </div>
          </div>

          <div className="form-group-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={exp.isCurrentJob || false}
                onChange={(e) =>
                  handleCurrentJobChange(index, e.target.checked)
                }
                disabled={apiLoading}
              />
              <span>I currently work here</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="Describe your responsibilities..."
              value={exp.description || ""}
              onChange={(e) =>
                handleUpdate(index, "description", e.target.value)
              }
              disabled={apiLoading}
              autoComplete="off"
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
        {apiLoading ? "⏳ Synchronizing Cloud..." : "+ Add Experience"}
      </button>

      {experience.length === 0 && (
        <p className="empty-hint">No work experience added yet.</p>
      )}
    </div>
  );
}
