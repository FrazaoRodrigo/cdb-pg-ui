import { useEffect, useRef } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { activities } from '../../domain/activities'
import ContactInfo from '../ContactInfo/ContactInfo'
import './BottomSheet.css'

const WHEEL_THRESHOLD = 10
const TOUCH_THRESHOLD = 30
const COOLDOWN_MS = 600
const DOWN_KEYS = ['ArrowDown', 'PageDown', ' ', 'End']
const UP_KEYS = ['ArrowUp', 'PageUp', 'Home']

/**
 * Hidden on load. The first downward scroll gesture reveals it at 1/3 of the
 * viewport height, showing the activity images; the page itself never scrolls
 * further. Clicking an image expands the sheet to full height with that
 * activity's details; the arrow button, shown only then, collapses it back.
 * Scrolling up while peeking hides it again.
 */
export default function BottomSheet({
  state,
  setState,
  selectedId,
  setSelectedId,
  termsOpen,
  setTermsOpen,
}) {
  const { t } = useLanguage()
  const sheetRef = useRef(null)
  const bodyRef = useRef(null)
  const stateRef = useRef(state)
  const lastChange = useRef(0)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  // Lock page scroll: the sheet is the only thing that moves
  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const move = (direction) => {
      const now = Date.now()
      if (now - lastChange.current < COOLDOWN_MS) return
      const current = stateRef.current
      if (direction === 'down' && current === 'hidden') setState('peek')
      else if (direction === 'up' && current === 'peek') setState('hidden')
      else return
      lastChange.current = now
    }

    // Let the expanded sheet scroll its own content
    const insideExpanded = (target) =>
      stateRef.current === 'expanded' && sheetRef.current?.contains(target)

    const onWheel = (e) => {
      if (insideExpanded(e.target)) return
      // Let the activity strip scroll horizontally
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      e.preventDefault()
      if (e.deltaY > WHEEL_THRESHOLD) move('down')
      else if (e.deltaY < -WHEEL_THRESHOLD) move('up')
    }

    let touchStartX = null
    let touchStartY = null
    const onTouchStart = (e) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }
    const onTouchMove = (e) => {
      if (insideExpanded(e.target)) return
      if (touchStartY === null) return
      // Let the activity strip be swiped horizontally
      const deltaX = touchStartX - e.touches[0].clientX
      const delta = touchStartY - e.touches[0].clientY
      if (Math.abs(deltaX) > Math.abs(delta)) return
      e.preventDefault()
      if (Math.abs(delta) < TOUCH_THRESHOLD) return
      move(delta > 0 ? 'down' : 'up')
      touchStartY = null
    }

    const onKeyDown = (e) => {
      if (e.target.closest?.('input, textarea, select, [contenteditable]')) return
      if (insideExpanded(e.target)) return
      // Space activates focused buttons (activity images, collapse)
      if (e.key === ' ' && e.target.closest?.('button')) return
      if (DOWN_KEYS.includes(e.key)) {
        e.preventDefault()
        move('down')
      } else if (UP_KEYS.includes(e.key)) {
        e.preventDefault()
        move('up')
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [setState])

  // Start each opened activity, and the terms, at the top
  useEffect(() => {
    bodyRef.current?.scrollTo(0, 0)
  }, [selectedId, termsOpen])

  const expanded = state === 'expanded'
  const selected = expanded ? activities.find((a) => a.id === selectedId) : null
  const showTerms = expanded && termsOpen

  const collapse = () => {
    lastChange.current = Date.now()
    setSelectedId(null)
    setTermsOpen(false)
    setState('peek')
  }

  // From the terms, go back to whatever was open before them
  const back = () => {
    if (showTerms) setTermsOpen(false)
    else setSelectedId(null)
  }

  const openActivity = (e) => {
    lastChange.current = Date.now()
    setSelectedId(e.currentTarget.dataset.id)
    setState('expanded')
  }

  return (
    <section
      ref={sheetRef}
      className={`bottom-sheet bottom-sheet--${state}`}
      aria-hidden={state === 'hidden'}
      inert={state === 'hidden'}
      aria-label={t.sheet.title}
    >
      <div className="bottom-sheet__header">
        {/* With an activity open its name shows in the top banner instead */}
        {selected || showTerms ? (
          <button type="button" className="bottom-sheet__back" onClick={back}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M15 6l-6 6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t.sheet.back}
          </button>
        ) : (
          <div className="bottom-sheet__heading">
            <p className="bottom-sheet__teaser">{t.sheet.teaser}</p>
          </div>
        )}
        {expanded && (
          <button
            type="button"
            className="bottom-sheet__collapse"
            aria-label={t.sheet.collapse}
            onClick={collapse}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="bottom-sheet__body" ref={bodyRef}>
        {showTerms ? (
          <Terms />
        ) : selected ? (
          <ActivityDetail activity={selected} />
        ) : (
          <ul className="activity-strip">
            {activities.map(({ id, image }) => (
              <li key={id}>
                <button type="button" className="activity-card" data-id={id} onClick={openActivity}>
                  <img src={image} alt="" className="activity-card__image" />
                  <span className="activity-card__name">{t.activities[id].name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {expanded && <ContactInfo onTermsClick={() => setTermsOpen(true)} />}
      </div>
    </section>
  )
}

function ActivityDetail({ activity }) {
  const { t } = useLanguage()
  const text = t.activities[activity.id]
  return (
    <article className="activity-detail">
      <p>{text.description}</p>
      <img src={activity.image} alt="" className="activity-detail__image" />
      {(activity.prices || activity.lessons) && (
        <section>
          {activity.prices && <PriceTable rows={activity.prices} text={text.prices} />}
          {activity.lessons && <LessonTable groups={activity.lessons} text={text.lessons} />}
        </section>
      )}
    </article>
  )
}

// The note, when there is one, explains the prices: their headers are marked with *
function PriceTable({ rows, text }) {
  const mark = text.note ? '*' : ''
  return (
    <>
      <table className="price-table">
        <thead>
          <tr>
            <th scope="col">{text.activity}</th>
            <th scope="col">
              {text.lowSeason}
              {mark}
            </th>
            <th scope="col">
              {text.highSeason}
              {mark}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ id, lowSeason, highSeason }) => (
            <tr key={id}>
              <th scope="row">{text.rows[id]}</th>
              {lowSeason ? (
                <>
                  <td>{lowSeason}</td>
                  <td>{highSeason}</td>
                </>
              ) : (
                <td colSpan={2}>{text.onRequest}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {text.note && <p className="price-table__note">* {text.note}</p>}
    </>
  )
}

// The first group's title heads the table; later groups get a title row of their own.
// As with PriceTable, a note is referenced by a * on the price header.
function LessonTable({ groups, text }) {
  const [first, ...rest] = groups
  const mark = text.note ? '*' : ''
  const rows = (group) =>
    group.rows.map(({ id, price }) => (
      <tr key={id}>
        <th scope="row">{text.rows[id]}</th>
        <td>{price}</td>
      </tr>
    ))
  return (
    <>
      <table className="price-table">
        <thead>
          <tr>
            <th scope="col">{text.groups[first.id]}</th>
            <th scope="col">
              {text.period}
              {mark}
            </th>
          </tr>
        </thead>
        <tbody>{rows(first)}</tbody>
        {rest.map((group) => (
          <tbody key={group.id}>
            <tr className="price-table__group">
              <th scope="colgroup" colSpan={2}>
                {text.groups[group.id]}
              </th>
            </tr>
            {rows(group)}
          </tbody>
        ))}
      </table>
      {text.note && <p className="price-table__note">* {text.note}</p>}
    </>
  )
}

function Terms() {
  const { t } = useLanguage()
  return (
    <article className="terms">
      <h2 className="terms__title">{t.terms.title}</h2>
      {t.terms.body.map((paragraph, i) => (
        <p key={i} className="terms__text">{paragraph}</p>
      ))}
    </article>
  )
}
