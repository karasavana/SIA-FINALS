<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

echo "Testing login route...\n";
echo "Current auth status: " . (Auth::check() ? 'authenticated' : 'not authenticated') . "\n";

// Test the login route
try {
    $response = $app->make('router')->dispatch(
        $app->make('request')->create('/login', 'GET')
    );
    echo "Response status: " . $response->getStatusCode() . "\n";
    echo "Response content: " . $response->getContent() . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
