// Placeholder images: replace with the real activity photos
import oliveOil from '../assets/activities/olive-oil.jpg'
import equestrian from '../assets/activities/equestrian.png'
import hunting from '../assets/activities/hunting.svg'
import countryHouse from '../assets/activities/country-house.svg'

/**
 * Activities shown in the bottom sheet. Text (name, description) lives in
 * translations under `activities[id]`.
 *
 * `prices` rows are shown as a table below the activity image; row labels are
 * translated under `activities[id].prices.rows[row.id]`. A row without
 * `lowSeason`/`highSeason` is priced on request.
 *
 * `lessons` groups are shown as a second table below it, one group after the
 * other; titles and row labels are translated under
 * `activities[id].lessons.groups[group.id]` and `.rows[row.id]`.
 */
export const activities = [
  { id: 'olive-oil', image: oliveOil },
  {
    id: 'equestrian',
    image: equestrian,
    prices: [
      { id: 'short', lowSeason: '30 €', highSeason: '35 €' },
      { id: 'medium', lowSeason: '45 €', highSeason: '55 €' },
      { id: 'long', lowSeason: '105 €', highSeason: '125 €' },
      { id: 'groups' },
    ],
    lessons: [
      {
        id: 'flexible',
        rows: [
          { id: 'first', price: '30 €' },
          { id: 'second', price: '20 €' },
          { id: 'remaining', price: '15 €' },
        ],
      },
      {
        id: 'pack',
        rows: [{ id: 'children', price: '60 €' }],
      },
    ],
  },
  { id: 'hunting', image: hunting },
  { id: 'country-house', image: countryHouse },
]
