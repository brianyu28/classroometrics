import ElementIcon from '../element-icon';

import './style.scss';

interface ElementViewerProps {
    icon: string;
    submitElementActivity: () => void;
}

function MajorElementViewer({
    icon,
    submitElementActivity,
}: ElementViewerProps) {
    return (
        <div className='major-element-viewer' onClick={submitElementActivity}>
            <ElementIcon icon={icon} clickable={true} />
        </div>
    );
}

export default MajorElementViewer;
