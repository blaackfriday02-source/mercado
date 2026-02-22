// Utilitários simples para as páginas do checkout (versão mobile / estática)

function get_cart(){
  try{ return JSON.parse(localStorage.getItem('carrinho_itens') || '[]'); }catch(e){ return []; }
}

function set_cart(cart){
  localStorage.setItem('carrinho_itens', JSON.stringify(cart || []));
}

function render_cart_badge(){
  try{
    const q = get_cart().length;
    const el = document.getElementById('quantidade_carrinho');
    const wrap = document.getElementById('produtos-no-carrinho');
    if(el) el.innerText = q;
    if(wrap){
      wrap.style.display = q>0 ? 'flex' : 'none';
    }
  }catch(e){}
}

function go(url){
  window.location.href = url;
}

function short_variations(item){
  try{
    const vars = item.variações || item.variacoes || [];
    if(!vars || !vars.length) return '';
    return vars.map(v => `${v.atributo}: ${v.valor}`).join(' • ');
  }catch(e){
    return '';
  }
}

// Datas fixas (como você pediu) por item do carrinho.
function entrega_texto_por_indice(i){
  const arr = [
    'Entre os dias 3 e 9 de Fevereiro',
    'Entre os dias 4 e 7 de Fevereiro',
    'Entre os dias 7 e 11 de Fevereiro',
    'Entre os dias 8 e 12 de Fevereiro'
  ];
  return arr[i % arr.length];
}
