<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'phone' => 'required',
            'date' => 'required|date',
            'service' => 'required',
        ]);

        $data = $request->all();

        // Initialize user_id to null, in case no user is authenticated
        $data['user_id'] = null;

        // Link to user if authenticated
        if ($user = auth('sanctum')->user()) {
            $data['user_id'] = $user->id;
        }

        $appointment = Appointment::create($data);

        return response()->json($appointment, 201);
    }

    public function index()
    {
        return response()->json(Appointment::orderBy('date', 'desc')->get());
    }

    public function updateStatus(Request $request, $id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed'
        ]);

        $appointment->update(['status' => $request->status]);

        return response()->json($appointment);
    }
}
