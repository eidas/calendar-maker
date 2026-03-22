import { useState } from 'react'
import { THEMES, DEFAULT_THEME_KEY } from '../data/themes'

export function useCalendar() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [themeKey, setThemeKey] = useState(DEFAULT_THEME_KEY)
  const [theme, setTheme] = useState(THEMES[DEFAULT_THEME_KEY])
  const [aspectWidth, setAspectWidth] = useState(4)
  const [aspectHeight, setAspectHeight] = useState(3)
  const [title, setTitle] = useState('')
  const [titlePosition, setTitlePosition] = useState('top')
  const [titleSize, setTitleSize] = useState(1.0)

  function prevMonth() {
    if (month === 1) {
      setYear(y => y - 1)
      setMonth(12)
    } else {
      setMonth(m => m - 1)
    }
  }

  function nextMonth() {
    if (month === 12) {
      setYear(y => y + 1)
      setMonth(1)
    } else {
      setMonth(m => m + 1)
    }
  }

  function applyTemplate(key) {
    if (!THEMES[key]) return
    setThemeKey(key)
    setTheme(THEMES[key])
  }

  function updateTheme(patch) {
    setTheme(prev => ({ ...prev, ...patch }))
  }

  function setAspectRatio(w, h) {
    setAspectWidth(w)
    setAspectHeight(h)
  }

  return { year, month, setYear, setMonth, themeKey, theme, prevMonth, nextMonth, applyTemplate, updateTheme, aspectWidth, aspectHeight, setAspectRatio, title, setTitle, titlePosition, setTitlePosition, titleSize, setTitleSize }
}
