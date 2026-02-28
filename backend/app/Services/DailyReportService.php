<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\ContactMessage;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class DailyReportService
{
    /**
     * Directory where generated reports are stored.
     */
    protected string $storageDir = 'reports/daily';

    /**
     * Collect all data for a specific date.
     *
     * @param  Carbon|null  $date  The date to collect data for (defaults to today)
     * @return array
     */
    public function collectDailyData(?Carbon $date = null): array
    {
        $date = $date ?? Carbon::today();
        $dateString = $date->toDateString(); // YYYY-MM-DD

        // ── Appointments created or updated today ──────────────────────
        $appointments = Appointment::with('user')
            ->where(function ($query) use ($dateString) {
                $query->whereDate('created_at', $dateString)
                    ->orWhereDate('updated_at', $dateString);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        // ── Contact messages created or updated today ──────────────────
        $messages = ContactMessage::with('user')
            ->where(function ($query) use ($dateString) {
                $query->whereDate('created_at', $dateString)
                    ->orWhereDate('updated_at', $dateString);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        // ── New users registered today ─────────────────────────────────
        $newUsers = User::whereDate('created_at', $dateString)
            ->orderBy('created_at', 'desc')
            ->get();

        // ── Summary statistics ─────────────────────────────────────────
        $summary = [
            'total_appointments' => $appointments->count(),
            'pending_appointments' => $appointments->where('status', 'pending')->count(),
            'confirmed_appointments' => $appointments->where('status', 'confirmed')->count(),
            'cancelled_appointments' => $appointments->where('status', 'cancelled')->count(),
            'completed_appointments' => $appointments->where('status', 'completed')->count(),
            'total_messages' => $messages->count(),
            'unread_messages' => $messages->where('is_read', false)->count(),
            'replied_messages' => $messages->whereNotNull('admin_reply')->count(),
            'new_users' => $newUsers->count(),
        ];

        return [
            'date' => $date,
            'date_formatted' => $date->format('l, F j, Y'),
            'summary' => $summary,
            'appointments' => $appointments,
            'messages' => $messages,
            'new_users' => $newUsers,
        ];
    }

    /**
     * Generate a PDF report for a given date.
     *
     * @param  Carbon|null  $date  The date (defaults to today)
     * @return \Barryvdh\DomPDF\PDF
     */
    public function generatePdf(?Carbon $date = null): \Barryvdh\DomPDF\PDF
    {
        $data = $this->collectDailyData($date);

        $pdf = Pdf::loadView('reports.daily', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf;
    }

    /**
     * Generate and persist a PDF report to disk.
     * Returns the file path relative to the storage disk.
     *
     * @param  Carbon|null  $date
     * @return string  Relative path to the stored file
     */
    public function generateAndStore(?Carbon $date = null): string
    {
        $date = $date ?? Carbon::today();
        $pdf = $this->generatePdf($date);

        $filename = $this->buildFilename($date);
        $path = $this->storageDir . '/' . $filename;

        // Store the PDF (overwrites if re-generated for the same day)
        Storage::disk('local')->put($path, $pdf->output());

        return $path;
    }

    /**
     * Get the stored report path for a specific date, or null if not found.
     *
     * @param  Carbon  $date
     * @return string|null
     */
    public function getStoredReportPath(Carbon $date): ?string
    {
        $filename = $this->buildFilename($date);
        $path = $this->storageDir . '/' . $filename;

        return Storage::disk('local')->exists($path) ? $path : null;
    }

    /**
     * List all historical reports with metadata.
     *
     * @return array
     */
    public function listHistoricalReports(): array
    {
        $files = Storage::disk('local')->files($this->storageDir);
        $reports = [];

        foreach ($files as $file) {
            $basename = basename($file);

            // Extract date from filename: report-YYYY-MM-DD.pdf
            if (preg_match('/^report-(\d{4}-\d{2}-\d{2})\.pdf$/', $basename, $matches)) {
                $date = Carbon::parse($matches[1]);
                $reports[] = [
                    'date' => $date->toDateString(),
                    'date_formatted' => $date->format('l, F j, Y'),
                    'filename' => $basename,
                    'path' => $file,
                    'size' => Storage::disk('local')->size($file),
                    'last_modified' => Carbon::createFromTimestamp(
                        Storage::disk('local')->lastModified($file)
                    )->toDateTimeString(),
                ];
            }
        }

        // Sort by date descending (most recent first)
        usort($reports, fn($a, $b) => strcmp($b['date'], $a['date']));

        return $reports;
    }

    /**
     * Delete a stored report by date.
     *
     * @param  Carbon  $date
     * @return bool
     */
    public function deleteReport(Carbon $date): bool
    {
        $path = $this->getStoredReportPath($date);

        if ($path) {
            return Storage::disk('local')->delete($path);
        }

        return false;
    }

    /**
     * Build a consistent filename for a given date.
     *
     * @param  Carbon  $date
     * @return string
     */
    protected function buildFilename(Carbon $date): string
    {
        return 'report-' . $date->toDateString() . '.pdf';
    }
}
