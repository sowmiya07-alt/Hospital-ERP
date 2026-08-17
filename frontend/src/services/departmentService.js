import api from "./api";

export const getDepartments = () => api.get("/departments");
export const getDepartmentById = (id) => api.get(`/departments/${id}`);
export const addDepartment = (dept) => api.post("/departments", dept);
export const updateDepartment = (id, dept) => api.put(`/departments/${id}`, dept);
export const deleteDepartment = (id) => api.delete(`/departments/${id}`);
