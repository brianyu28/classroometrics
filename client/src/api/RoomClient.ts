import { Room } from "crmet/data/Room";
import { apiGet, apiPost, apiPut } from "./APIClient";

export function getRooms() {
    return apiGet('/rooms');
}

export function createRoom(identifier: string, title: string) {
    return apiPost('/rooms', {identifier, title});
}

/**
 * Get the room for student perspective: only visible elements.
 */
export function getRoomForStudent(id: number) {
    return apiGet(`/student/rooms/${id}`);
}

export function getTeacherRoomByIdentifier(identifier: string) {
    return apiGet(`/teacher/rooms/${identifier}`);
}

export function updateRoom(room: Room) {
    return apiPut(`/rooms/${room.id}`, {room});
}
