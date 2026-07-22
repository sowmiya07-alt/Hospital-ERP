import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

import {
  getAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from "../services/appointmentService";

import { getPatients } from "../services/patientService";
import { getDoctors } from "../services/doctorService";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // SEARCH AND FILTER
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [appointment, setAppointment] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    status: "Scheduled",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadAppointments();
    loadPatients();
    loadDoctors();
  }, []);

  // LOAD APPOINTMENTS
  const loadAppointments = () => {
    getAppointments()
      .then((response) => {
        setAppointments(response.data);
      })
      .catch((error) => {
        console.log("Appointment Load Error:", error);
      });
  };

  // LOAD PATIENTS
  const loadPatients = () => {
    getPatients()
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.log("Patient Load Error:", error);
      });
  };

  // LOAD DOCTORS
  const loadDoctors = () => {
    getDoctors()
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((error) => {
        console.log("Doctor Load Error:", error);
      });
  };

  // RESET FORM
  const resetForm = () => {
    setAppointment({
      patientId: "",
      doctorId: "",
      appointmentDate: "",
      appointmentTime: "",
      status: "Scheduled",
    });

    setEditingId(null);
  };

  // SAVE / UPDATE
  const saveAppointment = () => {
    if (
      !appointment.patientId ||
      !appointment.doctorId ||
      !appointment.appointmentDate ||
      !appointment.appointmentTime
    ) {
      alert("Please fill all appointment details");
      return;
    }

    const appointmentData = {
      patient: {
        id: Number(appointment.patientId),
      },

      doctor: {
        id: Number(appointment.doctorId),
      },

      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status,
    };

    // CREATE
    if (editingId === null) {
      addAppointment(appointmentData)
        .then(() => {
          alert("Appointment Saved Successfully");

          loadAppointments();
          resetForm();
        })
        .catch((error) => {
          console.log("Save Appointment Error:", error);
          console.log(
            "Backend Response:",
            error.response?.data
          );

          alert("Unable to Save Appointment");
        });
    }

    // UPDATE
    else {
      updateAppointment(editingId, appointmentData)
        .then(() => {
          alert("Appointment Updated Successfully");

          loadAppointments();
          resetForm();
        })
        .catch((error) => {
          console.log("Update Appointment Error:", error);
          console.log(
            "Backend Response:",
            error.response?.data
          );

          alert("Unable to Update Appointment");
        });
    }
  };

  // EDIT
  const editAppointment = (a) => {
    setAppointment({
      patientId: a.patient?.id || "",
      doctorId: a.doctor?.id || "",
      appointmentDate: a.appointmentDate || "",
      appointmentTime: a.appointmentTime || "",
      status: a.status || "Scheduled",
    });

    setEditingId(a.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE
  const removeAppointment = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this appointment?"
      )
    ) {
      deleteAppointment(id)
        .then(() => {
          alert("Appointment Deleted Successfully");

          loadAppointments();

          if (editingId === id) {
            resetForm();
          }
        })
        .catch((error) => {
          console.log(
            "Delete Appointment Error:",
            error
          );

          console.log(
            "Backend Response:",
            error.response?.data
          );

          alert("Unable to Delete Appointment");
        });
    }
  };

  // SEARCH + STATUS FILTER
  const filteredAppointments = appointments.filter((a) => {
    const searchText = search.toLowerCase();

    const patientName =
      a.patient?.name?.toLowerCase() || "";

    const doctorName =
      a.doctor?.name?.toLowerCase() || "";

    const specialization =
      a.doctor?.specialization?.toLowerCase() || "";

    const date =
      a.appointmentDate?.toLowerCase() || "";

    const time =
      a.appointmentTime?.toLowerCase() || "";

    const status =
      a.status?.toLowerCase() || "";

    const matchesSearch =
      patientName.includes(searchText) ||
      doctorName.includes(searchText) ||
      specialization.includes(searchText) ||
      date.includes(searchText) ||
      time.includes(searchText) ||
      status.includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      a.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="d-flex">

      <Sidebar />

      <div className="container p-4">

        <h2 className="mb-4">
          Appointment Management
        </h2>

        {/* APPOINTMENT FORM */}

        <div className="card shadow p-4 mb-4">

          <label className="form-label">
            Patient
          </label>

          <select
            className="form-select mb-3"
            value={appointment.patientId}
            onChange={(e) =>
              setAppointment({
                ...appointment,
                patientId: e.target.value,
              })
            }
          >
            <option value="">
              Select Patient
            </option>

            {patients.map((patient) => (
              <option
                key={patient.id}
                value={patient.id}
              >
                {patient.name}
              </option>
            ))}
          </select>

          <label className="form-label">
            Doctor
          </label>

          <select
            className="form-select mb-3"
            value={appointment.doctorId}
            onChange={(e) =>
              setAppointment({
                ...appointment,
                doctorId: e.target.value,
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
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>

          <label className="form-label">
            Appointment Date
          </label>

          <input
            type="date"
            className="form-control mb-3"
            value={appointment.appointmentDate}
            onChange={(e) =>
              setAppointment({
                ...appointment,
                appointmentDate: e.target.value,
              })
            }
          />

          <label className="form-label">
            Appointment Time
          </label>

          <input
            type="time"
            className="form-control mb-3"
            value={appointment.appointmentTime}
            onChange={(e) =>
              setAppointment({
                ...appointment,
                appointmentTime: e.target.value,
              })
            }
          />

          <label className="form-label">
            Status
          </label>

          <select
            className="form-select mb-3"
            value={appointment.status}
            onChange={(e) =>
              setAppointment({
                ...appointment,
                status: e.target.value,
              })
            }
          >
            <option value="Scheduled">
              Scheduled
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>

          <div>

            <button
              className={`btn ${
                editingId === null
                  ? "btn-success"
                  : "btn-warning"
              }`}
              onClick={saveAppointment}
            >
              {editingId === null
                ? "Save Appointment"
                : "Update Appointment"}
            </button>

            {editingId !== null && (
              <button
                className="btn btn-secondary ms-2"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}

          </div>

        </div>

        {/* SEARCH + FILTER */}

        <div className="card shadow p-3 mb-3">

          <div className="row">

            <div className="col-md-8 mb-2 mb-md-0">

              <input
                type="text"
                className="form-control"
                placeholder="Search patient, doctor, date or status..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="col-md-4">

              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >

                <option value="All">
                  All Status
                </option>

                <option value="Scheduled">
                  Scheduled
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* APPOINTMENT TABLE */}

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
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredAppointments.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center"
                  >
                    No Matching Appointments Found
                  </td>

                </tr>

              ) : (

                filteredAppointments.map((a) => (

                  <tr key={a.id}>

                    <td>{a.id}</td>

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
                      {a.status}
                    </td>

                    <td>

                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() =>
                          editAppointment(a)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          removeAppointment(a.id)
                        }
                      >
                        Delete
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
  );
}

export default Appointments;