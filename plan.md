# 実装計画 — カレンダー画像作成アプリ

## 技術スタック

- **フレームワーク**: React（Vite + JSX）
- **スタイリング**: Tailwind CSS
- **PNG出力**: html-to-image
- **フォント**: Google Fonts（Noto Sans JP, Noto Serif JP, M PLUS Rounded 1c など）

---

## ディレクトリ構成

```
calendar-maker/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── SettingsPanel.jsx
│   │   ├── CalendarPreview.jsx
│   │   ├── CalendarGrid.jsx
│   │   ├── CalendarCell.jsx
│   │   ├── EventDialog.jsx
│   │   └── DownloadButton.jsx
│   ├── hooks/
│   │   ├── useCalendar.js
│   │   └── useEvents.js
│   ├── data/
│   │   ├── holidays.js
│   │   └── themes.js
│   └── utils/
│       ├── dateUtils.js
│       └── imageUtils.js
└── public/
```

---

## 実装ステップ

### Step 1: プロジェクト初期化

1. `npm create vite@latest . -- --template react` で Vite + React プロジェクトを初期化
2. `npm install` で依存関係をインストール
3. Tailwind CSS をセットアップ（`tailwind.config.js`, `postcss.config.js`）
4. `html-to-image` をインストール: `npm install html-to-image`
5. Google Fonts を `index.html` に追加

---

### Step 2: 祝日データ・テーマデータ

#### `src/data/holidays.js`

- 固定祝日（元日, 建国記念の日, 天皇誕生日, 昭和の日, 憲法記念日, みどりの日, こどもの日, 山の日, 文化の日, 勤労感謝の日）
- 移動祝日（成人の日, 海の日, 敬老の日, スポーツの日）をハッピーマンデー計算で算出
- 春分の日・秋分の日を天文計算の近似式で算出
- 振替休日の自動計算（祝日が日曜 → 翌月曜）

```js
// 主要な関数
export function getHolidays(year)  // 指定年の全祝日を { "YYYY-MM-DD": "祝日名" } で返す
export function isHoliday(dateStr) // 日付文字列が祝日か判定
```

#### `src/data/themes.js`

4テンプレートの `ThemeConfig` を定数として定義:

| キー | テンプレート名 |
|------|--------------|
| `simple` | シンプル・クリーン |
| `pop` | ポップ・カラフル |
| `dark` | ダーク・モノトーン |
| `japanese` | 和風・ジャパニーズ |

---

### Step 3: ユーティリティ

#### `src/utils/dateUtils.js`

```js
export function getDaysInMonth(year, month)   // 月の全日（前月末・翌月頭含む42マス）を返す
export function formatDate(date)               // Date → "YYYY-MM-DD"
export function getWeekday(year, month, day)   // 曜日インデックス取得
```

#### `src/utils/imageUtils.js`

```js
export function fileToBase64(file)            // File → Base64文字列（Promise）
export async function downloadCalendarPng(el) // DOM要素を PNG として保存（html-to-image使用）
```

---

### Step 4: カスタムフック

#### `src/hooks/useCalendar.js`

状態管理:

```js
const [year, setYear]       // 表示年
const [month, setMonth]     // 表示月（1-12）
const [theme, setTheme]     // ThemeConfig オブジェクト
```

提供する関数:
- `prevMonth()` / `nextMonth()` — 月送り
- `applyTemplate(key)` — テンプレート適用
- `updateTheme(patch)` — 個別カスタマイズ反映

#### `src/hooks/useEvents.js`

状態管理:

```js
const [events, setEvents]  // CalendarEvent[]
```

提供する関数:
- `addEvent(event)` — イベント追加（1日最大3件チェック）
- `updateEvent(id, patch)` — イベント更新
- `deleteEvent(id)` — イベント削除
- `getEventsForDate(dateStr)` — 日付でフィルタ

---

### Step 5: コンポーネント実装

#### `App.jsx`

- 左右レイアウト（`flex`）
- `useCalendar` / `useEvents` フックを呼び出し、子コンポーネントへ props として渡す
- イベントダイアログの表示状態管理（選択日付, 編集対象イベント）

#### `Header.jsx`

- アプリタイトル表示

#### `SettingsPanel.jsx`（左カラム）

サブセクション:
1. **年月選択** — `<select>` または `<input type="number">` + ボタン
2. **テンプレート選択** — 4ボタン、アクティブ強調
3. **背景設定** — カラーピッカー（`<input type="color">`）+ 画像アップロード（`<input type="file">`）
4. **フォント選択** — `<select>` でフォントファミリー切り替え
5. **文字色設定** — 通常/土曜/日曜&祝日 それぞれカラーピッカー

#### `CalendarPreview.jsx`（右カラム）

- `ref` を DOM に付け、PNG出力対象にする
- テーマの背景色・背景画像・フォントをインラインスタイルで適用
- `CalendarGrid` を内包

#### `CalendarGrid.jsx`

- 曜日ヘッダー（日〜土）表示
- 7列 × 6行のグリッドをレンダリング
- 各マスに `CalendarCell` を配置

#### `CalendarCell.jsx`

props: `date`, `isCurrentMonth`, `isToday`, `holiday`, `events`, `theme`, `onClick`

表示内容:
- 日付番号（前月・翌月はグレー、当月は通常色、土曜は `saturdayColor`、日曜/祝日は `holidayColor`）
- 祝日名（小テキスト）
- イベント名（最大3件、小テキスト）
- イベント画像（サムネイル、`object-fit: cover`）

#### `EventDialog.jsx`

- モーダルダイアログ
- 入力: イベント名（テキスト）、画像アップロード
- 既存イベント選択時: 編集フォーム + 削除ボタン
- バリデーション: タイトルが空の場合は保存不可

#### `DownloadButton.jsx`

- `html-to-image` の `toPng()` を使って `CalendarPreview` の DOM を PNG 保存
- ボタン押下中は「生成中...」表示

---

### Step 6: スタイリング

- Tailwind のユーティリティクラスを基本とする
- テーマ固有の色はインラインスタイル（`style` prop）で適用
- カレンダーグリッドは CSS Grid（`grid-cols-7`）
- レスポンシブ: デスクトップ優先（最小幅 1024px 想定）

---

### Step 7: PNG出力

```js
import { toPng } from 'html-to-image';

async function handleDownload(calendarRef) {
  const dataUrl = await toPng(calendarRef.current, { pixelRatio: 2 });
  const link = document.createElement('a');
  link.download = `calendar-${year}-${month}.png`;
  link.href = dataUrl;
  link.click();
}
```

- `pixelRatio: 2` で高解像度出力
- Google Fonts はCSS `@import` 経由で読み込み済みのため html-to-image で取得可能

---

## データ型定義

```typescript
type CalendarEvent = {
  id: string;
  date: string;        // "YYYY-MM-DD"
  title: string;
  image?: string;      // Base64
};

type ThemeConfig = {
  name: string;
  backgroundColor: string;
  backgroundImage?: string;
  fontFamily: string;
  textColor: string;
  saturdayColor: string;
  sundayColor: string;
  holidayColor: string;
  gridColor: string;
  headerStyle: Record<string, string>;
};
```

---

## 実装優先順位

| 優先度 | 内容 |
|--------|------|
| 高 | プロジェクト初期化、カレンダーグリッド表示、祝日計算 |
| 高 | テンプレート4種、PNG出力 |
| 中 | イベント追加/編集/削除、背景画像アップロード |
| 中 | フォント選択、文字色カスタマイズ |
| 低 | アニメーション、細かいUX改善 |

---

## 注意事項

- 全処理はクライアントサイドで完結（サーバー不要）
- 画像はBase64としてReact状態に保持（`localStorage` は使用しない）
- `html-to-image` はCORSに注意（外部画像はBase64変換必須）
- 振替休日の計算は国民の祝日に関する法律に基づく
