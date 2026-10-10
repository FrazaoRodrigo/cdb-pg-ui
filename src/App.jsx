import { useEffect, useRef, useState } from 'react'
import { LanguageProvider } from './i18n/LanguageProvider'
import { useLanguage } from './i18n/LanguageContext'
import TopBanner from './components/TopBanner/TopBanner'
import BottomSheet from './components/BottomSheet/BottomSheet'
import ContactInfo from './components/ContactInfo/ContactInfo'
import heroImage from './assets/hero-placeholder.png' 
import './App.css'

// Once the sheet opens, the title rises to make room for the description
function Hero({ raised }) {
  const { t } = useLanguage()
  return (
    <main className={`hero${raised ? ' hero--raised' : ''}`}>
      <h1>
        <img src={heroImage} alt={`${t.hero.title} – ${t.hero.subtitle}`} className="hero__image" />
      </h1>
      <div className="hero__description" aria-hidden={!raised}>
        <p>{t.hero.description}</p>
      </div>
    </main>
  )
}

// Pinned to the bottom of the viewport until the sheet expands, which has its own copy.
// Its height is shared as --footer-h so the hero and peeking sheet can make room for it.
function LandingFooter({ visible, onTermsClick }) {
  const ref = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    const observer = new ResizeObserver(([entry]) => {
      root.style.setProperty('--footer-h', `${entry.borderBoxSize[0].blockSize}px`)
    })
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--footer-h')
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`landing-footer${visible ? '' : ' landing-footer--hidden'}`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <ContactInfo onTermsClick={onTermsClick} />
    </div>
  )
}

function App() {
  const [sheetState, setSheetState] = useState('hidden') // 'hidden' | 'peek' | 'expanded'
  const [selectedId, setSelectedId] = useState(null)
  const [termsOpen, setTermsOpen] = useState(false)
  const openActivityId = sheetState === 'expanded' && !termsOpen ? selectedId : null
  return (
    <LanguageProvider defaultLanguage="pt">
      <TopBanner activityId={openActivityId} />
      <Hero raised={sheetState !== 'hidden'} />
      <BottomSheet
        state={sheetState}
        setState={setSheetState}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        termsOpen={termsOpen}
        setTermsOpen={setTermsOpen}
      />
      <LandingFooter
        visible={sheetState !== 'expanded'}
        onTermsClick={() => {
          setTermsOpen(true)
          setSheetState('expanded')
        }}
      />
    </LanguageProvider>
  )
}

export default App
