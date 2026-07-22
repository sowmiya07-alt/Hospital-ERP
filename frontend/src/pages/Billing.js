import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

import {
  getBillings,
  addBilling,
  updateBilling,
  deleteBilling,
} from "../services/billingService";

import { getPatients } from "../services/patientService";

function Billing() {
  const [billings, setBillings] = useState([]);
  const [patients, setPatients] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [billing, setBilling] = useState({
    patientId: "",
    amount: "",
    paymentStatus: "Pending",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadBillings();
    loadPatients();
  }, []);

  // ============================
  // LOAD BILLINGS
  // ============================

  const loadBillings = () => {
    getBillings()
      .then((response) => {
        setBillings(response.data || []);
      })
      .catch((error) => {
        console.log("Billing Load Error:", error);
      });
  };

  // ============================
  // LOAD PATIENTS
  // ============================

  const loadPatients = () => {
    getPatients()
      .then((response) => {
        setPatients(response.data || []);
      })
      .catch((error) => {
        console.log("Patient Load Error:", error);
      });
  };

  // ============================
  // RESET FORM
  // ============================

  const resetForm = () => {
    setBilling({
      patientId: "",
      amount: "",
      paymentStatus: "Pending",
    });

    setEditingId(null);
  };

  // ============================
  // SAVE / UPDATE BILL
  // ============================

  const saveBilling = () => {
    if (
      !billing.patientId ||
      billing.amount === "" ||
      !billing.paymentStatus
    ) {
      alert("Please fill all billing details");
      return;
    }

    if (Number(billing.amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    const billingData = {
      patientId: Number(billing.patientId),
      amount: Number(billing.amount),
      paymentStatus: billing.paymentStatus,
      paymentDate: null,
    };

    // CREATE
    if (editingId === null) {
      addBilling(billingData)
        .then(() => {
          alert("Billing Saved Successfully");

          loadBillings();
          resetForm();
        })
        .catch((error) => {
          console.log("Save Billing Error:", error);

          console.log(
            "Backend Response:",
            error.response?.data
          );

          alert("Unable to Save Billing");
        });
    } else {
      // UPDATE

      updateBilling(editingId, billingData)
        .then(() => {
          alert("Billing Updated Successfully");

          loadBillings();
          resetForm();
        })
        .catch((error) => {
          console.log("Update Billing Error:", error);

          console.log(
            "Backend Response:",
            error.response?.data
          );

          alert("Unable to Update Billing");
        });
    }
  };

  // ============================
  // EDIT BILL
  // ============================

  const editBilling = (b) => {
    setBilling({
      patientId: b.patient?.id || "",
      amount: b.amount ?? "",
      paymentStatus:
        b.paymentStatus || "Pending",
    });

    setEditingId(b.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================
  // MARK BILL AS PAID
  // ============================

  const markAsPaid = (b) => {
    const confirmed = window.confirm(
      `Mark bill #${b.id} for ${
        b.patient?.name || "this patient"
      } as Paid?`
    );

    if (!confirmed) {
      return;
    }

    const billingData = {
      patientId: b.patient?.id,
      amount: b.amount,
      paymentStatus: "Paid",
      paymentDate: null,
    };

    updateBilling(b.id, billingData)
      .then(() => {
        alert("Payment Marked as Paid");

        loadBillings();

        if (editingId === b.id) {
          resetForm();
        }
      })
      .catch((error) => {
        console.log(
          "Mark As Paid Error:",
          error
        );

        console.log(
          "Backend Response:",
          error.response?.data
        );

        alert("Unable to Update Payment Status");
      });
  };

  // ============================
  // DELETE BILL
  // ============================

  const removeBilling = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this bill?"
      )
    ) {
      deleteBilling(id)
        .then(() => {
          alert("Billing Deleted Successfully");

          loadBillings();

          if (editingId === id) {
            resetForm();
          }
        })
        .catch((error) => {
          console.log(
            "Delete Billing Error:",
            error
          );

          console.log(
            "Backend Response:",
            error.response?.data
          );

          alert("Unable to Delete Billing");
        });
    }
  };

  // ============================
  // SEARCH + FILTER
  // ============================

  const filteredBillings = billings.filter(
    (b) => {
      const searchText =
        search.toLowerCase();

      const patientName =
        b.patient?.name?.toLowerCase() || "";

      const amount =
        String(b.amount ?? "").toLowerCase();

      const status =
        b.paymentStatus?.toLowerCase() || "";

      const date =
        b.paymentDate?.toLowerCase() || "";

      const matchesSearch =
        patientName.includes(searchText) ||
        amount.includes(searchText) ||
        status.includes(searchText) ||
        date.includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        b.paymentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  // ============================
  // COUNTS
  // ============================

  const pendingCount = billings.filter(
    (b) => b.paymentStatus === "Pending"
  ).length;

  const paidCount = billings.filter(
    (b) => b.paymentStatus === "Paid"
  ).length;

  const totalPaidAmount = billings
    .filter(
      (b) => b.paymentStatus === "Paid"
    )
    .reduce(
      (total, b) =>
        total + Number(b.amount || 0),
      0
    );

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container p-4">
        <h2 className="mb-4">
          💳 Billing Management
        </h2>

        {/* SUMMARY CARDS */}

        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card shadow h-100">
              <div className="card-body">
                <h6>Total Bills</h6>

                <h2>
                  {billings.length}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow h-100">
              <div className="card-body">
                <h6>Pending Bills</h6>

                <h2>
                  {pendingCount}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow h-100">
              <div className="card-body">
                <h6>
                  Total Paid Amount
                </h6>

                <h2>
                  ₹
                  {totalPaidAmount.toFixed(
                    2
                  )}
                </h2>

                <small className="text-muted">
                  {paidCount} paid bill(s)
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* BILLING FORM */}

        <div className="card shadow p-4 mb-4">
          <h4 className="mb-3">
            {editingId === null
              ? "Create New Bill"
              : "Edit Bill"}
          </h4>

          <label className="form-label">
            Patient
          </label>

          <select
            className="form-select mb-3"
            value={billing.patientId}
            onChange={(e) =>
              setBilling({
                ...billing,
                patientId:
                  e.target.value,
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
            Amount
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            className="form-control mb-3"
            placeholder="Enter Amount"
            value={billing.amount}
            onChange={(e) =>
              setBilling({
                ...billing,
                amount:
                  e.target.value,
              })
            }
          />

          <label className="form-label">
            Payment Status
          </label>

          <select
            className="form-select mb-3"
            value={
              billing.paymentStatus
            }
            onChange={(e) =>
              setBilling({
                ...billing,
                paymentStatus:
                  e.target.value,
              })
            }
          >
            <option value="Pending">
              Pending
            </option>

            <option value="Paid">
              Paid
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>

          <div className="alert alert-info py-2">
            Payment date is automatically
            recorded when the bill is marked
            as <strong>Paid</strong>.
          </div>

          <div>
            <button
              className={`btn ${
                editingId === null
                  ? "btn-success"
                  : "btn-warning"
              }`}
              onClick={saveBilling}
            >
              {editingId === null
                ? "Save Billing"
                : "Update Billing"}
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
                placeholder="Search patient, amount, status or date..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >
                <option value="All">
                  All Payment Status
                </option>

                <option value="Paid">
                  Paid
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* BILLING TABLE */}

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Amount</th>
                <th>
                  Payment Status
                </th>
                <th>
                  Payment Date
                </th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBillings.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center"
                  >
                    No Matching Billing
                    Records Found
                  </td>
                </tr>
              ) : (
                filteredBillings.map(
                  (b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>

                      <td>
                        {b.patient
                          ?.name ||
                          "N/A"}
                      </td>

                      <td>
                        ₹
                        {Number(
                          b.amount
                        ).toFixed(2)}
                      </td>

                      <td>
                        {b.paymentStatus ===
                          "Paid" && (
                          <span className="badge bg-success">
                            Paid
                          </span>
                        )}

                        {b.paymentStatus ===
                          "Pending" && (
                          <span className="badge bg-warning text-dark">
                            Pending
                          </span>
                        )}

                        {b.paymentStatus ===
                          "Cancelled" && (
                          <span className="badge bg-danger">
                            Cancelled
                          </span>
                        )}
                      </td>

                      <td>
                        {b.paymentDate ||
                          "Not Paid Yet"}
                      </td>

                      <td>
                        {b.paymentStatus ===
                          "Pending" && (
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() =>
                              markAsPaid(
                                b
                              )
                            }
                          >
                            ✓ Mark as Paid
                          </button>
                        )}

                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() =>
                            editBilling(b)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            removeBilling(
                              b.id
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
      </div>
    </div>
  );
}

export default Billing;