import { Element, Room } from "crmet/data/Room";
import { useBooleanState } from "crmet/util/hooks";
import { useState } from "react";
import CreateElement from "../create-element";
import ElementGroupEditor from "../element-group-editor";
import QuestionManager from "../question-manager";

import "./style.scss";

interface RoomEditorProps {
    room: Room;
    questions: string[];
    questionsVisible: boolean;
    questionsEnabled: boolean;
    removeQuestionAtIndex: (index: number) => void;
    addElementToGroup: (element: Element, groupIndex: number) => void;
    deleteElement: (elementId: number) => void;
    updateGroup: (groupIndex: number, updatedGroup: Element[]) => void;
    updateVisibilityForElement: (elementId: number, isVisible: boolean) => void;
}

function RoomEditor({
    room,
    questions,
    questionsVisible,
    questionsEnabled,
    removeQuestionAtIndex,
    addElementToGroup,
    deleteElement,
    updateGroup,
    updateVisibilityForElement,
}: RoomEditorProps) {

    // Non-null if create room view is open, set to the group number
    const [createRoomViewGroup, setCreateRoomViewGroup] = useState<number | null>(null);

    const handleAddElement = (element: Element) => {
        if (createRoomViewGroup === null)
            return;
        addElementToGroup(element, createRoomViewGroup);
    }

    return (
        <div>
            <div className="room-editor">
                {questionsVisible &&
                    <QuestionManager
                        questions={questions}
                        questionsEnabled={questionsEnabled}
                        removeQuestionAtIndex={removeQuestionAtIndex}
                    />
                }
                {([...room.groups, []]).map((group, group_number) => (
                    <ElementGroupEditor
                        key={group_number}
                        group={group}
                        deleteElement={deleteElement}
                        updateGroup={(group: Element[]) => updateGroup(group_number, group)}
                        updateVisibilityForElement={updateVisibilityForElement}
                        shouldShowAddButton={createRoomViewGroup === null}
                        toggleCreateRoomViewOpen={() => setCreateRoomViewGroup(group_number)}
                    />
                ))}
            </div>
            {createRoomViewGroup !== null &&
                <CreateElement
                    roomId={room.id}
                    groupIndex={createRoomViewGroup}
                    onAddElement={handleAddElement}
                    toggleCreateRoomViewOpen={() => setCreateRoomViewGroup(null)}
                />
            }
        </div>

    );
}

export default RoomEditor;
