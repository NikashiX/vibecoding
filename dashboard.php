<?php
declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/ibge.php';
requireLogin();
$user = currentUser();
$totalUsers = (int) $db->query('SELECT COUNT(*) FROM users')->fetchColumn();
$recentUsers = $db->query('SELECT name, username, role, created_at FROM users ORDER BY id DESC')->fetchAll();
$ibgePopulation = ibgePopulation();
?>
<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Vibe Security Lab | Dashboard</title><link rel="stylesheet" href="assets/style.css"></head>
<body class="dashboard-page">
<aside class="sidebar"><div class="brand"><span class="brand-mark">VX</span><span>VIBE / LAB</span></div><nav><a class="active" href="dashboard.php">◈ Visão geral</a><a href="#users">◌ Participantes</a><a href="#activity">↯ Atividade</a></nav><div class="side-bottom"><div class="side-status"><span class="pulse"></span> sistema online</div><a class="logout" href="logout.php">Sair da conta <span>↗</span></a></div></aside>
<main class="dashboard-main"><header class="topbar"><div><p class="eyebrow">PAINEL DE CONTROLE / VISÃO GERAL</p><h1>Olá, <?= htmlspecialchars(explode(' ', $user['name'])[0]) ?>.</h1></div><div class="profile"><div class="avatar"><?= htmlspecialchars(substr($user['name'], 0, 1)) ?></div><div><strong><?= htmlspecialchars($user['name']) ?></strong><small><?= htmlspecialchars($user['role']) ?></small></div></div></header>
<div class="lab-banner"><div class="banner-icon">!</div><div><strong>Dados públicos do IBGE conectados</strong><p>A população exibida abaixo é consultada na API SIDRA do IBGE.</p></div><span class="mono">IBGE / SIDRA</span></div>
<section class="stats"><article><span class="stat-label">USUÁRIOS NO BANCO</span><strong><?= $totalUsers ?></strong><small>desde a inicialização</small></article><article><span class="stat-label">POPULAÇÃO DO BRASIL</span><strong><?= $ibgePopulation ? number_format($ibgePopulation['value'], 0, ',', '.') : '—' ?></strong><small><i class="green-text">IBGE</i> estimativa <?= $ibgePopulation['year'] ?? 'indisponível' ?></small></article><article><span class="stat-label">STATUS DA SESSÃO</span><strong class="green-text">ATIVA</strong><small>autenticado agora</small></article></section>
<section class="content-grid"><article class="panel" id="users"><div class="panel-title"><div><p class="eyebrow">DADOS PERSISTIDOS</p><h2>Participantes do lab</h2></div><span class="count-pill"><?= $totalUsers ?> registros</span></div><div class="table-wrap"><table><thead><tr><th>NOME</th><th>IDENTIFICADOR</th><th>PERFIL</th><th>ENTRADA</th></tr></thead><tbody><?php foreach ($recentUsers as $participant): ?><tr><td><strong><?= htmlspecialchars($participant['name']) ?></strong></td><td class="mono muted">@<?= htmlspecialchars($participant['username']) ?></td><td><span class="role-pill"><?= htmlspecialchars($participant['role']) ?></span></td><td class="mono muted"><?= htmlspecialchars(substr($participant['created_at'], 0, 10)) ?></td></tr><?php endforeach; ?></tbody></table></div></article><article class="panel activity" id="activity"><div class="panel-title"><div><p class="eyebrow">TELEMETRIA</p><h2>Atividade recente</h2></div><span class="live-dot">AO VIVO</span></div><div class="activity-item"><span class="activity-marker green"></span><div><strong>Sessão iniciada</strong><p>Login autorizado para <?= htmlspecialchars($user['username']) ?></p></div><time>agora</time></div><div class="activity-item"><span class="activity-marker"></span><div><strong>IBGE consultado</strong><p>População estimada via API SIDRA</p></div><time>agora</time></div></article></section>
<footer><span>VIBE SECURITY LAB © 2026</span><span>dados: IBGE / SIDRA</span></footer></main></body></html>
