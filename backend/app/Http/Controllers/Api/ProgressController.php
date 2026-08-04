<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProgressController extends Controller
{
    protected SupabaseService $supabase;

    public function __construct(SupabaseService $supabase)
    {
        $this->supabase = $supabase;
    }

    public function index(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user_id');

        if (!$this->supabase->isConfigured()) {
            return response()->json([
                'success' => true,
                'data' => [],
                'message' => 'Supabase not configured',
            ]);
        }

        try {
            $response = $this->supabase->get('user_progress', [
                'user_id' => 'eq.' . $userId,
            ], true);

            if ($response->failed()) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'No progress data',
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $response->json(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => true,
                'data' => [],
                'message' => 'Supabase unavailable',
            ]);
        }
    }

    public function dailyGoal(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user_id');

        if (!$this->supabase->isConfigured()) {
            return response()->json([
                'success' => true,
                'data' => ['completed' => 3, 'total' => 5, 'xp' => 1250],
                'message' => 'Supabase not configured - returning sample data',
            ]);
        }

        try {
            $response = $this->supabase->rpc('get_daily_goal', [
                'user_id' => $userId ?? '',
            ], true);

            if ($response->failed()) {
                return response()->json([
                    'success' => true,
                    'data' => ['completed' => 3, 'total' => 5, 'xp' => 1250],
                    'message' => 'Using fallback data',
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $response->json(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => true,
                'data' => ['completed' => 3, 'total' => 5, 'xp' => 1250],
                'message' => 'Supabase unavailable - returning sample data',
            ]);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user_id');
        $validated = $request->validate([
            'lesson_id' => 'required|string',
            'xp' => 'required|integer|min:0',
            'level' => 'integer|min:1',
            'total_xp' => 'integer|min:0',
            'streak' => 'integer|min:0',
            'last_completed_at' => 'nullable|date',
        ]);

        try {
            $data = array_merge($validated, [
                'user_id' => $userId,
                'created_at' => now()->toIso8601String(),
                'updated_at' => now()->toIso8601String(),
            ]);

            $response = $this->supabase->post('user_progress', $data, true);

            if ($response->failed()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to store progress',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'data' => $response->json(),
                'message' => 'Progress saved successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Supabase unavailable',
            ], 500);
        }
    }

    public function update(Request $request, string $progress): JsonResponse
    {
        $validated = $request->validate([
            'xp' => 'integer|min:0',
            'level' => 'integer|min:1',
            'total_xp' => 'integer|min:0',
            'streak' => 'integer|min:0',
            'last_completed_at' => 'nullable|date',
        ]);

        try {
            $data = array_merge($validated, [
                'updated_at' => now()->toIso8601String(),
            ]);

            $response = $this->supabase->patch('user_progress', $progress, $data, true);

            if ($response->failed()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to update progress',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'data' => $response->json(),
                'message' => 'Progress updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Supabase unavailable',
            ], 500);
        }
    }
}
