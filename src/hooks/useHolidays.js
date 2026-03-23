import { useState, useEffect } from 'react'
import { getHolidays } from '../data/holidays'

const API_URL = 'https://holidays-jp.github.io/api/v1/date.json'

// モジュールレベルのキャッシュ（セッション中に1度だけフェッチ）
// null = 未取得, {} = 取得済み（エラー時も空オブジェクト）
let apiCache = null
let fetchPromise = null

function ensureFetched() {
  if (fetchPromise) return fetchPromise
  fetchPromise = fetch(API_URL)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return r.json()
    })
    .then(data => {
      apiCache = data
      return data
    })
    .catch(() => {
      apiCache = {}
      return {}
    })
  return fetchPromise
}

function pickYear(allData, year) {
  const prefix = `${year}-`
  return Object.fromEntries(
    Object.entries(allData)
      .filter(([k]) => k.startsWith(prefix))
      .map(([k, v]) => [k, v.includes('振替休日') ? '振替休日' : v])
  )
}

/**
 * 指定年の祝日を返す React フック
 * - まず内部ロジックで初期値を返す（レンダリングをブロックしない）
 * - APIから取得できた場合、かつ当該年のデータが存在する場合はAPIデータで上書き
 * - API取得失敗または当該年データなしの場合は内部ロジックを使い続ける
 */
export function useHolidays(year) {
  const [holidays, setHolidays] = useState(() => getHolidays(year))

  useEffect(() => {
    let cancelled = false

    if (apiCache !== null) {
      // 既にフェッチ済み
      const yearData = pickYear(apiCache, year)
      if (!cancelled) {
        setHolidays(Object.keys(yearData).length > 0 ? yearData : getHolidays(year))
      }
      return
    }

    ensureFetched().then(data => {
      if (cancelled) return
      const yearData = pickYear(data, year)
      setHolidays(Object.keys(yearData).length > 0 ? yearData : getHolidays(year))
    })

    return () => { cancelled = true }
  }, [year])

  return holidays
}
