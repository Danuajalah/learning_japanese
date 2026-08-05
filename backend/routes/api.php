<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\SenseiController;

Route::prefix('auth')->group(function () {
    Route::post('/sign-in', [AuthController::class, 'signIn']);
    Route::post('/sign-out', [AuthController::class, 'signOut']);
    Route::post('/refresh', [AuthController::class, 'refreshToken']);
});

Route::middleware('supabase')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::prefix('lessons')->group(function () {
        Route::get('/', [LessonController::class, 'index']);
        Route::get('/{lesson}', [LessonController::class, 'show']);
        Route::post('/{lesson}/complete', [LessonController::class, 'complete']);
    });

    Route::prefix('progress')->group(function () {
        Route::get('/', [ProgressController::class, 'index']);
        Route::get('/daily-goal', [ProgressController::class, 'dailyGoal']);
        Route::post('/', [ProgressController::class, 'store']);
        Route::put('/{progress}', [ProgressController::class, 'update']);
    });

    Route::prefix('sensei')->group(function () {
        Route::get('/conversations', [SenseiController::class, 'conversations']);
        Route::post('/conversations', [SenseiController::class, 'createConversation']);
        Route::get('/conversations/{conversation}', [SenseiController::class, 'showConversation']);
        Route::delete('/conversations/{conversation}', [SenseiController::class, 'deleteConversation']);
        Route::post('/conversations/{conversation}/messages', [SenseiController::class, 'sendMessage']);
    });
});
