import { useRef } from 'react'
import CalendarGrid from './CalendarGrid'
import DownloadButton from './DownloadButton'

function buildBackgroundStyle(theme) {
  if (theme.backgroundImage) {
    return {
      backgroundImage: `url(${theme.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  if (theme.backgroundGradient) {
    const { startColor, endColor, direction } = theme.backgroundGradient
    return { background: `linear-gradient(${direction}, ${startColor}, ${endColor})` }
  }
  return { backgroundColor: theme.backgroundColor }
}

export default function CalendarPreview({ calendar, eventsApi, onCellClick, onEventClick }) {
  const { year, month, theme } = calendar
  const calendarRef = useRef(null)

  return (
    <div className="flex flex-col gap-4 mx-4 my-2">
      {/* PNG に含まれる部分 */}
      <div
        ref={calendarRef}
        className="rounded-lg overflow-hidden shadow"
        style={{ ...buildBackgroundStyle(theme), fontFamily: theme.fontFamily }}
      >
        <CalendarGrid
          year={year}
          month={month}
          theme={theme}
          eventsApi={eventsApi}
          onCellClick={onCellClick}
          onEventClick={onEventClick}
        />
      </div>

      {/* PNG に含まれない部分 */}
      <div className="flex justify-end">
        <DownloadButton calendarRef={calendarRef} year={year} month={month} />
      </div>
    </div>
  )
}
