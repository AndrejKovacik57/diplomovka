<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('solutions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_exercise_id')->constrained('course_exercise')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unique(['course_exercise_id', 'user_id']);
            $table->string('file_path');
            $table->string('file_name');
            $table->enum('test_status', ['pending', 'running', 'finished'])->default('pending');
            $table->text('test_output')->nullable();
            $table->timestamp('submitted_at')->useCurrent();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solutions');
    }
};
