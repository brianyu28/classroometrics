import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import ElementEditor from "crmet/components/element-editor";
import { Element } from "crmet/data/Room";

import "./style.scss";

interface ElementGroupEditorProps {
  group: Element[];
  elementCounts: any;
  deleteElement: (elementId: number) => void;
  updateGroup: (group: Element[]) => void;
  updateVisibilityForElement: (elementId: number, isVisible: boolean) => void;
  shouldShowAddButton: boolean;
  shouldShowDeleteButton: boolean;
  toggleCreateElementViewOpen: () => void;
}

function ElementGroupEditor({
  group,
  elementCounts,
  deleteElement,
  updateGroup,
  updateVisibilityForElement,
  shouldShowAddButton,
  shouldShowDeleteButton,
  toggleCreateElementViewOpen,
}: ElementGroupEditorProps) {
  const classNames = ["element-group-editor"];

  // Custom style when reordering list
  const getListStyle = (isDraggingOver: boolean) => ({
    paddingBottom: isDraggingOver ? "10px" : "0px",
  });
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    ...draggableStyle,
  });

  const reorder = (
    group: Element[],
    startIndex: number,
    endIndex: number
  ): Element[] => {
    const result = Array.from(group);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleDragEnd = (result: any) => {
    // Dropped outside the list.
    if (!result.destination) {
      return;
    }

    if (result.source.index === result.destination.index) {
      return;
    }

    const newGroup = reorder(
      group,
      result.source.index,
      result.destination.index
    );

    updateGroup(newGroup);
  };

  return (
    <div className={classNames.join(" ")}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {group.map((element, index) => (
                <Draggable
                  key={element.id}
                  draggableId={element.id.toString()}
                  index={index}
                  isDragDisabled={group.length <= 1}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <ElementEditor
                        key={element.id}
                        count={elementCounts[element.id] || 0}
                        element={element}
                        onDelete={() => deleteElement(element.id)}
                        shouldShowDeleteButton={shouldShowDeleteButton}
                        updateVisibilityForElement={updateVisibilityForElement}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {shouldShowAddButton && (
        <button onClick={toggleCreateElementViewOpen}>Add</button>
      )}
    </div>
  );
}

export default ElementGroupEditor;
