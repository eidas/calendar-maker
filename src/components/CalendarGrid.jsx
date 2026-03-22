import { getDaysInMonth, toDateStr, today } from '../utils/dateUtils'
import { useHolidays } from '../hooks/useHolidays'
import CalendarCell from './CalendarCell'

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

export default function CalendarGrid({ year, month, theme, eventsApi, onCellClick, onEventClick, title, titlePosition, titleSize }) {
  const cells = getDaysInMonth(year, month)
  const holidays = useHolidays(year)
  const todayStr = today()

  return (
    <div className="h-full flex flex-col">
      {/* 年月ヘッダー（タイトルを含む） */}
      <div
        style={{ ...theme.headerStyle, fontFamily: theme.fontFamily, color: theme.headerStyle?.color, padding: '0.5em 1em' }}
        className={`font-bold flex items-center justify-center ${
          titlePosition === 'left' || titlePosition === 'right' ? 'flex-row gap-[0.5em]' : 'flex-col gap-[0.15em]'
        }`}
      >
        {title && (titlePosition === 'top' || titlePosition === 'left') && (
          <span style={{ fontSize: `${1.125 * titleSize}em` }}>{title}</span>
        )}
        <span style={{ fontSize: '1.125em' }}>{year}年{month}月</span>
        {title && (titlePosition === 'bottom' || titlePosition === 'right') && (
          <span style={{ fontSize: `${1.125 * titleSize}em` }}>{title}</span>
        )}
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
