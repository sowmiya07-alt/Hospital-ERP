import { useEffect, useState, useCallback } from "react";
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
    consultationFee: "50",
    pharmacyFee: "0",
    roomFee: "0",
    labFee: "0",
    taxAmount: "0",
    discountAmount: "0",
    paidAmount: "0",
    paymentMode: "CASH",
    paymentStatus: "Pending",
  });

  const [editingId, setEditingId] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const loadBillings = useCallback(() => {
    getBillings()
      .then((response) => {
        setBillings(response.data || []);
      })
      .catch((error) => {
        console.log("Billing Load Error:", error);
      });
  }, []);

  const loadPatients = useCallback(() => {
    getPatients()
      .then((response) => {
        setPatients(response.data || []);
      })
      .catch((error) => {
        console.log("Patient Load Error:", error);
      });
  }, []);

  useEffect(() => {
    loadBillings();
    loadPatients();
  }, [loadBillings, loadPatients]);

  const resetForm = () => {
    setBilling({
      patientId: "",
      consultationFee: "50",
      pharmacyFee: "0",
      roomFee: "0",
      labFee: "0",
      taxAmount: "0",
      discountAmount: "0",
      paidAmount: "0",
      paymentMode: "CASH",
      paymentStatus: "Pending",
    });
    setEditingId(null);
  };

  const saveBilling = () => {
    if (!billing.patientId) {
      alert("Please select a patient.");
      return;
    }

    const consult = Number(billing.consultationFee || 0);
    const pharm = Number(billing.pharmacyFee || 0);
    const room = Number(billing.roomFee || 0);
    const lab = Number(billing.labFee || 0);
    const tax = Number(billing.taxAmount || 0);
    const discount = Number(billing.discountAmount || 0);
    const paid = Number(billing.paidAmount || 0);

    const total = consult + pharm + room + lab + tax - discount;

    const billingData = {
      patientId: Number(billing.patientId),
      consultationFee: consult,
      pharmacyFee: pharm,
      roomFee: room,
      labFee: lab,
      taxAmount: tax,
      discountAmount: discount,
      amount: total,
      paidAmount: paid,
      paymentMode: billing.paymentMode,
      paymentStatus: billing.paymentStatus,
    };

    if (editingId === null) {
      addBilling(billingData)
        .then(() => {
          alert("Invoice Generated Successfully");
          loadBillings();
          resetForm();
        })
        .catch((error) => {
          console.log("Save Billing Error:", error);
          alert(error.response?.data?.message || "Unable to Save Billing");
        });
    } else {
      updateBilling(editingId, billingData)
        .then(() => {
          alert("Invoice Updated Successfully");
          loadBillings();
          resetForm();
        })
        .catch((error) => {
          console.log("Update Billing Error:", error);
          alert(error.response?.data?.message || "Unable to Update Billing");
        });
    }
  };

  const editBilling = (b) => {
    setBilling({
      patientId: b.patient?.id || "",
      consultationFee: b.consultationFee ?? "50",
      pharmacyFee: b.pharmacyFee ?? "0",
      roomFee: b.roomFee ?? "0",
      labFee: b.labFee ?? "0",
      taxAmount: b.taxAmount ?? "0",
      discountAmount: b.discountAmount ?? "0",
      paidAmount: b.paidAmount ?? "0",
      paymentMode: b.paymentMode || "CASH",
      paymentStatus: b.paymentStatus || "Pending",
    });

    setEditingId(b.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const markAsPaid = (b) => {
    if (!window.confirm(`Mark invoice for ${b.patient?.name || "this patient"} as Fully Paid?`)) {
      return;
    }

    const billingData = {
      patientId: b.patient?.id,
      amount: b.totalAmount || b.amount,
      paidAmount: b.totalAmount || b.amount,
      paymentStatus: "Paid",
      paymentMode: b.paymentMode || "CASH",
    };

    updateBilling(b.id, billingData)
      .then(() => {
        alert("Invoice Marked as Fully Paid");
        loadBillings();
        if (editingId === b.id) resetForm();
      })
      .catch((error) => {
        console.log("Mark As Paid Error:", error);
        alert("Unable to Update Payment Status");
      });
  };

  const removeBilling = (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      deleteBilling(id)
        .then(() => {
          alert("Invoice Deleted Successfully");
          loadBillings();
          if (editingId === id) resetForm();
        })
        .catch((error) => {
          console.log("Delete Billing Error:", error);
          alert("Unable to Delete Invoice");
        });
    }
  };

  const filteredBillings = billings.filter((b) => {
    const text = search.toLowerCase();
    const patientName = (b.patient?.name || "").toLowerCase();
    const invNum = (b.invoiceNumber || "").toLowerCase();
    const status = (b.paymentStatus || "").toLowerCase();

    const matchesSearch = patientName.includes(text) || invNum.includes(text) || status.includes(text);
    const matchesStatus = statusFilter === "All" || b.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = billings.filter((b) => b.paymentStatus === "Pending" || b.paymentStatus === "Partial").length;
  const paidCount = billings.filter((b) => b.paymentStatus === "Paid").length;
  const totalCollected = billings.reduce((sum, b) => sum + Number(b.paidAmount || (b.paymentStatus === "Paid" ? b.amount : 0)), 0);

  const calcFormTotal = () => {
    const c = Number(billing.consultationFee || 0);
    const p = Number(billing.pharmacyFee || 0);
    const r = Number(billing.roomFee || 0);
    const l = Number(billing.labFee || 0);
    const t = Number(billing.taxAmount || 0);
    const d = Number(billing.discountAmount || 0);
    return Math.max(0, c + p + r + l + t - d);
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>💳 Itemized Hospital Billing</h2>
            <p className="text-muted mb-0">Generate itemized billing invoices, record payments, and print patient receipts</p>
          </div>
          <span className="badge bg-primary fs-6">Invoices: {billings.length}</span>
        </div>

        {/* SUMMARY CARDS */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card shadow border-start border-primary border-4 h-100 p-3">
              <h6 className="text-muted">Total Invoices Logged</h6>
              <h2>{billings.length}</h2>
            </div>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card shadow border-start border-warning border-4 h-100 p-3">
              <h6 className="text-muted">Pending / Partial Invoices</h6>
              <h2>{pendingCount}</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow border-start border-success border-4 h-100 p-3">
              <h6 className="text-muted">Total Revenue Collected</h6>
              <h2>${totalCollected.toFixed(2)}</h2>
              <small className="text-muted">{paidCount} fully paid invoice(s)</small>
            </div>
          </div>
        </div>

        {/* ITEMIZED BILLING FORM */}
        <div className="card shadow mb-4">
          <div className="card-header bg-dark text-white fw-bold">
            {editingId === null ? "➕ Generate New Itemized Invoice" : "✏️ Edit Invoice Record"}
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-bold">Select Patient *</label>
                <select
                  className="form-select"
                  value={billing.patientId}
                  onChange={(e) => setBilling({ ...billing, patientId: e.target.value })}
                >
                  <option value="">Choose Patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (#{p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Payment Mode</label>
                <select
                  className="form-select"
                  value={billing.paymentMode}
                  onChange={(e) => setBilling({ ...billing, paymentMode: e.target.value })}
                >
                  <option value="CASH">Cash</option>
                  <option value="CARD">Credit / Debit Card</option>
                  <option value="UPI">UPI / Digital</option>
                  <option value="INSURANCE">Health Insurance</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Payment Status</label>
                <select
                  className="form-select"
                  value={billing.paymentStatus}
                  onChange={(e) => setBilling({ ...billing, paymentStatus: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Partial">Partial</option>
                  <option value="Paid">Fully Paid</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="col-12"><hr className="my-2" /><h6>💲 Itemized Service Breakdown</h6></div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Doctor Consultation Fee ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={billing.consultationFee}
                  onChange={(e) => setBilling({ ...billing, consultationFee: e.target.value })}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Pharmacy & Medicines ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={billing.pharmacyFee}
                  onChange={(e) => setBilling({ ...billing, pharmacyFee: e.target.value })}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Room / Bed Charge ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={billing.roomFee}
                  onChange={(e) => setBilling({ ...billing, roomFee: e.target.value })}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Lab Tests & Radiology ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={billing.labFee}
                  onChange={(e) => setBilling({ ...billing, labFee: e.target.value })}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Tax / VAT ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={billing.taxAmount}
                  onChange={(e) => setBilling({ ...billing, taxAmount: e.target.value })}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Discount / Concession ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={billing.discountAmount}
                  onChange={(e) => setBilling({ ...billing, discountAmount: e.target.value })}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Amount Paid ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={billing.paidAmount}
                  onChange={(e) => setBilling({ ...billing, paidAmount: e.target.value })}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Calculated Invoice Total</label>
                <div className="form-control bg-light fw-bold text-success fs-5">
                  ${calcFormTotal().toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <button
                className={`btn ${editingId === null ? "btn-success" : "btn-warning"} me-2`}
                onClick={saveBilling}
              >
                {editingId === null ? "Save & Generate Invoice" : "Update Invoice"}
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
                placeholder="🔍 Search patient name, invoice number, or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Payment Statuses</option>
                <option value="Paid">Fully Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* BILLING TABLE */}
        <div className="card shadow">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0 align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Invoice #</th>
                    <th>Patient</th>
                    <th>Itemized Total</th>
                    <th>Paid / Balance</th>
                    <th>Mode</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBillings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center p-4">
                        No matching invoice records found.
                      </td>
                    </tr>
                  ) : (
                    filteredBillings.map((b) => (
                      <tr key={b.id}>
                        <td><strong>{b.invoiceNumber || `#${b.id}`}</strong></td>
                        <td>
                          <strong>{b.patient?.name || "N/A"}</strong>
                          <div className="text-muted small">ID: #{b.patient?.id}</div>
                        </td>
                        <td><strong>${Number(b.totalAmount || b.amount || 0).toFixed(2)}</strong></td>
                        <td>
                          <div className="text-success small">Paid: ${Number(b.paidAmount || (b.paymentStatus === "Paid" ? b.amount : 0)).toFixed(2)}</div>
                          {Number(b.balanceAmount || 0) > 0 && (
                            <div className="text-danger small fw-bold">Due: ${Number(b.balanceAmount).toFixed(2)}</div>
                          )}
                        </td>
                        <td><span className="badge bg-secondary">{b.paymentMode || "CASH"}</span></td>
                        <td>
                          {b.paymentStatus === "Paid" && <span className="badge bg-success">Paid</span>}
                          {b.paymentStatus === "Partial" && <span className="badge bg-info text-dark">Partial</span>}
                          {b.paymentStatus === "Pending" && <span className="badge bg-warning text-dark">Pending</span>}
                          {b.paymentStatus === "Cancelled" && <span className="badge bg-danger">Cancelled</span>}
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-dark btn-sm me-1"
                            onClick={() => setSelectedInvoice(b)}
                          >
                            🧾 Invoice Receipt
                          </button>
                          {b.paymentStatus !== "Paid" && (
                            <button
                              className="btn btn-success btn-sm me-1"
                              onClick={() => markAsPaid(b)}
                            >
                              ✓ Mark Paid
                            </button>
                          )}
                          <button
                            className="btn btn-primary btn-sm me-1"
                            onClick={() => editBilling(b)}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => removeBilling(b.id)}
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

        {/* PRINTABLE INVOICE MODAL */}
        {selectedInvoice && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content shadow-lg">
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title">🏥 Hospital ERP - Official Patient Invoice</h5>
                  <button className="btn-close btn-close-white" onClick={() => setSelectedInvoice(null)}></button>
                </div>
                <div className="modal-body p-4" id="printable-invoice">
                  <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <div>
                      <h3 className="fw-bold text-primary mb-1">GENERAL HOSPITAL ERP</h3>
                      <p className="text-muted mb-0">100 Healthcare Boulevard, Suite 400</p>
                      <p className="text-muted mb-0">Phone: +1-800-HOSPITAL | Email: billing@hospital.org</p>
                    </div>
                    <div className="text-end">
                      <h4 className="fw-bold text-dark">{selectedInvoice.invoiceNumber || `INV-${selectedInvoice.id}`}</h4>
                      <p className="mb-0"><strong>Date:</strong> {selectedInvoice.paymentDate || new Date().toISOString().split('T')[0]}</p>
                      <p className="mb-0"><strong>Status:</strong> {selectedInvoice.paymentStatus}</p>
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-6">
                      <h6 className="fw-bold">Billed To:</h6>
                      <p className="mb-1"><strong>{selectedInvoice.patient?.name}</strong></p>
                      <p className="mb-1">Patient ID: #{selectedInvoice.patient?.id}</p>
                      <p className="mb-0">Phone: {selectedInvoice.patient?.phone}</p>
                    </div>
                    <div className="col-6 text-end">
                      <h6 className="fw-bold">Payment Details:</h6>
                      <p className="mb-1">Payment Method: <strong>{selectedInvoice.paymentMode || "CASH"}</strong></p>
                    </div>
                  </div>

                  <table className="table table-bordered mb-4">
                    <thead className="table-light">
                      <tr>
                        <th>Description / Service Item</th>
                        <th className="text-end">Amount ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Doctor Consultation Fee</td>
                        <td className="text-end">${Number(selectedInvoice.consultationFee || 0).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Pharmacy & Prescribed Medicines</td>
                        <td className="text-end">${Number(selectedInvoice.pharmacyFee || 0).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Room / Bed Maintenance Charges</td>
                        <td className="text-end">${Number(selectedInvoice.roomFee || 0).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Laboratory Tests & Pathology</td>
                        <td className="text-end">${Number(selectedInvoice.labFee || 0).toFixed(2)}</td>
                      </tr>
                      {Number(selectedInvoice.taxAmount || 0) > 0 && (
                        <tr>
                          <td>Tax / VAT</td>
                          <td className="text-end">+${Number(selectedInvoice.taxAmount).toFixed(2)}</td>
                        </tr>
                      )}
                      {Number(selectedInvoice.discountAmount || 0) > 0 && (
                        <tr>
                          <td>Discount Concession</td>
                          <td className="text-end text-success">-${Number(selectedInvoice.discountAmount).toFixed(2)}</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="table-light fw-bold">
                      <tr>
                        <td>Total Bill Amount</td>
                        <td className="text-end fs-5 text-primary">
                          ${Number(selectedInvoice.totalAmount || selectedInvoice.amount || 0).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>Amount Paid</td>
                        <td className="text-end text-success">
                          ${Number(selectedInvoice.paidAmount || (selectedInvoice.paymentStatus === "Paid" ? selectedInvoice.amount : 0)).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>Balance Due</td>
                        <td className="text-end text-danger">
                          ${Number(selectedInvoice.balanceAmount || 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>

                  <div className="alert alert-light border text-center small text-muted">
                    Thank you for choosing General Hospital ERP. Please retain this invoice receipt for medical insurance claims.
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={() => window.print()}>
                    🖨️ Print Invoice Receipt
                  </button>
                  <button className="btn btn-secondary" onClick={() => setSelectedInvoice(null)}>
                    Close
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

export default Billing;