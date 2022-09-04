import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import { getRoomForStudent } from "crmet/api/RoomClient";
import { getStudentWebsocketURL } from "crmet/api/WebsocketClient";
import { Element, Room } from "crmet/data/Room";
import { Error } from "crmet/data/Error";
import MajorElementsViewer from "crmet/components/major-elements-viewer";
import MinorElementsViewer from "crmet/components/minor-elements-viewer";
import QuestionPrompt from "crmet/components/question-prompt";

interface RoomViewerProps {
  id: number | null;
}

function RoomViewer({ id }: RoomViewerProps) {
  const [room, setRoom] = useState<Room | null>(null);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    getStudentWebsocketURL(id)
  );

  useEffect(() => {
    if (lastJsonMessage === null) {
      return;
    }
    if ((lastJsonMessage as any).type === "event_room_update") {
      setRoom((lastJsonMessage as any).room);
    }
  }, [lastJsonMessage]);

  const submitElementActivity = (element: Element) => {
    sendJsonMessage({
      type: "event_element_activity",
      element: element as any,
    });
  };

  const submitQuestion = (question: string) => {
    sendJsonMessage({
      type: "event_question",
      question: question as any,
    });
  };

  const reloadRoom = () => {
    if (id === null) {
      return;
    }

    getRoomForStudent(id)
      .then((res) => res.json())
      .then((data: Room | Error) => {
        if ("error" in data) {
          console.log(data.error);
          return;
        }
        setRoom(data);
      });
  };

  useEffect(reloadRoom, [id]);

  if (readyState === ReadyState.CLOSED) {
    return (
      <div>
        <p>Connection closed. Refresh this page to continue.</p>
      </div>
    );
  }

  if (id === null) {
    return (
      <div>
        <p>The room you requested does not exist.</p>
        <p>
          <a href="/">
            <button>Go Back</button>
          </a>
        </p>
      </div>
    );
  }

  if (room === null) {
    return <div></div>;
  }

  return (
    <div>
      {room.groups.length > 0 && (
        <MajorElementsViewer
          elements={room.groups[0]}
          submitElementActivity={submitElementActivity}
        />
      )}
      {room.groups.length > 1 &&
        room.groups
          .slice(1)
          .map((group, i) => (
            <MinorElementsViewer
              key={i}
              elements={group}
              submitElementActivity={submitElementActivity}
            />
          ))}
      {room.questions_enabled && (
        <QuestionPrompt submitQuestion={submitQuestion} />
      )}
    </div>
  );
}

export default RoomViewer;
