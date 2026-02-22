window.CATALOGO = [
  {
    id: "capacete",
    titulo: "Capacete Norisk Ff302 Grand Prix",
    preco: "R$ 249,90",
    precoOriginal: "R$ 559,90",
    desconto: "55% OFF",
    parcelas: "12x de 20,80",
    prazo: "3 dias úteis",
    imagem: "produtos/capacete/assets/img1.webp",
    url: "produtos/capacete/index.html"
  },
  {
    id: "conjunto-feminino",
    titulo: "Kit 10 peças roupa Infantil - Conjuntos menina Verão",
    preco: "R$ 29,90",
    precoOriginal: "R$ 59,90",
    desconto: "50% OFF",
    parcelas: "12x de 2,49",
    prazo: "3 dias úteis",
    imagem: "produtos/conjunto-feminino/assets/modelo1.webp",
    url: "produtos/conjunto-feminino/index.html"
  },
  {
    id: "conjunto-masculino",
    titulo: "Kit 10 peças Infantil Masculino - Conjuntos menino Verão",
    preco: "R$ 29,90",
    precoOriginal: "R$ 59,90",
    desconto: "50% OFF",
    parcelas: "12x de 2,49",
    prazo: "3 dias úteis",
    imagem: "produtos/conjunto-masculino/assets/img1.webp",
    url: "produtos/conjunto-masculino/index.html"
  },
  {
    id: "pista-carrinho",
    titulo: "Super Garagem de Brinquedo com Veículos de Construção – Garagem de Estacionamento com 64 Peças, Luzes e Sons – Inclui Carrinhos de Metal Fundido – Pista de Corrida para Crianças",
    preco: "R$ 29,90",
    precoOriginal: "R$ 59,90",
    desconto: "50% OFF",
    parcelas: "12x de 2,49",
    prazo: "2 dias úteis",
    imagem: "produtos/pista-carrinho/assets/img1.webp",
    url: "produtos/pista-carrinho/index.html"
  },
  {
    id: "patinete-stitch",
    titulo: "Patinete Stitch 3 Rodas Led e Macacão de Pelúcia",
    preco: "R$ 49,90",
    precoOriginal: "R$ 99,90",
    desconto: "50% OFF",
    parcelas: "12x de 4,15",
    prazo: "3 dias úteis",
    imagem: "produtos/patinete-stitch/assets/azul.png",
    url: "produtos/patinete-stitch/index.html"
  }
];

function renderizarRelacionados(produtoAtualId, prefixoPath) {
  // Suporta diferentes templates (alguns usam #container-relacionados, outros #carrossel-2-conteudo)
  const container = document.getElementById("container-relacionados") ||
                    document.getElementById("carrossel-2-conteudo") ||
                    document.getElementById("relacionados") ||
                    document.getElementById("relacionados-conteudo");
  if (!container) return;

  prefixoPath = prefixoPath || '';

  const relacionados = window.CATALOGO.filter(p => p.id !== produtoAtualId);
  
  container.innerHTML = relacionados.map(p => `
    <div onclick="window.location.href='${prefixoPath}${p.url}'" style="min-width:160px; width:160px; border:1px solid #eeeeee; border-radius:4px; padding:8px; background:#fff; display:flex; flex-flow:column; cursor:pointer;">
      <div style="width:100%; height:160px; display:flex; align-items:center; justify-content:center; margin-bottom:8px;">
        <img src="${prefixoPath}${p.imagem}" style="max-width:100%; max-height:100%; object-fit:contain;">
      </div>
      <span style="font-family:proximanovaregular; font-size:12px; color:#999; text-decoration:line-through;">${p.precoOriginal}</span>
      <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
        <span style="font-family:proximanovaregular; font-size:18px; color:#333;">${p.preco}</span>
        <span style="font-family:proximanovasemibold; font-size:12px; color:#00a650;">${p.desconto}</span>
      </div>
      <span style="font-family:proximanovaregular; font-size:12px; color:#333; margin-top:2px;">em até ${p.parcelas}</span>
      <span style="font-family:proximanovasemibold; font-size:13px; color:#00a650; margin-top:4px;">${p.prazo}</span>
      <span style="font-family:proximanovaregular; font-size:13px; color:#666; margin-top:6px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.2;">${p.titulo}</span>
    </div>
  `).join("");
}
