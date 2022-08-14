import { getElementIcon } from "crmet/util/element-icon";
import "./style.scss";

interface ElementIconProps {
    icon: string;
    clickable?: boolean;
}

function ElementIcon({
    icon,
    clickable = false,
    ...props
}: ElementIconProps) {
    const imgSrc = getElementIcon(icon);
    const style = ({} as any);
    if (clickable) {
        style.cursor = "pointer";
    }
    const className = clickable ? "element-icon element-icon-clickable" : "element-icon";
    return <img className={className} src={imgSrc} style={style} {...props} />
}

export default ElementIcon;
