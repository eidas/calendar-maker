/**
 * 日本の祝日計算ロジック
 * 国民の祝日に関する法律に基づく
 */

/**
 * 指定年・月の第N週の指定曜日の日を返す（ハッピーマンデー用）
 * @param {number} year
 * @param {number} month - 1始まり
 * @param {number} weekday - 0=日, 1=月, ..., 6=土
 * @param {number} n - 第N週 (1始まり)
 * @returns {number} 日
 */
function nthWeekday(year, month, weekday, n) {
  const first = new Date(year, month - 1, 1).getDay()
  const offset = (weekday - first + 7) % 7
  return 1 + offset + (n - 1) * 7
}

/**
 * 春分の日を返す（近似式）
 * @param {number} year
 * @returns {number} 日
 */
function vernalEquinox(year) {
  if (year <= 1979) return Math.floor(20.8357 + 0.242194 * (year - 1980) - Math.floor((year - 1983) / 4))
  if (year <= 2099) return Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4))
  return Math.floor(21.851 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4))
}

/**
 * 秋分の日を返す（近似式）
 * @param {number} year
 * @returns {number} 日
 */
function autumnalEquinox(year) {
  if (year <= 1979) return Math.floor(23.2588 + 0.242194 * (year - 1980) - Math.floor((year - 1983) / 4))
  if (year <= 2099) return Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4))
  return Math.floor(24.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4))
}

/**
 * 日付を "YYYY-MM-DD" 形式の文字列に変換する
 * @param {number} year
 * @param {number} month - 1始まり
 * @param {number} day
 * @returns {string}
 */
function toDateStr(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * 指定年の日本の祝日を返す
 * @param {number} year
 * @returns {Object} { "YYYY-MM-DD": "祝日名" }
 */
export function getHolidays(year) {
  const holidays = {}

  const add = (month, day, name) => {
    holidays[toDateStr(year, month, day)] = name
  }

  // 固定祝日
  add(1, 1, '元日')
  add(2, 11, '建国記念の日')
  add(2, 23, '天皇誕生日')
  add(4, 29, '昭和の日')
  add(5, 3, '憲法記念日')
  add(5, 4, 'みどりの日')
  add(5, 5, 'こどもの日')
  add(8, 11, '山の日')
  add(11, 3, '文化の日')
  add(11, 23, '勤労感謝の日')

  // 春分の日・秋分の日
  add(3, vernalEquinox(year), '春分の日')
  add(9, autumnalEquinox(year), '秋分の日')

  // ハッピーマンデー
  add(1, nthWeekday(year, 1, 1, 2), '成人の日')
  add(7, nthWeekday(year, 7, 1, 3), '海の日')
  add(9, nthWeekday(year, 9, 1, 3), '敬老の日')
  add(10, nthWeekday(year, 10, 1, 2), 'スポーツの日')

  // 振替休日: 祝日が日曜の場合、翌月曜（または翌々日以降の平日）を振替
  const dateStrs = Object.keys(holidays).sort()
  const substitutes = {}
  for (const dateStr of dateStrs) {
    const d = new Date(dateStr)
    if (d.getDay() === 0) {
      // 翌日以降で祝日でも日曜でもない日を探す
      let candidate = new Date(d)
      candidate.setDate(candidate.getDate() + 1)
      while (
        candidate.getDay() === 0 ||
        holidays[toDateStr(candidate.getFullYear(), candidate.getMonth() + 1, candidate.getDate())]
      ) {
        candidate.setDate(candidate.getDate() + 1)
      }
      const key = toDateStr(candidate.getFullYear(), candidate.getMonth() + 1, candidate.getDate())
      substitutes[key] = '振替休日'
    }
  }
  Object.assign(holidays, substitutes)

  return holidays
}

/**
 * 指定日が祝日かどうかを返す
 * @param {string} dateStr - "YYYY-MM-DD"
 * @returns {boolean}
 */
export function isHoliday(dateStr) {
  const year = parseInt(dateStr.slice(0, 4), 10)
  return dateStr in getHolidays(year)
}
