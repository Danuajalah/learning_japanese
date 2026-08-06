<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    protected SupabaseService $supabase;

    public function __construct(SupabaseService $supabase)
    {
        $this->supabase = $supabase;
    }

    public function update(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user_id');

        if (!$this->supabase->isConfigured()) {
            return response()->json([
                'success' => false,
                'message' => 'Backend not configured',
            ], 503);
        }

        $validated = $request->validate([
            'display_name' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:50|unique:profiles,username,' . $userId,
            'bio' => 'nullable|string|max:500',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:perempuan,laki-lain,lainnya',
            'phone' => 'nullable|string|max:20',
            'avatar_url' => 'nullable|url|max:500',
        ]);

        $data = array_filter($validated, fn($v) => $v !== null);

        $response = $this->supabase->patch('profiles', $userId, $data, true);

        if ($response->failed()) {
            Log::error('Failed to update profile', [
                'user_id' => $userId,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
            ], 500);
        }

        $profile = $response->json()[0] ?? $response->json();

        return response()->json([
            'success' => true,
            'data' => $profile,
            'message' => 'Profile updated successfully',
        ]);
    }
}
