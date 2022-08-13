import { UserAuthentication } from "crmet/data/User";
import { apiGet, apiPost } from "./APIClient";

export function getRooms(auth: UserAuthentication) {
    return apiGet(auth, '/rooms');
}

export function createRoom(auth: UserAuthentication, identifier: string, title: string) {
    return apiPost(auth, '/rooms', {identifier, title});
}

/**
 * Get the room for student perspective: only visible elements.
 */
export function getRoomForStudent(id: number) {
    return apiGet(null, `/rooms/view/${id}`);
}
