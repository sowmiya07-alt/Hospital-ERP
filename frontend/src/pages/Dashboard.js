import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getDashboardSummary } from "../services/dashboardService";
import { formatTime12Hour } from "../utils/timeUtils";
import { getPatients } from "../services/patientService";
import { getDoctors } from "../services/doctorService";
import { getAppointments } from "../services/appointmentService";
import { getMedicines } from "../services/medicineService";
import { getBillings } from "../services/billingService";
import { getLabReports } from "../services/labReportService";
import { getAdmissions } from "../services/admissionService";

function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardSummary();
      if (res && res.data) {
        setData(res.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.log("Dashboard summary API failed, using fallback REST services:", err);
      try {
        const [
          patientsRes,
          doctorsRes,
          appointmentsRes,
          medicinesRes,
          billingsRes,
          labsRes,
          admissionsRes,
        ] = await Promise.allSettled([
          getPatients(),
          getDoctors(),
          getAppointments(),
          getMedicines(),
          getBillings(),
          getLabReports(),
          getAdmissions(),
        ]);

        const patients = patientsRes.status === "fulfilled" ? (patientsRes.value.data || []) : [];
        const doctors = doctorsRes.status === "fulfilled" ? (doctorsRes.value.data || []) : [];
        const appointments = appointmentsRes.status === "fulfilled" ? (appointmentsRes.value.data || []) : [];
        const medicines = medicinesRes.status === "fulfilled" ? (medicinesRes.value.data || []) : [];
        const billings = billingsRes.status === "fulfilled" ? (billingsRes.value.data || []) : [];
        const labs = labsRes.status === "fulfilled" ? (labsRes.value.data || []) : [];
        const admissions = admissionsRes.status === "fulfilled" ? (admissionsRes.value.data || []) : [];

        let revenueToday = 0;
        let totalRev = 0;
        let pendingB = 0;

        billings.forEach((b) => {
          const amt = Number(b.amount || b.totalAmount || 0);
          const paid = Number(b.paidAmount || (b.paymentStatus === "Paid" ? amt : 0));
          totalRev += paid;
          if (b.paymentStatus !== "Paid") pendingB++;
        });
        revenueToday = totalRev;

        const lowStock = medicines.filter((m) => Number(m.stock || 0) <= Number(m.reorderLevel || 15)).length;
        const waitingCount = appointments.filter((a) => a.status === "Waiting" || a.status === "CHECKED_IN" || a.status === "Checked-In").length;
        const inConsultCount = appointments.filter((a) => a.status === "In Consultation" || a.status === "IN_CONSULTATION").length;
        const completedCount = appointments.filter((a) => a.status === "Completed" || a.status === "COMPLETED").length;
        const pendingLabsCount = labs.filter((l) => l.status !== "COMPLETED" && l.status !== "CANCELLED").length;
        const activeAdmCount = admissions.filter((a) => a.status === "ADMITTED").length;

        setData({
          totalPatients: patients.length,
          totalDoctors: doctors.length,
          totalAppointments: appointments.length,
          todayAppointmentsCount: appointments.length,
          waitingPatients: waitingCount,
          inConsultation: inConsultCount,
          completedToday: completedCount,
          pendingBills: pendingB,
          revenueToday: revenueToday,
          totalRevenue: totalRev,
          totalMedicines: medicines.length,
          lowStockCount: lowStock,
          pendingLabsCount: pendingLabsCount,
          activeAdmissionsCount: activeAdmCount,
          patientFlow: {
            registeredToday: patients.length,
            checkedIn: appointments.filter((a) => a.status === "CHECKED_IN").length,
            waiting: waitingCount,
            inConsultation: inConsultCount,
            completed: completedCount,
            discharged: admissions.filter((a) => a.status === "DISCHARGED").length,
          },
          todayAppointments: appointments.slice(0, 10),
        });
      } catch (fallbackErr) {
        console.error("Fallback load failed:", fallbackErr);
        setError("Unable to load dashboard data. Please verify backend connection.");
      }
    } finally {
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getStatusBadgeClass = (status) => {
    const s = (status || "").toUpperCase();
    if (s === "COMPLETED") return "bg-success";
    if (s === "IN_CONSULTATION" || s === "IN CONSULTATION") return "bg-primary";
    if (s === "WAITING" || s === "CHECKED_IN" || s === "SCHEDULED") return "bg-warning";
    if (s === "CANCELLED") return "bg-danger";
    return "bg-secondary";
  };

  return (
    <div className="d-flex" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Sidebar />

      <div className="flex-grow-1 p-4" style={{ maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* TOP HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <div>
            <h3 className="fw-bold mb-1" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
              Hospital Operations Dashboard
            </h3>
            <p className="text-muted small mb-0">
              Today's overview of patients, appointments, clinical activity and billing
            </p>
          </div>

          <div className="d-flex align-items-center gap-3 text-end">
            <div>
              <div className="fw-semibold small text-dark">{todayDateStr}</div>
              <div className="text-muted" style={{ fontSize: "11px" }}>
                {lastUpdated ? `Last updated: ${lastUpdated}` : "Updating..."}
              </div>
            </div>
            <button
              className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 fw-semibold px-3 py-2"
              onClick={loadData}
              disabled={loading}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
              </svg>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center rounded-3 mb-4">
            <div>
              <strong>Operational Alert:</strong> {error}
            </div>
            <button className="btn btn-sm btn-outline-danger fw-bold" onClick={loadData}>
              Retry
            </button>
          </div>
        )}

        {/* LOADING SKELETON */}
        {loading && !data ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: "2.5rem", height: "2.5rem" }} />
            <p className="text-muted small fw-medium">Loading hospital operational metrics...</p>
          </div>
        ) : data ? (
          <>
            {/* TODAY'S OVERVIEW KPI CARDS */}
            <div className="mb-4">
              <h6 className="fw-bold text-uppercase text-secondary mb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                Today's Overview
              </h6>
              <div className="row g-3">
                <div className="col-md-2 col-6">
                  <div className="card p-3 border-0 bg-white shadow-sm">
                    <div className="text-muted small fw-semibold">Today's Appointments</div>
                    <div className="fs-3 fw-bold text-dark mt-1">{data.todayAppointmentsCount || 0}</div>
                    <div className="text-muted" style={{ fontSize: "11px" }}>Scheduled today</div>
                  </div>
                </div>

                <div className="col-md-2 col-6">
                  <div className="card p-3 border-0 bg-white shadow-sm">
                    <div className="text-muted small fw-semibold">Patients Waiting</div>
                    <div className="fs-3 fw-bold text-warning mt-1">{data.waitingPatients || 0}</div>
                    <div className="text-muted" style={{ fontSize: "11px" }}>In waiting lounge</div>
                  </div>
                </div>

                <div className="col-md-2 col-6">
                  <div className="card p-3 border-0 bg-white shadow-sm">
                    <div className="text-muted small fw-semibold">In Consultation</div>
                    <div className="fs-3 fw-bold text-primary mt-1">{data.inConsultation || 0}</div>
                    <div className="text-muted" style={{ fontSize: "11px" }}>Doctor examining</div>
                  </div>
                </div>

                <div className="col-md-2 col-6">
                  <div className="card p-3 border-0 bg-white shadow-sm">
                    <div className="text-muted small fw-semibold">Completed Today</div>
                    <div className="fs-3 fw-bold text-success mt-1">{data.completedToday || 0}</div>
                    <div className="text-muted" style={{ fontSize: "11px" }}>Consultations done</div>
                  </div>
                </div>

                <div className="col-md-2 col-6">
                  <div className="card p-3 border-0 bg-white shadow-sm">
                    <div className="text-muted small fw-semibold">Pending Bills</div>
                    <div className="fs-3 fw-bold text-danger mt-1">{data.pendingBills || 0}</div>
                    <div className="text-muted" style={{ fontSize: "11px" }}>Unpaid invoices</div>
                  </div>
                </div>

                <div className="col-md-2 col-6">
                  <div className="card p-3 border-0 bg-white shadow-sm">
                    <div className="text-muted small fw-semibold">Revenue Today</div>
                    <div className="fs-3 fw-bold text-dark mt-1">₹{Number(data.revenueToday || 0).toLocaleString()}</div>
                    <div className="text-muted" style={{ fontSize: "11px" }}>Total collected</div>
                  </div>
                </div>
              </div>
            </div>

            {/* PATIENT FLOW TODAY & NEEDS ATTENTION */}
            <div className="row g-4 mb-4">
              {/* PATIENT FLOW TODAY */}
              <div className="col-md-7">
                <div className="card border-0 bg-white shadow-sm p-4 h-100">
                  <h6 className="fw-bold text-dark mb-3">Patient Flow Today</h6>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3">
                    <div className="text-center px-2">
                      <div className="text-muted small">Registered</div>
                      <div className="fw-bold fs-5 text-dark">{data.patientFlow?.registeredToday || 0}</div>
                    </div>
                    <div className="text-muted">➔</div>
                    <div className="text-center px-2">
                      <div className="text-muted small">Checked In</div>
                      <div className="fw-bold fs-5 text-info">{data.patientFlow?.checkedIn || 0}</div>
                    </div>
                    <div className="text-muted">➔</div>
                    <div className="text-center px-2">
                      <div className="text-muted small">Waiting</div>
                      <div className="fw-bold fs-5 text-warning">{data.patientFlow?.waiting || 0}</div>
                    </div>
                    <div className="text-muted">➔</div>
                    <div className="text-center px-2">
                      <div className="text-muted small">Consultation</div>
                      <div className="fw-bold fs-5 text-primary">{data.patientFlow?.inConsultation || 0}</div>
                    </div>
                    <div className="text-muted">➔</div>
                    <div className="text-center px-2">
                      <div className="text-muted small">Completed</div>
                      <div className="fw-bold fs-5 text-success">{data.patientFlow?.completed || 0}</div>
                    </div>
                  </div>

                  <small className="text-muted">
                    Live progression tracking patient journey from reception check-in to consultation completion.
                  </small>
                </div>
              </div>

              {/* NEEDS ATTENTION PANEL */}
              <div className="col-md-5">
                <div className="card border-0 bg-white shadow-sm p-4 h-100">
                  <h6 className="fw-bold text-dark mb-3">Needs Attention</h6>

                  <div className="d-flex flex-column gap-2">
                    {/* LOW MEDICINE STOCK */}
                    <div className={`p-3 rounded-3 border d-flex justify-content-between align-items-center ${data.lowStockCount > 0 ? 'bg-danger-subtle border-danger-subtle' : 'bg-light border-light'}`}>
                      <div>
                        <div className="fw-semibold small text-dark">
                          {data.lowStockCount > 0 ? `⚠️ Low Medicine Stock` : `Pharmacy Stock Healthy`}
                        </div>
                        <div className="small text-muted">
                          {data.lowStockCount > 0 ? `${data.lowStockCount} item(s) below reorder level` : `All medicines above threshold`}
                        </div>
                      </div>
                      <button className="btn btn-outline-dark btn-sm fw-semibold" onClick={() => navigate('/medicines')}>
                        View Pharmacy →
                      </button>
                    </div>

                    {/* PENDING PAYMENTS */}
                    <div className={`p-3 rounded-3 border d-flex justify-content-between align-items-center ${data.pendingBills > 0 ? 'bg-warning-subtle border-warning-subtle' : 'bg-light border-light'}`}>
                      <div>
                        <div className="fw-semibold small text-dark">
                          {data.pendingBills > 0 ? `Pending Invoices` : `Invoices Up to Date`}
                        </div>
                        <div className="small text-muted">
                          {data.pendingBills > 0 ? `${data.pendingBills} invoice(s) with outstanding balance` : `No pending payments`}
                        </div>
                      </div>
                      <button className="btn btn-outline-dark btn-sm fw-semibold" onClick={() => navigate('/billing')}>
                        View Billing →
                      </button>
                    </div>

                    {/* WAITING PATIENTS */}
                    <div className={`p-3 rounded-3 border d-flex justify-content-between align-items-center ${data.waitingPatients > 0 ? 'bg-info-subtle border-info-subtle' : 'bg-light border-light'}`}>
                      <div>
                        <div className="fw-semibold small text-dark">
                          {data.waitingPatients > 0 ? `Patients Waiting` : `No Patient Delay`}
                        </div>
                        <div className="small text-muted">
                          {data.waitingPatients > 0 ? `${data.waitingPatients} patient(s) ready for consultation` : `Queue clear`}
                        </div>
                      </div>
                      <button className="btn btn-outline-dark btn-sm fw-semibold" onClick={() => navigate('/appointments')}>
                        View Appointments →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TODAY'S APPOINTMENTS TABLE */}
            <div className="card border-0 bg-white shadow-sm p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="fw-bold text-dark mb-0">Today's Appointments</h6>
                  <small className="text-muted">Live scheduled patient consultations</small>
                </div>
                <button className="btn btn-link text-primary text-decoration-none fw-semibold p-0 small" onClick={() => navigate('/appointments')}>
                  View all appointments →
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: "13.5px" }}>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Department</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!data.todayAppointments || data.todayAppointments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">
                          No appointments scheduled for today.
                        </td>
                      </tr>
                    ) : (
                      data.todayAppointments.map((a) => (
                        <tr key={a.id}>
                          <td><strong>{formatTime12Hour(a.appointmentTime)}</strong></td>
                          <td>{a.patient?.name || "N/A"}</td>
                          <td>{a.doctor?.name || "N/A"}</td>
                          <td>{a.doctor?.department?.name || a.doctor?.specialization || "General"}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(a.status)}`}>
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

            {/* QUICK ACCESS MODULES */}
            <div>
              <h6 className="fw-bold text-uppercase text-secondary mb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                Quick Access Hospital Modules
              </h6>
              <div className="row g-3">
                <div className="col-md-3 col-6">
                  <div className="card p-3 border-0 bg-white shadow-sm cursor-pointer" onClick={() => navigate('/patients')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold text-dark">Patients</div>
                        <div className="small text-muted">{data.totalPatients || 0} registered</div>
                      </div>
                      <span className="text-primary fw-bold">→</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-6">
                  <div className="card p-3 border-0 bg-white shadow-sm cursor-pointer" onClick={() => navigate('/doctors')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold text-dark">Doctors</div>
                        <div className="small text-muted">{data.totalDoctors || 0} active specialists</div>
                      </div>
                      <span className="text-primary fw-bold">→</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-6">
                  <div className="card p-3 border-0 bg-white shadow-sm cursor-pointer" onClick={() => navigate('/appointments')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold text-dark">Appointments</div>
                        <div className="small text-muted">{data.totalAppointments || 0} total records</div>
                      </div>
                      <span className="text-primary fw-bold">→</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-6">
                  <div className="card p-3 border-0 bg-white shadow-sm cursor-pointer" onClick={() => navigate('/medicines')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold text-dark">Pharmacy</div>
                        <div className="small text-muted">{data.totalMedicines || 0} catalog items</div>
                      </div>
                      <span className="text-primary fw-bold">→</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-6">
                  <div className="card p-3 border-0 bg-white shadow-sm cursor-pointer" onClick={() => navigate('/labs')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold text-dark">Laboratory</div>
                        <div className="small text-muted">{data.pendingLabsCount || 0} pending tests</div>
                      </div>
                      <span className="text-primary fw-bold">→</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-6">
                  <div className="card p-3 border-0 bg-white shadow-sm cursor-pointer" onClick={() => navigate('/admissions')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold text-dark">Admissions & Beds</div>
                        <div className="small text-muted">{data.activeAdmissionsCount || 0} active inpatients</div>
                      </div>
                      <span className="text-primary fw-bold">→</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-6">
                  <div className="card p-3 border-0 bg-white shadow-sm cursor-pointer" onClick={() => navigate('/billing')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold text-dark">Billing</div>
                        <div className="small text-muted">₹{Number(data.totalRevenue || 0).toLocaleString()} total</div>
                      </div>
                      <span className="text-primary fw-bold">→</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-6">
                  <div className="card p-3 border-0 bg-white shadow-sm cursor-pointer" onClick={() => navigate('/audit-logs')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold text-dark">Audit Logs</div>
                        <div className="small text-muted">Security event trail</div>
                      </div>
                      <span className="text-primary fw-bold">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Dashboard;