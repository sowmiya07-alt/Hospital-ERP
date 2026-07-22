import axios from "axios";

const API_URL = "https://hospital-erp-1-bsh6.onrender.com/prescriptions";

// ADMIN - GET ALL PRESCRIPTIONS
export const getPrescriptions = () =>
  axios.get(API_URL);

// CREATE PRESCRIPTION
export const addPrescription = (prescription) =>
  axios.post(API_URL, prescription);

// UPDATE PRESCRIPTION
export const updatePrescription = (id, prescription) =>
  axios.put(`${API_URL}/${id}`, prescription);

// DELETE PRESCRIPTION
export const deletePrescription = (id) =>
  axios.delete(`${API_URL}/${id}`);

// PATIENT - GET ONLY THEIR PRESCRIPTIONS
export const getPatientPrescriptions = (patientId) =>
  axios.get(`${API_URL}/patient/${patientId}`);