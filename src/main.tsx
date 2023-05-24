import React from "react";
import ReactDOM from "react-dom/client";
import Prompt from "./pages/Prompt";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import Root from "./Root";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root>
      <Prompt />
      {/* <SignIn /> */}
      {/* <Settings /> */}
    </Root>
  </React.StrictMode>
);
