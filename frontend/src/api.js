import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL + "/api",
});

export function initAuth() {
  const token = localStorage.getItem("accessToken");
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export async function login(username, password) {
  const res = await api.post("/users/login", { username, password });
  const { accessToken, refreshToken } = res.data;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return res.data;
}

export async function register(userObj) {
  const res = await api.post("/users/register", userObj);
  const { accessToken, refreshToken } = res.data;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return res.data;
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  delete api.defaults.headers.common["Authorization"];
}

export async function getSweets() {
  const res = await api.get("/sweets");
  return res.data;
}

export async function purchaseSweet(id, quantity = 1) {
  const res = await api.post(`/sweets/${id}/purchase`, { quantity });
  return res.data;
}

export default api;
