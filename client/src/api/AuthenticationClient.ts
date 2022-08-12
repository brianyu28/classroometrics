import { UserAuthentication } from "crmet/data/User";
import { apiGet, apiPost } from "./APIClient";

export function login(username: string, password: string) {
    return apiPost(null, '/auth/login', { username, password, create_session: true });
}

export function me() {
    return apiGet(null, '/auth/me');
}

export function logout(auth: UserAuthentication) {
    return apiPost(auth, '/auth/logout');
}
