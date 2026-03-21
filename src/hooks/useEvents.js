import { useState } from 'react'

const MAX_EVENTS_PER_DAY = 3

export function useEvents() {
  const [events, setEvents] = useState([])

  function addEvent(event) {
    const sameDay = events.filter(e => e.date === event.date)
    if (sameDay.length >= MAX_EVENTS_PER_DAY) return false
    setEvents(prev => [...prev, event])
    return true
  }

  function updateEvent(id, patch) {
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, ...patch } : e)))
  }

  function deleteEvent(id) {
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  function getEventsForDate(dateStr) {
    return events.filter(e => e.date === dateStr)
  }

  return { events, addEvent, updateEvent, deleteEvent, getEventsForDate }
}
