<?php

namespace App\Http\Controllers;

use App\Models\LibraryLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = LibraryLog::with('student')->latest('scanned_at');

        if ($request->filled('search')) {
            $q = $request->search;
            $query->whereHas('student', function ($q2) use ($q) {
                $q2->where('name', 'like', "%$q%")
                   ->orWhere('student_id', 'like', "%$q%")
                   ->orWhere('dept', 'like', "%$q%");
            });
        }

        if ($request->filled('dept')) {
            $query->whereHas('student', fn($q) => $q->where('dept', $request->dept));
        }

        if ($request->filled('year')) {
            $query->whereHas('student', fn($q) => $q->where('year', $request->year));
        }

        if ($request->filled('course')) {
            $query->whereHas('student', fn($q) => $q->where('course', $request->course));
        }

        $logs = $query->paginate(50)->through(fn($log) => [
            'id'         => $log->id,
            'student_id' => $log->student->student_id,
            'name'       => $log->student->name,
            'initials'   => $log->student->initials,
            'course'     => $log->student->course,
            'dept'       => $log->student->dept,
            'year'       => $log->student->year,
            'timestamp'  => $log->scanned_at->format('M d, Y, h:i A'),
        ]);

        return response()->json($logs);
    }

    public function export(): StreamedResponse
    {
        $logs = LibraryLog::with('student')->latest('scanned_at')->get();

        return response()->streamDownload(function () use ($logs) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Student ID', 'Name', 'Course', 'Department', 'Year', 'Timestamp']);
            foreach ($logs as $log) {
                fputcsv($handle, [
                    $log->student->student_id,
                    $log->student->name,
                    $log->student->course,
                    $log->student->dept,
                    $log->student->year,
                    $log->scanned_at->format('M d, Y, h:i A'),
                ]);
            }
            fclose($handle);
        }, 'library_logs_' . now()->toDateString() . '.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
