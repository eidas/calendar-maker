# タスク一覧 — カレンダー画像作成アプリ

ステータス凡例: `[ ]` 未着手 / `[x]` 完了

---

## T01 プロジェクト初期化

- [x] **T01-1** Vite + React プロジェクトを初期化する
  - `npm create vite@latest . -- --template react`
  - 生成される不要なサンプルファイル（`src/App.css`, `src/assets/`）を削除
- [x] **T01-2** Tailwind CSS を導入する
  - `npm install -D tailwindcss postcss autoprefixer`
  - `tailwind.config.js` / `postcss.config.js` を生成・設定
  - `src/index.css` に `@tailwind` ディレクティブを追加
- [x] **T01-3** html-to-image を追加する
  - `npm install html-to-image`
- [x] **T01-4** Google Fonts を `index.html` に追加する
  - Noto Sans JP, Noto Serif JP, M PLUS Rounded 1c, Zen Kurenaido（和風用）

---

## T02 データ定義

- [x] **T02-1** `src/data/holidays.js` — 祝日計算ロジックを実装する
  - 固定祝日 10件（元日, 建国記念の日, 天皇誕生日, 昭和の日, 憲法記念日, みどりの日, こどもの日, 山の日, 文化の日, 勤労感謝の日）
  - ハッピーマンデー 4件（成人の日, 海の日, 敬老の日, スポーツの日）
  - 春分の日・秋分の日（天文計算近似式）
  - 振替休日（祝日が日曜 → 翌月曜）
  - `export function getHolidays(year)` — `{ "YYYY-MM-DD": "祝日名" }` を返す
  - `export function isHoliday(dateStr)` — boolean を返す
- [x] **T02-2** `src/data/themes.js` — 4テンプレートの `ThemeConfig` を定義する
  - `simple`: 白背景, 細いグリッド線, モノクロ基調
  - `pop`: 鮮やかな配色, 丸みのあるスタイル
  - `dark`: 暗い背景, 白・グレー文字
  - `japanese`: 朱・藍・抹茶の和カラー, Zen Kurenaido フォント

---

## T03 ユーティリティ

- [x] **T03-1** `src/utils/dateUtils.js` を実装する
  - `getDaysInMonth(year, month)` — 前月末・翌月頭を含む 42 マス分の日付配列を返す
  - `formatDate(date)` — `Date` オブジェクト → `"YYYY-MM-DD"` 文字列
  - `getWeekday(year, month, day)` — 曜日インデックス（0=日〜6=土）を返す
- [x] **T03-2** `src/utils/imageUtils.js` を実装する
  - `fileToBase64(file)` — `File` → Base64 文字列（Promise）
  - `downloadCalendarPng(element, filename)` — `toPng()` で PNG 保存（`pixelRatio: 2`）

---

## T04 カスタムフック

- [x] **T04-1** `src/hooks/useCalendar.js` を実装する
  - 状態: `year`, `month`, `theme`（ThemeConfig）
  - `prevMonth()` / `nextMonth()` — 月をまたぐ場合は年も更新
  - `applyTemplate(key)` — `themes.js` から ThemeConfig を取得してセット
  - `updateTheme(patch)` — 部分更新（背景色・フォントなど個別変更用）
- [x] **T04-2** `src/hooks/useEvents.js` を実装する
  - 状態: `events`（`CalendarEvent[]`）
  - `addEvent(event)` — 1日最大 3 件チェック後に追加
  - `updateEvent(id, patch)` — 対象イベントを部分更新
  - `deleteEvent(id)` — 対象イベントを削除
  - `getEventsForDate(dateStr)` — 日付でフィルタして返す

---

## T05 コンポーネント — 骨格

- [x] **T05-1** `src/main.jsx` を作成する
  - React DOM レンダリングのエントリポイント
- [x] **T05-2** `src/App.jsx` を作成する
  - `useCalendar` / `useEvents` を呼び出す
  - `Header`, `SettingsPanel`, `CalendarPreview` を配置
  - レイアウト: `flex flex-col lg:flex-row`（上下 / 左右レスポンシブ）
  - `EventDialog` の開閉状態（`dialogDate`, `dialogEvent`）を管理
- [x] **T05-3** `src/components/Header.jsx` を作成する
  - アプリタイトル（「カレンダーメーカー」）を表示

---

## T06 コンポーネント — 設定パネル

- [ ] **T06-1** 年月選択セクションを `SettingsPanel.jsx` に実装する
  - 年: `<input type="number">` または `<select>`
  - 月: `<select>`（1〜12 月）
  - 前月 / 翌月ボタン（`useCalendar` の `prevMonth` / `nextMonth` を呼ぶ）
- [ ] **T06-2** テンプレート選択セクションを実装する
  - 4 ボタン（シンプル / ポップ / ダーク / 和風）
  - 現在選択中のテンプレートをアクティブスタイルで強調
- [ ] **T06-3** 背景設定セクションを実装する
  - タブまたはラジオで「単色 / グラデーション / 画像」を排他選択
  - 単色: `<input type="color">` → `updateTheme({ backgroundColor })`
  - グラデーション: 開始色・終了色・方向（select）→ `updateTheme({ backgroundGradient })`
  - 画像: `<input type="file" accept="image/*">` → `fileToBase64` でBase64化 → `updateTheme({ backgroundImage })`
  - 画像をクリアするボタンを設置
- [ ] **T06-4** フォント選択セクションを実装する
  - `<select>` でフォントファミリーを切り替え（Noto Sans JP, Noto Serif JP, M PLUS Rounded 1c, Zen Kurenaido, sans-serif）
  - 選択肢のラベル自体に該当フォントを適用してプレビュー
- [ ] **T06-5** 文字色設定セクションを実装する
  - 通常日: `<input type="color">` → `updateTheme({ textColor })`
  - 土曜日: `<input type="color">` → `updateTheme({ saturdayColor })`
  - 日曜・祝日: `<input type="color">` → `updateTheme({ sundayColor, holidayColor }`（連動）

---

## T07 コンポーネント — カレンダー表示

- [ ] **T07-1** `src/components/CalendarPreview.jsx` を作成する
  - 内部に `calendarRef`（`useRef`）を持ち、カレンダーグリッド部分のラッパー `<div>` に付ける
  - `calendarRef` を `DownloadButton` に props として渡す（ボタン自体は `ref` 対象 DOM の外に置き、PNG に写り込まないようにする）
  - `theme` のスタイルをインラインスタイルで適用（背景優先順位: 画像 > グラデーション > 単色）
  - `CalendarGrid` を `ref` 対象内に、`DownloadButton` を `ref` 対象外（下部）に配置
- [ ] **T07-2** `src/components/CalendarGrid.jsx` を作成する
  - 年月ヘッダー（例: `2026年3月`）を表示
  - 曜日ヘッダー行（日〜土）を表示。日曜は `sundayColor`, 土曜は `saturdayColor`
  - `getDaysInMonth` で 42 マスを生成し `CalendarCell` を配置
- [ ] **T07-3** `src/components/CalendarCell.jsx` を作成する
  - props: `date`, `isCurrentMonth`, `isToday`, `holiday`, `events`, `theme`, `onClick`, `onEventClick`
  - 日付番号の色: 前月・翌月はグレー、当月は `textColor`、土曜は `saturdayColor`、日曜/祝日は `holidayColor`
  - 祝日名を小テキストで表示（`holidayColor`）
  - イベントを最大 3 件表示（テキスト名 + 画像サムネイル）
    - タイトルが空（画像のみイベント）の場合はテキスト部分を省略し、サムネイルのみ表示
  - セル空白部分のクリック → `onClick(date)` を呼ぶ（新規追加ダイアログを開く）
  - イベント要素のクリック → `onEventClick(event)` を呼ぶ（編集/削除ダイアログを開く）。イベントバブリングは `stopPropagation()` で止める

---

## T08 コンポーネント — イベント管理

- [ ] **T08-1** `src/components/EventDialog.jsx` を作成する（新規追加モード）
  - 選択日付を表示
  - イベント名テキスト入力（任意）
  - 画像アップロード（任意）、プレビュー表示
  - 保存ボタン: タイトルと画像の両方が空の場合のみ無効化
  - 1日3件上限に達している場合は「上限に達しています」を表示して保存不可
  - キャンセル / 閉じるボタン
- [ ] **T08-2** `EventDialog.jsx` に編集・削除モードを追加する
  - 既存イベントをクリックした場合に編集フォームを表示
  - 削除ボタン（確認なしで即削除）
  - 保存で `updateEvent` を呼ぶ

---

## T09 PNG 出力

- [ ] **T09-1** `src/components/DownloadButton.jsx` を作成する
  - props: `calendarRef`（PNG出力対象の DOM ref）、`year`、`month`
  - 「PNG ダウンロード」ボタン
  - クリックで `downloadCalendarPng(calendarRef.current, \`calendar-${year}-${month}.png\`)` を呼ぶ
  - 生成中は「生成中...」と表示し、ボタンを無効化

---

## T10 スタイル調整・動作確認

- [ ] **T10-1** テンプレート4種の見た目を仕上げる
  - シンプル: 白背景, `#333` 基調, グリッド線 `#ddd`
  - ポップ: 水色背景, カラフルなヘッダー, 丸みセル（`border-radius`）
  - ダーク: `#1a1a2e` 背景, 白文字, `#444` グリッド線
  - 和風: `#fdf6ec` 背景, 朱（`#c0392b`）・藍（`#2c4770`）・抹茶（`#4a7c59`）を使用
- [ ] **T10-2** リアルタイムプレビューの動作を確認する
  - テンプレート切り替えが即座にプレビューに反映されること
  - 背景色・グラデーション・画像の変更が即座に反映されること
  - フォント・文字色の変更が即座に反映されること
  - イベント追加・編集・削除が即座に反映されること
- [ ] **T10-3** カレンダー全体のレイアウトを確認する
  - 左右並び（幅 1024px 以上）/ 上下並び（幅 1024px 未満）
  - 設定パネルはスクロール可能（`overflow-y-auto`）
- [ ] **T10-4** PNG 出力の画質を確認する
  - `pixelRatio: 2` で高解像度出力されること
  - フォントが正しく埋め込まれること
  - 背景画像・グラデーションが出力に反映されること

---

## タスク依存関係

```
T01 ─┬→ T02 ─┐
     └→ T03 ─┴→ T04 → T05 ─┬→ T06 ─┐
                              ├→ T07 ─┤→ T10
                              ├→ T08 ─┤
                              └→ T09 ─┘
```

- T02 と T03 は T01 完了後に並列着手可
- T06〜T09 は T05 完了後に並列着手可

| タスク | 前提タスク |
|--------|-----------|
| T02 | T01 |
| T03 | T01 |
| T04 | T02, T03 |
| T05 | T04 |
| T06 | T05 |
| T07 | T04, T05 |
| T08 | T04, T05 |
| T09 | T03, T05 |
| T10 | T06, T07, T08, T09 |


