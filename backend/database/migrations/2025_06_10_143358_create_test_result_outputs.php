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
        Schema::create('test_result_outputs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solution_test_result_id')->constrained()->onDelete('cascade');
            $table->json('input');
            $table->json('expected_output');
            $table->json('actual_output');
            $table->enum('subtest_status', ['passed', 'failed']);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_result_outputs');
    }
};
