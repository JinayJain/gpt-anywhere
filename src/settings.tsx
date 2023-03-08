import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";
import Root from "./Root";
import Settings from "./pages/Settings";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root>
      <Settings />
    </Root>
  </React.StrictMode>
);
