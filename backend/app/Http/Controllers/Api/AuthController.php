<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    protected SupabaseService $supabase;

    public function __construct(SupabaseService $supabase)
    {
        $this->supabase = $supabase;
    }

    public function signIn(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'nullable|string',
        ]);

        if ($request->filled('password')) {
            $response = $this->supabase->signInWithPassword($request->email, $request->password);
        } else {
            $response = $this->supabase->signInWithOtp($request->email);
        }

        if ($response->failed()) {
            $error = $response->json('error', 'Authentication failed');
            $message = $response->json('msg', $error);
            return response()->json([
                'success' => false,
                'message' => $message,
            ], 401);
        }

        $data = $response->json();

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Signed in successfully',
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        $accessToken = $request->bearerToken();

        if (!$accessToken) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $response = $this->supabase->getUser($accessToken);

        if ($response->failed()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        return response()->json([
            'success' => true,
            'data' => $response->json(),
        ]);
    }

    public function signOut(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Signed out successfully',
        ]);
    }

    public function refreshToken(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Use client-side token refresh',
        ]);
    }
}
