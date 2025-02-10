<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UrbanTree 5.0</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
        }
        /* Habilitar transformaciones y transiciones */
        .hover\:scale-105:hover {
            transform: scale(1.05);
        }
        .transition-transform {
            transition-property: transform;
        }

    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="fixed w-full bg-white shadow-lg border-1 border-gray-200 z-10">
        <div class="max-w-screen-lg mx-auto flex items-center justify-between p-3">
            <a href="/">
                <img class="h-12" src="{{ asset('images/logo.png') }}" alt="Urban Tree Logo">
            </a>
            <a href="/" class="inline-block px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-green-200 transition duration-300">Acceso Panel</a>     
        </div>
    </header>

    <!-- Main Content -->
    <main class="">
        <!-- Hero Section -->
        <section class="relative py-20 bg-gradient-to-b from-green-500 to-gray-50">
            <div class="max-w-screen-lg mx-auto flex flex-col md:flex-row items-center justify-between">
                <div class="text-center md:text-left ml-5 md:w-1/2">
                    <h2 class="text-4xl font-bold text-white mb-4">UrbanTree 5.0</h2>
                    <p class="text-lg text-green-100 mb-8 leading-snug">UrbanTree 5.0 ofrece herramientas innovadoras para monitorear y optimizar el mantenimiento de parques y jardines, mejorando la calidad de vida en las ciudades.</p>                    
                    <form action="{{ route('landingform.store') }}" method="POST" class="max-w-md mx-auto">
                        @csrf 
                        <div class="mb-4">
                            <input type="email" name="email" placeholder="Correo electrónico" class="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        </div>
                        <button type="submit" class="mt-8 inline-block px-8 py-3 bg-white text-green-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition duration-300">Quiero demo</button>
                    </form>
                </div>
                <div class="mt-8 md:mt-0 md:w-1/2">
                    <img class="w-full max-w-xs mx-auto md:max-w-full" src="{{ asset('images/logo.png') }}" alt="Urban Tree Logo">
                </div>  
            </div>
        </section>

        <!-- Features Section -->
        <section class="max-w-screen-lg mx-auto px-6 py-16">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-green-600 mb-4">Características Principales</h2>
                <p class="text-gray-700">Descubre las funcionalidades que hacen de UrbanTree 5.0 la mejor opción para la gestión de espacios verdes.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-white p-6 rounded-xl shadow-lg text-center transition duration-300 hover:scale-105">
                    <h3 class="text-xl font-bold text-green-600 mb-4">Monitoreo en Tiempo Real</h3>
                    <p class="text-gray-700">Accede a datos actualizados sobre el estado de parques y jardines.</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-lg text-center transition duration-300 hover:scale-105">
                    <h3 class="text-xl font-bold text-green-600 mb-4">Optimización de Recursos</h3>
                    <p class="text-gray-700">Maximiza la eficiencia en el mantenimiento de áreas verdes.</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-lg text-center transition duration-300 hover:scale-105">
                    <h3 class="text-xl font-bold text-green-600 mb-4">Informes Detallados</h3>
                    <p class="text-gray-700">Genera informes personalizados para tomar decisiones informadas.</p>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section class="max-w-screen-lg mx-auto px-6 py-16">
            <div class="bg-white p-8 rounded-xl shadow-lg text-center">
                <h2 class="text-3xl font-bold text-green-600 mb-6">UrbanTree 5.0</h2>
                <p class="text-gray-700 mb-8">Tecnología para ciudades más verdes.</p>
            </div>
        </section>

        <!-- Proximamente y Formulario -->
        <section class="max-w-screen-lg mx-auto px-6 py-16">
            <div class="bg-white p-8 rounded-xl shadow-lg text-center">
                <h2 class="text-3xl font-bold text-green-600 mb-6">Página Web Próximamente</h2>
                <p class="text-gray-700 mb-8">Estamos trabajando en nuestra nueva página web. Mientras tanto, si tienes alguna pregunta, no dudes en contactarnos.</p>
                <form action="{{ route('landingform.store') }}" method="POST" class="max-w-md mx-auto">
                    @csrf 
                    <div class="mb-4">
                        <input type="email" name="email" placeholder="Correo electrónico" class="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    </div>
                    <div class="mb-4">
                        <input type="text" name="subject" placeholder="Tema" class="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    </div>
                    <div class="mb-4">
                        <textarea placeholder="Mensaje" name="message" class="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" rows="4"></textarea>
                    </div>
                    <button type="submit" class="w-full px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-300">Enviar</button>
                </form>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white text-center py-6">
        <p class="text-sm">&copy; 2024-2025 UrbanTree 5.0. Todos los derechos reservados.</p>
    </footer>
</body>
</html>