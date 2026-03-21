// T08 で実装予定
export default function EventDialog({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <p className="text-gray-400 text-sm">イベントダイアログ（T08 で実装）</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded text-sm">閉じる</button>
      </div>
    </div>
  )
}
