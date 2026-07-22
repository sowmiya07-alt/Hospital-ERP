import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

import {
  getPrescriptions,
  addPrescription,
  updatePrescription,
  deletePrescription,
} from "../services/prescriptionService";

import { getPatients } from "../services/patientService";
import { getMedicines } from "../services/medicineService";

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);

  // SEARCH AND FILTER
  const [search, setSearch] = useState("");
  const [medicineFilter, setMedicineFilter] = useState("All");

  const [prescription, setPrescription] = useState({
    patientId: "",
    medicineId: "",
    dosage: "",
    frequency: "",
    duration: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadPrescriptions();
    loadPatients();
    loadMedicines();
  }, []);

  // LOAD PRESCRIPTIONS
  const loadPrescriptions = () => {
    getPrescriptions()
      .then((response) => {
        setPrescriptions(response.data);
      })
      .catch((error) => {
        console.log("Prescription Load Error:", error);
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

  // LOAD MEDICINES
  const loadMedicines = () => {
    getMedicines()
      .then((response) => {
        setMedicines(response.data);
      })
      .catch((error) => {
        console.log("Medicine Load Error:", error);
      });
  };

  // RESET FORM
  const resetForm = () => {
    setPrescription({
      patientId: "",
      medicineId: "",
      dosage: "",
      frequency: "",
      duration: "",
    });

    setEditingId(null);
  };

  // SAVE / UPDATE
  const savePrescription = () => {
    if (
      !prescription.patientId ||
      !prescription.medicineId ||
      !prescription.dosage ||
      !prescription.frequency ||
      !prescription.duration
    ) {
      alert("Please fill all prescription details");
      return;
    }

    if (Number(prescription.duration) <= 0) {
      alert("Duration must be greater than 0");
      return;
    }

    const prescriptionData = {
      patientId: Number(prescription.patientId),
      medicineId: Number(prescription.medicineId),
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: Number(prescription.duration),
    };

    if (editingId === null) {
      addPrescription(prescriptionData)
        .then(() => {
          alert("Prescription Saved Successfully");

          loadPrescriptions();
          resetForm();
        })
        .catch((error) => {
          console.log("Save Prescription Error:", error);
          console.log(
            "Backend Response:",
            error.response?.data
          );

          alert("Unable to Save Prescription");
        });
    } else {
      updatePrescription(editingId, prescriptionData)
        .then(() => {
          alert("Prescription Updated Successfully");

          loadPrescriptions();
          resetForm();
        })
        .catch((error) => {
          console.log("Update Prescription Error:", error);
          console.log(
            "Backend Response:",
            error.response?.data
          );

          alert("Unable to Update Prescription");
        });
    }
  };

  // EDIT
  const editPrescription = (p) => {
    setPrescription({
      patientId: p.patient?.id || "",
      medicineId: p.medicine?.id || "",
      dosage: p.dosage || "",
      frequency: p.frequency || "",
      duration: p.duration ?? "",
    });

    setEditingId(p.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE
  const removePrescription = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this prescription?"
      )
    ) {
      deletePrescription(id)
        .then(() => {
          alert("Prescription Deleted Successfully");

          loadPrescriptions();

          if (editingId === id) {
            resetForm();
          }
        })
        .catch((error) => {
          console.log(
            "Delete Prescription Error:",
            error
          );

          alert("Unable to Delete Prescription");
        });
    }
  };

  // SEARCH + MEDICINE FILTER
  const filteredPrescriptions = prescriptions.filter((p) => {
    const searchText = search.toLowerCase();

    const patientName =
      p.patient?.name?.toLowerCase() || "";

    const medicineName =
      p.medicine?.medicineName?.toLowerCase() || "";

    const dosage =
      p.dosage?.toLowerCase() || "";

    const frequency =
      p.frequency?.toLowerCase() || "";

    const duration =
      String(p.duration || "");

    const matchesSearch =
      patientName.includes(searchText) ||
      medicineName.includes(searchText) ||
      dosage.includes(searchText) ||
      frequency.includes(searchText) ||
      duration.includes(searchText);

    const matchesMedicine =
      medicineFilter === "All" ||
      String(p.medicine?.id) === medicineFilter;

    return matchesSearch && matchesMedicine;
  });

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container p-4">

        <h2 className="mb-4">
          Prescription Management
        </h2>

        {/* FORM */}

        <div className="card shadow p-4 mb-4">

          <label className="form-label">
            Patient
          </label>

          <select
            className="form-select mb-3"
            value={prescription.patientId}
            onChange={(e) =>
              setPrescription({
                ...prescription,
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
            Medicine
          </label>

          <select
            className="form-select mb-3"
            value={prescription.medicineId}
            onChange={(e) =>
              setPrescription({
                ...prescription,
                medicineId: e.target.value,
              })
            }
          >
            <option value="">
              Select Medicine
            </option>

            {medicines.map((medicine) => (
              <option
                key={medicine.id}
                value={medicine.id}
              >
                {medicine.medicineName}
              </option>
            ))}
          </select>

          <label className="form-label">
            Dosage
          </label>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Example: 500mg"
            value={prescription.dosage}
            onChange={(e) =>
              setPrescription({
                ...prescription,
                dosage: e.target.value,
              })
            }
          />

          <label className="form-label">
            Frequency
          </label>

          <select
            className="form-select mb-3"
            value={prescription.frequency}
            onChange={(e) =>
              setPrescription({
                ...prescription,
                frequency: e.target.value,
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
            value={prescription.duration}
            onChange={(e) =>
              setPrescription({
                ...prescription,
                duration: e.target.value,
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
              onClick={savePrescription}
            >
              {editingId === null
                ? "Save Prescription"
                : "Update Prescription"}
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
                placeholder="Search patient, medicine, dosage or frequency..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="col-md-4">

              <select
                className="form-select"
                value={medicineFilter}
                onChange={(e) =>
                  setMedicineFilter(e.target.value)
                }
              >

                <option value="All">
                  All Medicines
                </option>

                {medicines.map((medicine) => (

                  <option
                    key={medicine.id}
                    value={String(medicine.id)}
                  >
                    {medicine.medicineName}
                  </option>

                ))}

              </select>

            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead className="table-dark">

              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Medicine</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredPrescriptions.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center"
                  >
                    No Matching Prescriptions Found
                  </td>

                </tr>

              ) : (

                filteredPrescriptions.map((p) => (

                  <tr key={p.id}>

                    <td>{p.id}</td>

                    <td>
                      {p.patient?.name || "N/A"}
                    </td>

                    <td>
                      {p.medicine?.medicineName ||
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

                    <td>

                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() =>
                          editPrescription(p)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          removePrescription(p.id)
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

export default Prescriptions;