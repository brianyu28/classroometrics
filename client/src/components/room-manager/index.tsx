import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { useHotkeys } from "react-hotkeys-hook";

import { getTeacherRoomByIdentifier, updateRoom } from "crmet/api/RoomClient";
import UserAuthContext from "crmet/contexts/UserAuthContext";
import { Error } from "crmet/data/Error";
import { Element, Room } from "crmet/data/Room";
import RoomEditor from "../room-editor";
import { getTeacherWebsocketURL } from "crmet/api/WebsocketClient";
import RoomActivity from "../room-activity";
import { ElementActivity } from "crmet/data/ElementActivity";
import { useBooleanState, usePersistentBooleanState, useRoom } from "crmet/util/hooks";
import { getCurrentTimestamp } from "crmet/util/dates";
import QuestionManager from "../question-manager";

const ACTIVITY_LIFESPAN_SECONDS = 4;

function RoomManager() {
    const navigate = useNavigate();
    const params = useParams();
    const { userAuth } = useContext(UserAuthContext);

    const roomIdentifier = params.roomIdentifier;

    const [room, setRoom, elementMap] = useRoom();
    const [elementActivity, setElementActivity] = useState<ElementActivity[]>([]);
    const [questions, setQuestions] = useState<string[]>([]);
    const {sendJsonMessage, lastJsonMessage} = useWebSocket(
        room !== null ? getTeacherWebsocketURL(room.id) : null
    );
    const [elementCounts, setElementCounts] = useState<any>({});

    const [isShowingActivityView, toggleIsShowingActivityView] = useBooleanState(false);
    const [isInBatchToggleMode, toggleIsInBatchToggleMode] = useBooleanState(false);
    const [questionsVisible, toggleQuestionsVisible] = useBooleanState(true);
    const [showEditButtons, toggleEditButtons] = usePersistentBooleanState(true, "crmet_room_show_edit_buttons");

    const removeExpiredElementActivity = () => {
        const timestamp = getCurrentTimestamp();
        setElementActivity(elementActivity => elementActivity.filter(activity =>
            timestamp - activity.timestamp < ACTIVITY_LIFESPAN_SECONDS
        ));
    };


    const questionsEnabled = room !== null && room.questions_enabled;

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

            // Add element to activity
            setElementActivity(elementActivity => [
                ...elementActivity,
                {
                    element,
                    x: Math.random(),
                    y: Math.random(),
                    timestamp: getCurrentTimestamp(),
                }
            ]);
            setTimeout(
                removeExpiredElementActivity,
                ACTIVITY_LIFESPAN_SECONDS * 1000
            );

            // Add to element counts
            setElementCounts((counts: any) => ({
                 ...counts,
                 [elementId]: elementId in counts ? counts[elementId] + 1 : 1
            }));
        } else if ((lastJsonMessage as any).type == "event_question") {
            const question = (lastJsonMessage as any).question;
            setQuestions(questions => [...questions, question]);
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
        if (!isInBatchToggleMode) {
            saveUpdatedRoom(updatedRoom);
        }
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

    const toggleQuestionsEnabled = () => {
        if (room === null) {
            return;
        }
        const updatedRoom = {
            ...room,
            questions_enabled: !room.questions_enabled,
        }
        setRoom(updatedRoom);
        saveUpdatedRoom(updatedRoom);
    }

    const removeQuestionAtIndex = (index: number) => {
        setQuestions(questions =>
            [...questions.slice(0, index), ...questions.slice(index + 1)]
        )
    }

    const switchBatchToggle = () => {
        if (isInBatchToggleMode) {
            saveUpdatedRoom(room);
        }
        toggleIsInBatchToggleMode();
    }

    useEffect(reloadRoom, [userAuth, roomIdentifier])

    const navigateToAllRooms = () => {
        navigate("/app/rooms/");
    }

    useHotkeys('q', toggleQuestionsVisible);
    useHotkeys('a', toggleIsShowingActivityView);
    useHotkeys('b', switchBatchToggle, [room, isInBatchToggleMode]);
    useHotkeys('d', toggleQuestionsEnabled, [room]);
    useHotkeys('e', toggleEditButtons);

    if (isShowingActivityView) {
        return (
            <div>
                <RoomActivity
                    elementActivity={elementActivity}
                    questions={questions}
                    questionsEnabled={questionsEnabled}
                    questionsVisible={questionsVisible}
                    toggleQuestionsVisible={toggleQuestionsVisible}
                    removeQuestionAtIndex={removeQuestionAtIndex}
                    toggleIsShowingActivityView={toggleIsShowingActivityView}
                />
            </div>
        );
    }

    return (
        <div>
            <h2>Room{room !== null && `: ${room.title}` }</h2>
            <div>
                <button onClick={toggleIsShowingActivityView}>Activity View</button>
                <button onClick={navigateToAllRooms}>All Rooms</button>
            </div>
            <div>
                <div>
                    <label>
                        <input type="checkbox" checked={questionsEnabled} onChange={toggleQuestionsEnabled}></input>
                        Questions enabled?
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" checked={isInBatchToggleMode} onChange={switchBatchToggle}></input>
                        Hold visibility changes?
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" checked={questionsVisible} onChange={toggleQuestionsVisible}></input>
                        Show student questions?
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" checked={showEditButtons} onChange={toggleEditButtons}></input>
                        Show edit buttons?
                    </label>
                </div>
            </div>
            {room !== null &&
                <RoomEditor
                    room={room}
                    elementCounts={elementCounts}
                    questions={questions}
                    questionsVisible={questionsVisible}
                    questionsEnabled={questionsEnabled}
                    removeQuestionAtIndex={removeQuestionAtIndex}
                    showEditButtons={showEditButtons}
                    addElementToGroup={addElementToGroup}
                    deleteElement={deleteElement}
                    updateGroup={updateGroup}
                    updateVisibilityForElement={updateVisibilityForElement}
                />
            }
        </div>
    );
}

export default RoomManager;
