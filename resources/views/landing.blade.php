<!DOCTYPE html>
<html lang="{{ session('locale', config('app.locale')) }}">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ __('landing.title') }}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  @vite('resources/css/app.css')
</head>

<body class="bg-gray-50">
  <div class="flex justify-end space-x-4">
    <a href="{{ route('set-language', ['lang' => 'es']) }}" class="text-gray-700">🇪🇸 Español</a>
    <a href="{{ route('set-language', ['lang' => 'en']) }}" class="text-gray-700">🇬🇧 English</a>
    <a href="{{ route('set-language', ['lang' => 'ca']) }}" class="text-gray-700">🇨🇦 Català</a>
    <a href="{{ url('/login') }}" class="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all">
      {{ __('landing.login') }}
    </a>
  </div>

  <div class="w-full">
    <img src="{{ asset('images/banner.jpg') }}" alt="Banner" class="w-full h-auto">
  </div>
  <div class="container mx-auto text-center my-8">
    <h2 class="text-2xl font-bold mb-4">{{ __('landing.video') }}</h2>
    <div class="w-full max-w-3xl mx-auto">
      <iframe class="w-full h-64 md:h-96 rounded-lg shadow-lg"
        src="https://www.youtube.com/embed/yed3-_zggHo"
        title="Urban Tree 5.0 - Demo"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
  </div>
  <section class="container mx-auto py-16 px-4">
    <div class="max-w-6xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-6">{{ __('landing.plans_title') }}</h2>
      <p class="text-gray-600 mb-12 max-w-2xl mx-auto">{{ __('landing.plans_description') }}</p>

      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 class="text-xl font-bold mb-4">{{ __('landing.city_solution') }}</h3>
          <div class="text-4xl font-bold mb-6 text-green-600">€199<span class="text-lg text-gray-500">{{ __('landing.price_per_month') }}</span></div>
          <ul class="space-y-4 mb-8">
            <li class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>{{ __('landing.contracts_5') }}
            </li>
            <li class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>{{ __('landing.basic_support') }}
            </li>
            <li class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>{{ __('landing.basic_reports') }}
            </li>
            <li class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>{{ __('landing.manage_2_teams') }}
            </li>
          </ul>
          <a href="#contact" class="block w-full bg-green-100 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-200 transition-colors">
            {{ __('landing.contact') }}
          </a>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow-lg border-2 border-green-500 relative">
          <div class="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-lg text-sm">Más popular</div>
          <h3 class="text-xl font-bold mb-4">{{ __('landing.regional_solution') }}</h3>
          <div class="text-4xl font-bold mb-6 text-green-600">€499<span class="text-lg text-gray-500">{{ __('landing.price_per_month') }}</span></div>
          <ul class="space-y-4 mb-8">
            <li class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>{{ __('landing.contracts_25') }}
            </li>
            <li class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>{{ __('landing.priority_support') }}
            </li>
            <li class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>{{ __('landing.advanced_analytics') }}
            </li>
            <li class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>{{ __('landing.manage_10_teams') }}
            </li>
            <li class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>{{ __('landing.automations') }}
            </li>
          </ul>
          <a href="#contact" class="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            {{ __('landing.contact') }}
          </a>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 class="text-xl font-bold mb-4">{{ __('landing.enterprise_solution') }}</h3>
          <div class="text-4xl font-bold mb-6 text-green-600">€999<span class="text-lg text-gray-500">{{ __('landing.price_per_month') }}</span></div>
          <ul class="space-y-4 mb-8">
            <li class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>{{ __('landing.unlimited_contracts') }}
            </li>
            <li class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>{{ __('landing.premium_support') }}
            </li>
            <li class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>{{ __('landing.custom_reports') }}
            </li>
            <li class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>{{ __('landing.unlimited_management') }}
            </li>
            <li class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>{{ __('landing.api_integrations') }}
            </li>
          </ul>
          <a href="#contact" class="block w-full bg-green-100 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-200 transition-colors">
            {{ __('landing.contact') }}
          </a>
        </div>
      </div>
    </div>
  </section>
  <section class="container mx-auto py-16 px-4">
    <h2 class="text-3xl font-bold text-center mb-12">{{ __('landing.features_title') }}</h2>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <div class="w-12 h-12 bg-green-600 text-white text-xl rounded-lg mb-4 flex items-center justify-center">
          <i class="fas fa-file-contract text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold mb-3">{{ __('landing.city_solution') }}</h3>
        <ul class="list-disc pl-5 text-gray-600 space-y-2">
          <li>{{ __('landing.contracts_5') }}</li>
          <li>{{ __('landing.basic_support') }}</li>
          <li>{{ __('landing.basic_reports') }}</li>
        </ul>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <div class="w-12 h-12 bg-green-600 text-white text-xl rounded-lg mb-4 flex items-center justify-center">
          <i class="fas fa-tasks text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold mb-3">{{ __('landing.regional_solution') }}</h3>
        <ul class="list-disc pl-5 text-gray-600 space-y-2">
          <li>{{ __('landing.contracts_25') }}</li>
          <li>{{ __('landing.priority_support') }}</li>
          <li>{{ __('landing.advanced_analytics') }}</li>
        </ul>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <div class="w-12 h-12 bg-green-600 text-white text-xl rounded-lg mb-4 flex items-center justify-center">
          <i class="fas fa-chart-line text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold mb-3">{{ __('landing.enterprise_solution') }}</h3>
        <ul class="list-disc pl-5 text-gray-600 space-y-2">
          <li>{{ __('landing.unlimited_contracts') }}</li>
          <li>{{ __('landing.premium_support') }}</li>
          <li>{{ __('landing.custom_reports') }}</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="container mx-auto py-16 px-4">
    <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
      <img src="{{ asset('images/urbantree-map.jpg') }}" alt="Management Interface" class="w-full h-96 object-cover">
      <div class="p-8 bg-gray-50">
        <h3 class="text-2xl font-bold mb-4">{{ __('landing.features_title') }}</h3>
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h4 class="text-lg font-semibold mb-3">🎯 {{ __('landing.features_title') }}</h4>
            <ul class="space-y-2">
              <li class="flex items-center">
                <span class="mr-2">✔️</span>{{ __('landing.contracts_5') }}
              </li>
              <li class="flex items-center">
                <span class="mr-2">✔️</span>{{ __('landing.basic_support') }}
              </li>
              <li class="flex items-center">
                <span class="mr-2">✔️</span>{{ __('landing.basic_reports') }}
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-3">📈 {{ __('landing.features_title') }}</h4>
            <ul class="space-y-2">
              <li class="flex items-center">
                <span class="mr-2">📊</span>{{ __('landing.contracts_25') }}
              </li>
              <li class="flex items-center">
                <span class="mr-2">⏱️</span>{{ __('landing.priority_support') }}
              </li>
              <li class="flex items-center">
                <span class="mr-2">🌿</span>{{ __('landing.advanced_analytics') }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="container mx-auto py-16 px-4">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
      <h2 class="text-3xl font-bold text-center mb-6">{{ __('landing.contact_title') }}</h2>
      <p class="text-center text-gray-600 mb-8">{{ __('landing.contact_description') }}</p>
      @if(session('success'))
      <div class="bg-green-500 text-white p-3 rounded-md mb-6">
        {{ session('success') }}
      </div>
      @endif

      @if ($errors->any())
      <div class="bg-red-500 text-white p-3 rounded-md mb-6">
        <ul class="list-disc list-inside">
          @foreach ($errors->all() as $error)
          <li>{{ $error }}</li>
          @endforeach
        </ul>
      </div>
      @endif
      <form id="contact" action="{{ route('landing.form') }}" method="POST" class="space-y-6">
        @csrf
        <div>
          <label class="block text-gray-700 font-semibold mb-2">{{ __('landing.name') }}</label>
          <input type="text" name="name" required class="w-full p-3 border rounded-lg focus:ring-2 ring-green-500 outline-none">
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-gray-700 font-semibold mb-2">{{ __('landing.email') }}</label>
            <input type="email" name="email" required class="w-full p-3 border rounded-lg focus:ring-2 ring-green-500 outline-none">
          </div>
          <div>
            <label class="block text-gray-700 font-semibold mb-2">{{ __('landing.phone') }}</label>
            <input type="text" name="phone" class="w-full p-3 border rounded-lg focus:ring-2 ring-green-500 outline-none">
          </div>
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2">{{ __('landing.message') }}</label>
          <textarea name="message" rows="4" required class="w-full p-3 border rounded-lg focus:ring-2 ring-green-500 outline-none"></textarea>
        </div>

        <button type="submit" class="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
          {{ __('landing.send_request') }}
        </button>
      </form>
    </div>
  </section>

  <footer class="bg-gray-900 text-white text-center py-6 mt-16">
    <p>&copy; 2025 Urban Tree 5.0. {{ __('landing.footer') }}</p>
    <div class="mt-2">
      <a href="#" class="text-gray-400 hover:text-white mx-2">{{ __('landing.privacy_policy') }}</a>
      <a href="#" class="text-gray-400 hover:text-white mx-2">{{ __('landing.terms_of_service') }}</a>
    </div>
  </footer>

</body>

</html>
