import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // replace with deployed backend link later
});

// Auth
export const login = (email, password) => API.post("/users/login", { email, password });
export const signup = (userData) => API.post("/users/signup", userData);

// Users
export const getAllUsers = () => API.get("/users");
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateUser = (id, userData) => API.put(`/users/${id}`, userData);
export const deleteUser = (id) => API.delete(`/users/${id}`);

