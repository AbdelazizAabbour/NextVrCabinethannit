<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{id}', [DoctorController::class, 'show']);
Route::post('/contact', [ContactController::class, 'store']);
Route::post('/appointments', [AppointmentController::class, 'store']);

// Auth
Route::post('/login', [AuthController::class, 'userLogin']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

// Protected routes (Sanctum)
Route::group(['middleware' => ['auth:sanctum', 'admin']], function () {
    Route::post('/admin/logout', [AuthController::class, 'logout']);
    Route::get('/admin/user', [AuthController::class, 'user']);

    // Dashboard Stats
    Route::get('/admin/dashboard', [AdminController::class, 'stats']);

    // Appointment Management
    Route::get('/admin/appointments', [AppointmentController::class, 'index']);
    Route::patch('/admin/appointments/{id}', [AppointmentController::class, 'updateStatus']);

    // Messages
    Route::get('/admin/messages', [ContactController::class, 'index']);
    Route::patch('/admin/messages/{id}', [ContactController::class, 'updateStatus']);
    Route::delete('/admin/messages/{id}', [ContactController::class, 'destroy']);

    // Admin Users Management
    Route::get('/admin/users', [AdminController::class, 'users']);

    // Patients (from appointments)
    Route::get('/admin/patients', [AdminController::class, 'patients']);
});

// General Protected routes for both users and admins
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
