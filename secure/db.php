<?php
declare(strict_types=1);

session_start();

$db = new PDO('sqlite:' . dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'secure.sqlite');
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

if ((int) $db->query('SELECT COUNT(*) FROM users')->fetchColumn() === 0) {
    $seed = $db->prepare('INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)');
    $seed->execute(['Marina Costa', 'marina', password_hash('vibe2026', PASSWORD_DEFAULT), 'Administradora']);
    $seed->execute(['Rafael Lima', 'rafael', password_hash('lab-demo', PASSWORD_DEFAULT), 'Analista']);
}

function currentUser(): ?array
{
    return $_SESSION['secure_user'] ?? null;
}

function requireLogin(): void
{
    if (!currentUser()) {
        header('Location: index.php');
        exit;
    }
}
