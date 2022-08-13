import { getRoomForStudent } from "crmet/api/RoomClient";
import { Room } from "crmet/data/Room";
import { Error } from "crmet/data/Error";
import MajorElementsViewer from "crmet/major-elements-viewer";
import { useEffect, useState } from "react";
import MinorElementsViewer from "../minor-elements-viewer";

interface RoomViewerProps {
    identifier: string
};

function RoomViewer({
    identifier
}: RoomViewerProps) {

    const [room, setRoom] = useState<Room | null>(null);

    const reloadRoom = () => {
        getRoomForStudent(identifier)
        .then(res => res.json())
        .then((data: Room | Error) => {
            if ('error' in data) {
                console.log(data.error);
                return;
            }
            setRoom(data);
        })
    };

    useEffect(reloadRoom, [identifier]);

    if (room === null) {
        return <div></div>;
    }

    return (
        <div>
            {room.groups.length > 0 &&
                <MajorElementsViewer
                elements={room.groups[0]}
                />
            }
            {room.groups.length > 1 &&
                room.groups.slice(1).map((group, i) => (
                <MinorElementsViewer
                    key={i}
                    elements={group}
                />
                ))
            }
        </div>
    );
}

export default RoomViewer;
