import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// PWA
window.__deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (event) => {
  console.log("PWA: beforeinstallprompt พร้อมใช้งาน");

  event.preventDefault();

  window.__deferredPrompt = event;

  window.dispatchEvent(new Event("pwa-install-available"));
});

window.addEventListener("appinstalled", () => {
  console.log("PWA was installed");

  window.__deferredPrompt = null;

  window.dispatchEvent(new Event("pwa-installed"));
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
