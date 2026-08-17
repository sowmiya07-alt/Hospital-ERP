import api from "./api";

export const getMedicines = () => api.get("/medicines");

export const addMedicine = (medicine) => api.post("/medicines", medicine);

export const updateMedicine = (id, medicine) => api.put(`/medicines/${id}`, medicine);

export const getLowStockMedicines = () => api.get("/medicines/low-stock");

export const dispenseMedicine = (id, quantity) => api.post(`/medicines/${id}/dispense?quantity=${quantity}`);

export const deleteMedicine = (id) => api.delete(`/medicines/${id}`);