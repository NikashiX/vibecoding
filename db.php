<?php
declare(strict_types=1);

session_start();

$databasePath = __DIR__ . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'lab.sqlite';
$dataDirectory = dirname($databasePath);

if (!is_dir($dataDirectory)) {
    mkdir($dataDirectory, 0775, true);
}

$db = new PDO('sqlite:' . $databasePath);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

$db->exec(
    'CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT "Analista",
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )'
);

$userCount = (int) $db->query('SELECT COUNT(*) FROM users')->fetchColumn();
if ($userCount === 0) {
    $seed = $db->prepare('INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)');
    $seed->execute(['Marina Costa', 'marina', 'vibe2026', 'Administradora']);
    $seed->execute(['Rafael Lima', 'rafael', 'lab-demo', 'Analista']);
}

function currentUser(): ?array
{
    return $_SESSION['user'] ?? null;
}

function requireLogin(): void
{
    if (!currentUser()) {
        header('Location: index.php');
        exit;
    }
}
