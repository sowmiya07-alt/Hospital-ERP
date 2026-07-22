import axios from "axios";

const API_URL = "http://hospital-erp-1-bsh6.onrender.com/auth";

export const loginUser = (loginData) => {
  return axios.post(`${API_URL}/login`, loginData);
};