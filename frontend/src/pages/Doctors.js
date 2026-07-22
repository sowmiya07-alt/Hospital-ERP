import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

import {
  getDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
} from "../services/doctorService";

function Doctors() {
  const [doctors, setDoctors] = useState([]);

  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] =
    useState("All");

  const [doctor, setDoctor] = useState({
    name: "",
    specialization: "",
    phone: "",
    email: "",
    experience: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadDoctors();
  }, []);

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
    setDoctor({
      name: "",
      specialization: "",
      phone: "",
      email: "",
      experience: "",
    });

    setEditingId(null);
  };

  // SAVE / UPDATE
  const saveDoctor = () => {
    if (
      !doctor.name ||
      !doctor.specialization ||
      !doctor.phone ||
      !doctor.email ||
      doctor.experience === ""
    ) {
      alert("Please fill all doctor details");
      return;
    }

    const doctorData = {
      ...doctor,
      experience: Number(doctor.experience),
    };

    if (editingId === null) {
      addDoctor(doctorData)
        .then(() => {
          alert("Doctor Saved Successfully");

          loadDoctors();
          resetForm();
        })
        .catch((error) => {
          console.log("Save Doctor Error:", error);
          console.log(
            "Backend Response:",
            error.response?.data
          );

          alert("Unable to Save Doctor");
        });
    } else {
      updateDoctor(editingId, doctorData)
        .then(() => {
          alert("Doctor Updated Successfully");

          loadDoctors();
          resetForm();
        })
        .catch((error) => {
          console.log("Update Doctor Error:", error);

          alert("Unable to Update Doctor");
        });
    }
  };

  // EDIT
  const editDoctor = (d) => {
    setDoctor({
      name: d.name || "",
      specialization: d.specialization || "",
      phone: d.phone || "",
      email: d.email || "",
      experience: d.experience ?? "",
    });

    setEditingId(d.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE
  const removeDoctor = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this doctor?"
      )
    ) {
      deleteDoctor(id)
        .then(() => {
          alert("Doctor Deleted Successfully");

          loadDoctors();

          if (editingId === id) {
            resetForm();
          }
        })
        .catch((error) => {
          console.log("Delete Doctor Error:", error);

          alert("Unable to Delete Doctor");
        });
    }
  };

  // CREATE SPECIALIZATION LIST
  const specializations = [
    ...new Set(
      doctors
        .map((d) => d.specialization)
        .filter(Boolean)
    ),
  ];

  // SEARCH + FILTER
  const filteredDoctors = doctors.filter((d) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (d.name || "")
        .toLowerCase()
        .includes(searchText) ||
      (d.specialization || "")
        .toLowerCase()
        .includes(searchText) ||
      (d.phone || "")
        .toLowerCase()
        .includes(searchText) ||
      (d.email || "")
        .toLowerCase()
        .includes(searchText) ||
      String(d.experience ?? "").includes(searchText);

    const matchesSpecialization =
      specializationFilter === "All" ||
      d.specialization === specializationFilter;

    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container p-4">
        <h2 className="mb-4">
          Doctor Management
        </h2>

        {/* DOCTOR FORM */}

        <div className="card shadow p-4 mb-4">
          <input
            className="form-control mb-2"
            placeholder="Doctor Name"
            value={doctor.name}
            onChange={(e) =>
              setDoctor({
                ...doctor,
                name: e.target.value,
              })
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Specialization"
            value={doctor.specialization}
            onChange={(e) =>
              setDoctor({
                ...doctor,
                specialization: e.target.value,
              })
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Phone"
            value={doctor.phone}
            onChange={(e) =>
              setDoctor({
                ...doctor,
                phone: e.target.value,
              })
            }
          />

          <input
            type="email"
            className="form-control mb-2"
            placeholder="Email"
            value={doctor.email}
            onChange={(e) =>
              setDoctor({
                ...doctor,
                email: e.target.value,
              })
            }
          />

          <input
            type="number"
            min="0"
            className="form-control mb-3"
            placeholder="Experience (Years)"
            value={doctor.experience}
            onChange={(e) =>
              setDoctor({
                ...doctor,
                experience: e.target.value,
              })
            }
          />

          <div>
            <button
              className={`btn ${
                editingId === null
                  ? "btn-success"
                  : "btn-warning"
              }`}
              onClick={saveDoctor}
            >
              {editingId === null
                ? "Save Doctor"
                : "Update Doctor"}
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
                placeholder="Search by name, specialization, phone, email..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={specializationFilter}
                onChange={(e) =>
                  setSpecializationFilter(
                    e.target.value
                  )
                }
              >
                <option value="All">
                  All Specializations
                </option>

                {specializations.map(
                  (specialization) => (
                    <option
                      key={specialization}
                      value={specialization}
                    >
                      {specialization}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        {/* DOCTOR TABLE */}

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Experience</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center"
                  >
                    No Matching Doctors Found
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>

                    <td>{d.name}</td>

                    <td>{d.specialization}</td>

                    <td>{d.phone}</td>

                    <td>{d.email}</td>

                    <td>
                      {d.experience} Years
                    </td>

                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() =>
                          editDoctor(d)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          removeDoctor(d.id)
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

export default Doctors;