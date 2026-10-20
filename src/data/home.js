import people from '../assets/icons/people.svg'
import internet from '../assets/icons/internet.svg'
import award from '../assets/icons/award.svg'
import book from '../assets/icons/book.svg'
import wine from '../assets/icons/wine.svg'
import hands from '../assets/icons/hands.svg'

import wineryPhoto from '../assets/images/home/something.webp'

// Keys map to WHAT_WE_DO.ICONS in the locale files
export const pillars = [
  { key: 'WINE_FESTIVAL', icon: internet },
  { key: 'FORUMS', icon: people },
  { key: 'DEGUSTATION', icon: wine },
  { key: 'PARTNERS', icon: hands },
  { key: 'PROJECTS', icon: award },
  { key: 'POPULARIZATION', icon: book },
]

// Placeholder winery data - not in the locale files yet
export const wineries = [
  { id: 1, region: 'Kakheti', name: 'Winery #1', image: wineryPhoto },
  { id: 2, region: 'Imereti', name: 'Winery #2', image: wineryPhoto },
  { id: 3, region: 'Kartli', name: 'Winery #3', image: wineryPhoto },
  { id: 4, region: 'Kartli', name: 'Winery #3', image: wineryPhoto },
]

export const MONTH_KEYS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
]

export const WEEKDAY_KEYS = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY',
]
