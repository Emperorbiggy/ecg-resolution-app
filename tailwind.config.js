import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                display: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    50:  '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
                surface: {
                    DEFAULT: '#ffffff',
                    dark: '#0f172a',
                    card: '#f8fafc',
                    'card-dark': '#1e293b',
                    border: '#e2e8f0',
                    'border-dark': '#334155',
                },
            },
            backgroundImage: {
                'gradient-brand': 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)',
                'gradient-hero':  'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e40af 100%)',
                'gradient-card':  'linear-gradient(135deg, rgba(30,64,175,0.1) 0%, rgba(59,130,246,0.05) 100%)',
                'gradient-success': 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
                'gradient-warning': 'linear-gradient(135deg, #92400e 0%, #d97706 100%)',
                'gradient-danger':  'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)',
            },
            boxShadow: {
                glass:    '0 4px 16px 0 rgba(31, 38, 135, 0.15)',
                'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
                card:     '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)',
                'card-lg': '0 4px 12px 0 rgba(0,0,0,0.1)',
                brand:    '0 4px 14px 0 rgba(37, 99, 235, 0.4)',
            },
            animation: {
                'fade-in':     'fadeIn 0.3s ease-out',
                'slide-up':    'slideUp 0.4s ease-out',
                'slide-down':  'slideDown 0.3s ease-out',
                'scale-in':    'scaleIn 0.2s ease-out',
                'bounce-soft': 'bounceSoft 0.6s ease-out',
                'shimmer':     'shimmer 1.5s infinite',
                'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%':   { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%':   { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%':   { opacity: '0', transform: 'translateY(-12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%':   { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                bounceSoft: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%':      { transform: 'translateY(-6px)' },
                },
                shimmer: {
                    '0%':   { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },

    plugins: [forms],
};
