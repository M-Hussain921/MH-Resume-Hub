import { axiosInstance } from "./api.service"; 

const TOKEN_KEY = "admin_token"; 

export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const isLoggedIn = () => !!getToken();

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const loginAdmin = async (username, password) => {
  const res = await axiosInstance.post("/admin/login", {
    identifier: username,
    password,
  });
  return res.data;
};

export const getStats = async () => {
  const res = await axiosInstance.get("/admin/stats", authHeader());
  return res.data;
};

export const getAllResumes = async (params = {}) => {
  const res = await axiosInstance.get("/admin/resumes", {
    ...authHeader(),
    params, 
  });
  return res.data;
};

export const getResumeDetails = async (id) => {
  const res = await axiosInstance.get(`/admin/resumes/${id}`, authHeader());
  return res.data;
};

export const deleteResume = async (id) => {
  const res = await axiosInstance.delete(`/admin/resumes/${id}`, authHeader());
  return res.data;
};

export const bulkDeleteResumes = async (ids) => {
  const res = await axiosInstance.delete("/admin/resumes/bulk", {
    ...authHeader(),
    data: { ids }, 
  });
  return res.data;
};