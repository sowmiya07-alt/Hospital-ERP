import api from "./api";

export const getRoleNotifications = (role) => api.get(`/api/notifications/role/${role}`);
export const getUserNotifications = (username) => api.get(`/api/notifications/user/${username}`);
