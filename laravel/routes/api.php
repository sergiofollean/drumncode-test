<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->get('/tasks', [\App\Http\Controllers\TaskController::class, 'index']);

Route::middleware(['auth:sanctum'])->post('/tasks', [\App\Http\Controllers\TaskController::class, 'store']);

Route::middleware(['auth:sanctum'])->put('/tasks', [\App\Http\Controllers\TaskController::class, 'updateMany']);
Route::middleware(['auth:sanctum'])->put('/tasks/{id}', [\App\Http\Controllers\TaskController::class, 'update']);

Route::middleware(['auth:sanctum'])->delete('/tasks/{id}', [\App\Http\Controllers\TaskController::class, 'destroy']);