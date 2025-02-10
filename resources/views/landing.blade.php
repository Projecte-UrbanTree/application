<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UrbanTree 5.0</title>
    @vite('resources/css/app.css')
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
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
        <section class="relative py-20 bg-gradient-to-b from-green-500 to-gray-50"> <!-- Añadido pt-12 para móviles -->
            <div class="max-w-screen-lg mx-auto flex flex-col md:flex-row items-center justify-between mt-20">
                <div class="text-center md:text-left ml-5 md:w-1/2">
                    <h2 class="text-4xl font-bold text-white mb-4">UrbanTree 5.0</h2>
                    <p class="text-lg text-green-100 mb-8 leading-snug">UrbanTree 5.0 ofrece herramientas innovadoras para monitorear y optimizar el mantenimiento de parques y jardines, mejorando la calidad de vida en las ciudades.</p>                    
                    <form action="{{ route('landingform.store') }}" method="POST" class="max-w-md mx-auto">
                        @csrf 
                        <div class="mb-4">
                            <input type="email" name="email" placeholder="Correo electrónico" class="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        </div>
                         <input type="hidden" name="subject" value="Demo">
                        <input type="hidden" name="message" value="Quiero probar Demo">
                        
                        <button type="submit" class="mt-8 inline-block px-8 py-3 bg-white text-green-600 font-semibold rounded-lg shadow-md hover:bg-green-600 hover:text-white transition duration-300">Quiero demo</button>
                    </form>
                </div>
                <div class="mt-8 md:mt-0 md:w-1/2">
                    <img class="w-64 max-w-xs mx-auto md:max-w-full rounded-lg border-gray-200 border-2" src="{{ asset('images/image.png') }}" alt="Urban Tree Mobile">
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
                <div class="bg-white p-6 rounded-xl shadow-lg text-center transition duration-300 hover:scale-105 border-2 border-gray-200">
                    <h3 class="text-xl font-bold text-green-600 mb-4">Monitoreo en Tiempo Real</h3>
                    <p class="text-gray-700">Accede a datos actualizados sobre el estado de parques y jardines.</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-lg text-center transition duration-300 hover:scale-105 border-2 border-gray-200">
                    <h3 class="text-xl font-bold text-green-600 mb-4">Optimización de Recursos</h3>
                    <p class="text-gray-700">Maximiza la eficiencia en el mantenimiento de áreas verdes.</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-lg text-center transition duration-300 hover:scale-105 border-2 border-gray-200">
                    <h3 class="text-xl font-bold text-green-600 mb-4">Informes Detallados</h3>
                    <p class="text-gray-700">Genera informes personalizados para tomar decisiones informadas.</p>
                </div>
            </div>
        </section>
        <!-- Pricing Section -->
        <section class="max-w-screen-lg mx-auto px-6 py-16">
            <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-green-600 mb-4">Planes de Precios</h2>
            <p class="text-gray-700">Elige el plan que mejor se adapte a tus necesidades.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="border-2 border-gray-200 bg-white p-6 rounded-xl shadow-lg text-center transition duration-300 hover:scale-105">
                <h3 class="text-xl font-bold text-green-600 mb-4">Básico</h3>
                <p class="text-2xl font-bold text-gray-800 mb-4">$199/mes</p>
                <ul class="ml-6 list-disc text-left text-gray-700 mb-6">
                    <li>Monitoreo en tiempo real</li>
                    <li>Optimización de recursos</li>
                    <li>Informes básicos</li>
                    <li>Soporte por correo electrónico (48h)</li>
                </ul>
                <button onclick="location.href='#form'" class="mt-20 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-300">Seleccionar</button>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-lg text-center transition duration-300 hover:scale-105 border-2 border-green-600 relative">
            <div class=" border-2 border-gray-200 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">Recomendado</div>
                <h3 class="text-xl font-bold text-green-600 mb-4">Estándar</h3>
                <p class="text-2xl font-bold text-gray-800 mb-4">$499/mes</p>
                <ul class="ml-6 list-disc text-left text-gray-700 mb-6">
                    <li>Monitoreo en tiempo real</li>
                    <li>Optimización de recursos</li>
                    <li>Informes detallados</li>
                    <li>Soporte por correo electrónico (24h)</li>
                    <li>Soporte prioritario</li>
                </ul>
                <button onclick="location.href='#form'" class="mt-14 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-300">Seleccionar</button>
            </div>
            <div class="border-2 border-gray-200 bg-white p-6 rounded-xl shadow-lg text-center transition duration-300 hover:scale-105 border-4 border-green-600">
                <h3 class="text-xl font-bold text-green-600 mb-4">Premium</h3>
                <p class="text-2xl font-bold text-gray-800 mb-4">$999/mes</p>
                <ul class="ml-6 list-disc text-left text-gray-700 mb-6">
                    <li>Monitoreo en tiempo real</li>
                    <li>Optimización de recursos</li>
                    <li>Informes avanzados</li>
                    <li>Soporte prioritario</li>
                    <li>Acceso a nuevas funcionalidades</li>
                </ul>
                <button onclick="location.href='#form'" class="mt-12 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-300">Seleccionar</button>
            </div>
            </div>
        </section>
        <!-- Proximamente y Formulario -->
        <section class="max-w-screen-lg mx-auto px-6 py-16">
            <div class="bg-white p-8 rounded-xl shadow-lg text-center">
                <h2 class="text-3xl font-bold text-green-600 mb-6">Página Web Próximamente</h2>
                <p class="text-gray-700 mb-8">Estamos trabajando en nuestra nueva página web. Mientras tanto, si tienes alguna pregunta, no dudes en contactarnos.</p>
                <form action="{{ route('landingform.store') }}" method="POST" class="max-w-md mx-auto" id="form">
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