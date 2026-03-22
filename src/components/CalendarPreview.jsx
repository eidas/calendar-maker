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
  const { year, month, theme, aspectWidth, aspectHeight } = calendar
  const calendarRef = useRef(null)

  // アスペクト比に合わせたベースフォントサイズ (3:4 を基準=1.0)
  // セル面積に対するフォント面積を一定にするため √ を使う
  const scale = Math.sqrt((3 * aspectHeight) / (4 * aspectWidth))
  const baseFontSize = `${Math.round(16 * scale)}px`

  return (
    <div className="flex flex-col gap-4 mx-4 my-2">
      {/* PNG に含まれる部分 */}
      <div className="p-2">
        <div
          ref={calendarRef}
          className="rounded-lg overflow-hidden shadow border"
          style={{ ...buildBackgroundStyle(theme), fontFamily: theme.fontFamily, borderColor: theme.gridColor, aspectRatio: `${aspectWidth}/${aspectHeight}`, fontSize: baseFontSize }}
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
      </div>

      {/* PNG に含まれない部分 */}
      <div className="flex justify-end">
        <DownloadButton calendarRef={calendarRef} year={year} month={month} />
      </div>
    </div>
  )
}
