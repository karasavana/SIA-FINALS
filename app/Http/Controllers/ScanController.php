<?php

namespace App\Http\Controllers;

use App\Models\LibraryLog;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScanController extends Controller
{
    /** Look up a student by their QR / student_id */
    public function lookup(Request $request): JsonResponse
    {
        $request->validate(['student_id' => 'required|string']);

        $student = Student::where('student_id', $request->student_id)->first();

        if (!$student) {
            return response()->json([
                'found'      => false,
                'student_id' => $request->student_id,
                'name'       => 'Unknown Student',
                'course'     => 'N/A',
                'dept'       => 'N/A',
                'year'       => 'N/A',
                'initials'   => '??',
                'timestamp'  => now()->setTimezone('Asia/Manila')->format('M d, Y, h:i A'),
            ]);
        }

        return response()->json([
            'found'      => true,
            'id'         => $student->id,
            'student_id' => $student->student_id,
            'name'       => $student->name,
            'initials'   => $student->initials,
            'course'     => $student->course,
            'dept'       => $student->dept,
            'year'       => $student->year,
            'timestamp'  => now()->setTimezone('Asia/Manila')->format('M d, Y, h:i A'),
        ]);
    }

    /** Confirm and save the log entry */
    public function confirm(Request $request): JsonResponse
    {
        $request->validate(['student_id' => 'required|exists:students,id']);

        $log = LibraryLog::create([
            'student_id' => $request->student_id,
            'scanned_at' => now(),
        ]);

        $log->load('student');

        return response()->json([
            'success' => true,
            'log' => [
                'id'        => $log->id,
                'student_id'=> $log->student->student_id,
                'name'      => $log->student->name,
                'initials'  => $log->student->initials,
                'dept'      => $log->student->dept,
                'course'    => $log->student->course,
                'year'      => $log->student->year,
                'timestamp' => $log->scanned_at->setTimezone('Asia/Manila')->format('M d, Y, h:i A'),
                'timeOnly'  => $log->scanned_at->setTimezone('Asia/Manila')->format('h:i A'),
            ],
        ]);
    }

    /** Return a random student for simulation */
    public function simulate(): JsonResponse
    {
        $student = Student::inRandomOrder()->first();

        return response()->json([
            'found'      => true,
            'id'         => $student->id,
            'student_id' => $student->student_id,
            'name'       => $student->name,
            'initials'   => $student->initials,
            'course'     => $student->course,
            'dept'       => $student->dept,
            'year'       => $student->year,
            'timestamp'  => now()->setTimezone('Asia/Manila')->format('M d, Y, h:i A'),
        ]);
    }

    
    public function process(Request $request): JsonResponse
    {
        $request->validate(['student_id' => 'required|string']);

        $student = Student::where('student_id', $request->student_id)->first();

        if (!$student) {
            return response()->json([
                'success'     => false,
                'message'     => 'Student not found',
                'student_id'  => $request->student_id,
            ]);
        }

        $log = LibraryLog::create([
            'student_id' => $student->id,
            'scanned_at' => now(),
        ]);

        $log->load('student');

        return response()->json([
            'success' => true,
            'message' => 'Entry logged successfully',
            'log' => [
                'id'        => $log->id,
                'student_id'=> $log->student->student_id,
                'name'      => $log->student->name,
                'initials'  => $log->student->initials,
                'dept'      => $log->student->dept,
                'course'    => $log->student->course,
                'year'      => $log->student->year,
                'timestamp' => $log->scanned_at->setTimezone('Asia/Manila')->format('M d, Y, h:i A'),
                'timeOnly'  => $log->scanned_at->setTimezone('Asia/Manila')->format('h:i A'),
            ],
        ]);
    }
}
