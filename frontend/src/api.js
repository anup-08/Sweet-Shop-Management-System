import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL + "/api",
});

export function initAuth() {
  const token = localStorage.getItem("accessToken");
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function getCurrentUser() {
  const stored = localStorage.getItem("user");
  if (stored) return JSON.parse(stored);
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  const p = parseJwt(token);
  if (!p) return null;
  const username = p.sub || p.username || p.user || null;
  const roles = p.role || p.roles || [];
  const user = { username, roles };
  localStorage.setItem("user", JSON.stringify(user));
  return user;
}

export function isTokenExpired(token) {
  try {
    const p = parseJwt(token);
    if (!p) return true;
    
    const exp = p.exp;
    if (!exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return now >= Number(exp);
  } catch (e) {
    return true;
  }
}

export async function refreshAccessToken() {
  const rToken = localStorage.getItem("refreshToken");
  if (!rToken) throw new Error("No refresh token available");
  try {
    const res = await api.post("/users/getToken", { refreshToken: rToken });
    const { accessToken } = res.data;
    if (!accessToken) throw new Error("No accessToken returned");
    localStorage.setItem("accessToken", accessToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    
    const p = parseJwt(accessToken);
    if (p) {
      const user = { username: p.sub || null, roles: p.role || p.roles || [] };
      localStorage.setItem("user", JSON.stringify(user));
    }
    return accessToken;
  } catch (e) {
    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    throw e;
  }
}

export async function login(username, password) {
  const res = await api.post("/users/login", { username, password });
  const { accessToken, refreshToken } = res.data;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  
  const p = parseJwt(accessToken);
  if (p) {
    const user = { username: p.sub || username, roles: p.role || p.roles || [] };
    localStorage.setItem("user", JSON.stringify(user));
  }
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return res.data;
}

export async function register(userObj) {
  const res = await api.post("/users/register", userObj);
  const { accessToken, refreshToken } = res.data;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  const p = parseJwt(accessToken);
  if (p) {
    const user = { username: p.sub || userObj.username, roles: p.role || p.roles || [] };
    localStorage.setItem("user", JSON.stringify(user));
  }
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return res.data;
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
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
