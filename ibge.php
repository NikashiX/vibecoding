<?php
declare(strict_types=1);

function ibgePopulation(): ?array
{
    $url = 'https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/2024/variaveis/9324?localidades=N1%5Ball%5D';
    $context = stream_context_create(['http' => [
        'method' => 'GET',
        'timeout' => 5,
        'header' => "Accept: application/json\r\nUser-Agent: VibeSecurityLab/1.0\r\n",
    ]]);
    $response = @file_get_contents($url, false, $context);
    if ($response === false) {
        return null;
    }
    $payload = json_decode($response, true);
    $value = $payload[0]['variavel'][0]['resultados'][0]['series'][0]['serie']['2024'] ?? null;
    if (!is_scalar($value) || !is_numeric((string) $value)) {
        return null;
    }
    return ['value' => (int) $value, 'year' => 2024, 'source' => $url];
}
