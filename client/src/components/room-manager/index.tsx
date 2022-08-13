import { useNavigate, useParams } from "react-router-dom";

function RoomManager() {
    const navigate = useNavigate();
    const params = useParams();

    const roomIdentifier = params.roomIdentifier;

    const navigateToAllRooms = () => {
        navigate("/app/rooms/");
    }

    return (
        <div>
            <h2>Room: {roomIdentifier}</h2>
            <div>
                <button>Metrics</button>
                <button>Edit</button>
                <button>Activity</button>
                <button onClick={navigateToAllRooms}>All Rooms</button>
            </div>
        </div>
    );
}

export default RoomManager;
