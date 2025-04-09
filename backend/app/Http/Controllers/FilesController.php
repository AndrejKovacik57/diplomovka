<?php

namespace App\Http\Controllers;

use App\Models\files;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class FilesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Log::info('test log');
         return response()->json([
             'status' => 'ok',
             'message' => 'Welcome to the Files API'
         ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(files $files)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, files $files)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(files $files)
    {
        //
    }
}
