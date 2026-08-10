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
            $response = $this->supabase->get('lessons', [
                'order' => 'order_index.asc',
            ], true);

            if ($response->failed()) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'Failed to fetch from Supabase - returning empty',
                ]);
            }

            $lessons = $response->json();

            if ($userId) {
                $progressResponse = $this->supabase->get('user_progress', [
                    'user_id' => 'eq.' . $userId,
                ], true);

                if ($progressResponse->successful()) {
                    $progressMap = [];
                    foreach ($progressResponse->json() as $p) {
                        $progressMap[$p['lesson_id']] = $p;
                    }

                    foreach ($lessons as &$lesson) {
                        $lessonId = $lesson['id'];
                        if (isset($progressMap[$lessonId])) {
                            $lesson['status'] = 'completed';
                            $lesson['progress'] = 100;
                        } elseif ($lesson['status'] === 'completed') {
                            $lesson['status'] = 'completed';
                            $lesson['progress'] = 100;
                        }
                    }
                }
            }

            return response()->json([
                'success' => true,
                'data' => $lessons,
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
            $userId = $request->attributes->get('supabase_user_id');

            $response = $this->supabase->get('lessons', [
                'id' => 'eq.' . $lessonId,
            ], true);

            if ($response->failed() || empty($response->json())) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lesson not found',
                ], 404);
            }

            $lesson = $response->json()[0];

            if ($userId && $lesson['unit_number'] > 1) {
                $prevResponse = $this->supabase->get('lessons', [
                    'unit_number' => 'eq.' . ($lesson['unit_number'] - 1),
                ], true);

                if ($prevResponse->successful() && !empty($prevResponse->json())) {
                    $prevLesson = $prevResponse->json()[0];

                    $progressResponse = $this->supabase->get('user_progress', [
                        'user_id' => 'eq.' . $userId,
                        'lesson_id' => 'eq.' . $prevLesson['id'],
                    ], true);

                    $prevCompleted = $progressResponse->successful() && !empty($progressResponse->json());

                    if (!$prevCompleted) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Lesson is locked. Complete the previous unit first.',
                            'locked' => true,
                            'data' => $lesson,
                        ], 403);
                    }
                }
            }

            return response()->json([
                'success' => true,
                'data' => $lesson,
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

    public function submitAnswer(Request $request, string $lessonId): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user_id');

        $request->validate([
            'answer' => 'required|string',
        ]);

        try {
            $lessonResponse = $this->supabase->get('lessons', [
                'id' => 'eq.' . $lessonId,
            ], true);

            if ($lessonResponse->failed() || empty($lessonResponse->json())) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lesson not found',
                ], 404);
            }

            $lesson = $lessonResponse->json()[0];

            if ($userId && $lesson['unit_number'] > 1) {
                $prevResponse = $this->supabase->get('lessons', [
                    'unit_number' => 'eq.' . ($lesson['unit_number'] - 1),
                ], true);

                if ($prevResponse->successful() && !empty($prevResponse->json())) {
                    $prevLesson = $prevResponse->json()[0];
                    $progressResponse = $this->supabase->get('user_progress', [
                        'user_id' => 'eq.' . $userId,
                        'lesson_id' => 'eq.' . $prevLesson['id'],
                    ], true);

                    $prevCompleted = $progressResponse->successful() && !empty($progressResponse->json());

                    if (!$prevCompleted) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Lesson is locked. Complete the previous unit first.',
                            'locked' => true,
                        ], 403);
                    }
                }
            }
            $questions = json_decode($lesson['questions'] ?? '[]', true) ?: [];
            $userAnswer = $request->input('answer');
            $passingScore = (int) ($lesson['passing_score'] ?? 70);
            $totalQuestions = count($questions);

            if ($totalQuestions === 0) {
                $xpEarned = $lesson['xp_reward'] ?? 50;
                $completeResponse = $this->supabase->rpc('complete_lesson', [
                    'user_id' => $userId ?? '',
                    'lesson_id' => $lessonId,
                    'xp_earned' => $xpEarned,
                ], true);

                return response()->json([
                    'success' => true,
                    'data' => [
                        'correct' => true,
                        'score' => 100,
                        'xp_earned' => $xpEarned,
                        'passed' => true,
                        'message' => 'Lesson completed!',
                    ],
                ]);
            }

            $correctCount = 0;
            foreach ($questions as $q) {
                if (isset($q['correct_answer']) && trim((string) $q['correct_answer']) === trim((string) $userAnswer)) {
                    $correctCount++;
                }
            }

            $score = $totalQuestions > 0 ? (int) round(($correctCount / $totalQuestions) * 100) : 0;
            $passed = $score >= $passingScore;
            $xpEarned = $passed ? ($lesson['xp_reward'] ?? 50) : 0;

            if ($passed) {
                $this->supabase->rpc('complete_lesson', [
                    'user_id' => $userId ?? '',
                    'lesson_id' => $lessonId,
                    'xp_earned' => $xpEarned,
                ], true);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'correct' => $correctCount === $totalQuestions,
                    'score' => $score,
                    'correct_count' => $correctCount,
                    'total_questions' => $totalQuestions,
                    'xp_earned' => $xpEarned,
                    'passed' => $passed,
                    'message' => $passed
                        ? 'Bagus! Anda lulus dengan skor ' . $score . '%'
                        : 'Skor Anda: ' . $score . '%. Butuh ' . $passingScore . '% untuk lulus.',
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Supabase unavailable',
            ], 500);
        }
    }
}
