import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { LoadingProvider } from "./context/LoadingContext";


import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));


root.render(
  <React.StrictMode>
    <LoadingProvider>
      <App />
  </LoadingProvider>
  </React.StrictMode>
);

reportWebVitals();
