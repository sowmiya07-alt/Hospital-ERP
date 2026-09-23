import api from "./api";

// ADMIN - GET ALL PRESCRIPTIONS
export const getPrescriptions = () => api.get("/prescriptions");

// CREATE PRESCRIPTION
export const addPrescription = (prescription) => api.post("/prescriptions", prescription);

// UPDATE PRESCRIPTION
export const updatePrescription = (id, prescription) => api.put(`/prescriptions/${id}`, prescription);

// DELETE PRESCRIPTION
export const deletePrescription = (id) => api.delete(`/prescriptions/${id}`);

// PATIENT - GET ONLY THEIR PRESCRIPTIONS
export const getPatientPrescriptions = (patientId) => api.get(`/prescriptions/patient/${patientId}`);