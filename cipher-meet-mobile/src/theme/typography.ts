// CipherMeet Design Tokens — Typography
// Uses system fallbacks until custom fonts are loaded
export const FontFamily = {
    display: 'ClashDisplay-Variable',
    displayFallback: 'System',
    body: 'DMSans-Regular',
    bodyMedium: 'DMSans-Medium',
    bodySemiBold: 'DMSans-SemiBold',
    bodyBold: 'DMSans-Bold',
    mono: 'JetBrainsMono-Regular',
    monoMedium: 'JetBrainsMono-Medium',
    // Fallbacks
    bodyFallback: 'System',
    monoFallback: 'Courier',
} as const;

export const FontSize = {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
} as const;

export const LineHeight = {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
} as const;
