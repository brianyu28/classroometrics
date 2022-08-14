import CompletionNo from "crmet/assets/elements/completion.no.svg";
import CompletionYes from "crmet/assets/elements/completion.yes.svg";
import Link from "crmet/assets/elements/link.svg";
import NotFound from "crmet/assets/elements/not_found.svg";
import PaceFaster from "crmet/assets/elements/pace.faster.svg";
import PaceSlower from "crmet/assets/elements/pace.slower.svg";
import SentimentNegative from "crmet/assets/elements/sentiment.negative.svg";
import SentimentNeutral from "crmet/assets/elements/sentiment.neutral.svg";
import SentimentPositive from "crmet/assets/elements/sentiment.positive.svg";

export const elementIcons = {
    "completion.no": CompletionNo,
    "completion.yes": CompletionYes,
    "link": Link,
    "pace.faster": PaceFaster,
    "pace.slower": PaceSlower,
    "sentiment.negative": SentimentNegative,
    "sentiment.neutral": SentimentNeutral,
    "sentiment.positive": SentimentPositive,
}

/**
 * Get SVG image source from the name of an icon.
 */
export const getElementIcon = (name: string) => {
    return name in elementIcons ? (elementIcons as any)[name] : NotFound;
}
