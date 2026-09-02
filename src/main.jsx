import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { theme } from "./theme/theme";
import { ArcGenieActivationProvider } from "./context/ArcGenieActivationProvider";
import App from "./App";
import "@fontsource/inter/latin.css";

// There is no real backend yet, so the mock API (MSW) runs by default in
// every environment, including the deployed gh-pages build. Set
// VITE_USE_MOCKS=false once a real API is wired up via VITE_API_BASE_URL.
async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCKS === "false") return;

  const { worker } = await import("./mocks/browser");
  return worker.start({
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    onUnhandledRequest: "bypass",
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <InitColorSchemeScript defaultMode="light" />
      <ThemeProvider theme={theme} defaultMode="light">
        <CssBaseline />
        <HashRouter>
          <ArcGenieActivationProvider>
            <App />
          </ArcGenieActivationProvider>
        </HashRouter>
      </ThemeProvider>
    </React.StrictMode>,
  );
});
