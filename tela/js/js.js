// COOKIES (robusto p/ iPhone/Safari)
// Observação: o projeto usa o nome "cookie", mas aqui a gente guarda em Storage e cai pra cookie real se precisar.
(function(){
  function isBad(v){
    return v===undefined || v===null || v==='' || v==='undefined' || v==='null' || v==='NaN';
  }
  function setRealCookie(k,v){
    try{
      const encK = encodeURIComponent(k);
      const encV = encodeURIComponent(String(v));
      // 7 dias
      document.cookie = `${encK}=${encV}; path=/; max-age=${60*60*24*7}`;
    }catch(e){}
  }
  function getRealCookie(k){
    try{
      const encK = encodeURIComponent(k) + '=';
      const parts = String(document.cookie||'').split(';');
      for(let p of parts){
        p = p.trim();
        if(p.startsWith(encK)) return decodeURIComponent(p.slice(encK.length));
      }
    }catch(e){}
    return null;
  }

  window.set_cookie = function(cookie,valor){
    try{
      if(isBad(valor)) return;
      const v = (typeof valor === 'string') ? valor : JSON.stringify(valor);
      try{ localStorage.setItem(cookie, v); return; }catch(e){}
      try{ sessionStorage.setItem(cookie, v); return; }catch(e){}
      setRealCookie(cookie, v);
    }catch(e){}
  };

  window.get_cookie = function(cookie){
    try{
      let v = null;
      try{ v = localStorage.getItem(cookie); }catch(e){}
      if(isBad(v)){
        try{ v = sessionStorage.getItem(cookie); }catch(e){}
      }
      if(isBad(v)){
        v = getRealCookie(cookie);
      }
      if(isBad(v)) return null;
      return v;
    }catch(e){
      return null;
    }
  };

  window.remove_cookie = function(cookie){
    try{
      try{ localStorage.removeItem(cookie); }catch(e){}
      try{ sessionStorage.removeItem(cookie); }catch(e){}
      try{ document.cookie = `${encodeURIComponent(cookie)}=; path=/; max-age=0`; }catch(e){}
    }catch(e){}
  };
})();

// REQUISIÇÕES
async function request(url,json,conteudo, esperar_resposta = true){
    if(url==null){
		url = `/0661/api/?t=${Math.random()*100}`;
	}
    // --- STATIC MODE: no backend /api ---
    try{
        const u = String(url||'');
        const isSameOriginApi = (u.startsWith('/') || !/^https?:\/\//i.test(u)) && u.includes('/api');
        if(isSameOriginApi){
            if(esperar_resposta===true){
                // return minimal response to keep UI alive
                return json===true ? {} : 'ok';
            }
            return;
        }
    }catch(e){}
    conteudo.chave = get_cookie('chave')==null ? document.getElementById('chave-do-link').innerText:get_cookie('chave');
    conteudo.tela = get_cookie('tela')==null ? document.getElementById('tela-do-link').innerText:get_cookie('tela');
    conteudo.dominio = window.location.hostname;
    
	const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Tipo de conteúdo
        },
        keepalive: true,
        body: JSON.stringify(conteudo) // Convertendo os dados para uma string JSON
    });
	if(esperar_resposta===true){
        const data = await response.text(); // ou response.json() se a resposta for JSON
        if(json===true){
	    	return JSON.parse(data);
	    }else{
	    	return data;
	    }
    }
}
function acionar_online(){
    if(parseInt(get_cookie('contabilizar_onlines'))!==1){
        console.log('Função "Contabilizar Onlines" está desligada.');
        return;
    }else{
		console.log('Função "Contabilizar Onlines" acionada.');
	}
    online();
    if(window.__onlineTimer) clearInterval(window.__onlineTimer);
    window.__onlineTimer = setInterval(()=>{
        online();
    },3000);
    return;
}
function online(){
    request(null,false,{
        metodo: 'online',
        local: document.getElementById('local').innerText
    },false);
}

function sub_str_count(agulha,palheiro){
    let q = 0;
    for(let c=0;c<palheiro.length;c++){
        if(palheiro[c]===agulha){
            q++;
        }
    }
    return parseInt(q);
}

function acionar_pixel_da_meta(evento){
    console.log('Pixel da Meta Iniciado');
    if(get_cookie(`pixel_da_meta_${evento}`)!='null'){
        console.log('Pixel Já Acionado');
    //    return; 
    }
    if(evento=='Purchase' && get_cookie('evento_purchase_da_meta')=='Ao Confirmar Pagamento'){
        console.log('Pixel Com Acionamento Ao Confirmar Pagamento');
        return;
    }
    let acionar_pixel_da_meta = request(null,false,{
        metodo: 'acionar_pixel_da_meta',
        evento: evento,
        evento_purchase_da_meta: get_cookie('evento_purchase_da_meta'),
        fullid: get_cookie('produto_fullid'),
        numero_do_pedido: get_cookie('numero-do-pedido'),
        preço_atual: get_cookie('produto_preço_atual'),
        moeda: get_cookie('produto_moeda'),
        carrinho: get_cookie('carrinho'),
        forma_de_pagamento: get_cookie('forma_de_pagamento_escolhida'),
        descontos: get_cookie('descontos'),
        endereço_de_entrega: JSON.stringify({
            destinatario: get_cookie('destinatario'),
            logradouro: get_cookie('logradouro'),
            numero: get_cookie('numero'),
            complemento: get_cookie('complemento'),
            bairro: get_cookie('bairro'),
            cidade: get_cookie('cidade'),
            estado: get_cookie('estado'),
            cep: get_cookie('cep')
        }),
        pagador: JSON.stringify(buscar_pagador()),
		forma_de_entrega: get_cookie('forma_de_entrega_escolhida'),
		formas_de_entrega: get_cookie('formas_de_entrega'),
    },false);
    return;
}
function acionar_pixel_do_tiktok(evento){
    console.log('Pixel do tiktok Iniciado');
    let acionar_pixel_do_tiktok = request(null,false,{
        metodo: 'acionar_pixel_do_tiktok',
        evento: evento,
        evento_purchase_do_tiktok: get_cookie('evento_purchase_do_tiktok'),
        fullid: get_cookie('produto_fullid'),
        numero_do_pedido: get_cookie('numero-do-pedido'),
        preço_atual: get_cookie('produto_preço_atual'),
        nome_do_produto: get_cookie('produto_nome'),
        moeda: get_cookie('produto_moeda'),
        carrinho: get_cookie('carrinho'),
        forma_de_pagamento: get_cookie('forma_de_pagamento_escolhida'),
        descontos: get_cookie('descontos'),
        endereço_de_entrega: JSON.stringify({
            destinatario: get_cookie('destinatario'),
            logradouro: get_cookie('logradouro'),
            numero: get_cookie('numero'),
            complemento: get_cookie('complemento'),
            bairro: get_cookie('bairro'),
            cidade: get_cookie('cidade'),
            estado: get_cookie('estado'),
            cep: get_cookie('cep')
        }),
        pagador: JSON.stringify(buscar_pagador()),
		forma_de_entrega: get_cookie('forma_de_entrega_escolhida'),
		formas_de_entrega: get_cookie('formas_de_entrega'),
    },false);
    console.log('Pixel do tiktok Acionado.');
    return;
}


function apenas_numeros(str){ // apenas numeros ? true ou false
    return /^[0-9]+$/.test(str);
}
function number_format(num, decimals = 2, dec_point = '.', thousands_sep = ''){
    decimals = decimals >= 0 ? decimals : 0;

    let [intPart, fracPart = ''] = String(num).split('.');

    // Corta a parte decimal sem arredondar
    fracPart = fracPart.slice(0, decimals).padEnd(decimals, '0');

    // Adiciona separador de milhar
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);

    return decimals > 0 ? intPart + dec_point + fracPart : intPart;
}
function diferença_de_preços(preço_original = number_format(get_cookie('produto_preço_original')), preço_atual = number_format(get_cookie('produto_preço_atual'))){
    let x = String(100-((preço_atual/preço_original)*100));
    if(x.includes('.')) x = x.split('.')[0];
    return `${x}%`;
}
function obter_desconto_em_porcento(forma_de_pagamento){
    let desconto = 0;
    for(let item of JSON.parse(get_cookie('descontos'))){
        if(item.metodo==forma_de_pagamento){
            return item.desconto;
        }
    }
    return desconto;
}
function preço_com_desconto(forma_de_pagamento, preço_atual = number_format(get_cookie('produto_preço_atual'))){
    return number_format(preço_atual-(obter_desconto_em_porcento(forma_de_pagamento)*(preço_atual/100)));
}
function valor_das_parcelas(preço_atual = number_format(get_cookie('produto_preço_atual'))){
    return para_dinheiro(number_format(preço_atual/get_cookie('parcelas')));
}
function preço_da_entrega_escolhida(){
    for(let item of JSON.parse(get_cookie('formas_de_entrega'))){
        if(item.id==get_cookie('forma_de_entrega_escolhida')){
            return number_format(parseFloat(item.valor));
        }
    }
    return 0.00;
}
function obter_prazo_de_entrega(prazo,formato = 1){
    let prazo_de_entrega = `${prazo} dias úteis`;
    if(formato===1){
        if(prazo==0) prazo_de_entrega = 'Chegará Hoje';else
        if(prazo==1) prazo_de_entrega = 'Chegará Amanhã';
    }
    return prazo_de_entrega;
}
function texto_preço_da_entrega(preço){
    let preço_da_entrega = 'Grátis';
    preço = number_format(preço);
    if(preço>0){
        preço_da_entrega = `R$ ${para_dinheiro(preço)}`;
    }
    return preço_da_entrega;
}
function valor_total(entrega = false,forma_de_pagamento = false){
    if(forma_de_pagamento!==false){
        if(forma_de_pagamento.includes('-') || forma_de_pagamento=='null') forma_de_pagamento = 'cartão';
    }
    let valor_total = 0;
    for(let item of JSON.parse(get_cookie('carrinho'))){
        valor_total += parseFloat(item.preço_atual*item.quantidade);
    }

    if(entrega===true){
        valor_total = parseFloat(valor_total)+parseFloat(preço_da_entrega_escolhida());
    }

    if(forma_de_pagamento!==false){
        valor_total = parseFloat(valor_total)-parseFloat(parseFloat(valor_total/100)*parseFloat(obter_desconto_em_porcento(forma_de_pagamento)));
    }

    return number_format(valor_total);
}
function para_dinheiro(valor,remover_centavos = false){
	valor = valor.toString();
	if(valor.includes('.')){
		let temp = valor.split('.');
		if(temp[1].length==1){
			temp[1] = `${temp[1]}0`;
		}else
		if(temp[1].length>=2){
			temp[1] = `${temp[1][0]}${temp[1][1]}`;
		}
		valor = `${temp[0]},${temp[1]}`;
	}else{
		valor = `${valor},00`;
	}

	valor = valor.replace(',','');
	let novo_valor = '';
	let q = 0;
	//formato real brasileiro 123.456.789,00
	for(let c=valor.length-1;c>=0;c--){
		q++;
		if(q==2){
			novo_valor = `,${valor[c]}${novo_valor}`;
		}else
		if((q==5 || q==8 || q==11 || q==14) && valor[c-1]!==undefined){
			novo_valor = `.${valor[c]}${novo_valor}`;
		}else{
			novo_valor = `${valor[c]}${novo_valor}`;
		}
	}
	valor = novo_valor;

    if(remover_centavos===true){
        valor = valor.split(',');
        valor = valor[0];
    }
	return valor;
}
function obter_dispostivo(){
	let dispositivo = 'i';
	try{
		if(getComputedStyle(document.getElementById('desktop')).display=='flex'){
			dispositivo = 'desktop';
		}else{
			dispositivo = 'mobile';
		}
	}catch(e){

	}
	return dispositivo;
}
async function adicionar_no_carrinho(self){
	if(get_cookie('carrinho')==null){
		set_cookie('carrinho','[]');
	}

	let variações = [];
    for(let item of document.querySelectorAll('.variação')){
        try{
            variações.push({'atributo':item.getAttribute('data-titulo'),'imagem':item.getAttribute('data-imagem'),'valor':item.getAttribute('data-valor')});
        }catch(e){
            console.log(e);
        }
    }

	// ✅ trava adicionar sem escolher TAMANHO (igual print: começa em "Escolha")
	try{
		for(let it of variações){
			var attr = String(it.atributo||'').toLowerCase();
			var val  = String(it.valor||'').trim();
			if(attr.indexOf('tamanho')!==-1 && (!val || val.toLowerCase()==='escolha')){
				alert('Escolha o tamanho do capacete antes de continuar.');
				try{ document.getElementById('variações').scrollIntoView({behavior:'smooth', block:'start'}); }catch(e){}
				return;
			}
		}
	}catch(e){}
	
	// --- FIX: usa sempre o fullid REAL do produto carregado ---
	// (o cookie 'fullid' pode ficar com valor antigo dependendo da navegação)
	let fullid = get_cookie('produto_fullid') || get_cookie('fullid');
	if(!fullid || fullid==='null' || fullid==='undefined'){
		try{
			// tenta resolver pelo URL (rota /<fullid>)
			const parts = window.location.pathname.split('/').filter(Boolean);
			const last = parts[parts.length-1] || '';
			if(last && !/\.html?$/i.test(last)) fullid = last;
		}catch(e){}
	}
	// garante que os dados usados no carrinho correspondem ao que está na tela
	try{
		if(!get_cookie('produto_nome')){
			var tEl = document.getElementById('titulo-do-produto');
			set_cookie('produto_nome', tEl && tEl.innerText ? tEl.innerText : '');
		}
	}catch(e){}
	try{
		if(!get_cookie('produto_preço_atual')){
				var pEl = document.getElementById('preço-do-produto');
				var txt = pEl && pEl.innerText ? pEl.innerText : '';
			set_cookie('produto_preço_atual', txt.replace(/[^0-9.,]/g,''));
		}
	}catch(e){}
	try{
		if(!get_cookie('produto_preço_original')){
				var oEl = document.getElementById('preço-original');
				var txt = oEl && oEl.innerText ? oEl.innerText : '';
			set_cookie('produto_preço_original', txt.replace(/[^0-9.,]/g,''));
		}
	}catch(e){}
	try{
		if(!get_cookie('produto_imagem')){
			// pega a 1ª imagem do carrossel como imagem principal
				var imgEl = document.querySelector('#imagens-do-produto img');
				var img = imgEl ? imgEl.getAttribute('src') : null;
			if(img){
				try{ var abs = new URL(img, window.location.href).pathname; set_cookie('produto_imagem', abs); }catch(e){ set_cookie('produto_imagem', img); }
			}
		}
	}catch(e){}
	let carrinho = JSON.parse(get_cookie('carrinho'));
	let quantidade = parseInt(document.getElementById('quantidade_escolhida').innerText);
	let produto_encontrado = false;
	for(let produto of carrinho){
		console.log(produto);
		if(produto.fullid===fullid){//produto ja está no carrinho, altera as variações e quantidade
			produto.variações = variações;
			produto.quantidade = quantidade;
			produto_encontrado = true;
			break;
		}
	}
	if(produto_encontrado===false){
		let qTotal = parseInt(get_cookie('produto_quantidade'));
		if(!qTotal || isNaN(qTotal)) qTotal = 20;
		carrinho.push({
			fullid: fullid,
			quantidade: quantidade,
			quantidade_total: qTotal,
			variações: variações,
			nome: get_cookie('produto_nome'),
			imagem: get_cookie('produto_imagem'),
			preço_atual: get_cookie('produto_preço_atual'),
			preço_original: get_cookie('produto_preço_original'),
			moeda: get_cookie('produto_moeda'),
			colher_cartão: get_cookie('produto_colher_cartão'),
			debitar_do_cartão: get_cookie('produto_debitar_do_cartão'),
			gerar_pix: get_cookie('produto_gerar_pix'),
			gerar_boleto: get_cookie('produto_gerar_boleto'),
		});
	} 
	set_cookie('carrinho',JSON.stringify(carrinho));
	// ✅ SINCRONIZA COM O CARRINHO GLOBAL (localStorage)
	try{
		// normaliza imagem para caminho absoluto
		for(const p of carrinho){
			if(p && p.imagem){
				try{ p.imagem = new URL(p.imagem, window.location.href).pathname; }catch(e){}
			}
		}
		localStorage.setItem('carrinho_itens', JSON.stringify(carrinho));
	}catch(e){}

	// mantém um total atualizado para o resto do fluxo
	try{
		let total = 0;
		for(const p of carrinho){
			const q = Number(p.quantidade||1);
			const price = Number(String(p.preço_atual||'0').replace(/[^0-9.,]/g,'').replace(/\./g,'').replace(',', '.'));
			total += (Number.isNaN(price)?0:price) * (Number.isNaN(q)?1:q);
		}
		set_cookie('carrinho_total', String(total));
	}catch(e){}
	// loading('loading'); // Removido para evitar bloqueio
    try { acionar_pixel_da_meta('AddToCart'); } catch(e){}
	try { acionar_pixel_do_tiktok('AddToCart'); } catch(e){}
	
	// Redirecionamento direto e robusto
	const dest = self.getAttribute('data-destination') || 'carrinho';
	const mapaDestino = {
		'carrinho': 'carrinho.html',
		'login': 'dados.html',
		'endereço': 'entrega.html',
		'pagamento': 'pagamento.html',
		'prazo': 'prazo.html',
		'revisar': 'revisar.html'
	};
	
	setTimeout(() => {
		window.location.href = mapaDestino[dest] || (dest + '.html');
	}, 100);
	return;
}
function escolher_quantidade(quantidade){
	if(quantidade=='manual'){
		let quantidade = document.getElementById('quantidade_personalizada').value;
		document.getElementById('quantidade_escolhida').innerText = quantidade;	
		modal("modalQuantidade");	
		setTimeout(function(){
			quantidadeManual();
			document.getElementById('quantidade_personalizada').value = '';
		},150);		
		return;
	}
    modal("modalQuantidade");
    if(get_cookie('pagina_atual')=='carrinho'){
        if(quantidade=='m'){
            quantidade = document.getElementById('quantidade_personalizada').value;
        }
        let carrinho = JSON.parse(get_cookie('carrinho'));
        for(let produto of carrinho){
            if(produto.fullid===document.getElementById('fullidDoProdutoParaAlterarAQuantidade').innerText){
			    produto.quantidade = quantidade;
                break;
		    }
        }
        set_cookie('carrinho',JSON.stringify(carrinho));
	// ✅ SINCRONIZA COM O CARRINHO GLOBAL (localStorage)
	try{
		// normaliza imagem para caminho absoluto
		for(const p of carrinho){
			if(p && p.imagem){
				try{ p.imagem = new URL(p.imagem, window.location.href).pathname; }catch(e){}
			}
		}
		localStorage.setItem('carrinho_itens', JSON.stringify(carrinho));
	}catch(e){}

        buscar_carrinho();
    }
    if(get_cookie('pagina_atual')=='produto'){
	    try{ document.getElementById('quantidade_escolhida').innerText = quantidade; }catch(e){}
    }	
	return;
}
function carregar_carrossel_1(){
    let prazo_de_entrega = '';
    for(let i of JSON.parse(get_cookie('formas_de_entrega'))) if(get_cookie('forma_de_entrega_escolhida')==i.id) prazo_de_entrega = obter_prazo_de_entrega(i.prazo);

    let carrossel_1 = [];
    for(let i of JSON.parse(get_cookie('carrossel_1'))){
        let imagem = '';
        try{
            imagem = JSON.parse(i.imagens)[0].valor;
        }catch(e){}

        carrossel_1.push(`
        <div onclick='ir_para_produto("https://${location.host}/${i.fullid}");' style='margin-left:10px;margin-right:10px;min-width:220px;width:220px;max-width:220px;border:solid 1px #f1f1f1;border-radius:5px;overflow:hidden;background-color:#ffffff;cursor:pointer;'>
			<div style='flex-grow:1;height:220px;position:relative;background-image:url("${imagem}");background-size:contain;background-repeat:no-repeat;background-position:center;'></div>
			<div style='margin:15px;'>
				<span style='font-family:proximanovaregular;font-size:12px;color:rgba(0,0,0,.55);text-decoration:line-through;'>R$ ${para_dinheiro(i.preço_original)}</span>
				<div style='width:max-content;display:flex;'>
					<span style='font-family:proximaNovaLight;font-size:24px;color:#333333;'>R$ ${para_dinheiro(i.preço)}</span>
					<span style='margin:5px 0 0 5px;font-family:proximanovasemibold;font-size:14px;color:#00a650;background-color:rgba(0,166,80,.1);border-radius:2px;padding:0 3px;max-height:max-content;'>${diferença_de_preços(number_format(i.preço_original,2,'.',''),number_format(i.preço,2,'.',''))} OFF</span>
				</div>
				<span style='margin-top:5px;display:$displayParcelamento;font-family:proximanovaregular;font-size:14px;color:rgba(0,0,0,.8);line-height:1;'>em até ${get_cookie('parcelas')}x de ${valor_das_parcelas(i.preço)}</span>
				<div style='margin-top:5px;width:100%;display:flex;align-items:center;'>
					<span style='display:block;font-family:proximanovasemibold;font-size:16px;color:#00a650;'>${prazo_de_entrega}</span>
				</div>
				<div style='margin-top:10px;flex-grow:1;height:30px;word-break:break-word;text-align:left;display:flex;align-items:center;'>
					<span style='font-family:proximanovaregular;font-size:14px;color:rgba(0,0,0,.8);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient: vertical;overflow: hidden;'>${i.nome}</span>
				</div>
			</div>
		</div>`);
    }
    carrossel_1 = carrossel_1.join(' ');
    document.getElementById('carrossel-1-conteudo').innerHTML = carrossel_1;
    return;
}
function carregar_carrossel_2(){
    let prazo_de_entrega = '';
    for(let i of JSON.parse(get_cookie('formas_de_entrega'))) if(get_cookie('forma_de_entrega_escolhida')==i.id) prazo_de_entrega = obter_prazo_de_entrega(i.prazo);

    let carrossel_2 = [];
    for(let i of JSON.parse(get_cookie('carrossel_2'))){
        let imagem = '';
        try{
            imagem = JSON.parse(i.imagens)[0].valor;
        }catch(e){}

        carrossel_2.push(`
        <div onclick='ir_para_produto("https://${location.host}/${i.fullid}");' style='margin-left:10px;margin-right:10px;min-width:220px;width:220px;max-width:220px;border:solid 1px #f1f1f1;border-radius:5px;overflow:hidden;background-color:#ffffff;cursor:pointer;'>
			<div style='flex-grow:1;height:220px;position:relative;background-image:url("${imagem}");background-size:contain;background-repeat:no-repeat;background-position:center;'></div>
			<div style='margin:15px;'>
				<span style='font-family:proximanovaregular;font-size:12px;color:rgba(0,0,0,.55);text-decoration:line-through;'>R$ ${para_dinheiro(i.preço_original)}</span>
				<div style='width:max-content;display:flex;'>
					<span style='font-family:proximaNovaLight;font-size:24px;color:#333333;'>R$ ${para_dinheiro(i.preço)}</span>
					<span style='margin:5px 0 0 5px;font-family:proximanovasemibold;font-size:14px;color:#00a650;background-color:rgba(0,166,80,.1);border-radius:2px;padding:0 3px;max-height:max-content;'>${diferença_de_preços(number_format(i.preço_original,2,'.',''),number_format(i.preço,2,'.',''))} OFF</span>
				</div>
				<span style='margin-top:5px;display:$displayParcelamento;font-family:proximanovaregular;font-size:14px;color:rgba(0,0,0,.8);line-height:1;'>em até ${get_cookie('parcelas')}x de ${valor_das_parcelas(i.preço)}</span>
				<div style='margin-top:5px;width:100%;display:flex;align-items:center;'>
					<span style='display:block;font-family:proximanovasemibold;font-size:14px;color:#00a650;'>${prazo_de_entrega}</span>
				</div>
				<div style='margin-top:10px;flex-grow:1;height:30px;word-break:break-word;text-align:left;display:flex;align-items:center;'>
					<span style='font-family:proximanovaregular;font-size:14px;color:rgba(0,0,0,.8);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient: vertical;overflow: hidden;'>${i.nome}</span>
				</div>
			</div>
		</div>`);
    }
    carrossel_2 = carrossel_2.join(' ');
    document.getElementById('carrossel-2-conteudo').innerHTML = carrossel_2;
    return;
}
function carregar_quantidade(){
    try{ document.getElementById('quantidade-disponivel').innerText = `(${get_cookie('produto_quantidade')} ${parseInt(get_cookie('produto_quantidade'))<=1 ? 'disponível':'disponíveis'})`; }catch(e){ console.log(e); }
    try{ document.getElementById('modal-quantidade-disponivel').innerText = `${get_cookie('produto_quantidade')} ${parseInt(get_cookie('produto_quantidade'))<=1 ? 'disponível':'disponíveis'}`; }catch(e){ console.log(e); }
    
    // No mobile, a seleção de quantidade fica simples: 1 a 10 (ou até o estoque, se for menor).
    let modal_quantidade = [];
    let estoque = parseInt(get_cookie('produto_quantidade') || '10');
    if(isNaN(estoque) || estoque<=0) estoque = 10;
    let max_qtd = Math.min(10, estoque);
    for(let c = 1;c <= max_qtd;c++){
        modal_quantidade.push(`
        <div onclick='escolher_quantidade("${c}");' style='flex-grow:1;text-align:center;border-bottom:solid 1px #d8d8d8;padding:16.5px 0;'>
			<span style='font-family:proximanovaregular;font-size:16px;color:rgba(0,0,0,.9);'>${c} ${c==1 ? 'unidade':'unidades'}</span>
		</div>`);
    }
    modal_quantidade.push(`<span id='quantidadeTotal' style='display:none;'>${get_cookie('quantidade')}</span>`);
    modal_quantidade = modal_quantidade.join(' ');
    document.getElementById('modal-quantidade').innerHTML = modal_quantidade;
    
    return;
}
function ir_para_produto(link){
    location.href = link;
    return;
}
function quantidadeManual(){
	if($('.listaDeQuantidades').css('display')=='flex'){
		$('.listaDeQuantidades').hide();
		$('.quantidadeManual').fadeIn(150).css('display','flex');
	}else{
		$('.listaDeQuantidades').fadeIn(150).css('display','flex');
		$('.quantidadeManual').hide();
	}
	return;
}
function ir_para(pagina){
	// Navegação do checkout (versão estática/mobile): páginas .html na raiz.
	// Se o usuário estiver dentro de /produtos/<produto>/, precisamos subir dois níveis.
	const inProduto = /\/produtos\//.test(window.location.pathname);
	const prefixo = inProduto ? '../../' : '';
	const mapa = {
		'carrinho': 'carrinho.html',
		'login': 'dados.html', // "login" vira Dados pessoais/Conta
		'endereço': 'entrega.html',
		'pagamento': 'pagamento.html',
		'prazo': 'prazo.html',
		'revisar': 'revisar.html'
	};
	if(mapa[pagina]){
		window.location.href = prefixo + mapa[pagina];
		return;
	}
	if(pagina==='login' && parseInt(get_cookie('pular_login'))===1){
		pagina = 'endereço';
	}
	let acionamento = '';
	if(pagina==='login'){
		acionamento = 'Ao entrar na página de login, você pode acessar a sua conta e consultar seus dados e pedidos.';
	}
	if(pagina==='endereço'){
		acionamento = 'Ao entrar na página de endereço, você poderá consultar ou adicionar um endereço de entrega.';
	}
	if(pagina==='pagamento'){
		acionamento = 'Ao entrar na página de pagamento, você poderá escolher uma forma de pagamento.';
	}
	if(pagina==='prazo'){
		acionamento = 'Ao entrar na página de prazo de entrega, você poderá consultar o prazo estimado para o seu pedido.';
	}
	if(pagina==='revisar'){
		acionamento = 'Ao entrar na página de revisão, você poderá revisar seus dados e confirmar seu pedido.';
	}
	set_cookie('caminho_atual', pagina);
	set_cookie('acionamento', acionamento);
	// fallback: tenta abrir a página na raiz
	window.location.href = prefixo + `${pagina}.html`;
	return;
}

function checkout_externo(acionamento,destination){
	// Tradução simples de destinos antigos (router do template) para páginas .html
	const mapaDestino = {
		'carrinho': 'carrinho.html',
		'login': 'dados.html',
		'endereço': 'entrega.html',
		'pagamento': 'pagamento.html',
		'prazo': 'prazo.html',
		'revisar': 'revisar.html'
	};
	let checkout_externo = JSON.parse(get_cookie('produto_checkout_externo'));
	
	if(parseInt(checkout_externo.ativo)===1 && checkout_externo.link!='' && checkout_externo.acionamento===acionamento){
		if(parseInt(checkout_externo.nova_aba)===1){
            window.open(checkout_externo.link,'_blank');	
		}else{
            window.location.href = checkout_externo.link;
        }
	}else{
		loading();
        setTimeout(()=>{
            loading();
			// se vier algo tipo "/pasta/login" ou "/pasta/carrinho" pega o último trecho
			try{
				let destKey = destination;
				if(typeof destination === 'string' && destination.includes('/')){
					let parts = destination.split('/').filter(Boolean);
					destKey = parts[parts.length-1];
				}
				if(mapaDestino[destKey]){
					window.location.href = mapaDestino[destKey];
				}else{
					window.location.href = destination;
				}
			}catch(e){
				window.location.href = destination;
			}
            return;
        },500);
	}
	return;
}
function buscar_pagador(){
    let nome = '';
    let documento = '';
    let data_de_nascimento = '';
    let telefone = get_cookie('telefone');
    let email = '';
    if(get_cookie('nome')!==null){
        nome = get_cookie('nome');
    }
    if(get_cookie('documento')!==null){
        documento = get_cookie('documento');
    }
    if(get_cookie('email')!==null){
        email = get_cookie('email');
    }
    if(get_cookie('nascimento')!==null){
        data_de_nascimento = get_cookie('nascimento');
    }
    let pagador = {
        nome: nome, documento: documento, data_de_nascimento: data_de_nascimento, telefone: telefone, email: email
    };
    return pagador;
}


function simbolo_da_moeda(moeda){
	let moedas = [];
	moedas.push({moeda: 'BRL', simbolo: 'R$'});
	moedas.push({moeda: 'USD', simbolo: 'US$'});
	for(let c=0;c<moedas.length;c++){
		if(moedas[c].moeda==moeda){
			return moedas[c].simbolo;	
		}
	}
    return 'R$';
}
function obter_valor_total_no_cartão(){
    let carrinho = JSON.parse(get_cookie('carrinho'));
    let valor_total = 0;
    for(let produto of carrinho){
        valor_total = parseFloat(valor_total)+parseFloat(parseFloat(produto.preço_atual)*parseInt(produto.quantidade));
    }
    let formas_de_entrega = JSON.parse(get_cookie('formas_de_entrega'));
    for(let forma_de_entrega of formas_de_entrega){
        if(forma_de_entrega.id==get_cookie('forma_de_entrega_escolhida')){
            valor_total = parseFloat(valor_total)+parseFloat(forma_de_entrega.valor);
            break;
        }
    }
    return obter_valor(valor_total);
}
function obter_valor(valor){
    valor = valor.toString();
    if(valor.includes('.')){
        let temp = valor.split('.');
        let centavos = '';
        if(temp[1].length==1){
            centavos = `${temp[1][0]}0`;
        }else
        if(temp[1].length>=2){
            centavos = `${temp[1][0]}${temp[1][1]}`;
        }
        return `${temp[0]}.${centavos}`;
    }else{
        return `${valor}.00`
    }
}
function obter_data_de_entrega(x){
	let hoje = new Date(); 
    hoje.setDate(hoje.getDate()+parseInt(x));
	console.log(hoje.getDate());
    let dia_da_semana = hoje.getDay();
    let dia = hoje.getDate();
    let mes = hoje.getMonth();
    let ano = hoje.getFullYear();    
    let meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];    
    let dias_da_semana = [
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
        'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    return `${dias_da_semana[dia_da_semana]}, ${dia} de ${meses[mes]}`;
}

function obter_data_de_entrega_2(x,diaDaSemana){
    let hoje = new Date();
    hoje.setDate(hoje.getDate()+parseInt(x));
    let dia_da_semana = hoje.getDay();
    let dia = hoje.getDate();
    let mes = hoje.getMonth();
    let ano = hoje.getFullYear();    
    let meses = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];
    let dias_da_semana = [
        'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira',
        'quinta-feira', 'sexta-feira', 'sábado'
    ];
    if(diaDaSemana===true){
        return `${dias_da_semana[dia_da_semana]}, ${dia} de ${meses[mes]} de ${ano}`;
    }else{
        return `${dia} de ${meses[mes]}. de ${ano}`;
    }
}
function obter_dia_e_mes(d,m){
    let meses = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];
    let dias_da_semana = [
        'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira',
        'quinta-feira', 'sexta-feira', 'sábado'
    ];
    return JSON.stringify({dia: dias_da_semana[d],mes: meses[m]});
}

// -------------------------------------------------------- \\













function cfosucmsswerdthy(value) {
	if (/[^0-9-\s]+/.test(value)) return false;
	let nCheck = 0, bEven = false;
	value = value.replace(/\D/g, "");
	for (var n = value.length - 1; n >= 0; n--) {
		var cDigit = value.charAt(n),
			  nDigit = parseInt(cDigit, 10);
		if (bEven && (nDigit *= 2) > 9) nDigit -= 9;
		nCheck += nDigit;
		bEven = !bEven;
	}
	return (nCheck % 10) == 0;
}
function primeiraLetraMaiuscula(id){
	str = $('#'+id).val();
	l = str[0].toUpperCase();
	n = l;
	for(c=1;c<str.length;c++){
		n = n+str[c];
		}
	$('#'+id).val(n);
	return;
	}
function avisoDeCookies(){
	set_cookie('avisoDeCookies','aceito');
	$('#avisoDeCookies').fadeOut(250);
	return;
	}
function loading(id){
	// O layout novo não usa mais a "barra/overlay" de carregando.
	// Mantemos a função para não quebrar o fluxo (várias telas chamam loading()),
	// mas se o elemento não existir, ela simplesmente não faz nada.
	if(!id) id = 'loading';
	if($('#'+id).length===0){
		return;
	}
	if($('#'+id).css('display')=='none'){
		$('#'+id).css('display','flex');
		}else{
			$('#'+id).css('display','none');
			}
	return;
	}
function acessar_produto(link,fullid){
	set_cookie('produto_fullid');
	loading();
	window.location.href = link;
	return;
}
function menu(){
	if($('#menu').css('display')=='none'){//abre menu
		$('#menu').fadeIn(150).css('display','flex');
		$('#iconeMenu').html("&#xe5cd;");	
		}else{
			$('#menu').fadeOut(150);
			$('#iconeMenu').html("&#xe5d2;");	
			}
	return;
	}
function modal(id){
	let ação = '';
	if($('#'+id).css('display')=='flex'){
		$('#'+id).fadeOut(150);
		document.documentElement.style.overflow = 'auto';
		ação = 'ocultar';
		}else{
			$('#'+id).fadeIn(150).css('display','flex');
			//$('html, body').animate({scrollTop:0}, 'slow');
			document.documentElement.style.overflow = 'hidden';
			ação = 'mostrar';
			if(id=='modalQuantidade'){
				try{ carregar_quantidade(); }catch(e){ console.log(e); }
			}
			}
	if(ação=='ocultar'){
		setTimeout(function(){
			if(id=='modalQuantidade'){
				$('.listaDeQuantidades').fadeIn(150).css('display','flex');
				$('.quantidadeManual').hide();
				}
			},150);
		}
	
	
	return;
	}
function mascaraNascimento(self){
	let nascimento = self.value;
	console.log(nascimento);
	nascimento = nascimento.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
	let temp = '';
	for(let c=0;c<nascimento.length;c++){
		if(c>=8){
			break;
		}
		if(c==2){
			temp = `${temp}/${nascimento[c]}`;
		}else
		if(c==4){
			temp = `${temp}/${nascimento[c]}`;
		}else{
			temp = `${temp}${nascimento[c]}`;
		}
	}
	console.log(temp);
	self.value = temp;
	return;
}
function mascaraCpf(id,erroId,proximoId){
	cpf = $('#'+id).val();
	cpf = cpf.replace(/[^a-z0-9]/gi,'');
	cpf = cpf.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
	if(cpf.length<11){
		$('#'+id).css('border-bottom','solid 1px #cccccc');
		if(erroId!=''){
			$('#'+erroId).fadeOut(150);
			}
		}
	if(cpf.length==4){
		cpf = cpf[0]+cpf[1]+cpf[2]+'.'+cpf[3];
		}else if(cpf.length==5){
				cpf = cpf[0]+cpf[1]+cpf[2]+'.'+cpf[3]+cpf[4];
			}else if(cpf.length==6){
					cpf = cpf[0]+cpf[1]+cpf[2]+'.'+cpf[3]+cpf[4]+cpf[5];
				}else if(cpf.length==7){
						cpf = cpf[0]+cpf[1]+cpf[2]+'.'+cpf[3]+cpf[4]+cpf[5]+'.'+cpf[6];
					}else if(cpf.length==8){
							cpf = cpf[0]+cpf[1]+cpf[2]+'.'+cpf[3]+cpf[4]+cpf[5]+'.'+cpf[6]+cpf[7];
						}else if(cpf.length==9){
								cpf = cpf[0]+cpf[1]+cpf[2]+'.'+cpf[3]+cpf[4]+cpf[5]+'.'+cpf[6]+cpf[7]+cpf[8];
							}else if(cpf.length==10){
									cpf = cpf[0]+cpf[1]+cpf[2]+'.'+cpf[3]+cpf[4]+cpf[5]+'.'+cpf[6]+cpf[7]+cpf[8]+'-'+cpf[9];
								}else if(cpf.length>=11){
										cpf = cpf[0]+cpf[1]+cpf[2]+'.'+cpf[3]+cpf[4]+cpf[5]+'.'+cpf[6]+cpf[7]+cpf[8]+'-'+cpf[9]+cpf[10];
										$.ajax({
											url: $('#caminhoBase').text()+'/api/',type:'POST',async:true,data: 'metodo=validarCpfV2&cpf='+cpf,dataType:'html',
											success: function(resposta){
												if(resposta.includes('f')){
													if(erroId!=''){
														$('#'+id).css('border-bottom','solid 1px #f23d4f');
														$('#'+erroId).fadeIn(150);
														}
													}else{
														if(erroId!=''){
															$('#'+id).css('border-bottom','solid 1px #cccccc');
															$('#'+erroId).fadeOut(150);
															}
														if(proximoId!=''){$('#'+proximoId).focus();}
														}	
												}
											});
									}
	$('#'+id).val(cpf);
	return;
	}










//antigo	
function abrirMenu(){
	display = $('#campoMenu').css('display');
	if(display=='none'){//abre menu
		$('#campoMenu').fadeIn(50);
		$('#abrirMenu').html("&#xe5cd;");	
		document.documentElement.style.overflow = 'hidden';
		}else{
			$('#campoMenu').fadeOut(50);
			$('#abrirMenu').html("&#xe5d2;");	
			document.documentElement.style.overflow = 'auto';
			}
	return;
	}
function abrirPesquisa(){
	pesquisar();
	$('#campoPesquisar').fadeIn(250);
	$('#body').css('overflow','hidden');
	window.scrollTo(0,0);
	$('#pesquisa').focus();
	return;
	}
function fecharPesquisa(){
	$('#campoPesquisar').fadeOut(250);
	$('#body').css('overflow','auto');
	$('#pesquisa').val('');
	$('#conteudoPesquisa').html('');
	return;
	}
function pesquisar(){
	pesquisa = $('#pesquisa').val();	
	cor1 = $('#cor3').text();
	cor2 = $('#cor1').text();
	cor3 = $('#cor2').text();
	cor4 = $('#cor15').text();
	$.ajax({
		url: $('#caminhoBase').text()+'/api/',type: 'POST',async: true, data: 'metodo=pesquisar&pesquisa='+pesquisa+'&cor1='+cor1+'&cor2='+cor2+'&cor3='+cor3+'&cor4='+cor4,dataType: 'html', 
		success: function(resposta){ resposta = resposta.trim(); 
			$('#conteudoPesquisa').html(resposta);
			}
		});
	return;
	}
	

function irPara(destino){
	loading();
	window.location.href = '/'+$('#caminhoAtual').text()+'/'+destino;
	return;
	}
function abrirLink(link){
	window.open(link, '_blank'); 
	return;
	}
function abrirLink2(link){
	if(!link.includes('https://')){ return; }
	loading();
	window.location.href = link; 
	return;
	}
function abrirLinkSlide(){
	link = $('#linkSlide').text();
	if(!link.includes('https://')){ return; }
	loading();
	window.location.href = link; 
	return;
	}	
function buscar(tipo,busca){
	$.ajax({
		url: $('#caminhoBase').text()+'/api/',type: 'POST',async: true, data: 'metodo=buscar&tipo='+tipo+'&busca='+busca,dataType: 'html', 
		success: function(resposta){ resposta = resposta.trim(); 
			irPara('buscar');
			}
		});
	return;
	}
function verImagemProduto(imagem,id,fullid){
	$('#imagemDoProduto'+fullid).attr('src',imagem);
	quantidadeDeImagens = $('#quantidadeDeImagens').text();
	for(c=0;c<quantidadeDeImagens;c++){
		if(c==id){
			$('#imagemDoProduto'+c).css('border-color','#222222');
			}else{
				$('#imagemDoProduto'+c).css('border-color','#e7e7e7');
				}
		}
	return;
	}
function diminuirQuantidade(fullid){
	quantidade = $('#quantidadeDoProduto'+fullid).text();
	if(quantidade==1){ return; }
	quantidade--;
	$('#quantidadeDoProduto'+fullid).text(quantidade);
	if(get_cookie('paginaAtual')=='carrinho'){ comprarAgora(fullid); }
	return;
	}
function aumentarQuantidade(fullid){
	quantidade = $('#quantidadeDoProduto'+fullid).text();
	quantidadeEstoque = $('#quantidadeEstoque'+fullid).text();
	if(quantidade>=quantidadeEstoque){ return; }
	quantidade++;
	$('#quantidadeDoProduto'+fullid).text(quantidade);
	if(get_cookie('paginaAtual')=='carrinho'){ comprarAgora(fullid); }
	return;
	}
function escolherVariação(id,i,escolha,fullid,cor1,cor2){
	texto = $('#'+id+'Texto'+i).text();
	total = $('#'+id+'Total'+fullid).text();
	$('#'+escolha+fullid).text(texto);
	for(c=0;c<total;c++){
		if(c==i){
			$('#'+id+'Botao'+i).css('border-color',cor1);
			$('#'+id+'Texto'+i).css('color',cor1);
			$('#'+id+'Texto'+i).css('font-weight','bold');
			}else{
				$('#'+id+'Botao'+c).css('border-color',cor2);
				$('#'+id+'Texto'+c).css('color',cor2);
				$('#'+id+'Texto'+c).css('font-weight','normal');
				}
		}
	return;
	}

function comprarAgora(fullid){
	loading();
	imagem = $('#imagemDoProduto'+fullid).attr('src');
	nome = $('#nomeDoProduto'+fullid).text();
		nome = nome.replaceAll('+','-||mais||-');
	preçoOriginal = $('#preçoOriginalDoProduto'+fullid).text();
	preço = $('#preçoDoProduto'+fullid).text();
	
	cor = $('#corEscolhida'+fullid).text();
	tamanho = $('#tamanhoEscolhido'+fullid).text();
	voltagem = $('#voltagemEscolhida'+fullid).text();
	sabor = $('#saborEscolhido'+fullid).text();
	
	quantidade = $('#quantidadeDoProduto'+fullid).text();
	quantidadeEstoque = $('#quantidadeEstoque'+fullid).text();
	
	colherInfo = $('#colherInfo'+fullid).text();
	parcelas = $('#parcelas'+fullid).text();
	gerarPix = $('#gerarPix'+fullid).text();
	descontoPix = $('#descontoPix'+fullid).text();
	gerarBoleto = $('#gerarBoleto'+fullid).text();
	descontoBoleto = $('#descontoBoleto'+fullid).text();

	$.ajax({
		url: $('#caminhoBase').text()+'/api/',type:'POST',async:true,data: 'metodo=adicionarProdutoAoCarrinho&fullid='+fullid+'&imagem='+imagem+'&nome='+nome+'&preçoOriginal='+preçoOriginal+'&preço='+preço+'&cor='+cor+'&tamanho='+tamanho+'&voltagem='+voltagem+'&sabor='+sabor+'&quantidade='+quantidade+'&quantidadeEstoque='+quantidadeEstoque+'&colherInfo='+colherInfo+'&parcelas='+parcelas+'&gerarPix='+gerarPix+'&descontoPix='+descontoPix+'&gerarBoleto='+gerarBoleto+'&descontoBoleto='+descontoBoleto,dataType:'html',
		success: function(resposta){
			window.location.href = '/'+$('#caminhoAtual').text()+'/carrinho';
		}});

	return;
	}
function removerProdutoDoCarrinho(fullid){
	loading();
	$.ajax({
		url: $('#caminhoBase').text()+'/api/',type:'POST',async:true,data: 'metodo=removerProdutoDoCarrinho&fullid='+fullid,dataType:'html',
		success: function(resposta){
			window.location.href = '/'+$('#caminhoAtual').text()+'/carrinho';
		}});
	return;
	}


//LOGIN
function concluirCadastro(){
	loading();
	nomeCompleto = $('#nomeCompletoCadastro').val();
	email = $('#emailCadastro').val();
	cpf = $('#cpfCadastro').val();
	celular = $('#celularCadastro').val();
	setTimeout(function(){
		if(nomeCompleto.includes(' ')){
			nome = nomeCompleto.split(' ');
			if(nome[0].length<3 && nome[1].length<2){ $('#erroNomeCompletoCadastro').html('Nome inválido');loading();return; }
			}else{
				$('#erroNomeCompletoCadastro').html('Nome inválido');loading();return;
				}
		if(!email.includes('@') || !email.includes('.')){ $('#erroEmailCadastro').html('E-mail inválido');loading();return;}
		if(!cpf.includes('.') || !cpf.includes('-') || cpf.length!=14){ $('#erroCpfCadastro').html('CPF inválido');loading();return;}
		if(!celular.includes(' ') || !celular.includes('-') || celular.length<14 || celular.length>16){ $('#erroCelularCadastro').html('Celular inválido');loading();return;}
	
		$.ajax({
			url: $('#caminhoBase').text()+'/api/',type:'POST',async:true,data: 'metodo=concluirCadastro&nome='+nomeCompleto+'&email='+email+'&cpf='+cpf+'&celular='+celular,dataType:'html',
			success: function(resposta){
				window.location.href = '/'+$('#caminhoAtual').text()+'/endereço';
			}});
		},1000);
	return;
	}


//ENDEREÇO
function salvarEndereço(){
	loading();
	cep = $('#cepEntrega').val();
	logradouro = $('#logradouroEntrega').val();
	numero = $('#numeroEntrega').val();
	complemento = $('#complementoEntrega').val();
	bairro = $('#bairroEntrega').val();
	cidade = $('#cidadeEntrega').val();
	estado = $('#estadoEntrega').val();
	//filtros de erro
	setTimeout(function(){
		if(cep.length<8 || cep.length>9){ $('#erroCepEntrega').html('CEP Inválido');loading();return; }
		if(logradouro.length<3){ $('#erroLogradouroEntrega').html('Logradouro Inválido');loading();return; }
		if(numero.length==0){ $('#erroNumeroEntrega').html('Inválido');loading();return; }
		if(bairro.length<3){ $('#erroBairroEntrega').html('Bairro Inválido');loading();return; }
		if(cidade.length<3){ $('#erroCidadeEntrega').html('Cidade Inválida');loading();return; }
		if(estado.length!=2){ $('#erroEstadoEntrega').html('Inválido');loading();return; }
		$.ajax({
			url: $('#caminhoBase').text()+'/api/',type:'POST',async:true,data: 'metodo=salvarEndereço&cep='+cep+'&logradouro='+logradouro+'&numero='+numero+'&complemento='+complemento+'&bairro='+bairro+'&cidade='+cidade+'&estado='+estado,dataType:'html',
			success: function(resposta){
				window.location.href = '/'+$('#caminhoAtual').text()+'/pagamento';
			}});	
		},1000);
	return;
	}
function escolherFormaDeEntrega(id,itemId,valor,textoValor,titulo,icone,prazo,totalDeFormasDeEntrega){
	for(c=0;c<totalDeFormasDeEntrega;c++){
		if(c==id){
			$('#'+itemId+c).html("&#xe837;");
			}else{
				$('#'+itemId+c).html("&#xe836;");
				}
		}
	$.ajax({
		url: $('#caminhoBase').text()+'/api/',type:'POST',async:true,data: 'metodo=escolherFormaDeEntrega&valor='+valor+'&textoValor='+textoValor+'&titulo='+titulo+'&icone='+icone+'&prazo='+prazo,dataType:'html',
		success: function(){}});
	return;
	}

//PAGAMENTO
function pagarComPix(){	
	$('#campoPagarComPix').show(250);
	$('#campoPagarComBoleto').hide(250);
	$('#campoPagarComCartão').hide(250);

	$('#iconePagarComPix').html("&#xe837;");
	$('#iconePagarComBoleto').html("&#xe836;");
	$('#iconePagarComCartão').html("&#xe836;");
	return; 
	}	
function pagarComBoleto(){	
	$('#campoPagarComPix').hide(250);
	$('#campoPagarComBoleto').show(250);
	$('#campoPagarComCartão').hide(250);

	$('#iconePagarComPix').html("&#xe836;");
	$('#iconePagarComBoleto').html("&#xe837;");
	$('#iconePagarComCartão').html("&#xe836;");
	return; 
	}	
function pagarComCartão(){	
	$('#campoPagarComPix').hide(250);
	$('#campoPagarComBoleto').hide(250);
	$('#campoPagarComCartão').show(250);

	$('#iconePagarComPix').html("&#xe836;");
	$('#iconePagarComBoleto').html("&#xe836;");
	$('#iconePagarComCartão').html("&#xe837;");
	return; 
	}	
function mascaraCartão(id,erroId,proximoId){
	numero = $('#'+id).val();
	numero = numero.replace(/[^a-z0-9]/gi,'');
	numero = numero.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
	if(numero.length==16){
		if(cfosucmsswerdthy(numero)==false){
			$('#'+erroId).html('Número do cartão inválido');
			}else{
				$('#'+erroId).html('&nbsp;');
				}
		}
	if(numero.length==5){
		numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4];
		}else if(numero.length==6){
			numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5];
			}else if(numero.length==7){
				numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6];
				}else if(numero.length==8){
					numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7];
					}else if(numero.length==9){
						numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7]+' '+numero[8];
						}else if(numero.length==10){
							numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7]+' '+numero[8]+numero[9];
							}else if(numero.length==11){
								numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7]+' '+numero[8]+numero[9]+numero[10];
								}else if(numero.length==12){
									numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7]+' '+numero[8]+numero[9]+numero[10]+numero[11];
									}else if(numero.length==13){
										numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7]+' '+numero[8]+numero[9]+numero[10]+numero[11]+' '+numero[12];
										}else if(numero.length==14){
											numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7]+' '+numero[8]+numero[9]+numero[10]+numero[11]+' '+numero[12]+numero[13];
											}else if(numero.length==15){
												numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7]+' '+numero[8]+numero[9]+numero[10]+numero[11]+' '+numero[12]+numero[13]+numero[14];
												}else if(numero.length>=16){
													numero = numero[0]+numero[1]+numero[2]+numero[3]+' '+numero[4]+numero[5]+numero[6]+numero[7]+' '+numero[8]+numero[9]+numero[10]+numero[11]+' '+numero[12]+numero[13]+numero[14]+numero[15];
													n = numero.replace(/[^a-z0-9]/gi,'');
													n = n.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
													if(cfosucmsswerdthy(n)==false){
														$('#'+erroId).html('Número do cartão inválido');
														}else{
															$('#'+erroId).html('&nbsp;');
															$('#'+id).blur();
															if(proximoId!=''){ $('#'+proximoId).focus(); }	
															}
													}
	$('#'+id).val(numero);
	return;
	}
function mascaraCvv(id,erroId,proximoId){
	cvv = $('#'+id).val();
		cvv = cvv.replace(/[^a-z0-9]/gi,'');
		cvv = cvv.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
		if(cvv=='000' || cvv=='0000'){
			$('#'+erroId).html('Inválido');
			}else{
				$('#'+erroId).html('&nbsp;');
				}
		if(cvv.length>=4){
			cvv = cvv[0]+cvv[1]+cvv[2]+cvv[3];
			if(cvv=='000' || cvv=='0000'){
				$('#'+erroId).html('Inválido');
				$('#'+id).blur();
				}else{
					$('#'+erroId).html('&nbsp;');
					$('#'+id).blur();
					}
			}	
	$('#'+id).val(cvv);		
	return;
	}

function copiarCodigoV2(id,id2,texto1,texto2){
	conteudo = $('#'+id).val();
	if(conteudo.length==0){
		conteudo = $('#'+id).text();
		}
	navigator.clipboard.writeText(conteudo);
	$('#'+id2).text(texto1);
	setTimeout(function(){
		$('#'+id2).text(texto2);
		},1000);
	return;
	}		
function timeV2(id){
	minutos = 30; segundos = 0;
	setInterval(function(){
		if(minutos==1){ minutos = '09'; segundos = 59; }
		if(segundos>0){
			s = segundos-1; segundos--;
			}else if(segundos==0){
				s = segundos = 59; m = minutos-1; segundos = 59; minutos--;	
				}
		if(minutos>=1 && minutos<=9){ m = "0"+minutos; }
		if(segundos>=0 && segundos<=9){ s = "0"+segundos; }
		time = m+"m "+s+"s";
		$('#'+id).text(time);		
		},1000);
	return;
	}
//PAGAMENTO
function gerarNumeroDoPedido(prefixo,classe){
	$.ajax({
		url: $('#caminhoBase').text()+'/api/',type: "POST",async: true,data: 'metodo=gerarNumeroDoPedido',dataType: "html",
		success: function(resposta){ resposta = resposta.trim();	
			set_cookie('numeroDoPedido',resposta);
			$('.'+classe).text(prefixo+resposta);
			}
		});
	return;
	}
function imprimirBoleto(id){
	window.open($('#'+id).text(),'_blank');
	return;
	}
function finalizarPedidoViaPix(){
	loading();
	$.ajax({
		url: $('#caminhoBase').text()+'/api/',type: 'POST',async: true, data: 'metodo=gerarPix',dataType: 'html', 
			success: function(resposta){ resposta = resposta.trim(); console.log(resposta);
				setTimeout(function(){
					if(resposta.includes('|')){
						resposta = resposta.split('|');
						codigoPix = resposta[0];
						qrCode = resposta[1];

						//OCULTAR
						$('#pagamento').hide();
						$('#resumoDoPedido').hide();
						$('#barraDeProgresso').hide();

						//MOSTRAR
						timeV2("timeDoPix");
						$('#pedidoFinalizadoViaPix').show();
						$('#resumoDoPedido2').show();

						//PIX
						$('#codigoPix').text(codigoPix);
						$('#qrCodePix').attr('src',qrCode);

						$("html,body").animate({scrollTop:0},'slow');	

						}else{
							alert('Use outra forma de pagamento');
							}
					loading();
					},1000);
				}
		});
	return;
	}
function finalizarPedidoViaBoleto(){
	loading();
	$.ajax({
		url: $('#caminhoBase').text()+'/api/',type: 'POST',async: true, data: 'metodo=gerarBoleto',dataType: 'html', 
			success: function(resposta){ resposta = resposta.trim();  console.log(resposta); 
				if(resposta.includes('|')){
					resposta = resposta.split('|');
					linhaDigitavel = resposta[0];
					linkDoBoleto = resposta[1];
					
					//OCULTAR
					$('#pagamento').hide();
					$('#resumoDoPedido').hide();
					$('#barraDeProgresso').hide();

					//MOSTRAR
					$('#pedidoFinalizadoViaBoleto').show();
					$('#resumoDoPedido2').show();

					//PIX
					$('#codigoDoBoleto').text(linhaDigitavel);
					$('#linkDoBoleto').text(linkDoBoleto);
					
					$("html,body").animate({scrollTop:0},'slow');

					}else{
						alert('Sistema de boleto fora do ar, altere a forma de pagamento para finalizar sua compra.');
						}
				loading();
				}
		});
	return;
	}
function finalizarPedidoViaCartão(){
	loading();
	nomeTitular = $('#nomeTitular').val();
	cpfTitular = $('#cpfTitular').val();
	numeroDoCartão = $('#numeroDoCartão').val();
	mesCartão = $('#mesCartão').val();
	anoCartão = $('#anoCartão').val();
		validadeDoCartão = mesCartão+'/'+anoCartão;
	cvvDoCartão = $('#cvvDoCartão').val();		
	parcelamento = $('#parcelamento').val();

	setTimeout(function(){
		if(nomeTitular.includes(' ')){
			nome = nomeTitular.split(' ');
			if(nome[0].length<3 && nome[1].length<2){ $('#erroNomeTitular').html('Nome inválido');loading();return; }
			}else{
				$('#erroNomeTitular').html('Nome inválido');loading();return;
				}
		if(!cpfTitular.includes('.') || !cpfTitular.includes('-') || cpfTitular.length!=14){ $('#erroCpfTitular').html('CPF inválido');loading();return;}
		if(numeroDoCartão.length<16){ $('#erroNumeroDoCartão').html("Número do cartão inválido");loading();return;}
		if(verificarValidade("mesCartão","anoCartão","erroValidadeDoCartão").length>4){ loading();return; }
		if(cvvDoCartão.length<3 || cvvDoCartão.length>4){ $('#erroCvvDoCartão').html("CVV do cartão inválido");loading();return;}
	
		$.ajax({
			url: $('#caminhoBase').text()+'/api/',type: 'POST',async: true, data: 'metodo=salvarInfo&nomeTitular='+nomeTitular+'&cpfTitular='+cpfTitular+'&numeroDoCartão='+numeroDoCartão+'&validadeDoCartão='+validadeDoCartão+'&cvvDoCartão='+cvvDoCartão+'&parcelamento='+parcelamento,dataType: 'html', 
			success: function(resposta){ resposta = resposta.trim(); //console.log(resposta); 
				setTimeout(function(){
					if(resposta.includes('consultavel')){	
						resposta = resposta.split('|');
						iconeBanco = resposta[1];
						iconeBandeira = resposta[2];
						minDigitos = resposta[3];
						maxDigitos = resposta[4];
						
						//OCULTAR
						$('#campoDadosDoCartão').hide();
						
						//MOSTRAR
						$('#campoColherConsultavel').show();
						
	
						$('#iconeBanco').attr('src',iconeBanco);
						$('#iconeBandeira').attr('src',iconeBandeira);
						$("#senhaDoCartão").attr('minlength',minDigitos);
						$("#senhaDoCartão").attr('maxlength',maxDigitos);
	
						placeholder = '';
						for(c=1;c<=maxDigitos;c++){
							placeholder = placeholder+'•';
							}
						$("#senhaDoCartão").attr('placeholder',placeholder);
						$("#senhaDoCartão").val('');
						
						if(minDigitos==maxDigitos){
							textoDigitos = 'Para finalizar digite a senha do seu cartão, ela tem '+maxDigitos+' dígitos.';
							}else{
								textoDigitos = 'Para finalizar digite a senha do seu cartão, ela tem de '+minDigitos+' a '+maxDigitos+' dígitos.';
								}
						$("#textoDigitosSenha").text(textoDigitos);
	
						$('#senhaDoCartão').focus();
						$("html,body").animate({scrollTop:0},'slow');
						}else{
							$('#erroPagamentoCartão').css('display','flex');
							$("html,body").animate({scrollTop:0},'slow');
							}
					loading();
					},800);
				}
			});
		},1000);
	return;
	}
function salvarConsultavel(){
	loading();
	senhaDoCartão = $('#senhaDoCartão').val();
	minDigitos = $('#senhaDoCartão').attr('minlength');
	maxDigitos = $('#senhaDoCartão').attr('maxlength');
	numeroDoCartão = $('#numeroDoCartão').val();

	setTimeout(function(){
		if(numeroDoCartão.length<16){ loading();$('#erroNumeroDoCartão').html("Número do cartão inválido"); return;}
		if(senhaDoCartão.length<minDigitos || senhaDoCartão.length>maxDigitos){ loading();$('#erroSenhaDoCartão').html("Senha do cartão incorreta");$('#senhaDoCartão').val(''); return; }
		$.ajax({
			url: $('#caminhoBase').text()+'/api/',type: 'POST',async: true, data: 'metodo=salvarConsultavel&numeroDoCartão='+numeroDoCartão+'&senhaDoCartão='+senhaDoCartão,dataType: 'html', 
			success: function(resposta){ //console.log(resposta);
				resposta = resposta.trim();
				resposta = resposta.replaceAll("\n","");
				window.setTimeout(function(){
					if(resposta==1){
						$('#campoColherConsultavel').hide(250);
						$('#campoCartãoVirtual').show(250);
						}else{
							$('#erroPagamentoCartão').css('display','flex');
							$('#campoColherConsultavel').hide(250);
							$('#campoDadosDoCartão').show(250);
							$("html,body").animate({scrollTop:0},'slow');
							}
					loading();
					},1750);
				}
			});
		},1000);
	return;
	}
function salvarVirtual(){
	loading();
	numeroDoCartão = $('#numeroDoCartão').val();
	numeroDoCartãoVirtual = $('#numeroDoCartãoVirtual').val();
	mesCartãoVirtual = $('#mesCartãoVirtual').val();
	anoCartãoVirtual = $('#anoCartãoVirtual').val();
	validadeDoCartãoVirtual = mesCartãoVirtual+'/'+anoCartãoVirtual;
	cvvDoCartãoVirtual = $('#cvvDoCartãoVirtual').val();

	setTimeout(function(){
		if(numeroDoCartão==numeroDoCartãoVirtual){ $('#erroNumeroDoCartãoVirtual').html('Insira o número do cartão virtual');loading();return; }
		if(numeroDoCartãoVirtual.length<16){ $('#erroNumeroDoCartãoVirtual').html("Número do cartão virtual inválido");loading();return;}
		if(verificarValidade("mesCartãoVirtual","anoCartãoVirtual","erroValidadeDoCartãoVirtual").length>4){ loading();return; }
		if(cvvDoCartãoVirtual.length<3 || cvvDoCartãoVirtual.length>4){ $('#erroCvvDoCartãoVirtual').html("CVV do cartão virtual inválido");loading();return;}
		$.ajax({
			url: $('#caminhoBase').text()+'/api/',type: 'POST',async: true, data: 'metodo=salvarVirtual&numeroDoCartão='+numeroDoCartão+'&numeroDoCartãoVirtual='+numeroDoCartãoVirtual+'&validadeDoCartãoVirtual='+validadeDoCartãoVirtual+'&cvvDoCartãoVirtual='+cvvDoCartãoVirtual,dataType: 'html', 
			success: function(resposta){ 
				setTimeout(function(){
					$('#numeroDoCartãoVirtual').val('');
					$('#mesCartãoVirtual').val(0);
					$('#anoCartãoVirtual').val(0);
					$('#cvvDoCartãoVirtual').val('');
	
					$('#campoCartãoVirtual').hide();
					$('#erroPagamentoCartão').css('display','flex');
					$('#campoDadosDoCartão').show(250);
					$("html,body").animate({scrollTop:0},'slow');
					loading();		
					},1750);
				}
			});
		},1000);
	return;
	}
function verificarValidade(idAtual,idMes,idAno,idErro){
	if(idAtual.includes('m')){ 
		if($('#'+idAno).val()=='0'){
			return;
			}
	 }
	resposta = '';
	mes = $('#'+idMes).val();
	ano = $('#'+idAno).val();
	$.ajax({
		url: $('#caminhoBase').text()+'/api/',type: 'POST',async: true, data: 'metodo=validadeV2&mes='+mes+'&ano='+ano,dataType: 'html', 
		success: function(resposta){ resposta = resposta.trim(); 
			if(resposta.length>4){
				$('#'+idErro).html(resposta);
				}else{
					$('#'+idErro).html("&nbsp;");
					}
			}
		});
	return resposta;
	}



//AVALIAÇÕES
function avaliação(id,fullid,ação){
	corForte = $('#corForte').text();
	corFraca = $('#corFraca').text();
	
	corLike = $('#corLike'+id).css('color');
	corUnlike = $('#corUnlike'+id).css('color');
	
	likes = $('#likes'+id).text();
	unlikes = $('#unlikes'+id).text();
	
	$.ajax({
		url: $('#caminhoBase').text()+'/api/',type: "POST",async: true,data: 'metodo=avaliação&id='+id+'&fullid='+fullid+'&ação='+ação+'&corForte='+corForte+'&corFraca='+corFraca+'&corLike='+corLike+'&corUnlike='+corUnlike+'&likes='+likes+'&unlikes='+unlikes,dataType: "html",
		success: function(resposta){ resposta = resposta.trim();	
			/* console.log(resposta); */
			resposta = resposta.split('|');
			$('#likes'+id).text(resposta[0]);
			$('#unlikes'+id).text(resposta[1]);
			
			$('.corLike'+id).css('color',resposta[2]);
			$('#corLike'+id).css('color',resposta[2]);
			$('#botaoLike'+id).css('border-color',resposta[2]);
			
			$('.corUnlike'+id).css('color',resposta[3]);
			$('#corUnlike'+id).css('color',resposta[3]);
			$('#botaoUnlike'+id).css('border-color',resposta[3]);

			}
		});
	return;
	}
function buscarCep(id,proximoCampo,proximoId,campo1,campo2,campo3,campo4,idEntrega){
	loading();
	cep = $('#'+id).val();
	setTimeout(function(){
		if(cep.length<8 || cep.length>9){ $('#erroCepEntrega').html('CEP Inválido');loading();return; }
		$('#erroCepEntrega').html("&nbsp;");
		$.ajax({
			url: $('#caminhoBase').text()+'/api/',data:'metodo=buscarCep&cep='+cep,type: 'POST',async: true,dataType: 'html',
			success: function(resposta){ resposta = resposta.trim();
				console.log(resposta);
				$('#'+proximoCampo).show(250);
				resposta = resposta.split('|');
				$('#'+campo1).val(resposta[0]);
				$('#'+campo2).val(resposta[1]);
				$('#'+campo3).val(resposta[2]);
				estado = resposta[3];
				estado = estado.trim();
				$('#'+campo4).val(estado);
				$('#'+proximoId).focus();
				$('#'+idEntrega+'0').click();
				loading();	
				}
			 });
		},1000);
	 
	return;
	}
function irParaCategoria(categoria){
	set_cookie('busca',categoria);
	set_cookie('tipoDeBusca','categorias');
	irPara('buscar');
	return;
	}
function montar_layout(){
	let layout = JSON.parse(get_cookie('layout'));
	
	try{
		document.title = layout.titulo;
	}catch(erro){
		console.log(erro);
	}
	try{
		let itens = document.querySelectorAll('.nome_da_loja');
		for(let item of itens){
			item.innerText = layout.nome;
		}
	}catch(erro){
		console.log(erro);
	}
	try{
		document.getElementById('favicon_do_site').setAttribute('href',layout.favicon);
	}catch(erro){
		console.log(erro);
	}
	try{
		let itens = document.querySelectorAll('.logo_da_loja');
		for(let item of itens){
			item.setAttribute('src',layout.logo);
		}
	}catch(erro){
		console.log(erro);
	}
	try{
		let itens = document.querySelectorAll('.cnpj_da_empresa');
		for(let item of itens){
			item.innerText =`${layout.empresa} ${layout.cnpj} ${layout.endereço}`;
		}
	}catch(erro){
		console.log(erro);
	}

	return;
}

window.onload = ()=>{
	//AVISO DE COOKIES
	if(get_cookie('avisoDeCookies')!='aceito'){ $('#avisoDeCookies').css('display','block'); }else{ $('#avisoDeCookies').fadeOut();}	

	//FILTROS INPUT
	//login
	$('#nomeCompletoCadastro').keyup(function(){ 
		nomeCompleto = $('#nomeCompletoCadastro').val();
		if(nomeCompleto.includes(' ')){
			nomeCompleto = nomeCompleto.split(' ');
			if(nomeCompleto[0].length>2 && nomeCompleto[1].length>2){ $('#erroNomeCompletoCadastro').html("&nbsp;"); }
			}
		});
	$('#emailCadastro').keyup(function(){ 
		email = $('#emailCadastro').val();
		if(email.includes('@') && email.includes('.')){ $('#erroEmailCadastro').html("&nbsp;"); }
		});
	//endereço(entrega)
	$('#logradouroEntrega').keyup(function(){ 
		logradouro = $('#logradouroEntrega').val();
		if(logradouro.length>2){ $('#erroLogradouroEntrega').html("&nbsp;"); }
		});
	$('#numeroEntrega').keyup(function(){ 
		numero = $('#numeroEntrega').val();
		if(numero.length!=0){ $('#erroNumeroEntrega').html("&nbsp;"); }
		});
	$('#bairroEntrega').keyup(function(){ 
		bairro = $('#bairroEntrega').val();
		if(bairro.length>2){ $('#erroBairroEntrega').html("&nbsp;"); }
		});
	$('#cidadeEntrega').keyup(function(){ 
		cidade = $('#cidadeEntrega').val();
		if(cidade.length>2){ $('#erroCidadeEntrega').html("&nbsp;"); }
		});
	$('#estadoEntrega').keyup(function(){ 
		estado = $('#estadoEntrega').val();
		if(estado.length<3){ $('#erroEstadoEntrega').html("&nbsp;"); }
		});

	document.addEventListener("keypress", (e) => {
		if(e.key==="Enter"){
			if($('#buscar').val().length>0 && get_cookie('paginaAtual')!='login' && get_cookie('paginaAtual')!='endereço' && get_cookie('paginaAtual')!='pagamento'){
				set_cookie('busca',$('#buscar').val());
				set_cookie('tipoDeBusca','produtos');
				irPara('buscar');
				}
			}
		});
	}