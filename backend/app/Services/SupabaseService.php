<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;

class SupabaseService
{
    protected string $url;
    protected string $anonKey;
    protected string $serviceRoleKey;
    protected string $restUrl;
    protected string $authUrl;

    public function __construct()
    {
        $this->url = config('supabase.url');
        $this->anonKey = config('supabase.key');
        $this->serviceRoleKey = config('supabase.service_role_key');
        $this->restUrl = config('supabase.rest_url');
        $this->authUrl = config('supabase.auth_url');
    }

    public function getHeaders(bool $useServiceRole = false): array
    {
        $key = $useServiceRole ? $this->serviceRoleKey : $this->anonKey;

        return [
            'apikey' => $key,
            'Authorization' => 'Bearer ' . $key,
            'Content-Type' => 'application/json',
            'Prefer' => 'return=representation',
        ];
    }

    public function isConfigured(): bool
    {
        return !empty($this->url) && !empty($this->anonKey) && $this->url !== 'https://your-project-ref.supabase.co';
    }

    public function get(string $table, array $params = [], bool $useServiceRole = false): Response
    {
        return Http::withHeaders($this->getHeaders($useServiceRole))
            ->timeout(10)
            ->get($this->restUrl . '/' . $table, $params);
    }

    public function post(string $table, array $data, bool $useServiceRole = false): Response
    {
        return Http::withHeaders($this->getHeaders($useServiceRole))
            ->timeout(10)
            ->post($this->restUrl . '/' . $table, $data);
    }

    public function patch(string $table, string $id, array $data, bool $useServiceRole = false): Response
    {
        return Http::withHeaders($this->getHeaders($useServiceRole))
            ->timeout(10)
            ->patch($this->restUrl . '/' . $table . '?id=eq.' . $id, $data);
    }

    public function delete(string $table, string $id, bool $useServiceRole = false): Response
    {
        return Http::withHeaders($this->getHeaders($useServiceRole))
            ->timeout(10)
            ->delete($this->restUrl . '/' . $table . '?id=eq.' . $id);
    }

    public function deleteWhere(string $table, array $filters, bool $useServiceRole = false): Response
    {
        $queryString = http_build_query($filters);
        $url = $this->restUrl . '/' . $table;
        if (!empty($queryString)) {
            $url .= '?' . $queryString;
        }

        return Http::withHeaders($this->getHeaders($useServiceRole))
            ->timeout(30)
            ->delete($url);
    }

    public function rpc(string $function, array $params = [], bool $useServiceRole = false): Response
    {
        return Http::withHeaders($this->getHeaders($useServiceRole))
            ->timeout(10)
            ->post($this->restUrl . '/rpc/' . $function, $params);
    }

    public function signInWithPassword(string $email, string $password): Response
    {
        return Http::withHeaders($this->getHeaders())
            ->timeout(10)
            ->post($this->authUrl . '/signin', [
                'email' => $email,
                'password' => $password,
            ]);
    }

    public function signInWithOtp(string $email): Response
    {
        return Http::withHeaders($this->getHeaders())
            ->timeout(10)
            ->post($this->authUrl . '/otp', [
                'email' => $email,
                'email_redirect_to' => env('APP_URL') . '/auth/callback',
            ]);
    }

    public function getUser(string $accessToken): Response
    {
        return Http::withHeaders([
            'apikey' => $this->anonKey,
            'Authorization' => 'Bearer ' . $accessToken,
        ])
            ->timeout(10)
            ->get($this->authUrl . '/user');
    }
}
