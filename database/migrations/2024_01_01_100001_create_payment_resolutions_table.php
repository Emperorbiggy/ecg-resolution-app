<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_resolutions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('merchant_id')->nullable()->constrained('merchants')->nullOnDelete();
            $table->string('ipn')->index();
            $table->date('transaction_date');
            $table->string('merchant_name');
            $table->string('email')->index();
            $table->string('phone');
            $table->enum('bank', ['wema_bank', 'alpha_morgan_bank']);
            $table->string('account_number');
            $table->string('proof_of_payment');
            $table->text('accountant_comment')->nullable();
            $table->enum('resolution_status', ['open', 'reviewing', 'resolved'])->default('open');
            $table->enum('payment_status', ['pending', 'received', 'paid'])->default('pending');
            $table->foreignId('received_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('received_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_resolutions');
    }
};
