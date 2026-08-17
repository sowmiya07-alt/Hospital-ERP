import api from "./api";

// ============================
// LOGIN USER
// ============================

export const loginUser = (loginData) => {
  return api.post("/auth/login", loginData);
};

// ============================
// REGISTER NEW PATIENT
// ============================

export const registerPatient = (patientData) => {
  return api.post("/auth/register/patient", patientData);
};