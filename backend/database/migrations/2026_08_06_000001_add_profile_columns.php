<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('username')->nullable()->after('display_name');
            $table->text('bio')->nullable()->after('username');
            $table->date('birth_date')->nullable()->after('bio');
            $table->string('gender')->nullable()->after('birth_date');
            $table->string('phone')->nullable()->after('gender');
        });
    }

    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn(['username', 'bio', 'birth_date', 'gender', 'phone']);
        });
    }
};
