import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRooms } from "crmet/api/RoomClient";
import CreateRoom from "crmet/components/create-room";
import UserAuthContext from "crmet/contexts/UserAuthContext";
import { Room } from "crmet/data/Room";

import "./style.scss";

function Rooms() {
  const { userAuth, handleLogout } = useContext(UserAuthContext);
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();

  const refreshRooms = () => {
    getRooms()
      .then((res) => res.json())
      .then((rooms: Room[]) => {
        setRooms(rooms);
      });
  };

  useEffect(refreshRooms, []);

  const navigateToRoom = (room: Room) => {
    navigate(`/app/rooms/${room.identifier}`);
  };

  return (
    <div>
      <h1>Classroometrics: {userAuth.user.username}</h1>
      <h2>Rooms</h2>
      {rooms.map((room) => (
        <button key={room.id} onClick={() => navigateToRoom(room)}>
          {room.title} - {room.identifier}
        </button>
      ))}
      <CreateRoom />
      <div className="logout-area">
        <button onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
}

export default Rooms;
