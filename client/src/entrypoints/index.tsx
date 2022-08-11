import React from 'react';
import ReactDOM from 'react-dom/client';

import App from 'crmet/components/app';

document.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
