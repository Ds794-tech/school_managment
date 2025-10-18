
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import SchoolLogin from "./pages/SchoolLogin";
import SchoolDashboard from "./pages/SchoolDashboard";
import SchoolSignup from "./pages/SchoolSignup";
import JobForm from "./pages/JobForm";
import JobApplicants from "./pages/JobApplicants";
import VendorSignup from "./pages/VendorSignup";
import VendorLogin from "./pages/VendorLogin";
import VendorDashboard from "./pages/VendorDashboard";
import BookForm from "./pages/BookForm";


//  Protected Route for Schools

function VendorProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("isVendor") === "true";
  return isAdmin ? children : <Navigate to="/vendor-login" />;
}

// Protected Route for Schools
function SchoolProtectedRoute({ children }) {
  const isSchool = localStorage.getItem("isSchool") === "true";
  return isSchool ? children : <Navigate to="/school-login" />;
}

// Protected Route for Admin
function AdminProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/" />;
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSchool, setIsSchool] = useState(false);
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "true") setIsAdmin(true);
    if (localStorage.getItem("isSchool") === "true") setIsSchool(true);
    if (localStorage.getItem("isVendor") === "true") setIsVendor(true);
  }, []);

  return (
    <Routes>
      {/* Admin login */}
      <Route path="/" element={<Login setIsAdmin={setIsAdmin} />} />
      <Route path="/jobs/:jobId/applicants" element={<JobApplicants setIsSchool={() => { }} />} />

      {/* Admin dashboard (protected) */}
      <Route
        path="/admin-dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard setIsAdmin={setIsAdmin} />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/school-login"
        element={<SchoolLogin setIsSchool={setIsSchool} />}
      />

      {/* School dashboard (protected) */}
      <Route
        path="/school-dashboard"
        element={
          <SchoolProtectedRoute>
            <SchoolDashboard setIsSchool={setIsSchool} />
          </SchoolProtectedRoute>
        }
      />
      <Route
        path="/job-form/:id?"
        element={
          <SchoolProtectedRoute>
            <JobForm onSuccess={() => window.location.href = '/school-dashboard'} />
          </SchoolProtectedRoute>
        }
      />

      <Route
        path="/book-form/:id?"
        element={
          <SchoolProtectedRoute>
            <BookForm onSuccess={() => window.location.href = '/school-dashboard'} />
          </SchoolProtectedRoute>
        }
      />

      <Route
        path="/job-applicants/:jobId"
        element={
          <SchoolProtectedRoute>
            <JobApplicants setIsSchool={setIsSchool} />
          </SchoolProtectedRoute>
        }
      />
      {/* School signup */}
      <Route path="/school-signup" element={<SchoolSignup />} />

      {/* Vendor login */}

      <Route path="/vendor-login" element={<VendorLogin setIsVendor={setIsVendor} />} />

      {/* Vendor dashboard (protected) */}
      <Route
        path="/vendor-dashboard"
        element={
          <VendorProtectedRoute>
            <VendorDashboard setIsVendor={setIsVendor} />
          </VendorProtectedRoute>
        }
      />

      {/* School signup */}
      <Route path="/vendor-signup" element={<VendorSignup />} />

    </Routes>
  );
}
