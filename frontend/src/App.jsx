import { Routes, Route, Navigate } from "react-router-dom";
import ResumeBuilderPage from "../src/components/pages/resumebuilderpage.jsx";

import AdminLogin from "./components/admin/adminlogin.jsx";
import AdminLayout from "./components/admin/adminlayout.jsx";
import AdminDashboard from "./components/admin/admindashboard.jsx";
import AdminResumes from "./components/admin/adminresumes.jsx";
import AdminResumeDetail from "./components/admin/adminresumedetails.jsx";
import ProtectedRoute from "./components/admin/protectedroute.jsx";

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