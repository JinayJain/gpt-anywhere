import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./Root";
import SignIn from "./pages/SignIn";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root>
      <SignIn />
    </Root>
  </React.StrictMode>
);
