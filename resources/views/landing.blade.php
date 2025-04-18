<!DOCTYPE html>
<html lang="{{ session('locale', config('app.locale')) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }}</title>
    @vite('resources/css/app.css')
    <style>
        html {
            scroll-behavior: smooth;
        }
    </style>
</head>

<body class="bg-gray-50 font-sans text-gray-800">
    <div class="bg-white">
        <!-- Header -->
        <header class="absolute inset-x-0 top-0 z-50 border-b border-gray-200 shadow-sm">
            <nav class="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
                <div class="flex lg:flex-1">
                    <a href="" class="-m-1.5 p-1.5 flex items-center gap-2">
                        <span class="sr-only">{{ config('app.name') }}</span>
                        <img class="h-9 w-auto" src="{{ asset("images/logos/logo.png") }}"
                            alt="{{ config('app.name') }}">
                    </a>
                </div>
                <div class="flex lg:flex-1 lg:justify-end">
                    <a href="/login" class="text-m font-semibold text-indigo-600 hover:underline">
                        {{ __('landing.common.login') }} →
                    </a>
                    </a>
                </div>
            </nav>
        </header>

        <main>
            <!-- Hero section -->
            <div class="relative isolate pt-20 bg-gray-50">
                <svg class="absolute inset-0 -z-10 w-full h-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                    aria-hidden="true">
                    <defs>
                        <pattern id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527" width="200" height="200" x="50%" y="-1"
                            patternUnits="userSpaceOnUse">
                            <path d="M100 200V.5M.5 .5H200" fill="none" />
                        </pattern>
                    </defs>
                    <svg x="50%" y="-1" class="overflow-visible fill-gray-50">
                        <path
                            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                            stroke-width="0" />
                    </svg>
                    <rect width="100%" height="100%" stroke-width="0"
                        fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
                </svg>
                <div class="max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
                    <div class="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
                        <div class="flex">
                            <div
                                class="relative flex items-center gap-2 rounded-full bg-white px-4 py-1 text-sm text-gray-600 ring-1 ring-gray-300 hover:ring-gray-400 transition">
                                <a href="#newsletter" class="flex items-center gap-1">
                                    <span class="font-semibold text-indigo-600">
                                        {{ __('landing.newsletter.request') }}
                                    </span>
                                    <svg class="-mr-2 w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"
                                        aria-hidden="true" data-slot="icon">
                                        <path fill-rule="evenodd"
                                            d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <h1 class="mt-10 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl">
                            {{ __('landing.hero.title') }}
                        </h1>
                        <p class="mt-8 text-lg font-medium text-gray-600 sm:text-xl">
                            {{ __('landing.hero.description') }}
                        </p>
                        <div class="mt-10 flex items-center gap-6">
                            <a href="#testimonials"
                                class="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition">
                                {{ __('landing.hero.cta_reviews') }}
                            </a>
                            <a href="#features" class="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
                                {{ __('landing.hero.cta_learn_more') }}
                                <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                    <div class="mt-16 sm:mt-24 lg:mt-0 lg:shrink-0 lg:grow">
                        <svg viewBox="0 0 366 729" role="img" class="mx-auto w-[22.875rem] max-w-full drop-shadow-xl">
                            <title>App screenshot</title>
                            <defs>
                                <clipPath id="2ade4387-9c63-4fc4-b754-10e687a0d332">
                                    <rect width="316" height="684" rx="36" />
                                </clipPath>
                            </defs>
                            <path fill="#4B5563"
                                d="M363.315 64.213C363.315 22.99 341.312 1 300.092 1H66.751C25.53 1 3.528 22.99 3.528 64.213v44.68l-.857.143A2 2 0 0 0 1 111.009v24.611a2 2 0 0 0 1.671 1.973l.95.158a2.26 2.26 0 0 1-.093.236v26.173c.212.1.398.296.541.643l-1.398.233A2 2 0 0 0 1 167.009v47.611a2 2 0 0 0 1.671 1.973l1.368.228c-.139.319-.314.533-.511.653v16.637c.221.104.414.313.56.689l-1.417.236A2 2 0 0 0 1 237.009v47.611a2 2 0 0 0 1.671 1.973l1.347.225c-.135.294-.302.493-.49.607v377.681c0 41.213 22 63.208 63.223 63.208h95.074c.947-.504 2.717-.843 4.745-.843l.141.001h.194l.086-.001 33.704.005c1.849.043 3.442.37 4.323.838h95.074c41.222 0 63.223-21.999 63.223-63.212v-394.63c-.259-.275-.48-.796-.63-1.47l-.011-.133 1.655-.276A2 2 0 0 0 366 266.62v-77.611a2 2 0 0 0-1.671-1.973l-1.712-.285c.148-.839.396-1.491.698-1.811V64.213Z" />
                            <path fill="#343E4E"
                                d="M16 59c0-23.748 19.252-43 43-43h246c23.748 0 43 19.252 43 43v615c0 23.196-18.804 42-42 42H58c-23.196 0-42-18.804-42-42V59Z" />
                            <foreignObject width="316" height="684" transform="translate(24 24)"
                                clip-path="url(#2ade4387-9c63-4fc4-b754-10e687a0d332)">
                                <img src="{{ asset('images/landing/customer-view-mobile-ss.png') }}" alt="" />
                            </foreignObject>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Logo cloud -->
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <div
                    class="mx-auto grid max-w-lg grid-cols-3 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none">
                    <img class="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                        src="{{ asset('images/external-logos/1-gobierno-spain-mefp.png') }}" alt="Transistor"
                        width="158" height="48">
                    <img class="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                        src="{{ asset('images/external-logos/2-prtr.png') }}" alt="Reform" width="158" height="48">
                    <img class="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                        src="{{ asset('images/external-logos/3-nextgenerationeu.jpg') }}" alt="Tuple" width="158"
                        height="48">
                    <img class="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                        src="{{ asset('images/external-logos/4-insmontsia.jpeg') }}" alt="SavvyCal" width="158"
                        height="48">
                    <img class="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                        src="{{ asset('images/external-logos/5-efalamalvesia.jpg') }}" alt="Statamic" width="158"
                        height="48">
                    <img class="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                        src="{{ asset('images/external-logos/6-projar.png') }}" alt="Statamic" width="158" height="48">
                </div>
            </div>

            <!-- Video section -->
            <div class="mx-auto mt-32 max-w-7xl sm:mt-56 sm:px-6 lg:px-8">
                <iframe
                    class="relative max-w-xl min-w-full rounded-xl ring-1 shadow-xl ring-gray-200/10 lg:row-span-4 lg:w-full lg:max-w-none"
                    src="{{ __('landing.video.url') }}" title="{{ __('landing.video.title') }}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen height="684"></iframe>
            </div>

            <!-- Feature section -->
            <div class="mx-auto mt-32 max-w-7xl sm:mt-56 px-4 sm:px-6 lg:px-8" id="features">
                <div class="mx-auto max-w-2xl text-center lg:text-center">
                    <h2 class="text-base font-semibold text-indigo-600 tracking-wide">
                        {{ __('landing.features.section_title') }}
                    </h2>
                    <p class="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        {{ __('landing.features.title') }}
                    </p>
                    <p class="mt-6 text-lg text-gray-600">
                        {{ __('landing.features.description') }}
                    </p>
                </div>
                <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        <div class="flex flex-col">
                            <dt class="flex items-center gap-x-3 text-base font-semibold text-gray-900">
                                <svg class="w-5 h-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor"
                                    aria-hidden="true" data-slot="icon">
                                    <path fill-rule="evenodd"
                                        d="M5.5 17a4.5 4.5 0 0 1-1.44-8.765 4.5 4.5 0 0 1 8.302-3.046 3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Zm3.75-2.75a.75.75 0 0 0 1.5 0V9.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0l-3.25 3.5a.75.75 0 1 0 1.1 1.02l1.95-2.1v4.59Z"
                                        clip-rule="evenodd" />
                                </svg>
                                {{ __('landing.features.technical_assessment.title') }}
                            </dt>
                            <dd class="mt-4 flex flex-auto flex-col text-base text-gray-600">
                                <p class="flex-auto">
                                    {{ __('landing.features.technical_assessment.description') }}
                                </p>
                            </dd>
                        </div>
                        <div class="flex flex-col">
                            <dt class="flex items-center gap-x-3 text-base font-semibold text-gray-900">
                                <svg class="w-5 h-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor"
                                    aria-hidden="true" data-slot="icon">
                                    <path fill-rule="evenodd"
                                        d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
                                        clip-rule="evenodd" />
                                </svg>
                                {{ __('landing.features.iot_monitoring.title') }}
                            </dt>
                            <dd class="mt-4 flex flex-auto flex-col text-base text-gray-600">
                                <p class="flex-auto">{{ __('landing.features.iot_monitoring.description') }}</p>
                            </dd>
                        </div>
                        <div class="flex flex-col">
                            <dt class="flex items-center gap-x-3 text-base font-semibold text-gray-900">
                                <svg class="w-5 h-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor"
                                    aria-hidden="true" data-slot="icon">
                                    <path fill-rule="evenodd"
                                        d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z"
                                        clip-rule="evenodd" />
                                </svg>
                                {{ __('landing.features.maintenance.title') }}
                            </dt>
                            <dd class="mt-4 flex flex-auto flex-col text-base text-gray-600">
                                <p class="flex-auto">{{ __('landing.features.maintenance.description') }}</p>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <!-- Newsletter section -->
            <div class="mx-auto mt-32 max-w-7xl sm:mt-56 sm:px-6 lg:px-8" id="newsletter">
                <div
                    class="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
                    <h2
                        class="mx-auto max-w-3xl text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                        {{ __('landing.newsletter.title') }}
                    </h2>
                    <p class="mx-auto mt-6 max-w-lg text-center text-lg text-gray-300">
                        {{ __('landing.newsletter.description') }}
                    </p>
                    <form class="mx-auto mt-10 flex max-w-md gap-4" method="POST">@csrf
                        <label for="email-address" class="sr-only">{{ __('landing.newsletter.placeholder') }}</label>
                        <input id="email-address" name="email" type="email" autocomplete="email" required
                            class="flex-auto rounded-md bg-white/10 px-3.5 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 sm:text-sm"
                            placeholder="{{ __('landing.newsletter.placeholder') }}">
                        <button type="submit"
                            class="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                            {{ __('landing.common.send') }}
                        </button>
                    </form>
                    <svg viewBox="0 0 1024 1024" class="absolute top-1/2 left-1/2 -z-10 w-[64rem] h-[64rem] -translate-x-1/2"
                        aria-hidden="true">
                        <circle cx="512" cy="512" r="512" fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                            fill-opacity="0.7" />
                        <defs>
                            <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641" cx="0" cy="0" r="1"
                                gradientUnits="userSpaceOnUse"
                                gradientTransform="translate(512 512) rotate(90) scale(512)">
                                <stop stop-color="#7775D6" />
                                <stop offset="1" stop-color="#E935C1" stop-opacity="0" />
                            </radialGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            <!-- Pricing section -->
            <div class="mx-auto mt-32 max-w-7xl sm:mt-56 px-4 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-4xl text-center">
                    <h2 class="text-base font-semibold text-indigo-600">
                        {{ __('landing.pricing.title') }}
                    </h2>
                    <p class="mt-2 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                        {{ __('landing.pricing.subtitle') }}
                    </p>
                </div>
                <p class="mx-auto mt-6 max-w-2xl text-center text-lg text-gray-600 sm:text-xl">
                    {{ __('landing.pricing.description') }}
                </p>
                <div class="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {{-- Freelancer Plan --}}
                    <div class="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 lg:mt-8 lg:rounded-r-none xl:p-10">
                        <div>
                            <div class="flex items-center justify-between gap-x-4">
                                <h3 id="tier-freelancer" class="text-lg font-semibold text-gray-900">
                                    {{ __('landing.pricing.freelancer.title') }}
                                </h3>
                            </div>
                            <p class="mt-4 text-sm text-gray-600">
                                {{ __('landing.pricing.freelancer.description') }}
                            </p>
                            <p class="mt-6 flex items-baseline gap-x-1">
                                <span class="text-4xl font-semibold tracking-tight text-gray-900">0€</span>
                                <span class="text-sm font-semibold text-gray-600">
                                    {{ __('landing.pricing.per_month') }}
                                </span>
                            </p>
                            <ul role="list" class="mt-8 space-y-3 text-sm text-gray-600">
                                @foreach (range(1,4) as $i)
                                    <li class="flex gap-x-3">
                                        <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fill-rule="evenodd" d="M16.704 4.153a.75.75...Z" clip-rule="evenodd" />
                                        </svg>
                                        {{ __('landing.pricing.freelancer.feature' . $i) }}
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                        <a href="#" aria-describedby="tier-freelancer"
                        class="mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold text-indigo-600 ring-1 ring-indigo-200 ring-inset hover:ring-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                            {{ __('landing.pricing.buy_plan') }}
                        </a>
                    </div>

                    {{-- Startup Plan --}}
                    <div class="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 lg:z-10 lg:rounded-b-none xl:p-10">
                        <div>
                            <div class="flex items-center justify-between gap-x-4">
                                <h3 id="tier-startup" class="text-lg font-semibold text-indigo-600">
                                    {{ __('landing.pricing.startup.title') }}
                                </h3>
                                <p class="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                                    {{ __('landing.pricing.most_popular') }}
                                </p>
                            </div>
                            <p class="mt-4 text-sm text-gray-600">
                                {{ __('landing.pricing.startup.description') }}
                            </p>
                            <p class="mt-6 flex items-baseline gap-x-1">
                                <span class="text-4xl font-semibold tracking-tight text-gray-900">0€</span>
                                <span class="text-sm font-semibold text-gray-600">
                                    {{ __('landing.pricing.per_month') }}
                                </span>
                            </p>
                            <ul role="list" class="mt-8 space-y-3 text-sm text-gray-600">
                                @foreach (range(1,5) as $i)
                                    <li class="flex gap-x-3">
                                        <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fill-rule="evenodd" d="M16.704 4.153a.75.75...Z" clip-rule="evenodd" />
                                        </svg>
                                        {{ __('landing.pricing.startup.feature' . $i) }}
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                        <a href="#" aria-describedby="tier-startup"
                        class="mt-8 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                            {{ __('landing.pricing.buy_plan') }}
                        </a>
                    </div>

                    {{-- Enterprise Plan --}}
                    <div class="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 lg:mt-8 lg:rounded-l-none xl:p-10">
                        <div>
                            <div class="flex items-center justify-between gap-x-4">
                                <h3 id="tier-enterprise" class="text-lg font-semibold text-gray-900">
                                    {{ __('landing.pricing.enterprise.title') }}
                                </h3>
                            </div>
                            <p class="mt-4 text-sm text-gray-600">
                                {{ __('landing.pricing.enterprise.description') }}
                            </p>
                            <p class="mt-6 flex items-baseline gap-x-1">
                                <span class="text-4xl font-semibold tracking-tight text-gray-900">0€</span>
                                <span class="text-sm font-semibold text-gray-600">
                                    {{ __('landing.pricing.per_month') }}
                                </span>
                            </p>
                            <ul role="list" class="mt-8 space-y-3 text-sm text-gray-600">
                                @foreach (range(1,5) as $i)
                                    <li class="flex gap-x-3">
                                        <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fill-rule="evenodd" d="M16.704 4.153a.75.75...Z" clip-rule="evenodd" />
                                        </svg>
                                        {{ __('landing.pricing.enterprise.feature' . $i) }}
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                        <a href="#" aria-describedby="tier-enterprise"
                        class="mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold text-indigo-600 ring-1 ring-indigo-200 ring-inset hover:ring-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                            {{ __('landing.pricing.buy_plan') }}
                        </a>
                    </div>
                </div>
            </div>

            <!-- Testimonials section -->
            <div class="relative isolate mt-32 sm:mt-56 sm:pt-32" id="testimonials" data-no-offset="true">
                <svg class="absolute inset-0 -z-10 hidden size-full stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)] sm:block"
                    aria-hidden="true">
                    <defs>
                        <pattern id="55d3d46d-692e-45f2-becd-d8bdc9344f45" width="200" height="200" x="50%" y="0"
                            patternUnits="userSpaceOnUse">
                            <path d="M.5 200V.5H200" fill="none" />
                        </pattern>
                    </defs>
                    <svg x="50%" y="0" class="overflow-visible fill-gray-50">
                        <path
                            d="M-200.5 0h201v201h-201Z M599.5 0h201v201h-201Z M399.5 400h201v201h-201Z M-400.5 600h201v201h-201Z"
                            stroke-width="0" />
                    </svg>
                    <rect width="100%" height="100%" stroke-width="0"
                        fill="url(#55d3d46d-692e-45f2-becd-d8bdc9344f45)" />
                </svg>
                <div class="relative">
                    <div class="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
                        aria-hidden="true">
                        <div class="ml-[max(50%,38rem)] aspect-1313/771 w-[82.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]"
                            style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">
                        </div>
                    </div>
                    <div class="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-8 opacity-25 blur-3xl xl:justify-end"
                        aria-hidden="true">
                        <div class="ml-[-22rem] aspect-1313/771 w-[82.0625rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] xl:mr-[calc(50%-12rem)] xl:ml-0"
                            style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">
                        </div>
                    </div>
                    <div class="mx-auto max-w-7xl px-6 lg:px-8">
                        <div class="mx-auto max-w-2xl sm:text-center">
                            <h2 class="text-sm font-semibold text-primary uppercase tracking-wide">
                                {{ __('landing.testimonials.section_title') }}
                            </h2>
                            <p
                                class="mt-2 text-4xl font-bold tracking-tight text-pretty text-gray-900 sm:text-5xl sm:text-balance">
                                {{ __('landing.testimonials.title') }}
                            </p>
                        </div>
                        <div
                            class="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
                            <figure
                                class="col-span-2 hidden sm:block sm:rounded-2xl sm:bg-white sm:ring-1 sm:shadow-md sm:ring-gray-200 xl:col-start-2 xl:row-end-1">
                                <blockquote class="p-12 text-lg font-medium tracking-tight text-gray-900">
                                    <p>“Integer id nunc sit semper purus. Bibendum at lacus ut arcu blandit montes vitae
                                        auctor libero. Hac condimentum dignissim nibh vulputate ut nunc. Amet nibh orci
                                        mi venenatis blandit vel et proin. Non hendrerit in vel ac diam.”</p>
                                </blockquote>
                                <figcaption class="flex items-center gap-x-4 border-t border-gray-200 px-6 py-4">
                                    <img class="size-10 flex-none rounded-full bg-gray-100 object-cover"
                                        src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80"
                                        alt="">
                                    <div class="flex-auto">
                                        <div class="font-semibold">Brenna Goyette</div>
                                        <div class="text-gray-500">@brennagoyette</div>
                                    </div>
                                    <img class="h-10 w-auto flex-none"
                                        src="https://tailwindui.com/plus-assets/img/logos/savvycal-logo-gray-900.svg"
                                        alt="">
                                </figcaption>
                            </figure>
                            <div class="space-y-8 xl:contents xl:space-y-0">
                                <div class="space-y-8 xl:row-span-2">
                                    <figure class="rounded-2xl bg-white p-6 ring-1 shadow-md ring-gray-200">
                                        <blockquote class="text-gray-900">
                                            <p>“Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus
                                                nihil. Aut enim doloremque et ipsam.”</p>
                                        </blockquote>
                                        <figcaption class="mt-6 flex items-center gap-x-4">
                                            <img class="size-10 rounded-full bg-gray-100 object-cover"
                                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                alt="">
                                            <div>
                                                <div class="font-semibold">Leslie Alexander</div>
                                                <div class="text-gray-500">@lesliealexander</div>
                                            </div>
                                        </figcaption>
                                    </figure>

                                    <!-- More testimonials... -->
                                </div>
                                <div class="space-y-8 xl:row-start-1">
                                    <figure class="rounded-2xl bg-white p-6 ring-1 shadow-md ring-gray-200">
                                        <blockquote class="text-gray-900">
                                            <p>“Aut reprehenderit voluptatem eum asperiores beatae id. Iure molestiae
                                                ipsam ut officia rem nulla blanditiis.”</p>
                                        </blockquote>
                                        <figcaption class="mt-6 flex items-center gap-x-4">
                                            <img class="size-10 rounded-full bg-gray-100 object-cover"
                                                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                alt="">
                                            <div>
                                                <div class="font-semibold">Lindsay Walton</div>
                                                <div class="text-gray-500">@lindsaywalton</div>
                                            </div>
                                        </figcaption>
                                    </figure>

                                    <!-- More testimonials... -->
                                </div>
                            </div>
                            <div class="space-y-8 xl:contents xl:space-y-0">
                                <div class="space-y-8 xl:row-start-1">
                                    <figure class="rounded-2xl bg-white p-6 ring-1 shadow-md ring-gray-200">
                                        <blockquote class="text-gray-900">
                                            <p>“Voluptas quos itaque ipsam in voluptatem est. Iste eos blanditiis
                                                repudiandae. Earum deserunt enim molestiae ipsum perferendis recusandae
                                                saepe corrupti.”</p>
                                        </blockquote>
                                        <figcaption class="mt-6 flex items-center gap-x-4">
                                            <img class="size-10 rounded-full bg-gray-100 object-cover"
                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                alt="">
                                            <div>
                                                <div class="font-semibold">Tom Cook</div>
                                                <div class="text-gray-500">@tomcook</div>
                                            </div>
                                        </figcaption>
                                    </figure>

                                    <!-- More testimonials... -->
                                </div>
                                <div class="space-y-8 xl:row-span-2">
                                    <figure class="rounded-2xl bg-white p-6 ring-1 shadow-md ring-gray-200">
                                        <blockquote class="text-gray-900">
                                            <p>“Molestias ea earum quos nostrum doloremque sed. Quaerat quasi aut velit
                                                incidunt excepturi rerum voluptatem minus harum.”</p>
                                        </blockquote>
                                        <figcaption class="mt-6 flex items-center gap-x-4">
                                            <img class="size-10 rounded-full bg-gray-100 object-cover"
                                                src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                alt="">
                                            <div>
                                                <div class="font-semibold">Leonard Krasner</div>
                                                <div class="text-gray-500">@leonardkrasner</div>
                                            </div>
                                        </figcaption>
                                    </figure>

                                    <!-- More testimonials... -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        <!-- Footer -->
        <footer class="mt-32 bg-gray-900 sm:mt-56">
            <div class="mx-auto max-w-7xl px-6 pt-8 md:pt-12 pb-8 lg:px-8">
                <div class="border-white/10 lg:flex lg:items-center lg:justify-between">
                    <div>
                        <h3 class="text-sm font-semibold text-white">
                            {{ __('landing.newsletter.title') }}
                        </h3>
                        <p class="mt-2 text-sm text-gray-300">
                            {{ __('landing.newsletter.description') }}
                        </p>
                    </div>
                    <form class="mt-6 sm:flex sm:max-w-md lg:mt-0" method="POST">@csrf
                        <label for="email-address" class="sr-only">{{ __('landing.newsletter.placeholder') }}</label>
                        <input type="email" name="email" id="email-address" autocomplete="email" required
                            class="w-full min-w-0 rounded-md bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-400 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:w-64"
                            placeholder="{{ __('landing.newsletter.placeholder') }}">
                        <div class="mt-4 sm:mt-0 sm:ml-4 sm:shrink-0">
                            <button type="submit"
                                class="flex w-full items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                                {{ __('landing.common.send') }}
                            </button>
                        </div>
                    </form>
                </div>
                <div class="mt-8 border-t border-white/10 pt-8 md:flex md:items-center md:justify-between">
                    <div class="flex gap-x-6 md:order-2">
                        <a href="{{ route('set-language', ['lang' => 'ca']) }}" class="text-gray-400 hover:text-gray-300">
                            <span class="sr-only">Català</span>
                            <img class="size-6" src="{{ asset('images/flags/es-ct.svg') }}" alt="Catalan flag" />
                        </a>
                        <a href="{{ route('set-language', ['lang' => 'es']) }}" class="text-gray-400 hover:text-gray-300">
                            <span class="sr-only">Español</span>
                            <img class="size-6" src="{{ asset('images/flags/es.svg') }}" alt="Spanish flag" />
                        </a>
                        <a href="{{ route('set-language', ['lang' => 'en']) }}" class="text-gray-400 hover:text-gray-300">
                            <span class="sr-only">English</span>
                            <img class="size-6" src="{{ asset('images/flags/us.svg') }}" alt="English flag" />
                        </a>
                    </div>
                    <div class="mt-8 md:mt-0 md:order-1 flex items-center">
                        <img class="h-9 mr-4" src="{{ asset('images/logos/nobg-isotype.png') }}" alt="{{ config('app.name') }}">
                        <p class="text-sm text-gray-400">&copy; {{ date('Y') }} {{ config('app.name') }}.
                            {{ __('landing.common.copyright') }}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
        </div>
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                // Get all links that have a hash
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        const targetId = this.getAttribute('href');
                        if (targetId === '#') return;

                        const targetElement = document.querySelector(targetId);
                        if (!targetElement) return;

                        const offset = targetElement.dataset.noOffset ? 0 : 100;
                        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementPosition - offset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    });
                });
            });
        </script>
    </body>
</html>