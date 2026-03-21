import { useState } from 'react'
import { useCalendar } from './hooks/useCalendar'
import { useEvents } from './hooks/useEvents'
import Header from './components/Header'
import SettingsPanel from './components/SettingsPanel'
import CalendarPreview from './components/CalendarPreview'
import EventDialog from './components/EventDialog'

export default function App() {
  const calendar = useCalendar()
  const eventsApi = useEvents()

  // EventDialog の開閉状態
  // dialogMode: null | 'add' | 'edit'
  const [dialogMode, setDialogMode] = useState(null)
  const [dialogDate, setDialogDate] = useState(null)
  const [dialogEvent, setDialogEvent] = useState(null)

  function handleCellClick(dateStr) {
    setDialogDate(dateStr)
    setDialogEvent(null)
    setDialogMode('add')
  }

  function handleEventClick(event) {
    setDialogDate(event.date)
    setDialogEvent(event)
    setDialogMode('edit')
  }

  function handleDialogClose() {
    setDialogMode(null)
    setDialogDate(null)
    setDialogEvent(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <aside className="w-full lg:w-80 lg:min-w-80 overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-200 bg-white">
          <SettingsPanel calendar={calendar} />
        </aside>
        <main className="flex-1 overflow-auto p-4">
          <CalendarPreview
            calendar={calendar}
            eventsApi={eventsApi}
            onCellClick={handleCellClick}
            onEventClick={handleEventClick}
          />
        </main>
      </div>
      {dialogMode && (
        <EventDialog
          mode={dialogMode}
          date={dialogDate}
          event={dialogEvent}
          eventsApi={eventsApi}
          onClose={handleDialogClose}
        />
      )}
    </div>
  )
}
