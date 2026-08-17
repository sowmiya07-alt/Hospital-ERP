import api from "./api";

export const getConsultations = () => api.get("/consultations");
export const getPatientConsultations = (patientId) => api.get(`/consultations/patient/${patientId}`);
export const getDoctorConsultations = (doctorId) => api.get(`/consultations/doctor/${doctorId}`);
export const getAppointmentConsultation = (appointmentId) => api.get(`/consultations/appointment/${appointmentId}`);
export const saveConsultation = (record) => api.post("/consultations", record);
