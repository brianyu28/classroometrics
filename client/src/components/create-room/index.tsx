import { useNavigate } from "react-router-dom";

import { createRoom } from "crmet/api/RoomClient";
import { Room } from "crmet/data/Room";
import { Error } from "crmet/data/Error";
import { useInputFieldState } from "crmet/util/hooks";

function CreateRoom() {
  const [identifier, _setIdentifier, updateIdentifier] = useInputFieldState("");
  const [title, _setTitle, updateTitle] = useInputFieldState("");
  const navigate = useNavigate();

  const createNewRoom = (event: React.FormEvent) => {
    event.preventDefault();
    if (identifier === "") {
      return;
    }

    createRoom(identifier, title)
      .then((res) => res.json())
      .then((data: Room | Error) => {
        if ("error" in data) {
          console.log(data.error);
        } else {
          navigate(`/app/rooms/${data.identifier}`);
        }
      });
    return false;
  };

  const canSubmitCreateRoomForm: boolean = identifier !== "" && title !== "";

  return (
    <div>
      <h2>Create a New Room</h2>
      <form onSubmit={createNewRoom}>
        <input
          type="text"
          value={identifier}
          onChange={updateIdentifier}
          placeholder="Identifier"
        />
        <input
          type="text"
          value={title}
          onChange={updateTitle}
          placeholder="Title"
        />
        <input
          disabled={!canSubmitCreateRoomForm}
          type="submit"
          value="Create"
        />
      </form>
    </div>
  );
}

export default CreateRoom;
