const API_URL = "https://diaspoconnect-backend.onrender.com/api";

// AUTH
export const register = (data) =>
  fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const login = (data) =>
  fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

// ASSOCIATIONS
export const getAssociations = () =>
  fetch(`${API_URL}/associations`).then((r) => r.json());

export const getAssociation = (id) =>
  fetch(`${API_URL}/associations/${id}`).then((r) => r.json());

// PROJETS
export const getProjets = () =>
  fetch(`${API_URL}/projets`).then((r) => r.json());

// Helpers token
export const getToken = () => localStorage.getItem("token");
export const getUser = () => JSON.parse(localStorage.getItem("user") || "null");
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
