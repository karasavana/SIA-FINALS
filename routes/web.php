<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ScanController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

// Landing page (public)
Route::get('/', [LandingController::class, 'index'])->name('landing');

// All routes require authentication (provided by Breeze)
Route::middleware(['auth', 'verified'])->group(function () {

    // Main dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // QR Scanner API
    Route::post('/scan/lookup',   [ScanController::class, 'lookup'])->name('scan.lookup');
    Route::post('/scan/confirm',  [ScanController::class, 'confirm'])->name('scan.confirm');
    Route::post('/scan/process',  [ScanController::class, 'process'])->name('scan.process');
    Route::get('/scan/simulate',  [ScanController::class, 'simulate'])->name('scan.simulate');

    // Student Management
    Route::post('/students',      [StudentController::class, 'store'])->name('students.store');

    // Logs API
    Route::get('/logs',           [LogController::class, 'index'])->name('logs.index');
    Route::get('/logs/export',    [LogController::class, 'export'])->name('logs.export');

    // Reports API
    Route::post('/reports/generate', [ReportController::class, 'generate'])->name('reports.generate');
    Route::post('/reports/download', [ReportController::class, 'download'])->name('reports.download');
});

// Breeze auth routes are loaded automatically
require __DIR__ . '/auth.php';
