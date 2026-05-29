import api from "./axios";

export function registerUser(payload) {
  return api.post("/register", payload);
}

export function loginUser(payload) {
  return api.post("/login", payload);
}
