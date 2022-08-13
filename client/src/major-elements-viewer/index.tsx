import MajorElementViewer from "crmet/components/major-element-viewer";
import { Element } from "crmet/data/Room";

import "./style.scss";

interface MajorElementsViewerProps {
    elements: Element[]
}

function MajorElementsViewer({
    elements
}: MajorElementsViewerProps) {
    return (
        <div className="major-elements-viewer">
            {elements.map(element => {
                if (!element.is_visible) {
                    return;
                }
                return <MajorElementViewer key={element.identifier} icon={element.icon} />
            })}
        </div>
    );
}

export default MajorElementsViewer;
