import ElementIcon from '../element-icon';

import './style.scss';

interface ElementViewerProps {
    icon: string;
}

function MajorElementViewer({
    icon
}: ElementViewerProps) {
    return (
        <div className='major-element-viewer'>
            <ElementIcon icon={icon} clickable={true} />
        </div>
    );
}

export default MajorElementViewer;
