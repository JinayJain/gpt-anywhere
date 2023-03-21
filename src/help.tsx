import React from "react";
import ReactDOM from "react-dom/client";
import Help from "./pages/Help";
import Root from "./Root";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root>
      <Help />
    </Root>
  </React.StrictMode>
);
