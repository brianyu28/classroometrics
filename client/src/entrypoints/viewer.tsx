import RoomViewer from 'crmet/components/room-viewer';
import React from 'react';
import ReactDOM from 'react-dom/client';

import 'crmet/styles/CRMet.scss';

document.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  const roomId = JSON.parse(document.getElementById('room-id').textContent);

  root.render(
    <React.StrictMode>
      <RoomViewer id={roomId} />
    </React.StrictMode>
  );
});
