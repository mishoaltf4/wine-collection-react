import people from '../assets/icons/people.svg'
import internet from '../assets/icons/internet.svg'
import award from '../assets/icons/award.svg'
import book from '../assets/icons/book.svg'
import wine from '../assets/icons/wine.svg'
import hands from '../assets/icons/hands.svg'

import event1 from '../assets/images/home/past-events/event-1.jpg'
import event2 from '../assets/images/home/past-events/event-2.jpg'
import event3 from '../assets/images/home/past-events/event-3.jpg'
import event4 from '../assets/images/home/past-events/event-4.jpg'
import qvevri from '../assets/images/home/qvevri.png'
import deduleti from '../assets/images/home/deduleti.png'
import bakurveli from '../assets/images/home/bakurveli.png'
import eventImage from '../assets/images/home/event-31-oct.webp'
import dummyEventImage from '../assets/images/home/event.webp'

// Keys map to WHAT_WE_DO.ICONS in the locale files
export const pillars = [
  { key: 'WINE_FESTIVAL', icon: internet },
  { key: 'FORUMS', icon: people },
  { key: 'DEGUSTATION', icon: wine },
  { key: 'PARTNERS', icon: hands },
  { key: 'PROJECTS', icon: award },
  { key: 'POPULARIZATION', icon: book },
]

// Keys map to PAST_EVENTS.PAST_EVENTS_LIST in the locale files
export const pastEvents = [
  { key: 'PAST_EVENT_4', image: event4 },
  { key: 'PAST_EVENT_3', image: event3 },
  { key: 'PAST_EVENT_2', image: event2 },
  { key: 'PAST_EVENT_1', image: event1 },
]

// Placeholder winery data - not in the locale files yet
export const wineries = [
  { id: 3, region: 'Gurdjaani', name: 'Bakurveli', image: bakurveli },
  { id: 1, region: 'Kakheti', name: 'Qvevri', image: qvevri },
  { id: 2, region: 'Imereti', name: 'Deduleti', image: deduleti },
]

// Festivals shown in the calendar. `key` maps to UPCOMING_EVENTS.EVENTS in the locale files,
// month is 0-based. Add more entries here (and their translations) and the calendar picks them up.
export const upcomingEvents = [
  { key: 'EVENT_1', year: 2026, month: 9, day: 31, image: eventImage },
  { key: 'EVENT_2', year: 2026, month: 11, day: 11, image: dummyEventImage, dummy: true },
]

export const MONTH_KEYS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
]

export const WEEKDAY_KEYS = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY',
]
