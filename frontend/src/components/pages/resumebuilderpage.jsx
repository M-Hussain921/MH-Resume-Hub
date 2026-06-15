import { useState, useEffect } from "react";
import ResumeForm from "../resumeform";
import ResumePreview from "../resumepreview";
import Navbar from "../navbar";
import * as api from "../../services/api.service";
import { downloadResumeAsPDF } from "../../utils/pdfGenerator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/app.css";

function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: "",
      targetJobRole: "",
      isFresher: false,
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      summary: "",
    },
    skills: [],
    experience: [],
    education: [],
    projects: [],
  });

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [deleteStatus, setDeleteStatus] = useState("");
  const [resumeId, setResumeId] = useState(null);

  useEffect(() => {
    if (resumeId) {
      loadResume(resumeId);
    }
  }, [resumeId]);

  const loadResume = async (id) => {
    if (!id || id === "[object Object]") return;
    try {
      setLoading(true);

      const response = await api.getResumeById(id);
      console.log("API response:", response);

      if (response.data && response.data.data) {
        const backendData = response.data.data;

        setResumeData({
          personal: {
            fullName:
              backendData.personalInfo?.fullName ||
              backendData.resumeTitle?.replace(" - Resume", ""),
            targetJobRole: backendData.targetJobRole || "",
            isFresher: backendData.isFresher || false,
            email: backendData.personalInfo?.email || "",
            phone: backendData.personalInfo?.phone || "",
            location: [
              backendData.personalInfo?.city,
              backendData.personalInfo?.state,
            ]
              .filter(Boolean)
              .join(", "),

            linkedin: backendData.personalInfo?.linkedInUrl || "",
            github: backendData.personalInfo?.githubUrl || "",
            summary: backendData.personalInfo?.summary || "",
          },

          skills: backendData.skills || [],

          experience: (backendData.experience || []).map((exp) => ({
            title: exp.position || "",
            company: exp.company || "",
            startDate: exp.startDate || "",
            endDate: exp.endDate || "",
            description: exp.description || "",
            isCurrentJob: exp.isCurrentJob || false,
          })),

          education: (backendData.education || []).map((edu) => ({
            degree: edu.degree || "",
            institution: edu.institution || "",
            startYear: edu.startDate || "",
            endYear: edu.endDate || "",
            percentage: edu.percentage || "",
          })),

          projects: (backendData.projects || []).map((proj) => ({
            name: proj.title || "",
            technologies: proj.technologies || "",
            description: proj.description || "",
            link: proj.link || "",
          })),
        });

        toast("Resume loaded successfully!");
      }
    } catch (error) {
      console.error("Error loading resume:", error);

      if (error.response?.status === 404) {
        await createNewResume(id);
      }
    } finally {
      setLoading(false);
    }
  };

  const createNewResume = async () => {
    try {
      const basicResumeData = {
        personal: {
          fullName: "",
          targetJobRole: "",
          isFresher: false,
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          github: "",
          summary: "",
        },
        skills: [],
        experience: [],
        education: [],
        projects: [],
      };

      await api.createResume(basicResumeData);

      console.log("New resume created");

      setTimeout(() => {
        loadResume(resumeId);
      }, 500);
    } catch (error) {
      console.error("Error creating resume:", error.response?.data || error);
      toast.error("Error creating resume");
    }
  };

  const handleResumeChange = (section, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const handleSave = async () => {
    if (!resumeData.personal.fullName?.trim()) {
      toast.error("Please enter your Full Name before saving!");
      return;
    }
    try {
      setSaveStatus("saving");

      const locationParts = resumeData.personal.location
        ? resumeData.personal.location.split(",")
        : [];
      const city = locationParts[0]?.trim() || "";
      const state = locationParts[1]?.trim() || "";

      const backendPayload = {
        resumeTitle: `${resumeData.personal.fullName || "User"} - Resume`,
        targetJobRole: resumeData.personal.targetJobRole,
        isFresher: resumeData.personal.isFresher,
        personalInfo: {
          fullName: resumeData.personal.fullName,
          email: resumeData.personal.email,
          phone: resumeData.personal.phone,
          city: city,
          state: state,
          linkedInUrl: resumeData.personal.linkedin,
          githubUrl: resumeData.personal.github,
          summary: resumeData.personal.summary,
        },
        skills: resumeData.skills,
        experience: resumeData.experience.map((exp) => ({
          company: exp.company,
          position: exp.position || exp.title,
          startDate: exp.startDate,
          endDate: exp.endDate,
          description: exp.description,
          isCurrentJob: exp.isCurrentJob,
        })),
        education: resumeData.education.map((edu) => ({
          institution: edu.institution,
          degree: edu.degree,
          startDate: edu.startYear,
          endDate: edu.endYear,
          percentage: edu.percentage,
        })),
        projects: resumeData.projects.map((proj) => ({
          title: proj.name,
          link: proj.link,
          description: proj.description,
        })),
      };

      if (
        resumeId &&
        typeof resumeId === "string" &&
        resumeId !== "[object Object]"
      ) {
        console.log("Updating existing resume with string ID:", resumeId);
        await api.updateResume(resumeId, backendPayload);
        toast.success("Resume updated successfully!");
      } else {
        console.log("Creating brand new resume schema block...");
        const response = await api.createResume(backendPayload);

        if (response && response.data?._id) {
          const generatedStringId = response.data._id;

          setResumeId(String(generatedStringId));
          toast.success("New Resume created!");
        } else {
          throw new Error(
            "ID extraction failed from database document creation engine.",
          );
        }
      }

      setSaveStatus("success");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (error) {
      console.error("Error saving resume:", error);
      toast.error("Error occurred while processing saving pipelines.");
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 2000);
    }
  };

  const handleDelete = async () => {
    if (!resumeId) {
      toast.info("This local draft isn't registered on the server yet.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your resume? This action cannot be undone!",
    );
    if (!confirmDelete) return;

    try {
      setDeleteStatus("deleting");

      await api.deleteResumeById(resumeId);

      setDeleteStatus("success");

      setResumeData({
        personal: {
          fullName: "",
          targetJobRole: "",
          isFresher: false,
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          github: "",
          summary: "",
        },
        skills: [],
        experience: [],
        education: [],
        projects: [],
      });

      setTimeout(() => {
        setDeleteStatus("");
      }, 2000);

      console.log("Resume deleted successfully");
      setResumeId(null);
      toast.success("Resume deleted successfully");
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Error deleting resume");

      setDeleteStatus("error");

      setTimeout(() => {
        setDeleteStatus("");
      }, 2000);
    }
  };

  const handleDownloadPDF = () => {
    const fileName = resumeData.personal?.fullName || "resume";

    downloadResumeAsPDF("resume-paper", fileName);
  };

  return (
    <div className="app-wrapper">
      <Navbar
        onSave={handleSave}
        onDelete={handleDelete}
        onDownloadPDF={handleDownloadPDF}
        saveStatus={saveStatus}
        deleteStatus={deleteStatus}
      />

      <div className="main-container">
        <div className="left-side">
          <div className="left-side-box">
            {loading ? (
              <div style={{ textAlign: "center", padding: "50px" }}>
                Loading resume...
              </div>
            ) : (
              <ResumeForm
                data={resumeData}
                onChange={handleResumeChange}
                resumeId={resumeId}
                onResumeIdChange={setResumeId}
              />
            )}
          </div>
        </div>

        <div className="right-side">
          <ResumePreview data={resumeData} />
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}

export default ResumeBuilderPage;
