<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SenseiController extends Controller
{
    protected SupabaseService $supabase;
    protected GeminiService $gemini;

    public function __construct(SupabaseService $supabase, GeminiService $gemini)
    {
        $this->supabase = $supabase;
        $this->gemini = $gemini;
    }

    public function conversations(Request $request): JsonResponse
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
            $response = $this->supabase->get('chat_conversations', [
                'user_id' => 'eq.' . $userId,
                'order' => 'updated_at.desc',
                'limit' => '50',
            ], true);

            if ($response->failed()) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'No conversations found',
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
                'message' => 'Failed to fetch conversations',
            ]);
        }
    }

    public function createConversation(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user_id');

        if (!$this->supabase->isConfigured()) {
            return response()->json([
                'success' => false,
                'message' => 'Supabase not configured',
            ], 503);
        }

        try {
            $response = $this->supabase->post('chat_conversations', [
                'user_id' => $userId,
                'title' => 'New Conversation',
            ], true);

            if ($response->failed()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create conversation',
                ], 500);
            }

            $data = $response->json();
            $conversation = is_array($data) && isset($data[0]) ? $data[0] : $data;

            return response()->json([
                'success' => true,
                'data' => $conversation,
                'message' => 'Conversation created',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create conversation',
            ], 500);
        }
    }

    public function showConversation(Request $request, string $conversationId): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user_id');

        if (!$this->supabase->isConfigured()) {
            return response()->json([
                'success' => false,
                'message' => 'Supabase not configured',
            ], 503);
        }

        try {
            $convResponse = $this->supabase->get('chat_conversations', [
                'id' => 'eq.' . $conversationId,
                'user_id' => 'eq.' . $userId,
            ], true);

            if ($convResponse->failed() || empty($convResponse->json())) {
                return response()->json([
                    'success' => false,
                    'message' => 'Conversation not found',
                ], 404);
            }

            $conversation = $convResponse->json()[0];

            $msgResponse = $this->supabase->get('chat_messages', [
                'conversation_id' => 'eq.' . $conversationId,
                'order' => 'created_at.asc',
            ], true);

            $messages = $msgResponse->successful() ? ($msgResponse->json() ?? []) : [];

            return response()->json([
                'success' => true,
                'data' => [
                    'conversation' => $conversation,
                    'messages' => $messages,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch conversation',
            ], 500);
        }
    }

    public function sendMessage(Request $request, string $conversationId)
    {
        set_time_limit(0);

        $userId = $request->attributes->get('supabase_user_id');
        $message = $request->input('message');

        if (!$message || trim($message) === '') {
            return response()->json([
                'success' => false,
                'message' => 'Message is required',
            ], 422);
        }

        if (!$this->supabase->isConfigured()) {
            return response()->json([
                'success' => false,
                'message' => 'Backend not configured',
            ], 503);
        }

        if (!$this->gemini->isConfigured()) {
            return response()->json([
                'success' => false,
                'message' => 'AI service not configured',
            ], 503);
        }

        $convResponse = $this->supabase->get('chat_conversations', [
            'id' => 'eq.' . $conversationId,
            'user_id' => 'eq.' . $userId,
        ], true);

        if ($convResponse->failed() || empty($convResponse->json())) {
            return response()->json([
                'success' => false,
                'message' => 'Conversation not found',
            ], 404);
        }

        $now = now()->toIso8601String();
        $conversation = $convResponse->json()[0];

        $this->supabase->post('chat_messages', [
            'conversation_id' => $conversationId,
            'role' => 'user',
            'content' => $message,
            'created_at' => $now,
        ], true);

        if (($conversation['title'] ?? '') === 'New Conversation') {
            $title = $this->gemini->generateTitle($message);
            $this->supabase->patch('chat_conversations', $conversationId, [
                'title' => $title,
                'updated_at' => $now,
            ], true);
        }

        $msgResponse = $this->supabase->get('chat_messages', [
            'conversation_id' => 'eq.' . $conversationId,
            'order' => 'created_at.asc',
        ], true);

        $history = $msgResponse->successful() ? ($msgResponse->json() ?? []) : [];
        $contents = $this->gemini->buildContents($history);

        $geminiResponse = $this->gemini->streamGenerateContent($contents);

        if ($geminiResponse === false) {
            Log::error('Gemini API request failed (Guzzle exception)', [
                'conversation_id' => $conversationId,
                'user_id' => $request->attributes->get('supabase_user_id'),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to connect to the AI service. Please check your Gemini API key and try again.',
            ], 502);
        }

        if ($geminiResponse->getStatusCode() !== 200) {
            $errorBody = $geminiResponse->getBody()->getContents();
            $error = json_decode($errorBody, true);
            $geminiMessage = $error['error']['message'] ?? null;
            $geminiCode = $error['error']['code'] ?? null;

            Log::error('Gemini API returned non-200', [
                'conversation_id' => $conversationId,
                'status' => $geminiResponse->getStatusCode(),
                'error_body' => $errorBody,
                'api_key_set' => !empty(config('gemini.api_key')),
                'model' => config('gemini.model'),
            ]);

            return response()->json([
                'success' => false,
                'message' => $geminiMessage ?: 'Gemini API returned status ' . $geminiResponse->getStatusCode(),
                'code' => $geminiCode,
            ], 502);
        }

        $body = $geminiResponse->getBody();
        $supabase = $this->supabase;

        return response()->stream(function () use ($body, $conversationId, $now, $supabase) {
            $fullText = '';
            $buffer = '';

            while (!$body->eof()) {
                $chunk = $body->read(8192);
                if ($chunk === '') {
                    usleep(1000);
                    continue;
                }

                $buffer .= $chunk;

                while (($pos = strpos($buffer, "\n")) !== false) {
                    $line = substr($buffer, 0, $pos);
                    $buffer = substr($buffer, $pos + 1);

                    $text = $this->gemini->parseStreamChunk($line);
                    if ($text !== null && $text !== '') {
                        $fullText .= $text;
                        echo "data: " . json_encode(['content' => $text, 'done' => false]) . "\n\n";
                        @ob_flush();
                        @flush();
                    }
                }
            }

            if (trim($buffer) !== '') {
                $text = $this->gemini->parseStreamChunk($buffer);
                if ($text !== null && $text !== '') {
                    $fullText .= $text;
                    echo "data: " . json_encode(['content' => $text, 'done' => false]) . "\n\n";
                    @ob_flush();
                    @flush();
                }
            }

            echo "data: " . json_encode(['content' => '', 'done' => true]) . "\n\n";
            @ob_flush();
            @flush();

            if ($fullText !== '') {
                $supabase->post('chat_messages', [
                    'conversation_id' => $conversationId,
                    'role' => 'assistant',
                    'content' => $fullText,
                    'created_at' => now()->toIso8601String(),
                ], true);

                $supabase->patch('chat_conversations', $conversationId, [
                    'updated_at' => now()->toIso8601String(),
                ], true);
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    public function deleteConversation(Request $request, string $conversationId): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user_id');

        if (!$this->supabase->isConfigured()) {
            return response()->json([
                'success' => false,
                'message' => 'Backend not configured',
            ], 503);
        }

        try {
            $convResponse = $this->supabase->get('chat_conversations', [
                'id' => 'eq.' . $conversationId,
                'user_id' => 'eq.' . $userId,
            ], true);

            if ($convResponse->failed() || empty($convResponse->json())) {
                return response()->json([
                    'success' => false,
                    'message' => 'Conversation not found',
                ], 404);
            }

            $this->supabase->deleteWhere('chat_messages', [
                'conversation_id' => 'eq.' . $conversationId,
            ], true);

            $this->supabase->delete('chat_conversations', $conversationId, true);

            return response()->json([
                'success' => true,
                'message' => 'Conversation deleted',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete conversation',
            ], 500);
        }
    }
}
