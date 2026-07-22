import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

import { getPatients } from "../services/patientService";
import { getDoctors } from "../services/doctorService";
import { getAppointments } from "../services/appointmentService";
import { getMedicines } from "../services/medicineService";
import { getPrescriptions } from "../services/prescriptionService";
import { getBillings } from "../services/billingService";

function Dashboard() {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    medicines: 0,
    prescriptions: 0,
    billings: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);

    try {
      const [
        patientResponse,
        doctorResponse,
        appointmentResponse,
        medicineResponse,
        prescriptionResponse,
        billingResponse,
      ] = await Promise.all([
        getPatients(),
        getDoctors(),
        getAppointments(),
        getMedicines(),
        getPrescriptions(),
        getBillings(),
      ]);

      setCounts({
        patients: patientResponse.data?.length || 0,
        doctors: doctorResponse.data?.length || 0,
        appointments: appointmentResponse.data?.length || 0,
        medicines: medicineResponse.data?.length || 0,
        prescriptions: prescriptionResponse.data?.length || 0,
        billings: billingResponse.data?.length || 0,
      });

      const appointments = appointmentResponse.data || [];

      setRecentAppointments(
        [...appointments]
          .sort((a, b) => b.id - a.id)
          .slice(0, 5)
      );
    } catch (error) {
      console.log("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Patients",
      count: counts.patients,
      path: "/patients",
      icon: "👥",
      description: "Registered patients",
    },
    {
      title: "Doctors",
      count: counts.doctors,
      path: "/doctors",
      icon: "👨‍⚕️",
      description: "Available doctors",
    },
    {
      title: "Appointments",
      count: counts.appointments,
      path: "/appointments",
      icon: "📅",
      description: "Appointment records",
    },
    {
      title: "Medicines",
      count: counts.medicines,
      path: "/medicines",
      icon: "💊",
      description: "Medicines in inventory",
    },
    {
      title: "Prescriptions",
      count: counts.prescriptions,
      path: "/prescriptions",
      icon: "📋",
      description: "Prescription records",
    },
    {
      title: "Billing Records",
      count: counts.billings,
      path: "/billing",
      icon: "💳",
      description: "Patient billing records",
    },
  ];

  const getStatusBadge = (status) => {
    if (status === "Completed") {
      return "bg-success";
    }

    if (status === "Cancelled") {
      return "bg-danger";
    }

    return "bg-warning text-dark";
  };

  return (
    <div className="d-flex">

      <Sidebar />

      <div className="container-fluid p-4">

        {/* DASHBOARD HEADER */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="mb-1">
              Hospital ERP Dashboard
            </h2>

            <p className="text-muted mb-0">
              Overview of hospital management records
            </p>
          </div>

          <button
            className="btn btn-outline-secondary"
            onClick={loadDashboardData}
          >
            ↻ Refresh
          </button>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="text-center p-5">
            <div
              className="spinner-border"
              role="status"
            />

            <p className="mt-3 text-muted">
              Loading dashboard...
            </p>
          </div>

        ) : (

          <>
            {/* DASHBOARD CARDS */}

            <div className="row">

              {cards.map((card) => (

                <div
                  className="col-xl-4 col-md-6 mb-4"
                  key={card.title}
                >

                  <div className="card shadow h-100">

                    <div className="card-body p-4">

                      <div className="d-flex justify-content-between align-items-start">

                        <div>

                          <p className="text-muted mb-1">
                            {card.title}
                          </p>

                          <h1 className="fw-bold mb-1">
                            {card.count}
                          </h1>

                          <small className="text-muted">
                            {card.description}
                          </small>

                        </div>

                        <div
                          style={{
                            fontSize: "35px",
                            background: "#f1f3f5",
                            width: "65px",
                            height: "65px",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {card.icon}
                        </div>

                      </div>

                      <hr />

                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          navigate(card.path)
                        }
                      >
                        View {card.title} →
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            {/* RECENT APPOINTMENTS */}

            <div className="card shadow mt-2">

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <div>

                    <h4 className="mb-1">
                      Recent Appointments
                    </h4>

                    <small className="text-muted">
                      Latest 5 appointment records
                    </small>

                  </div>

                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      navigate("/appointments")
                    }
                  >
                    View All Appointments
                  </button>

                </div>

                <div className="table-responsive">

                  <table className="table table-bordered table-hover">

                    <thead className="table-dark">

                      <tr>
                        <th>ID</th>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                      </tr>

                    </thead>

                    <tbody>

                      {recentAppointments.length === 0 ? (

                        <tr>

                          <td
                            colSpan="6"
                            className="text-center py-4 text-muted"
                          >
                            No Appointments Found
                          </td>

                        </tr>

                      ) : (

                        recentAppointments.map((a) => (

                          <tr key={a.id}>

                            <td>
                              {a.id}
                            </td>

                            <td>
                              {a.patient?.name || "N/A"}
                            </td>

                            <td>
                              {a.doctor?.name || "N/A"}
                            </td>

                            <td>
                              {a.appointmentDate}
                            </td>

                            <td>
                              {a.appointmentTime}
                            </td>

                            <td>

                              <span
                                className={`badge ${getStatusBadge(
                                  a.status
                                )}`}
                              >
                                {a.status || "Scheduled"}
                              </span>

                            </td>

                          </tr>

                        ))

                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          </>

        )}

      </div>

    </div>
  );
}

export default Dashboard;