import api from "./api";

export const getLabReports = () => api.get("/api/labs");
export const getPatientLabReports = (patientId) => api.get(`/api/labs/patient/${patientId}`);
export const getDoctorLabReports = (doctorId) => api.get(`/api/labs/doctor/${doctorId}`);
export const createLabReport = (data) => api.post("/api/labs", data);
export const updateLabReportStatus = (id, status, result) =>
  api.put(`/api/labs/${id}/status?status=${encodeURIComponent(status)}&result=${encodeURIComponent(result || "")}`);
