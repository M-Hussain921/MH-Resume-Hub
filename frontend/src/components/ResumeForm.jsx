import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import * as api from "../services/api.service";
import {
  FaUser,
  FaBolt,
  FaBriefcase,
  FaGraduationCap,
  FaRocket,
} from "react-icons/fa";
import PersonalSection from "./sections/PersonalSection";
import SkillsSection from "./sections/SkillsSection";
import ExperienceSection from "./sections/ExperienceSection";
import EducationSection from "./sections/EducationSection";
import ProjectSection from "./sections/ProjectSection";
import "../styles/ResumeForm.css";

export default function ResumeForm({
  data,
  onChange,
  resumeId,
  onResumeIdChange,
}) {
  const [activeSection, setActiveSection] = useState("personal");
  const [resumeLoading, setResumeLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    resumeTitle: "My Resume",
    templateName: "Modern",
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      linkedInUrl: "",
      githubUrl: "",
      summary: "",
    },
    skills: [],
    experience: [],
    education: [],
    projects: [],
  });

  const personal = data.personal || {};
  const skills = data.skills || [];
  const experience = data.experience || [];
  const education = data.education || [];
  const projects = data.projects || [];

  const sections = [
    { id: "personal", label: "Personal", icon: <FaUser /> },
    { id: "skills", label: "Skills", icon: <FaBolt /> },
    { id: "experience", label: "Experience", icon: <FaBriefcase /> },
    { id: "education", label: "Education", icon: <FaGraduationCap /> },
    { id: "projects", label: "Projects", icon: <FaRocket /> },
  ];

  useEffect(() => {
    const loadResumeData = async () => {
      if (resumeId) {
        setResumeLoading(true);
        try {
          const res = await api.getResumeById(resumeId);
          if (res.success) {
            setFormData(res.data);
          }
        } catch (error) {
          console.error("Data loading failed:", error);
        } finally {
          setResumeLoading(false);
        }
      }
    };
    loadResumeData();
  }, [resumeId]);

  const handleManualSave = async () => {
    if (!formData.personalInfo?.fullName || !formData.personalInfo?.email) {
      alert(
        "Please fill your Full Name and Email in the Personal section before saving!",
      );
      return;
    }
    setSaving(true);
    try {
      if (resumeId) {
        const res = await api.updateResume(resumeId, formData);
        if (res.success) {
          toast.success("Resume updated successfully!");
        } else {
          const res = await api.createResume(formData);
          if (res.success) {
            setResumeId(res.data._id);
            toast.success("Resume saved successfully!");
          }
        }
      }
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save resume. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePersonalChange = async (field, value) => {
    const updatedPersonal = { ...personal, [field]: value };

    onChange("personal", updatedPersonal);

    if (resumeId) {
      try {
        await api.updatePersonalInfo(resumeId, updatedPersonal);
      } catch (err) {
        console.error(err);
        toast.error("Failed to update personal info. Please try again.");
      }
    }
  };

  const addSkill = (skill) => {
    onChange("skills", [...skills, skill]);
  }; 

  const removeSkill = (index) => {
    onChange(
      "skills",
      skills.filter((_, i) => i !== index),
    );
  };

  const addExperience = async () => {
    if (!resumeId) return;

    const newExp = {
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrentJob: false,
    };

    onChange("experience", [...experience, newExp]);

    try {
      await api.addExperience(resumeId, newExp);
    } catch (err) {
      console.error(err);
    }
  };

  const updateExperience = async (index, field, value) => {
    const updatedItem = {
      ...experience[index],
      [field]: value,

      ...(field === "isCurrentJob" && value === true ? { endDate: "" } : {}),
    };

    const updated = experience.map((item, i) =>
      i === index ? updatedItem : item,
    );

    onChange("experience", updated);

    if (resumeId) {
      try {
        await api.updateExperience(resumeId, index, updatedItem);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const removeExperience = async (index) => {
    if (!resumeId) return;
    onChange(
      "experience",
      experience.filter((_, i) => i !== index),
    );
    try {
      await api.removeExperience(resumeId, index);
    } catch (err) {
      console.error(err);
    }
  };

  const addEducation = async () => {
    if (!resumeId) return;

    const newEdu = { institution: "", degree: "", startDate: "", endDate: "" };
    onChange("education", [...education, newEdu]);
    try {
      await api.addEducation(resumeId, newEdu);
    } catch (err) {
      console.error(err);
    }
  };

  const updateEducation = async (index, field, value) => {
    const updated = education.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange("education", updated);

    if (resumeId) {
      try {
        await api.updateEducation(resumeId, index, updated[index]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const removeEducation = async (index) => {
    if (!resumeId) return;
    onChange(
      "education",
      education.filter((_, i) => i !== index),
    );
    try {
      await api.removeEducation(resumeId, index);
    } catch (err) {
      console.error(err);
    }
  };

  const addProject = async () => {
    if (!resumeId) return;

    const newProj = { title: "", description: "", link: "" };
    onChange("projects", [...projects, newProj]);
    try {
      await api.addProject(resumeId, newProj);
    } catch (err) {
      console.error(err);
    }
  };

  const updateProject = async (index, field, value) => {
    const updated = projects.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange("projects", updated);

    if (resumeId) {
      try {
        await api.updateProject(resumeId, index, updated[index]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const removeProject = async (index) => {
    if (!resumeId) return;
    onChange(
      "projects",
      projects.filter((_, i) => i !== index),
    );
    try {
      await api.removeProject(resumeId, index);
    } catch (err) {
      console.error(err);
    }
  };

  const renderActiveSection = () => {
    if (resumeLoading)
      return <div className="loading-spinner">Fetching current details...</div>;
    switch (activeSection) {
      case "personal":
        return (
          <PersonalSection data={personal} onChange={handlePersonalChange} />
        );

      case "skills":
        return (
          <SkillsSection
            skills={skills}
            onAddSkill={addSkill}
            onRemoveSkill={removeSkill}
            resumeId={resumeId}
          />
        );

      case "experience":
        return (
          <ExperienceSection
            experience={experience}
            onAdd={addExperience}
            onUpdate={updateExperience}
            onRemove={removeExperience}
            resumeId={resumeId}
          />
        );

      case "education":
        return (
          <EducationSection
            education={education}
            onAdd={addEducation}
            onUpdate={updateEducation}
            onRemove={removeEducation}
            resumeId={resumeId}
          />
        );

      case "projects":
        return (
          <ProjectSection
            projects={projects}
            onAdd={addProject}
            onUpdate={updateProject}
            onRemove={removeProject}
            resumeId={resumeId}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="form-container">
      <div className="form-header-buttons">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`form-header-btn ${activeSection === section.id ? "active" : ""}`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="btn-icon">{section.icon}</span>
            <span className="btn-text">{section.label}</span>
          </button>
        ))}
      </div>

      <div className="form-content">{renderActiveSection()}</div>
    </div>
  );
}
