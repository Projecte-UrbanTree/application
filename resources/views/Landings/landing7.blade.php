<!DOCTYPE html>
<html lang="{{ session('locale', config('app.locale')) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('landings/landing7.title') }}</title>
    @vite('resources/css/app.css')
    <!-- Remove Alpine.js -->
    <!-- <script src="https://cdn.jsdelivr.net/npm/alpinejs@2.8.2/dist/alpine.min.js" defer></script> -->
</head>

<body class="bg-white h-screen flex items-center justify-center">
    <div class="h-screen w-full flex items-center justify-center">
        <div class="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
            <div class="absolute top-0 right-0 p-6 flex items-center space-x-4 z-10">
                <div class="relative">
                    <button class="bg-gray-800 text-white px-4 py-2 rounded-md text-sm" id="language-button">
                        {{ __('landings/landing7.language') }}
                    </button>
                    <div id="language-menu" class="hidden absolute right-0 w-40 mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-20">
                        <ul>
                            <li class="flex items-center px-4 py-2">
                                <a href="{{ route('set-language', ['lang' => 'es']) }}" class="text-gray-700">Español</a>
                            </li>
                            <li class="flex items-center px-4 py-2">
                                <a href="{{ route('set-language', ['lang' => 'en']) }}" class="text-gray-700">English</a>
                            </li>
                            <li class="flex items-center px-4 py-2">
                                <a href="{{ route('set-language', ['lang' => 'ca']) }}" class="text-gray-700">Català</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <button class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer">
                    <a href="{{ url('/login') }}" class="text-white">{{ __('landings/landing7.button_login') }}</a>
                </button>
            </div>

            <p class="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-gray-950 sm:text-6xl">{{ __('landings/landing7.title') }}</p>
            <p class="text-center text-sm text-gray-500">{{ __('landings/landing7.tagline') }}</p>

            <div class="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2 group">

                <!-- Bento 1 -->
                <div class="relative lg:row-span-2 transition-all duration-300 ease-in-out group-hover:opacity-50 hover:opacity-100 hover:scale-105">
                    <div class="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                    <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                        <div class="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                            <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">{{ __('landings/landing7.mobile_compatible') }}</p>
                            <p class="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">{{ __('landings/landing7.mobile_description') }}</p>
                        </div>
                        <div class="@container relative h-full w-full max-lg:mx-auto max-lg:max-w-sm">
                            <div class="absolute inset-x-10 top-10 bottom-0 overflow-hidden">
                                <img class="size-full object-cover object-top" src="{{ asset('images/screenshot.jpg') }}" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 lg:rounded-l-[2rem]"></div>
                </div>

                <!-- Bento 2 -->
                <div class="relative max-lg:row-start-1 transition-all duration-300 ease-in-out group-hover:opacity-50 hover:opacity-100 hover:scale-105">
                    <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
                    <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                        <div class="px-8 pt-8 sm:px-10 sm:pt-10">
                            <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">{{ __('landings/landing7.performance') }}</p>
                            <p class="mt-2 mb-3 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">{{ __('landings/landing7.performance_description') }}</p>
                        </div>
                        <div class="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                            <img class="w-full max-lg:max-w-xs" src="https://tailwindui.com/plus-assets/img/component-images/bento-03-performance.png" alt="" />
                        </div>
                    </div>
                    <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-t-[2rem]"></div>
                </div>

                <!-- Bento 3 -->
                <div class="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2 transition-all duration-300 ease-in-out group-hover:opacity-50 hover:opacity-100 hover:scale-105">
                    <div class="absolute inset-px rounded-lg bg-white"></div>
                    <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                        <div class="px-8 pt-8 sm:px-10 sm:pt-10">
                            <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">{{ __('landings/landing7.security') }}</p>
                            <p class="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">{{ __('landings/landing7.security_description') }}</p>
                        </div>
                        <div class="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                            <img class="h-[120px] max-w-[80%] object-cover" src="https://tailwindui.com/plus-assets/img/component-images/bento-03-security.png" alt="" />
                        </div>
                    </div>
                    <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5"></div>
                </div>

                <!-- Bento 4 -->
                <div class="relative lg:row-span-2 transition-all duration-300 ease-in-out group-hover:opacity-50 hover:opacity-100 hover:scale-105">
                    <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
                    <div class="relative lg:row-span-2 transition-all duration-300 ease-in-out group-hover:opacity-50 hover:opacity-100 hover:scale-105">
                        <div class="relative flex h-full flex-col overflow-hidden">
                            <div class="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">{{ __('landings/landing7.interactive_map') }}</p>
                                <p class="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">{{ __('landings/landing7.interactive_map_description') }}</p>
                            </div>
                            <div class="relative h-full w-full">
                                <div class="px-6 pt-6 pb-14">
                                    <img src="{{ asset('images/urbantree-map.jpg') }}" alt="Mapa interactivo" class="w-full h-96 object-cover rounded-3xl">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
                </div>

            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const languageButton = document.getElementById('language-button');
            const languageMenu = document.getElementById('language-menu');

            languageButton.addEventListener('click', function () {
                languageMenu.classList.toggle('hidden');
            });

            document.addEventListener('click', function (event) {
                if (!languageButton.contains(event.target) && !languageMenu.contains(event.target)) {
                    languageMenu.classList.add('hidden');
                }
            });
        });
    </script>
</body>

</html>
