import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getRooms } from "crmet/api/RoomClient";
import CreateRoom from "crmet/components/create-room";
import UserAuthContext from "crmet/contexts/UserAuthContext";
import { Room } from "crmet/data/Room";

function Rooms() {

    const { userAuth } = useContext(UserAuthContext);
    const [rooms, setRooms] = useState<Room[]>([]);

    const refreshRooms = () => {
        getRooms(userAuth)
        .then(res => res.json())
        .then((rooms: Room[])  => {
            setRooms(rooms);
        });
    };

    useEffect(refreshRooms, []);

    return (
        <div>
            Rooms
            <ul>
                {rooms.map(room =>
                    <li key={room.id}>
                        <Link to={`/app/rooms/${room.identifier}`}>
                            {room.identifier}
                        </Link>
                    </li>
                )}
            </ul>
            <CreateRoom />
        </div>
    );
}

export default Rooms;
