"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type Language, type TranslationKey, translations } from "./translations"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
}

// Change the default language from "en" to "pt-BR" in the defaultContextValue
const defaultContextValue: LanguageContextType = {
  language: "pt-BR",
  setLanguage: () => {},
  t: (key) => key as string,
}

const LanguageContext = createContext<LanguageContextType>(defaultContextValue)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Update the initial state in the LanguageProvider component
  const [language, setLanguageState] = useState<Language>("pt-BR")
  // Add a mounted state to prevent hydration issues
  const [mounted, setMounted] = useState(false)

  // Update the useEffect to prioritize pt-BR as default
  useEffect(() => {
    setMounted(true)
    // Load language preference from localStorage
    try {
      const savedLanguage = localStorage.getItem("language") as Language
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "pt-BR")) {
        setLanguageState(savedLanguage)
      } else {
        // Default to Brazilian Portuguese instead of detecting browser language
        setLanguageState("pt-BR")
      }
    } catch (error) {
      console.error("Error loading language preference:", error)
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    try {
      localStorage.setItem("language", newLanguage)
    } catch (error) {
      console.error("Error saving language preference:", error)
    }
  }

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key
  }

  const contextValue = {
    language,
    setLanguage,
    t,
  }

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  return context
}
