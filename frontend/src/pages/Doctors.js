import { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";

import {
  getDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
} from "../services/doctorService";

import { getDepartments } from "../services/departmentService";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("All");

  const [doctor, setDoctor] = useState({
    name: "",
    specialization: "",
    qualification: "",
    phone: "",
    email: "",
    experience: "",
    consultationFee: "50",
    departmentId: "",
  });

  const [editingId, setEditingId] = useState(null);

  const loadDoctors = useCallback(() => {
    getDoctors()
      .then((response) => {
        setDoctors(response.data || []);
      })
      .catch((error) => {
        console.log("Doctor Load Error:", error);
      });
  }, []);

  const loadDepartments = useCallback(() => {
    getDepartments()
      .then((response) => {
        setDepartments(response.data || []);
      })
      .catch((error) => {
        console.log("Department Load Error:", error);
      });
  }, []);

  useEffect(() => {
    loadDoctors();
    loadDepartments();
  }, [loadDoctors, loadDepartments]);

  const resetForm = () => {
    setDoctor({
      name: "",
      specialization: "",
      qualification: "",
      phone: "",
      email: "",
      experience: "",
      consultationFee: "50",
      departmentId: "",
    });
    setEditingId(null);
  };

  const saveDoctor = () => {
    if (!doctor.name || !doctor.specialization || !doctor.phone) {
      alert("Please enter doctor name, specialization, and contact phone.");
      return;
    }

    const doctorData = {
      ...doctor,
      experience: doctor.experience ? Number(doctor.experience) : 0,
      consultationFee: doctor.consultationFee ? Number(doctor.consultationFee) : 50.0,
      department: doctor.departmentId ? { id: Number(doctor.departmentId) } : null,
    };

    if (editingId === null) {
      addDoctor(doctorData)
        .then(() => {
          alert("Doctor Profile Created Successfully");
          loadDoctors();
          resetForm();
        })
        .catch((error) => {
          console.log("Save Doctor Error:", error);
          alert("Unable to Save Doctor");
        });
    } else {
      updateDoctor(editingId, doctorData)
        .then(() => {
          alert("Doctor Profile Updated Successfully");
          loadDoctors();
          resetForm();
        })
        .catch((error) => {
          console.log("Update Doctor Error:", error);
          alert("Unable to Update Doctor");
        });
    }
  };

  const editDoctor = (d) => {
    setDoctor({
      name: d.name || "",
      specialization: d.specialization || "",
      qualification: d.qualification || "",
      phone: d.phone || "",
      email: d.email || "",
      experience: d.experience ?? "",
      consultationFee: d.consultationFee ?? "50",
      departmentId: d.department?.id || "",
    });
    setEditingId(d.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeDoctor = (id) => {
    if (window.confirm("Are you sure you want to delete this doctor record?")) {
      deleteDoctor(id)
        .then(() => {
          alert("Doctor Record Deleted Successfully");
          loadDoctors();
          if (editingId === id) resetForm();
        })
        .catch((error) => {
          console.log("Delete Doctor Error:", error);
          alert("Unable to Delete Doctor");
        });
    }
  };

  const specializations = [
    ...new Set(doctors.map((d) => d.specialization).filter(Boolean)),
  ];

  const filteredDoctors = doctors.filter((d) => {
    const text = search.toLowerCase();
    const matchesSearch =
      (d.name || "").toLowerCase().includes(text) ||
      (d.specialization || "").toLowerCase().includes(text) ||
      (d.phone || "").toLowerCase().includes(text) ||
      (d.email || "").toLowerCase().includes(text);

    const matchesSpec =
      specializationFilter === "All" || d.specialization === specializationFilter;

    return matchesSearch && matchesSpec;
  });

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>👨‍⚕️ Doctor Management</h2>
            <p className="text-muted mb-0">Register medical staff, set consultation fees, and assign departments</p>
          </div>
          <span className="badge bg-primary fs-6">Active Doctors: {doctors.length}</span>
        </div>

        {/* DOCTOR FORM */}
        <div className="card shadow mb-4">
          <div className="card-header bg-dark text-white fw-bold">
            {editingId === null ? "➕ Register New Doctor" : "✏️ Edit Doctor Profile"}
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-bold">Doctor Full Name *</label>
                <input
                  className="form-control"
                  placeholder="e.g. Dr. Sarah Jenkins"
                  value={doctor.name}
                  onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Specialization *</label>
                <input
                  className="form-control"
                  placeholder="e.g. Cardiology"
                  value={doctor.specialization}
                  onChange={(e) => setDoctor({ ...doctor, specialization: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Qualifications</label>
                <input
                  className="form-control"
                  placeholder="e.g. MBBS, MD, FACC"
                  value={doctor.qualification}
                  onChange={(e) => setDoctor({ ...doctor, qualification: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Department</label>
                <select
                  className="form-select"
                  value={doctor.departmentId}
                  onChange={(e) => setDoctor({ ...doctor, departmentId: e.target.value })}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Phone Number *</label>
                <input
                  className="form-control"
                  placeholder="+1-555-0192"
                  value={doctor.phone}
                  onChange={(e) => setDoctor({ ...doctor, phone: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="doctor@hospital.org"
                  value={doctor.email}
                  onChange={(e) => setDoctor({ ...doctor, email: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="e.g. 10"
                  value={doctor.experience}
                  onChange={(e) => setDoctor({ ...doctor, experience: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Consultation Fee ($)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="50.00"
                  value={doctor.consultationFee}
                  onChange={(e) => setDoctor({ ...doctor, consultationFee: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-3">
              <button
                className={`btn ${editingId === null ? "btn-success" : "btn-warning"} me-2`}
                onClick={saveDoctor}
              >
                {editingId === null ? "Save Doctor" : "Update Doctor"}
              </button>

              {editingId !== null && (
                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="card shadow p-3 mb-4">
          <div className="row g-2">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search doctor name, specialization, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
              >
                <option value="All">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* DOCTOR TABLE */}
        <div className="card shadow">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0 align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Doctor Name</th>
                    <th>Specialization & Qualification</th>
                    <th>Department</th>
                    <th>Experience</th>
                    <th>Consultation Fee</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDoctors.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center p-4">
                        No matching doctors found.
                      </td>
                    </tr>
                  ) : (
                    filteredDoctors.map((d) => (
                      <tr key={d.id}>
                        <td><strong>#{d.id}</strong></td>
                        <td>
                          <strong>{d.name}</strong>
                          <div className="text-muted small">{d.email} | {d.phone}</div>
                        </td>
                        <td>
                          <div><strong>{d.specialization}</strong></div>
                          <small className="text-muted">{d.qualification || "N/A"}</small>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {d.department?.name || "General"}
                          </span>
                        </td>
                        <td>{d.experience} Years</td>
                        <td><strong>${Number(d.consultationFee || 50).toFixed(2)}</strong></td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm me-1"
                            onClick={() => editDoctor(d)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => removeDoctor(d.id)}
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
      </div>
    </div>
  );
}

export default Doctors;