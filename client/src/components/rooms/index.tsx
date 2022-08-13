import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getRooms } from "crmet/api/RoomClient";
import CreateRoom from "crmet/components/create-room";
import UserAuthContext from "crmet/contexts/UserAuthContext";
import { Room } from "crmet/data/Room";

function Rooms() {

    const { userAuth } = useContext(UserAuthContext);
    const [rooms, setRooms] = useState<Room[]>([]);
    const navigate = useNavigate();

    const refreshRooms = () => {
        getRooms(userAuth)
        .then(res => res.json())
        .then((rooms: Room[])  => {
            setRooms(rooms);
        });
    };

    useEffect(refreshRooms, []);

    const navigateToRoom = (room: Room) => {
        navigate(`/app/rooms/${room.identifier}`);
    }

    return (
        <div>
            <h1>Classroometrics: {userAuth.user.username}</h1>
            <h2>Rooms</h2>
            {rooms.map(room =>
                <button key={room.id} onClick={() => navigateToRoom(room)}>
                    {room.title} - {room.identifier}
                </button>
            )}
            <CreateRoom />
        </div>
    );
}

export default Rooms;
