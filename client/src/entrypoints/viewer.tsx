import RoomViewer from 'crmet/components/room-viewer';
import React from 'react';
import ReactDOM from 'react-dom/client';

import 'crmet/styles/CRMet.scss';

document.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  const identifier = JSON.parse(document.getElementById('room-identifier').textContent);

  root.render(
    <React.StrictMode>
      <RoomViewer identifier={identifier} />
    </React.StrictMode>
  );
});
