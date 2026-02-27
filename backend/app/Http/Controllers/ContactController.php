<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'subject' => 'required',
            'message' => 'required',
        ]);

        $data = $request->all();

        // Link to user if authenticated
        if ($user = auth('sanctum')->user()) {
            $data['user_id'] = $user->id;
        }

        $message = ContactMessage::create($data);

        return response()->json($message, 201);
    }

    public function index()
    {
        return response()->json(ContactMessage::orderBy('created_at', 'desc')->get());
    }

    public function destroy($id)
    {
        $message = ContactMessage::find($id);
        if ($message) {
            $message->delete();
            return response()->json(['message' => 'Message deleted']);
        }
        return response()->json(['message' => 'Not found'], 404);
    }
    public function updateStatus(Request $request, $id)
    {
        $message = ContactMessage::find($id);
        if (!$message) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $request->validate([
            'is_read' => 'required|boolean'
        ]);

        $message->update(['is_read' => $request->is_read]);

        return response()->json($message);
    }

    public function reply(Request $request, $id)
    {
        $message = ContactMessage::find($id);
        if (!$message) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $request->validate([
            'reply' => 'required|string'
        ]);

        $message->update([
            'admin_reply' => $request->reply,
            'replied_at' => now(),
            'is_read' => true
        ]);

        return response()->json($message);
    }
}

