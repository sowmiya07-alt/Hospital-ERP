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

      // Role mismatch check if specific role selected
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
      return "Access patient charts, log clinical vitals, manage appointments & create multi-item prescriptions.";
    if (selectedRole === "PATIENT")
      return "View your medical history, check upcoming appointments, track prescriptions & pay hospital invoices.";
    if (selectedRole === "ADMIN")
      return "Manage hospital operations, doctors, patients, inventory stock, revenue analytics & system config.";
    return "Sign in to access your hospital account.";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0d9488 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        className="shadow-lg"
        style={{
          width: "100%",
          maxWidth: selectedRole === null ? "960px" : "460px",
          background: "#ffffff",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* ============================================================ */}
        {/* VIEW 1: COMPACT & ATTRACTIVE ROLE SELECTION LANDING PAGE    */}
        {/* ============================================================ */}
        {selectedRole === null ? (
          <div className="p-4 p-md-5">
            {/* HEADER */}
            <div className="text-center mb-4">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "56px",
                  height: "56px",
                  background: "#ccfbf1",
                  borderRadius: "14px",
                  fontSize: "30px",
                  marginBottom: "10px",
                  boxShadow: "0 4px 12px rgba(13, 148, 136, 0.15)",
                }}
              >
                🏥
              </div>
              <h2 className="fw-bold mb-1" style={{ color: "#0f172a", fontSize: "26px", letterSpacing: "-0.5px" }}>
                Hospital ERP
              </h2>
              <p className="text-teal fw-semibold mb-1" style={{ color: "#0d9488", fontSize: "14px" }}>
                Smart Healthcare Management System
              </p>
              <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                Select your portal to log in to the hospital management platform
              </p>
            </div>

            {/* COMPACT ROLE CARDS GRID */}
            <div className="row g-3 justify-content-center">
              {/* DOCTOR CARD */}
              <div className="col-md-4">
                <div
                  className="card h-100 border-0 p-3 text-center d-flex flex-column justify-content-between"
                  style={{
                    borderRadius: "14px",
                    background: "#f0f9ff",
                    border: "1px solid #bae6fd",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "36px", marginBottom: "8px" }}>👨‍⚕️</div>
                    <span
                      className="badge bg-info text-dark mb-2"
                      style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "12px" }}
                    >
                      Medical Staff
                    </span>
                    <h5 className="fw-bold mb-1" style={{ color: "#0f172a", fontSize: "19px" }}>
                      DOCTOR
                    </h5>
                    <p className="text-muted mb-3" style={{ fontSize: "12px", lineHeight: "1.4" }}>
                      Log clinical consultations, vitals, diagnosis & digital prescriptions.
                    </p>

                    <div className="text-start bg-white p-2 mb-3 rounded-2 border" style={{ fontSize: "11px" }}>
                      <div className="text-secondary mb-1">✓ Consultations & Vitals Log</div>
                      <div className="text-secondary mb-1">✓ Patient Medical Profiles</div>
                      <div className="text-secondary">✓ Multi-Item Prescriptions</div>
                    </div>
                  </div>

                  <button
                    className="btn btn-sm btn-primary w-100 fw-bold py-2"
                    style={{
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #0284c7, #0369a1)",
                      border: "none",
                      fontSize: "13px",
                    }}
                    onClick={() => handleSelectRole("DOCTOR")}
                  >
                    Doctor Sign In →
                  </button>
                </div>
              </div>

              {/* PATIENT CARD */}
              <div className="col-md-4">
                <div
                  className="card h-100 border-0 p-3 text-center d-flex flex-column justify-content-between"
                  style={{
                    borderRadius: "14px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "36px", marginBottom: "8px" }}>🧑</div>
                    <span
                      className="badge bg-success mb-2"
                      style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "12px" }}
                    >
                      Patient Portal
                    </span>
                    <h5 className="fw-bold mb-1" style={{ color: "#0f172a", fontSize: "19px" }}>
                      PATIENT
                    </h5>
                    <p className="text-muted mb-3" style={{ fontSize: "12px", lineHeight: "1.4" }}>
                      Book appointments, check prescription history & hospital invoices.
                    </p>

                    <div className="text-start bg-white p-2 mb-3 rounded-2 border" style={{ fontSize: "11px" }}>
                      <div className="text-secondary mb-1">✓ Doctor Appointments</div>
                      <div className="text-secondary mb-1">✓ Prescription Records</div>
                      <div className="text-secondary">✓ Itemized Invoices & Payments</div>
                    </div>
                  </div>

                  <button
                    className="btn btn-sm btn-success w-100 fw-bold py-2"
                    style={{
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #16a34a, #15803d)",
                      border: "none",
                      fontSize: "13px",
                    }}
                    onClick={() => handleSelectRole("PATIENT")}
                  >
                    Patient Sign In →
                  </button>
                </div>
              </div>

              {/* ADMIN CARD */}
              <div className="col-md-4">
                <div
                  className="card h-100 border-0 p-3 text-center d-flex flex-column justify-content-between"
                  style={{
                    borderRadius: "14px",
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "36px", marginBottom: "8px" }}>🛡️</div>
                    <span
                      className="badge bg-dark text-white mb-2"
                      style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "12px" }}
                    >
                      Administrator
                    </span>
                    <h5 className="fw-bold mb-1" style={{ color: "#0f172a", fontSize: "19px" }}>
                      ADMIN
                    </h5>
                    <p className="text-muted mb-3" style={{ fontSize: "12px", lineHeight: "1.4" }}>
                      Full hospital operations oversight, doctor rosters, inventory & revenue.
                    </p>

                    <div className="text-start bg-white p-2 mb-3 rounded-2 border" style={{ fontSize: "11px" }}>
                      <div className="text-secondary mb-1">✓ Staff & Patient Records</div>
                      <div className="text-secondary mb-1">✓ Revenue & Financial Charts</div>
                      <div className="text-secondary">✓ Pharmacy Stock & Dispensing</div>
                    </div>
                  </div>

                  <button
                    className="btn btn-sm btn-dark w-100 fw-bold py-2"
                    style={{
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #1e293b, #0f172a)",
                      border: "none",
                      fontSize: "13px",
                    }}
                    onClick={() => handleSelectRole("ADMIN")}
                  >
                    Admin Sign In →
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center mt-4 text-muted" style={{ fontSize: "12px" }}>
              🔒 Hospital ERP Secure Gateway • Encrypted Access
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* VIEW 2: COMPACT ROLE-SPECIFIC LOGIN FORM                     */
          /* ============================================================ */
          <div className="p-4 p-md-5">
            <button
              className="btn btn-link text-decoration-none p-0 mb-3 text-secondary"
              style={{ fontWeight: "600", fontSize: "13px" }}
              onClick={handleBackToRoles}
            >
              ← Back to Portal Selection
            </button>

            <div className="mb-3">
              <span
                className={`badge mb-2 ${
                  selectedRole === "DOCTOR"
                    ? "bg-info text-dark"
                    : selectedRole === "PATIENT"
                    ? "bg-success"
                    : "bg-dark text-white"
                }`}
                style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "10px" }}
              >
                {getRoleTitle()}
              </span>
              <h3 className="fw-bold mb-1" style={{ color: "#0f172a", fontSize: "22px" }}>
                Welcome Back
              </h3>
              <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                {getRoleDescription()}
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: "13px" }}>
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  style={{ borderRadius: "10px", padding: "10px 14px", fontSize: "14px" }}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: "13px" }}>
                  Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    style={{
                      borderTopLeftRadius: "10px",
                      borderBottomLeftRadius: "10px",
                      padding: "10px 14px",
                      fontSize: "14px",
                    }}
                    required
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      borderTopRightRadius: "10px",
                      borderBottomRightRadius: "10px",
                      fontSize: "13px",
                    }}
                  >
                    {showPassword ? "👁️ Hide" : "👁️ Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger py-2 px-3 mb-3 border-0 rounded-2" style={{ fontSize: "13px" }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                className={`btn w-100 py-2 fw-bold mt-1 ${
                  selectedRole === "DOCTOR"
                    ? "btn-info text-dark"
                    : selectedRole === "PATIENT"
                    ? "btn-success"
                    : "btn-dark"
                }`}
                style={{ borderRadius: "10px", fontSize: "15px" }}
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

            <hr className="my-3 text-muted" />

            {selectedRole === "PATIENT" ? (
              <div className="text-center">
                <p className="text-muted mb-2" style={{ fontSize: "12px" }}>
                  New patient?
                </p>
                <button
                  type="button"
                  className="btn btn-outline-success w-100 fw-semibold btn-sm py-2"
                  style={{ borderRadius: "10px" }}
                  onClick={() => navigate("/register")}
                >
                  Create Patient Account
                </button>
              </div>
            ) : (
              <div className="text-center text-muted" style={{ fontSize: "12px" }}>
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