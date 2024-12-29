<?php

use App\Http\Controllers\CardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Cards :
Route::apiResource('cards', CardController::class);
