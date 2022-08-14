import { Room } from "crmet/data/Room";
import ElementGroupEditor from "../element-group-editor";

import "./style.scss";

interface RoomEditorProps {
    room: Room;
    updateVisibilityForElement: (elementId: number, isVisible: boolean) => void;
}

function RoomEditor({
    room,
    updateVisibilityForElement,
}: RoomEditorProps) {
    return (
        <div className="room-editor">
            {room.groups.map((group, group_number) => (
                <ElementGroupEditor
                    key={group_number}
                    group={group}
                    updateVisibilityForElement={updateVisibilityForElement}
                />
            ))}
        </div>
    );
}

export default RoomEditor;
