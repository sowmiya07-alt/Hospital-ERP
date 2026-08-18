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

// ============================
// FORCED FIRST-LOGIN PASSWORD CHANGE
// ============================

export const changePassword = (data) => {
  return api.post("/auth/change-password", data);
};

// ============================
// FORGOT PASSWORD REQUEST
// ============================

export const forgotPassword = (data) => {
  return api.post("/auth/forgot-password", data);
};