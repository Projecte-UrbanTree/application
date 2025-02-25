<?php

use App\Http\Middleware\LanguageMiddleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Sentry\Laravel\Integration;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();
        $middleware->append(LanguageMiddleware::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        Integration::handles($exceptions);
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            return response()->json(['error' => 'Unauthorized', 401]);
        });
    })->create();
