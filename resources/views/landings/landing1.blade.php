<!DOCTYPE html>
<html lang="{{ session('locale', config('app.locale')) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('landings/landing1.title') }}</title>
    <script src="https://kit.fontawesome.com/YOUR_KIT.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
</head>

<body class="bg-gray-100 text-gray-900">
    <div class="min-h-screen flex flex-col items-center p-0">
        <header class="w-full flex items-center justify-between py-6 px-8 bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg">
            <div class="flex items-center">
                <img src="/logo/UrbanTree.png" alt="UrbanTree" class="h-12 mr-4">
            </div>
            <div class="text-center flex-grow">
                <h1 class="text-5xl font-bold text-center">UrbanTree 5.0</h1>
            </div>
            <div class="flex space-x-4">
                <a href="{{ route('set-language', ['lang' => 'es']) }}" class="text-gray-700 hover:text-green-600">🇪🇸 Español</a>
                <a href="{{ route('set-language', ['lang' => 'en']) }}" class="text-gray-700 hover:text-green-600">🇬🇧 English</a>
                <a href="{{ route('set-language', ['lang' => 'ca']) }}" class="text-gray-700 hover:text-green-600">🇨🇦 Català</a>
            </div>
        </header>

        <h1 class="text-4xl font-bold mt-6 mb-4 text-center">{{ __('landings/landing1.discover') }}</h1>
        <p class="text-lg text-gray-700 text-center mb-6">{{ __('landings/landing1.description') }}</p>

        <div class="grid md:grid-cols-3 gap-6 w-full max-w-4xl mb-10 mt-6">
            <!-- Aquí va la resta del contingut... -->
        </div>

        <!-- Secció de Preus -->
        <div class="w-full max-w-4xl text-center mb-10">
            <h2 class="text-3xl font-bold mb-6">{{ __('landings/landing1.choose_plan') }}</h2>
            <div class="grid md:grid-cols-3 gap-6">
                <div class="p-8 bg-white shadow-lg rounded-lg text-center transform transition-transform hover:-translate-y-2 hover:shadow-2xl product-card" onclick="selectProduct(this)">
                    <h3 class="text-2xl font-semibold mb-3">{{ __('landings/landing1.basic') }}</h3>
                    <p class="text-xl font-bold text-green-600">€300/{{ __('landings/landing1.month') }}</p>
                    <p class="text-gray-600 mb-4">{{ __('landings/landing1.default_app') }}</p>
                    <ul class="text-left text-gray-700 mb-4">
                        <li>{{ __('landings/landing1.basic_features') }}</li>
                        <li>{{ __('landings/landing1.limited_support') }}</li>
                        <li>{{ __('landings/landing1.access_updates') }}</li>
                    </ul>
                    <a href="#" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">{{ __('landings/landing1.select') }}</a>
                </div>
                <div class="p-8 bg-white shadow-lg rounded-lg text-center transform transition-transform hover:-translate-y-2 hover:shadow-2xl product-card" onclick="selectProduct(this)">
                    <h3 class="text-2xl font-semibold mb-3">{{ __('landings/landing1.premium') }}</h3>
                    <p class="text-xl font-bold text-green-600">€600/{{ __('landings/landing1.month') }}</p>
                    <p class="text-gray-600 mb-4">{{ __('landings/landing1.custom_app') }}</p>
                    <ul class="text-left text-gray-700 mb-4">
                        <li>{{ __('landings/landing1.all_features') }}</li>
                        <li>{{ __('landings/landing1.priority_support') }}</li>
                        <li>{{ __('landings/landing1.access_updates_new_features') }}</li>
                    </ul>
                    <a href="#" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">{{ __('landings/landing1.select') }}</a>
                </div>
                <div class="p-8 bg-white shadow-lg rounded-lg text-center transform transition-transform hover:-translate-y-2 hover:shadow-2xl product-card" onclick="selectProduct(this)">
                    <h3 class="text-2xl font-semibold mb-3">{{ __('landings/landing1.enterprise') }}</h3>
                    <p class="text-xl font-bold text-green-600">{{ __('landings/landing1.contact_us') }}</p>
                    <p class="text-gray-600 mb-4">{{ __('landings/landing1.customized_app') }}</p>
                    <ul class="text-left text-gray-700 mb-4">
                        <li>{{ __('landings/landing1.custom_solution') }}</li>
                        <li>{{ __('landings/landing1.dedicated_support') }}</li>
                        <li>{{ __('landings/landing1.consulting_training') }}</li>
                    </ul>
                    <a href="#" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">{{ __('landings/landing1.contact') }}</a>
                </div>
            </div>
        </div>

        <!-- Secció de Testimonis -->
        <section class="w-full max-w-4xl text-center mb-10">
            <h2 class="text-3xl font-bold mb-6">{{ __('landings/landing1.testimonials') }}</h2>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="p-6 bg-white shadow-lg rounded-lg transform transition-transform hover:-translate-y-2 hover:shadow-2xl">
                    <p class="text-lg text-gray-700 mb-4">{{ __('landings/landing1.testimonial1') }}</p>
                    <p class="text-gray-600 font-semibold">- Maria, {{ __('landings/landing1.environmental_manager') }}</p>
                </div>
                <div class="p-6 bg-white shadow-lg rounded-lg transform transition-transform hover:-translate-y-2 hover:shadow-2xl">
                    <p class="text-lg text-gray-700 mb-4">{{ __('landings/landing1.testimonial2') }}</p>
                    <p class="text-gray-600 font-semibold">- Joan, {{ __('landings/landing1.mayor') }}</p>
                </div>
            </div>
        </section>

        <!-- Secció de Contacte -->
        <section class="w-full max-w-4xl text-center mb-10">
            <h2 class="text-3xl font-bold mb-6">{{ __('landings/landing1.contact_us') }}</h2>
            <form class="bg-white shadow-lg rounded-lg p-6">
                <div class="mb-4">
                    <label for="name" class="block text-gray-700 text-sm font-bold mb-2">{{ __('landings/landing1.name') }}</label>
                    <input type="text" id="name" name="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="{{ __('landings/landing1.your_name') }}">
                </div>
                <div class="mb-4">
                    <label for="email" class="block text-gray-700 text-sm font-bold mb-2">{{ __('landings/landing1.email') }}</label>
                    <input type="email" id="email" name="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="{{ __('landings/landing1.your_email') }}">
                </div>
                <div class="mb-4">
                    <label for="message" class="block text-gray-700 text-sm font-bold mb-2">{{ __('landings/landing1.message') }}</label>
                    <textarea id="message" name="message" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4" placeholder="{{ __('landings/landing1.your_message') }}"></textarea>
                </div>
                <div class="flex items-center justify-center">
                    <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">{{ __('landings/landing1.send') }}</button>
                </div>
            </form>
        </section>
        
        <!-- Secció de Copyright -->
        <footer class="w-full bg-gray-800 text-white text-center py-4 mt-10">
            <p class="text-sm">&copy; 2025 UrbanTree. {{ __('landings/landing1.all_rights_reserved') }}</p>
        </footer>
    </div>

    <script>
        function selectProduct(element) {
            document.querySelectorAll('.product-card').forEach(card => {
                card.classList.remove('selected');
            });
            element.classList.add('selected');
        }

        document.getElementById('language-select').addEventListener('change', function() {
            var selectedLang = this.value;
            window.location.href = "{{ url('set-language') }}/" + selectedLang;
        });
    </script>
</body>
</html>