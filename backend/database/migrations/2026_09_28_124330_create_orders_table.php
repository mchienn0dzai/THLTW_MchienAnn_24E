<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('discount_id')->nullable()->constrained('discounts')->onDelete('set null');
            $table->decimal('total_amount', 15, 2);
            $table->string('shipping_address');
            $table->string('phone', 20);
            $table->string('payment_method')->default('COD');
            $table->string('status')->default('Chờ xác nhận');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('orders'); }
};