// Language setup shared by the context and plain helpers (format.js etc.)
import en from "./en";
import ar from "./ar";
import hi from "./hi";
import ur from "./ur";
import bsLtr from "bootstrap/dist/css/bootstrap.min.css?url";
import bsRtl from "bootstrap/dist/css/bootstrap.rtl.min.css?url";

export const LANGUAGES = [
  { code: "en", label: "English", short: "EN", dir: "ltr" },
  { code: "ar", label: "العربية", short: "ع", dir: "rtl" },
  { code: "hi", label: "हिन्दी", short: "हि", dir: "ltr" },
  { code: "ur", label: "اردو", short: "اُ", dir: "rtl" },
];

const DICTS = { en, ar, hi, ur };
export const LANG_KEY = "jobz.lang";

// Date/number locale per language (Latin digits keep salaries and phone numbers readable)
export const LOCALES = { en: "en-GB", ar: "ar-AE-u-nu-latn", hi: "hi-IN", ur: "ur-PK-u-nu-latn" };

let current = "en";

export function detectLanguage() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && DICTS[saved]) return saved;
  } catch {
    /* storage unavailable */
  }
  const nav = (navigator.language || "en").slice(0, 2);
  return DICTS[nav] ? nav : "en";
}

export function getLanguage() {
  return current;
}

export function translate(key, vars, lang = current) {
  let s = DICTS[lang]?.[key] ?? en[key] ?? key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? vars[k] === 0 ? String(vars[k]) : m));
  return s;
}

// Apply <html lang/dir> and swap the Bootstrap stylesheet (LTR/RTL). Safe to call repeatedly.
export function applyLanguage(lang) {
  current = DICTS[lang] ? lang : "en";
  const meta = LANGUAGES.find((l) => l.code === current);
  const html = document.documentElement;
  html.lang = current;
  html.dir = meta.dir;

  const href = meta.dir === "rtl" ? bsRtl : bsLtr;
  let link = document.getElementById("bootstrap-css");
  if (!link) {
    link = document.createElement("link");
    link.id = "bootstrap-css";
    link.rel = "stylesheet";
    // Prepend so our own stylesheet (index.css) still overrides Bootstrap
    document.head.prepend(link);
  }
  if (link.getAttribute("href") !== href) link.setAttribute("href", href);
  try {
    localStorage.setItem(LANG_KEY, current);
  } catch {
    /* ignore */
  }
  return current;
}
