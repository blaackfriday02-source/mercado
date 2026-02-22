<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$LEADS_FILE = __DIR__ . '/../data/leads.json';

$body = json_decode(file_get_contents('php://input'), true);
if (!$body) {
    echo json_encode(['ok' => false, 'erro' => 'Dados inválidos']); exit;
}

$dir = dirname($LEADS_FILE);
if (!is_dir($dir)) mkdir($dir, 0755, true);

$leads = [];
if (file_exists($LEADS_FILE)) {
    $leads = json_decode(file_get_contents($LEADS_FILE), true) ?: [];
}

$lead = [
    'data'      => date('d/m/Y H:i:s'),
    'ip'        => $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '',
    'email'     => $body['email']    ?? '',
    'nome'      => $body['nome']     ?? '',
    'telefone'  => $body['telefone'] ?? '',
    'cep'       => $body['cep']      ?? '',
    'endereco'  => $body['endereco'] ?? '',
    'numero'    => $body['numero']   ?? '',
    'bairro'    => $body['bairro']   ?? '',
    'cidade'    => $body['cidade']   ?? '',
    'uf'        => $body['uf']       ?? '',
    'pagamento' => $body['pagamento'] ?? '',
    'valor'     => $body['valor']    ?? '',
    'produto'   => $body['produto']  ?? '',
];

$leads[] = $lead;
file_put_contents($LEADS_FILE, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);

echo json_encode(['ok' => true]);
