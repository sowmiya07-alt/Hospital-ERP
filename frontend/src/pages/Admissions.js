import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import NavbarHeader from "../components/NavbarHeader";
import { getAdmissions, getBeds, admitPatient, dischargePatient, createBed } from "../services/admissionService";
import { getPatients } from "../services/patientService";
import { getDoctors } from "../services/doctorService";

function Admissions() {
  const [admissions, setAdmissions] = useState([]);
  const [beds, setBeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newAdmission, setNewAdmission] = useState({
    patientId: "",
    doctorId: "",
    bedId: "",
    reason: "",
  });

  const [newBed, setNewBed] = useState({
    roomNumber: "",
    bedNumber: "",
    wardType: "GENERAL",
    dailyRate: 500.0,
  });

  const [showAddBedModal, setShowAddBedModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resAdm, resBeds, resPatients, resDoctors] = await Promise.all([
        getAdmissions(),
        getBeds(),
        getPatients(),
        getDoctors(),
      ]);
      setAdmissions(resAdm.data || []);
      setBeds(resBeds.data || []);
      setPatients(resPatients.data || []);
      setDoctors(resDoctors.data || []);
    } catch (err) {
      console.log("Error loading admissions data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdmit = async (e) => {
    e.preventDefault();
    if (!newAdmission.patientId || !newAdmission.bedId) {
      alert("Please select patient and bed.");
      return;
    }

    try {
      const payload = {
        patient: { id: Number(newAdmission.patientId) },
        doctor: newAdmission.doctorId ? { id: Number(newAdmission.doctorId) } : null,
        bed: { id: Number(newAdmission.bedId) },
        reason: newAdmission.reason,
      };
      await admitPatient(payload);
      alert("🛏️ Patient Admitted Successfully!");
      setNewAdmission({ patientId: "", doctorId: "", bedId: "", reason: "" });
      loadData();
    } catch (err) {
      alert("Failed to admit patient.");
    }
  };

  const handleDischarge = async (id) => {
    if (!window.confirm("Discharge patient and release bed?")) return;
    try {
      await dischargePatient(id);
      alert("✅ Patient Discharged & Bed Released!");
      loadData();
    } catch (err) {
      alert("Failed to discharge patient.");
    }
  };

  const handleCreateBed = async (e) => {
    e.preventDefault();
    try {
      await createBed(newBed);
      alert("🛏️ Hospital Bed Added!");
      setShowAddBedModal(false);
      setNewBed({ roomNumber: "", bedNumber: "", wardType: "GENERAL", dailyRate: 500.0 });
      loadData();
    } catch (err) {
      alert("Failed to add bed.");
    }
  };

  return (
    <div className="d-flex" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <NavbarHeader title="🛏️ Inpatient Admissions & Bed Management" portalRole="ADMIN" />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-bold mb-0">Available Hospital Beds</h5>
            <small className="text-muted">Total Beds: {beds.length} | Available: {beds.filter(b => b.status === "AVAILABLE").length}</small>
          </div>
          <button className="btn btn-outline-primary btn-sm fw-bold" onClick={() => setShowAddBedModal(true)}>
            ➕ Add Hospital Bed
          </button>
        </div>

        {/* BEDS GRID */}
        <div className="row g-3 mb-4">
          {beds.map((b) => (
            <div key={b.id} className="col-md-3">
              <div
                className={`card p-3 border-0 shadow-sm ${
                  b.status === "OCCUPIED" ? "bg-danger text-white" : "bg-white"
                }`}
                style={{ borderRadius: "12px" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0">Room {b.roomNumber} - Bed {b.bedNumber}</h6>
                  <span className={`badge ${b.status === "OCCUPIED" ? "bg-white text-danger" : "bg-success"}`}>
                    {b.status}
                  </span>
                </div>
                <div className="small opacity-75">Ward: {b.wardType}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* ADMIT PATIENT FORM */}
          <div className="col-md-4">
            <div className="card shadow-sm border-0 p-4" style={{ borderRadius: "14px" }}>
              <h5 className="fw-bold mb-3">🏥 Admit Patient</h5>
              <form onSubmit={handleAdmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Patient</label>
                  <select
                    className="form-select form-select-sm"
                    value={newAdmission.patientId}
                    onChange={(e) => setNewAdmission({ ...newAdmission, patientId: e.target.value })}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.patientCode || `#${p.id}`})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Attending Doctor</label>
                  <select
                    className="form-select form-select-sm"
                    value={newAdmission.doctorId}
                    onChange={(e) => setNewAdmission({ ...newAdmission, doctorId: e.target.value })}
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} - {d.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Select Available Bed</label>
                  <select
                    className="form-select form-select-sm"
                    value={newAdmission.bedId}
                    onChange={(e) => setNewAdmission({ ...newAdmission, bedId: e.target.value })}
                    required
                  >
                    <option value="">Select Bed</option>
                    {beds
                      .filter((b) => b.status === "AVAILABLE")
                      .map((b) => (
                        <option key={b.id} value={b.id}>
                          Room {b.roomNumber} - Bed {b.bedNumber} ({b.wardType} - ₹{b.dailyRate}/day)
                        </option>
                      ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Reason for Admission</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="e.g. Post-op recovery, Severe fever"
                    value={newAdmission.reason}
                    onChange={(e) => setNewAdmission({ ...newAdmission, reason: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-sm w-100 fw-bold py-2" style={{ borderRadius: "8px" }}>
                  Admit Patient
                </button>
              </form>
            </div>
          </div>

          {/* ACTIVE ADMISSIONS TABLE */}
          <div className="col-md-8">
            <div className="card shadow-sm border-0 p-4" style={{ borderRadius: "14px" }}>
              <h5 className="fw-bold mb-3">📋 Active Admissions ({admissions.length})</h5>
              {loading ? (
                <div className="text-center py-4 text-muted">Loading admissions...</div>
              ) : admissions.length === 0 ? (
                <div className="alert alert-light text-center">No active patient admissions.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle" style={{ fontSize: "13px" }}>
                    <thead className="table-light">
                      <tr>
                        <th>Code</th>
                        <th>Patient</th>
                        <th>Room / Bed</th>
                        <th>Doctor</th>
                        <th>Admitted Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admissions.map((a) => (
                        <tr key={a.id}>
                          <td><strong>{a.admissionCode || `#${a.id}`}</strong></td>
                          <td>{a.patient?.name || "N/A"}</td>
                          <td>Room {a.bed?.roomNumber} - Bed {a.bed?.bedNumber}</td>
                          <td>{a.doctor?.name || "N/A"}</td>
                          <td>{a.admissionDate}</td>
                          <td>
                            <span className={`badge ${a.status === "ADMITTED" ? "bg-primary" : "bg-success"}`}>
                              {a.status}
                            </span>
                          </td>
                          <td>
                            {a.status === "ADMITTED" && (
                              <button
                                className="btn btn-outline-danger btn-sm py-0"
                                onClick={() => handleDischarge(a.id)}
                              >
                                Discharge
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ADD BED MODAL */}
      {showAddBedModal && (
        <div className="modal show d-block tab-index='-1'" style={{ background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(4px)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "16px" }}>
              <div className="modal-header bg-dark text-white p-3" style={{ borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}>
                <h5 className="modal-title fw-bold mb-0">🛏️ Add New Hospital Bed</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddBedModal(false)} />
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleCreateBed}>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Room Number</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. 101"
                        value={newBed.roomNumber}
                        onChange={(e) => setNewBed({ ...newBed, roomNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Bed Number</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. B1"
                        value={newBed.bedNumber}
                        onChange={(e) => setNewBed({ ...newBed, bedNumber: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Ward Type</label>
                    <select
                      className="form-select form-select-sm"
                      value={newBed.wardType}
                      onChange={(e) => setNewBed({ ...newBed, wardType: e.target.value })}
                    >
                      <option value="GENERAL">GENERAL</option>
                      <option value="ICU">ICU</option>
                      <option value="PRIVATE">PRIVATE</option>
                      <option value="SEMI_PRIVATE">SEMI_PRIVATE</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Daily Rate (₹)</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={newBed.dailyRate}
                      onChange={(e) => setNewBed({ ...newBed, dailyRate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowAddBedModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-dark btn-sm px-4 fw-bold">
                      Add Bed
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admissions;
