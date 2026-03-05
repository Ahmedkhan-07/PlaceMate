/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                primary: '#2563EB',
                'primary-dark': '#1D4ED8',
                secondary: '#6366F1',
                background: '#F8F9FA',
                surface: '#FFFFFF',
                sidebar: '#1E3A5F',
                'sidebar-hover': '#2D5086',
                success: '#16A34A',
                'success-dark': '#15803D',
                warning: '#D97706',
                danger: '#DC2626',
                'danger-dark': '#B91C1C',
                'text-primary': '#1E293B',
                'text-secondary': '#64748B',
                border: '#E2E8F0',
                gold: '#F59E0B',
                silver: '#94A3B8',
                bronze: '#B45309',
                // Legacy aliases
                bg: '#F8F9FA',
                textPrimary: '#1E293B',
                textSecondary: '#64748B',
            },
            borderRadius: {
                sm: '6px',
                md: '12px',
                lg: '16px',
                xl: '20px',
                '2xl': '24px',
                full: '9999px',
            },
            boxShadow: {
                card: '0 4px 20px rgba(0,0,0,0.06)',
                'card-hover': '0 8px 30px rgba(0,0,0,0.10)',
                modal: '0 20px 60px rgba(0,0,0,0.15)',
                btn: '0 2px 8px rgba(37,99,235,0.18)',
                glow: '0 0 20px rgba(37,99,235,0.3)',
            },
            transitionTimingFunction: {
                smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            keyframes: {
                'slide-up': {
                    from: { transform: 'translateY(60px)', opacity: '0' },
                    to: { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-in': {
                    from: { opacity: '0', transform: 'translateX(-12px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                'scale-in': {
                    from: { opacity: '0', transform: 'scale(0.95)' },
                    to: { opacity: '1', transform: 'scale(1)' },
                },
                'flip-in': {
                    from: { transform: 'rotateY(90deg)' },
                    to: { transform: 'rotateY(0deg)' },
                },
                'spin-slow': { to: { transform: 'rotate(360deg)' } },
                shimmer: {
                    from: { backgroundPosition: '-200% 0' },
                    to: { backgroundPosition: '200% 0' },
                },
                confetti: {
                    '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
                    '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
                },
            },
            animation: {
                'slide-up': 'slide-up 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                'fade-in': 'fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                'slide-in': 'slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                'scale-in': 'scale-in 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                'flip-in': 'flip-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                'spin-slow': 'spin-slow 2s linear infinite',
                shimmer: 'shimmer 2s linear infinite',
                confetti: 'confetti 2s ease-out forwards',
            },
        },
    },
    plugins: [],
};
