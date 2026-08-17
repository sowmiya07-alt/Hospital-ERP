import api from "./api";

// ADMIN - GET ALL APPOINTMENTS
export const getAppointments = () => api.get("/appointments");

// CREATE APPOINTMENT
export const addAppointment = (appointment) => api.post("/appointments", appointment);

// UPDATE APPOINTMENT
export const updateAppointment = (id, appointment) => api.put(`/appointments/${id}`, appointment);

// DELETE APPOINTMENT
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);

// DOCTOR - GET ONLY THAT DOCTOR'S APPOINTMENTS
export const getDoctorAppointments = (doctorId) => api.get(`/appointments/doctor/${doctorId}`);

// PATIENT - GET ONLY THAT PATIENT'S APPOINTMENTS
export const getPatientAppointments = (patientId) => api.get(`/appointments/patient/${patientId}`);

