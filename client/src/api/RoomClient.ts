import { Room } from "crmet/data/Room";
import { UserAuthentication } from "crmet/data/User";
import { apiGet, apiPost, apiPut } from "./APIClient";

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
    return apiGet(null, `/student/rooms/${id}`);
}

export function getTeacherRoomByIdentifier(auth: UserAuthentication, identifier: string) {
    return apiGet(auth, `/teacher/rooms/${identifier}`);
}

export function updateRoom(auth: UserAuthentication, room: Room) {
    return apiPut(auth, `/rooms/${room.id}`, {room});
}
