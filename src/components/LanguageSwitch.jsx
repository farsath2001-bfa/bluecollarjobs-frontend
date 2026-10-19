import { useEffect, useRef, useState } from "react";
import { FaGlobe } from "react-icons/fa";
import { useLang } from "../context/LanguageContext";
import { LANGUAGES } from "../i18n";

export default function LanguageSwitch() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lang-switch" ref={ref}>
      <button
        type="button"
        className="lang-btn"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${t("nav.language")}: ${current.label}`}
        onClick={() => setOpen((o) => !o)}
      >
        <FaGlobe aria-hidden="true" />
        <span lang={current.code}>{current.short}</span>
      </button>
      {open && (
        <ul className="lang-menu" role="menu">
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={l.code === lang}
                aria-current={l.code === lang ? "true" : undefined}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
              >
                <span lang={l.code} dir={l.dir}>{l.label}</span>
                <span className="lang-code">{l.code.toUpperCase()}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
