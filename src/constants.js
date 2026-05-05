// Watermark configuration constants
export const WATERMARK_CONFIG = {
  DEFAULT_TEXT: '仅用于xxxxx使用',
  DEFAULT_ALPHA: 50,
  DEFAULT_COLOR: '#c3c3c3',
  DEFAULT_SIZE: 24,
  DEFAULT_ROTATE: 45,
  DEFAULT_GAP: 32,
  DEFAULT_COUNT: 50,
  ROW_MULTIPLIER: 3,
  TEXT_SEPARATOR: '   ',
  EXTRA_COLUMNS: 5,
  EXTRA_ROWS: 10,
  DEBOUNCE_DELAY_MS: 300,
  MAX_FILE_SIZE_MB: 20,
  DEFAULT_DOWNLOAD_FILENAME: 'download',
  ALPHA_MIN: 0,
  ALPHA_MAX: 100,
  SIZE_MIN: 0,
  SIZE_MAX: 100,
  COUNT_MIN: 40,
  COUNT_MAX: 600,
  ROTATE_MIN: 0,
  ROTATE_MAX: 90,
  GAP_MIN: 32,
  GAP_MAX: 100,
  MOBILE_BREAKPOINT: 750,
};

export const FONT_OPTIONS = [
  { markedFont: 'Arial', label: '默认' },
  { markedFont: '仿宋', label: '仿宋' },
  { markedFont: '楷体', label: '楷体' },
  { markedFont: '宋体', label: '宋体' },
  { markedFont: '黑体', label: '黑体' },
];

export const PREDEFINE_COLORS = [
  '#000000',
  '#ffffff',
  '#c3c3c3',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#1e90ff',
  '#c71585',
];
