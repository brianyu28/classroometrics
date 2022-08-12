import { UserAuthentication } from "crmet/data/User";
import { api_get, api_post } from "./APIClient";

export function login(username: string, password: string) {
    return api_post(null, '/auth/login', { username, password, create_session: true });
}

export function me() {
    return api_get(null, '/auth/me');
}

export function logout(auth: UserAuthentication) {
    return api_post(auth, '/auth/logout');
}
