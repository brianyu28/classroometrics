import React from "react";
import ReactDOM from "react-dom";

import "crmet/styles/CRMet.scss";
import RoomManager from "crmet/components/room-manager";
import { BrowserRouter, Route, Routes } from "react-router-dom";

document.addEventListener("DOMContentLoaded", () => {
  const roomIdentifier = JSON.parse(
    document.getElementById("room-identifier").textContent
  );

  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route
            path="*"
            element={<RoomManager roomId={roomIdentifier} embedView={true} />}
          />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
  );
});
