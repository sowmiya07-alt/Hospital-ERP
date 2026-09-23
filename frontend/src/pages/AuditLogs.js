import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import NavbarHeader from "../components/NavbarHeader";
import { getAuditLogs } from "../services/auditLogService";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await getAuditLogs();
      setLogs(res.data || []);
    } catch (err) {
      console.log("Error loading audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <NavbarHeader title="📜 Security Audit & Activity Logs" portalRole="ADMIN" />

        <div className="card shadow-sm border-0 p-4" style={{ borderRadius: "14px" }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold mb-0">Operational Event Trail</h5>
              <small className="text-muted">Real-time log of administrative and clinical actions</small>
            </div>
            <button className="btn btn-outline-secondary btn-sm" onClick={loadLogs}>
              🔄 Refresh Logs
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4 text-muted">Loading audit logs...</div>
          ) : logs.length === 0 ? (
            <div className="alert alert-light text-center">No audit logs captured.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle" style={{ fontSize: "13px" }}>
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l) => (
                    <tr key={l.id}>
                      <td><strong>#{l.id}</strong></td>
                      <td><small className="text-muted">{l.timestamp}</small></td>
                      <td><strong>{l.username}</strong></td>
                      <td><span className="badge bg-secondary">{l.userRole}</span></td>
                      <td>
                        <span
                          className={`badge ${
                            l.action === "CREATE"
                              ? "bg-success"
                              : l.action === "UPDATE"
                              ? "bg-primary"
                              : l.action === "DELETE"
                              ? "bg-danger"
                              : "bg-info text-dark"
                          }`}
                        >
                          {l.action}
                        </span>
                      </td>
                      <td>{l.entityName} {l.entityId ? `(#${l.entityId})` : ""}</td>
                      <td>{l.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditLogs;
