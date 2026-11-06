<?php

// Cho phép frontend Next.js (localhost:3000) gọi API Laravel (127.0.0.1:8000).
return [
    'paths' => ['api/*', 'images/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
