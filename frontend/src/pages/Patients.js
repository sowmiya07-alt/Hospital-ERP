import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

import {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
} from "../services/patientService";

function Patients() {

  const [patients, setPatients] = useState([]);

  // SEARCH
  const [search, setSearch] = useState("");

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

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

  // RESET FORM
  const resetForm = () => {

    setPatient({
      name: "",
      age: "",
      gender: "",
      phone: "",
      address: "",
    });

    setEditingId(null);

  };

  // SAVE / UPDATE PATIENT
  const savePatient = () => {

    if (
      !patient.name ||
      !patient.age ||
      !patient.gender ||
      !patient.phone ||
      !patient.address
    ) {
      alert("Please fill all patient details");
      return;
    }

    const patientData = {
      ...patient,
      age: Number(patient.age),
    };

    // CREATE
    if (editingId === null) {

      addPatient(patientData)
        .then(() => {

          alert("Patient Saved Successfully");

          loadPatients();

          resetForm();

        })
        .catch((error) => {

          console.log("Save Patient Error:", error);

          alert("Unable to Save Patient");

        });

    }

    // UPDATE
    else {

      updatePatient(editingId, patientData)
        .then(() => {

          alert("Patient Updated Successfully");

          loadPatients();

          resetForm();

        })
        .catch((error) => {

          console.log("Update Patient Error:", error);

          alert("Unable to Update Patient");

        });

    }

  };

  // EDIT PATIENT
  const editPatient = (p) => {

    setPatient({
      name: p.name || "",
      age: p.age ?? "",
      gender: p.gender || "",
      phone: p.phone || "",
      address: p.address || "",
    });

    setEditingId(p.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };

  // DELETE PATIENT
  const removePatient = (id) => {

    if (
      window.confirm(
        "Are you sure you want to delete this patient?"
      )
    ) {

      deletePatient(id)
        .then(() => {

          alert("Patient Deleted Successfully");

          loadPatients();

          if (editingId === id) {
            resetForm();
          }

        })
        .catch((error) => {

          console.log("Delete Patient Error:", error);

          alert("Unable to Delete Patient");

        });

    }

  };

  // SEARCH FILTER
  const filteredPatients = patients.filter((p) => {

    const searchText = search.toLowerCase();

    return (
      (p.name || "")
        .toLowerCase()
        .includes(searchText) ||

      String(p.age || "")
        .includes(searchText) ||

      (p.gender || "")
        .toLowerCase()
        .includes(searchText) ||

      (p.phone || "")
        .toLowerCase()
        .includes(searchText) ||

      (p.address || "")
        .toLowerCase()
        .includes(searchText)
    );

  });

  return (

    <div className="d-flex">

      <Sidebar />

      <div className="container p-4">

        <h2 className="mb-4">
          Patient Management
        </h2>

        {/* PATIENT FORM */}

        <div className="card shadow p-4 mb-4">

          <input
            className="form-control mb-2"
            placeholder="Name"
            value={patient.name}
            onChange={(e) =>
              setPatient({
                ...patient,
                name: e.target.value,
              })
            }
          />

          <input
            type="number"
            className="form-control mb-2"
            placeholder="Age"
            value={patient.age}
            onChange={(e) =>
              setPatient({
                ...patient,
                age: e.target.value,
              })
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Gender"
            value={patient.gender}
            onChange={(e) =>
              setPatient({
                ...patient,
                gender: e.target.value,
              })
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Phone"
            value={patient.phone}
            onChange={(e) =>
              setPatient({
                ...patient,
                phone: e.target.value,
              })
            }
          />

          <input
            className="form-control mb-3"
            placeholder="Address"
            value={patient.address}
            onChange={(e) =>
              setPatient({
                ...patient,
                address: e.target.value,
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
              onClick={savePatient}
            >

              {editingId === null
                ? "Save Patient"
                : "Update Patient"}

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

        {/* SEARCH */}

        <div className="card shadow p-3 mb-3">

          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by name, age, gender, phone or address..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* PATIENT TABLE */}

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead className="table-dark">

              <tr>

                <th>ID</th>

                <th>Name</th>

                <th>Age</th>

                <th>Gender</th>

                <th>Phone</th>

                <th>Address</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {filteredPatients.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center"
                  >

                    {search
                      ? "No Matching Patients Found"
                      : "No Patients Found"}

                  </td>

                </tr>

              ) : (

                filteredPatients.map((p) => (

                  <tr key={p.id}>

                    <td>{p.id}</td>

                    <td>{p.name}</td>

                    <td>{p.age}</td>

                    <td>{p.gender}</td>

                    <td>{p.phone}</td>

                    <td>{p.address}</td>

                    <td>

                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() =>
                          editPatient(p)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          removePatient(p.id)
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

export default Patients;