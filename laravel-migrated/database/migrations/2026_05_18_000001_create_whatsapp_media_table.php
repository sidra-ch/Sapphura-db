<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('whatsapp_media', function (Blueprint $table) {
            $table->id();
            $table->string('from_number')->nullable();
            $table->string('media_url');
            $table->string('cloudinary_url')->nullable();
            $table->string('cloudinary_public_id')->nullable();
            $table->string('type')->default('image'); // image | video
            $table->string('caption')->nullable();
            $table->boolean('uploaded_to_cloudinary')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('whatsapp_media');
    }
};
