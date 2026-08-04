<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
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
                'data' => [
                    'daily_goal' => ['completed' => 3, 'total' => 5, 'xp' => 1250],
                    'user_progress' => null,
                    'profile' => null,
                ],
                'message' => 'Supabase not configured - returning sample data',
            ]);
        }

        try {
            $goalResponse = $this->supabase->rpc('get_daily_goal', [
                'user_id' => $userId,
            ], true);

            $progressResponse = $this->supabase->get('user_progress', [
                'user_id' => 'eq.' . $userId,
            ], true);

            $profileResponse = $this->supabase->get('profiles', [
                'id' => 'eq.' . $userId,
            ], true);

            $dailyGoal = $goalResponse->successful() ? $goalResponse->json() : null;
            $progress = $progressResponse->successful() ? $progressResponse->json() : null;
            $profile = $profileResponse->successful() ? ($profileResponse->json()[0] ?? null) : null;

            return response()->json([
                'success' => true,
                'data' => [
                    'daily_goal' => $dailyGoal ?? ['completed' => 3, 'total' => 5, 'xp' => 1250],
                    'user_progress' => $progress,
                    'profile' => $profile,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => true,
                'data' => [
                    'daily_goal' => ['completed' => 3, 'total' => 5, 'xp' => 1250],
                    'user_progress' => null,
                    'profile' => null,
                ],
                'message' => 'Supabase unavailable - returning sample data',
            ]);
        }
    }
}
