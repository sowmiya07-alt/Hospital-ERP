import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Medicines from "./pages/Medicines";
import Prescriptions from "./pages/Prescriptions";
import Billing from "./pages/Billing";
import LabReports from "./pages/LabReports";
import Admissions from "./pages/Admissions";
import AuditLogs from "./pages/AuditLogs";

import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ========================= */}
        {/* PUBLIC ROUTES */}
        {/* ========================= */}

        {/* LOGIN */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* PATIENT REGISTRATION */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ========================= */}
        {/* ADMIN ROUTES */}
        {/* ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patients"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <Patients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctors"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <Doctors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <Appointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/medicines"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <Medicines />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <Prescriptions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/labs"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN", "DOCTOR", "PATIENT"]}
            >
              <LabReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admissions"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <Admissions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/billing"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <Billing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <AuditLogs />
            </ProtectedRoute>
          }
        />


        {/* ========================= */}
        {/* DOCTOR ROUTE */}
        {/* ========================= */}

        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["DOCTOR"]}
            >
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />


        {/* ========================= */}
        {/* PATIENT ROUTE */}
        {/* ========================= */}

        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["PATIENT"]}
            >
              <PatientDashboard />
            </ProtectedRoute>
          }
        />


        {/* ========================= */}
        {/* INVALID URL */}
        {/* ========================= */}

        <Route
          path="*"
          element={<Login />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;