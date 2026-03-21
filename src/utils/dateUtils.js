/**
 * 日付ユーティリティ
 */

/**
 * 月のカレンダーグリッド用の日付配列を返す（日曜始まり、前月末・翌月頭を含む42マス）
 * @param {number} year
 * @param {number} month - 1始まり
 * @returns {Array<{ year: number, month: number, day: number, isCurrentMonth: boolean }>}
 */
export function getDaysInMonth(year, month) {
  const firstDay = new Date(year, month - 1, 1).getDay() // 0=日〜6=土
  const daysInMonth = new Date(year, month, 0).getDate()
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate()

  const cells = []

  // 前月の日
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i
    const m = month === 1 ? 12 : month - 1
    const y = month === 1 ? year - 1 : year
    cells.push({ year: y, month: m, day: d, isCurrentMonth: false })
  }

  // 当月の日
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ year, month, day: d, isCurrentMonth: true })
  }

  // 翌月の日（42マスになるまで埋める）
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    const m = month === 12 ? 1 : month + 1
    const y = month === 12 ? year + 1 : year
    cells.push({ year: y, month: m, day: d, isCurrentMonth: false })
  }

  return cells
}

/**
 * Date オブジェクトを "YYYY-MM-DD" 形式の文字列に変換する
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * 年・月・日から "YYYY-MM-DD" 形式の文字列を返す
 * @param {number} year
 * @param {number} month - 1始まり
 * @param {number} day
 * @returns {string}
 */
export function toDateStr(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * 年・月・日から曜日インデックスを返す（0=日〜6=土）
 * @param {number} year
 * @param {number} month - 1始まり
 * @param {number} day
 * @returns {number}
 */
export function getWeekday(year, month, day) {
  return new Date(year, month - 1, day).getDay()
}

/**
 * 今日の日付を "YYYY-MM-DD" 形式で返す
 * @returns {string}
 */
export function today() {
  return formatDate(new Date())
}
