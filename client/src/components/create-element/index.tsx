import { Element } from "crmet/data/Room";
import { elementIcons } from "crmet/util/element-icon";
import { useBooleanState, useInputFieldState } from "crmet/util/hooks";
import React, { useState } from "react";

import "./style.scss";

interface CreateElementProps {
    roomId: number;
    groupIndex: number;
    onAddElement: (element: Element) => void;
    toggleCreateRoomViewOpen: () => void;
}

function CreateElement({
    roomId,
    groupIndex,
    onAddElement: addElement,
    toggleCreateRoomViewOpen,
}: CreateElementProps) {

    const [icon, setIcon, updateIcon] = useInputFieldState("link");
    const [name, setName, updateName] = useInputFieldState("");
    const [link, setLink, updateLink] = useInputFieldState("");
    const [isVisible, toggleIsVisible] = useBooleanState(true);

    const submitCreateElementForm = (event: React.FormEvent) => {
        event.stopPropagation();
        const element = {
            room_id: roomId,
            icon,
            name,
            section: groupIndex,
            order: 0, // Unused, will be overriden based on ordering in group array
            is_visible: isVisible,
            link,
        }
        addElement(element);
        return false;
    };

    return (
        <div>
            <h2>Create Element</h2>
            <form className="create-element-form" onSubmit={submitCreateElementForm}>
                <div className="form-inputs">
                    <label htmlFor="icon">Icon</label>
                    <select name="icon" value={icon} onChange={updateIcon}>
                        {Object.keys(elementIcons).map(elementIcon => (
                            <option key={elementIcon} value={elementIcon}>{elementIcon}</option>
                        ))}
                        <option key="none" value="none">none</option>
                    </select>

                    <label htmlFor="name">Name</label>
                    <input autoFocus={true} type="text" value={name} onChange={updateName} />

                    <label htmlFor="link">Link (optional)</label>
                    <input type="text" value={link} onChange={updateLink} />

                    <label htmlFor="is_visible">Visible?</label>
                    <input type="checkbox" checked={isVisible} onChange={toggleIsVisible} />
                </div>
                <div>
                    <button onClick={toggleCreateRoomViewOpen}>Cancel</button>
                    <input type="submit" value="Create" />
                </div>
            </form>
        </div>
    );
}

export default CreateElement;
