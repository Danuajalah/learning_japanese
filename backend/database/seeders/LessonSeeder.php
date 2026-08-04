<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Lesson;

class LessonSeeder extends Seeder
{
    public function run(): void
    {
        $lessons = [
            [
                'id' => 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                'title' => 'Hiragana (ひらがな)',
                'subtitle' => null,
                'description' => 'Learn hiragana characters',
                'unit_number' => 1,
                'status' => 'completed',
                'xp_reward' => 50,
                'estimated_minutes' => 15,
                'order_index' => 1,
                'color' => '#864e5a',
            ],
            [
                'id' => 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
                'title' => 'Katakana (カタカナ)',
                'subtitle' => null,
                'description' => 'Learn katakana characters',
                'unit_number' => 2,
                'status' => 'completed',
                'xp_reward' => 50,
                'estimated_minutes' => 15,
                'order_index' => 2,
                'color' => '#ba002c',
            ],
            [
                'id' => 'c3d4e5f6-a7b8-9012-cdef-123456789012',
                'title' => 'N5 Grammar Intro',
                'subtitle' => null,
                'description' => 'Basic Japanese grammar patterns',
                'unit_number' => 3,
                'status' => 'in_progress',
                'xp_reward' => 100,
                'estimated_minutes' => 30,
                'order_index' => 3,
                'color' => '#516161',
            ],
            [
                'id' => 'd4e5f6a7-b8c9-0123-defa-234567890123',
                'title' => 'Basic Greetings',
                'subtitle' => null,
                'description' => 'Common Japanese greetings',
                'unit_number' => 4,
                'status' => 'locked',
                'xp_reward' => 50,
                'estimated_minutes' => 10,
                'order_index' => 4,
                'color' => '#864e5a',
            ],
            [
                'id' => 'e5f6a7b8-c9d0-1234-efab-345678901234',
                'title' => 'Numbers & Time',
                'subtitle' => null,
                'description' => 'Counting and telling time',
                'unit_number' => 5,
                'status' => 'locked',
                'xp_reward' => 50,
                'estimated_minutes' => 10,
                'order_index' => 5,
                'color' => '#ba002c',
            ],
        ];

        foreach ($lessons as $lesson) {
            Lesson::create($lesson);
        }
    }
}
