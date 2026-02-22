<?php
// Acesso protegido por senha
$SENHA = 'admin2024'; // TROQUE essa senha antes de subir
if (($_GET['s'] ?? '') !== $SENHA) {
    http_response_code(403);
    echo '<!DOCTYPE html><html><body style="font-family:sans-serif;padding:40px;">
    <h2>Acesso negado</h2>
    <form method="get">
      <input name="s" type="password" placeholder="Senha" style="padding:8px;font-size:15px;"/>
      <button type="submit" style="padding:8px 16px;margin-left:8px;">Entrar</button>
    </form></body></html>';
    exit;
}

$LEADS_FILE = __DIR__ . '/../data/leads.json';
$leads = [];
if (file_exists($LEADS_FILE)) {
    $leads = json_decode(file_get_contents($LEADS_FILE), true) ?: [];
}
$leads = array_reverse($leads); // mais recentes primeiro
$total = count($leads);
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Leads — Painel</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; background: #f5f5f5; color: #333; }
.top { background: #fff159; padding: 16px 24px; border-bottom: 2px solid #f0d800; display: flex; justify-content: space-between; align-items: center; }
.top h1 { font-size: 20px; font-weight: 800; }
.top span { font-size: 14px; color: #555; }
.wrap { max-width: 1100px; margin: 24px auto; padding: 0 16px; }
.stats { display: flex; gap: 16px; margin-bottom: 24px; }
.stat { background: #fff; border-radius: 8px; padding: 16px 20px; flex: 1; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
.stat__num { font-size: 28px; font-weight: 900; color: #3483fa; }
.stat__label { font-size: 13px; color: #888; margin-top: 2px; }
table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
th { background: #3483fa; color: #fff; padding: 10px 12px; font-size: 13px; text-align: left; }
td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #f9f9f9; }
.badge { display: inline-block; background: #e8f5e9; color: #2e7d32; border-radius: 4px; padding: 2px 8px; font-size: 11px; font-weight: 700; }
.export { display: inline-block; margin-bottom: 16px; padding: 8px 16px; background: #3483fa; color: #fff; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 700; }
.export:hover { background: #2968c8; }
@media(max-width:700px){ .stats { flex-direction: column; } table { font-size: 11px; } th, td { padding: 8px 6px; } }
</style>
</head>
<body>
<div class="top">
  <h1>Painel de Leads</h1>
  <span><?= date('d/m/Y H:i') ?></span>
</div>
<div class="wrap">
  <div class="stats">
    <div class="stat">
      <div class="stat__num"><?= $total ?></div>
      <div class="stat__label">Total de leads</div>
    </div>
    <div class="stat">
      <div class="stat__num"><?= count(array_filter($leads, fn($l) => date('d/m/Y') === explode(' ', $l['data'])[0])) ?></div>
      <div class="stat__label">Leads hoje</div>
    </div>
    <div class="stat">
      <div class="stat__num">R$ <?= number_format(array_sum(array_column($leads, 'valor')), 2, ',', '.') ?></div>
      <div class="stat__label">Volume total</div>
    </div>
  </div>

  <a class="export" href="?s=<?= htmlspecialchars($_GET['s']) ?>&export=1">Exportar CSV</a>

  <?php if ($total === 0): ?>
    <p style="text-align:center;padding:40px;color:#999;">Nenhum lead ainda.</p>
  <?php else: ?>
  <table>
    <thead>
      <tr>
        <th>Data</th>
        <th>Nome</th>
        <th>E-mail</th>
        <th>Telefone</th>
        <th>Endereço</th>
        <th>Cidade/UF</th>
        <th>Produto</th>
        <th>Valor</th>
      </tr>
    </thead>
    <tbody>
    <?php foreach ($leads as $l): ?>
      <tr>
        <td><?= htmlspecialchars($l['data']) ?></td>
        <td><?= htmlspecialchars($l['nome']) ?></td>
        <td><?= htmlspecialchars($l['email']) ?></td>
        <td><?= htmlspecialchars($l['telefone']) ?></td>
        <td><?= htmlspecialchars($l['endereco'] . ', ' . $l['numero'] . ' - ' . $l['bairro']) ?></td>
        <td><?= htmlspecialchars($l['cidade'] . '/' . $l['uf']) ?></td>
        <td><?= htmlspecialchars($l['produto']) ?></td>
        <td><span class="badge">R$ <?= number_format(floatval($l['valor']), 2, ',', '.') ?></span></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  <?php endif; ?>
</div>

<?php
// Exporta CSV
if (isset($_GET['export'])) {
    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename="leads_' . date('Y-m-d') . '.csv"');
    echo "\xEF\xBB\xBF"; // BOM UTF-8 pro Excel
    echo "Data,Nome,Email,Telefone,CEP,Endereco,Numero,Bairro,Cidade,UF,Produto,Valor\n";
    foreach (array_reverse($leads) as $l) {
        echo implode(',', array_map(fn($v) => '"' . str_replace('"', '""', $v) . '"', [
            $l['data'], $l['nome'], $l['email'], $l['telefone'],
            $l['cep'], $l['endereco'], $l['numero'], $l['bairro'],
            $l['cidade'], $l['uf'], $l['produto'], $l['valor']
        ])) . "\n";
    }
    exit;
}
?>
</body>
</html>
