import { useState } from "react";

import CreateElement from "crmet/components/create-element";
import ElementGroupEditor from "crmet/components/element-group-editor";
import QuestionManager from "crmet/components/question-manager";
import { Element, Room } from "crmet/data/Room";

import "./style.scss";

interface RoomEditorProps {
  room: Room;
  elementCounts: any;
  questions: string[];
  questionsVisible: boolean;
  questionsEnabled: boolean;
  showEditButtons: boolean;
  removeQuestionAtIndex: (index: number) => void;
  addElementToGroup: (element: Element, groupIndex: number) => void;
  deleteElement: (elementId: number) => void;
  updateGroup: (groupIndex: number, updatedGroup: Element[]) => void;
  updateVisibilityForElement: (elementId: number, isVisible: boolean) => void;
}

function RoomEditor({
  room,
  elementCounts,
  questions,
  questionsVisible,
  questionsEnabled,
  showEditButtons,
  removeQuestionAtIndex,
  addElementToGroup,
  deleteElement,
  updateGroup,
  updateVisibilityForElement,
}: RoomEditorProps) {
  // Non-null if create room view is open, set to the group number
  const [createRoomViewGroup, setCreateRoomViewGroup] = useState<number | null>(
    null
  );

  const handleAddElement = (element: Element) => {
    if (createRoomViewGroup === null) return;
    addElementToGroup(element, createRoomViewGroup);
  };

  return (
    <div>
      <div className="room-editor">
        {questionsVisible && (
          <QuestionManager
            questions={questions}
            questionsEnabled={questionsEnabled}
            removeQuestionAtIndex={removeQuestionAtIndex}
          />
        )}
        {(showEditButtons ? [...room.groups, []] : room.groups).map(
          (group, group_number) => (
            <ElementGroupEditor
              key={group_number}
              group={group}
              elementCounts={elementCounts}
              deleteElement={deleteElement}
              updateGroup={(group: Element[]) =>
                updateGroup(group_number, group)
              }
              updateVisibilityForElement={updateVisibilityForElement}
              shouldShowAddButton={
                createRoomViewGroup === null && showEditButtons
              }
              shouldShowDeleteButton={showEditButtons}
              toggleCreateRoomViewOpen={() =>
                setCreateRoomViewGroup(group_number)
              }
            />
          )
        )}
      </div>
      {createRoomViewGroup !== null && (
        <CreateElement
          roomId={room.id}
          groupIndex={createRoomViewGroup}
          onAddElement={handleAddElement}
          toggleCreateRoomViewOpen={() => setCreateRoomViewGroup(null)}
        />
      )}
    </div>
  );
}

export default RoomEditor;
