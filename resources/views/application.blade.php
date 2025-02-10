<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>{{ config('app.name') }}</title>
    <link rel="icon" href="{{ asset('favicon.ico') }}" />
    <script src="https://kit.fontawesome.com/f03c46a869.js" crossorigin="anonymous"></script>
    @vite('resources/ts/main.tsx')
</head>
<body class="bg-gray-100 flex items-center justify-center h-screen">
    <div class="text-center">
        <h1 class="text-5xl font-bold text-gray-800 mb-4">Estamos en Mantenimiento</h1>
        <p class="text-gray-600 mb-8">Estamos trabajando para mejorar nuestro sitio. Por favor, vuelve más tarde.</p>
        <a href="/landing" class="inline-block px-6 py-3 bg-green-500 text-white font-semibold rounded hover:bg-green-600">Volver al Inicio</a>
    </div>
</body>
</html>