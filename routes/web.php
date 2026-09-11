<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Welcome')->name('home');
Route::inertia('/board-preview', 'BoardPreview')->name('board.preview');
