import { useRef, useState, useEffect } from 'react'
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
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    if (!calendarRef.current) return
    const obs = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width)
    })
    obs.observe(calendarRef.current)
    return () => obs.disconnect()
  }, [])

  // 実際のセルサイズ (7列 × 7行相当) から font-size を決定
  // 幅・高さの小さい方に合わせることで、縦長・横長どちらでも適切なサイズになる
  const cellW = containerWidth / 7
  const cellH = containerWidth * aspectHeight / (aspectWidth * 7)
  const baseFontSize = containerWidth > 0
    ? `${Math.min(cellW, cellH) / 6.25}px`
    : `${Math.round(16 * Math.sqrt((3 * aspectHeight) / (4 * aspectWidth)))}px`

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
