<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Appointment;
use App\Models\ContactMessage;
use App\Models\Service;
use Illuminate\Support\Facades\Auth;

class UserDashboardController extends Controller
{
    /**
     * Get all data for the user dashboard
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['message' => 'Non authentifié'], 401);
            }

            // Load relationships
            $messages = $user->messages()->latest()->get();

            // Count unread admin replies
            $unreadReplies = $user->messages()
                ->whereNotNull('admin_reply')
                ->where('reply_read', false)
                ->count();

            $dashboardData = [
                'user' => $user,
                'appointments' => $user->appointments()->latest()->get(),
                'messages' => $messages,
                'selections' => $user->selections()->get(),
                'stats' => [
                    'total_appointments' => $user->appointments()->count(),
                    'total_messages' => $user->messages()->count(),
                    'total_selections' => $user->selections()->count(),
                    'unread_replies' => $unreadReplies,
                ]
            ];

            return response()->json($dashboardData);
        } catch (\Exception $e) {
            \Log::error('Dashboard Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la récupération des données de votre tableau de bord.'
            ], 500);
        }
    }

    /**
     * Toggle service selection (save/unsave)
     */
    public function toggleSelection(Request $request, $serviceId)
    {
        $user = $request->user();
        $service = Service::findOrFail($serviceId);

        if ($user->selections()->where('service_id', $serviceId)->exists()) {
            $user->selections()->detach($serviceId);
            $message = 'Service retiré de vos sélections';
            $selected = false;
        } else {
            $user->selections()->attach($serviceId);
            $message = 'Service ajouté à vos sélections';
            $selected = true;
        }

        return response()->json([
            'message' => $message,
            'selected' => $selected
        ]);
    }

    /**
     * Get specific appointments for the user
     */
    public function appointments(Request $request)
    {
        return response()->json($request->user()->appointments()->latest()->get());
    }

    /**
     * Get specific messages for the user
     */
    public function messages(Request $request)
    {
        return response()->json($request->user()->messages()->latest()->get());
    }

    /**
     * Mark an admin reply as read by the user
     */
    public function markReplyRead(Request $request, $id)
    {
        $user = $request->user();
        $message = $user->messages()->findOrFail($id);

        $message->update(['reply_read' => true]);

        return response()->json(['message' => 'Réponse marquée comme lue', 'data' => $message]);
    }
}
