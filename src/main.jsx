import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/noto-sans-arabic";
import "@fontsource-variable/noto-sans-devanagari";
import "./index.css";
import App from "./App.jsx";
import { applyLanguage, detectLanguage } from "./i18n";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { LanguageProvider } from "./context/LanguageContext";

// Sets <html lang/dir> and loads the LTR or RTL Bootstrap stylesheet before first paint
applyLanguage(detectLanguage());

// Installable app + faster repeat visits (production builds only, so it never caches the dev server)
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  </StrictMode>
);
