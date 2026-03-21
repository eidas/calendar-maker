import { useState } from 'react'
import { THEMES } from '../data/themes'
import { fileToBase64 } from '../utils/imageUtils'

const FONT_OPTIONS = [
  { value: "'Noto Sans JP', sans-serif", label: 'Noto Sans JP' },
  { value: "'Noto Serif JP', serif", label: 'Noto Serif JP' },
  { value: "'M PLUS Rounded 1c', sans-serif", label: 'M PLUS Rounded 1c' },
  { value: "'Zen Kurenaido', sans-serif", label: 'Zen Kurenaido' },
  { value: 'sans-serif', label: 'sans-serif' },
]

const GRADIENT_DIRECTIONS = [
  { value: 'to bottom', label: '↓ 上→下' },
  { value: 'to top', label: '↑ 下→上' },
  { value: 'to right', label: '→ 左→右' },
  { value: 'to left', label: '← 右→左' },
  { value: 'to bottom right', label: '↘ 左上→右下' },
  { value: 'to bottom left', label: '↙ 右上→左下' },
]

export default function SettingsPanel({ calendar }) {
  const { year, month, setYear, setMonth, themeKey, theme, prevMonth, nextMonth, applyTemplate, updateTheme } = calendar

  const [bgMode, setBgMode] = useState('solid')

  const gradientStart = theme.backgroundGradient?.startColor ?? '#e0f2fe'
  const gradientEnd = theme.backgroundGradient?.endColor ?? '#fae8ff'
  const gradientDir = theme.backgroundGradient?.direction ?? 'to bottom right'

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const base64 = await fileToBase64(file)
    updateTheme({ backgroundImage: base64 })
  }

  return (
    <div className="p-4 space-y-6 text-sm">
      {/* 年月選択 */}
      <section>
        <h2 className="font-semibold text-gray-700 mb-2">年月</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            value={year}
            min={1900}
            max={2100}
            onChange={e => setYear(Number(e.target.value))}
            className="w-20 border border-gray-300 rounded px-2 py-1"
          />
          <span className="text-gray-500">年</span>
          <select
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}月</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={prevMonth}
            className="flex-1 border border-gray-300 rounded px-3 py-1 hover:bg-gray-100"
          >
            ◀ 前月
          </button>
          <button
            onClick={nextMonth}
            className="flex-1 border border-gray-300 rounded px-3 py-1 hover:bg-gray-100"
          >
            翌月 ▶
          </button>
        </div>
      </section>

      {/* テンプレート選択 */}
      <section>
        <h2 className="font-semibold text-gray-700 mb-2">テンプレート</h2>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(THEMES).map(([key, t]) => (
            <button
              key={key}
              onClick={() => { applyTemplate(key); setBgMode('solid') }}
              className={`border rounded px-2 py-1.5 text-left transition-colors ${
                themeKey === key
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </section>

      {/* 背景設定 */}
      <section>
        <h2 className="font-semibold text-gray-700 mb-2">背景</h2>
        <div className="flex gap-3 mb-3">
          {['solid', 'gradient', 'image'].map(mode => (
            <label key={mode} className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="bgMode"
                value={mode}
                checked={bgMode === mode}
                onChange={() => setBgMode(mode)}
              />
              <span>{{ solid: '単色', gradient: 'グラデーション', image: '画像' }[mode]}</span>
            </label>
          ))}
        </div>

        {bgMode === 'solid' && (
          <div className="flex items-center gap-2">
            <label className="text-gray-600">背景色</label>
            <input
              type="color"
              value={theme.backgroundColor}
              onChange={e => updateTheme({ backgroundColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border border-gray-300"
            />
          </div>
        )}

        {bgMode === 'gradient' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-gray-600 w-16">開始色</label>
              <input
                type="color"
                value={gradientStart}
                onChange={e => updateTheme({ backgroundGradient: { startColor: e.target.value, endColor: gradientEnd, direction: gradientDir } })}
                className="w-8 h-8 rounded cursor-pointer border border-gray-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-gray-600 w-16">終了色</label>
              <input
                type="color"
                value={gradientEnd}
                onChange={e => updateTheme({ backgroundGradient: { startColor: gradientStart, endColor: e.target.value, direction: gradientDir } })}
                className="w-8 h-8 rounded cursor-pointer border border-gray-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-gray-600 w-16">方向</label>
              <select
                value={gradientDir}
                onChange={e => updateTheme({ backgroundGradient: { startColor: gradientStart, endColor: gradientEnd, direction: e.target.value } })}
                className="border border-gray-300 rounded px-2 py-1"
              >
                {GRADIENT_DIRECTIONS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {bgMode === 'image' && (
          <div className="space-y-2">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs w-full" />
            {theme.backgroundImage && (
              <div className="space-y-1">
                <img src={theme.backgroundImage} alt="背景プレビュー" className="w-full h-20 object-cover rounded border" />
                <button
                  onClick={() => updateTheme({ backgroundImage: null })}
                  className="text-xs text-red-500 hover:underline"
                >
                  画像をクリア
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* フォント選択 */}
      <section>
        <h2 className="font-semibold text-gray-700 mb-2">フォント</h2>
        <select
          value={theme.fontFamily}
          onChange={e => updateTheme({ fontFamily: e.target.value })}
          className="w-full border border-gray-300 rounded px-2 py-1"
        >
          {FONT_OPTIONS.map(f => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
              {f.label}
            </option>
          ))}
        </select>
      </section>

      {/* 文字色 */}
      <section>
        <h2 className="font-semibold text-gray-700 mb-2">文字色</h2>
        <div className="space-y-2">
          {[
            { label: '通常日', key: 'textColor' },
            { label: '土曜日', key: 'saturdayColor' },
            { label: '日曜・祝日', key: 'sundayColor' },
          ].map(({ label, key }) => (
            <div key={key} className="flex items-center gap-2">
              <label className="text-gray-600 w-20">{label}</label>
              <input
                type="color"
                value={theme[key]}
                onChange={e => {
                  if (key === 'sundayColor') {
                    updateTheme({ sundayColor: e.target.value, holidayColor: e.target.value })
                  } else {
                    updateTheme({ [key]: e.target.value })
                  }
                }}
                className="w-8 h-8 rounded cursor-pointer border border-gray-300"
              />
              <span className="text-xs text-gray-400">{theme[key]}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
