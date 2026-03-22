import { toDateStr } from '../utils/dateUtils'

export default function CalendarCell({ date, isCurrentMonth, isToday, holiday, events, theme, isLastRow, onClick, onEventClick }) {
  const { year, month, day } = date
  const weekday = new Date(year, month - 1, day).getDay()

  function dateColor() {
    if (!isCurrentMonth) return '#9ca3af'
    if (weekday === 0 || holiday) return theme.holidayColor
    if (weekday === 6) return theme.saturdayColor
    return theme.textColor
  }

  return (
    <div
      className={`${weekday !== 6 ? 'border-r' : ''} ${!isLastRow ? 'border-b' : ''} cursor-pointer hover:brightness-95 flex flex-col h-full overflow-hidden`}
      style={{ borderColor: theme.gridColor, fontFamily: theme.fontFamily, borderRadius: theme.cellBorderRadius ?? '0', padding: '0.25em' }}
      onClick={() => onClick(toDateStr(year, month, day))}
    >
      {/* 日付番号 */}
      <div className="flex items-center gap-1 mb-0.5 flex-shrink-0">
        <span
          className={`font-semibold leading-none flex-shrink-0 ${isToday ? 'flex items-center justify-center rounded-full bg-blue-500 text-white' : ''}`}
          style={{
            fontSize: '0.75em',
            ...(isToday ? { width: '1.6em', height: '1.6em' } : { color: dateColor() }),
          }}
        >
          {day}
        </span>
        {holiday && (
          <span className="leading-none truncate" style={{ color: theme.holidayColor, fontSize: '0.6em' }}>
            {holiday}
          </span>
        )}
      </div>

      {/* イベント一覧 */}
      <div className="flex flex-col overflow-hidden" style={{ gap: '0.2em' }}>
        {events.map(ev => (
          <div
            key={ev.id}
            className="flex items-center rounded leading-tight cursor-pointer hover:opacity-75 overflow-hidden"
            style={{ backgroundColor: ev.color || '#dbeafe', color: '#1e3a5f', fontSize: '0.65em', padding: '0.1em 0.3em', gap: '0.3em' }}
            onClick={e => { e.stopPropagation(); onEventClick(ev) }}
          >
            {ev.imageUrl && (
              <img src={ev.imageUrl} alt="" className="object-cover rounded flex-shrink-0" style={{ width: '1.2em', height: '1.2em' }} />
            )}
            {ev.title && <span className="truncate">{ev.title}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
