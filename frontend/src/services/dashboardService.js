import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export const getDashboardSummary = () => {
  return axios.get(`${API_BASE_URL}/api/dashboard/summary`);
};
