import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Selected role: null (Role Selection View) or "PATIENT", "DOCTOR", "ADMIN"
  const [selectedRole, setSelectedRole] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Signing you in...");

  useEffect(() => {
    // Check if coming from registration or URL query param
    const params = new URLSearchParams(location.search);
    const roleParam = params.get("role");
    const registered = params.get("registered");

    if (roleParam === "PATIENT" || roleParam === "DOCTOR" || roleParam === "ADMIN") {
      setSelectedRole(roleParam);
    }
    if (registered === "true") {
      setSuccess("Patient account created successfully! Please sign in with your credentials.");
    }
  }, [location]);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setError("");
    setSuccess("");
    setUsername("");
    setPassword("");
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    setError("");
    setSuccess("");
    setUsername("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);
    setLoadingMsg("Connecting to hospital server...");
    setError("");
    setSuccess("");

    try {
      const response = await loginUser({
        username: username.trim(),
        password,
      });

      setLoadingMsg("Signing you in...");
      const data = response.data;

      if (!data.success) {
        setError(data.message || "Invalid username or password.");
        return;
      }

      // Check role alignment
      if (selectedRole && data.role !== selectedRole) {
        setError(
          `This account is registered as ${data.role}. Please select the ${data.role} Portal to sign in.`
        );
        return;
      }

      // Store authentication tokens & state
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
      setError("You do not have permission to access this portal.");
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
        {/* VIEW 1: ROLE SELECTION LANDING PAGE                           */}
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
                  color: "#0d9488",
                  marginBottom: "10px",
                  boxShadow: "0 4px 12px rgba(13, 148, 136, 0.15)",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  <path d="M12 5v16"/>
                  <path d="M5 12h14"/>
                </svg>
              </div>
              <h2 className="fw-bold mb-1" style={{ color: "#0f172a", fontSize: "26px", letterSpacing: "-0.5px" }}>
                Hospital ERP
              </h2>
              <p className="fw-semibold mb-1" style={{ color: "#0d9488", fontSize: "14px" }}>
                Smart Healthcare Management System
              </p>
              <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                Select your hospital portal to log in
              </p>
            </div>

            {/* ROLE CARDS GRID */}
            <div className="row g-3 justify-content-center">
              {/* DOCTOR CARD (Professional Blue) */}
              <div className="col-md-4">
                <div
                  className="card h-100 border-0 p-3 text-center d-flex flex-column justify-content-between"
                  style={{
                    borderRadius: "14px",
                    background: "#f0f9ff",
                    border: "1.5px solid #bae6fd",
                    boxShadow: "0 4px 6px -1px rgba(2, 132, 199, 0.08)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "48px",
                        height: "48px",
                        background: "#e0f2fe",
                        color: "#0284c7",
                        borderRadius: "12px",
                        marginBottom: "10px",
                      }}
                    >
                      {/* Stethoscope Icon */}
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4.8 2.3A.3.3 0 0 0 4.5 2h-1a.5.5 0 0 0-.5.5V9a6 6 0 0 0 12 0V2.5a.5.5 0 0 0-.5-.5h-1a.3.3 0 0 0-.3.3v6.7a4 4 0 0 1-8 0V2.3z"/>
                        <path d="M9 15v2a5 5 0 0 0 10 0v-2"/>
                        <circle cx="19" cy="13" r="2"/>
                      </svg>
                    </div>

                    <h5 className="fw-bold mb-1" style={{ color: "#0369a1", fontSize: "18px" }}>
                      DOCTOR
                    </h5>
                    <p className="text-muted mb-3" style={{ fontSize: "12px", lineHeight: "1.4" }}>
                      Manage consultations, patient records, appointments and prescriptions.
                    </p>

                    <div className="text-start bg-white p-2 mb-3 rounded-2 border" style={{ fontSize: "11px" }}>
                      <div className="text-secondary mb-1">✓ Consultations</div>
                      <div className="text-secondary mb-1">✓ Patient Medical Profiles</div>
                      <div className="text-secondary">✓ Digital Prescriptions</div>
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
                    Continue as Doctor →
                  </button>
                </div>
              </div>

              {/* PATIENT CARD (Professional Green) */}
              <div className="col-md-4">
                <div
                  className="card h-100 border-0 p-3 text-center d-flex flex-column justify-content-between"
                  style={{
                    borderRadius: "14px",
                    background: "#f0fdf4",
                    border: "1.5px solid #bbf7d0",
                    boxShadow: "0 4px 6px -1px rgba(22, 163, 74, 0.08)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "48px",
                        height: "48px",
                        background: "#dcfce7",
                        color: "#16a34a",
                        borderRadius: "12px",
                        marginBottom: "10px",
                      }}
                    >
                      {/* Patient/User Heart Icon */}
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>

                    <h5 className="fw-bold mb-1" style={{ color: "#15803d", fontSize: "18px" }}>
                      PATIENT
                    </h5>
                    <p className="text-muted mb-3" style={{ fontSize: "12px", lineHeight: "1.4" }}>
                      Manage appointments, prescriptions, medical records and bills.
                    </p>

                    <div className="text-start bg-white p-2 mb-3 rounded-2 border" style={{ fontSize: "11px" }}>
                      <div className="text-secondary mb-1">✓ Doctor Appointments</div>
                      <div className="text-secondary mb-1">✓ Prescription History</div>
                      <div className="text-secondary">✓ Bills & Payments</div>
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
                    Continue as Patient →
                  </button>
                </div>
              </div>

              {/* ADMIN CARD (Professional Navy/Dark) */}
              <div className="col-md-4">
                <div
                  className="card h-100 border-0 p-3 text-center d-flex flex-column justify-content-between"
                  style={{
                    borderRadius: "14px",
                    background: "#f8fafc",
                    border: "1.5px solid #cbd5e1",
                    boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "48px",
                        height: "48px",
                        background: "#e2e8f0",
                        color: "#1e293b",
                        borderRadius: "12px",
                        marginBottom: "10px",
                      }}
                    >
                      {/* Shield Administration Icon */}
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </div>

                    <h5 className="fw-bold mb-1" style={{ color: "#0f172a", fontSize: "18px" }}>
                      ADMIN
                    </h5>
                    <p className="text-muted mb-3" style={{ fontSize: "12px", lineHeight: "1.4" }}>
                      Manage hospital operations, users, inventory, billing and reports.
                    </p>

                    <div className="text-start bg-white p-2 mb-3 rounded-2 border" style={{ fontSize: "11px" }}>
                      <div className="text-secondary mb-1">✓ Patient & Staff Management</div>
                      <div className="text-secondary mb-1">✓ Revenue & Reports</div>
                      <div className="text-secondary">✓ Pharmacy & Inventory</div>
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
                    Continue as Admin →
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
          /* VIEW 2: ROLE-SPECIFIC AUTHENTICATION                         */
          /* ============================================================ */
          <div className="p-4 p-md-5">
            <button
              className="btn btn-link text-decoration-none p-0 mb-3 text-secondary"
              style={{ fontWeight: "600", fontSize: "13px" }}
              onClick={handleBackToRoles}
            >
              ← Back to portal selection
            </button>

            <div className="mb-3">
              <span
                className={`badge mb-2 ${
                  selectedRole === "DOCTOR"
                    ? "bg-info text-dark"
                    : selectedRole === "PATIENT"
                    ? "bg-success text-white"
                    : "bg-dark text-white"
                }`}
                style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "10px" }}
              >
                {selectedRole} PORTAL
              </span>
              <h3 className="fw-bold mb-1" style={{ color: "#0f172a", fontSize: "22px" }}>
                {selectedRole === "DOCTOR"
                  ? "DOCTOR SIGN IN"
                  : selectedRole === "PATIENT"
                  ? "PATIENT SIGN IN"
                  : "ADMIN SIGN IN"}
              </h3>
              <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                Enter your credentials to access the {selectedRole.toLowerCase()} portal
              </p>
            </div>

            {/* SUCCESS NOTIFICATION */}
            {success && (
              <div className="alert alert-success py-2 px-3 mb-3 border-0 rounded-2" style={{ fontSize: "13px" }}>
                ✅ {success}
              </div>
            )}

            {/* ERROR NOTIFICATION */}
            {error && (
              <div className="alert alert-danger py-2 px-3 mb-3 border-0 rounded-2" style={{ fontSize: "13px" }}>
                ⚠️ {error}
              </div>
            )}

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
                    setSuccess("");
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
                      setSuccess("");
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

              <button
                type="submit"
                className={`btn w-100 py-2 fw-bold mt-1 ${
                  selectedRole === "DOCTOR"
                    ? "btn-primary"
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
                  "Sign In"
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
                ℹ️ Doctor and Administrator accounts are provisioned by hospital system administration.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;