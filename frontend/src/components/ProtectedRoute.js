import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn");

  const role =
    localStorage.getItem("role");

  // Not logged in → Login page
  if (isLoggedIn !== "true") {
    return <Navigate to="/" replace />;
  }

  // Logged in, but wrong role
  if (
    allowedRoles &&
    !allowedRoles.includes(role)
  ) {
    // Redirect each role to its correct dashboard

    if (role === "ADMIN") {
      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );
    }

    if (role === "DOCTOR") {
      return (
        <Navigate
          to="/doctor-dashboard"
          replace
        />
      );
    }

    if (role === "PATIENT") {
      return (
        <Navigate
          to="/patient-dashboard"
          replace
        />
      );
    }

    return <Navigate to="/" replace />;
  }

  // Correct login + correct role
  return children;
}

export default ProtectedRoute;