import api from "./api";

export const getAdmissions = () => api.get("/api/admissions");
export const getBeds = () => api.get("/api/admissions/beds");
export const createBed = (data) => api.post("/api/admissions/beds", data);
export const admitPatient = (data) => api.post("/api/admissions/admit", data);
export const dischargePatient = (id) => api.put(`/api/admissions/${id}/discharge`);
