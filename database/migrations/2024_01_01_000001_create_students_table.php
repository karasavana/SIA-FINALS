<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('student_id', 20)->unique(); // e.g. 2021-00142
            $table->string('name');
            $table->string('course', 20)->nullable(); // e.g. BSCS, BSIT, etc.
            $table->string('dept', 20)->nullable();   // e.g. COE, CAST, etc.
            $table->string('year', 20)->nullable();  // e.g. 3rd Year
            $table->string('initials', 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
