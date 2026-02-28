<?php

namespace App\Http\Controllers;

use App\Services\DailyReportService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class DailyReportController extends Controller
{
    protected DailyReportService $reportService;

    public function __construct(DailyReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * GET /api/admin/reports/today
     *
     * Preview today's report data as JSON (without generating a PDF).
     */
    public function preview(): JsonResponse
    {
        $data = $this->reportService->collectDailyData();

        return response()->json([
            'date' => $data['date']->toDateString(),
            'date_formatted' => $data['date_formatted'],
            'summary' => $data['summary'],
            'appointments' => $data['appointments'],
            'messages' => $data['messages'],
            'new_users' => $data['new_users'],
        ]);
    }

    /**
     * POST /api/admin/reports/generate
     *
     * Generate today's PDF report (or for a specific date) and store it.
     * Body (optional): { "date": "2026-02-28" }
     */
    public function generate(Request $request): JsonResponse
    {
        $request->validate([
            'date' => 'nullable|date|date_format:Y-m-d',
        ]);

        $date = $request->date ? Carbon::parse($request->date) : Carbon::today();

        // Prevent generating future reports
        if ($date->isAfter(Carbon::today())) {
            return response()->json([
                'message' => 'Cannot generate a report for a future date.',
            ], 422);
        }

        $path = $this->reportService->generateAndStore($date);

        return response()->json([
            'message' => 'Report generated successfully.',
            'date' => $date->toDateString(),
            'filename' => basename($path),
        ]);
    }

    /**
     * GET /api/admin/reports/download?date=YYYY-MM-DD
     *
     * Download a PDF report. If no stored report exists for the given date,
     * it generates one on-the-fly and also stores it for future access.
     */
    public function download(Request $request)
    {
        $request->validate([
            'date' => 'nullable|date|date_format:Y-m-d',
        ]);

        $date = $request->date ? Carbon::parse($request->date) : Carbon::today();

        // Prevent downloading future reports
        if ($date->isAfter(Carbon::today())) {
            return response()->json([
                'message' => 'Cannot download a report for a future date.',
            ], 422);
        }

        // Try to get an existing stored report
        $storedPath = $this->reportService->getStoredReportPath($date);

        if ($storedPath) {
            // Serve the existing file
            $fullPath = Storage::disk('local')->path($storedPath);

            return response()->download(
                $fullPath,
                'report-' . $date->toDateString() . '.pdf',
                ['Content-Type' => 'application/pdf']
            );
        }

        // No stored report – generate on-the-fly, store, and return
        $path = $this->reportService->generateAndStore($date);
        $fullPath = Storage::disk('local')->path($path);

        return response()->download(
            $fullPath,
            'report-' . $date->toDateString() . '.pdf',
            ['Content-Type' => 'application/pdf']
        );
    }

    /**
     * GET /api/admin/reports/stream?date=YYYY-MM-DD
     *
     * Stream the PDF inline (for browser preview) without forcing download.
     */
    public function stream(Request $request)
    {
        $request->validate([
            'date' => 'nullable|date|date_format:Y-m-d',
        ]);

        $date = $request->date ? Carbon::parse($request->date) : Carbon::today();

        if ($date->isAfter(Carbon::today())) {
            return response()->json([
                'message' => 'Cannot preview a report for a future date.',
            ], 422);
        }

        $pdf = $this->reportService->generatePdf($date);

        return $pdf->stream('report-' . $date->toDateString() . '.pdf');
    }

    /**
     * GET /api/admin/reports/history
     *
     * List all previously generated historical reports.
     */
    public function history(): JsonResponse
    {
        $reports = $this->reportService->listHistoricalReports();

        return response()->json([
            'total' => count($reports),
            'reports' => $reports,
        ]);
    }

    /**
     * DELETE /api/admin/reports/{date}
     *
     * Delete a specific historical report.
     */
    public function destroy(string $date): JsonResponse
    {
        try {
            $parsedDate = Carbon::parse($date);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Invalid date format. Use YYYY-MM-DD.',
            ], 422);
        }

        $deleted = $this->reportService->deleteReport($parsedDate);

        if ($deleted) {
            return response()->json([
                'message' => 'Report deleted successfully.',
            ]);
        }

        return response()->json([
            'message' => 'Report not found for the given date.',
        ], 404);
    }
}
