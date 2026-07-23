import axios from "axios";

const API_URL =
  "https://hospital-erp-1-bsh6.onrender.com/auth";

// ============================
// LOGIN USER
// ============================

export const loginUser = (loginData) => {
  return axios.post(
    `${API_URL}/login`,
    loginData
  );
};

// ============================
// REGISTER NEW PATIENT
// ============================

export const registerPatient = (patientData) => {
  return axios.post(
    `${API_URL}/register/patient`,
    patientData
  );
};