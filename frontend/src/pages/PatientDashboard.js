import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getPatientAppointments,
  addAppointment,
} from "../services/appointmentService";

import {
  getPatientPrescriptions,
} from "../services/prescriptionService";

import {
  getPatientBillings,
} from "../services/billingService";

import {
  getDoctors,
} from "../services/doctorService";

import {
  createMedicationAlarm,
  getPatientMedicationAlarms,
  toggleMedicationAlarm,
  deleteMedicationAlarm,
} from "../services/medicationAlarmService";

import { TIME_SLOTS, formatTime12Hour } from "../utils/timeUtils";

function PatientDashboard() {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [billings, setBillings] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Medication alarms
  const [medicationAlarms, setMedicationAlarms] = useState([]);
  const [alarmTimes, setAlarmTimes] = useState({});
  const [alarmLoadingId, setAlarmLoadingId] = useState(null);
  const [alarmError, setAlarmError] = useState("");

  const [loadingAppointments, setLoadingAppointments] =
    useState(true);

  const [loadingPrescriptions, setLoadingPrescriptions] =
    useState(true);

  const [loadingBillings, setLoadingBillings] =
    useState(true);

  const [loadingAlarms, setLoadingAlarms] =
    useState(true);

  const [appointmentError, setAppointmentError] =
    useState("");

  const [prescriptionError, setPrescriptionError] =
    useState("");

  const [billingError, setBillingError] =
    useState("");

  const [showBookingForm, setShowBookingForm] =
    useState(false);

  const [booking, setBooking] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  const [bookingLoading, setBookingLoading] =
    useState(false);

  // ==========================================
  // LOGGED-IN PATIENT
  // ==========================================

  const username =
    localStorage.getItem("username") || "Patient";

  const patientId =
    localStorage.getItem("patientId");

  // ==========================================
  // LOAD INITIAL DATA
  // ==========================================

  useEffect(() => {
    loadPatientAppointments();
    loadPatientPrescriptions();
    loadPatientBillings();
    loadDoctors();
    loadMedicationAlarms();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================
  // MEDICATION ALARM CHECKER
  // ==========================================

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const currentTime =
        `${String(now.getHours()).padStart(2, "0")}:` +
        `${String(now.getMinutes()).padStart(2, "0")}`;

      const today =
        now.toISOString().split("T")[0];

      medicationAlarms.forEach((alarm) => {
        if (!alarm.active) {
          return;
        }

        if (alarm.alarmTime !== currentTime) {
          return;
        }

        // Prevent same alarm from repeatedly appearing
        // every few seconds during the same minute.

        const reminderKey =
          `medicationAlarm-${alarm.id}-${today}-${currentTime}`;

        if (sessionStorage.getItem(reminderKey)) {
          return;
        }

        sessionStorage.setItem(
          reminderKey,
          "shown"
        );

        const medicineName =
          alarm.prescription?.medicine?.medicineName ||
          "your medicine";

        const dosage =
          alarm.prescription?.dosage || "";

        alert(
          `💊 MEDICATION REMINDER\n\n` +
          `Time to take: ${medicineName}\n` +
          `${dosage ? `Dosage: ${dosage}\n` : ""}` +
          `Time: ${alarm.alarmTime}`
        );
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [medicationAlarms]);

  // ==========================================
  // LOAD APPOINTMENTS
  // ==========================================

  const loadPatientAppointments = async () => {
    if (!patientId) {
      setAppointmentError(
        "Patient account is not linked to a patient record."
      );

      setLoadingAppointments(false);
      return;
    }

    try {
      setAppointmentError("");

      const response =
        await getPatientAppointments(patientId);

      setAppointments(response.data || []);
    } catch (error) {
      console.log(
        "Patient Appointment Load Error:",
        error
      );

      console.log(
        "Backend Response:",
        error.response?.data
      );

      setAppointmentError(
        "Unable to load patient appointments."
      );
    } finally {
      setLoadingAppointments(false);
    }
  };

  // ==========================================
  // LOAD PRESCRIPTIONS
  // ==========================================

  const loadPatientPrescriptions = async () => {
    if (!patientId) {
      setPrescriptionError(
        "Patient account is not linked to a patient record."
      );

      setLoadingPrescriptions(false);
      return;
    }

    try {
      setPrescriptionError("");

      const response =
        await getPatientPrescriptions(patientId);

      setPrescriptions(response.data || []);
    } catch (error) {
      console.log(
        "Patient Prescription Load Error:",
        error
      );

      console.log(
        "Backend Response:",
        error.response?.data
      );

      setPrescriptionError(
        "Unable to load patient prescriptions."
      );
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  // ==========================================
  // LOAD BILLING
  // ==========================================

  const loadPatientBillings = async () => {
    if (!patientId) {
      setBillingError(
        "Patient account is not linked to a patient record."
      );

      setLoadingBillings(false);
      return;
    }

    try {
      setBillingError("");

      const response =
        await getPatientBillings(patientId);

      setBillings(response.data || []);
    } catch (error) {
      console.log(
        "Patient Billing Load Error:",
        error
      );

      console.log(
        "Backend Response:",
        error.response?.data
      );

      setBillingError(
        "Unable to load patient billing records."
      );
    } finally {
      setLoadingBillings(false);
    }
  };

  // ==========================================
  // LOAD DOCTORS
  // ==========================================

  const loadDoctors = async () => {
    try {
      const response = await getDoctors();

      setDoctors(response.data || []);
    } catch (error) {
      console.log(
        "Doctor Load Error:",
        error
      );

      console.log(
        "Backend Response:",
        error.response?.data
      );
    }
  };

  // ==========================================
  // LOAD MEDICATION ALARMS
  // ==========================================

  const loadMedicationAlarms = async () => {
    if (!patientId) {
      setAlarmError(
        "Patient account is not linked to a patient record."
      );

      setLoadingAlarms(false);
      return;
    }

    try {
      setAlarmError("");

      const response =
        await getPatientMedicationAlarms(
          patientId
        );

      setMedicationAlarms(
        response.data || []
      );
    } catch (error) {
      console.log(
        "Medication Alarm Load Error:",
        error
      );

      console.log(
        "Backend Response:",
        error.response?.data
      );

      setAlarmError(
        "Unable to load medication alarms."
      );
    } finally {
      setLoadingAlarms(false);
    }
  };

  // ==========================================
  // CREATE MEDICATION ALARM
  // ==========================================

  const setMedicationAlarm = async (
    prescription
  ) => {
    if (!patientId) {
      alert(
        "Patient account is not linked correctly."
      );

      return;
    }

    const selectedTime =
      alarmTimes[prescription.id];

    if (!selectedTime) {
      alert(
        "Please select a medication reminder time."
      );

      return;
    }

    const alarmData = {
      patientId: Number(patientId),
      prescriptionId:
        Number(prescription.id),
      alarmTime: selectedTime,
    };

    try {
      setAlarmLoadingId(
        prescription.id
      );

      await createMedicationAlarm(
        alarmData
      );

      alert(
        "⏰ Medication Alarm Set Successfully"
      );

      setAlarmTimes((previous) => ({
        ...previous,
        [prescription.id]: "",
      }));

      await loadMedicationAlarms();
    } catch (error) {
      console.log(
        "Create Medication Alarm Error:",
        error
      );

      console.log(
        "Backend Response:",
        error.response?.data
      );

      alert(
        "Unable to set medication alarm."
      );
    } finally {
      setAlarmLoadingId(null);
    }
  };

  // ==========================================
  // TOGGLE MEDICATION ALARM
  // ==========================================

  const toggleAlarm = async (alarmId) => {
    try {
      await toggleMedicationAlarm(
        alarmId
      );

      await loadMedicationAlarms();
    } catch (error) {
      console.log(
        "Toggle Medication Alarm Error:",
        error
      );

      alert(
        "Unable to change alarm status."
      );
    }
  };

  // ==========================================
  // DELETE MEDICATION ALARM
  // ==========================================

  const removeAlarm = async (alarmId) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this medication alarm?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMedicationAlarm(
        alarmId
      );

      alert(
        "Medication Alarm Deleted Successfully"
      );

      await loadMedicationAlarms();
    } catch (error) {
      console.log(
        "Delete Medication Alarm Error:",
        error
      );

      alert(
        "Unable to delete medication alarm."
      );
    }
  };

  // ==========================================
  // OPEN BOOKING FORM
  // ==========================================

  const openBookingForm = () => {
    setShowBookingForm(true);

    setTimeout(() => {
      document
        .getElementById("booking-form")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  // ==========================================
  // CANCEL BOOKING
  // ==========================================

  const cancelBooking = () => {
    setShowBookingForm(false);

    setBooking({
      doctorId: "",
      appointmentDate: "",
      appointmentTime: "",
    });
  };

  // ==========================================
  // BOOK APPOINTMENT
  // ==========================================

  const bookAppointment = async () => {
    if (!patientId) {
      alert(
        "Patient account is not linked correctly."
      );

      return;
    }

    if (
      !booking.doctorId ||
      !booking.appointmentDate ||
      !booking.appointmentTime
    ) {
      alert(
        "Please fill all appointment details."
      );

      return;
    }

    const appointmentData = {
      patient: {
        id: Number(patientId),
      },

      doctor: {
        id: Number(
          booking.doctorId
        ),
      },

      appointmentDate:
        booking.appointmentDate,

      appointmentTime:
        booking.appointmentTime,

      status: "Scheduled",
    };

    try {
      setBookingLoading(true);

      await addAppointment(
        appointmentData
      );

      alert(
        "Appointment Booked Successfully"
      );

      cancelBooking();

      await loadPatientAppointments();
    } catch (error) {
      console.log(
        "Appointment Booking Error:",
        error
      );

      console.log(
        "Backend Response:",
        error.response?.data
      );

      alert(
        "Unable to book appointment"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.clear();

    navigate("/");
  };

  // ==========================================
  // COUNTS
  // ==========================================

  const scheduledCount =
    appointments.filter(
      (a) =>
        a.status === "Scheduled"
    ).length;

  const completedCount =
    appointments.filter(
      (a) =>
        a.status === "Completed"
    ).length;

  const pendingBills =
    billings.filter(
      (b) =>
        b.paymentStatus === "Pending"
    ).length;

  const activeAlarmCount =
    medicationAlarms.filter(
      (alarm) => alarm.active
    ).length;

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

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
          🏥 Hospital ERP - Patient Portal
        </span>

        <div className="d-flex align-items-center gap-3">
          <span className="text-light">
            👤 {username}
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

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h2>
              Welcome, {username} 👋
            </h2>

            <p className="text-muted mb-0">
              Manage appointments,
              prescriptions, medication
              reminders and billing records
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={openBookingForm}
          >
            ➕ Book Appointment
          </button>
        </div>

        {/* SUMMARY CARDS */}

        <div className="row mb-4">
          <div className="col-md-4 col-lg-2 mb-3">
            <div className="card shadow h-100">
              <div className="card-body">
                <h6>📅 Appointments</h6>

                <h2 className="mt-3">
                  {appointments.length}
                </h2>

                <small className="text-muted">
                  Total
                </small>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-lg-2 mb-3">
            <div className="card shadow h-100">
              <div className="card-body">
                <h6>⏳ Scheduled</h6>

                <h2 className="mt-3">
                  {scheduledCount}
                </h2>

                <small className="text-muted">
                  Upcoming
                </small>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-lg-2 mb-3">
            <div className="card shadow h-100">
              <div className="card-body">
                <h6>✅ Completed</h6>

                <h2 className="mt-3">
                  {completedCount}
                </h2>

                <small className="text-muted">
                  Completed
                </small>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-lg-2 mb-3">
            <div className="card shadow h-100">
              <div className="card-body">
                <h6>💊 Prescriptions</h6>

                <h2 className="mt-3">
                  {prescriptions.length}
                </h2>

                <small className="text-muted">
                  Medicines
                </small>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-lg-2 mb-3">
            <div className="card shadow h-100">
              <div className="card-body">
                <h6>⏰ Active Alarms</h6>

                <h2 className="mt-3">
                  {activeAlarmCount}
                </h2>

                <small className="text-muted">
                  Medication reminders
                </small>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-lg-2 mb-3">
            <div className="card shadow h-100">
              <div className="card-body">
                <h6>💳 Pending Bills</h6>

                <h2 className="mt-3">
                  {pendingBills}
                </h2>

                <small className="text-muted">
                  Pending payments
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* BOOK APPOINTMENT */}

        {showBookingForm && (
          <div
            id="booking-form"
            className="card shadow mb-4"
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="mb-1">
                    📅 Book New Appointment
                  </h4>

                  <p className="text-muted mb-0">
                    Select doctor, date and
                    appointment time
                  </p>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={cancelBooking}
                >
                  Close
                </button>
              </div>

              <label className="form-label">
                Select Doctor
              </label>

              <select
                className="form-select mb-3"
                value={booking.doctorId}
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    doctorId:
                      e.target.value,
                  })
                }
              >
                <option value="">
                  Select Doctor
                </option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor.id}
                    value={doctor.id}
                  >
                    {doctor.name}
                    {doctor.specialization
                      ? ` - ${doctor.specialization}`
                      : ""}
                  </option>
                ))}
              </select>

              <label className="form-label">
                Appointment Date
              </label>

              <input
                type="date"
                min={today}
                className="form-control mb-3"
                value={
                  booking.appointmentDate
                }
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    appointmentDate:
                      e.target.value,
                  })
                }
              />

              <label className="form-label">
                Appointment Time (12-Hour AM/PM)
              </label>

              <select
                className="form-select mb-3"
                value={booking.appointmentTime}
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    appointmentTime: e.target.value,
                  })
                }
              >
                <option value="">
                  Select Time Slot (e.g. 02:00 PM)
                </option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>

              <div className="alert alert-info">
                The appointment will be
                created with status{" "}
                <strong>
                  Scheduled
                </strong>.
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-success"
                  onClick={bookAppointment}
                  disabled={
                    bookingLoading
                  }
                >
                  {bookingLoading
                    ? "Booking..."
                    : "📅 Book Appointment"}
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={cancelBooking}
                  disabled={
                    bookingLoading
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MY APPOINTMENTS */}

        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">
                📅 My Appointments
              </h4>

              <button
                className="btn btn-outline-primary btn-sm"
                onClick={
                  loadPatientAppointments
                }
              >
                Refresh
              </button>
            </div>

            {loadingAppointments ? (
              <div className="text-center p-4">
                Loading appointments...
              </div>
            ) : appointmentError ? (
              <div className="alert alert-danger">
                {appointmentError}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Doctor</th>
                      <th>
                        Specialization
                      </th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {appointments.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center"
                        >
                          No Appointments
                          Found
                        </td>
                      </tr>
                    ) : (
                      appointments.map(
                        (appointment) => (
                          <tr
                            key={
                              appointment.id
                            }
                          >
                            <td>
                              {
                                appointment.id
                              }
                            </td>

                            <td>
                              {appointment
                                .doctor?.name ||
                                "N/A"}
                            </td>

                            <td>
                              {appointment
                                .doctor
                                ?.specialization ||
                                "N/A"}
                            </td>

                            <td>
                              {
                                appointment
                                  .appointmentDate
                              }
                            </td>

                            <td>
                              {formatTime12Hour(
                                appointment.appointmentTime
                              )}
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

        {/* MY PRESCRIPTIONS + SET ALARM */}

        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">
                💊 My Prescriptions
              </h4>

              <button
                className="btn btn-outline-primary btn-sm"
                onClick={
                  loadPatientPrescriptions
                }
              >
                Refresh
              </button>
            </div>

            <p className="text-muted">
              Select a reminder time beside
              your prescribed medicine to
              create a medication alarm.
            </p>

            {loadingPrescriptions ? (
              <div className="text-center p-4">
                Loading prescriptions...
              </div>
            ) : prescriptionError ? (
              <div className="alert alert-danger">
                {prescriptionError}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Duration</th>
                      <th>
                        Reminder Time
                      </th>
                      <th>Alarm</th>
                    </tr>
                  </thead>

                  <tbody>
                    {prescriptions.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center"
                        >
                          No Prescriptions
                          Found
                        </td>
                      </tr>
                    ) : (
                      prescriptions.map(
                        (
                          prescriptionItem
                        ) => (
                          <tr
                            key={
                              prescriptionItem.id
                            }
                          >
                            <td>
                              {
                                prescriptionItem.id
                              }
                            </td>

                            <td>
                              <strong>
                                {prescriptionItem
                                  .medicine
                                  ?.medicineName ||
                                  "N/A"}
                              </strong>
                            </td>

                            <td>
                              {
                                prescriptionItem
                                  .dosage
                              }
                            </td>

                            <td>
                              {
                                prescriptionItem
                                  .frequency
                              }
                            </td>

                            <td>
                              {
                                prescriptionItem
                                  .duration
                              }{" "}
                              Days
                            </td>

                            <td>
                              <input
                                type="time"
                                className="form-control"
                                value={
                                  alarmTimes[
                                    prescriptionItem
                                      .id
                                  ] || ""
                                }
                                onChange={(
                                  e
                                ) =>
                                  setAlarmTimes(
                                    (
                                      previous
                                    ) => ({
                                      ...previous,

                                      [prescriptionItem.id]:
                                        e
                                          .target
                                          .value,
                                    })
                                  )
                                }
                              />
                            </td>

                            <td>
                              <button
                                className="btn btn-success btn-sm"
                                disabled={
                                  alarmLoadingId ===
                                  prescriptionItem.id
                                }
                                onClick={() =>
                                  setMedicationAlarm(
                                    prescriptionItem
                                  )
                                }
                              >
                                {alarmLoadingId ===
                                prescriptionItem.id
                                  ? "Setting..."
                                  : "⏰ Set Alarm"}
                              </button>
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

        {/* MY MEDICATION ALARMS */}

        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="mb-1">
                  ⏰ My Medication Alarms
                </h4>

                <small className="text-muted">
                  Active reminders will alert
                  you at the selected time
                  while this portal is open.
                </small>
              </div>

              <button
                className="btn btn-outline-primary btn-sm"
                onClick={
                  loadMedicationAlarms
                }
              >
                Refresh
              </button>
            </div>

            {loadingAlarms ? (
              <div className="text-center p-4">
                Loading medication alarms...
              </div>
            ) : alarmError ? (
              <div className="alert alert-danger">
                {alarmError}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Alarm Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {medicationAlarms.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center"
                        >
                          No Medication Alarms
                          Set
                        </td>
                      </tr>
                    ) : (
                      medicationAlarms.map(
                        (alarm) => (
                          <tr
                            key={alarm.id}
                          >
                            <td>
                              <strong>
                                {alarm
                                  .prescription
                                  ?.medicine
                                  ?.medicineName ||
                                  "N/A"}
                              </strong>
                            </td>

                            <td>
                              {alarm
                                .prescription
                                ?.dosage ||
                                "N/A"}
                            </td>

                            <td>
                              {alarm
                                .prescription
                                ?.frequency ||
                                "N/A"}
                            </td>

                            <td>
                              <strong>
                                ⏰{" "}
                                {
                                  alarm.alarmTime
                                }
                              </strong>
                            </td>

                            <td>
                              {alarm.active ? (
                                <span className="badge bg-success">
                                  ON
                                </span>
                              ) : (
                                <span className="badge bg-secondary">
                                  OFF
                                </span>
                              )}
                            </td>

                            <td>
                              <button
                                className={`btn btn-sm me-2 ${
                                  alarm.active
                                    ? "btn-warning"
                                    : "btn-success"
                                }`}
                                onClick={() =>
                                  toggleAlarm(
                                    alarm.id
                                  )
                                }
                              >
                                {alarm.active
                                  ? "Turn OFF"
                                  : "Turn ON"}
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  removeAlarm(
                                    alarm.id
                                  )
                                }
                              >
                                Delete
                              </button>
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

        {/* MY BILLING */}

        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">
                💳 My Billing
              </h4>

              <button
                className="btn btn-outline-primary btn-sm"
                onClick={
                  loadPatientBillings
                }
              >
                Refresh
              </button>
            </div>

            {loadingBillings ? (
              <div className="text-center p-4">
                Loading billing records...
              </div>
            ) : billingError ? (
              <div className="alert alert-danger">
                {billingError}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Bill ID</th>
                      <th>Amount</th>
                      <th>
                        Payment Status
                      </th>
                      <th>
                        Payment Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {billings.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center"
                        >
                          No Billing Records
                          Found
                        </td>
                      </tr>
                    ) : (
                      billings.map(
                        (bill) => (
                          <tr key={bill.id}>
                            <td>
                              {bill.id}
                            </td>

                            <td>
                              ₹{bill.amount}
                            </td>

                            <td>
                              {bill.paymentStatus ===
                                "Paid" && (
                                <span className="badge bg-success">
                                  Paid
                                </span>
                              )}

                              {bill.paymentStatus ===
                                "Pending" && (
                                <span className="badge bg-warning text-dark">
                                  Pending
                                </span>
                              )}

                              {bill.paymentStatus ===
                                "Cancelled" && (
                                <span className="badge bg-danger">
                                  Cancelled
                                </span>
                              )}
                            </td>

                            <td>
                              {bill.paymentDate ||
                                "N/A"}
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
      </div>
    </div>
  );
}

export default PatientDashboard;