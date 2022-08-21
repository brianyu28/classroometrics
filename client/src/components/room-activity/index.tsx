import { useHotkeys } from "react-hotkeys-hook";

import { ElementActivity } from "crmet/data/ElementActivity";
import { getElementIcon } from "crmet/util/element-icon";

import "./style.scss";
import QuestionManager from "../question-manager";

interface RoomActivityProps {
    elementActivity: ElementActivity[];
    questions: string[];
    questionsEnabled: boolean;
    questionsVisible: boolean;
    toggleQuestionsVisible: () => void;
    removeQuestionAtIndex: (index: number) => void;
    toggleIsShowingActivityView: () => void;
}

function RoomActivity({
    elementActivity,
    questions,
    questionsEnabled,
    questionsVisible,
    toggleQuestionsVisible,
    removeQuestionAtIndex,
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
                questionsVisible &&
                <QuestionManager
                    questions={questions}
                    questionsEnabled={questionsEnabled}
                    removeQuestionAtIndex={removeQuestionAtIndex}
                />
            }
             <div className="room-activity-elements" onClick={toggleIsShowingActivityView}>
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
        </div>

    );
}

export default RoomActivity;
