/**
 * Mobile-First Design Tokens
 * Optimized for smartphone screens with consistent spacing and sizing
 */

// Spacing Scale (Mobile-Optimized)
export const MOBILE_SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
} as const;

// Typography Scale
export const MOBILE_TYPOGRAPHY = {
    sizes: {
        h1: 28,      // Screen titles
        h2: 20,      // Section headers
        body: 16,    // Default text
        caption: 14, // Secondary text
        small: 12,   // Meta info
    },
    weights: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
    lineHeights: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.6,
    },
} as const;

// Card Heights (Fixed for Consistency)
export const CARD_HEIGHTS = {
    agentCard: 80,
    historyCard: 88,
    quickAction: 60,
    profileCard: 80,
} as const;

// Touch Targets (Minimum sizes for mobile)
export const TOUCH_TARGETS = {
    minimum: 48,
    comfortable: 56,
} as const;

// Accent Colors (extends Vercel theme)
export const ACCENT_COLORS = {
    primary: '#0070F3',    // Vercel Blue
    success: '#0CDA7C',    // Success Green
    warning: '#F5A623',    // Warning Amber
    error: '#FF4757',      // Error Red
} as const;

// Border Radius
export const MOBILE_RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
} as const;

// Animation Durations
export const ANIMATION = {
    fast: 150,
    normal: 250,
    slow: 350,
} as const;

export const GRADIENT_PRESETS = [
    ['#0070f3', '#00DFD8'], // Vercel Blue
    ['#FF0080', '#7928CA'], // Pink/Purple
    ['#FF4D4D', '#F9CB28'], // Red/Orange
    ['#00c853', '#B2FF59'], // Green/Lime
    ['#7928CA', '#FF0080'], // Purple/Pink
    ['#4CC9F0', '#4361EE'], // Sky/Blue
];
