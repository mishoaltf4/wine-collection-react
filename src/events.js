import { createContext, useContext } from 'react'

// All events from the API (raw rows). Components split them into upcoming / past with the helpers below.
export const EventsContext = createContext([])
export const useEvents = () => useContext(EventsContext)

const todayStr = () => new Date().toISOString().slice(0, 10)

// Upcoming = today or later, soonest first
export const upcomingOf = (events) =>
  events.filter((e) => e.date >= todayStr()).sort((a, b) => a.date.localeCompare(b.date))

// Past = before today, most recent first
export const pastOf = (events) =>
  events.filter((e) => e.date < todayStr()).sort((a, b) => b.date.localeCompare(a.date))

// Picks the _ka / _en fields for the current language; month is 0-based like Date
export function localize(e, lang) {
  const pick = (name) => e[`${name}_${lang}`] || e[`${name}_en`] || e[`${name}_ka`] || ''
  const [year, month, day] = e.date.split('-').map(Number)
  return {
    id: e.id,
    year,
    month: month - 1,
    day,
    image: e.image,
    title: pick('title'),
    description: pick('description'),
    place: pick('place'),
    placeShort: pick('place_short'),
  }
}
