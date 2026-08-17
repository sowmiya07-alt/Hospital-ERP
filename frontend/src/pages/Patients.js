import { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";

import {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
} from "../services/patientService";

function Patients() {

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "O+",
    emergencyContact: "",
    emergencyPhone: "",
    allergies: "",
    medicalHistory: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [viewingPatient, setViewingPatient] = useState(null);

  const loadPatients = useCallback(() => {
    getPatients()
      .then((response) => {
        setPatients(response.data || []);
      })
      .catch((error) => {
        console.log("Patient Load Error:", error);
      });
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const resetForm = () => {
    setPatient({
      name: "",
      age: "",
      gender: "Male",
      phone: "",
      email: "",
      address: "",
      bloodGroup: "O+",
      emergencyContact: "",
      emergencyPhone: "",
      allergies: "",
      medicalHistory: "",
    });
    setEditingId(null);
  };

  const savePatient = () => {
    if (!patient.name || !patient.phone) {
      alert("Please enter patient name and contact phone.");
      return;
    }

    const patientData = {
      ...patient,
      age: patient.age ? Number(patient.age) : null,
    };

    if (editingId === null) {
      addPatient(patientData)
        .then(() => {
          alert("Patient Registered Successfully");
          loadPatients();
          resetForm();
        })
        .catch((error) => {
          console.log("Save Patient Error:", error);
          alert("Unable to Save Patient");
        });
    } else {
      updatePatient(editingId, patientData)
        .then(() => {
          alert("Patient Profile Updated");
          loadPatients();
          resetForm();
        })
        .catch((error) => {
          console.log("Update Patient Error:", error);
          alert("Unable to Update Patient");
        });
    }
  };

  const editPatient = (p) => {
    setPatient({
      name: p.name || "",
      age: p.age ?? "",
      gender: p.gender || "Male",
      phone: p.phone || "",
      email: p.email || "",
      address: p.address || "",
      bloodGroup: p.bloodGroup || "O+",
      emergencyContact: p.emergencyContact || "",
      emergencyPhone: p.emergencyPhone || "",
      allergies: p.allergies || "",
      medicalHistory: p.medicalHistory || "",
    });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removePatient = (id) => {
    if (window.confirm("Are you sure you want to delete this patient record?")) {
      deletePatient(id)
        .then(() => {
          alert("Patient Deleted Successfully");
          loadPatients();
          if (editingId === id) resetForm();
        })
        .catch((error) => {
          console.log("Delete Patient Error:", error);
          alert("Unable to Delete Patient");
        });
    }
  };

  const filteredPatients = patients.filter((p) => {
    const text = search.toLowerCase();
    return (
      (p.name || "").toLowerCase().includes(text) ||
      (p.phone || "").toLowerCase().includes(text) ||
      (p.bloodGroup || "").toLowerCase().includes(text) ||
      (p.address || "").toLowerCase().includes(text)
    );
  });

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>📋 Patient Management</h2>
            <p className="text-muted mb-0">Register, manage medical profiles, and view patient clinical history</p>
          </div>
          <span className="badge bg-primary fs-6">Total Patients: {patients.length}</span>
        </div>

        {/* REGISTRATION / EDIT FORM */}
        <div className="card shadow mb-4">
          <div className="card-header bg-dark text-white fw-bold">
            {editingId === null ? "➕ Add New Patient" : "✏️ Edit Patient Profile"}
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-bold">Full Name *</label>
                <input
                  className="form-control"
                  placeholder="e.g. John Doe"
                  value={patient.name}
                  onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-bold">Age</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Age"
                  value={patient.age}
                  onChange={(e) => setPatient({ ...patient, age: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold">Gender</label>
                <select
                  className="form-select"
                  value={patient.gender}
                  onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold">Blood Group</label>
                <select
                  className="form-select"
                  value={patient.bloodGroup}
                  onChange={(e) => setPatient({ ...patient, bloodGroup: e.target.value })}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Phone *</label>
                <input
                  className="form-control"
                  placeholder="+1-555-0100"
                  value={patient.phone}
                  onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="john@example.com"
                  value={patient.email}
                  onChange={(e) => setPatient({ ...patient, email: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Address</label>
                <input
                  className="form-control"
                  placeholder="Street Address, City"
                  value={patient.address}
                  onChange={(e) => setPatient({ ...patient, address: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Emergency Contact Person</label>
                <input
                  className="form-control"
                  placeholder="Contact Person Name"
                  value={patient.emergencyContact}
                  onChange={(e) => setPatient({ ...patient, emergencyContact: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Emergency Contact Phone</label>
                <input
                  className="form-control"
                  placeholder="Emergency Phone Number"
                  value={patient.emergencyPhone}
                  onChange={(e) => setPatient({ ...patient, emergencyPhone: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Known Allergies</label>
                <input
                  className="form-control"
                  placeholder="e.g. Penicillin, Peanuts"
                  value={patient.allergies}
                  onChange={(e) => setPatient({ ...patient, allergies: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Medical History / Existing Conditions</label>
                <input
                  className="form-control"
                  placeholder="e.g. Hypertension, Type 2 Diabetes"
                  value={patient.medicalHistory}
                  onChange={(e) => setPatient({ ...patient, medicalHistory: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-3">
              <button
                className={`btn ${editingId === null ? "btn-success" : "btn-warning"} me-2`}
                onClick={savePatient}
              >
                {editingId === null ? "Save Patient" : "Update Patient"}
              </button>

              {editingId !== null && (
                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="card shadow p-3 mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by name, phone, blood group, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* PATIENT TABLE */}
        <div className="card shadow">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0 align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Patient Name</th>
                    <th>Age / Gender</th>
                    <th>Blood Group</th>
                    <th>Phone</th>
                    <th>Emergency Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center p-4">
                        {search ? "No matching patients found." : "No patients registered yet."}
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((p) => (
                      <tr key={p.id}>
                        <td><strong>#{p.id}</strong></td>
                        <td>
                          <strong>{p.name}</strong>
                          {p.email && <div className="text-muted small">{p.email}</div>}
                        </td>
                        <td>{p.age ? `${p.age} yrs` : "N/A"} / {p.gender}</td>
                        <td><span className="badge bg-danger">{p.bloodGroup || "N/A"}</span></td>
                        <td>{p.phone}</td>
                        <td>
                          {p.emergencyContact ? (
                            <div>
                              <div>{p.emergencyContact}</div>
                              <small className="text-muted">{p.emergencyPhone}</small>
                            </div>
                          ) : (
                            <span className="text-muted">None</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-info btn-sm me-1"
                            onClick={() => setViewingPatient(p)}
                          >
                            👁️ View Profile
                          </button>
                          <button
                            className="btn btn-primary btn-sm me-1"
                            onClick={() => editPatient(p)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => removePatient(p.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* PATIENT PROFILE MODAL */}
        {viewingPatient && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content shadow-lg">
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title">🏥 Patient Medical Profile - #{viewingPatient.id}</h5>
                  <button className="btn-close btn-close-white" onClick={() => setViewingPatient(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <p><strong>Name:</strong> {viewingPatient.name}</p>
                      <p><strong>Age / Gender:</strong> {viewingPatient.age} / {viewingPatient.gender}</p>
                      <p><strong>Blood Group:</strong> <span className="badge bg-danger">{viewingPatient.bloodGroup || "N/A"}</span></p>
                      <p><strong>Phone:</strong> {viewingPatient.phone}</p>
                      <p><strong>Email:</strong> {viewingPatient.email || "N/A"}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Address:</strong> {viewingPatient.address || "N/A"}</p>
                      <p><strong>Emergency Contact:</strong> {viewingPatient.emergencyContact || "N/A"} ({viewingPatient.emergencyPhone || "N/A"})</p>
                      <p><strong>Known Allergies:</strong> {viewingPatient.allergies || "None reported"}</p>
                      <p><strong>Medical History:</strong> {viewingPatient.medicalHistory || "No prior history logged"}</p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setViewingPatient(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Patients;