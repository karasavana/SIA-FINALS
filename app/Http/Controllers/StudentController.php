<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /** Create a new student */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'student_id' => 'required|string|unique:students,student_id',
            'name' => 'required|string',
            'course' => 'nullable|string|required_if:dept,CAST,COE,CON,CCJ,CABM-B,CABM-H',
            'dept' => 'required|string|in:CAST,COE,CON,CCJ,CABM-B,CABM-H,Highschool,GraduateStudies',
            'year' => 'nullable|string|in:1st Year,2nd Year,3rd Year,4th Year|required_if:dept,CAST,COE,CON,CCJ,CABM-B,CABM-H',
        ]);

        $student = Student::create([
            'student_id' => $request->student_id,
            'name' => $request->name,
            'course' => $request->course ?: null,
            'dept' => $request->dept ?: null,
            'year' => $request->year ?: null,
            'initials' => $this->generateInitials($request->name),
        ]);

        return response()->json([
            'success' => true,
            'student' => $student,
        ]);
    }

    private function generateInitials($name)
    {
        $parts = explode(' ', $name);
        $initials = '';
        foreach ($parts as $part) {
            $initials .= strtoupper(substr($part, 0, 1));
        }
        return substr($initials, 0, 2);
    }
}