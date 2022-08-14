import { getTeacherRoomByIdentifier, updateRoom } from "crmet/api/RoomClient";
import UserAuthContext from "crmet/contexts/UserAuthContext";
import { Room } from "crmet/data/Room";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RoomEditor from "../room-editor";

function RoomManager() {
    const navigate = useNavigate();
    const params = useParams();
    const { userAuth } = useContext(UserAuthContext);

    const [room, setRoom] = useState<Room | null>(null);

    const roomIdentifier = params.roomIdentifier;

    const reloadRoom = () => {
        getTeacherRoomByIdentifier(userAuth, roomIdentifier)
        .then(res => res.json())
        .then((room: Room | null) => {
            if (room === null) {
                return;
            }
            setRoom(room);
        });
    };

    // Send PUT request to API to make changes to room
    const saveUpdatedRoom = (updatedRoom: Room) => {
        updateRoom(userAuth, updatedRoom)
        .then(res => res.json())
        .then(data => {
            console.log(data);
        });
    };

    // Update whether an element is visible in the room
    const updateVisibilityForElement = (elementId: number, isVisible: boolean) => {
        const updatedRoom = {
            ...room,
            groups: room.groups.map(group => (
                group.map(element => ({
                    ...element,
                    is_visible: element.id === elementId ? isVisible : element.is_visible
                }))
            ))
        };
        setRoom(updatedRoom);
        saveUpdatedRoom(updatedRoom);
    }

    useEffect(reloadRoom, [userAuth, roomIdentifier])

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
            {room !== null &&
                <RoomEditor
                    room={room}
                    updateVisibilityForElement={updateVisibilityForElement}
                />
            }
        </div>
    );
}

export default RoomManager;
