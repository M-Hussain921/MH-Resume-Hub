import "../../styles/Sections/personalsection.css";
import LocationInput from "./locationinput";
import { FaSave, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { useState } from "react";

export default function PersonalSection({
  data,
  onChange,
  onSave,
  saveStatus,
}) {
  const [emailError, setEmailError] = useState("");
  const [touched, setTouched] = useState(false);
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <div className="personal-section">
      <div className="form-group">
        <label className="form-label">
          Target Job Role <span className="required">*</span>
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="Project Manager, Full Stack Developer,Human Resourcesr"
          value={data.targetJobRole || ""}
          onChange={(e) => handleChange("targetJobRole", e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        <p className="form-hint">
          This is crucial for AI to optimize your resume keywords.
        </p>
      </div>

      <div className="form-group-checkbox">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={data.isFresher || false}
            onChange={(e) => handleChange("isFresher", e.target.checked)}
          />
          <span>
            I am a Student / Fresher looking for internship or first job
          </span>
        </label>
      </div>

      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input
          type="text"
          className="form-input"
          placeholder="Mohammed Hussain"
          value={data.fullName || ""}
          onChange={(e) => handleChange("fullName", e.target.value)}
          autoComplete="off"
          spellCheck={false}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-input ${emailError ? "error" : ""}`}
            placeholder="hussain@example.com"
            value={data.email || ""}
            onChange={(e) => {
              const value = e.target.value;
              handleChange("email", value);

              if (touched) {
                if (!validateEmail(value)) {
                  setEmailError("Invalid email format");
                } else {
                  setEmailError("");
                }
              }
            }}
            onBlur={(e) => {
              setTouched(true);

              if (!validateEmail(e.target.value)) {
                setEmailError("Invalid email format");
              } else {
                setEmailError("");
              }
            }}
          />
          {emailError && <p className="error-text">{emailError}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className="form-input"
            placeholder="+1 234 567 890"
            value={data.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            autoComplete="off"
            spellCheck={false}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Location</label>
          <LocationInput
            value={data.location || ""}
            onChange={(val) => handleChange("location", val)}
            placeholder="City, State, Country"
          />
        </div>
        <div className="form-group">
          <label className="form-label">LinkedIn Profile</label>
          <input
            type="text"
            className="form-input"
            placeholder="linkedin.com/in/john"
            value={data.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Github / Portfolio URL</label>
        <input
          type="text"
          className="form-input"
          placeholder="github.com/john or portfolio.com"
          value={data.github || ""}
          onChange={(e) => handleChange("github", e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Professional Summary</label>
        <textarea
          className="form-textarea"
          rows="5"
          placeholder="Briefly describe your professional background and key achievements..."
          value={data.summary || ""}
          onChange={(e) => handleChange("summary", e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="form-action">
        <button>
          Save
        </button>
      </div>
    </div>
  );
}
