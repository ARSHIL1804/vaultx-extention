import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";


import "./index.css";
import "./lib/i18n.ts"

const root = document.createElement("div");
root.classList.add('bg-white')
document.body.appendChild(root);
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <App />
);
