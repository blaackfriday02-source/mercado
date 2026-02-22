<?php
/**
 * CLOAKER - Proteção anti-bot / anti-clone
 * Bots e scrapers recebem página falsa. Usuários reais veem o site normal.
 */

// ─── CONFIGURAÇÕES ────────────────────────────────────────────────────────────
$PAGE_REAL = 'index.html';
$LOG_BOTS  = true;
$LOG_FILE  = __DIR__ . '/data/bot_log.txt';
// ─────────────────────────────────────────────────────────────────────────────

$BOT_UA_PATTERNS = [
    // Google / Alphabet
    'googlebot', 'googlebot-image', 'googlebot-video', 'googlebot-news',
    'google-inspectiontool', 'google-site-verification', 'googlesecurityscanner',
    'adsbot-google', 'mediapartners-google', 'feedfetcher-google', 'storebot-google',
    'chrome-lighthouse', 'google pagespeed', 'googleweblight', 'apis-google',
    // Instagram / Facebook / Meta
    'facebookexternalhit', 'facebookcatalog', 'facebot', 'meta-externalagent',
    'meta-externalfetcher', 'facebookbot', 'instagram', 'fb_iab', 'fban/', 'fbios/',
    // Outros motores de busca
    'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot',
    'sogou', 'exabot', 'ia_archiver', 'archive.org',
    // Auditores / inspetores de SEO
    'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot', 'rogerbot', 'petalbot',
    'dataforseobot', 'serpstatbot', 'sistrix', 'babbar', 'linkdexbot',
    'blexbot', 'seokicks', 'gtmetrix',
    // Scanners de segurança
    'nikto', 'sqlmap', 'masscan', 'zgrab', 'qualys', 'nuclei', 'shodan', 'censys',
    // Scrapers e clonadores
    'httrack', 'webcopier', 'teleport', 'webzip', 'offline explorer', 'sitesucker',
    'sitesnagger', 'blackwidow', 'webwhacker', 'webdevil', 'getright',
    'wget', 'curl', 'libwww-perl', 'python-requests', 'python-urllib',
    'go-http-client', 'java/', 'scrapy', 'mechanize',
    'headlesschrome', 'phantomjs', 'selenium', 'webdriver',
    'puppeteer', 'playwright', 'okhttp', 'apachebench', 'winhttp', 'httpie',
    // Monitores de uptime
    'pingdom', 'uptimerobot', 'statuscake', 'freshping', 'site24x7', 'hetrixtools',
    // Hostinger
    'hostinger', 'hostingerbot', 'h-uptime', 'hmbot',
    // Bots de redes sociais
    'twitterbot', 'linkedinbot', 'telegrambot', 'discordbot', 'slackbot',
    'pinterestbot', 'redditbot', 'whatsapp',
];

$BOT_IP_RANGES = [
    '66.249.',  // Google
    '66.102.',  // Google
    '157.55.',  // Bing
    '40.77.',   // Bing
    '207.46.',  // Bing
    '54.239.',  // AWS crawler
    '54.240.',  // AWS crawler
    '104.196.', // GCP
    '185.191.', // Ahrefs
    '31.170.',  // Hostinger EU
    '31.220.',  // Hostinger EU
    '154.12.',  // Hostinger US
    '185.185.', // Hostinger
    '185.241.', // Hostinger
    '194.165.', // Hostinger
    '69.63.',   // Meta
    '69.171.',  // Meta
    '66.220.',  // Meta
    '66.221.',  // Meta
    '173.252.', // Meta
    '157.240.', // Meta
    '31.13.',   // Meta EU
    '185.60.',  // Meta EU
];

function get_real_ip(): string {
    foreach (['HTTP_CF_CONNECTING_IP','HTTP_X_FORWARDED_FOR','HTTP_X_REAL_IP','REMOTE_ADDR'] as $k) {
        if (!empty($_SERVER[$k])) return trim(explode(',', $_SERVER[$k])[0]);
    }
    return '0.0.0.0';
}

function is_bot(): bool {
    global $BOT_UA_PATTERNS, $BOT_IP_RANGES;

    $ua = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');
    $ip = get_real_ip();

    // Sem User-Agent = bot
    if (empty($ua) || strlen($ua) < 15) return true;

    // Verifica UA
    foreach ($BOT_UA_PATTERNS as $pattern) {
        if (str_contains($ua, $pattern)) return true;
    }

    // Verifica IP de datacenter
    foreach ($BOT_IP_RANGES as $range) {
        if (str_starts_with($ip, $range)) return true;
    }

    // Headers mínimos que todo browser real envia
    if (empty($_SERVER['HTTP_ACCEPT_LANGUAGE'])) return true;
    if (empty($_SERVER['HTTP_ACCEPT']))           return true;

    return false;
}

function log_bot(): void {
    global $LOG_FILE;
    $dir = dirname($LOG_FILE);
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $line = sprintf("[%s] IP=%s UA=%s URI=%s\n",
        date('Y-m-d H:i:s'),
        get_real_ip(),
        $_SERVER['HTTP_USER_AGENT'] ?? 'N/A',
        $_SERVER['REQUEST_URI']     ?? '/'
    );
    file_put_contents($LOG_FILE, $line, FILE_APPEND | LOCK_EX);
}

// ─── DECISÃO ──────────────────────────────────────────────────────────────────
if (is_bot()) {
    if ($LOG_BOTS) log_bot();
    header('Location: https://www.google.com', true, 301);
    exit;
}

// ─── USUÁRIO REAL ─────────────────────────────────────────────────────────────
$path = ltrim(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH), '/');

if (!empty($path) && $path !== basename(__FILE__) && file_exists(__DIR__ . '/' . $path)) {
    return false;
}

readfile(__DIR__ . '/' . $PAGE_REAL);
exit;
