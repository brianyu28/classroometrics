import { useHotkeys } from "react-hotkeys-hook";

import { ElementActivity } from "crmet/data/ElementActivity";
import { getElementIcon } from "crmet/util/element-icon";

import "./style.scss";

interface RoomActivityProps {
    elementActivity: ElementActivity[];
    toggleIsShowingActivityView: () => void;
}

function RoomActivity({
    elementActivity,
    toggleIsShowingActivityView,
}: RoomActivityProps) {

    // Use 'Escape' to get out of room activity view
    useHotkeys('esc', toggleIsShowingActivityView);

    const getActivityStyle = (activity: ElementActivity) => ({
        height: '50px',
        width: '50px',
        position: 'absolute',
        top: `${Number(95 * activity.y).toFixed(2)}%`,
        left: `${Number(95 * activity.x).toFixed(2)}%`,
    });

    return (
        <div className="room-activity">
            {
                elementActivity.map(activity =>
                    <img
                        key={activity.timestamp}
                        src={getElementIcon(activity.element.icon)}
                        style={getActivityStyle(activity) as any}
                    />
                )
            }
        </div>
    );
}

export default RoomActivity;
