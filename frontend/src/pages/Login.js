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

    if (!username.trim() || !password) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await loginUser({
        username: username.trim(),
        password,
      });

      const data = response.data;

      console.log("Login Response:", data);

      if (!data.success) {
        setError(
          data.message ||
            "Invalid username or password"
        );
        return;
      }

      // Remove previous login information
      localStorage.clear();

      // Store common login information
      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      localStorage.setItem(
        "username",
        data.username
      );

      localStorage.setItem(
        "role",
        data.role
      );

      // =========================
      // ADMIN LOGIN
      // =========================

      if (data.role === "ADMIN") {
        navigate("/dashboard");
        return;
      }

      // =========================
      // DOCTOR LOGIN
      // =========================

      if (data.role === "DOCTOR") {

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

        navigate(
          "/doctor-dashboard"
        );

        return;
      }

      // =========================
      // PATIENT LOGIN
      // =========================

      if (data.role === "PATIENT") {

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

        navigate(
          "/patient-dashboard"
        );

        return;
      }

      // UNKNOWN ROLE

      localStorage.clear();

      setError(
        "Invalid user role"
      );

    } catch (error) {

      console.log(
        "Login Error:",
        error
      );

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
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e8f5f5 0%, #f8fbfc 50%, #eaf2ff 100%)",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        padding: "30px 15px",
      }}
    >

      <div
        className="shadow-lg"
        style={{
          width: "100%",
          maxWidth: "950px",

          background: "white",

          borderRadius: "20px",

          overflow: "hidden",
        }}
      >

        <div className="row g-0">

          {/* ======================= */}
          {/* LEFT SIDE */}
          {/* ======================= */}

          <div
            className="
              col-md-6
              d-none
              d-md-flex
              align-items-center
              justify-content-center
            "
            style={{
              minHeight: "600px",

              background:
                "linear-gradient(145deg, #0f766e, #164e63)",

              color: "white",
            }}
          >

            <div
              style={{
                padding: "55px",
              }}
            >

              <div
                style={{
                  fontSize: "70px",
                }}
              >
                🏥
              </div>

              <h1
                className="mt-4"
                style={{
                  fontWeight: "700",
                }}
              >
                Hospital ERP
              </h1>

              <p
                className="mt-3"
                style={{
                  fontSize: "18px",

                  lineHeight: "1.8",

                  opacity: "0.9",
                }}
              >

                A centralized hospital
                management platform for
                patients, doctors and
                administrators.

              </p>

              <hr
                style={{
                  opacity: "0.3",
                }}
              />

              <p
                style={{
                  opacity: "0.85",
                }}
              >
                ✓ Appointment Management
              </p>

              <p
                style={{
                  opacity: "0.85",
                }}
              >
                ✓ Doctor & Patient Portal
              </p>

              <p
                style={{
                  opacity: "0.85",
                }}
              >
                ✓ Prescription Management
              </p>

              <p
                style={{
                  opacity: "0.85",
                }}
              >
                ✓ Medication Reminders
              </p>

              <p
                style={{
                  opacity: "0.85",
                }}
              >
                ✓ Billing Management
              </p>

            </div>

          </div>


          {/* ======================= */}
          {/* RIGHT SIDE - LOGIN */}
          {/* ======================= */}

          <div
            className="col-md-6"
            style={{
              padding:
                "55px 45px",
            }}
          >

            <div
              className="
                text-center
                d-md-none
                mb-4
              "
            >

              <div
                style={{
                  fontSize: "55px",
                }}
              >
                🏥
              </div>

            </div>

            <h2
              style={{
                fontWeight: "700",
              }}
            >
              Welcome Back
            </h2>

            <p
              className="text-muted mb-4"
            >
              Sign in to access your
              Hospital ERP account.
            </p>


            {/* LOGIN FORM */}

            <form
              onSubmit={
                handleLogin
              }
            >

              <label
                className="
                  form-label
                  fw-semibold
                "
              >
                Username
              </label>

              <input
                type="text"

                className="
                  form-control
                  form-control-lg
                  mb-3
                "

                placeholder="Enter your username"

                value={
                  username
                }

                onChange={(e) => {

                  setUsername(
                    e.target.value
                  );

                  setError("");

                }}
              />


              <label
                className="
                  form-label
                  fw-semibold
                "
              >
                Password
              </label>

              <input
                type="password"

                className="
                  form-control
                  form-control-lg
                  mb-3
                "

                placeholder="Enter your password"

                value={
                  password
                }

                onChange={(e) => {

                  setPassword(
                    e.target.value
                  );

                  setError("");

                }}
              />


              {/* ERROR */}

              {error && (

                <div
                  className="
                    alert
                    alert-danger
                    py-2
                  "
                >
                  {error}
                </div>

              )}


              {/* LOGIN BUTTON */}

              <button
                type="submit"

                className="
                  btn
                  btn-dark
                  btn-lg
                  w-100
                  mt-2
                "

                disabled={
                  loading
                }
              >

                {loading
                  ? "Signing in..."
                  : "Sign In"}

              </button>

            </form>


            {/* ======================= */}
            {/* PATIENT SIGN UP */}
            {/* ======================= */}

            <div
              className="
                text-center
                mt-4
              "
            >

              <p
                className="
                  text-muted
                  mb-2
                "
              >
                New patient?
              </p>

              <button
                type="button"

                className="
                  btn
                  btn-outline-primary
                  w-100
                "

                onClick={() =>
                  navigate(
                    "/register"
                  )
                }
              >
                Create Patient Account
              </button>

            </div>


            <hr
              className="my-4"
            />


            {/* ACCOUNT INFORMATION */}

            <div
              className="
                text-center
                text-muted
              "
              style={{
                fontSize: "14px",
              }}
            >

              <p className="mb-1">

                Doctors receive their
                login credentials from
                the hospital administrator.

              </p>

              <p className="mb-0">

                Patient accounts can be
                created using the
                registration option.

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;