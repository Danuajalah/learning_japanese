<?php
require __DIR__ . '/../../../vendor/autoload.php';
$app = require_once __DIR__ . '/../../../bootstrap/app.php';
$kernel = $app->make(Illuminate\Foundation\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;

$columns = ['content', 'questions', 'difficulty', 'content_type', 'passing_score', 'unlock_requirement'];
foreach ($columns as $col) {
    $exists = Schema::hasColumn('lessons', $col) ? 'EXISTS' : 'MISSING';
    echo "lessons.$col: $exists
";
}
