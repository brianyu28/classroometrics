import ElementIcon from "../element-icon";

import "./style.scss";

interface MinorElementViewerProps {
    clickable: boolean;
    icon: string;
    name: string;
    link: string;
    submitElementActivity: () => void;
}

function MinorElementViewer({
    clickable,
    icon,
    name,
    link,
    submitElementActivity,
}: MinorElementViewerProps) {
    const style = ({} as any);
    if (clickable) {
        style.cursor = "pointer";
    }
    const className = clickable ? "minor-element-viewer minor-element-viewer-clickable" : "minor-element-viewer";

    const handleClick = () => {
        submitElementActivity();
        if (link !== "") {
            window.open(link, "_blank");
        }
    }

    return (
        <div className={className} style={style} onClick={handleClick}>
            <ElementIcon icon={icon} clickable={false} />
            <div>
                {name}
            </div>
        </div>
    );
}

export default MinorElementViewer;
