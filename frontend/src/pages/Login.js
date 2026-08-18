import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  // Selected role: null (Role Selection View) or "PATIENT", "DOCTOR", "ADMIN" (Login Form View)
  const [selectedRole, setSelectedRole] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Signing you in...");

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setError("");
    setUsername("");
    setPassword("");
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    setError("");
    setUsername("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);
    setLoadingMsg("Connecting to hospital server...");
    setError("");

    try {
      const response = await loginUser({
        username: username.trim(),
        password,
      });

      setLoadingMsg("Signing you in...");
      const data = response.data;

      if (!data.success) {
        setError(data.message || "Invalid username or password");
        return;
      }

      // Check for role mismatch if user selected a specific portal
      if (selectedRole && data.role !== selectedRole) {
        setError(
          `This account is registered as ${data.role}. Please select the ${data.role} Portal to sign in.`
        );
        return;
      }

      // Store authentication data
      localStorage.clear();
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      // Redirect according to role
      if (data.role === "ADMIN") {
        navigate("/dashboard");
        return;
      }

      if (data.role === "DOCTOR") {
        if (data.doctorId == null) {
          localStorage.clear();
          setError("Doctor account is not linked to a doctor profile.");
          return;
        }
        localStorage.setItem("doctorId", String(data.doctorId));
        navigate("/doctor-dashboard");
        return;
      }

      if (data.role === "PATIENT") {
        if (data.patientId == null) {
          localStorage.clear();
          setError("Patient account is not linked to a patient record.");
          return;
        }
        localStorage.setItem("patientId", String(data.patientId));
        navigate("/patient-dashboard");
        return;
      }

      localStorage.clear();
      setError("Invalid user role assigned to this account.");
    } catch (err) {
      console.log("Login Error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to connect to the hospital server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getRoleTitle = () => {
    if (selectedRole === "DOCTOR") return "DOCTOR PORTAL";
    if (selectedRole === "PATIENT") return "PATIENT PORTAL";
    if (selectedRole === "ADMIN") return "ADMINISTRATOR PORTAL";
    return "HOSPITAL PORTAL";
  };

  const getRoleDescription = () => {
    if (selectedRole === "DOCTOR")
      return "Access patient records, log clinical vitals, manage appointments & create multi-item prescriptions.";
    if (selectedRole === "PATIENT")
      return "View your medical history, check upcoming appointments, track prescriptions & pay hospital invoices.";
    if (selectedRole === "ADMIN")
      return "Manage hospital operations, doctors, patients, inventory stock, revenue analytics & system configuration.";
    return "Sign in to access your hospital management account.";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f766e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        className="shadow-lg"
        style={{
          width: "100%",
          maxWidth: selectedRole === null ? "1100px" : "520px",
          background: "#ffffff",
          borderRadius: "24px",
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {/* ============================================================ */}
        {/* VIEW 1: ROLE SELECTION LANDING PAGE                           */}
        {/* ============================================================ */}
        {selectedRole === null ? (
          <div className="p-5">
            {/* BRAND HEADER */}
            <div className="text-center mb-5">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "80px",
                  height: "80px",
                  background: "#e6fffa",
                  color: "#0d9488",
                  borderRadius: "20px",
                  fontSize: "42px",
                  marginBottom: "16px",
                  boxShadow: "0 10px 25px -5px rgba(13, 148, 136, 0.2)",
                }}
              >
                🏥
              </div>
              <h1 className="fw-bold mb-2" style={{ color: "#0f172a", fontSize: "36px" }}>
                Hospital ERP
              </h1>
              <p className="text-primary fw-semibold mb-2" style={{ fontSize: "18px" }}>
                Smart Healthcare Management System
              </p>
              <p className="text-muted mb-0" style={{ fontSize: "15px" }}>
                Select your access portal to log in to the hospital management system
              </p>
            </div>

            {/* ROLE CARDS GRID */}
            <div className="row g-4 justify-content-center">
              {/* DOCTOR CARD */}
              <div className="col-lg-4 col-md-6">
                <div
                  className="card h-100 border-0 shadow-sm p-4 text-center role-card"
                  style={{
                    borderRadius: "18px",
                    background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
                    border: "1.5px solid #e2e8f0",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: "52px",
                      marginBottom: "15px",
                    }}
                  >
                    👨‍⚕️
                  </div>
                  <span
                    className="badge bg-info text-dark mb-2 mx-auto"
                    style={{ width: "fit-content", padding: "6px 14px", borderRadius: "20px" }}
                  >
                    Medical Staff
                  </span>
                  <h3 className="fw-bold mb-2" style={{ color: "#0f172a" }}>
                    DOCTOR
                  </h3>
                  <p className="text-muted small mb-4" style={{ minHeight: "60px" }}>
                    Manage patient appointments, record clinical consultations, diagnosis logs & digital prescriptions.
                  </p>

                  <div className="text-start mb-4 bg-white p-3 rounded-3 border">
                    <div className="small text-secondary mb-1">✓ Clinical Consultations & Vitals</div>
                    <div className="small text-secondary mb-1">✓ Patient Medical Profiles</div>
                    <div className="small text-secondary">✓ Digital Multi-Item Prescriptions</div>
                  </div>

                  <button
                    className="btn btn-primary w-100 fw-bold py-2 mt-auto"
                    style={{
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #0284c7, #0369a1)",
                      border: "none",
                    }}
                    onClick={() => handleSelectRole("DOCTOR")}
                  >
                    Doctor Sign In →
                  </button>
                </div>
              </div>

              {/* PATIENT CARD */}
              <div className="col-lg-4 col-md-6">
                <div
                  className="card h-100 border-0 shadow-sm p-4 text-center role-card"
                  style={{
                    borderRadius: "18px",
                    background: "linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)",
                    border: "1.5px solid #bbf7d0",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: "52px",
                      marginBottom: "15px",
                    }}
                  >
                    🧑
                  </div>
                  <span
                    className="badge bg-success mb-2 mx-auto"
                    style={{ width: "fit-content", padding: "6px 14px", borderRadius: "20px" }}
                  >
                    Patient Portal
                  </span>
                  <h3 className="fw-bold mb-2" style={{ color: "#0f172a" }}>
                    PATIENT
                  </h3>
                  <p className="text-muted small mb-4" style={{ minHeight: "60px" }}>
                    Book doctor appointments, check medical prescriptions, view itemized receipts & medication reminders.
                  </p>

                  <div className="text-start mb-4 bg-white p-3 rounded-3 border">
                    <div className="small text-secondary mb-1">✓ Appointment Bookings</div>
                    <div className="small text-secondary mb-1">✓ Prescription History</div>
                    <div className="small text-secondary">✓ Billing & Invoice Downloads</div>
                  </div>

                  <button
                    className="btn btn-success w-100 fw-bold py-2 mt-auto"
                    style={{
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #16a34a, #15803d)",
                      border: "none",
                    }}
                    onClick={() => handleSelectRole("PATIENT")}
                  >
                    Patient Sign In →
                  </button>
                </div>
              </div>

              {/* ADMIN CARD */}
              <div className="col-lg-4 col-md-6">
                <div
                  className="card h-100 border-0 shadow-sm p-4 text-center role-card"
                  style={{
                    borderRadius: "18px",
                    background: "linear-gradient(180deg, #fefce8 0%, #fef9c3 100%)",
                    border: "1.5px solid #fef08a",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: "52px",
                      marginBottom: "15px",
                    }}
                  >
                    🛡️
                  </div>
                  <span
                    className="badge bg-warning text-dark mb-2 mx-auto"
                    style={{ width: "fit-content", padding: "6px 14px", borderRadius: "20px" }}
                  >
                    System Administration
                  </span>
                  <h3 className="fw-bold mb-2" style={{ color: "#0f172a" }}>
                    ADMIN
                  </h3>
                  <p className="text-muted small mb-4" style={{ minHeight: "60px" }}>
                    Full hospital operations oversight, doctor rosters, inventory dispensing, financial revenue & reports.
                  </p>

                  <div className="text-start mb-4 bg-white p-3 rounded-3 border">
                    <div className="small text-secondary mb-1">✓ Doctor & Patient Records</div>
                    <div className="small text-secondary mb-1">✓ Revenue & Financial Analytics</div>
                    <div className="small text-secondary">✓ Pharmacy Stock & Dispensing</div>
                  </div>

                  <button
                    className="btn btn-dark w-100 fw-bold py-2 mt-auto"
                    style={{
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #1e293b, #0f172a)",
                      border: "none",
                    }}
                    onClick={() => handleSelectRole("ADMIN")}
                  >
                    Admin Sign In →
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center mt-5 text-muted small">
              🔒 Hospital ERP Secure Gateway • Encrypted Access • 24/7 Clinical Support
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* VIEW 2: ROLE-SPECIFIC LOGIN FORM                             */
          /* ============================================================ */
          <div className="p-5">
            {/* BACK TO ROLE SELECTION BUTTON */}
            <button
              className="btn btn-link text-decoration-none p-0 mb-4 text-secondary"
              style={{ fontWeight: "600", fontSize: "14px" }}
              onClick={handleBackToRoles}
            >
              ← Back to Portal Selection
            </button>

            {/* PORTAL BADGE & TITLE */}
            <div className="mb-4">
              <span
                className={`badge mb-2 ${
                  selectedRole === "DOCTOR"
                    ? "bg-info text-dark"
                    : selectedRole === "PATIENT"
                    ? "bg-success"
                    : "bg-dark"
                }`}
                style={{ fontSize: "12px", padding: "6px 14px", borderRadius: "12px" }}
              >
                {getRoleTitle()}
              </span>
              <h2 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                Welcome Back
              </h2>
              <p className="text-muted small mb-0">{getRoleDescription()}</p>
            </div>

            {/* LOGIN FORM */}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary">Username</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  style={{ borderRadius: "12px", fontSize: "15px" }}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control form-control-lg"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    style={{
                      borderTopLeftRadius: "12px",
                      borderBottomLeftRadius: "12px",
                      fontSize: "15px",
                    }}
                    required
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      borderTopRightRadius: "12px",
                      borderBottomRightRadius: "12px",
                    }}
                  >
                    {showPassword ? "👁️ Hide" : "👁️ Show"}
                  </button>
                </div>
              </div>

              {/* ERROR ALERT */}
              {error && (
                <div className="alert alert-danger py-2 px-3 mb-3 small rounded-3" role="alert">
                  ⚠️ {error}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className={`btn w-100 py-3 fw-bold mt-2 ${
                  selectedRole === "DOCTOR"
                    ? "btn-info text-dark"
                    : selectedRole === "PATIENT"
                    ? "btn-success"
                    : "btn-dark"
                }`}
                style={{ borderRadius: "12px", fontSize: "16px" }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    {loadingMsg}
                  </>
                ) : (
                  `Sign In to ${selectedRole}`
                )}
              </button>
            </form>

            <hr className="my-4 text-muted" />

            {/* DYNAMIC REGISTRATION & ACCOUNT PROVISIONING INFO */}
            {selectedRole === "PATIENT" ? (
              <div className="text-center">
                <p className="text-muted small mb-2">New patient?</p>
                <button
                  type="button"
                  className="btn btn-outline-success w-100 fw-semibold"
                  style={{ borderRadius: "12px" }}
                  onClick={() => navigate("/register")}
                >
                  Create Patient Account
                </button>
              </div>
            ) : (
              <div className="text-center text-muted small">
                ℹ️ Doctor & Admin accounts are provisioned by hospital system administration.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;