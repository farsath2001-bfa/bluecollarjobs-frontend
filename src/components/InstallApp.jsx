import { useEffect, useState } from "react";
import { FaMobileAlt } from "react-icons/fa";
import { useT } from "../context/LanguageContext";

// Chrome/Edge/Android fire "beforeinstallprompt" when the site can be installed.
// We keep the event and show our own button; iPhone users use Share → Add to Home Screen instead.
let deferred = null;
const listeners = new Set();
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    listeners.forEach((fn) => fn(true));
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    listeners.forEach((fn) => fn(false));
  });
}

export default function InstallApp({ className = "" }) {
  const t = useT();
  const [available, setAvailable] = useState(Boolean(deferred));

  useEffect(() => {
    listeners.add(setAvailable);
    return () => listeners.delete(setAvailable);
  }, []);

  if (!available) return null;

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice.catch(() => {});
    deferred = null;
    setAvailable(false);
  };

  return (
    <button type="button" className={`btn btn-install ${className}`} onClick={install}>
      <FaMobileAlt aria-hidden="true" /> {t("footer.install")}
    </button>
  );
}
