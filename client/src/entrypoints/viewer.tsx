import RoomViewer from "crmet/components/room-viewer";
import React from "react";
import ReactDOM from "react-dom";

import "crmet/styles/CRMet.scss";

document.addEventListener("DOMContentLoaded", () => {
  const roomId = JSON.parse(document.getElementById("room-id").textContent);

  ReactDOM.render(
    <React.StrictMode>
      <RoomViewer id={roomId} />
    </React.StrictMode>,
    document.getElementById("root")
  );
});
