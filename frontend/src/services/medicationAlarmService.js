import api from "./api";

// CREATE MEDICATION ALARM
export const createMedicationAlarm = (alarmData) => {
  return api.post("/medication-alarms", alarmData);
};

// GET ALARMS FOR LOGGED-IN PATIENT
export const getPatientMedicationAlarms = (patientId) => {
  return api.get(`/medication-alarms/patient/${patientId}`);
};

// TURN ALARM ON / OFF
export const toggleMedicationAlarm = (alarmId) => {
  return api.put(`/medication-alarms/${alarmId}/toggle`);
};

// DELETE MEDICATION ALARM
export const deleteMedicationAlarm = (alarmId) => {
  return api.delete(`/medication-alarms/${alarmId}`);
};