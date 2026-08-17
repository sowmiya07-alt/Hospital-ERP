import { useEffect, useState, useCallback } from "react";
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

  const [financials, setFinancials] = useState({
    totalRevenue: 0,
    pendingBalance: 0,
    paidCount: 0,
  });

  const [lowStockCount, setLowStockCount] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
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

      const patientList = patientResponse.data || [];
      const doctorList = doctorResponse.data || [];
      const appointmentList = appointmentResponse.data || [];
      const medicineList = medicineResponse.data || [];
      const prescriptionList = prescriptionResponse.data || [];
      const billingList = billingResponse.data || [];

      setCounts({
        patients: patientList.length,
        doctors: doctorList.length,
        appointments: appointmentList.length,
        medicines: medicineList.length,
        prescriptions: prescriptionList.length,
        billings: billingList.length,
      });

      // Calculate financials
      let revenue = 0;
      let pending = 0;
      let paidBills = 0;

      billingList.forEach((b) => {
        const paid = Number(b.paidAmount || (b.paymentStatus === "Paid" ? b.amount : 0));
        const total = Number(b.totalAmount || b.amount || 0);
        revenue += paid;
        if (b.paymentStatus !== "Paid") {
          pending += Math.max(0, total - paid);
        } else {
          paidBills++;
        }
      });

      setFinancials({
        totalRevenue: revenue,
        pendingBalance: pending,
        paidCount: paidBills,
      });

      // Calculate low stock items
      const lowStock = medicineList.filter((m) => Number(m.stock || 0) <= Number(m.reorderLevel || 15)).length;
      setLowStockCount(lowStock);

      // Calculate appointment completion rate
      const completedCount = appointmentList.filter((a) => a.status === "Completed").length;
      const rate = appointmentList.length > 0 ? Math.round((completedCount / appointmentList.length) * 100) : 0;
      setCompletionRate(rate);

      setRecentAppointments(
        [...appointmentList]
          .sort((a, b) => b.id - a.id)
          .slice(0, 5)
      );
    } catch (error) {
      console.log("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const cards = [
    {
      title: "Patients",
      count: counts.patients,
      path: "/patients",
      icon: "👥",
      description: "Registered medical patients",
    },
    {
      title: "Doctors",
      count: counts.doctors,
      path: "/doctors",
      icon: "👨‍⚕️",
      description: "Active medical specialists",
    },
    {
      title: "Appointments",
      count: counts.appointments,
      path: "/appointments",
      icon: "📅",
      description: `${completionRate}% completed rate`,
    },
    {
      title: "Medicines",
      count: counts.medicines,
      path: "/medicines",
      icon: "💊",
      description: lowStockCount > 0 ? `⚠️ ${lowStockCount} low-stock item(s)` : "Stock healthy",
    },
    {
      title: "Prescriptions",
      count: counts.prescriptions,
      path: "/prescriptions",
      icon: "📋",
      description: "Clinical prescription logs",
    },
    {
      title: "Hospital Billing",
      count: counts.billings,
      path: "/billing",
      icon: "💳",
      description: `$${financials.totalRevenue.toFixed(2)} collected`,
    },
  ];

  const getStatusBadge = (status) => {
    if (status === "Completed") return "bg-success";
    if (status === "Cancelled") return "bg-danger";
    return "bg-warning text-dark";
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container-fluid p-4">
        {/* DASHBOARD HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">🏥 Hospital Enterprise ERP Executive Dashboard</h2>
            <p className="text-muted mb-0">Real-time analytical metrics, clinical operations, and financial overview</p>
          </div>
          <button className="btn btn-outline-primary" onClick={loadDashboardData}>
            ↻ Refresh Real-Time Data
          </button>
        </div>

        {/* FINANCIAL & ALERT HIGHLIGHTS */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card bg-primary text-white shadow p-3">
              <h6>Total Hospital Revenue Collected</h6>
              <h2 className="fw-bold">${financials.totalRevenue.toFixed(2)}</h2>
              <small>{financials.paidCount} fully paid invoice(s)</small>
            </div>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card bg-warning text-dark shadow p-3">
              <h6>Pending Accounts Receivable</h6>
              <h2 className="fw-bold">${financials.pendingBalance.toFixed(2)}</h2>
              <small>Outstanding balance due</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-info text-white shadow p-3">
              <h6>Clinical Operations Efficiency</h6>
              <h2 className="fw-bold">{completionRate}% Completed</h2>
              <small>Scheduled appointment fulfillment</small>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3 text-muted">Aggregating hospital analytics...</p>
          </div>
        ) : (
          <>
            {/* DASHBOARD CARDS */}
            <div className="row">
              {cards.map((card) => (
                <div className="col-xl-4 col-md-6 mb-4" key={card.title}>
                  <div className="card shadow h-100">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="text-muted mb-1">{card.title}</p>
                          <h1 className="fw-bold mb-1">{card.count}</h1>
                          <small className="text-muted">{card.description}</small>
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
                        onClick={() => navigate(card.path)}
                      >
                        Manage {card.title} →
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
                    <h4 className="mb-1">Recent Hospital Appointments</h4>
                    <small className="text-muted">Latest 5 appointment bookings</small>
                  </div>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate("/appointments")}
                  >
                    View All Appointments
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover table-striped align-middle mb-0">
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
                          <td colSpan="6" className="text-center py-4 text-muted">
                            No Appointments Found
                          </td>
                        </tr>
                      ) : (
                        recentAppointments.map((a) => (
                          <tr key={a.id}>
                            <td><strong>#{a.id}</strong></td>
                            <td>{a.patient?.name || "N/A"}</td>
                            <td>{a.doctor?.name || "N/A"}</td>
                            <td>{a.appointmentDate}</td>
                            <td>{a.appointmentTime}</td>
                            <td>
                              <span className={`badge ${getStatusBadge(a.status)}`}>
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