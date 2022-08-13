import { useParams } from "react-router-dom";

function RoomManager() {
    const params = useParams();
    const roomIdentifier = params.roomIdentifier;

    return (
        <div>
            <h2>Room Manager</h2>
            {roomIdentifier}
        </div>
    );
}

export default RoomManager;
