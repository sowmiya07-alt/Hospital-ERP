import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

import {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} from "../services/medicineService";

function Medicines() {
  const [medicines, setMedicines] = useState([]);

  // SEARCH AND FILTER
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");

  const [medicine, setMedicine] = useState({
    medicineName: "",
    dosage: "",
    manufacturer: "",
    stock: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadMedicines();
  }, []);

  // LOAD MEDICINES
  const loadMedicines = () => {
    getMedicines()
      .then((response) => {
        setMedicines(response.data);
      })
      .catch((error) => {
        console.log("Load Medicine Error:", error);
      });
  };

  // RESET FORM
  const resetForm = () => {
    setMedicine({
      medicineName: "",
      dosage: "",
      manufacturer: "",
      stock: "",
    });

    setEditingId(null);
  };

  // SAVE / UPDATE
  const saveMedicine = () => {
    if (
      !medicine.medicineName ||
      !medicine.dosage ||
      !medicine.manufacturer ||
      medicine.stock === ""
    ) {
      alert("Please fill all medicine details");
      return;
    }

    if (Number(medicine.stock) < 0) {
      alert("Stock cannot be negative");
      return;
    }

    const medicineData = {
      medicineName: medicine.medicineName,
      dosage: medicine.dosage,
      manufacturer: medicine.manufacturer,
      stock: Number(medicine.stock),
    };

    if (editingId === null) {
      addMedicine(medicineData)
        .then(() => {
          alert("Medicine Saved Successfully");

          loadMedicines();
          resetForm();
        })
        .catch((error) => {
          console.log("Save Medicine Error:", error);
          console.log(
            "Backend Response:",
            error.response?.data
          );

          alert("Unable to Save Medicine");
        });
    } else {
      updateMedicine(editingId, medicineData)
        .then(() => {
          alert("Medicine Updated Successfully");

          loadMedicines();
          resetForm();
        })
        .catch((error) => {
          console.log("Update Medicine Error:", error);

          alert("Unable to Update Medicine");
        });
    }
  };

  // EDIT
  const editMedicine = (m) => {
    setMedicine({
      medicineName: m.medicineName || "",
      dosage: m.dosage || "",
      manufacturer: m.manufacturer || "",
      stock: m.stock ?? "",
    });

    setEditingId(m.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE
  const removeMedicine = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this medicine?"
      )
    ) {
      deleteMedicine(id)
        .then(() => {
          alert("Medicine Deleted Successfully");

          loadMedicines();

          if (editingId === id) {
            resetForm();
          }
        })
        .catch((error) => {
          console.log("Delete Medicine Error:", error);

          alert("Unable to Delete Medicine");
        });
    }
  };

  // GET STOCK STATUS
  const getStockStatus = (stock) => {
    const value = Number(stock);

    if (value === 0) {
      return "Out of Stock";
    }

    if (value <= 10) {
      return "Low Stock";
    }

    return "In Stock";
  };

  // SEARCH + FILTER
  const filteredMedicines = medicines.filter((m) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (m.medicineName || "")
        .toLowerCase()
        .includes(searchText) ||
      (m.dosage || "")
        .toLowerCase()
        .includes(searchText) ||
      (m.manufacturer || "")
        .toLowerCase()
        .includes(searchText);

    const stockStatus = getStockStatus(m.stock);

    const matchesStock =
      stockFilter === "All" ||
      stockStatus === stockFilter;

    return matchesSearch && matchesStock;
  });

  return (
    <div className="d-flex">

      <Sidebar />

      <div className="container p-4">

        <h2 className="mb-4">
          Medicine Management
        </h2>

        {/* MEDICINE FORM */}

        <div className="card shadow p-4 mb-4">

          <label className="form-label">
            Medicine Name
          </label>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter Medicine Name"
            value={medicine.medicineName}
            onChange={(e) =>
              setMedicine({
                ...medicine,
                medicineName: e.target.value,
              })
            }
          />

          <label className="form-label">
            Dosage
          </label>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Example: 500mg"
            value={medicine.dosage}
            onChange={(e) =>
              setMedicine({
                ...medicine,
                dosage: e.target.value,
              })
            }
          />

          <label className="form-label">
            Manufacturer
          </label>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter Manufacturer"
            value={medicine.manufacturer}
            onChange={(e) =>
              setMedicine({
                ...medicine,
                manufacturer: e.target.value,
              })
            }
          />

          <label className="form-label">
            Stock
          </label>

          <input
            type="number"
            min="0"
            className="form-control mb-3"
            placeholder="Enter Stock"
            value={medicine.stock}
            onChange={(e) =>
              setMedicine({
                ...medicine,
                stock: e.target.value,
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
              onClick={saveMedicine}
            >
              {editingId === null
                ? "Save Medicine"
                : "Update Medicine"}
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

        {/* SEARCH + STOCK FILTER */}

        <div className="card shadow p-3 mb-3">

          <div className="row">

            <div className="col-md-8 mb-2 mb-md-0">

              <input
                type="text"
                className="form-control"
                placeholder="Search medicine, dosage or manufacturer..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="col-md-4">

              <select
                className="form-select"
                value={stockFilter}
                onChange={(e) =>
                  setStockFilter(e.target.value)
                }
              >

                <option value="All">
                  All Stock
                </option>

                <option value="In Stock">
                  In Stock
                </option>

                <option value="Low Stock">
                  Low Stock
                </option>

                <option value="Out of Stock">
                  Out of Stock
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* MEDICINE TABLE */}

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead className="table-dark">

              <tr>
                <th>ID</th>
                <th>Medicine Name</th>
                <th>Dosage</th>
                <th>Manufacturer</th>
                <th>Stock</th>
                <th>Stock Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredMedicines.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center"
                  >
                    No Matching Medicines Found
                  </td>

                </tr>

              ) : (

                filteredMedicines.map((m) => {

                  const stockStatus =
                    getStockStatus(m.stock);

                  return (

                    <tr key={m.id}>

                      <td>{m.id}</td>

                      <td>
                        {m.medicineName}
                      </td>

                      <td>
                        {m.dosage}
                      </td>

                      <td>
                        {m.manufacturer}
                      </td>

                      <td>
                        {m.stock}
                      </td>

                      <td>

                        {stockStatus === "In Stock" && (
                          <span className="badge bg-success">
                            In Stock
                          </span>
                        )}

                        {stockStatus === "Low Stock" && (
                          <span className="badge bg-warning text-dark">
                            Low Stock
                          </span>
                        )}

                        {stockStatus ===
                          "Out of Stock" && (
                          <span className="badge bg-danger">
                            Out of Stock
                          </span>
                        )}

                      </td>

                      <td>

                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() =>
                            editMedicine(m)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            removeMedicine(m.id)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  );

                })

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Medicines;