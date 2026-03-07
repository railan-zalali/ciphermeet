// CipherMeet Design Tokens — Colors
export const Colors = {
    // Background
    background: '#0A0A0F',
    surface: '#13131A',
    card: '#1C1C27',

    // Accents
    primary: '#7C5CFC',
    secondary: '#FF6B9D',
    success: '#22D3A5',
    warning: '#FFB547',
    error: '#FF4D6D',

    // Text
    textPrimary: '#F0F0FF',
    textSecondary: '#8A8AA8',
    textDisabled: '#3D3D55',

    // UI
    border: '#2A2A3D',
    overlay: 'rgba(0,0,0,0.7)',

    // Gradients (use with LinearGradient)
    gradientHero: ['#7C5CFC', '#FF6B9D'] as const,
    gradientSurface: ['#13131A', '#0A0A0F'] as const,

    // Transparents
    primaryAlpha15: 'rgba(124,92,252,0.15)',
    primaryAlpha35: 'rgba(124,92,252,0.35)',

    // Pure
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;
