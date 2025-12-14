import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
export { API_URL };

const api = axios.create({
  baseURL: API_URL + "/api",
});
// Request interceptor: ensure Authorization header and refresh when needed
api.interceptors.request.use(async (config) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (isTokenExpired(token)) {
        const newToken = await refreshAccessToken();
        if (newToken) config.headers = { ...(config.headers || {}), Authorization: `Bearer ${newToken}` };
      } else {
        config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
      }
    }
  } catch (e) {
    delete config.headers.Authorization;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor: on 401, try refresh once and retry the request
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    // don't try to refresh if the failed request was the refresh endpoint itself
    if (originalRequest && originalRequest.url && originalRequest.url.includes('/users/getToken')) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers = { ...(originalRequest.headers || {}), Authorization: `Bearer ${newToken}` };
          return api(originalRequest);
        }
      } catch (e) {
        
      }
    }
    return Promise.reject(error);
  }
);

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
    console.debug("Attempting refresh with token:", rToken ? `${rToken.substring(0,6)}...` : null);
    const res = await axios.post(`${API_URL}/api/users/getToken`, { refreshToken: rToken });
    console.debug("refresh response status:", res.status, "data:", res.data);
    const { accessToken } = res.data || {};
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
    console.error("refreshAccessToken failed:", e?.response?.status, e?.response?.data || e?.message || e);
    
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

export async function getMySweets() {
  const res = await api.get("/sweets/my-sweets");
  return res.data;
}

export async function purchaseSweet(id, quantity = 1) {
  const res = await api.post(`/sweets/${id}/purchase`, { quantity });
  return res.data;
}


export async function addSweetForm(formData) {
  let token = localStorage.getItem("accessToken");
  const rToken = localStorage.getItem("refreshToken");
  if (!token && rToken) {
    // try to refresh into a usable access token
    token = await refreshAccessToken().catch(() => null);
  }
  if (token && isTokenExpired(token)) {
    token = await refreshAccessToken().catch(() => null);
  }
  if (!token) {
    console.debug("addSweetForm: no access token after refresh attempts; refreshToken present=", !!rToken);
    throw new Error("Not authenticated. Please login as admin to add sweets.");
  }
  console.debug("addSweetForm: sending add request with access token length=", token?.length);
  const headers = { Authorization: `Bearer ${token}` };

  const res = await api.post(`/sweets/addSweets`, formData, { headers });
  return res.data;
}

export async function updateSweetForm(id, formData) {
  let token = localStorage.getItem("accessToken");
  const rToken = localStorage.getItem("refreshToken");
  if (!token && rToken) {
    token = await refreshAccessToken().catch(() => null);
  }
  if (token && isTokenExpired(token)) {
    token = await refreshAccessToken().catch(() => null);
  }
  if (!token) {
    console.debug("updateSweetForm: no access token after refresh attempts; refreshToken present=", !!rToken);
    throw new Error("Not authenticated. Please login as admin to update sweets.");
  }
  console.debug("updateSweetForm: sending update request for id", id, "with access token length=", token?.length);
  const headers = { Authorization: `Bearer ${token}` };

  const res = await api.post(`/sweets/${id}`, formData, { headers });
  return res.data;
}

export async function deleteSweet(id) {
  const res = await api.delete(`/sweets/${id}`);
  return res.data;
}

export default api;
