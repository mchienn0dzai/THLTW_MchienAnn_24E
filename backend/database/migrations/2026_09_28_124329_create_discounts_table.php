<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->integer('discount_percent');
            $table->decimal('min_order_value', 15, 2)->default(0);
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->integer('usage_limit')->nullable();
            $table->boolean('status')->default(1);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('discounts'); }
};