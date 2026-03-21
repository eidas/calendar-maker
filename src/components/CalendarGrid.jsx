import { getDaysInMonth, toDateStr, today } from '../utils/dateUtils'
import { getHolidays } from '../data/holidays'
import CalendarCell from './CalendarCell'

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

export default function CalendarGrid({ year, month, theme, eventsApi, onCellClick, onEventClick }) {
  const cells = getDaysInMonth(year, month)
  const holidays = getHolidays(year)
  const todayStr = today()

  return (
    <div>
      {/* 年月ヘッダー */}
      <div
        className="px-4 py-3 text-center text-lg font-bold"
        style={{ ...theme.headerStyle, fontFamily: theme.fontFamily, color: theme.headerStyle?.color }}
      >
        {year}年{month}月
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 border-b" style={{ borderColor: theme.gridColor }}>
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={label}
            className="text-center text-xs py-1 font-medium"
            style={{
              fontFamily: theme.fontFamily,
              color: i === 0 ? theme.sundayColor : i === 6 ? theme.saturdayColor : theme.textColor,
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 border-t border-l" style={{ borderColor: theme.gridColor }}>
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
              onClick={onCellClick}
              onEventClick={onEventClick}
            />
          )
        })}
      </div>
    </div>
  )
}
