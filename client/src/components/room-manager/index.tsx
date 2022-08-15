import useWebSocket from "react-use-websocket";

import { getTeacherRoomByIdentifier, updateRoom } from "crmet/api/RoomClient";
import UserAuthContext from "crmet/contexts/UserAuthContext";
import { Error } from "crmet/data/Error";
import { Element, Room } from "crmet/data/Room";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RoomEditor from "../room-editor";
import { getTeacherWebsocketURL } from "crmet/api/WebsocketClient";
import RoomActivity from "../room-activity";
import { ElementActivity } from "crmet/data/ElementActivity";
import { useRoom } from "crmet/util/hooks";
import { getCurrentTimestamp } from "crmet/util/dates";

function RoomManager() {
    const navigate = useNavigate();
    const params = useParams();
    const { userAuth } = useContext(UserAuthContext);

    const roomIdentifier = params.roomIdentifier;

    const [room, setRoom, elementMap] = useRoom();
    const [elementActivity, setElementActivity] = useState<ElementActivity[]>([]);
    const {sendJsonMessage, lastJsonMessage} = useWebSocket(
        room !== null ? getTeacherWebsocketURL(room.id) : null
    );

    useEffect(() => {
        if (lastJsonMessage === null) {
            return;
        }

        if ((lastJsonMessage as any).type === "event_room_update") {
            setRoom((lastJsonMessage as any).room);
        } else if ((lastJsonMessage as any).type == "event_element_activity") {
            const elementId = (lastJsonMessage as any).element_id;
            if (!(elementId in elementMap)) {
                return;
            }
            const element = elementMap[elementId];
            setElementActivity([
                ...elementActivity,
                {
                    element,
                    x: Math.random(),
                    y: Math.random(),
                    timestamp: getCurrentTimestamp(),
                }
            ])
        }

    }, [lastJsonMessage]);

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
        .then((data : Room | Error) => {
            if ('error' in data) {
                return;
            }
            setRoom(data);
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

    const addElementToGroup = (element: Element, groupIndex: number) => {
        const updatedGroups: Element[][] = (
            groupIndex >= room.groups.length ?
            [...room.groups, [element]] :
            room.groups.map((group, i) => (
                i === groupIndex ? [...group, element] : group
            ))
        );
        const updatedRoom = {
            ...room,
            groups: updatedGroups
        };
        saveUpdatedRoom(updatedRoom);
    }

    const deleteElement = (elementId: number) => {
        const updatedRoom = {
            ...room,
            groups: room.groups.map(group => group.filter(element => element.id !== elementId))
        };
        setRoom(updatedRoom);
        saveUpdatedRoom(updatedRoom);
    }

    const updateGroup = (groupIndex: number, updatedGroup: Element[]) => {
        const updatedRoom = {
            ...room,
            groups: room.groups.map((group, index) => index === groupIndex ? updatedGroup : group)
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
            <h2>Room{room !== null && `: ${room.title}` }</h2>
            <div>
                <button>Activity</button>
                <button>Batch Toggle</button>
                <button onClick={navigateToAllRooms}>All Rooms</button>
            </div>
            {room !== null &&
                <>
                    <RoomEditor
                        room={room}
                        addElementToGroup={addElementToGroup}
                        deleteElement={deleteElement}
                        updateGroup={updateGroup}
                        updateVisibilityForElement={updateVisibilityForElement}
                    />
                    <RoomActivity
                        elementActivity={elementActivity}
                    />
                </>
            }
        </div>
    );
}

export default RoomManager;
