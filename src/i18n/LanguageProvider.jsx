import { useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './LanguageContext'
import { translations } from './translations'

export function LanguageProvider({ defaultLanguage = 'pt', children }) {
  const [language, setLanguage] = useState(defaultLanguage)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const value = useMemo(
    () => ({ language, setLanguage, t: translations[language] }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
