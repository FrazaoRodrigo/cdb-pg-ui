import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { LanguageProvider } from './i18n/LanguageProvider'
import { useLanguage } from './i18n/LanguageContext'
import TopBanner from './components/TopBanner/TopBanner'
import BottomSheet from './components/BottomSheet/BottomSheet'
import ContactInfo from './components/ContactInfo/ContactInfo'
import heroImage from './assets/hero-placeholder.png' 
import introVideo from './assets/video.mp4'
import './App.css'

// Plays once on load, filling the hero, with the title image in the top right
// corner; when it ends the image moves back to the center. Skipped when motion
// is reduced, and if it cannot play.
const skipIntro = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Once the sheet opens, the title rises to make room for the description
function Hero({ raised }) {
  const { t } = useLanguage()
  const videoRef = useRef(null)
  const imageRef = useRef(null)
  const cornerRect = useRef(null)
  const [introDone, setIntroDone] = useState(skipIntro)

  // Remember where the image was, to animate it from there to the center
  const finishIntro = () => {
    cornerRect.current = imageRef.current?.getBoundingClientRect()
    setIntroDone(true)
  }

  useLayoutEffect(() => {
    const from = cornerRect.current
    if (!introDone || !from) return
    cornerRect.current = null
    const to = imageRef.current.getBoundingClientRect()
    imageRef.current.animate(
      [
        {
          transformOrigin: 'top left',
          transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})`,
        },
        { transformOrigin: 'top left', transform: 'none' },
      ],
      { duration: 900, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    )
  }, [introDone])

  // Started here rather than with autoPlay, so a blocked autoplay shows the image
  useEffect(() => {
    if (skipIntro()) return
    videoRef.current.play().catch(() => setIntroDone(true))
  }, [])

  return (
    <main className={`hero${raised ? ' hero--raised' : ''}${introDone ? '' : ' hero--intro'}`}>
      <video
        ref={videoRef}
        src={introVideo}
        className="hero__video"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onEnded={finishIntro}
        onError={finishIntro}
      />
      <h1>
        <img ref={imageRef} src={heroImage} alt={`${t.hero.title} – ${t.hero.subtitle}`} className="hero__image" />
      </h1>
      <div className="hero__description" aria-hidden={!raised}>
        {t.hero.description.map((paragraph, i) => (
        <p key={i} >{paragraph}</p>
      ))}
      </div>
    </main>
  )
}

// Pinned to the bottom of the viewport until the sheet expands, which has its own copy.
// Its height is shared as --footer-h so the hero and peeking sheet can make room for it.
function LandingFooter({ visible }) {
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
      <ContactInfo reach={false} />
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
      <LandingFooter visible={sheetState !== 'expanded'} />
    </LanguageProvider>
  )
}

export default App
