import { UserAuthentication } from "crmet/data/User";
import { apiGet, apiPost } from "./APIClient";

export function getDashboards(auth: UserAuthentication) {
    return apiGet(auth, '/dashboards');
}

export function createDashboard(auth: UserAuthentication, identifier: string, title: string) {
    return apiPost(auth, '/dashboards', {identifier, title});
}
