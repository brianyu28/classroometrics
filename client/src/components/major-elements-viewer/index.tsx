import MajorElementViewer from "crmet/components/major-element-viewer";
import { Element } from "crmet/data/Room";

import "./style.scss";

interface MajorElementsViewerProps {
    elements: Element[];
    submitElementActivity: (element: Element) => void;
}

function MajorElementsViewer({
    elements,
    submitElementActivity,
}: MajorElementsViewerProps) {
    return (
        <div className="major-elements-viewer">
            {elements.map(element => {
                if (!element.is_visible) {
                    return;
                }
                return (
                    <MajorElementViewer
                        key={element.id}
                        icon={element.icon}
                        submitElementActivity={() => submitElementActivity(element)}
                    />
                );
            })}
        </div>
    );
}

export default MajorElementsViewer;
