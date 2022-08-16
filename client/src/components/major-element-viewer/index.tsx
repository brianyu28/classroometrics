import ElementIcon from '../element-icon';

import './style.scss';

interface ElementViewerProps {
    icon: string;
    link: string;
    submitElementActivity: () => void;
}

function MajorElementViewer({
    icon,
    link,
    submitElementActivity,
}: ElementViewerProps) {

    const handleClick = () => {
        submitElementActivity();
        if (link !== "") {
            window.open(link, "_blank");
        }
    }

    return (
        <div className='major-element-viewer' onClick={handleClick}>
            <ElementIcon icon={icon} clickable={true} />
        </div>
    );
}

export default MajorElementViewer;
