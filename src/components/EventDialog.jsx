import { useState, useEffect } from 'react'
import { fileToBase64 } from '../utils/imageUtils'

let nextId = 1

export default function EventDialog({ mode, date, event, eventsApi, onClose }) {
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const isAdd = mode === 'add'
  const existingCount = eventsApi.getEventsForDate(date).length
  const atLimit = isAdd && existingCount >= 3

  useEffect(() => {
    if (event) {
      setTitle(event.title ?? '')
      setImageUrl(event.imageUrl ?? null)
      setImagePreview(event.imageUrl ?? null)
    }
  }, [event])

  async function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const base64 = await fileToBase64(file)
    setImageUrl(base64)
    setImagePreview(base64)
  }

  function handleSave() {
    if (isAdd) {
      eventsApi.addEvent({ id: String(nextId++), date, title: title.trim(), imageUrl, color: '#dbeafe' })
    } else {
      eventsApi.updateEvent(event.id, { title: title.trim(), imageUrl })
    }
    onClose()
  }

  function handleDelete() {
    eventsApi.deleteEvent(event.id)
    onClose()
  }

  const saveDisabled = atLimit || (title.trim() === '' && !imageUrl)

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-lg shadow-xl w-80 p-5">
        <h2 className="font-bold text-gray-800 mb-1 text-base">
          {isAdd ? 'イベントを追加' : 'イベントを編集'}
        </h2>
        <p className="text-xs text-gray-500 mb-4">{date}</p>

        {atLimit && (
          <p className="text-xs text-red-500 mb-3 font-medium">この日は上限（3件）に達しています</p>
        )}

        {/* タイトル */}
        <div className="mb-3">
          <label className="block text-xs text-gray-600 mb-1">イベント名（任意）</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={atLimit}
            placeholder="例: 誕生日"
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 disabled:bg-gray-50"
          />
        </div>

        {/* 画像 */}
        <div className="mb-4">
          <label className="block text-xs text-gray-600 mb-1">画像（任意）</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={atLimit}
            className="w-full text-xs disabled:opacity-50"
          />
          {imagePreview && (
            <div className="mt-2 relative inline-block">
              <img src={imagePreview} alt="プレビュー" className="h-16 rounded border object-cover" />
              <button
                onClick={() => { setImageUrl(null); setImagePreview(null) }}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs leading-none flex items-center justify-center"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* ボタン */}
        <div className="flex justify-between items-center">
          <div>
            {!isAdd && (
              <button
                onClick={handleDelete}
                className="text-xs text-red-500 hover:underline"
              >
                削除
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              disabled={saveDisabled}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
