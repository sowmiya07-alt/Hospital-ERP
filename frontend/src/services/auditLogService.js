import api from "./api";

export const getAuditLogs = () => api.get("/api/audit-logs");
