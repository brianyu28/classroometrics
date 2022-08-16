import { Element } from "crmet/data/Room";
import React from "react";
import ElementIcon from "../element-icon";

import "./style.scss";

interface ElementEditorProps {
    element: Element;
    count: number;
    shouldShowDeleteButton: boolean;
    onDelete: () => void;
    updateVisibilityForElement: (elementId: number, isVisible: boolean) => void;
}

function ElementEditor({
    element,
    count,
    shouldShowDeleteButton,
    onDelete: deleteElement,
    updateVisibilityForElement,
}: ElementEditorProps) {
    const classNames = [
        "element-editor"
    ];
    if (! element.is_visible) {
        classNames.push("element-not-visible")
    }

    const handleClick = () => {
        updateVisibilityForElement(element.id, !element.is_visible);
    };

    const stopPropagation = (event: React.MouseEvent) => {
        event.stopPropagation();
    }

    const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        const confirmation = confirm("Are you sure you want to delete this element?");
        if (!confirmation) {
            return;
        }
        deleteElement();
    }

    return (
            <div className={classNames.join(" ")} onClick={handleClick}>
                <div className="element-editor-label">
                    {element.icon !== "none" && <ElementIcon icon={element.icon} clickable={false} />}
                    {element.name && <div className="element-name">{element.name}</div>}
                </div>
                <div className="element-editor-options">
                    {
                        element.link !== "" &&
                        <a onClick={stopPropagation} href={element.link} target="_blank">
                            <button>Visit</button>
                        </a>
                    }
                    {shouldShowDeleteButton && <button onClick={handleDelete}>Delete</button>}
                </div>
                <div className="element-editor-options">
                    {count}
                </div>
            </div>

    );
}

export default ElementEditor;
