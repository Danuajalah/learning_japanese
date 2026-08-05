<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;

class SpaController extends Controller
{
    public function __invoke(Request $request)
    {
        $path = public_path('index.html');

        if (!File::exists($path)) {
            if (app()->environment('local')) {
                return response()->make('
                    <html><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif">
                    <div style="text-align:center">
                    <h2>Komorebi Learning</h2>
                    <p>Frontend dist not found. Run <code>cd frontend && npm run build</code> first, or use <code>npm run dev</code> for development.</p>
                    </div>
                    </body></html>
                ', 200);
            }
            abort(404);
        }

        return response()->file($path);
    }
}
