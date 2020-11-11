import React from "react";
import ReactDOM, { render } from "react-dom";
import Testing from "./dummy/testing3";
import TimerState from "./Ctx/TimerState";
import Counter from "./Ctx/Timer/Timer";
import App from "./Tracker/App";
// import "./App.css";

render(
  <React.StrictMode>
    {/* <Testing /> */}
    <TimerState>
      <App />
    </TimerState>
  </React.StrictMode>,
  document.getElementById("root")
);
