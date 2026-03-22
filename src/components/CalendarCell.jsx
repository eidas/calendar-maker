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
      className={`${weekday !== 6 ? 'border-r' : ''} ${!isLastRow ? 'border-b' : ''} min-h-[72px] p-1 cursor-pointer hover:brightness-95 flex flex-col`}
      style={{ borderColor: theme.gridColor, fontFamily: theme.fontFamily, borderRadius: theme.cellBorderRadius ?? '0' }}
      onClick={() => onClick(toDateStr(year, month, day))}
    >
      {/* 日付番号 */}
      <div className="flex items-center gap-1 mb-0.5">
        <span
          className={`text-xs font-semibold leading-none ${isToday ? 'bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center' : ''}`}
          style={isToday ? {} : { color: dateColor() }}
        >
          {day}
        </span>
        {holiday && (
          <span className="text-[10px] leading-none truncate" style={{ color: theme.holidayColor }}>
            {holiday}
          </span>
        )}
      </div>

      {/* イベント一覧 */}
      <div className="flex flex-col gap-0.5 overflow-hidden">
        {events.map(ev => (
          <div
            key={ev.id}
            className="flex items-center gap-1 rounded px-1 text-[11px] leading-tight cursor-pointer hover:opacity-75"
            style={{ backgroundColor: ev.color || '#dbeafe', color: '#1e3a5f' }}
            onClick={e => { e.stopPropagation(); onEventClick(ev) }}
          >
            {ev.imageUrl && (
              <img src={ev.imageUrl} alt="" className="w-4 h-4 object-cover rounded flex-shrink-0" />
            )}
            {ev.title && <span className="truncate">{ev.title}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
