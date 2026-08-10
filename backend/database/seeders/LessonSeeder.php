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
                'subtitle' => 'Basic Characters',
                'description' => 'Learn hiragana characters',
                'content' => "Hiragana adalah sistem penulisan asli Jepang yang digunakan untuk menulis kata-kata asli Jepang, partikel, dan bentuk dasar kata kerja. Hiragana memiliki 46 karakter dasar yang dibagi menjadi beberapa kelompok berdasarkan bunyinya.\n\nKelompok-kelompok hiragana:\n1. Seion (清音) - 46 karakter dasar\n2. Dakuon (濁音) - karakter dengan voiced sound\n3. Handakuon (半濁音) - karakter dengan p-sound\n4. Youon (拗音) - kombinasi karakter untuk suara campuran\n\nHiragana penting karena digunakan untuk:\n- Kata-kata asli Jepang (yahodo)\n- Partikel (wa, ga, ni, de, dll)\n- Okurigana (bagian hiragana setelah kanji)\n- Furigana (panduan baca di atas kanji)",
                'questions' => json_encode([
                    ['id' => 'q1', 'type' => 'multiple_choice', 'question' => 'Berapa jumlah karakter dasar hiragana?', 'options' => ['26', '46', '52', '48'], 'correct_answer' => '46', 'explanation' => 'Hiragana dasar terdiri dari 46 karakter (gojuon).'],
                    ['id' => 'q2', 'type' => 'multiple_choice', 'question' => 'Apa fungsi utama hiragana?', 'options' => ['Hanya untuk kata serapan', 'Kata asli Jepang, partikel, dan okurigana', 'Hanya untuk menulis nama orang', 'Hanya untuk anime subtitle'], 'correct_answer' => 'Kata asli Jepang, partikel, dan okurigana', 'explanation' => 'Hiragana digunakan untuk kata asli Jepang, partikel, dan okurigana (kata kerja yang ditulis hiragana).'],
                    ['id' => 'q3', 'type' => 'true_false', 'question' => 'Hiragana diturunkan dari karakter China.', 'options' => ['Benar', 'Salah'], 'correct_answer' => 'Salah', 'explanation' => 'Hiragana dikembangkan dari sirifikasi karakter China yang disederhanakan oleh perempuan Jepang pada abad ke-9.'],
                ]),
                'difficulty' => 'beginner',
                'content_type' => 'quiz',
                'passing_score' => 70,
                'unlock_requirement' => null,
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
                'subtitle' => 'Foreign Words',
                'description' => 'Learn katakana characters',
                'content' => "Katakana digunakan terutama untuk menulis kata serapan asing, nama negara, nama orang asing, dan onomatopoeia. Katakana juga memiliki 46 karakter dasar yang sama dengan hiragana tapi dengan bentuk yang lebih tegas dan garis lurus.\n\nFungsi utama katakana:\n1. Kata serapan asing (gairaigo) - komputer, テレビ, バス\n2. Nama negara dan asing - Amerika, イギリス, ミスタ\n3. Onomatopoeia - suara alam dan benda (wan, shin, dll)\n4. Nama perusahaan dan brand\n\nPerbedaan hiragana dan katakana:\n- Hiragana: lebih melengkung, untuk kata asli Jepang\n- Katakana: lebih tegas/garis lurus, untuk kata asing\n- Contoh: い (i) hiragana vs イ (i) katakana",
                'questions' => json_encode([
                    ['id' => 'q1', 'type' => 'multiple_choice', 'question' => 'Kapan katakana digunakan?', 'options' => ['Kata asli Jepang', 'Kata serapan asing dan nama orang', 'Hanya partikel', 'Hanya di manga'], 'correct_answer' => 'Kata serapan asing dan nama orang', 'explanation' => 'Katakana digunakan untuk kata serapan asing, nama negara, nama orang asing, dan onomatopoeia.'],
                    ['id' => 'q2', 'type' => 'multiple_choice', 'question' => 'Berapa karakter dasar katakana?', 'options' => ['26', '46', '52', '48'], 'correct_answer' => '46', 'explanation' => 'Katakana dasar juga terdiri dari 46 karakter, sama seperti hiragana.'],
                    ['id' => 'q3', 'type' => 'fill_blank', 'question' => 'Contoh kata serapan asing yang ditulis katakana: コンピューター (kompyuutaa) artinya _______.', 'options' => [], 'correct_answer' => 'komputer', 'explanation' => 'コンピューター (kompyuutaa) berarti komputer dalam bahasa Jepang.'],
                ]),
                'difficulty' => 'beginner',
                'content_type' => 'quiz',
                'passing_score' => 70,
                'unlock_requirement' => 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
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
                'subtitle' => 'Basic Patterns',
                'description' => 'Basic Japanese grammar patterns',
                'content' => "Pada unit ini Anda akan mempelajari pola kalimat dasar N5 yang paling sering digunakan dalam percakapan sehari-hari. Pola kalimat ini merupakan fondasi untuk komunikasi dasar dalam bahasa Jepang.\n\nPola-pola dasar N5:\n\n1. Pola です (desu)\n- X + は + Y + です\n- Artinya: X adalah Y\n- Contoh: 私は学生です (Watashi wa gakusei desu) = Saya adalah mahasiswa\n\n2. Pola あります/います (arimasu/imasu)\n- X + は + Y + があります/います\n- Artinya: Ada Y di X\n- Contoh: 部屋に机があります (Heya ni tsukue ga arimasu) = Ada meja di kamar\n\n3. Pola たい-form\n- Verb-stem + たい\n- Artinya: Ingin melakukan sesuatu\n- Contoh: 寿司を食べたい (Sushi o tabetai) = Ingin makan sushi",
                'questions' => json_encode([
                    ['id' => 'q1', 'type' => 'multiple_choice', 'question' => 'Pola kalimat dasar Jepang adalah?', 'options' => ['Subject + Object + Verb', 'Subject + Verb + Object', 'Object + Subject + Verb', 'Verb + Subject + Object'], 'correct_answer' => 'Subject + Object + Verb', 'explanation' => 'Struktur kalimat dasar Jepang adalah Subjek + Objek + Kata Kerja. Berbeda dari bahasa Indonesia/Inggris.'],
                    ['id' => 'q2', 'type' => 'multiple_choice', 'question' => 'Apa arti dari "Ama suki desu"?', 'options' => ['Saya benci apel', 'Saya suka apel', 'Apel enak', 'Apel mahal'], 'correct_answer' => 'Saya suka apel', 'explanation' => 'Suki (好き) berarti "suka" dalam bahasa Jepang. Ama (Apple) adalah kata serapan Inggris.'],
                    ['id' => 'q3', 'type' => 'true_false', 'question' => 'Kata kerja dalam bahasa Jepang selalu diletakkan di akhir kalimat.', 'options' => ['Benar', 'Salah'], 'correct_answer' => 'Benar', 'explanation' => 'Kata kerja selalu berada di akhir kalimat dalam bahasa Jepang. Ini adalah aturan dasar yang penting.'],
                    ['id' => 'q4', 'type' => 'fill_blank', 'question' => 'Lengkapi kalimat: 私は学生____ (Saya adalah mahasiswa). Jawabannya adalah ___.', 'options' => [], 'correct_answer' => 'desu', 'explanation' => 'です (desu) adalah kata penghubung yang digunakan untuk menyatakan identitas.'],
                ]),
                'difficulty' => 'beginner',
                'content_type' => 'quiz',
                'passing_score' => 70,
                'unlock_requirement' => 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
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
                'subtitle' => 'Salam Dasar',
                'description' => 'Common Japanese greetings',
                'content' => "Unit ini mengajarkan salam-salam dasar yang digunakan dalam kehidupan sehari-hari Jepang. Anda akan mempelajari cara mengucapkan salam pagi, siang, sore, dan malam hari dengan benar, serta cara meminta maaf dan berterima kasih.\n\nSalam berdasarkan waktu:\n\n1. Pagi hari (sebelum 10:00)\n- おはようございます (Ohayou gozaimasu) = Selamat pagi\n- おはよう (Ohayou) = Pagi (tidak formal, untuk teman dekat)\n\n2. Siang hari (10:00 - 17:00)\n- こんにちは (Konnichiwa) = Selamat siang/apa kabar\n- Digunakan juga untuk bersalaman\n\n3. Sore/malam hari (setelah 17:00)\n- こんばんは (Konbanwa) = Selamat malam\n\n4. Sebelum tidur\n- おやすみなさい (Oyasuminasai) = Selamat tidur\n\n5. Lain-lain\n- ありがとうございます (Arigatou gozaimasu) = Terima kasih\n- すみません (Sumimasen) = Maaf / Permisi\n- ごめんなさい (Gomennasai) = Maaf",
                'questions' => json_encode([
                    ['id' => 'q1', 'type' => 'multiple_choice', 'question' => 'Bagaimana cara mengucapkan "Selamat pagi" dalam bahasa Jepang?', 'options' => ['Konnichiwa', 'Ohayou gozaimasu', 'Sayonara', 'Arigatou'], 'correct_answer' => 'Ohayou gozaimasu', 'explanation' => 'Ohayou gozaimasu (おはようございます) berarti selamat pagi.'],
                    ['id' => 'q2', 'type' => 'multiple_choice', 'question' => '"Konnichiwa" digunakan pada waktu?', 'options' => ['Pagi hari', 'Siang hari', 'Malam hari', 'Semua waktu'], 'correct_answer' => 'Siang hari', 'explanation' => 'Konnichiwa (こんにちは) digunakan untuk salam siang hari, sekitar pukul 10:00-17:00.'],
                    ['id' => 'q3', 'type' => 'fill_blank', 'question' => '"Arigatou" artinya _______.', 'options' => [], 'correct_answer' => 'terima kasih', 'explanation' => 'Arigatou (ありがとう) berarti terima kasih. Versi formal: Arigatou gozaimasu.'],
                    ['id' => 'q4', 'type' => 'true_false', 'question' => '"Sumimasen" bisa berarti "maaf" dan "permisi".', 'options' => ['Benar', 'Salah'], 'correct_answer' => 'Benar', 'explanation' => 'Sumimasen (すみません) adalah kata serbaguna yang berarti maaf, permisi, atau terima kasih.'],
                ]),
                'difficulty' => 'beginner',
                'content_type' => 'quiz',
                'passing_score' => 70,
                'unlock_requirement' => 'c3d4e5f6-a7b8-9012-cdef-123456789012',
                'unit_number' => 4,
                'status' => 'locked',
                'xp_reward' => 50,
                'estimated_minutes' => 20,
                'order_index' => 4,
                'color' => '#864e5a',
            ],
            [
                'id' => 'e5f6a7b8-c9d0-1234-efab-345678901234',
                'title' => 'Numbers & Time',
                'subtitle' => 'Counting',
                'description' => 'Counting and telling time',
                'content' => "Pelajari angka dan waktu dalam bahasa Jepang. Unit ini mencakup angka 1-100, jam, hari dalam seminggu, bulan, dan cara menanyakan serta memberitahu waktu.\n\nAngka dasar Jepang:\n\n1-10:\n1. 一 (ichi) = 1\n2. 二 (ni) = 2\n3. 三 (san) = 3\n4. 四 (yon/shi) = 4\n5. 五 (go) = 5\n6. 六 (roku) = 6\n7. 七 (nana/shichi) = 7\n8. 八 (hachi) = 8\n9. 九 (kyuu/ku) = 9\n10. 十 (juu) = 10\n\nJam dalam bahasa Jepang:\n- 1時 (ichi-ji) = jam 1\n- 2時 (ni-ji) = jam 2\n- 3時半 (san-ji han) = jam 3:30\n- 半 (han) = setengah\n\nHari dalam seminggu:\n- 月曜日 (getsuyoubi) = Senin\n- 火曜日 (kayoubi) = Selasa\n- 水曜日 (suiyoubi) = Rabu\n- 木曜日 (mokuyoubi) = Kamis\n- 金曜日 (kinyoubi) = Jumat\n- 土曜日 (doyoubi) = Sabtu\n- 日曜日 (nichiyoubi) = Minggu",
                'questions' => json_encode([
                    ['id' => 'q1', 'type' => 'multiple_choice', 'question' => 'Berapa arti dari "ichi"?', 'options' => ['2', '1', '3', '4'], 'correct_answer' => '1', 'explanation' => 'Ichi (一) berarti 1 dalam bahasa Jepang.'],
                    ['id' => 'q2', 'type' => 'multiple_choice', 'question' => 'Bagaimana cara mengatakan "jam 3" dalam bahasa Jepang?', 'options' => ['San-ji', 'Ni-ji', 'Yo-ji', 'Ichi-ji'], 'correct_answer' => 'San-ji', 'explanation' => 'San-ji (三時) berarti jam 3.'],
                    ['id' => 'q3', 'type' => 'true_false', 'question' => 'Angka "100" dalam bahasa Jepang adalah "hyaku".', 'options' => ['Benar', 'Salah'], 'correct_answer' => 'Benar', 'explanation' => 'Hyaku (百) berarti 100 dalam bahasa Jepang.'],
                    ['id' => 'q4', 'type' => 'multiple_choice', 'question' => 'Hari "Selasa" dalam bahasa Jepang adalah?', 'options' => ['月曜日 (getsuyoubi)', '火曜日 (kayoubi)', '水曜日 (suiyoubi)', '木曜日 (mokuyoubi)'], 'correct_answer' => '火曜日 (kayoubi)', 'explanation' => 'Kayoubi (火曜日) berarti Selasa.'],
                ]),
                'difficulty' => 'beginner',
                'content_type' => 'quiz',
                'passing_score' => 70,
                'unlock_requirement' => 'd4e5f6a7-b8c9-0123-defa-234567890123',
                'unit_number' => 5,
                'status' => 'locked',
                'xp_reward' => 50,
                'estimated_minutes' => 20,
                'order_index' => 5,
                'color' => '#ba002c',
            ],
        ];

        foreach ($lessons as $lesson) {
            Lesson::updateOrCreate(['id' => $lesson['id']], $lesson);
        }
    }
}
