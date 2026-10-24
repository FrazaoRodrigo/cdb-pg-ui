// Placeholder images: replace with the real activity photos
import oliveOil from '../assets/activities/olive-oil.webp'
import equestrian from '../assets/activities/equestrian.webp'
import hunting from '../assets/activities/hunting.svg'
import countryHouse from '../assets/activities/country-house.svg'
import gallery1 from '../assets/gallery/placeholder-1.svg'
import gallery2 from '../assets/gallery/placeholder-2.svg'
import gallery3 from '../assets/gallery/placeholder-3.svg'
import horse from '../assets/gallery/horse.webp'
import horses from '../assets/gallery/horses.webp'
import gal_oliveoil from '../assets/gallery/oliveoil.webp'
import gal_oliveoil_prd from '../assets/gallery/oliveoil_product.webp'
import organicIcon from '../assets/organic.webp' 

/**
 * Activities shown in the bottom sheet. Text (name, description) lives in
 * translations under `activities[id]`.
 *
 * `image` is the activity's card in the strip; `gallery` holds the images that
 * can be slid through once the activity is opened.
 *
 * `prices` rows are shown as a table below the gallery; row labels are
 * translated under `activities[id].prices.rows[row.id]`. A row without
 * `lowSeason`/`highSeason` is priced on request.
 *
 * `products` rows are shown as a table of items for sale, below the gallery;
 * row labels are translated under `activities[id].products.rows[row.id]`.
 *
 * `certification` is an icon shown with the note translated under
 * `activities[id].certification`, at the end of the details.
 *
 * `hidden: true` keeps an activity out of the site until it is ready.
 *
 * `lessons` groups are shown as a second table below it, one group after the
 * other; titles and row labels are translated under
 * `activities[id].lessons.groups[group.id]` and `.rows[row.id]`.
 */
const allActivities = [
  {
    id: 'olive-oil',
    image: oliveOil,
    gallery: [gal_oliveoil, gal_oliveoil_prd],
    products: [
      { id: 'bottle', price: '10 €' },
      { id: 'threeLitres', price: '30 €' },
      { id: 'fiveLitres', price: '50 €' },
    ],
    certification: organicIcon,
  },
  {
    id: 'equestrian',
    image: equestrian,
    gallery: [horse, horses],
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
  { id: 'hunting', image: hunting, gallery: [gallery3, gallery1], hidden: true },
  { id: 'country-house', image: countryHouse, gallery: [gallery1], hidden: true },
]

export const activities = allActivities.filter((activity) => !activity.hidden)
