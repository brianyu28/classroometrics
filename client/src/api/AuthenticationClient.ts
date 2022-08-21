import { apiGet, apiPost } from "./APIClient";

export function login(username: string, password: string) {
  return apiPost("/auth/login", { username, password, create_session: true });
}

export function me() {
  return apiGet("/auth/me");
}

export function logout() {
  return apiPost("/auth/logout");
}
