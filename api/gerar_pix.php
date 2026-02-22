<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

$valor = round(floatval($_GET['valor'] ?? 0), 2);
if ($valor <= 0) {
    echo json_encode(['erro' => 'Valor inválido']); exit;
}

$centavos = intval(round($valor * 100));

$ch = curl_init(PUSHINPAY_URL);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . PUSHINPAY_TOKEN,
        'Content-Type: application/json',
        'Accept: application/json',
    ],
    CURLOPT_POSTFIELDS     => json_encode(['value' => $centavos]),
    CURLOPT_TIMEOUT        => 30,
    CURLOPT_SSL_VERIFYPEER => true,
]);

$resp = curl_exec($ch);
$err  = curl_error($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($err) {
    echo json_encode(['erro' => 'Erro de conexão: ' . $err]); exit;
}

$data = json_decode($resp, true);
if (!$data) {
    echo json_encode(['erro' => 'Resposta inválida da PushinPay']); exit;
}
if ($code >= 400) {
    echo json_encode(['erro' => $data['message'] ?? 'Erro PushinPay (HTTP ' . $code . ')']); exit;
}

$qr_code = $data['qr_code']        ?? $data['brcode']       ?? $data['pix_code'] ?? '';
$qr_b64  = $data['qr_code_base64'] ?? $data['image_base64'] ?? '';
$id      = (string)($data['id']    ?? $data['transaction_id'] ?? $data['uuid']   ?? '');

echo json_encode([
    'qr_code'  => $qr_code,
    'qr_image' => $qr_b64 ? 'data:image/png;base64,' . $qr_b64 : '',
    'id'        => $id,
    'valor'     => $valor,
]);
