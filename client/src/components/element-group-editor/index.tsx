import { Element } from "crmet/data/Room";
import ElementEditor from "../element-editor";

import "./style.scss";

interface ElementGroupEditorProps {
    group: Element[];
    updateVisibilityForElement: (elementId: number, isVisible: boolean) => void;
}

function ElementGroupEditor({
    group,
    updateVisibilityForElement,
}: ElementGroupEditorProps) {
    const classNames = [
        "element-group-editor"
    ];

    const handleClick = () => {
    };

    return (
        <div className={classNames.join(" ")}>
            {group.map(element => (
                <ElementEditor
                    key={element.id}
                    element={element}
                    updateVisibilityForElement={updateVisibilityForElement}
                />
            ))}
        </div>
    );
}

export default ElementGroupEditor;
