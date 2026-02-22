window.PRODUTO = {
  titulo: "Patinete Stitch 3 Rodas Led e Macacão de Pelúcia",
  categoria: "Brinquedos",
  preco: "R$ 49,90",
  precoOriginal: "R$ 99,90",
  desconto: "50% OFF",
  parcelas: "em 12x R$ 4,15 sem juros",
  pix: "10% OFF no Pix",
  prazo: "Chega entre 3 e 6 dias úteis",
  estoque: "10 disponíveis",
  imagens: [
    "assets/azul.png",
    "assets/azul1.webp",
    "assets/azul2.webp",
    "assets/azul3.webp",
    "assets/azul4.webp"
  ],
  descricao: [
    "O Patinete Stitch Rosa 3 Rodas com Luz, Música e Boneco Decorativo é pura diversão sobre rodas!",
    "",
    "Com efeitos de luz e som animados, ele transforma qualquer passeio em um momento mágico.",
    "",
    "Seu design encantador inspirado no Stitch garante charme e estilo para as crianças.",
    "",
    "O boneco decorativo deixa o visual ainda mais fofo e divertido.",
    "",
    "Leve, seguro e cheio de personalidade — o presente ideal para brincar com alegria todos os dias!",
    "",
    "-DESCRIÇÃO:",
    "",
    "-RODA TRASEIRA COM FREIO",
    "",
    "-LED NAS RODAS DIANTEIRAS (Luzes acendem ao rodar as rodas. Para este funcionamento não é necessário pilhas)",
    "",
    "-LED NAS LATERAIS (Funcionamento com 3 pilhas AA, chave liga e desliga independente para cada lado)",
    "",
    "-Música (Chave liga e desliga) (Obs. Ritmo musica personalizada do personagem)",
    "",
    "-BASE PARA OS PÉS COM DESENHO DO PERSONAGEM (Material do Shape em plástico)",
    "",
    "-REGULAGEM DE ALTURA DO GUIDÃO (04 regulagens)",
    "",
    "-GUIDÃO DOBRÁVEL",
    "",
    "-IDEAL PARA CRIANÇAS DE 02 a 04 ANOS",
    "",
    "-SUPORTA ATÉ 30 KG",
    "",
    "-MEDIDA:",
    "",
    ".Altura máxima: 72cm do solo (Chão)",
    "",
    ".Comprimento: 54 cm (Roda a roda)",
    "",
    "FÁCIL MONTAGEM (Possui Vídeo para auxílio)",
    "",
    "OBS. ANTES DE EFETUAR SUA COMPRA OBSERVE A FOTO COM AS MEDIDAS DO PATINETE, E VERIFIQUE SE O TAMANHO SEJA ADEQUADO PARA A CRIANÇA QUE RECEBERA ESTE LINDO PRESENTE.",
    "",
    "Compra 100% Segura. Agradecemos à Confiança.",
    "",
    "Garantia do vendedor: 2 meses"
  ]
};

window.addEventListener("DOMContentLoaded", function () {
  // ✅ Sincroniza dados do produto para o fluxo do checkout/carrinho
  try{
    if(window.PRODUTO && typeof set_cookie === 'function'){
      set_cookie('produto_nome', window.PRODUTO.titulo || '');
      set_cookie('produto_imagens', JSON.stringify(window.PRODUTO.imagens || []));
      set_cookie('produto_imagem_principal', (window.PRODUTO.imagens && window.PRODUTO.imagens[0]) ? window.PRODUTO.imagens[0] : '');
      set_cookie('produto_preço_atual', window.PRODUTO.preco || '');
      set_cookie('produto_preço_original', window.PRODUTO.precoOriginal || '');
    }
  }catch(e){}
  const $ = (sel) => document.querySelector(sel);
  if($("#titulo-do-produto")) $("#titulo-do-produto").textContent = window.PRODUTO.titulo;
  if($("#categoria-do-produto")) $("#categoria-do-produto").textContent = window.PRODUTO.categoria;
  if($("#preço-do-produto")) $("#preço-do-produto").textContent = window.PRODUTO.preco;
  if($("#preço-original")) $("#preço-original").textContent = window.PRODUTO.precoOriginal;
  if($("#diferença-de-preço")) $("#diferença-de-preço").textContent = window.PRODUTO.desconto;
  if($("#parcelamento-no-cartão")) $("#parcelamento-no-cartão").textContent = window.PRODUTO.parcelas;
  if($("#desconto-no-pix")) $("#desconto-no-pix").textContent = window.PRODUTO.pix;
  if($("#prazo-de-entrega")) $("#prazo-de-entrega").textContent = window.PRODUTO.prazo;
  if($("#quantidade-disponivel")) $("#quantidade-disponivel").textContent = "(" + window.PRODUTO.estoque + ")";

  const container = $("#imagens-do-produto");
  if (container) {
    container.innerHTML = (window.PRODUTO.imagens || []).map(function (src, i) { return `
      <div class="item">
        <img src="${src}" style="width:100%;display:block;object-fit:cover;">
      </div>
    `; }).join("");
  }

  // Inicializa owl carousel se existir
  if (window.jQuery && jQuery.fn && jQuery.fn.owlCarousel) {
    jQuery("#imagens-do-produto").owlCarousel({
      items: 1,
      loop: false,
      dots: true
    });

    const total = window.PRODUTO.imagens.length;
    if(document.getElementById("slider-count-total")) document.getElementById("slider-count-total").textContent = total;
    if(document.getElementById("slider-count-atual")) document.getElementById("slider-count-atual").textContent = 1;

    jQuery("#imagens-do-produto").on("changed.owl.carousel", function (event) {
      const index = event.item.index + 1;
      if(document.getElementById("slider-count-atual")) document.getElementById("slider-count-atual").textContent = index;
    });
  }
  
  var variacoes = [
    {
      "variação": "Cor",
      "valores": [
        { "titulo": "Cor", "valor": "Azul Stitch", "imagem": "assets/azul.png", "fullid": "" },
        { "titulo": "Cor", "valor": "Rosa Angel", "imagem": "assets/rosa.png", "fullid": "" }
      ]
    }
  ];
  set_cookie('produto_variações', JSON.stringify(variacoes));

  // NORMALIZA_IMAGEM_PARA_CARRINHO
  try{
    var img0 = (window.PRODUTO && window.PRODUTO.imagens && window.PRODUTO.imagens[0]) ? window.PRODUTO.imagens[0] : '';
    if(img0){
      var abs = new URL(img0, window.location.href).pathname; // /produtos/.../assets/img1.webp
      set_cookie('produto_imagem', abs);
    }
  }catch(e){}


  // ✅ Dados avançados (características + descrição + avaliações) no formato do produto.js
  try{
    // Descrição: transforma array simples em blocos renderizáveis
    var descRaw = (window.PRODUTO && Array.isArray(window.PRODUTO.descricao)) ? window.PRODUTO.descricao : [];
    var descFmt = descRaw.map(function(t){
      return {
        tag: 'text',
        valor: String(t || '').replace(/\n/g,'<br>'),
        mt: 0, mr: 0, mb: 10, ml: 0,
        brt: 0, brr: 0, brb: 0, brl: 0
      };
    });
    set_cookie('produto_descrição', JSON.stringify(descFmt));

    // Características do produto (tabela)
    var car1 = [
      {
        name: 'Características principais',
        values: [
          { name: 'Marca', value: 'JM KIDS' },
          { name: 'Modelo', value: 'Stitch Boneco' },
          { name: 'Material', value: 'Metal' },
          { name: 'Conteúdo da embalagem', value: 'Patinete Stitch e Macacão de Pelúcia' }
        ]
      }
    ];
    set_cookie('produto_caracteristicas1', JSON.stringify(car1));
    set_cookie('produto_caracteristicas2', JSON.stringify([]));

    // Avaliação por características (as barrinhas com estrelas)
    set_cookie('produto_avaliação_por_caracteristicas', JSON.stringify(['Qualidade','Conforto','Custo-benefício','Qualidade do acabamento','Fácil para montar']));

    // Avaliações (lista padrão do produto.js). Mantemos vazio e usamos os 3 comentários fixos abaixo.
    set_cookie('produto_avaliações', JSON.stringify([]));

    // Entrega (evita erro em carregar_entrega)
    set_cookie('formas_de_entrega', JSON.stringify([{id:'padrao', prazo:4, icone:'../../assets/entrega.png', preco:0}]));
    set_cookie('forma_de_entrega_escolhida', 'padrao');

    // Parcelas (evita NaN em parcelamento)
    set_cookie('parcelas', 12);
  }catch(e){}


  
  if(typeof carregar_variações === 'function') carregar_variações();


  // ✅ Força re-render do conteúdo que o produto.js normalmente carrega no DOMContentLoaded.
  // Como este placeholder também roda no DOMContentLoaded, o listener do produto.js pode disparar antes.
  // Então chamamos aqui para garantir que sempre aparece (características, descrição, barrinhas etc.).
  try{ if(typeof carregar_caracteristicas_1 === 'function') carregar_caracteristicas_1(); }catch(e){}
  try{ if(typeof carregar_caracteristicas_2 === 'function') carregar_caracteristicas_2(); }catch(e){}
  try{ if(typeof carregar_descrição === 'function') carregar_descrição(); }catch(e){}
  try{ if(typeof carregar_avaliação_por_caracteristicas === 'function') carregar_avaliação_por_caracteristicas(); }catch(e){}
});



// ✅ Comentários (avaliações) abaixo das qualidades
(function(){
  const list = document.getElementById('avaliações-do-produto');
  if(!list) return;

  const reviews = [
    {
      stars: 4,
      text: 'Muito lindo, meu filho amou. Achei q era pintura o desenho, mais é de plástico.',
      days: '02 jan. 2026',
      imgs: ['assets/coment1.webp', 'assets/coment2.webp'],
      likes: 2
    },
    {
      stars: 5,
      text: 'Excelente produto e resistência as ruas com pisos irregulares, bem com resistente as pancadas.',
      days: '23 out. 2025',
      imgs: ['assets/coment3.webp'],
      likes: 15
    },
    {
      stars: 5,
      text: 'Produto de qualidade forte. Ficou um pouco baixo para o meu filho mas ele é alto;. Mas oo. Patinete é perfeito e resistente.',
      days: '03 set. 2024',
      imgs: ['assets/coment4.webp', 'assets/coment5.webp'],
      likes: 9
    }
  ];

  var blueEl = document.getElementById('corForte');
  var blue = (blueEl && blueEl.textContent ? String(blueEl.textContent).trim() : '') || 'rgb(52, 131, 250)';
  const gray = 'rgba(0,0,0,.25)';

  const starsRow = (n)=>{
    let s='';
    for(let i=1;i<=5;i++) s += `<span style="font-size:14px;margin-right:2px;color:${i<=n?blue:gray};">★</span>`;
    return s;
  };

  const itemHTML = (r, idx)=>{
    const key = 'like_review_'+idx;
    const liked = localStorage.getItem(key)==='1';
    const count = r.likes + (liked ? 1 : 0);

    const imgs = Array.isArray(r.imgs) ? r.imgs : [];
    const gal = imgs.slice(0,3).map((src)=>`
      <div style="width:82px;height:82px;border-radius:12px;overflow:hidden;background:#f2f2f2;flex:0 0 82px;">
        <img src="${src}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
      </div>
    `).join('');

    const topBorder = (idx===0) ? 'none' : '1px solid rgba(0,0,0,.1)';

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

  // Render
  list.innerHTML = reviews.map(itemHTML).join('');

  // Like toggle
  list.addEventListener('click', function(ev){
    const btn = ev.target.closest('.ml-like-btn');
    if(!btn) return;
    const idx = parseInt(btn.getAttribute('data-idx'),10);
    if(isNaN(idx)) return;
    const key = 'like_review_'+idx;
    const liked = localStorage.getItem(key)==='1';
    localStorage.setItem(key, liked ? '0' : '1');

    const ico = btn.querySelector('.ml-like-ico');
    const countEl = btn.querySelector('.ml-like-count');
    if(ico) ico.style.color = (!liked) ? blue : 'rgba(0,0,0,.55)';
    if(countEl){
      const base = reviews[idx].likes;
      countEl.textContent = base + ((!liked) ? 1 : 0);
    }
  }, { passive:true });
})();

