import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { LANGUAGES, applyLanguage, getLanguage, translate } from "../i18n";

const LanguageContext = createContext({
  lang: "en",
  dir: "ltr",
  setLang: () => {},
  t: (k, v) => translate(k, v, "en"),
});

export function LanguageProvider({ children }) {
  // main.jsx already applied the starting language before the first render
  const [lang, setLangState] = useState(getLanguage);

  const setLang = useCallback((code) => {
    setLangState(applyLanguage(code));
  }, []);

  const value = useMemo(() => {
    const dir = LANGUAGES.find((l) => l.code === lang)?.dir || "ltr";
    return { lang, dir, setLang, t: (key, vars) => translate(key, vars, lang) };
  }, [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLang = () => useContext(LanguageContext);
// eslint-disable-next-line react-refresh/only-export-components
export const useT = () => useContext(LanguageContext).t;
