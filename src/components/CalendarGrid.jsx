import { getDaysInMonth, toDateStr, today } from '../utils/dateUtils'
import { getHolidays } from '../data/holidays'
import CalendarCell from './CalendarCell'

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

export default function CalendarGrid({ year, month, theme, eventsApi, onCellClick, onEventClick }) {
  const cells = getDaysInMonth(year, month)
  const holidays = getHolidays(year)
  const todayStr = today()

  return (
    <div className="h-full flex flex-col">
      {/* 年月ヘッダー */}
      <div
        className="text-center font-bold"
        style={{ ...theme.headerStyle, fontFamily: theme.fontFamily, color: theme.headerStyle?.color, fontSize: '1.125em', padding: '0.5em 1em' }}
      >
        {year}年{month}月
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 border-b" style={{ borderColor: theme.gridColor }}>
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={label}
            className="text-center font-medium"
            style={{
              fontFamily: theme.fontFamily,
              color: i === 0 ? theme.sundayColor : i === 6 ? theme.saturdayColor : theme.textColor,
              fontSize: '0.75em',
              padding: '0.25em 0',
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: 'repeat(6, 1fr)' }}>
        {cells.map((cell, idx) => {
          const dateStr = toDateStr(cell.year, cell.month, cell.day)
          const holiday = holidays[dateStr]
          const events = eventsApi.getEventsForDate(dateStr)
          return (
            <CalendarCell
              key={idx}
              date={cell}
              isCurrentMonth={cell.isCurrentMonth}
              isToday={dateStr === todayStr}
              holiday={holiday}
              events={events}
              theme={theme}
              isLastRow={idx >= cells.length - 7}
              onClick={onCellClick}
              onEventClick={onEventClick}
            />
          )
        })}
      </div>
    </div>
  )
}
