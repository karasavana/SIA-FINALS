<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\LibraryLog;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $students = [
            ['student_id' => '2021-00142', 'name' => 'Maria Santos',    'course' => 'BSCS', 'dept' => 'CAST', 'year' => '3rd Year'],
            ['student_id' => '2022-00387', 'name' => 'Juan dela Cruz',  'course' => 'BSIT', 'dept' => 'CAST', 'year' => '2nd Year'],
            ['student_id' => '2020-01254', 'name' => 'Ana Reyes',       'course' => 'BSED', 'dept' => 'COE', 'year' => '4th Year'],
            ['student_id' => '2023-00045', 'name' => 'Carlo Bautista',  'course' => 'BSN',  'dept' => 'CON',  'year' => '1st Year'],
            ['student_id' => '2021-00789', 'name' => 'Liza Gomez',      'course' => 'BSBA', 'dept' => 'CABM-B', 'year' => '3rd Year'],
            ['student_id' => '2022-00612', 'name' => 'Mark Villanueva', 'course' => 'BSCS', 'dept' => 'CAST', 'year' => '2nd Year'],
            ['student_id' => '2020-00933', 'name' => 'Jenny Flores',    'course' => 'BSIT', 'dept' => 'CAST', 'year' => '4th Year'],
            ['student_id' => '2023-00210', 'name' => 'Raymond Torres',  'course' => 'BSED', 'dept' => 'COE', 'year' => '1st Year'],
            ['student_id' => '2021-00456', 'name' => 'Patricia Lim',    'course' => 'BSN',  'dept' => 'CON',  'year' => '3rd Year'],
            ['student_id' => '2022-00875', 'name' => 'Andrei Cruz',     'course' => 'BSHM', 'dept' => 'CABM-H', 'year' => '2nd Year'],
        ];

        foreach ($students as $data) {
            $student = Student::create($data);
        }

        // Seed some sample logs
        $sampleLogs = [
            ['student_id' => 1, 'scanned_at' => now()->subHours(5)],
            ['student_id' => 3, 'scanned_at' => now()->subHours(4)],
            ['student_id' => 6, 'scanned_at' => now()->subHours(3)],
            ['student_id' => 8, 'scanned_at' => now()->subHours(2)],
            ['student_id' => 2, 'scanned_at' => now()->subHour()],
        ];

        foreach ($sampleLogs as $log) {
            LibraryLog::create($log);
        }
    }
}
