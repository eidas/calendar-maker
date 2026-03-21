import { useState } from 'react'
import { downloadCalendarPng } from '../utils/imageUtils'

export default function DownloadButton({ calendarRef, year, month }) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    if (!calendarRef.current) return
    setLoading(true)
    try {
      await downloadCalendarPng(calendarRef.current, `calendar-${year}-${String(month).padStart(2, '0')}.png`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
    >
      {loading ? '生成中...' : 'PNG ダウンロード'}
    </button>
  )
}
