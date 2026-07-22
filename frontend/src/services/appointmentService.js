import axios from "axios";

const API_URL = "https://hospital-erp-1-bsh6.onrender.com/appointments";

// ADMIN - GET ALL APPOINTMENTS
export const getAppointments = () =>
  axios.get(API_URL);

// CREATE APPOINTMENT
export const addAppointment = (appointment) =>
  axios.post(API_URL, appointment);

// UPDATE APPOINTMENT
export const updateAppointment = (id, appointment) =>
  axios.put(`${API_URL}/${id}`, appointment);

// DELETE APPOINTMENT
export const deleteAppointment = (id) =>
  axios.delete(`${API_URL}/${id}`);

// DOCTOR - GET ONLY THAT DOCTOR'S APPOINTMENTS
export const getDoctorAppointments = (doctorId) =>
  axios.get(`${API_URL}/doctor/${doctorId}`);

// PATIENT - GET ONLY THAT PATIENT'S APPOINTMENTS
export const getPatientAppointments = (patientId) =>
  axios.get(`${API_URL}/patient/${patientId}`);
