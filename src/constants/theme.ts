import { Platform } from 'react-native';

/** Green + black dark palette */
export const Palette = {
  black: '#000000',
  card: '#1C1C1E',
  cardElevated: '#212225',
  border: '#2C2C2E',
  text: '#FFFFFF',
  textMuted: '#8E8E93',
  textDim: '#636366',
  green: '#34C759',
  greenBright: '#4CD964',
  accent: '#2ECC71',
  accentMuted: '#1a3d2e',
  red: '#FF453A',
  orange: '#FF9F0A',
  tabPill: '#1a3d2e',
  fab: '#34C759',
} as const;

export const Colors = {
  light: {
    text: Palette.text,
    background: Palette.black,
    backgroundElement: Palette.card,
    backgroundSelected: Palette.tabPill,
    textSecondary: Palette.textMuted,
  },
  dark: {
    text: Palette.text,
    background: Palette.black,
    backgroundElement: Palette.card,
    backgroundSelected: Palette.tabPill,
    textSecondary: Palette.textMuted,
  },
} as const;

export type ThemeColor = keyof (typeof Colors)['dark'];

export const Fonts = {
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }) as string,
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 84, android: 72, web: 72 }) ?? 72;
export const MaxContentWidth = 480;
