import { useLanguage } from '../../i18n/LanguageContext'
import { contact } from '../../domain/contact'
import './ContactInfo.css'

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' }

export default function ContactInfo({ onTermsClick }) {
  const { t } = useLanguage()
  return (
    <footer className="contact-info">
      <div className="contact-info__social">
        <a href={contact.facebook} aria-label={t.contact.facebook} {...EXTERNAL}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a href={contact.instagram} aria-label={t.contact.instagram} {...EXTERNAL}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
          </svg>
        </a>
      </div>

      <address className="contact-info__address">
        <span>{contact.address}</span>
        <a href={contact.mapsUrl} {...EXTERNAL}>
          {t.contact.maps}
        </a>
      </address>

      <button type="button" className="contact-info__terms" onClick={onTermsClick}>
        {t.contact.terms}
      </button>
    </footer>
  )
}
