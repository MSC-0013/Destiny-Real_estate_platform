import axios from "axios";

// ------------------------------------
// 🌐 Dynamic Backend URL Configuration
// ------------------------------------
const isLocal = window.location.hostname === "localhost";
const API_BASE_URL = isLocal
  ? "http://localhost:5000/api"
  : "https://destiny-real-estate-platform-1.onrender.com/api";

console.log("🌍 Using backend:", API_BASE_URL);

// ------------------------------------
// Axios Instance
// ------------------------------------
const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ------------------------------------
// Auth Routes
// ------------------------------------
export const login = (email: string, password: string) =>
  API.post("/users/login", { email, password });

export const signup = (userData: any) =>
  API.post("/users/signup", userData);

// ------------------------------------
// User Routes
// ------------------------------------
export const getAllUsers = () => API.get("/users");
export const getUserById = (id: string) => API.get(`/users/${id}`);
export const deleteUser = (id: string) => API.delete(`/users/${id}`);

// Updated function to handle both JSON & FormData
export const updateUser = (id: string, userData: any, config?: any) => {
  // If userData is FormData, force multipart/form-data
  const isFormData = userData instanceof FormData;
  return API.put(
    isFormData ? `/users/${id}/image` : `/users/${id}`,
    userData,
    isFormData
      ? { headers: { "Content-Type": "multipart/form-data" }, ...config }
      : { headers: { "Content-Type": "application/json" }, ...config }
  );
};

// ------------------------------------
// Construction Project Routes
// ------------------------------------
export const getAllProjects = () => API.get("/construction/projects");
export const getProjectById = (id: string) =>
  API.get(`/construction/projects/${id}`);
export const createProject = (projectData: any) =>
  API.post("/construction/projects", projectData);
export const updateProject = (id: string, updatedData: any) =>
  API.put(`/construction/projects/${id}`, updatedData);
export const deleteProject = (id: string) =>
  API.delete(`/construction/projects/${id}`);

// ------------------------------------
// Project Submodules
// ------------------------------------

// 🧱 Tasks
export const addTaskToProject = (projectId: string, taskData: any) =>
  API.post(`/construction/projects/${projectId}/tasks`, taskData);
export const updateTaskInProject = (
  projectId: string,
  taskId: string,
  taskData: any
) => API.put(`/construction/projects/${projectId}/tasks/${taskId}`, taskData);
export const deleteTaskFromProject = (projectId: string, taskId: string) =>
  API.delete(`/construction/projects/${projectId}/tasks/${taskId}`);

// 🧾 Materials
export const addMaterialToProject = (projectId: string, materialData: any) =>
  API.post(`/construction/projects/${projectId}/materials`, materialData);
export const updateMaterialInProject = (
  projectId: string,
  materialId: string,
  materialData: any
) =>
  API.put(
    `/construction/projects/${projectId}/materials/${materialId}`,
    materialData
  );
export const deleteMaterialFromProject = (
  projectId: string,
  materialId: string
) => API.delete(`/construction/projects/${projectId}/materials/${materialId}`);

// ✅ Approvals
export const requestProjectApproval = (projectId: string) =>
  API.post(`/construction/projects/${projectId}/approval-request`);
export const approveProject = (projectId: string) =>
  API.post(`/construction/projects/${projectId}/approve`);
export const rejectProject = (projectId: string) =>
  API.post(`/construction/projects/${projectId}/reject`);

// ------------------------------------
// Repair Request Routes
// ------------------------------------
export const createRepairRequest = (requestData: any) =>
  API.post("/construction/repair-requests", requestData);
export const getAllRepairRequests = () => API.get("/construction/repair-requests");
export const approveRepairRequest = (id: string) =>
  API.put(`/construction/repair-requests/${id}/approve`);
export const rejectRepairRequest = (id: string) =>
  API.put(`/construction/repair-requests/${id}/reject`);

// ------------------------------------
// Construction Request Routes
// ------------------------------------
export const createConstructionRequest = (requestData: any) =>
  API.post("/construction/construction-requests", requestData);
export const getAllConstructionRequests = () =>
  API.get("/construction/construction-requests");
export const approveConstructionRequest = (id: string) =>
  API.put(`/construction/construction-requests/${id}/approve`);
export const rejectConstructionRequest = (id: string) =>
  API.put(`/construction/construction-requests/${id}/reject`);

// ------------------------------------
// File Upload
// ------------------------------------
export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export default API;
