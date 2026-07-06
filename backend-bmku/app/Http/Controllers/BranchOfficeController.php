<?php

namespace App\Http\Controllers;

use App\Services\BranchOfficeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BranchOfficeController extends Controller
{
    public function __construct(
        protected BranchOfficeService $branchOfficeService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $branchOffices = $this->branchOfficeService->getBranchOffices();

        return response()->json([
            'success' => true,
            'message' => 'Branch offices retrieved successfully.',
            'data' => $branchOffices,
        ]);
    }

    /**
     * Store a newly created resource.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:branch_offices,code',
            'name' => 'required|string|max:100',
            'location' => 'nullable|string',
        ]);

        $branchOffice = $this->branchOfficeService->createBranchOffice($validated);

        return response()->json([
            'success' => true,
            'message' => 'Branch office created successfully.',
            'data' => $branchOffice,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $branchOffice = $this->branchOfficeService->getBranchOfficeById($id);

        return response()->json([
            'success' => true,
            'message' => 'Branch office retrieved successfully.',
            'data' => $branchOffice,
        ]);
    }

    /**
     * Update the specified resource.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:branch_offices,code,' . $id,
            'name' => 'required|string|max:100',
            'location' => 'nullable|string',
        ]);

        $branchOffice = $this->branchOfficeService->updateBranchOffice($id, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Branch office updated successfully.',
            'data' => $branchOffice,
        ]);
    }

    /**
     * Remove the specified resource.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->branchOfficeService->deleteBranchOffice($id);

        return response()->json([
            'success' => true,
            'message' => 'Branch office deleted successfully.',
        ]);
    }
}