function outputFilter(str){
	str = str.replaceAll('"','--||aspasDupla||--');
	str = str.replaceAll("'",'--||aspasSimples||--');
	str = str.replaceAll('+','--||mais||--');
	str = str.replaceAll('&','--||amperSand||--');
	return str;
}

// --- STATIC MODE API STUB (no backend) ---
(function(){
  if(typeof window === 'undefined') return;
  
  function getLS(k, fallback){
    try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }catch(e){ return fallback; }
  }
  function setLS(k, v){
    try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){}
  }

  function handleApiCall(params){
    const metodo = params.metodo || '';

    if(metodo === 'adicionarAoCarrinho'){
      let carrinho = getLS('carrinho_itens', []);
      
      // Pegar dados do produto atual
      let titulo = "Produto";
      let preco = "0,00";
      let imagem = "";
      
      if(window.PRODUTO) {
        titulo = window.PRODUTO.titulo || "Produto";
        preco = window.PRODUTO.preçoAtual || window.PRODUTO.preco || "0,00";
        imagem = window.PRODUTO.img1 || window.PRODUTO.imagem || "";
      }
      
      const novoItem = {
        fullid: params.fullid,
        cor: params.cor,
        tamanho: params.tamanho,
        quantidade: parseInt(params.quantidade) || 1,
        variações: params.variações,
        titulo: titulo,
        preco: preco,
        imagem: imagem
      };
      
      // Verificar se já existe no carrinho
      const index = carrinho.findIndex(item => 
        item.fullid === novoItem.fullid && 
        item.cor === novoItem.cor && 
        item.tamanho === novoItem.tamanho
      );
      
      if(index > -1) {
        carrinho[index].quantidade += novoItem.quantidade;
      } else {
        carrinho.push(novoItem);
      }
      
      setLS('carrinho_itens', carrinho);
      return "ok";
    }

    if(metodo === 'alterarquantidade'){
      let carrinho = getLS('carrinho_itens', []);
      const index = carrinho.findIndex(item => item.fullid === params.fullid);
      if(index > -1) {
        carrinho[index].quantidade = parseInt(params.quantidade);
        setLS('carrinho_itens', carrinho);
      }
      return "ok";
    }

    return "ok";
  }

  // Interceptar chamadas AJAX para simular backend
  if(window.jQuery) {
    const $ = window.jQuery;
    const originalAjax = $.ajax.bind($);
    $.ajax = function(options){
      const url = (typeof options === 'string') ? options : (options && options.url);
      if(url && (url.includes('/api/') || url.endsWith('/api'))){
        const data = options.data || '';
        const params = {};
        data.split('&').forEach(part => {
          const [k,v] = part.split('=');
          if(k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
        });
        const resposta = handleApiCall(params);
        setTimeout(() => {
          if(options.success) options.success(resposta);
          if(options.complete) options.complete({responseText: resposta}, 'success');
        }, 100);
        return { abort: function(){} };
      }
      return originalAjax(options);
    };
  }
})();

// Função para calcular o caminho relativo até a raiz
function getBasePath() {
    const pathname = window.location.pathname;
    if(pathname.includes('/produtos/')) {
        return '../../';
    }
    return '';
}

function ir_para_destino(destino){
    const basePath = getBasePath();
    const caminhos = {
        'inicio': basePath + 'index.html',
        'produto': basePath + 'index.html',
        'carrinho': basePath + 'carrinho.html',
        'endereço': basePath + 'entrega.html',
        'dados': basePath + 'dados.html',
        'pagamento': basePath + 'pagamento.html',
        'nfe': basePath + 'nfe.html',
        'revisar': basePath + 'revisar.html',
        'finalizar': basePath + 'finalizar_pix.html'
    };
    
    let url = caminhos[destino] || (basePath + destino + '.html');
    window.location.href = url;
}

function adicionarAoCarrinho(fullid){
    let destino = 'carrinho';
    const cor = $('#corAtual').text() || '';
    const tamanho = $('#tamanhoAtual').text() || '';
    const quantidade = $('#quantidade'+fullid).text() || '1';

    let variações = '';
    $('.totalDeVariações').each(function(){
        const total = parseInt($(this).text());
        for(let c=0; c<total; c++){
            const titulo = $('.tituloDaVariação'+c).text();
            const atributo = $('.atributoDaVariação'+c).text();
            if(titulo && atributo) variações += titulo + ':::' + atributo + '||';
        }
    });

    $.ajax({
        url: '/api/',
        type: "POST",
        data: "metodo=adicionarAoCarrinho&fullid="+fullid+'&cor='+cor+'&tamanho='+tamanho+'&quantidade='+quantidade+'&variações='+variações,
        success: function(){
            ir_para_destino(destino);
        },
        error: function(){
            ir_para_destino(destino);
        }
    });
}

// Funções de utilidade para o carrinho
function atualizarContadorCarrinho() {
    try {
        const carrinho = JSON.parse(localStorage.getItem('carrinho_itens') || '[]');
        const total = carrinho.reduce((sum, item) => sum + (parseInt(item.quantidade) || 1), 0);
        if(total > 0) {
            $('#produtos-no-carrinho').css('display', 'flex');
            $('#quantidade_carrinho').text(total);
        } else {
            $('#produtos-no-carrinho').hide();
        }
    } catch(e) {}
}

$(document).ready(function(){
    atualizarContadorCarrinho();
});
