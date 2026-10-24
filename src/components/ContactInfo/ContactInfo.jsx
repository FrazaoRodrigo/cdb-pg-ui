import { useLanguage } from '../../i18n/LanguageContext'
import { contact } from '../../domain/contact'
import './ContactInfo.css'

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' }

// The social links are shown only when `social` is set, the email and phone
// only when `reach` is set, and the terms link only when onTermsClick is given
export default function ContactInfo({ social = false, reach = true, onTermsClick }) {
  const { t } = useLanguage()
  return (
    <footer className="contact-info">
      {social && (
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
      )}

      <address className="contact-info__address">
        {/* Beside the email and phone, the map link goes below the address */}
        <span className={`contact-info__location${reach ? ' contact-info__location--stacked' : ''}`}>
          {/* On narrow screens the address itself is the maps link */}
          <a href={contact.mapsUrl} className="contact-info__place" title={contact.address} {...EXTERNAL}>
            {contact.address}
          </a>
          <a href={contact.mapsUrl} className="contact-info__maps" {...EXTERNAL}>
            {t.contact.maps}
          </a>
        </span>
        {/* Email with the WhatsApp number below it */}
        {reach && (
          <span className="contact-info__reach">
            <a href={`mailto:${contact.email}`} className="contact-info__email" title={contact.email}>
              {contact.email}
            </a>
            <span className="contact-info__phone">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                role="img"
                aria-label={t.contact.whatsapp}
                className="contact-info__whatsapp"
              >
                <path
                  d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.2 7.8c-.3 0-.6.1-.8.4-.4.4-.8 1-.8 1.9 0 1.2.8 2.4 1 2.6.1.2 1.7 2.7 4.2 3.6 2 .8 2.5.6 2.9.6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.2-.7-.6-1.2-1.4-1.3-1.7-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-1.8c-.1-.3-.3-.4-.5-.4h-.4z"
                  fill="currentColor"
                />
              </svg>
              {contact.phone}
            </span>
          </span>
        )}
      </address>

      {onTermsClick && (
        <button type="button" className="contact-info__terms" onClick={onTermsClick}>
          {t.contact.terms}
        </button>
      )}
    </footer>
  )
}
