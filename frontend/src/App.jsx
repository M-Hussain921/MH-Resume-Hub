import { Routes, Route, Navigate } from "react-router-dom";
import ResumeBuilderPage from "../src/components/pages/ResumeBuilderPage";

import AdminLogin from "./components/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminResumes from "./components/admin/AdminResumes";
import AdminResumeDetail from "./components/admin/AdminResumeDetails";
import ProtectedRoute from "./components/admin/ProtectedRoute";

function App() {
  return (
    <Routes>

      <Route path="/" element={<ResumeBuilderPage />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<AdminDashboard />} />

        <Route path="resumes" element={<AdminResumes />} />

        <Route path="resumes/:id" element={<AdminResumeDetail />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;