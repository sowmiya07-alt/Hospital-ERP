import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  getDoctorAppointments,
  updateAppointment,
} from "../services/appointmentService";

import {
  addPrescription,
  getPatientPrescriptions,
} from "../services/prescriptionService";

import { getMedicines } from "../services/medicineService";
import { saveConsultation } from "../services/consultationService";

function DoctorDashboard() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [historyPatient, setHistoryPatient] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [activeConsultationAppt, setActiveConsultationAppt] = useState(null);
  const [consultationForm, setConsultationForm] = useState({
    chiefComplaint: "",
    symptoms: "",
    diagnosis: "",
    bloodPressure: "120/80",
    temperature: "98.6",
    pulse: "72",
    weight: "70",
    oxygenSaturation: "98",
    clinicalNotes: "",
    followUpDate: "",
  });

  const [prescription, setPrescription] = useState({
    medicineId: "",
    dosage: "",
    frequency: "",
    duration: "",
  });

  const [savingPrescription, setSavingPrescription] =
    useState(false);

  const username =
    localStorage.getItem("username") || "Doctor";

  const doctorId = localStorage.getItem("doctorId");

  // ============================
  // LOAD DOCTOR APPOINTMENTS
  // ============================

  const loadDoctorAppointments = useCallback(async () => {
    if (!doctorId) {
      setError(
        "Doctor account is not linked to a doctor record."
      );
      setLoading(false);
      return;
    }

    try {
      setError("");

      const response =
        await getDoctorAppointments(doctorId);

      setAppointments(response.data || []);
    } catch (error) {
      console.log(
        "Doctor Appointment Load Error:",
        error
      );

      console.log(
        "Backend Response:",
        error.response?.data
      );

      setError(
        "Unable to load doctor appointments."
      );
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  // ============================
  // LOAD MEDICINES
  // ============================

  const loadMedicines = useCallback(async () => {
    try {
      const response = await getMedicines();

      setMedicines(response.data || []);
    } catch (error) {
      console.log("Medicine Load Error:", error);
    }
  }, []);

  useEffect(() => {
    loadDoctorAppointments();
    loadMedicines();
  }, [loadDoctorAppointments, loadMedicines]);


  // ============================
  // UPDATE APPOINTMENT STATUS
  // ============================

  const changeAppointmentStatus = async (
    appointment,
    newStatus
  ) => {
    if (
      !appointment.patient?.id ||
      !appointment.doctor?.id
    ) {
      alert(
        "Patient or doctor information is missing."
      );
      return;
    }

    const confirmed = window.confirm(
      `Mark this appointment as ${newStatus}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(appointment.id);

      const updatedData = {
        patient: {
          id: appointment.patient.id,
        },

        doctor: {
          id: appointment.doctor.id,
        },

        appointmentDate:
          appointment.appointmentDate,

        appointmentTime:
          appointment.appointmentTime,

        status: newStatus,
      };

      await updateAppointment(
        appointment.id,
        updatedData
      );

      alert(
        `Appointment marked as ${newStatus}`
      );

      await loadDoctorAppointments();
    } catch (error) {
      console.log(
        "Appointment Update Error:",
        error
      );

      console.log(
        "Backend Response:",
        error.response?.data
      );

      alert(
        "Unable to update appointment status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const openConsultationModal = (appointment) => {
    setActiveConsultationAppt(appointment);
    setConsultationForm({
      chiefComplaint: "",
      symptoms: "",
      diagnosis: "",
      bloodPressure: "120/80",
      temperature: "98.6 °F",
      pulse: "72 bpm",
      weight: "70 kg",
      oxygenSaturation: "98%",
      clinicalNotes: "",
      followUpDate: "",
    });
  };

  const handleSaveConsultation = async () => {
    if (!activeConsultationAppt) return;
    if (!consultationForm.diagnosis) {
      alert("Please enter a diagnosis.");
      return;
    }

    try {
      const payload = {
        patient: { id: activeConsultationAppt.patient.id },
        doctor: { id: activeConsultationAppt.doctor.id },
        appointment: { id: activeConsultationAppt.id },
        ...consultationForm,
      };

      await saveConsultation(payload);
      alert("Clinical consultation record saved successfully!");
      setActiveConsultationAppt(null);
      loadDoctorAppointments();
    } catch (err) {
      console.log("Save consultation error:", err);
      alert("Unable to save clinical consultation record.");
    }
  };

  // ============================
  // OPEN PRESCRIPTION FORM
  // ============================

  const openPrescriptionForm = (appointment) => {
    if (!appointment.patient?.id) {
      alert("Patient information is missing.");
      return;
    }

    setSelectedPatient(appointment.patient);

    setPrescription({
      medicineId: "",
      dosage: "",
      frequency: "",
      duration: "",
    });

    setTimeout(() => {
      document
        .getElementById("prescription-form")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  // ============================
  // CANCEL PRESCRIPTION
  // ============================

  const cancelPrescription = () => {
    setSelectedPatient(null);

    setPrescription({
      medicineId: "",
      dosage: "",
      frequency: "",
      duration: "",
    });
  };

  // ============================
  // SAVE PRESCRIPTION
  // ============================

  const savePrescription = async () => {
    if (!selectedPatient?.id) {
      alert("Patient information is missing.");
      return;
    }

    if (
      !prescription.medicineId ||
      !prescription.dosage ||
      !prescription.frequency ||
      !prescription.duration
    ) {
      alert(
        "Please fill all prescription details."
      );
      return;
    }

    if (Number(prescription.duration) <= 0) {
      alert(
        "Duration must be greater than 0."
      );
      return;
    }

    const prescriptionData = {
      patientId: Number(selectedPatient.id),

      medicineId: Number(
        prescription.medicineId
      ),

      dosage: prescription.dosage,

      frequency: prescription.frequency,

      duration: Number(
        prescription.duration
      ),
    };

    try {
      setSavingPrescription(true);

      await addPrescription(
        prescriptionData
      );

      alert(
        `Prescription saved successfully for ${selectedPatient.name}`
      );

      cancelPrescription();

      // Refresh history automatically if
      // this patient's history is open.
      if (
        historyPatient?.id ===
        selectedPatient.id
      ) {
        await loadPrescriptionHistory(
          selectedPatient
        );
      }
    } catch (error) {
      console.log(
        "Prescription Save Error:",
        error
      );

      console.log(
        "Backend Response:",
        error.response?.data
      );

      alert(
        "Unable to save prescription"
      );
    } finally {
      setSavingPrescription(false);
    }
  };

  // ============================
  // VIEW PRESCRIPTION HISTORY
  // ============================

  const loadPrescriptionHistory = async (
    patient
  ) => {
    if (!patient?.id) {
      alert("Patient information is missing.");
      return;
    }

    try {
      setLoadingHistory(true);

      setHistoryPatient(patient);

      const response =
        await getPatientPrescriptions(
          patient.id
        );

      setPatientPrescriptions(
        response.data || []
      );

      setTimeout(() => {
        document
          .getElementById(
            "prescription-history"
          )
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);
    } catch (error) {
      console.log(
        "Prescription History Error:",
        error
      );

      console.log(
        "Backend Response:",
        error.response?.data
      );

      alert(
        "Unable to load prescription history"
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  // ============================
  // CLOSE HISTORY
  // ============================

  const closePrescriptionHistory = () => {
    setHistoryPatient(null);
    setPatientPrescriptions([]);
  };

  // ============================
  // LOGOUT
  // ============================

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ============================
  // COUNTS
  // ============================

  const scheduledCount =
    appointments.filter(
      (a) => a.status === "Scheduled"
    ).length;

  const completedCount =
    appointments.filter(
      (a) => a.status === "Completed"
    ).length;

  const cancelledCount =
    appointments.filter(
      (a) => a.status === "Cancelled"
    ).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
      }}
    >
      {/* HEADER */}

      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand">
          🏥 Hospital ERP - Doctor Portal
        </span>

        <div className="d-flex align-items-center gap-3">
          <span className="text-light">
            👨‍⚕️ {username}
          </span>

          <button
            className="btn btn-outline-light btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container py-4">

        {/* WELCOME */}

        <div className="mb-4">
          <h2>
            Welcome, {username} 👨‍⚕️
          </h2>

          <p className="text-muted">
            Manage appointments, prescribe
            medicines and view patient
            prescription history
          </p>
        </div>

        {/* SUMMARY CARDS */}

        <div className="row mb-4">

          <div className="col-md-3 mb-3">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5>📅 My Appointments</h5>

                <h2 className="mt-3">
                  {appointments.length}
                </h2>

                <p className="text-muted mb-0">
                  Total appointments
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5>⏳ Scheduled</h5>

                <h2 className="mt-3">
                  {scheduledCount}
                </h2>

                <p className="text-muted mb-0">
                  Upcoming appointments
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5>✅ Completed</h5>

                <h2 className="mt-3">
                  {completedCount}
                </h2>

                <p className="text-muted mb-0">
                  Completed appointments
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5>❌ Cancelled</h5>

                <h2 className="mt-3">
                  {cancelledCount}
                </h2>

                <p className="text-muted mb-0">
                  Cancelled appointments
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* APPOINTMENTS TABLE */}

        <div className="card shadow mb-4">
          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center mb-3">

              <h4 className="mb-0">
                📅 My Appointments
              </h4>

              <button
                className="btn btn-outline-primary btn-sm"
                onClick={loadDoctorAppointments}
              >
                Refresh
              </button>

            </div>

            {loading ? (

              <div className="text-center p-4">
                Loading appointments...
              </div>

            ) : error ? (

              <div className="alert alert-danger">
                {error}
              </div>

            ) : (

              <div className="table-responsive">

                <table className="table table-bordered table-hover">

                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Patient</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {appointments.length === 0 ? (

                      <tr>
                        <td
                          colSpan="6"
                          className="text-center"
                        >
                          No Appointments Assigned
                        </td>
                      </tr>

                    ) : (

                      appointments.map(
                        (appointment) => (

                          <tr key={appointment.id}>

                            <td>
                              {appointment.id}
                            </td>

                            <td>
                              {appointment.patient
                                ?.name || "N/A"}
                            </td>

                            <td>
                              {
                                appointment
                                  .appointmentDate
                              }
                            </td>

                            <td>
                              {
                                appointment
                                  .appointmentTime
                              }
                            </td>

                            <td>

                              {appointment.status ===
                                "Scheduled" && (
                                <span className="badge bg-warning text-dark">
                                  Scheduled
                                </span>
                              )}

                              {appointment.status ===
                                "Completed" && (
                                <span className="badge bg-success">
                                  Completed
                                </span>
                              )}

                              {appointment.status ===
                                "Cancelled" && (
                                <span className="badge bg-danger">
                                  Cancelled
                                </span>
                              )}

                            </td>

                            <td>

                              <div className="d-flex flex-wrap gap-2">
                                {appointment.status ===
                                  "Scheduled" && (
                                  <>
                                    <button
                                      className="btn btn-info btn-sm text-white"
                                      onClick={() =>
                                        openConsultationModal(
                                          appointment
                                        )
                                      }
                                    >
                                      🩺 Consultation & Vitals
                                    </button>

                                    <button
                                      className="btn btn-success btn-sm"
                                      disabled={
                                        updatingId ===
                                        appointment.id
                                      }
                                      onClick={() =>
                                        changeAppointmentStatus(
                                          appointment,
                                          "Completed"
                                        )
                                      }
                                    >
                                      ✓ Complete
                                    </button>

                                    <button
                                      className="btn btn-danger btn-sm"
                                      disabled={
                                        updatingId ===
                                        appointment.id
                                      }
                                      onClick={() =>
                                        changeAppointmentStatus(
                                          appointment,
                                          "Cancelled"
                                        )
                                      }
                                    >
                                      ✕ Cancel
                                    </button>
                                  </>
                                )}

                                {appointment.status !==
                                  "Cancelled" && (
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() =>
                                      openPrescriptionForm(
                                        appointment
                                      )
                                    }
                                  >
                                    💊 Prescribe
                                  </button>
                                )}

                                <button
                                  className="btn btn-outline-dark btn-sm"
                                  onClick={() =>
                                    loadPrescriptionHistory(
                                      appointment.patient
                                    )
                                  }
                                >
                                  📋 View Prescriptions
                                </button>

                              </div>

                            </td>

                          </tr>

                        )
                      )

                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>
        </div>

        {/* PRESCRIPTION HISTORY */}

        {historyPatient && (

          <div
            id="prescription-history"
            className="card shadow mb-4"
          >
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center mb-3">

                <div>
                  <h4 className="mb-1">
                    📋 Prescription History
                  </h4>

                  <p className="text-muted mb-0">
                    Patient:{" "}
                    <strong>
                      {historyPatient.name}
                    </strong>
                  </p>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={
                    closePrescriptionHistory
                  }
                >
                  Close
                </button>

              </div>

              {loadingHistory ? (

                <div className="text-center p-4">
                  Loading prescription history...
                </div>

              ) : (

                <div className="table-responsive">

                  <table className="table table-bordered table-hover">

                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Medicine</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Duration</th>
                      </tr>
                    </thead>

                    <tbody>

                      {patientPrescriptions.length ===
                      0 ? (

                        <tr>
                          <td
                            colSpan="5"
                            className="text-center"
                          >
                            No Previous Prescriptions
                            Found
                          </td>
                        </tr>

                      ) : (

                        patientPrescriptions.map(
                          (p) => (

                            <tr key={p.id}>

                              <td>
                                {p.id}
                              </td>

                              <td>
                                {p.medicine
                                  ?.medicineName ||
                                  "N/A"}
                              </td>

                              <td>
                                {p.dosage}
                              </td>

                              <td>
                                {p.frequency}
                              </td>

                              <td>
                                {p.duration} Days
                              </td>

                            </tr>

                          )
                        )

                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>
          </div>

        )}

        {/* PRESCRIBE MEDICINE FORM */}

        {selectedPatient && (

          <div
            id="prescription-form"
            className="card shadow mb-4"
          >
            <div className="card-body">

              <h4 className="mb-1">
                💊 Prescribe Medicine
              </h4>

              <p className="text-muted mb-4">
                Prescription for{" "}
                <strong>
                  {selectedPatient.name}
                </strong>
              </p>

              <label className="form-label">
                Patient
              </label>

              <input
                type="text"
                className="form-control mb-3"
                value={
                  selectedPatient.name || ""
                }
                disabled
              />

              <label className="form-label">
                Medicine
              </label>

              <select
                className="form-select mb-3"
                value={
                  prescription.medicineId
                }
                onChange={(e) =>
                  setPrescription({
                    ...prescription,
                    medicineId:
                      e.target.value,
                  })
                }
              >

                <option value="">
                  Select Medicine
                </option>

                {medicines.map(
                  (medicine) => (

                    <option
                      key={medicine.id}
                      value={medicine.id}
                    >
                      {medicine.medicineName}
                      {medicine.dosage
                        ? ` - ${medicine.dosage}`
                        : ""}
                    </option>

                  )
                )}

              </select>

              <label className="form-label">
                Dosage
              </label>

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Example: 500mg"
                value={
                  prescription.dosage
                }
                onChange={(e) =>
                  setPrescription({
                    ...prescription,
                    dosage:
                      e.target.value,
                  })
                }
              />

              <label className="form-label">
                Frequency
              </label>

              <select
                className="form-select mb-3"
                value={
                  prescription.frequency
                }
                onChange={(e) =>
                  setPrescription({
                    ...prescription,
                    frequency:
                      e.target.value,
                  })
                }
              >

                <option value="">
                  Select Frequency
                </option>

                <option value="Once Daily">
                  Once Daily
                </option>

                <option value="Twice Daily">
                  Twice Daily
                </option>

                <option value="Three Times Daily">
                  Three Times Daily
                </option>

                <option value="Before Food">
                  Before Food
                </option>

                <option value="After Food">
                  After Food
                </option>

              </select>

              <label className="form-label">
                Duration (Days)
              </label>

              <input
                type="number"
                min="1"
                className="form-control mb-3"
                placeholder="Example: 5"
                value={
                  prescription.duration
                }
                onChange={(e) =>
                  setPrescription({
                    ...prescription,
                    duration:
                      e.target.value,
                  })
                }
              />

              <div className="d-flex gap-2">

                <button
                  className="btn btn-success"
                  onClick={savePrescription}
                  disabled={
                    savingPrescription
                  }
                >
                  {savingPrescription
                    ? "Saving..."
                    : "💾 Save Prescription"}
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={
                    cancelPrescription
                  }
                  disabled={
                    savingPrescription
                  }
                >
                  Cancel
                </button>

              </div>

            </div>
          </div>

        )}

        {/* CLINICAL CONSULTATION MODAL */}
        {activeConsultationAppt && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content shadow-lg">
                <div className="modal-header bg-info text-white">
                  <h5 className="modal-title">
                    🩺 Clinical Consultation Record - Patient: {activeConsultationAppt.patient?.name}
                  </h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setActiveConsultationAppt(null)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="alert alert-light border mb-3">
                    <strong>Appointment Details:</strong> Date: {activeConsultationAppt.appointmentDate} | Time: {activeConsultationAppt.appointmentTime}
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Chief Complaint</label>
                      <input
                        className="form-control"
                        placeholder="e.g. Chest pain, Fever for 2 days"
                        value={consultationForm.chiefComplaint}
                        onChange={(e) => setConsultationForm({ ...consultationForm, chiefComplaint: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Symptoms</label>
                      <input
                        className="form-control"
                        placeholder="e.g. Fatigue, Shortness of breath"
                        value={consultationForm.symptoms}
                        onChange={(e) => setConsultationForm({ ...consultationForm, symptoms: e.target.value })}
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label fw-bold">Diagnosis *</label>
                      <input
                        className="form-control"
                        placeholder="e.g. Acute Bronchitis / Essential Hypertension"
                        value={consultationForm.diagnosis}
                        onChange={(e) => setConsultationForm({ ...consultationForm, diagnosis: e.target.value })}
                      />
                    </div>

                    <div className="col-12"><hr /><h6>🩺 Patient Vitals</h6></div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold">Blood Pressure</label>
                      <input
                        className="form-control"
                        placeholder="120/80"
                        value={consultationForm.bloodPressure}
                        onChange={(e) => setConsultationForm({ ...consultationForm, bloodPressure: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold">Temperature</label>
                      <input
                        className="form-control"
                        placeholder="98.6 °F"
                        value={consultationForm.temperature}
                        onChange={(e) => setConsultationForm({ ...consultationForm, temperature: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold">Pulse Rate</label>
                      <input
                        className="form-control"
                        placeholder="72 bpm"
                        value={consultationForm.pulse}
                        onChange={(e) => setConsultationForm({ ...consultationForm, pulse: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Weight</label>
                      <input
                        className="form-control"
                        placeholder="70 kg"
                        value={consultationForm.weight}
                        onChange={(e) => setConsultationForm({ ...consultationForm, weight: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Oxygen Saturation (SpO2)</label>
                      <input
                        className="form-control"
                        placeholder="98%"
                        value={consultationForm.oxygenSaturation}
                        onChange={(e) => setConsultationForm({ ...consultationForm, oxygenSaturation: e.target.value })}
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label fw-bold">Clinical Notes & Recommendations</label>
                      <textarea
                        rows="3"
                        className="form-control"
                        placeholder="Additional clinical notes, dietary advice, or lifestyle modifications..."
                        value={consultationForm.clinicalNotes}
                        onChange={(e) => setConsultationForm({ ...consultationForm, clinicalNotes: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Follow-Up Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={consultationForm.followUpDate}
                        onChange={(e) => setConsultationForm({ ...consultationForm, followUpDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-success" onClick={handleSaveConsultation}>
                    💾 Save Consultation Record & Complete
                  </button>
                  <button className="btn btn-secondary" onClick={() => setActiveConsultationAppt(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default DoctorDashboard;