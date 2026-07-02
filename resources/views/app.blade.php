<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#1e40af">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="OIRS">

        <title inertia>{{ config('app.name', 'OIRS Merchant Portal') }}</title>

        <!-- Favicon & PWA Icons -->
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png">
        <link rel="apple-touch-icon" href="/icons/icon-192.png">
        @if(request()->routeIs('login'))
        <link rel="manifest" href="/manifest-staff.json">
        <meta name="apple-mobile-web-app-title" content="OIRS Staff">
        @else
        <link rel="manifest" href="/manifest.json">
        @endif

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia

        <script>
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
            }
        </script>
    </body>
</html>
