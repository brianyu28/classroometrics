export function getStudentWebsocketURL(roomId: number) {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    return `${protocol}://${window.location.host}/ws/student/${roomId}`;
}
