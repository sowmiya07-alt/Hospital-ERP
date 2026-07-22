import axios from "axios";

const API_URL = "https://hospital-erp-1-bsh6.onrender.com/medicines";

export const getMedicines = () =>
  axios.get(API_URL);

export const addMedicine = (medicine) =>
  axios.post(API_URL, medicine);

export const updateMedicine = (id, medicine) =>
  axios.put(`${API_URL}/${id}`, medicine);

export const deleteMedicine = (id) =>
  axios.delete(`${API_URL}/${id}`);