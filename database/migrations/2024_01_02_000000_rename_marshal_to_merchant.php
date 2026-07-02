<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Only needed when upgrading an existing DB that still has the old 'marshals' table
        if (Schema::hasTable('marshals')) {
            Schema::rename('marshals', 'merchants');
        }

        if (Schema::hasColumn('payment_resolutions', 'marshal_id')) {
            Schema::table('payment_resolutions', function (Blueprint $table) {
                $table->renameColumn('marshal_id', 'merchant_id');
            });
        }

        if (Schema::hasColumn('payment_resolutions', 'marshal_name')) {
            Schema::table('payment_resolutions', function (Blueprint $table) {
                $table->renameColumn('marshal_name', 'merchant_name');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('merchants') && !Schema::hasTable('marshals')) {
            Schema::rename('merchants', 'marshals');
        }

        if (Schema::hasColumn('payment_resolutions', 'merchant_id')) {
            Schema::table('payment_resolutions', function (Blueprint $table) {
                $table->renameColumn('merchant_id', 'marshal_id');
            });
        }

        if (Schema::hasColumn('payment_resolutions', 'merchant_name')) {
            Schema::table('payment_resolutions', function (Blueprint $table) {
                $table->renameColumn('merchant_name', 'marshal_name');
            });
        }
    }
};
