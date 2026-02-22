// Dados fake só pra você ver o layout funcionando.
// Depois você troca pra puxar do seu catálogo/API.
window.PRODUTO = {
  titulo: "Capacete Norisk Ff302 Grand Prix",
  categoria: "Capacetes",
  preco: "R$249,90",
  precoOriginal: "R$ 559,90",
  desconto: "55% OFF",
  parcelas: "em 12x R$ 20,80 sem juros",
  pix: "10% OFF no Pix",
  prazo: "Chega entre 3 e 7 dias úteis",
  estoque: "20 disponíveis",
	  // Começa no padrão (Cor: Brasil) com 3 fotos
	  imagens: [
	    "assets/img1.webp",
	    "assets/br1.webp",
	    "assets/br2.webp"
	  ],
 
  descricao: [
    "Capacete Norisk FF302 – Segurança, Conforto e Estilo em Uma Só Peça!",
    "",
    "✅ Marca: Norisk – referência nacional em capacetes de alta performance",
    "✅ Modelo: FF302 – sport/touring",
    "✅ Tamanho: (especificar: P/M/G/GG)",
    "✅ Certificação: INMETRO aprovada – máxima segurança homologada",
    "✅ Material: Casco resistente em termoplástico de alta resistência",
    "✅ Visor: Anti-risco / UV / resistente a impactos",
    "✅ Forro interno: Removível, lavável e super confortável",
    "✅ Ventilação inteligente: Sistema de airflow que mantém sua cabeça fresca",
    "✅ Fechamento: Jugular com engate micrométrico — rápido e seguro",
    "✅ Peso equilibrado: Conforto em longos trajetos",
    "",
    "Por que escolher o Norisk FF302?",
    "O Norisk FF302 foi projetado para quem não abre mão de qualidade e performance — seja no dia a dia ou em aventuras. Ele entrega segurança certificada, acabamento premium e design atual que combina com seu estilo. Um verdadeiro aliado nas ruas!",
    "",
    "Destaques que fazem a diferença:",
    "✔ Conforto que dura horas",
    "✔ Máxima visibilidade",
    "✔ Sistema de ventilação eficiente",
    "✔ Forro que absorve suor",
    "✔ Ótima relação custo-benefício",
    "",
    "O que você recebe:",
    "• 1x Capacete Norisk FF302",
    "• Forro desmontável",
    "• Manual de uso"
  ]
};

window.addEventListener("load", function () {

  // ⚡ PERFORMANCE: carrega primeiro a imagem principal (img1)
  // e só depois, em "segundo plano", puxa as outras.
  try {
    var imgs = (window.PRODUTO && window.PRODUTO.imagens ? window.PRODUTO.imagens : []).filter(function (x) { return !!x; });
    var principal = imgs[0];
    var restantes = imgs.slice(1);

    if (principal) {
      const im1 = new Image();
      im1.decoding = 'async';
      im1.src = principal;

      var preloadRestantes = function () {
        var run = function () {
          restantes.forEach(function (src) {
            var im = new Image();
            im.decoding = 'async';
            im.loading = 'lazy';
            im.src = src;
          });
        };

        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(run, { timeout: 1500 });
        } else {
          setTimeout(run, 250);
        }
      };

      // quando img1 terminar (ou se já estiver em cache), pré-carrega o resto
      im1.onload = preloadRestantes;
      im1.onerror = preloadRestantes;
      setTimeout(preloadRestantes, 1200);
    }
  } catch (e) {}

  // ✅ Sincroniza dados do produto para o fluxo do checkout/carrinho
  try{
    if(window.PRODUTO){
      set_cookie('produto_nome', window.PRODUTO.titulo || '');
      set_cookie('produto_imagens', JSON.stringify(window.PRODUTO.imagens || []));
      set_cookie('produto_imagem_principal', (window.PRODUTO.imagens && window.PRODUTO.imagens[0]) ? window.PRODUTO.imagens[0] : '');
      set_cookie('produto_preço_atual', window.PRODUTO.preco || '');
      set_cookie('produto_preço_original', window.PRODUTO.precoOriginal || '');

      // ✅ Variações (COR + TAMANHO) no formato que o produto.js entende
      // (isso garante que sempre vai aparecer, mesmo sem backend)
      var variacoes = [
        {
          "variação": "Cor",
          "valores": [
            { "titulo": "Cor", "valor": "Brasil", "imagem": "assets/img1.webp", "fullid": "" },
            { "titulo": "Cor", "valor": "Rosa", "imagem": "assets/img2.webp", "fullid": "" },
            { "titulo": "Cor", "valor": "Argentina", "imagem": "assets/img3.png", "fullid": "" },
            { "titulo": "Cor", "valor": "Japão", "imagem": "assets/img4.webp", "fullid": "" },
            { "titulo": "Cor", "valor": "Itália", "imagem": "assets/img5.webp", "fullid": "" }
          ]
        },
        {
          "variação": "Tamanho Do Capacete",
          "valores": [
            { "titulo": "Tamanho Do Capacete", "valor": "56", "imagem": "", "fullid": "" },
            { "titulo": "Tamanho Do Capacete", "valor": "58", "imagem": "", "fullid": "" },
            { "titulo": "Tamanho Do Capacete", "valor": "60", "imagem": "", "fullid": "" },
            { "titulo": "Tamanho Do Capacete", "valor": "62", "imagem": "", "fullid": "" },
            { "titulo": "Tamanho Do Capacete", "valor": "64", "imagem": "", "fullid": "" }
          ]
        }
      ];
      set_cookie('produto_variações', JSON.stringify(variacoes));
    }
  }catch(e){}

  // Preenche título/categoria/preço
  const $ = (sel) => document.querySelector(sel);
  $("#titulo-do-produto").textContent = window.PRODUTO.titulo;
  $("#categoria-do-produto").textContent = window.PRODUTO.categoria;
  $("#preço-do-produto").textContent = window.PRODUTO.preco;
  $("#preço-original").textContent = window.PRODUTO.precoOriginal;
  $("#diferença-de-preço").textContent = window.PRODUTO.desconto;
  $("#parcelamento-no-cartão").textContent = window.PRODUTO.parcelas;
  $("#desconto-no-pix").textContent = window.PRODUTO.pix;
  $("#prazo-de-entrega").textContent = window.PRODUTO.prazo;
  $("#quantidade-disponivel").textContent = "(" + window.PRODUTO.estoque + ")";

  // Imagens no carousel
  const container = $("#imagens-do-produto");
  if (container) {
    container.innerHTML = (window.PRODUTO.imagens || []).map(function (src, i) { return `
      <div class="item">
        <img src="${src}"
          ${i === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}
          decoding="async"
          style="width:100%;display:block;object-fit:cover;">
      </div>
    `; }).join("");
  }

  // Fotos do produto (abaixo)
  const fotos = document.getElementById("fotos-do-produto");
  if (fotos) {
    // Só 2 fotos nessa seção
    fotos.innerHTML = (window.PRODUTO.imagens || []).slice(0, 2).map(function (src, i) { return `
      <img src="${src}"
        ${i === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}
        decoding="async"
        style="width:100%;margin:10px 0;border-radius:6px;display:block;">
    `; }).join("");
  }

  // Descrição
  const desc = document.getElementById("descrição-do-produto");
  if (desc) {
    desc.innerHTML = (window.PRODUTO.descricao || []).map(function (l) {
    if (!l) return `<div style="height:10px;"></div>`;
    return `<p style="margin:6px 0;line-height:1.35;color:rgba(0,0,0,.45);">${l}</p>`;
  }).join("");
  }

  // Inicializa owl carousel se existir
  if (window.jQuery && jQuery.fn && jQuery.fn.owlCarousel) {
    jQuery("#imagens-do-produto").owlCarousel({
      items: 1,
      loop: false,
      dots: true
    });

    const total = window.PRODUTO.imagens.length;
    document.getElementById("slider-count-total").textContent = total;
    document.getElementById("slider-count-atual").textContent = 1;

    jQuery("#imagens-do-produto").on("changed.owl.carousel", function (event) {
      const index = event.item.index + 1;
      document.getElementById("slider-count-atual").textContent = index;
    });
  }

  // ✅ Renderiza variações (Cor/Tamanho) usando o produto.js
  try{
    if(typeof carregar_variações === 'function') carregar_variações();
  }catch(e){}
});

// patch v2
try{
  var elQA = document.getElementById('quantidade-de-avaliações');
  if(elQA) elQA.append(' (1.234 avaliações)');
}catch(e){}

(function () {
  const box = document.getElementById("avaliação_por_caracteristicas");
  if (!box) return;

  // Qualidades + estrelas (igual o print)
  const itens = [
    { nome: "Custo-benefício", estrelas: 5 },
    { nome: "Confortável", estrelas: 5 },
    { nome: "Qualidade do caimento", estrelas: 5 },
    { nome: "Resistência", estrelas: 5 },
    { nome: "Beleza do produto", estrelas: 5 },
  ];

  var corCheiaEl = document.getElementById("corForte");
  var corCheia = (corCheiaEl && corCheiaEl.textContent ? String(corCheiaEl.textContent).trim() : "") || "rgb(52, 131, 250)";
  const corVazia = "rgba(0,0,0,.25)";

  function estrelasHTML(qtd) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      html += `<span style="font-size:14px; margin-left:2px; color:${i <= qtd ? corCheia : corVazia};">★</span>`;
    }
    return html;
  }

  box.innerHTML = `
    <div style="margin-top:10px; display:flex; flex-flow:column; gap:10px;">
      ${itens
        .map(
          (it) => `
        <div style="display:flex; align-items:center;">
          <div style="flex:1; font-family:proximanovaregular; font-size:14px; color:rgba(0,0,0,.9);">
            ${it.nome}
          </div>
          <div style="min-width:110px; text-align:right; line-height:1;">
            ${estrelasHTML(it.estrelas)}
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
})();



// ✅ Comentários (avaliações) abaixo das qualidades

(function(){
  const list = document.getElementById("avaliações-do-produto");
  if(!list) return;

  const reviews = [
    {
      stars: 5,
      text: "Chic de mais,gostei pra caramba,pessoalmente é bem mais bonito,muito bem ventilado e confortavel,fiquei gatao nele kkkk.",
      days: "02 jan. 2026",
      imgs: ["assets/coment1.webp", "assets/coment2.webp"],
      likes: 2
    },
    {
      stars: 5,
      text: "Amei,o melhor capacete q eu já tive e olha q eu já tive um ls2,pena q é caro mais eu gostei,só errei no número q eu comprei acabei comprando um número maior e fico meio solto em mim,tirando isso foi a melhor escolha q eu já fiz,podem comprar vcs não vão se arrepender.",
      days: "23 out. 2025",
      imgs: ["assets/coment3.webp"],
      likes: 15
    },
    {
      stars: 5,
      text: "Capacete muito bom chave dms, vale a pena.",
      days: "03 set. 2024",
      imgs: ["assets/coment4.webp", "assets/coment5.webp"],
      likes: 9
    }
  ];

  var blueEl = document.getElementById("corForte");
  var blue = (blueEl && blueEl.textContent ? String(blueEl.textContent).trim() : "") || "rgb(52, 131, 250)";
  const gray = "rgba(0,0,0,.25)";

  const starsRow = (n)=> {
    let s="";
    for(let i=1;i<=5;i++){
      s += `<span style="font-size:14px;margin-right:2px;color:${i<=n?blue:gray};">★</span>`;
    }
    return s;
  };

  const itemHTML = (r, idx) => {
    const key = "like_review_"+idx;
    const liked = localStorage.getItem(key)==="1";
    const count = r.likes + (liked ? 1 : 0);

    const imgs = Array.isArray(r.imgs) ? r.imgs : (r.img ? [r.img] : []);
    const gal = imgs
      .slice(0, 3)
      .map((src) => `
        <div style="width:82px;height:82px;border-radius:12px;overflow:hidden;background:#f2f2f2;flex:0 0 82px;">
          <img src="${src}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
        </div>
      `)
      .join("");

    // Já existe um divisor antes da lista de comentários.
    // Então o 1º item NÃO deve ter border-top (senão fica com “linha dupla”).
    const topBorder = (idx === 0) ? "none" : "1px solid rgba(0,0,0,.1)";

    return `
      <div class="ml-review-item" style="padding:18px 0;border-top:${topBorder};">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="line-height:1;">${starsRow(r.stars)}</div>
          <div style="font-family:proximanovaregular;font-size:12px;color:rgba(0,0,0,.55);">${r.days}</div>
        </div>

        ${gal ? `<div style="margin-top:12px;display:flex;gap:12px;flex-wrap:wrap;">${gal}</div>` : ``}

        ${r.text ? `<div style="margin-top:12px;font-family:proximanovaregular;font-size:15px;line-height:1.35;color:rgba(0,0,0,.9);">${r.text}</div>` : ``}

        <div style="margin-top:14px;display:flex;gap:12px;align-items:center;">
          <button type="button" class="ml-like-btn" data-idx="${idx}" style="-webkit-appearance:none;appearance:none;display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border:1px solid #c7c7c7;border-radius:26px;background:#fff;cursor:pointer;">
            <span style="font-family:proximanovaregular;font-size:13px;color:rgba(59, 59, 59, 0.9);">É útil</span>
            <i class="material-icons ml-like-ico" style="font-size:18px;line-height:18px;color:${liked?blue:'rgba(0,0,0,.55)'};">thumb_up</i>
            <span class="ml-like-count" style="font-family:proximanovaregular;font-size:16px;color:rgba(0,0,0,.9);">${count}</span>
          </button>

          <button type="button" class="ml-dislike-btn" data-idx="${idx}" style="-webkit-appearance:none;appearance:none;width:44px;height:44px;border:1px solid #c7c7c7;border-radius:50%;background:#fff;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;">
            <i class="material-icons ml-dislike-ico" style="font-size:13px;line-height:20px;color:rgba(59, 59, 59, 0.9);">thumb_down</i>
          </button>
        </div>
      </div>
    `;
  };

  // render
  list.innerHTML = reviews.map(itemHTML).join("") + `<div style="border-top:1px solid rgba(0,0,0,.1);"></div>`;

  // clicks
  list.querySelectorAll(".ml-like-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const idx = btn.getAttribute("data-idx");
      const key = "like_review_"+idx;
      const liked = localStorage.getItem(key)==="1";
      const ico = btn.querySelector(".ml-like-ico");
      const countEl = btn.querySelector(".ml-like-count");
      var base = (reviews[Number(idx)] && reviews[Number(idx)].likes) ? reviews[Number(idx)].likes : 0;

      if(liked){
        localStorage.removeItem(key);
        ico.style.color = "rgba(0,0,0,.55)";
        countEl.textContent = String(base);
      }else{
        localStorage.setItem(key,"1");
        ico.style.color = blue;
        countEl.textContent = String(base+1);
      }
    });
  });

  // dislike (só toggle visual, igual print)
  list.querySelectorAll('.ml-dislike-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ico = btn.querySelector('.ml-dislike-ico');
      const on = btn.getAttribute('data-on') === '1';
      if (on) {
        btn.setAttribute('data-on', '0');
        ico.style.color = 'rgba(0,0,0,.55)';
      } else {
        btn.setAttribute('data-on', '1');
        ico.style.color = blue;
      }
    });
  });
})();


/* =========================
   CARACTERÍSTICAS DO PRODUTO (placeholder)
   - Renderiza um layout no estilo do print (tabela com seções)
   - Você pode editar os dados aqui depois, sem mexer no HTML
========================= */
(function () {
  const host = document.getElementById("caracteristicas-1-conteudo");
  if (!host) return;

  const SECOES = [
    {
      titulo: "Características principais",
      linhas: [
        ["Marca", "Norisk"],
        ["Linha", "FF302"],
        ["Modelo", "Grand Prix"],
        ["Condição de venda", "Embalado"],
      ],
    },
    {
      titulo: "Informação do usuário",
      linhas: [
        ["Estilo de condução em moto", "Touring"],
      ],
    },
    {
      titulo: "Segurança e conforto",
      linhas: [
        ["Materiais do interior", "EPS"],
      ],
    },
    {
      titulo: "Especificações",
      linhas: [
        ["Acabamento", "Brilhante"],
        ["Tipo de capacete", "Integral"],
      ],
    },
  ];

  function renderTabela(linhas) {
    const rows = linhas.map((par, idx) => {
      const bg = (idx % 2 === 0) ? "rgba(0,0,0,.04)" : "#fff";
      return `
        <div style="display:flex;gap:16px;align-items:center;padding:14px 16px;background:${bg};">
          <div style="flex:1;font-family:proximanovaregular;font-size:14px;color:rgba(0,0,0,.9);">${par[0]}</div>
          <div style="flex:1;text-align:left;font-family:proximanovaregular;font-size:14px;color:rgba(0,0,0,.9);">${par[1]}</div>
        </div>
      `;
    }).join("");

    return `
      <div style="border:1px solid rgba(0,0,0,.08);border-radius:8px;overflow:hidden;background:#fff;">
        ${rows}
      </div>
    `;
  }

  host.innerHTML = SECOES.map(sec => `
    <div style="margin-top:16px;">
      <div style="margin:0 0 10px 0;font-family:proximanovasemibold;font-size:14px;color:rgba(0,0,0,.9);">
        ${sec.titulo}
      </div>
      ${renderTabela(sec.linhas)}
    </div>
  `).join("");
})();

