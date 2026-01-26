<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'first_name' => 'Admin',
            'last_name' => 'AssoManager',
            'email' => 'admin@assomanager.com',
            'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
            'role' => 'ADMIN',
            'status' => 'ACTIVE',
        ]);
    }
}
