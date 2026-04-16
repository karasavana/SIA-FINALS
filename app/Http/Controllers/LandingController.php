<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Display the landing page.
     */
    public function index(): Response
    {
        return Inertia::render('Landing', [
            // You can add any data needed for the landing page here
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }
}
