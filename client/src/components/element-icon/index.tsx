import CompletionNo from "crmet/assets/elements/completion.no.svg";
import CompletionYes from "crmet/assets/elements/completion.yes.svg";
import Link from "crmet/assets/elements/link.svg";
import NotFound from "crmet/assets/elements/not_found.svg";
import PaceFaster from "crmet/assets/elements/pace.faster.svg";
import PaceSlower from "crmet/assets/elements/pace.slower.svg";
import SentimentNegative from "crmet/assets/elements/sentiment.negative.svg";
import SentimentNeutral from "crmet/assets/elements/sentiment.neutral.svg";
import SentimentPositive from "crmet/assets/elements/sentiment.positive.svg";

const iconMap = {
    "completion.no": CompletionNo,
    "completion.yes": CompletionYes,
    "link": Link,
    "pace.faster": PaceFaster,
    "pace.slower": PaceSlower,
    "sentiment.negative": SentimentNegative,
    "sentiment.neutral": SentimentNeutral,
    "sentiment.positive": SentimentPositive,
}

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
    const imgSrc = icon in iconMap ? (iconMap as any)[icon] : NotFound;
    const style = ({} as any);
    if (clickable) {
        style.cursor = "pointer";
    }
    const className = clickable ? "element-icon element-icon-clickable" : "element-icon";
    return <img className={className} src={imgSrc} style={style} {...props} />
}

export default ElementIcon;
