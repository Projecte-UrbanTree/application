<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Urban Tree 5.0</title>
    @vite('resources/css/app.css')
    <script src="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/lib/index.js"></script>
</head>

<body class="bg-white h-screen flex items-center justify-center">
    <div class="h-screen w-full flex items-center justify-center">
        <div class="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
            <!-- Header con el Dropdown de Idioma y el botón de Iniciar sesión -->
            <div class="absolute top-0 right-0 p-6 flex items-center space-x-4 z-10">
                <!-- Dropdown de Idioma -->
                <div class="relative" x-data="{ open: false }" @click.away="open = false">
                    <button class="bg-gray-800 text-white px-4 py-2 rounded-md text-sm" @click="open = !open">
                        Idioma
                    </button>
                    <div x-show="open" x-transition class="absolute right-0 w-40 mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-20">
                        <ul>
                            <li class="flex items-center px-4 py-2">
                                <img class="w-5 h-5 mr-2" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/1024px-Flag_of_Spain.svg.png" alt="Español">
                                <a href="#" class="text-gray-700">Español</a>
                            </li>
                            <li class="flex items-center px-4 py-2">
                                <img class="w-5 h-5 mr-2" src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg" alt="English">
                                <a href="#" class="text-gray-700">English</a>
                            </li>
                            <li class="flex items-center px-4 py-2">
                                <img class="w-5 h-5 mr-2" src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Catalonia.svg" alt="Català">
                                <a href="#" class="text-gray-700">Català</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- Botón de Iniciar sesión -->
                <button class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer">
                    Iniciar sesión
                </button>
            </div>

            <p class="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-gray-950 sm:text-6xl">Urban Tree 5.0</p>
            <p class="text-center text-sm text-gray-500">Cuidando el verde, protegiendo el futuro.</p>
            <div class="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2 group">

                <!-- Bento 1 -->
                <div class="relative lg:row-span-2 transition-all duration-300 ease-in-out group-hover:opacity-50 hover:opacity-100 hover:scale-105">
                    <div class="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                    <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                        <div class="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                            <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Mobile friendly</p>
                            <p class="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.</p>
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
                            <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Performance</p>
                            <p class="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Lorem ipsum, dolor sit amet consectetur adipisicing elit maiores impedit.</p>
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
                            <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Security</p>
                            <p class="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi.</p>
                        </div>
                        <div class="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                            <img class="h-[min(152px,40cqw)] object-cover" src="https://tailwindui.com/plus-assets/img/component-images/bento-03-security.png" alt="" />
                        </div>
                    </div>
                    <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5"></div>
                </div>

                <!-- Bento 4 -->
                <div class="relative lg:row-span-2 transition-all duration-300 ease-in-out group-hover:opacity-50 hover:opacity-100 hover:scale-105">
                    <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
                    <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                        <div class="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                            <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Powerful APIs</p>
                            <p class="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget sem sodales gravida.</p>
                        </div>
                        <div class="relative h-full w-full">
                            <div class="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
                                <div class="flex bg-gray-800/40 ring-1 ring-white/5">
                                    <div class="-mb-px flex text-sm/6 font-medium text-gray-400">
                                        <div class="border-r border-b border-r-white/10 border-b-white/20 bg-white/5 px-4 py-2 text-white">NotificationSetting.jsx</div>
                                        <div class="border-r border-gray-600/10 px-4 py-2">App.jsx</div>
                                    </div>
                                </div>
                                <div class="px-6 pt-6 pb-14">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
                </div>

            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/alpinejs@2.8.2/dist/alpine.min.js" defer></script>
</body>

</html>