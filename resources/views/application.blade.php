<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>{{ config('app.name') }}</title>
    <link rel="icon" href="{{ asset('favicon.ico') }}" />
    <script src="https://kit.fontawesome.com/f03c46a869.js" crossorigin="anonymous"></script>
    @vite('resources/ts/main.tsx')
</head>

<body>
    <div id="app"></div>
</body>

</html>
