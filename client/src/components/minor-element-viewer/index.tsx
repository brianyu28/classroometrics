import ElementIcon from "../element-icon";

import "./style.scss";

interface MinorElementViewerProps {
    clickable: boolean;
    icon: string;
    name: string;
    submitElementActivity: () => void;
}

function MinorElementViewer({
    clickable,
    icon,
    name,
    submitElementActivity,
}: MinorElementViewerProps) {
    const style = ({} as any);
    if (clickable) {
        style.cursor = "pointer";
    }
    const className = clickable ? "minor-element-viewer minor-element-viewer-clickable" : "minor-element-viewer";

    return (
        <div className={className} style={style} onClick={submitElementActivity}>
            <ElementIcon icon={icon} clickable={false} />
            <div>
                {name}
            </div>
        </div>
    );
}

export default MinorElementViewer;
