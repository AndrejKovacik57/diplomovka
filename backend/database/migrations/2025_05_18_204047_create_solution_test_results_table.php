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
        Schema::create('solution_test_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solution_id')->constrained()->onDelete('cascade');
            $table->string('test_name'); // e.g., "test_exercise1"
            $table->enum('status', ['passed', 'failed']);
            $table->text('message')->nullable(); // Optional: failure reason, output, etc.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solution_test_results');
    }
};
