<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\SupabaseService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

        try {
            $lessons = Lesson::orderBy('unit_number', 'asc')->get();

            if ($userId && $this->supabase->isConfigured()) {
                $progressResponse = $this->supabase->get('user_progress', [
                    'user_id' => 'eq.' . $userId,
                ], true);

                $progressMap = [];
                if ($progressResponse->successful() && $progressResponse->json()) {
                    foreach ($progressResponse->json() as $p) {
                        $progressMap[$p['lesson_id']] = $p;
                    }
                }

                foreach ($lessons as $lesson) {
                    if (isset($progressMap[$lesson->id])) {
                        $lesson->status = 'completed';
                        $lesson->progress = 100;
                    } else {
                        $prevLesson = Lesson::where('unit_number', '<', $lesson->unit_number)->orderBy('unit_number', 'desc')->first();
                        if ($prevLesson && isset($progressMap[$prevLesson->id])) {
                            $lesson->status = 'in_progress';
                        } elseif (!$prevLesson) {
                            $lesson->status = 'in_progress';
                        } else {
                            $lesson->status = 'locked';
                        }
                        $lesson->progress = 0;
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
                'message' => 'Database unavailable',
            ]);
        }
    }

    public function show(Request $request, string $lessonId): JsonResponse
    {
        try {
            $lesson = Lesson::find($lessonId);

            if (!$lesson) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lesson not found',
                ], 404);
            }

            $userId = $request->attributes->get('supabase_user_id');

            if ($userId && $lesson->unit_number > 1 && $this->supabase->isConfigured()) {
                $prevLesson = Lesson::where('unit_number', $lesson->unit_number - 1)->first();

                if ($prevLesson) {
                    $prevCompleted = false;
                    $prevProgressResponse = $this->supabase->get('user_progress', [
                        'user_id' => 'eq.' . $userId,
                        'lesson_id' => 'eq.' . $prevLesson->id,
                    ], true);

                    if ($prevProgressResponse->successful() && $prevProgressResponse->json()) {
                        $prevCompleted = true;
                    }

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
                'message' => 'Database unavailable',
            ], 500);
        }
    }

    public function complete(Request $request, string $lessonId): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user_id');
        $request->validate([
            'correct_count' => 'required|integer|min:0',
            'total_questions' => 'required|integer|min:1',
        ]);

        try {
            $lesson = Lesson::find($lessonId);
            if (!$lesson) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lesson not found',
                ], 404);
            }

            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated',
                ], 401);
            }

            $now = now();
            $correctCount = (int) $request->input('correct_count');
            $totalQuestions = (int) $request->input('total_questions');
            $passingScore = (int) ($lesson->passing_score ?? 70);
            $scorePercentage = $totalQuestions > 0 ? ($correctCount / $totalQuestions) * 100 : 0;
            $passed = $scorePercentage >= $passingScore;

            $baseXp = (int) ($lesson->xp_reward ?? 50);
            $xpEarned = 0;

            if ($passed) {
                $xpEarned = (int) round($baseXp * ($correctCount / $totalQuestions));
                if ($correctCount === $totalQuestions && $totalQuestions > 0) {
                    $xpEarned = (int) round($xpEarned * 1.2);
                }
            }

            if (!$this->supabase->isConfigured()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Supabase not configured',
                ], 500);
            }

            $existingResponse = $this->supabase->get('user_progress', [
                'user_id' => 'eq.' . $userId,
                'lesson_id' => 'eq.' . $lessonId,
            ], true);

            $existingXp = 0;
            $existingId = null;
            if ($existingResponse->successful() && $existingResponse->json()) {
                $existingXp = (int) ($existingResponse->json()[0]['xp'] ?? 0);
                $existingId = $existingResponse->json()[0]['id'];
            }

            $allProgressResponse = $this->supabase->get('user_progress', [
                'user_id' => 'eq.' . $userId,
            ], true);

            $allXp = 0;
            if ($allProgressResponse->successful()) {
                foreach ($allProgressResponse->json() as $p) {
                    $allXp += (int) ($p['xp'] ?? 0);
                }
            }
            $totalXp = $allXp - $existingXp + $xpEarned;
            $level = (int) ceil($totalXp / 100.0);

            $nowIso = $now->toIso8601String();
            $data = [
                'user_id' => $userId,
                'lesson_id' => $lessonId,
                'xp' => $xpEarned,
                'level' => $level,
                'total_xp' => $totalXp,
                'streak' => 1,
                'last_completed_at' => $nowIso,
                'updated_at' => $nowIso,
            ];

            if ($existingId) {
                $saveResponse = $this->supabase->patch('user_progress', $existingId, $data, true);
            } else {
                $data['created_at'] = $nowIso;
                $saveResponse = $this->supabase->post('user_progress', $data, true);
            }

            if ($saveResponse->failed()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to save progress: ' . $saveResponse->body(),
                ], 500);
            }

            $today = $now->toDateString();
            $dailyGoalResponse = $this->supabase->get('daily_goals', [
                'user_id' => 'eq.' . $userId,
                'date' => 'eq.' . $today,
            ], true);

            if ($dailyGoalResponse->successful() && !empty($dailyGoalResponse->json())) {
                $currentGoal = $dailyGoalResponse->json()[0];
                $newCompleted = (int) ($currentGoal['completed'] ?? 0) + 1;
                $newXp = (int) ($currentGoal['xp'] ?? 0) + $xpEarned;
                $goalId = $currentGoal['id'];
                $this->supabase->patch('daily_goals', $goalId, [
                    'completed' => $newCompleted,
                    'xp' => $newXp,
                    'updated_at' => $nowIso,
                ], true);
            } else {
                $this->supabase->post('daily_goals', [
                    'user_id' => $userId,
                    'completed' => 1,
                    'total' => 5,
                    'xp' => $xpEarned,
                    'date' => $today,
                    'created_at' => $nowIso,
                    'updated_at' => $nowIso,
                ], true);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lesson completed successfully',
                'data' => [
                    'xp_earned' => $xpEarned,
                    'passed' => $passed,
                    'total_xp' => $totalXp,
                    'level' => $level,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Complete lesson failed', [
                'user_id' => $userId,
                'lesson_id' => $lessonId,
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Database unavailable: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function submitAnswer(Request $request, string $lessonId): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user_id');

        $request->validate([
            'question_index' => 'required|integer|min:0',
            'answer' => 'required|string',
        ]);

        try {
            $lesson = Lesson::find($lessonId);

            if (!$lesson) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lesson not found',
                ], 404);
            }

            if ($userId && $lesson->unit_number > 1 && $this->supabase->isConfigured()) {
                $prevLesson = Lesson::where('unit_number', $lesson->unit_number - 1)->first();

                if ($prevLesson) {
                    $prevCompleted = false;
                    $prevProgressResponse = $this->supabase->get('user_progress', [
                        'user_id' => 'eq.' . $userId,
                        'lesson_id' => 'eq.' . $prevLesson->id,
                    ], true);

                    if ($prevProgressResponse->successful() && $prevProgressResponse->json()) {
                        $prevCompleted = true;
                    }

                    if (!$prevCompleted) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Lesson is locked. Complete the previous unit first.',
                            'locked' => true,
                        ], 403);
                    }
                }
            }

            $questions = $lesson->questions ?? [];
            $questions = is_string($questions) ? json_decode($questions, true) : $questions;
            $questions = $questions ?? [];
            $questionIndex = (int) $request->input('question_index');
            $userAnswer = $request->input('answer');
            $passingScore = (int) ($lesson->passing_score ?? 70);
            $totalQuestions = count($questions);

            if ($questionIndex < 0 || $questionIndex >= $totalQuestions) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid question index',
                ], 400);
            }

            $question = $questions[$questionIndex];
            $isCorrect = isset($question['correct_answer']) && trim((string) $question['correct_answer']) === trim((string) $userAnswer);
            $explanation = $question['explanation'] ?? '';

            return response()->json([
                'success' => true,
                'data' => [
                    'question_index' => $questionIndex,
                    'correct' => $isCorrect,
                    'explanation' => $explanation,
                    'total_questions' => $totalQuestions,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Database unavailable',
            ], 500);
        }
    }
}
