<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorefilesRequest;
use App\Http\Requests\UpdatefilesRequest;
use App\Models\files;

class FilesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorefilesRequest $request)
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
    public function update(UpdatefilesRequest $request, files $files)
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
