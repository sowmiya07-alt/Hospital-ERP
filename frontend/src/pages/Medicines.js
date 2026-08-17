import { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";

import {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  dispenseMedicine,
} from "../services/medicineService";

function Medicines() {
  const [medicines, setMedicines] = useState([]);

  // SEARCH AND FILTER
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");

  const [medicine, setMedicine] = useState({
    medicineName: "",
    genericName: "",
    dosage: "",
    category: "Tablet",
    manufacturer: "",
    stock: "",
    unitPrice: "5.00",
    batchNumber: "",
    expiryDate: "",
    reorderLevel: "15",
  });

  const [editingId, setEditingId] = useState(null);
  const [dispenseMed, setDispenseMed] = useState(null);
  const [dispenseQty, setDispenseQty] = useState("1");

  const loadMedicines = useCallback(() => {
    getMedicines()
      .then((response) => {
        setMedicines(response.data || []);
      })
      .catch((error) => {
        console.log("Load Medicine Error:", error);
      });
  }, []);

  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]);

  const resetForm = () => {
    setMedicine({
      medicineName: "",
      genericName: "",
      dosage: "",
      category: "Tablet",
      manufacturer: "",
      stock: "",
      unitPrice: "5.00",
      batchNumber: "",
      expiryDate: "",
      reorderLevel: "15",
    });
    setEditingId(null);
  };

  const saveMedicine = () => {
    if (!medicine.medicineName || !medicine.dosage || medicine.stock === "") {
      alert("Please enter medicine name, dosage, and current stock quantity.");
      return;
    }

    if (Number(medicine.stock) < 0) {
      alert("Stock cannot be negative.");
      return;
    }

    const medicineData = {
      ...medicine,
      stock: Number(medicine.stock),
      unitPrice: medicine.unitPrice ? Number(medicine.unitPrice) : 5.0,
      reorderLevel: medicine.reorderLevel ? Number(medicine.reorderLevel) : 15,
    };

    if (editingId === null) {
      addMedicine(medicineData)
        .then(() => {
          alert("Medicine Added to Inventory");
          loadMedicines();
          resetForm();
        })
        .catch((error) => {
          console.log("Save Medicine Error:", error);
          alert("Unable to Save Medicine");
        });
    } else {
      updateMedicine(editingId, medicineData)
        .then(() => {
          alert("Medicine Inventory Updated");
          loadMedicines();
          resetForm();
        })
        .catch((error) => {
          console.log("Update Medicine Error:", error);
          alert("Unable to Update Medicine");
        });
    }
  };

  const handleDispense = () => {
    if (!dispenseMed || !dispenseQty || Number(dispenseQty) <= 0) {
      alert("Please enter a valid quantity to dispense.");
      return;
    }

    dispenseMedicine(dispenseMed.id, Number(dispenseQty))
      .then(() => {
        alert(`Successfully dispensed ${dispenseQty} unit(s) of ${dispenseMed.medicineName}`);
        setDispenseMed(null);
        setDispenseQty("1");
        loadMedicines();
      })
      .catch((error) => {
        console.log("Dispense error:", error);
        alert(error.response?.data?.message || "Unable to dispense medicine. Check stock availability.");
      });
  };

  const editMedicine = (m) => {
    setMedicine({
      medicineName: m.medicineName || "",
      genericName: m.genericName || "",
      dosage: m.dosage || "",
      category: m.category || "Tablet",
      manufacturer: m.manufacturer || "",
      stock: m.stock ?? "",
      unitPrice: m.unitPrice ?? "5.00",
      batchNumber: m.batchNumber || "",
      expiryDate: m.expiryDate || "",
      reorderLevel: m.reorderLevel ?? "15",
    });

    setEditingId(m.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeMedicine = (id) => {
    if (window.confirm("Are you sure you want to delete this medicine record?")) {
      deleteMedicine(id)
        .then(() => {
          alert("Medicine Deleted Successfully");
          loadMedicines();
          if (editingId === id) resetForm();
        })
        .catch((error) => {
          console.log("Delete Medicine Error:", error);
          alert("Unable to Delete Medicine");
        });
    }
  };

  const getStockStatus = (m) => {
    const stock = Number(m.stock || 0);
    const reorder = Number(m.reorderLevel || 15);

    if (stock === 0) return "Out of Stock";
    if (stock <= reorder) return "Low Stock";
    return "In Stock";
  };

  const lowStockCount = medicines.filter((m) => getStockStatus(m) !== "In Stock").length;

  const filteredMedicines = medicines.filter((m) => {
    const text = search.toLowerCase();
    const matchesSearch =
      (m.medicineName || "").toLowerCase().includes(text) ||
      (m.genericName || "").toLowerCase().includes(text) ||
      (m.dosage || "").toLowerCase().includes(text) ||
      (m.category || "").toLowerCase().includes(text) ||
      (m.manufacturer || "").toLowerCase().includes(text);

    const status = getStockStatus(m);
    const matchesStock = stockFilter === "All" || status === stockFilter;

    return matchesSearch && matchesStock;
  });

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>💊 Pharmacy Inventory & Dispensing</h2>
            <p className="text-muted mb-0">Manage pharmaceutical stock, unit prices, batch numbers, and dispense medications</p>
          </div>
          <div>
            <span className="badge bg-primary fs-6 me-2">Total Items: {medicines.length}</span>
            {lowStockCount > 0 && (
              <span className="badge bg-warning text-dark fs-6">⚠️ {lowStockCount} Low Stock Alert(s)</span>
            )}
          </div>
        </div>

        {/* MEDICINE FORM */}
        <div className="card shadow mb-4">
          <div className="card-header bg-dark text-white fw-bold">
            {editingId === null ? "➕ Add New Medicine to Inventory" : "✏️ Update Medicine Record"}
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-bold">Medicine Brand Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Amoxil"
                  value={medicine.medicineName}
                  onChange={(e) => setMedicine({ ...medicine, medicineName: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Generic Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Amoxicillin"
                  value={medicine.genericName}
                  onChange={(e) => setMedicine({ ...medicine, genericName: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Category</label>
                <select
                  className="form-select"
                  value={medicine.category}
                  onChange={(e) => setMedicine({ ...medicine, category: e.target.value })}
                >
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup / Liquid</option>
                  <option value="Injection">Injection</option>
                  <option value="Ointment">Ointment / Cream</option>
                  <option value="Drops">Drops</option>
                  <option value="Inhaler">Inhaler</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Dosage *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 500mg"
                  value={medicine.dosage}
                  onChange={(e) => setMedicine({ ...medicine, dosage: e.target.value })}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Manufacturer</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Pfizer"
                  value={medicine.manufacturer}
                  onChange={(e) => setMedicine({ ...medicine, manufacturer: e.target.value })}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="e.g. 100"
                  value={medicine.stock}
                  onChange={(e) => setMedicine({ ...medicine, stock: e.target.value })}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Unit Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  placeholder="5.00"
                  value={medicine.unitPrice}
                  onChange={(e) => setMedicine({ ...medicine, unitPrice: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Batch Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. BATCH-2026-X"
                  value={medicine.batchNumber}
                  onChange={(e) => setMedicine({ ...medicine, batchNumber: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Expiry Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={medicine.expiryDate}
                  onChange={(e) => setMedicine({ ...medicine, expiryDate: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Reorder Threshold</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="15"
                  value={medicine.reorderLevel}
                  onChange={(e) => setMedicine({ ...medicine, reorderLevel: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-3">
              <button
                className={`btn ${editingId === null ? "btn-success" : "btn-warning"} me-2`}
                onClick={saveMedicine}
              >
                {editingId === null ? "Save Medicine" : "Update Medicine"}
              </button>

              {editingId !== null && (
                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SEARCH & STOCK FILTER */}
        <div className="card shadow p-3 mb-4">
          <div className="row g-2">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search by brand name, generic name, dosage, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="All">All Stock Levels</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* MEDICINE TABLE */}
        <div className="card shadow">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0 align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Medicine Details</th>
                    <th>Category</th>
                    <th>Batch & Expiry</th>
                    <th>Unit Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMedicines.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center p-4">
                        No matching medicines found in inventory.
                      </td>
                    </tr>
                  ) : (
                    filteredMedicines.map((m) => {
                      const stockStatus = getStockStatus(m);
                      return (
                        <tr key={m.id}>
                          <td><strong>#{m.id}</strong></td>
                          <td>
                            <strong>{m.medicineName}</strong> ({m.dosage})
                            {m.genericName && <div className="text-muted small">Generic: {m.genericName}</div>}
                            <div className="text-muted small">Mfr: {m.manufacturer || "N/A"}</div>
                          </td>
                          <td><span className="badge bg-secondary">{m.category || "Tablet"}</span></td>
                          <td>
                            <div><small>Batch: {m.batchNumber || "N/A"}</small></div>
                            <div><small className="text-muted">Exp: {m.expiryDate || "N/A"}</small></div>
                          </td>
                          <td><strong>${Number(m.unitPrice || 5).toFixed(2)}</strong></td>
                          <td><span className="fs-6 fw-bold">{m.stock}</span></td>
                          <td>
                            {stockStatus === "In Stock" && (
                              <span className="badge bg-success">In Stock</span>
                            )}
                            {stockStatus === "Low Stock" && (
                              <span className="badge bg-warning text-dark">Low Stock</span>
                            )}
                            {stockStatus === "Out of Stock" && (
                              <span className="badge bg-danger">Out of Stock</span>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-success btn-sm me-1"
                              disabled={m.stock === 0}
                              onClick={() => setDispenseMed(m)}
                            >
                              📦 Dispense
                            </button>
                            <button
                              className="btn btn-primary btn-sm me-1"
                              onClick={() => editMedicine(m)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => removeMedicine(m.id)}
                            >
                              🗑️
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

        {/* DISPENSE MODAL */}
        {dispenseMed && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content shadow-lg">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">📦 Dispense Medicine - {dispenseMed.medicineName}</h5>
                  <button className="btn-close btn-close-white" onClick={() => setDispenseMed(null)}></button>
                </div>
                <div className="modal-body">
                  <p><strong>Available Stock:</strong> {dispenseMed.stock} units</p>
                  <p><strong>Unit Price:</strong> ${Number(dispenseMed.unitPrice || 5).toFixed(2)}</p>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Quantity to Dispense *</label>
                    <input
                      type="number"
                      min="1"
                      max={dispenseMed.stock}
                      className="form-control"
                      value={dispenseQty}
                      onChange={(e) => setDispenseQty(e.target.value)}
                    />
                  </div>
                  <div className="alert alert-info py-2">
                    Total Charge: <strong>${(Number(dispenseQty || 0) * Number(dispenseMed.unitPrice || 5)).toFixed(2)}</strong>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-success" onClick={handleDispense}>
                    Confirm Dispense & Deduct Stock
                  </button>
                  <button className="btn btn-secondary" onClick={() => setDispenseMed(null)}>
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

export default Medicines;