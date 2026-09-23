import api from "./api";

export const globalSearch = (query) => api.get(`/api/search?query=${encodeURIComponent(query || "")}`);
