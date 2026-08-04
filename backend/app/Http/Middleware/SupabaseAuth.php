<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\SupabaseService;

class SupabaseAuth
{
    protected SupabaseService $supabase;

    public function __construct(SupabaseService $supabase)
    {
        $this->supabase = $supabase;
    }

    public function handle(Request $request, Closure $next)
    {
        $bearerToken = $request->bearerToken();

        if ($request->header('X-User-ID')) {
            $request->attributes->set('supabase_user_id', $request->header('X-User-ID'));
            return $next($request);
        }

        if (!$bearerToken) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: No bearer token provided',
            ], 401);
        }

        if (!$this->supabase->isConfigured()) {
            return response()->json([
                'success' => false,
                'message' => 'Supabase not configured',
            ], 503);
        }

        try {
            $response = $this->supabase->getUser($bearerToken);

            if ($response->failed()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized: Invalid token',
                ], 401);
            }

            $user = $response->json();
            $request->attributes->set('supabase_user', $user);
            $request->attributes->set('supabase_user_id', $user['id'] ?? null);

            return $next($request);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication service unavailable',
            ], 503);
        }
    }
}
