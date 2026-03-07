export { Colors } from './colors';
export type { ColorKey } from './colors';
export { FontFamily, FontSize, LineHeight } from './typography';
export { Spacing, BorderRadius, Shadow, MinTouchTarget } from './spacing';

// Convenience theme object
import { Colors } from './colors';
import { FontFamily, FontSize } from './typography';
import { Spacing, BorderRadius, Shadow, MinTouchTarget } from './spacing';

export const Theme = {
    colors: Colors,
    fonts: FontFamily,
    fontSize: FontSize,
    spacing: Spacing,
    radius: BorderRadius,
    shadow: Shadow,
    minTouchTarget: MinTouchTarget,
} as const;

export type AppTheme = typeof Theme;
