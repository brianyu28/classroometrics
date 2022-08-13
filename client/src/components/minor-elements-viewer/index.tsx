import { Element } from "crmet/data/Room";
import MinorElementViewer from "../minor-element-viewer";

import './style.scss';

interface MinorElementsViewerProps {
    elements: Element[];
}

function MinorElementsViewer({
    elements
}: MinorElementsViewerProps) {
    return (
        <div className='minor-elements-viewer'>
            {elements.map(element => {
                if (!element.is_visible) {
                    return;
                }
                return (
                    <MinorElementViewer
                        key={element.id}
                        clickable={true}
                        icon={element.icon}
                        name={element.name}
                    />
                );
            })}
        </div>
    );
}

export default MinorElementsViewer;
