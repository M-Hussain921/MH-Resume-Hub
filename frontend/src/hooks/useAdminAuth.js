import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as adminApi from "../services/admin.service";

export const useAdminAuth = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(adminApi.isLoggedIn());

  const navigate = useNavigate(); 

  const login = async (username, password) => {
  const data = await adminApi.loginAdmin(username, password);

  if (!data?.token) {
    throw new Error("Invalid login response: token missing");
  }

  adminApi.saveToken(data.token);
  setIsAuthenticated(true);
  navigate("/admin/dashboard");
};

  const logout = () => {
    adminApi.removeToken();       
    setIsAuthenticated(false);    
    navigate("/admin/login");     
  };

  return { isAuthenticated, login, logout };
};