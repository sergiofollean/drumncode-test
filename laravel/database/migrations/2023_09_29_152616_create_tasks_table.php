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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('title', 100)->nullable(false);
            $table->text('description')->nullable(false);
            $table->string('status', 20)->nullable(false)->default('todo');
            $table->foreignId('user_id')->nullable(false)->constrained('users');
            $table->integer('priority')->nullable(false)->default(0);
            $table->timestamp('completed_at')->nullable(true);
            $table->integer('parent_id')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
