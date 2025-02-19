<!DOCTYPE html>
<html lang="{{ session('locale', config('app.locale')) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Updated to use landing9 translations -->
    <title>{{ __('landings/landing9.seo.title') }}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    @vite('resources/css/app.css')
</head>

<body>
    <!-- Header -->
    <header class="absolute inset-x-0 top-0 z-50">
        <nav class="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
            <div class="flex lg:flex-1">
                <a href="#" class="-m-1.5 p-1.5">
                    <span class="sr-only">Urban Tree</span>
                    <!-- Updated logo -->
                    <img class="h-8 w-auto" src="{{ asset('images/logos/nobg-logotype.png') }}" alt="Urban Tree">
                </a>
            </div>
            <div class="flex">
                <div class="flex items-center justify-center mr-4">
                    <a href="{{ route('set-language', ['lang' => 'en']) }}" class="mx-2 flex items-center gap-1 text-gray-700 hover:text-indigo-600">
                        🇬🇧 EN
                    </a>
                    <a href="{{ route('set-language', ['lang' => 'es']) }}" class="mx-2 flex items-center gap-1 text-gray-700 hover:text-indigo-600">
                        🇪🇸 ES
                    </a>
                    <a href="{{ route('set-language', ['lang' => 'ca']) }}" class="mx-2 flex items-center gap-1 text-gray-700 hover:text-indigo-600">
                        🇨🇦 CA
                    </a>
                </div>
                <a href="/login" class="text-sm/6 font-semibold px-4 py-2 bg-indigo-600 text-white rounded">
                    {{ __('landings/landing9.header.login') }}
                </a>
            </div>
        </nav>
    </header>

    <main class="isolate">
        <!-- Hero section -->
        <div class="relative pt-14">
            <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                <div class="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#34d399] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
            </div>
            <div class="py-24 sm:py-32 lg:pb-40">
                <div class="mx-auto max-w-7xl px-6 lg:px-8">
                    <div class="mx-auto max-w-7xl text-center">
                        <!-- Updated hero text -->
                        <h1 class="text-5xl font-semibold tracking-tight text-balance text-gray-700 sm:text-7xl">
                            {{ __('landings/landing9.hero.title') }}
                        </h1>
                        <p class="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                            {{ __('landings/landing9.hero.text') }}
                        </p>
                    </div>
                    <div class="mt-16 flow-root sm:mt-24">
                        <div class="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-gray-900/10 ring-inset lg:-m-4 lg:rounded-2xl lg:p-4">
                            <img src="{{ asset('images/landings/landing9/project-app.png') }}" alt="Hero image"
                                class="rounded-md ring-1 shadow-2xl ring-gray-900/10">
                        </div>
                    </div>
                </div>
            </div>
            <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
                <div class="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
            </div>
        </div>

        <!-- Logo cloud -->
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto grid grid-cols-5 gap-4">
                <img src="{{ asset('images/external-logos/1-gobierno-spain-mefp.png') }}" alt="Logo 1" class="max-h-12 w-full object-contain">
                <img src="{{ asset('images/external-logos/2-prtr.png') }}" alt="Logo 2" class="max-h-12 w-full object-contain">
                <img src="{{ asset('images/external-logos/3-nextgenerationeu.jpg') }}" alt="Logo 3" class="max-h-12 w-full object-contain">
                <img src="{{ asset('images/external-logos/4-insmontsia.jpeg') }}" alt="Logo 4" class="max-h-12 w-full object-contain">
                <img src="{{ asset('images/external-logos/6-projar.png') }}" alt="Logo 5" class="max-h-12 w-full object-contain">
            </div>
        </div>

        <!-- Feature section -->
        <div class="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
            <div class="mx-auto max-w-7xl lg:text-center">
                <h2 class="text-base/7 font-semibold text-indigo-600">{{ __('landings/landing9.features.subtitle') }}</h2>
                <p class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">
                    {{ __('landings/landing9.features.title') }}
                </p>
                <p class="mt-6 text-lg/8 text-pretty text-gray-600">
                    {{ __('landings/landing9.features.description') }}
                </p>
            </div>
            <div class="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24 lg:max-w-7xl">
                <dl class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                    <div class="relative pl-16">
                        <dt class="text-base/7 font-semibold text-gray-900">
                            <div class="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                                <svg class="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                </svg>
                            </div>
                            {{ __('landings/landing9.features.items.push_to_deploy.title') }}
                        </dt>
                        <dd class="mt-2 text-base/7 text-gray-600">
                            {{ __('landings/landing9.features.items.push_to_deploy.desc') }}
                        </dd>
                    </div>
                    <div class="relative pl-16">
                        <dt class="text-base/7 font-semibold text-gray-900">
                            <div class="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                                <svg class="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                            </div>
                            {{ __('landings/landing9.features.items.ssl_certificates.title') }}
                        </dt>
                        <dd class="mt-2 text-base/7 text-gray-600">
                            {{ __('landings/landing9.features.items.ssl_certificates.desc') }}
                        </dd>
                    </div>
                    <div class="relative pl-16">
                        <dt class="text-base/7 font-semibold text-gray-900">
                            <div class="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                                <svg class="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>
                            </div>
                            {{ __('landings/landing9.features.items.simple_queues.title') }}
                        </dt>
                        <dd class="mt-2 text-base/7 text-gray-600">
                            {{ __('landings/landing9.features.items.simple_queues.desc') }}
                        </dd>
                    </div>
                    <div class="relative pl-16">
                        <dt class="text-base/7 font-semibold text-gray-900">
                            <div class="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                                <svg class="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
                                </svg>
                            </div>
                            {{ __('landings/landing9.features.items.advanced_security.title') }}
                        </dt>
                        <dd class="mt-2 text-base/7 text-gray-600">
                            {{ __('landings/landing9.features.items.advanced_security.desc') }}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>

        <!-- Testimonial section -->
        <div class="mx-auto mt-32 max-w-7xl sm:mt-56 sm:px-6 lg:px-8">
            <div class="relative overflow-hidden bg-gray-900 px-6 py-20 shadow-xl sm:rounded-3xl sm:px-10 sm:py-24 md:px-12 lg:px-20">
                <img class="absolute inset-0 size-full object-cover brightness-150 saturate-0" src="https://images.unsplash.com/photo-1601381718415-a05fb0a261f3?ixid=MXwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8ODl8fHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1216&q=80" alt="">
                <div class="absolute inset-0 bg-gray-900/90 mix-blend-multiply"></div>
                <div class="absolute -top-56 -left-80 transform-gpu blur-3xl" aria-hidden="true">
                    <div class="aspect-1097/845 w-[68.5625rem] bg-linear-to-r from-[#ff4694] to-[#776fff] opacity-[0.45]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
                </div>
                <div class="hidden md:absolute md:bottom-16 md:left-[50rem] md:block md:transform-gpu md:blur-3xl" aria-hidden="true">
                    <div class="aspect-1097/845 w-[68.5625rem] bg-linear-to-r from-[#ff4694] to-[#776fff] opacity-25" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
                </div>
                <div class="relative mx-auto max-w-7xl lg:mx-0">
                    <img class="h-12 w-auto" src="https://tailwindui.com/plus-assets/img/logos/workcation-logo-white.svg" alt="">
                    <figure>
                        <blockquote class="mt-6 text-lg font-semibold text-white sm:text-xl/8">
                            <p>“{{ __('landings/landing9.testimonial.quote') }}”</p>
                        </blockquote>
                        <figcaption class="mt-6 text-base text-white">
                            <div class="font-semibold">{{ __('landings/landing9.testimonial.author') }}</div>
                            <div class="mt-1">{{ __('landings/landing9.testimonial.role') }}</div>
                        </figcaption>
                    </figure>
                </div>
            </div>
        </div>

        <!-- FAQs -->
        <div class="mx-auto mt-32 max-w-7xl px-6 pb-8 sm:mt-56 lg:max-w-7xl lg:px-8 lg:pb-32">
            <div class="mx-auto max-w-4xl">
                <h2 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl text-center">
                    {{ __('landings/landing9.faq.title') }}
                </h2>
                <dl class="mt-12 space-y-8 divide-y divide-gray-900/10">
                    @foreach(['open_source', 'sensors', 'contribute'] as $key)
                    <div class="pt-8 first:pt-0">
                        <dt class="text-lg font-semibold leading-7 text-gray-900">
                            {{ __("landings/landing9.faq.{$key}.question") }}
                        </dt>
                        <dd class="mt-4">
                            <p class="text-base leading-7 text-gray-600">
                                {{ __("landings/landing9.faq.{$key}.answer") }}
                            </p>
                        </dd>
                    </div>
                    @endforeach
                </dl>
            </div>
        </div>

        <!-- CTA section -->
        <div class="relative -z-10 mt-32 px-6 lg:px-8">
            <div class="mx-auto max-w-7xl">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div class="text-left">
                        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            {{ __('landings/landing9.cta.title') }}
                        </h2>
                        <p class="mt-6 text-lg leading-8 text-gray-600">
                            {{ __('landings/landing9.cta.description') }}
                        </p>
                    </div>
                    <div class="relative">
                        <div class="aspect-video rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
                            <iframe
                                class="w-full h-full rounded-lg"
                                src="{{ __('landings/landing9.cta.video_url') }}"
                                title="{{ __('landings/landing9.cta.video_title') }}"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen>
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="relative mx-auto mt-32 max-w-7xl px-6 lg:px-8">
        <div class="border-t border-gray-900/10 py-16">
            <div class="flex items-center justify-between">
                <img class="h-8 w-auto" src="{{ asset('images/logos/nobg-logotype.png') }}" alt="Urban Tree">
                <p class="text-sm text-gray-500">© {{ date('Y') }} {{ __('landings/landing9.footer.copyright') }}</p>
            </div>
        </div>
    </footer>
</body>

</html>
