<?php
declare(strict_types=1);
require __DIR__ . '/db.php';
unset($_SESSION['secure_user']);
header('Location: index.php');
exit;
