import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
const root = ReactDOM.createRoot(document.getElementById("root"));

// force the bulma light theme : edit the index.html directly doesn't work :(
function forceLightTheme() {
  const htmlElements = document.getElementsByTagName("html")
  if(htmlElements.length > 0) {
    htmlElements[0].setAttribute("data-theme", "light");
  }
}

forceLightTheme();

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
