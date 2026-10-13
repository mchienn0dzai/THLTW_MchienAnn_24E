<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // Thêm cột Khóa tài khoản cho User
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_blocked')->default(false);
        });
        // Tạo bảng Bài viết (Post)
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content');
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::table('users', function (Blueprint $table) { $table->dropColumn('is_blocked'); });
        Schema::dropIfExists('posts');
    }
};