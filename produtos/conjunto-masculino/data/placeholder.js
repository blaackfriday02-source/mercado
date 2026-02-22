window.PRODUTO = {
  titulo: "Kit 10 peças Infantil Masculino - Conjuntos menino Verão",
  categoria: "Roupas e Acessórios",
  preco: "R$ 29,90",
  precoOriginal: "R$ 59,90",
  desconto: "50% OFF",
  parcelas: "em 12x R$ 2,49 sem juros",
  pix: "10% OFF no Pix",
  prazo: "Chega entre 3 e 5 dias úteis",
  estoque: "30 disponíveis",
  imagens: [
    "assets/img1.webp",
    "assets/img2.webp",
    "assets/img3.webp",
    "assets/img4.webp"
  ],
  descricao: [
    "KIT composto por 10 peças (05 Conjuntos) de Verão para meninos!",
    "",
    "- Peças macias e muito confortáveis;",
    "- Preço superacessível para tanta qualidade.",
    "- Garantimos a melhor qualidade dentro do Marketplace;",
    "- Elástico na cintura dos shorts;",
    "- Trabalhamos com camisetas com manga curta e regata;",
    "- Shorts 100% em algodão;",
    "- Tecido em fibra pura 100% algodão;",
    "- Temos a PRONTA ENTREGA !!!",
    "",
    "Nossos conjuntinhos são confortáveis, gostosinhos, divertidos e com estampas bem coloridas para a criança usar no dia a dia.",
    "Perfeito para dias mais calorentos e quentes, são uma ótima opção até mesmo para usar em dias de muito calor ou em qualquer tipo de passeio casual :)",
    "",
    "POSSO ESCOLHER AS ESTAMPAS ?",
    "O modelo de sua escolha será separado e SEM REPETIR!",
    "AS ESTAMPAS SÃO EXATAMENTE AS QUE ESTÃO NAS FOTOS!",
    "",
    "QUAL TAMANHO DEVO ESCOLHER?",
    "O tamanho do conjunto NÃO corresponde a IDADE da criança.",
    "Como cada criança tem seu biotipo, indicamos pegar uma roupa que fique confortável na criança, tirar a medida e comparar com a nossa tabela de centímetros. Assim será perfeito e evitará transtornos na compra :)",
    "",
    "Temos também abaixo uma indicação MÉDIA por tamanho e idade caso tenha dúvidas.",
    "Normalmente:",
    "tam 1: serve para 6 a 12 meses",
    "tam 2: serve para 1 aninho",
    "tam 3: serve para 2 aninhos",
    "tam 4: serve para 3 aninhos",
    "tam 6: serve para 3/4 aninhos",
    "tam 8: serve para 5/6 aninhos",
    "",
    "TABELA DE CENTIMETROS DOS CONJUNTOS POR TAMANHO:",
    "Camiseta 1 - Tórax: 28 cm - Comprimento: 39 cm",
    "Shorts 1 - Cintura no elástico: 20 cm - Comprimento: 27 cm",
    "Camiseta 2 - Tórax: 30 cm - Comprimento: 41 cm",
    "Shorts 2 - Cintura no elástico: 21 cm - Comprimento: 28 cm",
    "Camiseta 3 - Tórax: 32 cm - Comprimento: 43 cm",
    "Shorts 3 - Cintura no elástico: 22 cm - Comprimento: 30 cm",
    "Camiseta 4 - Tórax: 34 cm - Comprimento: 45 cm",
    "Shorts 4 - Cintura no elástico: 23 cm - Comprimento: 31 cm",
    "Camiseta 6 - Tórax: 36 cm - Comprimento: 47 cm",
    "Shorts 6 - Cintura no elástico: 24 cm - Comprimento: 33 cm",
    "Camiseta 8 - Tórax: 38 cm - Comprimento: 49 cm",
    "Shorts 8 - Cintura no elástico: 25 cm - Comprimento: 35 cm",
    "",
    "ATENÇÃO: A tabela acima refere se as medidas da peça fora do corpo. Para circunferência total, multiplique por dois. Esta tabela é somente uma referência e as medidas apresentadas podem não coincidir com as suas*",
    "*Medida da cintura do Shorts pelo elástico sem esticar!",
    "",
    "Garantia do vendedor: 30 dias"
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
      "variação": "Modelo",
      "valores": [
        { "titulo": "Modelo", "valor": "Modelo 1", "imagem": "assets/img1.webp", "fullid": "" },
        { "titulo": "Modelo", "valor": "Modelo 2", "imagem": "assets/img2.webp", "fullid": "" }
      ]
    },
    {
      "variação": "Tamanho",
      "valores": [
        { "titulo": "Tamanho", "valor": "Tam1", "imagem": "", "fullid": "" },
        { "titulo": "Tamanho", "valor": "Tam2", "imagem": "", "fullid": "" },
        { "titulo": "Tamanho", "valor": "Tam3", "imagem": "", "fullid": "" },
        { "titulo": "Tamanho", "valor": "Tam4", "imagem": "", "fullid": "" },
        { "titulo": "Tamanho", "valor": "Tam6", "imagem": "", "fullid": "" },
        { "titulo": "Tamanho", "valor": "Tam8", "imagem": "", "fullid": "" }
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
          { name: 'Marca', value: 'KIDS' },
          { name: 'Modelo', value: '10 Conjuntos Infantil' },
          { name: 'Material', value: 'Algodão' },
          { name: 'Conteúdo da embalagem', value: '10 peças' }
        ]
      }
    ];
    set_cookie('produto_caracteristicas1', JSON.stringify(car1));
    set_cookie('produto_caracteristicas2', JSON.stringify([]));

    // Avaliação por características (as barrinhas com estrelas)
    set_cookie('produto_avaliação_por_caracteristicas', JSON.stringify(['Qualidade','Conforto','Custo-benefício','Não desbotou na lavagem','Não encolhe na lavagem']));

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
      stars: 5,
      text: 'Meu filho amouuu ele tem 4 anos e esse tamanho é 8 e deu certinho nele são lindas.',
      days: '02 jan. 2026',
      imgs: ['assets/coment1.webp', 'assets/coment2.webp'],
      likes: 2
    },
    {
      stars: 5,
      text: 'Todos os conjuntos são lindos 💙.',
      days: '23 out. 2025',
      imgs: ['assets/coment3.webp'],
      likes: 15
    },
    {
      stars: 5,
      text: 'Custo benefício grande. Material bom , recomendo',
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

