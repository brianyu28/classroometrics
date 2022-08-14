import ElementEditor from "crmet/components/element-editor";
import { Element } from "crmet/data/Room";

import "./style.scss";

interface ElementGroupEditorProps {
    group: Element[];
    deleteElement: (elementId: number) => void;
    updateVisibilityForElement: (elementId: number, isVisible: boolean) => void;
    shouldShowAddButton: boolean;
    toggleCreateRoomViewOpen: () => void;
}

function ElementGroupEditor({
    group,
    deleteElement,
    updateVisibilityForElement,
    shouldShowAddButton,
    toggleCreateRoomViewOpen,
}: ElementGroupEditorProps) {
    const classNames = [
        "element-group-editor"
    ];

    return (
        <div className={classNames.join(" ")}>
            {group.map(element => (
                <ElementEditor
                    key={element.id}
                    element={element}
                    onDelete={() => deleteElement(element.id)}
                    updateVisibilityForElement={updateVisibilityForElement}
                />
            ))}
            {shouldShowAddButton &&
                <button onClick={toggleCreateRoomViewOpen}>Add</button>
            }
        </div>
    );
}

export default ElementGroupEditor;
