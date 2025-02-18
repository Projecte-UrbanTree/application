<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="UTF-8" />
    <title>{{ __('landings/landing4.title') }}</title>
    <link rel="icon" href="/images/logos/nobg-xs-isotype.svg" type="image/svg+xml" />
    @vite('resources/css/app.css')
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-family: 'Nexa Bold', sans-serif;
      }
      body,
      p,
      span,
      li,
      a,
      button,
      input,
      textarea {
        font-family: 'Poppins', sans-serif;
      }
    </style>
  </head>
  <body class="antialiased text-gray-900 bg-white" x-data="{ openPayment: false, plan: '', method: '', showOverlay: false }">
    <header class="absolute top-0 left-0 w-full z-20">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <span class="text-white text-xl font-bold">
            {{ __('landings/landing4.title') }}
          </span>
        </div>
        <div class="relative flex items-center space-x-6">
          <a href="/login" class="text-white font-semibold border border-white rounded-md px-4 py-2 hover:bg-white hover:text-gray-900 transition">
            {{ __('landings/landing4.contact_btn') }}
          </a>
          <div class="relative" x-data="{ openLang: false }">
            <button @click="openLang = !openLang" class="text-white focus:outline-none">
              <span class="font-semibold">ES</span>
            </button>
            <div x-show="openLang" x-transition class="absolute right-0 w-40 mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-20">
              <ul>
                <li class="flex items-center px-4 py-2">
                  <a href="{{ route('set-language', ['lang' => 'es']) }}" class="text-gray-700">
                    Español
                  </a>
                </li>
                <li class="flex items-center px-4 py-2">
                  <a href="{{ route('set-language', ['lang' => 'en']) }}" class="text-gray-700">
                    English
                  </a>
                </li>
                <li class="flex items-center px-4 py-2">
                  <a href="{{ route('set-language', ['lang' => 'ca']) }}" class="text-gray-700">
                    Català
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
    <section class="relative w-full h-screen flex flex-col items-center justify-center text-center">
      <img src="{{ asset('images/landing4_bg_herosection.jpg') }}" alt="Background" class="absolute inset-0 w-full h-full object-cover -z-10 filter brightness-75" />
      <div class="relative z-10 px-4 max-w-3xl">
        <h1 class="text-7xl md:text-9xl font-bold mb-4 text-white">
          {{ __('landings/landing4.title') }}
        </h1>
        <p class="text-lg md:text-xl mb-8 text-gray-500 font-bold">
          {{ __('landings/landing4.tagline') }}
        </p>
        <button class="mt-8 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:opacity-90 transition cursor-pointer" @click="
            plan = 'Basic';
            openPayment = true;
            showOverlay = true;
          ">
          {{ __('landings/landing4.explore') }}
        </button>
      </div>
    </section>
    <section class="bg-gray-50 py-24 sm:py-32">
      <div class="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 class="text-center text-base font-semibold text-emerald-600">
          {{ __('landings/landing4.bento_title') }}
        </h2>
        <p class="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-emerald-900 sm:text-5xl">
          {{ __('landings/landing4.bento_subtitle') }}
        </p>
        <div class="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          <div class="relative lg:row-span-2">
            <div class="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
            <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div class="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <p class="mt-2 text-lg font-bold tracking-tight text-emerald-900 max-lg:text-center">
                  {{ __('landings/landing4.feature1_title') }}
                </p>
                <p class="mt-2 max-w-lg text-sm text-emerald-700 max-lg:text-center">
                  {{ __('landings/landing4.feature1_text') }}
                </p>
              </div>
              <div class="@container relative min-h-[30rem] w-full grow max-lg:mx-auto max-lg:max-w-sm">
                <div class="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                  <img class="size-full object-cover object-top" src="{{ asset('images/urbantree-map.jpg') }}" alt="" />
                </div>
              </div>
            </div>
            <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 lg:rounded-l-[2rem]"></div>
          </div>
          <div class="relative max-lg:row-start-1">
            <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
            <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div class="px-8 pt-8 sm:px-10 sm:pt-10">
                <p class="mt-2 text-lg font-bold tracking-tight text-emerald-900 max-lg:text-center">
                  {{ __('landings/landing4.feature2_title') }}
                </p>
                <p class="mt-2 max-w-lg text-sm text-emerald-700 max-lg:text-center">
                  {{ __('landings/landing4.feature2_text') }}
                </p>
              </div>
              <div class="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                <img class="w-full max-lg:max-w-xs" src="https://tailwindui.com/plus-assets/img/component-images/bento-03-performance.png" alt="">
              </div>
            </div>
            <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-t-[2rem]"></div>
          </div>
          <div class="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
            <div class="absolute inset-px rounded-lg bg-white"></div>
            <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <div class="px-8 pt-8 sm:px-10 sm:pt-10">
                <p class="mt-2 text-lg font-bold tracking-tight text-emerald-900 max-lg:text-center">
                  {{ __('landings/landing4.feature3_title') }}
                </p>
                <p class="mt-2 max-w-lg text-sm text-emerald-700 max-lg:text-center">
                  {{ __('landings/landing4.feature3_text') }}
                </p>
              </div>
              <div class="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                <img class="h-[min(152px,40cqw)] object-cover" src="https://tailwindui.com/plus-assets/img/component-images/bento-03-security.png" alt="">
              </div>
            </div>
            <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5"></div>
          </div>
          <div class="relative lg:row-span-2">
            <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
              <div class="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <p class="mt-2 text-lg font-bold tracking-tight text-emerald-900 max-lg:text-center">
                  {{ __('landings/landing4.feature4_title') }}
                </p>
                <p class="mt-2 max-w-lg text-sm text-emerald-700 max-lg:text-center">
                  {{ __('landings/landing4.feature4_text') }}
                </p>
              </div>
              <div class="relative min-h-[30rem] w-full grow">
  <div class="absolute inset-0 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
    <img
      src="https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg"
      alt="Naturaleza"
      class="w-full h-full object-cover"
    />
    <div class="px-6 pt-6 pb-14"></div>
  </div>
</div>

            </div>
            <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
          </div>
        </div>
      </div>
    </section>
    <section class="bg-white py-8">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-wrap items-center justify-center gap-6">
          <img src="{{ asset('images/external-logos/1-Gobierno-Ministerio.png') }}" alt="Sponsor 1" class="h-12" />
          <img src="{{ asset('images/external-logos/2-PRTR.png') }}" alt="Sponsor 2" class="h-12" />
          <img src="{{ asset('images/external-logos/3-UE-NextGeneration.jpg') }}" alt="Sponsor 3" class="h-12" />
          <img src="{{ asset('images/external-logos/4-Institut Montsià.jpeg') }}" alt="Sponsor 4" class="h-12" />
          <img src="{{ asset('images/external-logos/5-La Malvesia.jpg') }}" alt="Sponsor 5" class="h-12" />
          <img src="{{ asset('images/external-logos/6-Projar.png') }}" alt="Sponsor 6" class="h-12" />
        </div>
      </div>
    </section>
    <section class="bg-white py-16 sm:py-24">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <h3 class="text-3xl md:text-5xl font-bold text-emerald-900">
            {{ __('landings/landing4.pricing_title') }}
          </h3>
          <p class="mt-4 text-lg text-emerald-700">
            {{ __('landings/landing4.pricing_subtitle') }}
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div class="rounded-3xl p-8 ring-1 ring-gray-200 flex flex-col items-center">
            <h4 class="text-lg font-semibold text-emerald-900">
              {{ __('landings/landing4.basic') }}
            </h4>
            <p class="mt-2 text-sm text-emerald-700">
              {{ __('landings/landing4.basic_desc') }}
            </p>
            <p class="mt-6 text-4xl font-semibold text-emerald-900">
              {{ __('landings/landing4.price_basic') }}
            </p>
            <p class="mt-2 text-sm text-emerald-700">
              {{ __('landings/landing4.money') }}
            </p>
            <button class="mt-6 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold text-emerald-600 ring-1 ring-emerald-200 hover:ring-emerald-300 cursor-pointer" @click="
                plan = 'Basic';
                openPayment = true;
                showOverlay = true;
              ">
              {{ __('landings/landing4.buy_plan') }}
            </button>
          </div>
          <div class="rounded-3xl p-8 ring-2 ring-emerald-600 flex flex-col items-center">
            <h4 class="text-lg font-semibold text-emerald-600">
              {{ __('landings/landing4.pro') }}
            </h4>
            <p class="mt-2 text-sm text-emerald-700">
              {{ __('landings/landing4.pro_desc') }}
            </p>
            <p class="mt-6 text-4xl font-semibold text-emerald-900">
              {{ __('landings/landing4.price_pro') }}
            </p>
            <p class="mt-2 text-sm text-emerald-700">
              {{ __('landings/landing4.money') }}
            </p>
            <button class="mt-6 block w-full rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-500 cursor-pointer" @click="
                plan = 'Pro';
                openPayment = true;
                showOverlay = true;
              ">
              {{ __('landings/landing4.buy_plan') }}
            </button>
          </div>
          <div class="rounded-3xl p-8 ring-1 ring-gray-200 flex flex-col items-center">
            <h4 class="text-lg font-semibold text-emerald-900">
              {{ __('landings/landing4.enterprise') }}
            </h4>
            <p class="mt-2 text-sm text-emerald-700">
              {{ __('landings/landing4.enterprise_desc') }}
            </p>
            <p class="mt-6 text-4xl font-semibold text-emerald-900">
              {{ __('landings/landing4.price_enterprise') }}
            </p>
            <p class="mt-2 text-sm text-emerald-700">
              {{ __('landings/landing4.money') }}
            </p>
            <button class="mt-6 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold text-emerald-600 ring-1 ring-emerald-200 hover:ring-emerald-300 cursor-pointer" @click="
                plan = 'Enterprise';
                openPayment = true;
                showOverlay = true;
              ">
              {{ __('landings/landing4.buy_plan') }}
            </button>
          </div>
        </div>
      </div>
    </section>
    <footer id="footer" class="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white py-12 px-4">
      <div class="max-w-7xl mx-auto">
        <p class="text-center text-sm">
          &copy; 2025 Urban Tree 5.0.
          {{ __('landings/landing4.tagline') }}
        </p>
      </div>
    </footer>
    <div class="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm z-40" x-show="showOverlay" x-transition @click="openPayment = false; showOverlay = false"></div>
    <div class="fixed top-0 right-0 z-50 w-full max-w-md h-screen bg-white shadow-xl p-6 overflow-auto transform transition-all duration-300" x-show="openPayment" x-transition:enter="translate-x-full" x-transition:enter-end="translate-x-0" x-transition:leave="translate-x-0" x-transition:leave-end="translate-x-full">
      <button class="absolute top-4 right-4 text-3xl font-bold text-gray-600 hover:text-gray-800 cursor-pointer" @click="
          openPayment = false;
          showOverlay = false;
        ">
        &times;
      </button>
      <template x-if="plan === 'Basic'">
        <h2 class="text-xl font-bold mb-2 text-emerald-600">
          {{ __('landings/landing4.basic') }} -
          {{ __('landings/landing4.price_basic') }}
        </h2>
      </template>
      <template x-if="plan === 'Pro'">
        <h2 class="text-xl font-bold mb-2 text-emerald-600">
          {{ __('landings/landing4.pro') }} -
          {{ __('landings/landing4.price_pro') }}
        </h2>
      </template>
      <template x-if="plan === 'Enterprise'">
        <h2 class="text-xl font-bold mb-2 text-emerald-600">
          {{ __('landings/landing4.enterprise') }} -
          {{ __('landings/landing4.price_enterprise') }}
        </h2>
      </template>
      <div class="mb-4">
        <label class="block text-sm font-semibold text-emerald-700 mb-2">
          {{ __('landings/landing4.select_your_plan') }}
        </label>
        <div class="flex space-x-2">
          <button type="button" :class="{
              'bg-emerald-600 text-white': plan === 'Basic',
              'bg-gray-200 text-gray-700': plan !== 'Basic'
            }" class="px-4 py-2 rounded-md cursor-pointer" @click="plan = 'Basic'">
            {{ __('landings/landing4.basic') }}
          </button>
          <button type="button" :class="{
              'bg-emerald-600 text-white': plan === 'Pro',
              'bg-gray-200 text-gray-700': plan !== 'Pro'
            }" class="px-4 py-2 rounded-md cursor-pointer" @click="plan = 'Pro'">
            {{ __('landings/landing4.pro') }}
          </button>
          <button type="button" :class="{
              'bg-emerald-600 text-white': plan === 'Enterprise',
              'bg-gray-200 text-gray-700': plan !== 'Enterprise'
            }" class="px-4 py-2 rounded-md cursor-pointer" @click="plan = 'Enterprise'">
            {{ __('landings/landing4.enterprise') }}
          </button>
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-semibold text-emerald-700 mb-2">
          {{ __('landings/landing4.billing_contact') }}
        </label>
        <input type="email" class="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="correo@ejemplo.com" />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-semibold text-emerald-700 mb-2">
          {{ __('landings/landing4.payment_method_title') }}
        </label>
        <div class="flex space-x-2">
          <button type="button" class="px-3 py-2 rounded-md border border-gray-300 flex items-center justify-center" :class="method === 'card' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700'" @click="method = 'card'">
            <img src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/credit-card.svg" alt="Tarjeta" class="w-6 h-6" />
          </button>
          <button type="button" class="px-3 py-2 rounded-md border border-gray-300 flex items-center justify-center" :class="method === 'googlePay' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700'" @click="method = 'googlePay'">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/google.svg" alt="Google Pay" class="w-6 h-6" />
          </button>
          <button type="button" class="px-3 py-2 rounded-md border border-gray-300 flex items-center justify-center" :class="method === 'applePay' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700'" @click="method = 'applePay'">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/apple.svg" alt="Apple Pay" class="w-6 h-6" />
          </button>
          <button type="button" class="px-3 py-2 rounded-md border border-gray-300 flex items-center justify-center" :class="method === 'paypal' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700'" @click="method = 'paypal'">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/paypal.svg" alt="PayPal" class="w-6 h-6" />
          </button>
        </div>
      </div>
      <template x-if="method === 'card'">
        <div class="space-y-3 mb-6">
          <div>
            <label class="block text-sm font-semibold text-emerald-700 mb-1">
              {{ __('landings/landing4.card_number') }}
            </label>
            <input type="text" class="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="1234 1234 1234 1234" />
          </div>
          <div class="flex space-x-3">
            <div class="w-1/2">
              <label class="block text-sm font-semibold text-emerald-700 mb-1">
                {{ __('landings/landing4.expiration') }}
              </label>
              <input type="text" class="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="MM/YY" />
            </div>
            <div class="w-1/2">
              <label class="block text-sm font-semibold text-emerald-700 mb-1">
                {{ __('landings/landing4.cvc') }}
              </label>
              <input type="text" class="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="123" />
            </div>
          </div>
        </div>
      </template>
      <template x-if="method === 'googlePay'">
        <div class="mb-6 space-y-2">
          <label class="block text-sm font-semibold text-emerald-700 mb-2">
            {{ __('landings/landing4.add_payment_method') }}
          </label>
          <button type="button" class="w-full px-4 py-2 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-600 hover:text-white cursor-pointer">
            Add Google Pay
          </button>
        </div>
      </template>
      <template x-if="method === 'applePay'">
        <div class="mb-6 space-y-2">
          <label class="block text-sm font-semibold text-emerald-700 mb-2">
            {{ __('landings/landing4.add_payment_method') }}
          </label>
          <button type="button" class="w-full px-4 py-2 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-600 hover:text-white cursor-pointer">
            Add Apple Pay
          </button>
        </div>
      </template>
      <template x-if="method === 'paypal'">
        <div class="mb-6">
          <button type="button" class="w-full px-4 py-2 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-600 hover:text-white cursor-pointer">
            Add PayPal
          </button>
        </div>
      </template>
      <button class="mt-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-md cursor-pointer">
        {{ __('landings/landing4.confirm_and_pay') }}
      </button>
    </div>
  </body>
</html> 