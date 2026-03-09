export const theme = {
    colors: {
        background: '#0A0A0E',
        surface: '#14141A',
        surfaceHighlight: '#1C1C24',
        primary: '#00F0FF',      // Neon Cyan
        secondary: '#FF003C',    // Cyberpunk Red
        accent: '#8A2BE2',       // Deep Purple
        text: '#FFFFFF',
        textDim: '#888890',
        border: '#2A2A35',
        glow: 'rgba(0, 240, 255, 0.5)',
        glowRed: 'rgba(255, 0, 60, 0.5)',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 20,
        round: 9999,
    },
    typography: {
        h1: { fontSize: 32, fontWeight: '700' as const, color: '#FFFFFF' },
        h2: { fontSize: 24, fontWeight: '700' as const, color: '#FFFFFF' },
        h3: { fontSize: 20, fontWeight: '600' as const, color: '#FFFFFF' },
        body: { fontSize: 16, color: '#FFFFFF' },
        caption: { fontSize: 14, color: '#888890' },
    }
};
