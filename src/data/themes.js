/**
 * デザインテンプレート定義
 * @typedef {Object} BackgroundGradient
 * @property {string} startColor
 * @property {string} endColor
 * @property {string} direction
 *
 * @typedef {Object} ThemeConfig
 * @property {string} name
 * @property {string} backgroundColor
 * @property {BackgroundGradient} [backgroundGradient]
 * @property {string} [backgroundImage]
 * @property {string} fontFamily
 * @property {string} textColor
 * @property {string} saturdayColor
 * @property {string} sundayColor
 * @property {string} holidayColor
 * @property {string} gridColor
 * @property {Object} headerStyle
 */

/** @type {Record<string, ThemeConfig>} */
export const THEMES = {
  simple: {
    name: 'シンプル・クリーン',
    backgroundColor: '#ffffff',
    fontFamily: "'Noto Sans JP', sans-serif",
    textColor: '#333333',
    saturdayColor: '#2563eb',
    sundayColor: '#dc2626',
    holidayColor: '#dc2626',
    gridColor: '#dddddd',
    headerStyle: {
      backgroundColor: '#ffffff',
      color: '#333333',
      borderBottom: '2px solid #dddddd',
    },
  },

  pop: {
    name: 'ポップ・カラフル',
    backgroundColor: '#e0f2fe',
    backgroundGradient: {
      startColor: '#e0f2fe',
      endColor: '#fae8ff',
      direction: 'to bottom right',
    },
    fontFamily: "'M PLUS Rounded 1c', sans-serif",
    textColor: '#1e293b',
    saturdayColor: '#0ea5e9',
    sundayColor: '#f43f5e',
    holidayColor: '#f43f5e',
    gridColor: '#bae6fd',
    headerStyle: {
      backgroundColor: '#7dd3fc',
      color: '#0c4a6e',
      borderRadius: '8px 8px 0 0',
    },
  },

  dark: {
    name: 'ダーク・モノトーン',
    backgroundColor: '#1a1a2e',
    fontFamily: "'Noto Sans JP', sans-serif",
    textColor: '#e2e8f0',
    saturdayColor: '#93c5fd',
    sundayColor: '#fca5a5',
    holidayColor: '#fca5a5',
    gridColor: '#334155',
    headerStyle: {
      backgroundColor: '#0f172a',
      color: '#94a3b8',
      borderBottom: '1px solid #334155',
    },
  },

  japanese: {
    name: '和風・ジャパニーズ',
    backgroundColor: '#fdf6ec',
    fontFamily: "'Zen Kurenaido', sans-serif",
    textColor: '#2d1b0e',
    saturdayColor: '#2c4770',
    sundayColor: '#c0392b',
    holidayColor: '#c0392b',
    gridColor: '#d4b896',
    headerStyle: {
      backgroundColor: '#f5e6d3',
      color: '#4a7c59',
      borderBottom: '2px solid #d4b896',
      letterSpacing: '0.1em',
    },
  },
}

/** デフォルトテンプレートキー */
export const DEFAULT_THEME_KEY = 'simple'
