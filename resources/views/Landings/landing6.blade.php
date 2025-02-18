<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('landings/landing6.title') }}</title>
    @vite('resources/css/app.css')
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
    <div class="bg-gray-50">
        <!-- Header -->
        <header class="fixed w-full bg-white shadow-lg border-1 border-gray-200 z-10">
            <div class="max-w-screen-lg mx-auto flex items-center justify-between p-3">
                <a href="/" class="">
                    <img class="h-12 ml-2" src="{{ asset('images/logos/isotype.png') }}" alt="Urban Tree Logo">
                </a>
                <div class="flex space-x-4 items-center">
                    <a href="{{ route('set-language', ['lang' => 'es']) }}" class="w-8"><img src="{{ asset('images/landings/landing6/es.png') }}" alt="Español"></a>
                    <a href="{{ route('set-language', ['lang' => 'en']) }}" class="w-8"><img src="{{ asset('images/landings/landing6/us.png') }}" alt="Ingles"></a>
                    <a href="{{ route('set-language', ['lang' => 'ca']) }}" class="w-8"><img src="{{ asset('images/landings/landing6/es-ct.png') }}" alt="Catala"></a>
                    <a href="/" class="mr-2 inline-block px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-green-200 transition duration-300">Acceso Panel</a>     
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="">
            @php
                $lang = app()->getLocale(); // Obtener idioma actual
                $banner = ($lang === 'es') ? 'bannerEs.jpg' : (($lang === 'ca') ? 'bannerCa.jpg' : 'bannerEn.jpg');
            @endphp
            <!-- Hero Section -->
            <section class="relative py-20 bg-gradient-to-b from-green-500 to-gray-50"> 
                <div class="max-w-screen-lg mx-auto flex flex-col md:flex-row items-center justify-between">
                    <div class="text-center md:text-left ml-5 md:w-1/2 mt-20 md:mt-0">
                        <h2 class="text-4xl font-bold text-white mb-4">{{ __('landings/landing6.title') }}</h2>
                        <p class="text-lg text-green-100 mb-8 leading-snug">{{ __('landings/landing6.description') }}</p>                    
                        <form action="{{ route('landing.form', ['number' => 11]) }}" method="POST">
                            @csrf 
                            <div class="flex items-center gap-4 mb-4">
                                <input type="email" name="email" placeholder="{{ __('landings/landing6.placeholder_email') }}" 
                                    class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                <button type="submit" 
                                    class="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-white hover:text-green-600 border border-green-600 transition duration-300">
                                    {{ __('landings/landing6.button') }}
                                </button>
                            </div>
                            <input type="hidden" name="subject" value="Demo">
                            <input type="hidden" name="message" value="Quiero probar Demo">
                        </form>
                    </div>
                    <div class=" md:mt-0 md:w-1/2">
                        <img class="max-w-xs mx-auto md:max-w-64 rounded-lg" src="{{ asset('images/landings/landing6/mobile.png') }}" alt="Urban Tree Mobile">
                    </div>  
                </div>
            </section>

            <!-- Features Section -->
            <section class="max-w-screen-lg mx-auto px-6 py-16">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-green-600 mb-4">{{ __('landings/landing6.features_title') }}</h2>
                    <p class="text-gray-700">{{ __('landings/landing6.features_description') }}</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="bg-white p-6 rounded-xl shadow-lg text-center transition duration-300 hover:scale-105 border-2 border-gray-200">
                        <h3 class="text-xl font-bold text-green-600 mb-4">{{ __('landings/landing6.feature_1_title') }}</h3>
                        <p class="text-gray-700">{{ __('landings/landing6.feature_1_description') }}</p>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-lg text-center transition duration-300 hover:scale-105 border-2 border-gray-200">
                        <h3 class="text-xl font-bold text-green-600 mb-4">{{ __('landings/landing6.feature_2_title') }}</h3>
                        <p class="text-gray-700">{{ __('landings/landing6.feature_2_description') }}</p>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-lg text-center transition duration-300 hover:scale-105 border-2 border-gray-200">
                        <h3 class="text-xl font-bold text-green-600 mb-4">{{ __('landings/landing6.feature_3_title') }}</h3>
                        <p class="text-gray-700">{{ __('landings/landing6.feature_3_description') }}</p>
                    </div>
                </div>
            </section>
            <!-- Pricing Section -->
            <section class="max-w-screen-lg mx-auto px-6 py-16">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-green-600 mb-4">{{ __('landings/landing6.pricing_title') }}</h2>
                    <p class="text-gray-700">{{ __('landings/landing6.pricing_description') }}</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="border-2 border-gray-200 bg-white p-6 rounded-xl shadow-lg text-center transition duration-300 hover:scale-105">
                        <h3 class="text-xl font-bold text-green-600 mb-4">{{ __('landings/landing6.plan_basic') }}</h3>
                        <p class="text-2xl font-bold text-gray-800 mb-4">{{ __('landings/landing6.plan_basic_price') }}</p>
                        <ul class="ml-6 list-disc text-left text-gray-700 mb-6">
                            @foreach(__('landings/landing6.plan_basic_features') as $feature)
                                <li>{{ $feature }}</li>
                            @endforeach
                        </ul>
                        <button onclick="location.href='#form'" class="mt-20 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-300">{{ __('landings/landing6.select_button') }}</button>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-lg text-center transition duration-300 hover:scale-105 border-2 border-green-600 relative">
                        <div class="border-2 border-gray-200 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">Recomendado</div>
                        <h3 class="text-xl font-bold text-green-600 mb-4">{{ __('landings/landing6.plan_standard') }}</h3>
                        <p class="text-2xl font-bold text-gray-800 mb-4">{{ __('landings/landing6.plan_standard_price') }}</p>
                        <ul class="ml-6 list-disc text-left text-gray-700 mb-6">
                            @foreach(__('landings/landing6.plan_standard_features') as $feature)
                                <li>{{ $feature }}</li>
                            @endforeach
                        </ul>
                        <button onclick="location.href='#form'" class="mt-14 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-300">{{ __('landings/landing6.select_button') }}</button>
                    </div>
                    <div class="border-2 border-gray-200 bg-white p-6 rounded-xl shadow-lg text-center transition duration-300 hover:scale-105">
                        <h3 class="text-xl font-bold text-green-600 mb-4">{{ __('landings/landing6.plan_premium') }}</h3>
                        <p class="text-2xl font-bold text-gray-800 mb-4">{{ __('landings/landing6.plan_premium_price') }}</p>
                        <ul class="ml-6 list-disc text-left text-gray-700 mb-6">
                            @foreach(__('landings/landing6.plan_premium_features') as $feature)
                                <li>{{ $feature }}</li>
                            @endforeach
                        </ul>
                        <button onclick="location.href='#form'" class="mt-12 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-300">{{ __('landings/landing6.select_button') }}</button>
                    </div>
                </div>
            </section>
            <!-- Proximamente y Formulario -->
            <section class="max-w-screen-lg mx-auto px-6 py-16">
                <div class="bg-white p-8 rounded-xl shadow-lg text-center">
                    <h2 class="text-3xl font-bold text-green-600 mb-6">{{ __('landings/landing6.coming_soon_title') }}</h2>
                    <p class="text-gray-700 mb-8">{{ __('landings/landing6.coming_soon_description') }}</p>
                    <form action="{{ route('landing.form', ['number' => 11]) }}" method="POST" class="max-w-md mx-auto" id="form">
                        @csrf 
                        <div class="mb-4">
                            <input type="email" name="email" placeholder="{{ __('landings/landing6.placeholder_email') }}" class="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        </div>
                        <div class="mb-4">
                            <input type="text" name="subject" placeholder="{{ __('landings/landing6.form_placeholder_subject') }}" class="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        </div>
                        <div class="mb-4">
                            <textarea placeholder="{{ __('landings/landing6.form_placeholder_message') }}" name="message" class="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" rows="4"></textarea>
                        </div>
                        <button type="submit" class="w-full px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-300">{{ __('landings/landing6.form_button') }}</button>
                    </form>
                </div>
            </section>
        </main>

        <!-- Footer -->
        <footer class="bg-gray-800 text-white text-center py-6">
            <div class="max-w-screen-lg mx-auto">
                <div class="flex flex-col justify-between items-center">
                    <div class="mb-4 md:mb-0">
                        <p class="text-sm">&copy; {{ __('landings/landing6.footer_rights') }}</p>
                    </div>
                    <br>
                    <div class="flex flex-row space-x-4 mt-4">
                        <a href="https://www.lamoncloa.gob.es/" target="_blank" rel="noopener noreferrer">
                            <img src="{{ asset('images/external-logos/1-Gobierno-ministerio.png')}}" alt="Gobierno" class="h-12">
                        </a>
                        <a href="https://planderecuperacion.gob.es/" target="_blank" rel="noopener noreferrer">
                            <img src="{{ asset('images/external-logos/2-PRTR.png')}}" alt="PRTR" class="h-12">
                        </a>
                        <a href="https://ec.europa.eu/info/strategy/recovery-plan-europe_en" target="_blank" rel="noopener noreferrer">
                            <img src="{{ asset('images/external-logos/3-UE-NextGeneration.jpg')}}" alt="Next Generation" class="h-12">
                        </a>
                        <a href="https://www.institutmontsia.cat/" target="_blank" rel="noopener noreferrer">
                            <img src="{{ asset('images/external-logos/4-Institut Montsià.jpeg')}}" alt="Institut Montsia" class="h-12">
                        </a>
                        <a href="https://www.lamalvesia.com/" target="_blank" rel="noopener noreferrer">
                            <img src="{{ asset('images/external-logos/5-La Malvesia.jpg')}}" alt="La Malvesia" class="h-12">
                        </a>
                        <a href="https://www.projar.es/" target="_blank" rel="noopener noreferrer">
                            <img src="{{ asset('images/external-logos/6-Projar.png')}}" alt="Projar" class="h-12">
                        </a>
                    </div>
                    <br>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-400 hover:text-white transition duration-300" style="margin: 0 8px;">{{ __('landings/landing6.footer_privacy') }}</a>
                        <a href="#" class="text-gray-400 hover:text-white transition duration-300" style="margin: 0 8px;">{{ __('landings/landing6.footer_terms') }}</a>
                        <a href="#" class="text-gray-400 hover:text-white transition duration-300" style="margin: 0 8px;">{{ __('landings/landing6.footer_contact') }}</a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</body>
</html>