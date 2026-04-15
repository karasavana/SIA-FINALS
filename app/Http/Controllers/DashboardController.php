<?php

namespace App\Http\Controllers;

use App\Models\LibraryLog;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = now()->toDateString();

        $todayLogs = LibraryLog::with('student')
            ->whereDate('scanned_at', $today)
            ->latest('scanned_at')
            ->get();

        $weeklyTotal = LibraryLog::whereBetween('scanned_at', [
            now()->startOfWeek(), now()->endOfWeek()
        ])->count();

        // Weekly bar chart data (Mon–Sun)
        $weekDays = collect(range(0, 6))->map(function ($offset) {
            $date = now()->startOfWeek()->addDays($offset);
            return [
                'label' => $date->format('D'),
                'count' => LibraryLog::whereDate('scanned_at', $date->toDateString())->count(),
            ];
        });

        // Department breakdown
        $deptStats = LibraryLog::with('student')
            ->whereDate('scanned_at', $today)
            ->get()
            ->groupBy('student.dept')
            ->map->count();

        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'today'   => $todayLogs->count(),
                'inside'  => max(0, $todayLogs->count() - (int)($todayLogs->count() * 0.3)),
                'weekly'  => $weeklyTotal,
                'departments' => 5,
            ],
            'liveFeed'    => $todayLogs->take(8)->map(fn($log) => $this->formatLog($log)),
            'recentScans' => $todayLogs->take(5)->map(fn($log) => $this->formatLog($log)),
            'weekChart'   => $weekDays,
            'deptStats'   => $deptStats,
        ]);
    }

    private function formatLog(LibraryLog $log): array
    {
        return [
            'id'         => $log->id,
            'student_id' => $log->student->student_id,
            'name'       => $log->student->name,
            'initials'   => $log->student->initials,
            'dept'       => $log->student->dept,
            'course'     => $log->student->course,
            'year'       => $log->student->year,
            'timestamp'  => $log->scanned_at->setTimezone('Asia/Manila')->format('M d, Y, h:i A'),
            'timeOnly'   => $log->scanned_at->setTimezone('Asia/Manila')->format('h:i A'),
        ];
    }
}
