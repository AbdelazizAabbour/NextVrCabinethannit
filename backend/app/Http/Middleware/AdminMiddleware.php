<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json(['message' => 'Accès refusé. Administrateurs uniquement.'], 403);
        }

        if ($request->user()->auth_provider !== 'email') {
            return response()->json(['message' => 'Les administrateurs doivent être authentifiés via email/mot de passe.'], 403);
        }

        return $next($request);
    }
}
