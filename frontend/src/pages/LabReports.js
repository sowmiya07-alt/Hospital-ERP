import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import NavbarHeader from "../components/NavbarHeader";
import { getLabReports, createLabReport, updateLabReportStatus } from "../services/labReportService";
import { getPatients } from "../services/patientService";
import { getDoctors } from "../services/doctorService";

function LabReports() {
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTest, setNewTest] = useState({
    patientId: "",
    doctorId: "",
    testName: "",
    priority: "ROUTINE",
    cost: 100.0,
  });

  const [editingReport, setEditingReport] = useState(null);
  const [resultInput, setResultInput] = useState("");
  const [statusInput, setStatusInput] = useState("COMPLETED");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resLabs, resPatients, resDoctors] = await Promise.all([
        getLabReports(),
        getPatients(),
        getDoctors(),
      ]);
      setReports(resLabs.data || []);
      setPatients(resPatients.data || []);
      setDoctors(resDoctors.data || []);
    } catch (err) {
      console.log("Error loading lab data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    if (!newTest.patientId || !newTest.testName) {
      alert("Please select patient and enter test name.");
      return;
    }

    try {
      const payload = {
        patient: { id: Number(newTest.patientId) },
        doctor: newTest.doctorId ? { id: Number(newTest.doctorId) } : null,
        testName: newTest.testName,
        priority: newTest.priority,
        cost: Number(newTest.cost),
      };
      await createLabReport(payload);
      alert("🧪 Lab Test Requested Successfully!");
      setNewTest({ patientId: "", doctorId: "", testName: "", priority: "ROUTINE", cost: 100.0 });
      loadData();
    } catch (err) {
      alert("Failed to request lab test.");
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!editingReport) return;

    try {
      await updateLabReportStatus(editingReport.id, statusInput, resultInput);
      alert("✅ Lab Test Status Updated!");
      setEditingReport(null);
      loadData();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="d-flex" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <NavbarHeader title="🧪 Laboratory & Diagnostics Management" portalRole="ADMIN" />

        <div className="row g-4 mb-4">
          {/* REQUEST NEW LAB TEST */}
          <div className="col-md-4">
            <div className="card shadow-sm border-0 p-4" style={{ borderRadius: "14px" }}>
              <h5 className="fw-bold mb-3">➕ Request New Lab Test</h5>
              <form onSubmit={handleCreateTest}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Patient</label>
                  <select
                    className="form-select form-select-sm"
                    value={newTest.patientId}
                    onChange={(e) => setNewTest({ ...newTest, patientId: e.target.value })}
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
                  <label className="form-label small fw-semibold">Doctor (Optional)</label>
                  <select
                    className="form-select form-select-sm"
                    value={newTest.doctorId}
                    onChange={(e) => setNewTest({ ...newTest, doctorId: e.target.value })}
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
                  <label className="form-label small fw-semibold">Test Name</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="e.g. Complete Blood Count (CBC), ECG"
                    value={newTest.testName}
                    onChange={(e) => setNewTest({ ...newTest, testName: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Priority</label>
                  <select
                    className="form-select form-select-sm"
                    value={newTest.priority}
                    onChange={(e) => setNewTest({ ...newTest, priority: e.target.value })}
                  >
                    <option value="ROUTINE">ROUTINE</option>
                    <option value="URGENT">URGENT</option>
                    <option value="EMERGENCY">EMERGENCY</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Test Cost (₹)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={newTest.cost}
                    onChange={(e) => setNewTest({ ...newTest, cost: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-sm w-100 fw-bold py-2" style={{ borderRadius: "8px" }}>
                  Request Test
                </button>
              </form>
            </div>
          </div>

          {/* LAB TEST RECORDS TABLE */}
          <div className="col-md-8">
            <div className="card shadow-sm border-0 p-4" style={{ borderRadius: "14px" }}>
              <h5 className="fw-bold mb-3">🧪 Active Laboratory Orders ({reports.length})</h5>

              {loading ? (
                <div className="text-center py-4 text-muted">Loading laboratory records...</div>
              ) : reports.length === 0 ? (
                <div className="alert alert-light text-center">No laboratory orders recorded.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle" style={{ fontSize: "13px" }}>
                    <thead className="table-light">
                      <tr>
                        <th>Code</th>
                        <th>Patient</th>
                        <th>Test Name</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Cost</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((r) => (
                        <tr key={r.id}>
                          <td><strong>{r.testCode || `#${r.id}`}</strong></td>
                          <td>{r.patient?.name || "N/A"}</td>
                          <td>{r.testName}</td>
                          <td>
                            <span className={`badge ${r.priority === "EMERGENCY" ? "bg-danger" : r.priority === "URGENT" ? "bg-warning text-dark" : "bg-info text-dark"}`}>
                              {r.priority}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${r.status === "COMPLETED" ? "bg-success" : r.status === "PROCESSING" ? "bg-primary" : "bg-secondary"}`}>
                              {r.status}
                            </span>
                          </td>
                          <td>₹{r.cost}</td>
                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm py-0"
                              onClick={() => {
                                setEditingReport(r);
                                setStatusInput(r.status);
                                setResultInput(r.result || "");
                              }}
                            >
                              Update Status
                            </button>
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

      {/* UPDATE STATUS MODAL */}
      {editingReport && (
        <div className="modal show d-block tab-index='-1'" style={{ background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(4px)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "16px" }}>
              <div className="modal-header bg-primary text-white p-3" style={{ borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}>
                <h5 className="modal-title fw-bold mb-0">🧪 Update Lab Result - {editingReport.testCode}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setEditingReport(null)} />
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleStatusUpdate}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Status</label>
                    <select className="form-select form-select-sm" value={statusInput} onChange={(e) => setStatusInput(e.target.value)}>
                      <option value="REQUESTED">REQUESTED</option>
                      <option value="SAMPLE_COLLECTED">SAMPLE_COLLECTED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Test Results / Clinical Findings</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="4"
                      placeholder="Enter laboratory findings, values, and diagnostic observations..."
                      value={resultInput}
                      onChange={(e) => setResultInput(e.target.value)}
                    />
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setEditingReport(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm px-4 fw-bold">
                      Save Result & Complete
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

export default LabReports;
