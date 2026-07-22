import axios from "axios";

const API_URL = "https://hospital-erp-1-bsh6.onrender.com/billings";

// ADMIN - GET ALL BILLINGS
export const getBillings = () =>
  axios.get(API_URL);

// CREATE BILLING
export const addBilling = (billing) =>
  axios.post(API_URL, billing);

// UPDATE BILLING
export const updateBilling = (id, billing) =>
  axios.put(`${API_URL}/${id}`, billing);

// DELETE BILLING
export const deleteBilling = (id) =>
  axios.delete(`${API_URL}/${id}`);

// PATIENT - GET ONLY THEIR BILLING RECORDS
export const getPatientBillings = (patientId) =>
  axios.get(`${API_URL}/patient/${patientId}`);