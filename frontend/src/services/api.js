import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://hospital-erp-1-bsh6.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
export { BASE_URL };
