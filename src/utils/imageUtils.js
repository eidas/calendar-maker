import { toPng } from 'html-to-image'

/**
 * File オブジェクトを Base64 文字列に変換する
 * @param {File} file
 * @returns {Promise<string>} Base64 エンコードされた data URL
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('画像の読み込みに失敗しました'))
    reader.readAsDataURL(file)
  })
}

/**
 * DOM 要素を PNG としてダウンロードする
 * @param {HTMLElement} element - 出力対象の DOM 要素
 * @param {string} filename - ダウンロードファイル名（例: "calendar-2026-03.png"）
 * @returns {Promise<void>}
 */
export async function downloadCalendarPng(element, filename) {
  const dataUrl = await toPng(element, {
    pixelRatio: 2,
    cacheBust: true,
  })
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}
