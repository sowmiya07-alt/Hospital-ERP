import { useState, useEffect } from "react";
import { globalSearch } from "../services/searchService";
import { getRoleNotifications } from "../services/notificationService";

function NavbarHeader({ title, portalRole }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotifModal, setShowNotifModal] = useState(false);

  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("role") || portalRole || "ADMIN";

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const loadNotifications = async () => {
    try {
      const res = await getRoleNotifications(role);
      setNotifications(res.data || []);
    } catch (err) {
      console.log("Notification load error:", err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setShowSearchModal(true);
    try {
      const res = await globalSearch(searchQuery.trim());
      setSearchResults(res.data);
    } catch (err) {
      console.log("Search error:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <>
      <div
        className="d-flex justify-content-between align-items-center bg-white px-4 py-3 border-bottom shadow-sm mb-4"
        style={{ borderRadius: "12px" }}
      >
        <div>
          <h4 className="fw-bold mb-0 text-dark">{title || "Hospital ERP"}</h4>
          <small className="text-muted" style={{ fontSize: "12px" }}>
            🔒 {role} Portal • Enterprise Gateway
          </small>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* SEARCH INPUT */}
          <form onSubmit={handleSearch} style={{ minWidth: "260px" }}>
            <div className="input-group input-group-sm">
              <input
                type="text"
                className="form-control border-end-0"
                placeholder="Search Patient, Doctor, Invoice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderRadius: "8px 0 0 8px" }}
              />
              <button
                className="btn btn-outline-secondary border-start-0"
                type="submit"
                style={{ borderRadius: "0 8px 8px 0" }}
              >
                🔍
              </button>
            </div>
          </form>

          {/* NOTIFICATION BELL */}
          <div className="position-relative">
            <button
              className="btn btn-light btn-sm rounded-circle position-relative border"
              style={{ width: "38px", height: "38px" }}
              onClick={() => setShowNotifModal(true)}
            >
              🔔
              {notifications.length > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "10px" }}
                >
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* USER INFO */}
          <div className="d-flex align-items-center gap-2 border-start ps-3">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "36px", height: "36px", fontSize: "14px" }}
            >
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="fw-bold small text-dark">{username}</div>
              <div className="text-secondary" style={{ fontSize: "11px" }}>
                {role}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GLOBAL SEARCH RESULTS MODAL */}
      {showSearchModal && (
        <div
          className="modal show d-block tab-index='-1'"
          style={{ background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(4px)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "16px" }}>
              <div className="modal-header bg-primary text-white p-3" style={{ borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}>
                <h5 className="modal-title fw-bold mb-0">🔍 Universal ERP Search Results</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowSearchModal(false)} />
              </div>
              <div className="modal-body p-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {searchLoading ? (
                  <div className="text-center py-4">
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Searching hospital database...
                  </div>
                ) : searchResults ? (
                  <div>
                    {/* PATIENTS */}
                    <h6 className="fw-bold text-primary mb-2">👤 Patients ({searchResults.patients?.length || 0})</h6>
                    {searchResults.patients?.length > 0 ? (
                      <ul className="list-group mb-3">
                        {searchResults.patients.map((p) => (
                          <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{p.name}</strong> <span className="badge bg-secondary">{p.patientCode}</span>
                              <div className="small text-muted">Phone: {p.phone} | Age: {p.age}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted small">No patients match "{searchQuery}"</p>
                    )}

                    {/* DOCTORS */}
                    <h6 className="fw-bold text-info mb-2">👨‍⚕️ Doctors ({searchResults.doctors?.length || 0})</h6>
                    {searchResults.doctors?.length > 0 ? (
                      <ul className="list-group mb-3">
                        {searchResults.doctors.map((d) => (
                          <li key={d.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{d.name}</strong> <span className="badge bg-info text-dark">{d.specialization}</span>
                              <div className="small text-muted">{d.doctorCode}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted small">No doctors match "{searchQuery}"</p>
                    )}

                    {/* APPOINTMENTS */}
                    <h6 className="fw-bold text-success mb-2">📅 Appointments ({searchResults.appointments?.length || 0})</h6>
                    {searchResults.appointments?.length > 0 ? (
                      <ul className="list-group mb-3">
                        {searchResults.appointments.map((a) => (
                          <li key={a.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{a.appointmentCode}</strong> - {a.patient?.name} with {a.doctor?.name}
                              <div className="small text-muted">Date: {a.appointmentDate} | Time: {a.appointmentTime}</div>
                            </div>
                            <span className="badge bg-primary">{a.status}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted small">No appointments match "{searchQuery}"</p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted">Enter a search query.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS MODAL */}
      {showNotifModal && (
        <div
          className="modal show d-block tab-index='-1'"
          style={{ background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(4px)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "16px" }}>
              <div className="modal-header bg-dark text-white p-3" style={{ borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}>
                <h5 className="modal-title fw-bold mb-0">🔔 Live System Notifications</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowNotifModal(false)} />
              </div>
              <div className="modal-body p-4" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                {notifications.length > 0 ? (
                  <div className="list-group">
                    {notifications.map((n) => (
                      <div key={n.id} className="list-group-item list-group-item-action p-3 mb-2 border rounded">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong className="text-dark">{n.title}</strong>
                          <small className="text-muted" style={{ fontSize: "11px" }}>{n.timestamp}</small>
                        </div>
                        <p className="text-secondary small mb-0">{n.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    No active notifications.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavbarHeader;
