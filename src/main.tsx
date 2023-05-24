import React from "react";
import ReactDOM from "react-dom/client";
import Prompt from "./pages/Prompt";
import Root from "./Root";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root>
      <Prompt />
    </Root>
  </React.StrictMode>
);
