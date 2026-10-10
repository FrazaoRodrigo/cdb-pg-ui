import { useLanguage } from '../../i18n/LanguageContext'
import './TopBanner.css'
import logo from '../../assets/logo.png';

const LANGUAGES = ['pt', 'en']

// activityId: the activity open in the expanded sheet, named next to the logo
export default function TopBanner({ activityId }) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="top-banner">
      <div className="top-banner__brand">
        {/* Placeholder: swap the SVG for the real logo */}
        <a href="/" className="top-banner__logo" aria-label={t.home}>
          <img src={logo} alt="logo" className="top-banner__logo"/>
        </a>
        {activityId && <span className="top-banner__title">{t.activities[activityId].name}</span>}
      </div>

      <div className="lang-selector" role="group" aria-label={t.language}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            type="button"
            className="lang-selector__btn"
            aria-pressed={language === lang}
            onClick={() => setLanguage(lang)}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  )
}
