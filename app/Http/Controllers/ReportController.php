<?php

namespace App\Http\Controllers;

use App\Models\LibraryLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function generate(Request $request): JsonResponse
    {
        $request->validate([
            'type' => 'required|string|in:Hourly,Daily,Weekly,Monthly',
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
            'dept' => 'nullable|string',
            'year' => 'nullable|string',
        ]);

        $query = LibraryLog::with('student')
            ->whereBetween('scanned_at', [
                Carbon::parse($request->date_from)->startOfDay(),
                Carbon::parse($request->date_to)->endOfDay(),
            ]);

        if ($request->dept) {
            $query->whereHas('student', fn($q) => $q->where('dept', $request->dept));
        }

        if ($request->year) {
            $query->whereHas('student', fn($q) => $q->where('year', $request->year));
        }

        $logs = $query->orderBy('scanned_at', 'desc')->get();

        $reportData = $this->groupByType($logs, $request->type);

        return response()->json([
            'success' => true,
            'type' => $request->type,
            'data' => $reportData,
            'total_entries' => $logs->count(),
        ]);
    }

    public function download(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:Hourly,Daily,Weekly,Monthly',
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
            'dept' => 'nullable|string',
            'year' => 'nullable|string',
        ]);

        $query = LibraryLog::with('student')
            ->whereBetween('scanned_at', [
                Carbon::parse($request->date_from)->startOfDay(),
                Carbon::parse($request->date_to)->endOfDay(),
            ]);

        if ($request->dept) {
            $query->whereHas('student', fn($q) => $q->where('dept', $request->dept));
        }

        if ($request->year) {
            $query->whereHas('student', fn($q) => $q->where('year', $request->year));
        }

        $logs = $query->orderBy('scanned_at', 'desc')->get();

        $reportData = $this->groupByType($logs, $request->type);
        $title = $request->type . ' Report (' . $request->date_from . ' to ' . $request->date_to . ')';

        $pdf = Pdf::loadView('reports.pdf', [
            'title' => $title,
            'type' => $request->type,
            'data' => $reportData,
            'total_entries' => $logs->count(),
            'date_from' => $request->date_from,
            'date_to' => $request->date_to,
            'filters' => [
                'dept' => $request->dept ?: 'All',
                'year' => $request->year ?: 'All',
            ],
        ]);

        return $pdf->download($title . '.pdf');
    }

    private function groupByType($logs, $type)
    {
        $grouped = [];

        foreach ($logs as $log) {
            $key = match($type) {
                'Hourly' => $log->scanned_at->format('Y-m-d H:00'),
                'Daily' => $log->scanned_at->format('Y-m-d'),
                'Weekly' => $log->scanned_at->format('Y-\WW'),
                'Monthly' => $log->scanned_at->format('Y-m'),
                default => 'Unknown'
            };

            if (!isset($grouped[$key])) {
                $grouped[$key] = [
                    'period' => $this->formatPeriod($key, $type),
                    'count' => 0,
                    'entries' => [],
                ];
            }

            $grouped[$key]['count']++;
            $grouped[$key]['entries'][] = [
                'student_id' => $log->student->student_id,
                'name' => $log->student->name,
                'dept' => $log->student->dept,
                'course' => $log->student->course,
                'year' => $log->student->year,
                'timestamp' => $log->scanned_at->format('M d, Y h:i A'),
            ];
        }

        return array_values($grouped);
    }

    private function formatPeriod($key, $type)
    {
        return match($type) {
            'Hourly' => Carbon::parse($key)->format('M d, Y h:00 A'),
            'Daily' => Carbon::parse($key)->format('M d, Y'),
            'Weekly' => 'Week ' . Carbon::parse($key)->format('W, Y'),
            'Monthly' => Carbon::parse($key)->format('F Y'),
            default => $key
        };
    }
}
