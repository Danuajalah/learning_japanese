<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LessonController extends Controller
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
                'message' => 'Supabase not configured - returning empty lessons',
            ]);
        }

        try {
            $response = $this->supabase->rpc('get_user_lessons', [
                'user_id' => $userId ?? '',
            ], true);

            if ($response->failed()) {
                $response = $this->supabase->get('lessons', [
                    'order' => 'order_index.asc',
                ], true);
            }

            if ($response->failed()) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'Failed to fetch from Supabase - returning empty',
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

    public function show(Request $request, string $lessonId): JsonResponse
    {
        try {
            $response = $this->supabase->get('lessons', [
                'id' => 'eq.' . $lessonId,
            ], true);

            if ($response->failed() || empty($response->json())) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lesson not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $response->json()[0],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Supabase unavailable',
            ], 500);
        }
    }

    public function complete(Request $request, string $lessonId): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user_id');
        $request->validate([
            'xp_earned' => 'required|integer|min:0',
        ]);

        try {
            $response = $this->supabase->rpc('complete_lesson', [
                'user_id' => $userId ?? '',
                'lesson_id' => $lessonId,
                'xp_earned' => $request->input('xp_earned'),
            ], true);

            if ($response->failed()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to complete lesson',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'data' => $response->json(),
                'message' => 'Lesson completed successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Supabase unavailable',
            ], 500);
        }
    }
}
