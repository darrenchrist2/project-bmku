<?php

namespace App\Http\Controllers;

use App\Services\TechnicianService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TechnicianController extends Controller
{
    public function __construct(
        protected TechnicianService $technicianService
    ) {}

    /**
     * Display all technicians.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Technicians retrieved successfully.',
            'data' => $this->technicianService->getTechnicians(),
        ]);
    }

    /**
     * Store a new technician.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:150',
            'phone_number' => 'nullable|string|max:20',
            'account_number' => 'nullable|string|max:50',
        ]);

        $technician = $this->technicianService->createTechnician($validated);

        return response()->json([
            'success' => true,
            'message' => 'Technician created successfully.',
            'data' => $technician,
        ], 201);
    }

    /**
     * Display a technician.
     */
    public function show(int $id): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Technician retrieved successfully.',
            'data' => $this->technicianService->getTechnicianById($id),
        ]);
    }

    /**
     * Update a technician.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:150',
            'phone_number' => 'nullable|string|max:20',
            'account_number' => 'nullable|string|max:50',
        ]);

        $technician = $this->technicianService->updateTechnician($id, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Technician updated successfully.',
            'data' => $technician,
        ]);
    }

    /**
     * Delete a technician.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->technicianService->deleteTechnician($id);

        return response()->json([
            'success' => true,
            'message' => 'Technician deleted successfully.',
        ]);
    }
}