import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("anime_language") || "EN";
  });

  useEffect(() => {
    localStorage.setItem("anime_language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === "EN" ? "JP" : "EN"));
  };

  const setEN = () => setLanguage("EN");
  const setJP = () => setLanguage("JP");

  const getTitle = (titleObj) => {
    if (!titleObj) return "Unknown Title";
    if (language === "EN") {
      return titleObj.english || titleObj.romaji || titleObj.native || "Unknown Title";
    } else {
      // JP toggle now prioritizes Romaji (Japenglish) instead of Pure Japanese characters
      return titleObj.romaji || titleObj.english || titleObj.native || "Unknown Title";
    }
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setEN, setJP, getTitle }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  return useContext(LanguageContext);
}
