import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerPatient } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================
  // HANDLE INPUT
  // ============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    setError("");
    setSuccess("");
  };

  // ============================
  // REGISTER PATIENT
  // ============================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.age ||
      !form.gender ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.username.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (Number(form.age) <= 0) {
      setError("Please enter a valid age.");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const patientData = {
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      phone: form.phone.trim(),
      address: form.address.trim(),
      username: form.username.trim(),
      password: form.password,
    };

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response =
        await registerPatient(patientData);

      if (response.data.success) {
        setSuccess(
          "Account created successfully! You can now sign in."
        );

        setForm({
          name: "",
          age: "",
          gender: "",
          phone: "",
          address: "",
          username: "",
          password: "",
          confirmPassword: "",
        });

        // Redirect to login after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(
          response.data.message ||
            "Unable to create account."
        );
      }
    } catch (error) {
      console.log(
        "Patient Registration Error:",
        error
      );

      console.log(
        "Backend Response:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Unable to create account. Please try again."
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

        padding: "40px 15px",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "800px",
        }}
      >
        <div
          className="card shadow-lg border-0"
          style={{
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          {/* HEADER */}

          <div
            className="text-center text-white p-4"
            style={{
              background:
                "linear-gradient(145deg, #0f766e, #164e63)",
            }}
          >
            <div
              style={{
                fontSize: "50px",
              }}
            >
              🏥
            </div>

            <h2 className="mt-2 mb-1">
              Create Patient Account
            </h2>

            <p className="mb-0">
              Register to access the Hospital ERP
              Patient Portal
            </p>
          </div>

          {/* FORM */}

          <div className="card-body p-4 p-md-5">
            <form onSubmit={handleRegister}>
              <h5 className="mb-3">
                Personal Information
              </h5>

              <div className="row">
                {/* NAME */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                {/* AGE */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Age
                  </label>

                  <input
                    type="number"
                    name="age"
                    min="1"
                    max="120"
                    className="form-control"
                    placeholder="Enter age"
                    value={form.age}
                    onChange={handleChange}
                  />
                </div>

                {/* GENDER */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Gender
                  </label>

                  <select
                    name="gender"
                    className="form-select"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Gender
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                {/* PHONE */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* ADDRESS */}

                <div className="col-12 mb-4">
                  <label className="form-label">
                    Address
                  </label>

                  <textarea
                    name="address"
                    className="form-control"
                    rows="3"
                    placeholder="Enter address"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <hr />

              <h5 className="mb-3 mt-4">
                Login Information
              </h5>

              <div className="row">
                {/* USERNAME */}

                <div className="col-12 mb-3">
                  <label className="form-label">
                    Username
                  </label>

                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="Choose a username"
                    value={form.username}
                    onChange={handleChange}
                  />

                  <small className="text-muted">
                    This username will be used to
                    sign in to your Patient Portal.
                  </small>
                </div>

                {/* PASSWORD */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Create password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>

                {/* CONFIRM PASSWORD */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirm password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* ERROR */}

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              {/* BUTTONS */}

              <button
                type="submit"
                className="btn btn-success btn-lg w-100 mt-2"
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary w-100 mt-3"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                ← Back to Sign In
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-muted mt-3">
          Hospital ERP System — Patient Registration
        </p>
      </div>
    </div>
  );
}

export default Register;