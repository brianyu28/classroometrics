import { ElementActivity } from "crmet/data/ElementActivity";
import { getElementIcon } from "crmet/util/element-icon";
import "./style.scss";

interface RoomActivityProps {
    elementActivity: ElementActivity[];
}

function RoomActivity({
    elementActivity,
}: RoomActivityProps) {
    return (
        <svg className="room-activity" viewBox="0 0 100 100">
            {
                elementActivity.map(activity =>
                    <circle key={activity.timestamp} cx={50} cy={20} r={15} fill="red"/> // TODO: use the actual icon
                )
            }
        </svg>
    );
}

export default RoomActivity;
