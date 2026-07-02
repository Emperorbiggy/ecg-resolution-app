<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Rename marshals table to merchants
        Schema::rename('marshals', 'merchants');

        // On payment_resolutions: rename marshal_id to merchant_id and marshal_name to merchant_name
        Schema::table('payment_resolutions', function (Blueprint $table) {
            $table->renameColumn('marshal_id', 'merchant_id');
            $table->renameColumn('marshal_name', 'merchant_name');
        });
    }

    public function down(): void
    {
        // Reverse: rename merchants back to marshals
        Schema::rename('merchants', 'marshals');

        // Reverse column renames
        Schema::table('payment_resolutions', function (Blueprint $table) {
            $table->renameColumn('merchant_id', 'marshal_id');
            $table->renameColumn('merchant_name', 'marshal_name');
        });
    }
};
