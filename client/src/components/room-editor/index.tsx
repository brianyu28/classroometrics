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
  // Non-null if create element view is open, set to the group number
  const [createElementViewGroup, setCreateElementViewGroup] = useState<number | null>(
    null
  );

  const handleAddElement = (element: Element) => {
    if (createElementViewGroup === null) return;
    addElementToGroup(element, createElementViewGroup);
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
                createElementViewGroup === null && showEditButtons
              }
              shouldShowDeleteButton={showEditButtons}
              toggleCreateElementViewOpen={() =>
                setCreateElementViewGroup(group_number)
              }
            />
          )
        )}
      </div>
      {createElementViewGroup !== null && (
        <CreateElement
          roomId={room.id}
          groupIndex={createElementViewGroup}
          onAddElement={handleAddElement}
          toggleCreateElementViewOpen={() => setCreateElementViewGroup(null)}
        />
      )}
    </div>
  );
}

export default RoomEditor;
