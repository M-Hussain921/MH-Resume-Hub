import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://mh-resume-hub-backend.onrender.com/api";

export const axiosInstance=axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers:{
    "Content-Type":"application/json",
  },
  timeout:60000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use( 
  (response) => response,
  (error) => {
    console.error(`API error: ${error.response?.status || error.message}`);
    return Promise.reject(error);
  }
);

export const createResume = async (data) => {
  const res = await axiosInstance.post('/resumes',data);
  return res.data;
};

export const getResumeById = async(id) => {
   const res = await axiosInstance.get(`/resumes/${id}`) 
  return res.data;
};

export const getResumeByUserId = async (id) => {
  const res = await axiosInstance.get(`/resumes/${id}`);
  return res.data;
};

export const updateResume = async (id, data) => {
  const res = await axiosInstance.put(`/resumes/${id}`, data);
  return res.data;
};

export const deleteResumeById = async (id) => {
  const res = await axiosInstance.delete(`/resumes/${id}`);
  return res.data;
};

export const updatePersonalInfo = async (id, data) => {
  const res = await axiosInstance.patch(`/resumes/${id}/personal-info`, data);
  return res.data;
};

export const updateTemplateName = async (id, template) => {
  const res = await axiosInstance.patch(`/resumes/${id}/template`, { template });
  return res.data;
};

export const addSkill = async (id, skill) => {
  const res = await axiosInstance.post(`/resumes/${id}/skills`, { skill });
  return res.data;
};

export const removeSkill = async (id, skill) => {
  const res = await axiosInstance.delete(`/resumes/${id}/skills`, {
    data: { skill }   
  });
  return res.data;
};

export const addExperience = async (id, experience) => {
  const res = await axiosInstance.post(`/resumes/${id}/experience`, experience);
  return res.data;
};

export const updateExperience = async (id, expIndex, data) => {
  const res = await axiosInstance.put(
    `/resumes/${id}/experience/${expIndex}`,
    data
  );
  return res.data;
};

export const removeExperience = async (id, expIndex) => {
  const res = await axiosInstance.delete(
    `/resumes/${id}/experience/${expIndex}`
  );
  return res.data;
};

export const addEducation = async (id, education) => {
  const res = await axiosInstance.post(`/resumes/${id}/education`,education);
  return res.data;
};

export const updateEducation = async (id, eduIndex, data) => {
  const res = await axiosInstance.put(
    `/resumes/${id}/education/${eduIndex}`,
    data
  );
  return res.data;
};

export const removeEducation = async (id, eduIndex) => {
  const res = await axiosInstance.delete(
    `/resumes/${id}/education/${eduIndex}`
  );
  return res.data;
};

export const addProject = async (id, project) => {
  const res = await axiosInstance.post(`/resumes/${id}/projects`, project);
  return res.data;
};

export const updateProject = async (id, projIndex, data) => {
  const res = await axiosInstance.put(
    `/resumes/${id}/projects/${projIndex}`,
    data
  );
  return res.data;
};

export const removeProject = async (id, projIndex) => {
  const res = await axiosInstance.delete(
    `/resumes/${id}/projects/${projIndex}`
  );
  return res.data;
};