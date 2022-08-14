import { Element } from "crmet/data/Room";
import React from "react";
import ElementIcon from "../element-icon";

import "./style.scss";

interface ElementEditorProps {
    element: Element;
    updateVisibilityForElement: (elementId: number, isVisible: boolean) => void;
}

function ElementEditor({
    element,
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

    return (
        <div className={classNames.join(" ")} onClick={handleClick}>
            <ElementIcon icon={element.icon} clickable={false} />
            {element.name &&
                <div className="element-name">
                    <span>
                        {element.name}
                    </span>
                    {
                        element.link !== "" &&
                        <a onClick={stopPropagation} href={element.link} target="_blank">
                            <button className="element-link">Visit</button>
                        </a>
                    }
                </div>
            }
        </div>
    );
}

export default ElementEditor;
