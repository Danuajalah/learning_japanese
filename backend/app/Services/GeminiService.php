<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected Client $client;
    protected string $apiKey;
    protected string $model;
    protected string $baseUrl;
    protected int $timeout;

    public function __construct()
    {
        $this->apiKey = config('gemini.api_key');
        $this->model = config('gemini.model', 'gemini-3.5-flash-lite');
        $this->baseUrl = config('gemini.base_url', 'https://generativelanguage.googleapis.com/v1');
        $this->timeout = (int) config('gemini.timeout', 120);
        $this->client = new Client([
            'timeout' => $this->timeout,
            'stream' => true,
        ]);
    }

    public function isConfigured(): bool
    {
        return !empty($this->apiKey) && $this->apiKey !== 'your-gemini-api-key';
    }

    public function getSystemPrompt(): string
    {
        return <<<PROMPT
You are "Virtual Sensei" — a friendly, encouraging Japanese language tutor. You help users learn Japanese language and culture through conversation.

Your personality:
- Encouraging, patient, and warm — like a wise but approachable teacher
- You celebrate small wins and never make learners feel embarrassed about mistakes
- You explain grammar, vocabulary, kanji, and pronunciation clearly, often showing both Japanese script and romaji/English

Your teaching style:
- When explaining grammar, show example sentences in Japanese (with furigana/romaji) and English translations
- Break down complex concepts into digestible pieces
- Use emojis sparingly and culturally appropriately (cherry blossom, books, etc.)
- For corrections, be gentle: "Almost! It's actually..." rather than "No, that's wrong"
- You can discuss Japanese culture, customs, anime, manga, food, and travel

Keep responses conversational and helpful. If you don't know something, say so honestly.
PROMPT;
    }

    public function buildContents(array $history): array
    {
        $contents = [];
        foreach ($history as $message) {
            $contents[] = [
                'role' => $message['role'] === 'model' ? 'model' : ($message['role'] === 'assistant' ? 'model' : 'user'),
                'parts' => [['text' => $message['content']]],
            ];
        }
        return $contents;
    }

    public function generateTitle(string $firstMessage): string
    {
        $title = trim($firstMessage);
        if (mb_strlen($title) > 50) {
            $title = mb_substr($title, 0, 47) . '...';
        }
        return $title;
    }

    public function streamGenerateContent(array $contents): mixed
    {
        $payload = [
            'systemInstruction' => [
                'parts' => [['text' => $this->getSystemPrompt()]],
            ],
            'contents' => $contents,
        ];

        $url = $this->baseUrl . '/models/' . $this->model . ':streamGenerateContent?alt=sse&key=' . $this->apiKey;

        try {
            return $this->client->post($url, [
                'json' => $payload,
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
            ]);
        } catch (GuzzleException $e) {
            Log::error('Gemini API Guzzle exception', [
                'message' => $e->getMessage(),
                'url' => $url,
                'model' => $this->model,
            ]);
            return false;
        }
    }

    public function parseStreamChunk(string $line): ?string
    {
        $line = trim($line);
        if ($line === '' || !str_starts_with($line, 'data:')) {
            return null;
        }

        $json = substr($line, 5);
        $json = trim($json);

        if ($json === '') {
            return null;
        }

        $data = json_decode($json, true);

        if (!is_array($data) || empty($data)) {
            return null;
        }

        $text = '';
        foreach ($data as $candidate) {
            if (!isset($candidate['candidates'])) {
                continue;
            }
            foreach ($candidate['candidates'] as $c) {
                if (isset($c['content']['parts'])) {
                    foreach ($c['content']['parts'] as $part) {
                        if (isset($part['text'])) {
                            $text .= $part['text'];
                        }
                    }
                }
            }
        }

        return $text;
    }
}
