<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreimagesRequest;
use App\Http\Requests\UpdateimagesRequest;
use App\Models\images;

class ImagesController extends Controller
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
    public function store(StoreimagesRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(images $images)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateimagesRequest $request, images $images)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(images $images)
    {
        //
    }
}
