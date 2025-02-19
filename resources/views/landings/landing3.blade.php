<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Urban Tree 5.0</title>
    @vite('resources/css/app.css')
</head>

<body class="bg-gray-100">
    {{-- Hero Section --}}
    <header class="relative bg-cover bg-center h-[450px] flex flex-col items-center justify-center" style="background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.75)), url('images/landings/landing3/hero-bg.jpg');">
        <div class="flex space-x-4 justify-end w-full pr-9">
            <a href="{{ route('set-language', ['lang' => 'es']) }}" class="text-black hover:text-green-600">Español</a>
            <a href="{{ route('set-language', ['lang' => 'ca']) }}" class="text-black hover:text-green-600">Català</a>
            <a href="{{ route('set-language', ['lang' => 'en']) }}" class="text-black hover:text-green-600">English</a>
            <a href="{{ url('/login') }}" class="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all">
            {{ __('landings/landing3.login') }}
            </a>
        </div>
        <img src="images/landings/landing3/urban_tree.png" alt="Urban Tree Logo" class="w-42 h-32 ">
        <h1 class="text-5xl md:text-7xl font-bold text-green-100">{{ __('landings/landing3.title') }}</h1>
        <p class="text-green-100 font-bold text-3xl mt-4">{{ __('landings/landing3.hero_text') }}</p>

    </header>

    <section class="container mx-auto py-16 text-center">
        <h2 class="text-3xl font-bold text-gray-800">{{ __('landings/landing3.pricing_plans') }}</h2>
        <p class="text-gray-600 mt-2">{{ __('landings/landing3.pricing_description') }}</p>

        <div class="grid md:grid-cols-3 gap-8 mt-10">
            {{-- Plan Municipal --}}
            <div class="bg-white shadow-lg rounded-lg p-6 border hover:scale-105 transition-transform">
                <h3 class="text-xl font-bold text-gray-800">{{ __('landings/landing3.plan_municipal') }}</h3>
                <p class="text-green-600 text-3xl font-bold mt-4">€149<span class="text-lg">{{ __('landings/landing3.plan') }}</span></p>
                <ul class="mt-4 text-gray-600">
                    <li>✅ {{ __('landings/landing3.plan_municipal_features1') }}</li>
                    <li>✅ {{ __('landings/landing3.plan_municipal_features2') }}</li>
                    <li>✅ {{ __('landings/landing3.plan_municipal_features3') }}</li>
                    <li>✅ {{ __('landings/landing3.plan_municipal_features4') }}</li>
                </ul>
                <button class="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">{{ __('landings/landing3.button_request_info') }}</button>
            </div>

            {{-- Plan Provincial (Más popular) --}}
            <div class="bg-green-50 shadow-lg rounded-lg p-6 border-2 border-green-600 hover:scale-105 transition-transform">
                <h3 class="text-xl font-bold text-gray-800">{{ __('landings/landing3.plan_provincial') }}</h3>
                <p class="text-green-600 text-3xl font-bold mt-4">€399<span class="text-lg">{{ __('landings/landing3.plan') }}</span></p>
                <ul class="mt-4 text-gray-600">
                    <li>✅ {{ __('landings/landing3.plan_provincial_features1') }}</li>
                    <li>✅ {{ __('landings/landing3.plan_provincial_features2') }}</li>
                    <li>✅ {{ __('landings/landing3.plan_provincial_features3') }}</li>
                    <li>✅ {{ __('landings/landing3.plan_provincial_features4') }}</li>
                    <li>✅ {{ __('landings/landing3.plan_provincial_features5') }}</li>
                </ul>
                <button class="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">{{ __('landings/landing3.button_request_info') }}</button>
            </div>

            {{-- Plan Nacional --}}
            <div class="bg-white shadow-lg rounded-lg p-6 border hover:scale-105 transition-transform">
                <h3 class="text-xl font-bold text-gray-800">{{ __('landings/landing3.plan_national') }}</h3>
                <p class="text-green-600 text-3xl font-bold mt-4">€799<span class="text-lg">{{ __('landings/landing3.plan') }}</span></p>
                <ul class="mt-4 text-gray-600">
                    <li>✅ {{ __('landings/landing3.plan_national_features1') }}</li>
                    <li>✅ {{ __('landings/landing3.plan_national_features2') }}</li>
                    <li>✅ {{ __('landings/landing3.plan_national_features3') }}</li>
                    <li>✅ {{ __('landings/landing3.plan_national_features4') }}</li>
                    <li>✅ {{ __('landings/landing3.plan_national_features5') }}</li>
                </ul>
                <button class="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">{{ __('landings/landing3.button_request_info') }}</button>
            </div>
        </div>
    </section>


    <section class="container mx-auto py-16">
        <h2 class="text-3xl font-bold text-center text-gray-800">{{ __('landings/landing3.features_section') }}</h2>
        <div class="grid md:grid-cols-3 gap-8 mt-10">
            <div class="bg-white shadow-lg rounded-lg p-6 text-center">
                <div class="text-green-600 text-6xl mb-4">🌱</div>
                <h3 class="text-xl font-semibold">{{ __('landings/landing3.feature_management') }}</h3>
                <p class="text-gray-600 mt-2">{{ __('landings/landing3.feature_management_desc') }}</p>
            </div>
            <div class="bg-white shadow-lg rounded-lg p-6 text-center">
                <div class="text-green-600 text-6xl mb-4">⚙️</div>
                <h3 class="text-xl font-semibold">{{ __('landings/landing3.feature_automation') }}</h3>
                <p class="text-gray-600 mt-2">{{ __('landings/landing3.feature_automation_desc') }}</p>
            </div>
            <div class="bg-white shadow-lg rounded-lg p-6 text-center">
                <div class="text-green-600 text-6xl mb-4">📊</div>
                <h3 class="text-xl font-semibold">{{ __('landings/landing3.feature_reports') }}</h3>
                <p class="text-gray-600 mt-2">{{ __('landings/landing3.feature_reports_desc') }}</p>
            </div>
        </div>
    </section>

    <section class="container mx-auto py-16">
        <h2 class="text-3xl font-bold text-center text-gray-800">{{ __('landings/landing3.contact_section') }}</h2>
        <div class="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8 mt-8 shadow-2xl">
            <form action="#" method="POST">
                <div class="mb-4">
                    <label class="block text-gray-700 font-semibold">{{ __('landings/landing3.contact_name') }}</label>
                    <input type="text" class="w-full border p-2 rounded-lg" required>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 font-semibold">{{ __('landings/landing3.contact_email') }}</label>
                    <input type="email" class="w-full border p-2 rounded-lg" required>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 font-semibold">{{ __('landings/landing3.contact_phone') }}</label>
                    <input type="text" class="w-full border p-2 rounded-lg">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 font-semibold">{{ __('landings/landing3.contact_message') }}</label>
                    <textarea class="w-full border p-2 rounded-lg" rows="4"></textarea>
                </div>
                <button type="submit" class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">{{ __('landings/landing3.contact_send') }}</button>
            </form>
        </div>
    </section>

    <footer class="bg-gray-800 text-white text-center py-4">
        {{ __('landings/landing3.footer_rights') }}
    </footer>
</body>
</html>
