<?php
declare(strict_types=1);
require __DIR__ . '/db.php';

if (currentUser()) {
    header('Location: dashboard.php');
    exit;
}

$error = null;
$username = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = (string) ($_POST['username'] ?? '');
    $password = (string) ($_POST['password'] ?? '');

    // LAB: intentionally unsafe query for local SQL injection training.
    // Production code must use a prepared statement and password hashing.
    $query = "SELECT * FROM users WHERE username = '$username' AND password = '$password' LIMIT 1";

    try {
        $user = $db->query($query)->fetch();
        if ($user) {
            $_SESSION['user'] = $user;
            header('Location: dashboard.php');
            exit;
        }
    } catch (PDOException $exception) {
        $error = 'A consulta retornou um erro. Revise os dados enviados.';
    }

    $error ??= 'Usuário ou senha não encontrados.';
}
?>
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Vibe Security Lab | Login</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/style.css">
</head>
<body class="login-page">
    <main class="login-shell">
        <section class="login-intro">
            <div class="brand"><span class="brand-mark">VX</span><span>VIBE / SECURITY LAB</span></div>
            <div class="intro-copy">
                <p class="eyebrow">AMBIENTE DE TREINAMENTO · 01</p>
                <h1>Observe.<br><em>Teste.</em><br>Aprenda.</h1>
                <p>Um laboratório local para entender como pequenos detalhes no código podem mudar completamente o comportamento de um sistema.</p>
            </div>
            <div class="status-line"><span class="pulse"></span> ambiente local protegido <span class="mono">127.0.0.1</span></div>
        </section>
        <section class="login-card-wrap">
            <div class="login-card">
                <div class="card-heading"><div><p class="eyebrow">ACESSO AO PAINEL</p><h2>Bem-vindo de volta.</h2></div><span class="lock-icon">⌁</span></div>
                <?php if ($error): ?><div class="alert"><?= htmlspecialchars($error) ?></div><?php endif; ?>
                <form method="post" action="index.php">
                    <label for="username">Identificador</label>
                    <input id="username" name="username" type="text" placeholder="ex.: marina" value="<?= htmlspecialchars($username) ?>" autocomplete="username" required>
                    <label for="password">Chave de acesso</label>
                    <input id="password" name="password" type="password" placeholder="••••••••" autocomplete="current-password" required>
                    <button type="submit">Entrar no laboratório <span>↗</span></button>
                </form>
                <div class="demo-hint"><span>DEMO</span><div>marina <b>/</b> vibe2026</div></div>
                <p class="lab-note">Este é um ambiente educacional.</p>
            </div>
            <div class="card-footer"><span>VIBE SECURITY LAB</span><span>v0.1.0</span></div>
        </section>
    </main>
</body>
</html>
