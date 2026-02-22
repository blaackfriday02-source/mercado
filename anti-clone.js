(function () {
    'use strict';

    // ── 1. Bloqueia abertura via file:// (clone salvo no HD) ─────────────────
    if (window.location.protocol === 'file:') {
        window.location.replace('https://www.google.com');
        return;
    }

    // ── 2. Bloqueia botão direito ─────────────────────────────────────────────
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
    });

    // ── 3. Bloqueia atalhos de inspeção e salvamento ──────────────────────────
    document.addEventListener('keydown', function (e) {
        var key = (e.key || '').toLowerCase();

        // F12
        if (e.key === 'F12') { e.preventDefault(); return false; }

        // Ctrl/Cmd + U (ver código), S (salvar), P (imprimir)
        if ((e.ctrlKey || e.metaKey) && (key === 'u' || key === 's' || key === 'p')) {
            e.preventDefault(); return false;
        }

        // Ctrl/Cmd + Shift + I / J / C / K (DevTools)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (key === 'i' || key === 'j' || key === 'c' || key === 'k')) {
            e.preventDefault(); return false;
        }
    });

    // ── 4. Desabilita seleção de texto e arraste de imagens ───────────────────
    var style = document.createElement('style');
    style.textContent = [
        '* { -webkit-user-select: none !important; user-select: none !important; }',
        'input, textarea, [contenteditable] { -webkit-user-select: text !important; user-select: text !important; }',
        'img { pointer-events: none; -webkit-user-drag: none; }'
    ].join(' ');
    document.head.appendChild(style);

    // ── 5. Detecta automação óbvia (Selenium, Puppeteer, Playwright) ──────────
    function detectAutomation() {
        if (navigator.webdriver === true)               return true;
        if (window.__nightmare)                         return true;
        if (window.callPhantom || window._phantom)      return true;
        if (/HeadlessChrome|PhantomJS/i.test(navigator.userAgent)) return true;
        return false;
    }

    if (detectAutomation()) {
        window.location.replace('https://www.google.com');
        return;
    }

    // ── 6. Honeypot invisível (scrapers seguem links ocultos) ─────────────────
    document.addEventListener('DOMContentLoaded', function () {
        var trap = document.createElement('a');
        trap.href = '/bot-trap';
        trap.style.cssText = 'position:absolute;left:-9999px;top:-9999px;opacity:0;pointer-events:none;';
        trap.setAttribute('aria-hidden', 'true');
        trap.setAttribute('tabindex', '-1');
        document.body.appendChild(trap);
    });

})();
