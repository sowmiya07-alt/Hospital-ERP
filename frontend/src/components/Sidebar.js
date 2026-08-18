import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Patients", path: "/patients", icon: "👥" },
    { name: "Doctors", path: "/doctors", icon: "👨‍⚕️" },
    { name: "Appointments", path: "/appointments", icon: "📅" },
    { name: "Medicines", path: "/medicines", icon: "💊" },
    { name: "Prescriptions", path: "/prescriptions", icon: "📋" },
    { name: "Lab & Diagnostics", path: "/labs", icon: "🧪" },
    { name: "Admissions & Beds", path: "/admissions", icon: "🛏️" },
    { name: "Billing", path: "/billing", icon: "💳" },
    { name: "Audit Logs", path: "/audit-logs", icon: "📜" },
  ];

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");

    navigate("/");
  };

  return (
    <div className="hospital-sidebar">

      {/* HEADER */}

      <div className="sidebar-header">

        <div className="hospital-logo">
          🏥
        </div>

        <h3>Hospital ERP</h3>

        <p>Management System</p>

      </div>

      {/* MENU */}

      <div className="sidebar-menu">

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >

            <span className="sidebar-icon">
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>

          </NavLink>

        ))}

      </div>

      {/* LOGOUT */}

      <button
        className="sidebar-logout"
        onClick={handleLogout}
      >
        <span>🚪</span>

        <span>Logout</span>
      </button>

      {/* FOOTER */}

      <div className="sidebar-footer">

        <small>
          Hospital ERP System
        </small>

      </div>

    </div>
  );
}

export default Sidebar;