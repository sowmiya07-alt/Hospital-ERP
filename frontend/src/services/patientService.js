import api from "./api";

export const getPatients = () => api.get("/patients");

export const addPatient = (patient) => api.post("/patients", patient);

export const updatePatient = (id, patient) => api.put(`/patients/${id}`, patient);

export const deletePatient = (id) => api.delete(`/patients/${id}`);