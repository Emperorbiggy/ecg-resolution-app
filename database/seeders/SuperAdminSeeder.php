<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'superadmin@oirs.gov.ng'],
            [
                'name'      => 'Super Administrator',
                'password'  => Hash::make('Admin@123456'),
                'role'      => 'super_admin',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'accountant@oirs.gov.ng'],
            [
                'name'      => 'John Accountant',
                'password'  => Hash::make('Admin@123456'),
                'role'      => 'accountant',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'officer@oirs.gov.ng'],
            [
                'name'      => 'Jane Officer',
                'password'  => Hash::make('Admin@123456'),
                'role'      => 'resolution_officer',
                'is_active' => true,
            ]
        );
    }
}
