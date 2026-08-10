<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\SupabaseService;

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

            if ($userId) {
                $progressMap = [];
                foreach (\DB::table('user_progress')->where('user_id', $userId)->get() as $p) {
                    $progressMap[$p->lesson_id] = $p;
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

            if ($userId && $lesson->unit_number > 1) {
                $prevLesson = Lesson::where('unit_number', $lesson->unit_number - 1)->first();

                if ($prevLesson) {
                    $prevCompleted = \DB::table('user_progress')
                        ->where('user_id', $userId)
                        ->where('lesson_id', $prevLesson->id)
                        ->exists();

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
            'xp_earned' => 'required|integer|min:0',
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

            \DB::table('user_progress')->updateOrInsert(
                ['user_id' => $userId, 'lesson_id' => $lessonId],
                [
                    'xp' => $request->input('xp_earned'),
                    'level' => 1,
                    'total_xp' => $request->input('xp_earned'),
                    'streak' => 1,
                    'last_completed_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Lesson completed successfully',
            ]);
        } catch (\Exception $e) {
            \Log::error('Complete lesson failed', [
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

            if ($userId && $lesson->unit_number > 1) {
                $prevLesson = Lesson::where('unit_number', $lesson->unit_number - 1)->first();

                if ($prevLesson) {
                    $prevCompleted = \DB::table('user_progress')
                        ->where('user_id', $userId)
                        ->where('lesson_id', $prevLesson->id)
                        ->exists();

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
