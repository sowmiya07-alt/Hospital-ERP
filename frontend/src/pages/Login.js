import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await loginUser({
        username,
        password,
      });

      const data = response.data;

      console.log("Login Response:", data);

      if (data.success) {
        // Clear previous login information
        localStorage.clear();

        // Store common login information
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);

        // =========================
        // ADMIN LOGIN
        // =========================

        if (data.role === "ADMIN") {
          navigate("/dashboard");
        }

        // =========================
        // DOCTOR LOGIN
        // =========================

        else if (data.role === "DOCTOR") {
          if (data.doctorId == null) {
            localStorage.clear();

            setError(
              "Doctor account is not linked to a doctor record."
            );

            return;
          }

          localStorage.setItem(
            "doctorId",
            String(data.doctorId)
          );

          navigate("/doctor-dashboard");
        }

        // =========================
        // PATIENT LOGIN
        // =========================

        else if (data.role === "PATIENT") {
          if (data.patientId == null) {
            localStorage.clear();

            setError(
              "Patient account is not linked to a patient record."
            );

            return;
          }

          localStorage.setItem(
            "patientId",
            String(data.patientId)
          );

          navigate("/patient-dashboard");
        }

        // UNKNOWN ROLE
        else {
          localStorage.clear();
          setError("Invalid user role");
        }
      } else {
        setError(
          data.message ||
            "Invalid username or password"
        );
      }
    } catch (error) {
      console.log("Login Error:", error);
      console.log(
        "Backend Response:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "#f1f3f5",
      }}
    >
      <div
        className="card shadow p-4"
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <div className="text-center mb-4">

          <div style={{ fontSize: "50px" }}>
            🏥
          </div>

          <h2 className="mt-2 mb-1">
            Hospital ERP
          </h2>

          <p className="text-muted">
            Hospital Management System
          </p>

        </div>

        <form onSubmit={handleLogin}>

          <label className="form-label">
            Username
          </label>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
          />

          <label className="form-label">
            Password
          </label>

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />

          {error && (
            <div className="alert alert-danger py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p className="text-center text-muted mt-4 mb-0">
          Hospital ERP System
        </p>

      </div>
    </div>
  );
}

export default Login;