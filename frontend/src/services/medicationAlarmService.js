import axios from "axios";

const API_URL =
  "https://hospital-erp-1-bsh6.onrender.com/medication-alarms";

// CREATE MEDICATION ALARM
export const createMedicationAlarm = (alarmData) => {
  return axios.post(API_URL, alarmData);
};

// GET ALARMS FOR LOGGED-IN PATIENT
export const getPatientMedicationAlarms = (patientId) => {
  return axios.get(
    `${API_URL}/patient/${patientId}`
  );
};

// TURN ALARM ON / OFF
export const toggleMedicationAlarm = (alarmId) => {
  return axios.put(
    `${API_URL}/${alarmId}/toggle`
  );
};

// DELETE MEDICATION ALARM
export const deleteMedicationAlarm = (alarmId) => {
  return axios.delete(
    `${API_URL}/${alarmId}`
  );
};