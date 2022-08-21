import React from "react";
import ReactDOM from "react-dom";

import Router from "crmet/components/router";

import "crmet/styles/CRMet.scss";

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <React.StrictMode>
      <Router />
    </React.StrictMode>,
    document.getElementById("root")
  );
});
