<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

$id = trim($_GET['id'] ?? '');
if (!$id) { echo json_encode(['erro' => 'ID faltando']); exit; }

$ch = curl_init(PUSHINPAY_URL . '/' . $id);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . PUSHINPAY_TOKEN,
        'Accept: application/json',
    ],
    CURLOPT_TIMEOUT => 10,
]);
$resp = curl_exec($ch);
curl_close($ch);

$data   = json_decode($resp, true);
$status = strtolower($data['status'] ?? '');
$pago   = in_array($status, ['paid', 'approved', 'completed', 'succeeded']);

echo json_encode(['pago' => $pago, 'status' => $status]);
