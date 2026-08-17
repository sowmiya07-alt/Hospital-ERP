import api from "./api";

// ADMIN - GET ALL BILLINGS
export const getBillings = () => api.get("/billings");

// CREATE BILLING
export const addBilling = (billing) => api.post("/billings", billing);

// UPDATE BILLING
export const updateBilling = (id, billing) => api.put(`/billings/${id}`, billing);

// DELETE BILLING
export const deleteBilling = (id) => api.delete(`/billings/${id}`);

// PATIENT - GET ONLY THEIR BILLING RECORDS
export const getPatientBillings = (patientId) => api.get(`/billings/patient/${patientId}`);