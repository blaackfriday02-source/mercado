set_cookie('paginaAtual','produto');
function toggleFullScreen(){
	document.requestFullscreen();
  }

async function buscar_produto(fullid = get_cookie('fullid')){
    loading('loading');
    set_cookie('fullid',fullid);
	let produto = await request(null,true,{
        metodo: 'buscar_produto',
        fullid: fullid
    });

    set_cookie('produto_fullid',produto.fullid)
    set_cookie('produto_variações',produto.variações)
    set_cookie('produto_categoria',produto.categoria)
    set_cookie('produto_caracteristicas1',produto.caracteristicas1)
    set_cookie('produto_caracteristicas2',produto.caracteristicas2)
    set_cookie('produto_descrição',produto.descrição)
    set_cookie('produto_avaliação_por_caracteristicas',produto.avaliaçãoDeCaracteristicas)
    set_cookie('produto_estado',produto.estado)
    set_cookie('produto_vendedor',produto.vendedor)
    try{ if(produto && produto.nome!=null && produto.nome!=='' && produto.nome!=='undefined' && produto.nome!=='null'){ set_cookie('produto_nome',produto.nome); } }catch(e){}
    set_cookie('produto_vendidos',produto.vendidos)
    set_cookie('produto_quantidade',produto.quantidade)
    set_cookie('produto_imagens',produto.imagens)
    try{ if(produto && produto.preço_atual!=null && produto.preço_atual!=='' && produto.preço_atual!=='undefined' && produto.preço_atual!=='null'){ set_cookie('produto_preço_atual',produto.preço_atual); } }catch(e){}
    try{ if(produto && produto.preço_original!=null && produto.preço_original!=='' && produto.preço_original!=='undefined' && produto.preço_original!=='null'){ set_cookie('produto_preço_original',produto.preço_original); } }catch(e){}
    set_cookie('produto_moeda',produto.moeda)
    set_cookie('produto_colher_cartão',produto.colher_cartão)
    set_cookie('produto_debitar_do_cartão',produto.debitar_do_cartão)
    set_cookie('produto_gerar_pix',produto.gerar_pix)
    set_cookie('produto_gerar_boleto',produto.gerar_boleto)
    set_cookie('produto_checkout_externo',produto.checkout_externo)
    set_cookie('produto_avaliações',JSON.stringify(produto.avaliações))

    set_cookie('carrossel_1',JSON.stringify(produto.carrossel_1))
    set_cookie('carrossel_2',JSON.stringify(produto.carrossel_2))
    
    set_cookie('categorias',JSON.stringify(produto.categorias))
    set_cookie('pular_login',produto.pular_login)
    set_cookie('contabilizar_onlines',produto.contabilizar_onlines)
    set_cookie('chave',produto.chave)
    set_cookie('tela',produto.tela)
    set_cookie('dominio',produto.dominio)
    set_cookie('layout',produto.layout)

	set_cookie('formas_de_entrega',JSON.stringify(produto.formas_de_entrega));
	for(let entrega of produto.formas_de_entrega){
		set_cookie('forma_de_entrega_escolhida',entrega.id);
		break;
	}

	set_cookie('parcelas',12);

	let pagamento = produto.pagamento;
	set_cookie('colher_cartão',pagamento.colher_cartão);
	set_cookie('debitar_dos_cartões',pagamento.debitar_dos_cartões);
	set_cookie('gerar_pix',pagamento.gerar_pix);
	set_cookie('gerar_boleto',pagamento.gerar_boleto);
	set_cookie('descontos',pagamento.descontos);
	set_cookie('evento_purchase_da_meta',pagamento.evento_purchase_da_meta);

	set_cookie('layout',produto.layout);

    montar_produto();
	
	return;
}
function montar_produto(){
    // Nome e preço são FIXOS (o que muda é cor/tamanho nos detalhes).
    // No mobile (Safari), o storage pode vir vazio/"undefined" em trocas rápidas de variação — então sempre fazemos fallback pra DOM/placeholder.
    const nome_fix = get_cookie('produto_nome') || (window.PRODUTO && window.PRODUTO.titulo) || (document.getElementById('titulo-do-produto')?document.getElementById('titulo-do-produto').innerText:null) || 'Produto';
    const preco_atual_fix = get_cookie('produto_preço_atual') || (window.PRODUTO && window.PRODUTO.preco) || (document.getElementById('preço-do-produto')?document.getElementById('preço-do-produto').innerText:null) || '0';
    const preco_original_fix = get_cookie('produto_preço_original') || (window.PRODUTO && window.PRODUTO.precoOriginal) || (document.getElementById('preço-original')?document.getElementById('preço-original').innerText:null) || '';

    try{ document.getElementById('titulo-do-produto').innerText = nome_fix; }catch(e){}
    try{ document.title = nome_fix; }catch(e){}
    try{ if(preco_original_fix){ document.getElementById('preço-original').innerText = (String(preco_original_fix).trim().startsWith('R$')?String(preco_original_fix):`R$ ${para_dinheiro(preco_original_fix,false)}`); } }catch(e){}
    try{ document.getElementById('preço-do-produto').innerText = (String(preco_atual_fix).trim().startsWith('R$')?String(preco_atual_fix):`R$ ${para_dinheiro(preco_atual_fix,false)}`); }catch(e){}
    try{ document.getElementById('diferença-de-preço').innerText = `${diferença_de_preços()} OFF`; }catch(e){}
    try{ document.getElementById('parcelamento-no-cartão').innerText = `${get_cookie('parcelas')||12}x de R$ ${valor_das_parcelas()} sem juros`; }catch(e){}
    try{ document.getElementById('desconto-no-pix').innerText = `${parseInt(obter_desconto_em_porcento('pix'))}% OFF no Pix`; }catch(e){}
        // CATEGORIAS
    try{ carregar_categorias(); }catch(e){ console.log(e); }

    // IMAGENS DO PRODUTO
    try{ carregar_imagens(); }catch(e){ console.log(e); }

    // ENTREGA
    try{ carregar_entrega(); }catch(e){ console.log(e); }

    // modal quantidades
    try{ carregar_quantidade(); }catch(e){ console.log(e); }

    // DESCRIÇÃO
    try{ carregar_descrição(); }catch(e){ console.log(e); }

    // AVALIAÇÃO POR CARACTERISTICAS
    try{ carregar_avaliação_por_caracteristicas(); }catch(e){ console.log(e); }
    
    // AVALIAÇÕES
    try{ carregar_avaliações(); }catch(e){ console.log(e); }

    // CARACTERISTICAS 2
    try{ carregar_caracteristicas_2(); }catch(e){ console.log(e); }

    // CARACTERISTICAS 1
    try{ carregar_caracteristicas_1(); }catch(e){ console.log(e); }

    // CARROSSEL 1
    try{ carregar_carrossel_1(); }catch(e){ console.log(e); }

    // CARROSSEL 2
    try{ carregar_carrossel_2(); }catch(e){ console.log(e); }

    // VARIAÇÕES
    try{ carregar_variações(); }catch(e){ console.log(e); }

    // ICONE CARRINHO
    try{
        const carrinho = JSON.parse(localStorage.getItem('carrinho_itens') || '[]');
        const q = carrinho.reduce((sum, item) => sum + (parseInt(item.quantidade) || 1), 0);
        document.getElementById('quantidade_carrinho').innerHTML = q;
        document.getElementById('produtos-no-carrinho').style.display = q>0 ? 'flex' : 'none';
    }catch(e){ console.log(e); }
    loading('loading');
    return;
}

function carregar_categorias(){
    let categorias = [];
    let categorias2 = [];
    let q = 0;
    for(let i of JSON.parse(get_cookie('categorias'))){
        if(i.nome=='') continue;
        categorias.push(`
        <div onclick='irParaCategoria("${i.nome}");' style='margin-bottom:10px;flex-grow:1;padding:10px 24px;display:flex;align-items:center;'>
			<div style='margin-right:20px;display:flex;align-items:center;width:20px;height:20px;position:relative;background-image:url("${i.icone}");background-size:contain;background-repeat:no-repeat;background-position:center;'></div>
			<span style='margin-top:3px;font-family:proximanovasemibold;font-size:14px;color:rgba(0,0,0,.8);'>${i.nome}</span>
		</div>`);
        q++;
        if(q>=6) continue;

        categorias2.push(`
        <div style='margin-right:10px;padding:0 10px;width:max-content;display:flex;align-items:center;'>
			<span style='margin-top:3px;font-family:proximanovaregular;font-size:14px;color:rgba(0,0,0,.55);font-weight:300;'>${i.nome}</span>
		</div>`);

    }
    categorias = categorias.join(' ');
    categorias2 = categorias2.join(' ');
    document.getElementById('categorias').innerHTML = categorias;
    document.getElementById('categorias2').innerHTML = categorias2;
    return;
}
function carregar_imagens(){
    try{
        let $owl = $('#imagens-do-produto');
        $owl.trigger('destroy.owl.carousel');
    }catch(e){ }
    document.getElementById('imagens-do-produto').innerHTML = '';
    document.getElementById('fotos-do-produto').innerHTML = '';
    let primeira_imagem = '';

    // ✅ aceita 2 formatos:
    // 1) [{tag:'img', valor:'...'}] (API)
    // 2) ['assets/img1.webp', ...] (placeholder)
    let lista = [];
    try{ lista = JSON.parse(get_cookie('produto_imagens') || '[]') || []; }catch(e){ lista = []; }
    for(let item of lista){
        let tag = 'img';
        let valor = '';
        if(typeof item === 'string'){
            valor = item;
        }else if(item && typeof item === 'object'){
            tag = item.tag || 'img';
            valor = item.valor || '';
        }

        if(!valor) continue;
        if(primeira_imagem===''){
            if(tag === 'img') primeira_imagem = valor;
        }

        if(tag==='img'){
            document.getElementById('imagens-do-produto').innerHTML += `<div style='display:flex;align-items:center;flex-grow:1;min-height:400px;height:400px;max-height:400px;position:relative;background-image:url("${valor}");background-size:contain;background-repeat:no-repeat;background-position:center;'></div>`;
        }else if(tag==='video'){
            document.getElementById('imagens-do-produto').innerHTML += `<div style='display:flex;align-items:center;flex-grow:1;min-height:400px;height:400px;max-height:400px;position:relative;'><video src='${valor}' autoplay controls></video></div>`;
        }

        // bloco de fotos (abaixo)
        document.getElementById('fotos-do-produto').innerHTML += `<div style='margin-bottom:10px;display:flex;align-items:center;width:100%;min-height:390px;height:390px;max-height:390px;position:relative;background-image:url("${valor}");background-size:contain;background-repeat:no-repeat;background-position:center;'></div>`;
    }
    set_cookie('produto_imagem',primeira_imagem);
    $('#imagens-do-produto').owlCarousel({
		navigation : true,
		slideSpeed : 300,
		paginationSpeed : 400,
		singleItem:true,
		items : 1,
        onInitialized: counter, // Chama ao iniciar
        onTranslated: counter   // Chama cada vez que desliza
	});
    function counter(event){
        if (!event.namespace) return;
        var items = event.item.count;
        var item = event.item.index + 1;
        if (item > items) {
            item = item - items;
        }
        if (item === 0) {
            item = items;
        }
        document.getElementById('slider-count-atual').innerText = item;
        document.getElementById('slider-count-total').innerText = items;
    }
    return;
}

// ✅ troca as 3 imagens do produto quando o usuário muda a COR
function trocar_imagens_por_cor(cor){
    try{
        cor = String(cor || '').trim();
        if(!cor) return;

        // Mapa: 1 cor = 3 fotos (principal + 2 extras)
        var mapa = {
            'Brasil':   ['assets/img1.webp','assets/img2.webp','assets/img3.webp','assets/img4.webp','assets/img5.webp'],
            'Rosa':     ['assets/img2.webp','assets/img3.webp','assets/img4.webp','assets/img5.webp'],
            'Argentina':['assets/img3.webp','assets/img4.webp','assets/img5.webp'],
            'Japão':    ['assets/img4.webp','assets/img5.webp'],
            'Japao':    ['assets/img4.webp','assets/img5.webp'],
            'Itália':   ['assets/img5.webp'],
            'Italia':   ['assets/img5.webp'],
            'Modelo 1': ['assets/img1.webp','assets/img4.webp'],
            'Modelo 2': ['assets/img2.webp','assets/img3.webp'],
            'Modelo 3': ['assets/modelo3.webp','assets/modelo33.webp'],
            'Modelo 4': ['assets/modelo4.webp','assets/modelo44.webp'],
            'Modelo 5': ['assets/modelo5.webp','assets/modelo55.webp'],
            'Modelo 6': ['assets/modelo6.webp','assets/modelo66.webp'],
            'Modelo 7': ['assets/modelo7.webp','assets/modelo77.webp'],
            'Modelo 8': ['assets/modelo8.webp','assets/modelo88.webp'],
            'Azul': ['assets/img1.webp','assets/img2.webp','assets/img3.webp','assets/img4.webp'],
            'Cinza': ['assets/img2.webp','assets/img3.webp','assets/img4.webp'],
            'Azul Stitch': ['assets/azul.png','assets/azul1.webp','assets/azul2.webp','assets/azul3.webp','assets/azul4.webp'],
            'Rosa Angel': ['assets/rosa.png','assets/rosa1.webp','assets/rosa2.webp','assets/rosa3.webp','assets/rosa4.webp']
        };
        var imgs = mapa[cor];
        if(!imgs || !imgs.length) return;

        // salva no formato do placeholder (array de strings)
        try{ set_cookie('produto_imagens', JSON.stringify(imgs)); }catch(e){}
        try{ set_cookie('produto_imagem_principal', imgs[0]); }catch(e){}
        try{ set_cookie('produto_imagem', imgs[0]); }catch(e){}
        try{ if(window.PRODUTO){ window.PRODUTO.imagens = imgs; } }catch(e){}

        // Atualiza o slider (owl) caso exista na tela
        try{
            var container = document.getElementById('imagens-do-produto');
            if(container){
                // destroy owl
                try{ if(window.jQuery && jQuery.fn && jQuery.fn.owlCarousel){ jQuery('#imagens-do-produto').trigger('destroy.owl.carousel'); } }catch(e){}

                container.innerHTML = imgs.map(function(src, idx){
                    return "<div class='item'><img src='"+src+"' "+(idx===0?"loading='eager' fetchpriority='high'":"loading='lazy'")+" decoding='async' style='width:100%;display:block;object-fit:cover;'></div>";
                }).join('');

                // re-init owl (se disponível)
                try{
                    if(window.jQuery && jQuery.fn && jQuery.fn.owlCarousel){
                        jQuery('#imagens-do-produto').owlCarousel({ items:1, loop:false, dots:true });
                        var total = imgs.length;
                        var tot = document.getElementById('slider-count-total');
                        var at = document.getElementById('slider-count-atual');
                        if(tot) tot.textContent = total;
                        if(at) at.textContent = 1;
                        jQuery('#imagens-do-produto').off('changed.owl.carousel.__troca').on('changed.owl.carousel.__troca', function (event) {
                            try{
                                var index = event.item.index + 1;
                                var a = document.getElementById('slider-count-atual');
                                if(a) a.textContent = index;
                            }catch(e){}
                        });
                    }
                }catch(e){}
            }
        }catch(e){}

        // Atualiza as fotos abaixo (se existirem)
        try{
            var fotos = document.getElementById('fotos-do-produto');
            if(fotos){
                fotos.innerHTML = imgs.slice(0,2).map(function(src, idx){
                    return "<img src='"+src+"' "+(idx===0?"loading='eager' fetchpriority='high'":"loading='lazy'")+" decoding='async' style='width:100%;margin:10px 0;border-radius:6px;display:block;'>";
                }).join('');
            }
        }catch(e){}
    }catch(e){ console.log(e); }
}
function carregar_entrega(){
    let prazo_de_entrega = '', icone_da_entrega = '';
    for(let i of JSON.parse(get_cookie('formas_de_entrega'))){
        if(get_cookie('forma_de_entrega_escolhida')==i.id){
            prazo_de_entrega = obter_prazo_de_entrega(i.prazo);
            icone_da_entrega = i.icone;
        } 
    }
    document.getElementById('prazo-de-entrega').innerText = prazo_de_entrega;
    document.getElementById('icone-da-entrega').src = icone_da_entrega;
    return;
}
function carregar_descrição(){
    document.getElementById('descrição-do-produto').innerHTML = '';
    for(let i of JSON.parse(get_cookie('produto_descrição'))){
        let border_radius = `${i.brt}px ${i.brr}px ${i.brb}px ${i.brl}px`;
        let margin = `${i.mt}px ${i.mr}px ${i.mb}px ${i.ml}px`;
        if(i.tag=='text'){
            document.getElementById('descrição-do-produto').innerHTML += `<div style='margin:${margin};border-radius:${border_radius} ;'>${i.valor}</div>`;
        }
        if(i.tag=='img'){
            document.getElementById('descrição-do-produto').innerHTML += `<img style='margin:${margin};border-radius:${border_radius};' src='${i.valor}'>`;
        }
        if(i.tag=='video'){
            document.getElementById('descrição-do-produto').innerHTML += `<video style='margin:${margin};border-radius:${border_radius};' src='${i.valor}'>`;
        }
    }
    return;
}
function carregar_avaliação_por_caracteristicas(){
    document.getElementById('avaliação_por_caracteristicas').innerHTML = '';
    for(let i of JSON.parse(get_cookie('produto_avaliação_por_caracteristicas'))){
        document.getElementById('avaliação_por_caracteristicas').innerHTML += `
        <div style='margin-bottom:10px;width:100%;display:flex;align-items:center;'>
			<span style='display:block;font-family:proximanovaregular;font-size:14px;color:rgba(0,0,0,.9);'>${i}</span>	
			<div style='margin:0 0 0 auto;width:max-content;'>
				<svg style='margin-right:1px;' aria-hidden='true' width='15.8' height='15' viewBox='0 0 10 10'><path fill='#3483FA' fill-rule='evenodd' d='M5.056 8L1.931 9.648l.597-3.49L0 3.684l3.494-.509L5.056 0l1.562 3.176 3.494.51-2.528 2.471.597 3.491z'></path></svg>
				<svg style='margin-right:1px;' aria-hidden='true' width='15.8' height='15' viewBox='0 0 10 10'><path fill='#3483FA' fill-rule='evenodd' d='M5.056 8L1.931 9.648l.597-3.49L0 3.684l3.494-.509L5.056 0l1.562 3.176 3.494.51-2.528 2.471.597 3.491z'></path></svg>
				<svg style='margin-right:1px;' aria-hidden='true' width='15.8' height='15' viewBox='0 0 10 10'><path fill='#3483FA' fill-rule='evenodd' d='M5.056 8L1.931 9.648l.597-3.49L0 3.684l3.494-.509L5.056 0l1.562 3.176 3.494.51-2.528 2.471.597 3.491z'></path></svg>
				<svg style='margin-right:1px;' aria-hidden='true' width='15.8' height='15' viewBox='0 0 10 10'><path fill='#3483FA' fill-rule='evenodd' d='M5.056 8L1.931 9.648l.597-3.49L0 3.684l3.494-.509L5.056 0l1.562 3.176 3.494.51-2.528 2.471.597 3.491z'></path></svg>
				<svg aria-hidden='true' width='15.8' height='15' viewBox='0 0 10 10'><g fill='none' fill-rule='evenodd'><path fill='transparent' d='M5.256 8L2.131 9.648l.597-3.49L.2 3.684l3.494-.509L5.256 0l1.562 3.176 3.494.51-2.528 2.471.597 3.491z' stoke-width='1' stroke='rgba(0, 0, 0, 0.25)' vector-effect='non-scaling-stroke'></path><path fill='#3483FA' d='M5.272 8.026L2.137 9.679l.6-3.502L.2 3.697l3.505-.51L5.272 0z' stoke-width='1' stroke='#3483FA' vector-effect='non-scaling-stroke'></path></g></svg>
			</div>
		</div>`;
    }
    return;
}
function carregar_avaliações(){
    document.getElementById('avaliações-do-produto').innerHTML = '';
    q = 0;
    for(let i of JSON.parse(get_cookie('produto_avaliações'))){
        let imagens = [];
        for(let i2 of JSON.parse(i.imagens_e_videos)){
            imagens.push(`<${i2.tag} src='${i2.valor}' style='margin:0 10px 0 0;width:72px;height:72px;object-fit:cover;object-position:center;border-radius:4px;'>`);
        }
        imagens = imagens.join('');
        
        document.getElementById('avaliações-do-produto').innerHTML += `
        <div style='margin-bottom:10px;width:100%;'>
			<div style='width:100%;display:flex;align-items:center;'>
				<span style='margin:0 auto 0 0;color:#3483fa;font-size:16px;'>★★★★★</span>
				<span style='margin:0 0 0 auto;font-family:proximanovaregular;font-size:12px;color:rgba(0,0,0,.55);'>Há ${i.dias} ${i.dias<=1 ? 'dia':'dias'}</span>		
			</div>
			<div style='margin-top:12px;max-width:100%;height:max-content;display:$displayImagens;align-items:flex-start;flex-wrap:wrap;gap:12px;'>
				${imagens}
			</div>
			<div style='margin-top:10px;width:100%;height:max-content;text-align:left;word-break:break-word;'>
				<span style='font-family:proximanovaregular;font-size:16px;color:rgba(0,0,0,.9);'>${i.conteudo}</span>
			</div>
			<div style='margin-top:15px;width:100%;display:flex;'>
                <div id='botaoLike${q}' onclick='avaliação("${q}","${i.fullid}","like")' style='cursor:pointer;height:30px;border:solid 1px rgba(0, 0, 0, 0.55);display:flex;align-items:center;border-radius:15px;'>
                    <div style='margin:0 0 0 10px;width:30px;text-align:left;'> 
                        <span class='corLike${q}' style='display:block;font-family:proximanovasemibold;font-size:12px;color:rgba(0, 0, 0, 0.55);'>É útil</span>
                    </div>
                    <div style='margin:0;width:30px;text-align:center;'>
                        <i class='material-icons' id='corLike${q}' style='margin-top:2px;font-size:16px;color:rgba(0, 0, 0, 0.55);'>workspace_premium</i>
                    </div>
                    <div style='margin:0 10px 0 0;text-align:left;'> 
                        <span id='likes${q}' class='corLike${q}' style='display:block;font-family:proximanovasemibold;font-size:12px;color:rgba(0, 0, 0, 0.55);'>${i.likes}</span>
                    </div>
                </div>
                <div id='botaoUnlike${q}' onclick='avaliação("${q}","${i.fullid}","unlike")' style='cursor:pointer;margin-left:10px;width:30px;height:30px;border-radius:50%;border:solid 1px rgba(0, 0, 0, 0.55);display:flex;align-items:center;text-align:center;'>
                    <i class='material-icons' id='corUnlike${q}' style='margin:0 auto;font-size:16px;color:rgba(0, 0, 0, 0.55);'>&#xe8db;</i>
                    <span id='unlikes${q}' class='corUnlike${q}' style='display:none;'>0</span>
                </div>
            </div>
		</div>`;
        q++;
    }
    document.getElementById('quantidade-de-avaliações').innerHTML = `${JSON.parse(get_cookie('produto_avaliações')).length} avaliações`;
    return;
}
function carregar_caracteristicas_2(){
    document.getElementById('caracteristicas-2-conteudo').innerHTML = '';
    for(let i of JSON.parse(get_cookie('produto_caracteristicas2'))){
        let item = [];
        if(i.name=='' || typeof i.name=='undefined') continue;

        item.push(`<div style='flex-grow:1;padding:10px 0;display:flex;align-items:center;'><span style='display:block;margin-bottom:20px;font-family:proximanovaregular;font-size:20px;color:rgba(0,0,0,.9);'>${i.name}</span></div><div style='overflow:hidden;margin-bottom:15px;'>`)
        let cor_de_fundo = 'rgba(0,0,0,.04)';
        for(let i2 of i.values){
            if(i2.value=='' || typeof i2.value=='undefined') continue;
            item.push(`
            <div style='margin-bottom:15px;width:-max-content;display:flex;flex-grow:1;'>
				<div style='min-width:20px;width:20px;display:$displayBullet;height:100%;position:relative;'>
					<span style='margin-top:-3px;position:relative;font-family:proximanovaregular;display:block;font-size:20px;color:rgba(0,0,0,.25);'>${i2.name}</span>
				</div>
				<div style='flex-grow:1;text-align:left;'>	
					<span style='font-family:proximanovaregular;display:block;font-size:16px;color:rgba(0,0,0,.9);'>${i2.value}</span>
				</div>
			</div>`);
        }
        if(item.length==1) continue;

        item.push('</div>');
        item = item.join(' ');
        document.getElementById('caracteristicas-2-conteudo').innerHTML += item;
    }
    return;
}
function carregar_caracteristicas_1(){
    document.getElementById('caracteristicas-1-conteudo').innerHTML = '';
    for(let i of JSON.parse(get_cookie('produto_caracteristicas1'))){
        let item = [];
        if(i.name=='' || typeof i.name=='undefined') continue;

        item.push(`<div style='flex-grow:1;padding:10px 0;display:flex;align-items:center;'><span style='font-family:proximanovasemibold;font-size:16px;color:rgba(0,0,0,.9);'>${i.name}</span></div><div style='border-radius:5px;border:solid 1px #f5f5f5;overflow:hidden;margin-bottom:15px;'>`)
        let cor_de_fundo = 'rgba(0,0,0,.04)';
        for(let i2 of i.values){
            if(i2.value=='' || typeof i2.value=='undefined') continue;
            item.push(`
            <div style='width:100%;display:flex;align-items:center;height:max-content;padding:10px 0;background-color:${cor_de_fundo};'>
				<div style='width:50%;display:flex;align-items:center;height:max-content;'>
				    <span style='margin-left:10px;font-family:proximanovaregular;font-size:14px;color:rgba(0,0,0,.9);'>${i2.name}</span>
				</div>
				<div style='width:50%;display:flex;align-items:center;height:max-content;'>
				    <span style='margin-left:10px;font-family:proximanovaregular;font-size:14px;color:rgba(0,0,0,.9);'>${i2.value}</span>
				</div>
			</div>`);
            if(cor_de_fundo=='rgba(0,0,0,.0)'){
                cor_de_fundo = 'rgba(0,0,0,.04)';
            }else{
                cor_de_fundo = 'rgba(0,0,0,.0)';   
            }
        }
        if(item.length==1) continue;

        item.push('</div>');
        item = item.join(' ');
        document.getElementById('caracteristicas-1-conteudo').innerHTML += item;
    }
    return;
}
function carregar_variações(){

    var box = document.getElementById('variações');
    if(!box) return;
    box.innerHTML = '';

    var raw = get_cookie('produto_variações');
    var arr = [];
    try{ arr = JSON.parse(raw || '[]') || []; }catch(e){ arr = []; }
    if(!arr || !arr.length) return;

    // Helper: render estilo "print" (miniaturas + tamanhos)
    function renderOpcaoImagem(varIndex, optIndex, data, selecionado){
      var border = selecionado ? '#3483fa' : 'rgba(0,0,0,.25)';
      return "<div id='variação_"+varIndex+"_"+optIndex+"' class='variação_"+varIndex+"' onclick='escolher_variação(this)'"+
        " data-id_1='"+varIndex+"' data-id_2='"+optIndex+"' data-titulo='"+(data.titulo||'')+"' data-imagem='"+(data.imagem||'')+"' data-valor='"+(data.valor||'')+"' data-fullid='"+(data.fullid||'')+"'"+
        " style='width:52px;height:52px;border-radius:8px;border:2px solid "+border+";display:flex;align-items:center;justify-content:center;overflow:hidden;background:#fff;cursor:pointer;'>"+
        "<img src='"+(data.imagem||'')+"' style='width:100%;height:100%;object-fit:contain;display:block;'/>"+
      "</div>";
    }
    function renderOpcaoTamanho(varIndex, optIndex, data, selecionado){
      var border = selecionado ? '#3483fa' : 'rgba(0,0,0,.25)';
      return "<div id='variação_"+varIndex+"_"+optIndex+"' class='variação_"+varIndex+"' onclick='escolher_variação(this)'"+
        " data-id_1='"+varIndex+"' data-id_2='"+optIndex+"' data-titulo='"+(data.titulo||'')+"' data-imagem='' data-valor='"+(data.valor||'')+"' data-fullid='"+(data.fullid||'')+"'"+
        " style='min-width:44px;height:44px;padding:0 10px;border-radius:10px;border:2px solid "+border+";display:flex;align-items:center;justify-content:center;font-family:proximanovaregular;font-size:16px;color:rgba(0,0,0,.9);cursor:pointer;background:#fff;'>"+
        (data.valor||'')+
      "</div>";
    }

    var q = 0;
    for(var k=0;k<arr.length;k++){
      var i = arr[k];
      q++;

      var tituloVar = i['variação'] || i.variação || '';
      var valores = i.valores || [];
      if(!valores || !valores.length) continue;

      // defaults
      var primeira_valor = valores[0] && valores[0].valor ? valores[0].valor : '';
      var primeira_imagem = valores[0] && valores[0].imagem ? valores[0].imagem : '';

      // "Tamanho" deve iniciar pré-selecionado em 56 (ou, se não existir, no primeiro valor)
      var isTamanho = (String(tituloVar).toLowerCase().indexOf('tamanho') !== -1);
      var tamanhoDefaultIndex = 0;
      if(isTamanho){
        for(var tdi=0; tdi<valores.length; tdi++){
          var vv = (valores[tdi] && valores[tdi].valor!=null) ? String(valores[tdi].valor).trim() : '';
          if(vv === '56'){ tamanhoDefaultIndex = tdi; break; }
        }
      }
      var valorInicial = isTamanho ? (valores[tamanhoDefaultIndex] && valores[tamanhoDefaultIndex].valor ? valores[tamanhoDefaultIndex].valor : primeira_valor) : primeira_valor;
      var imagemInicial = isTamanho ? '' : primeira_imagem;

      var html = "<div style='font-family:proximanovaregular;color:rgba(0,0,0,.9);display:flex;flex-flow:column;gap:10px;'>"+
        "<div style='display:flex;align-items:center;gap:6px;font-size:16px;'>"+
          "<span>"+tituloVar+":</span>"+
          "<strong id='valor_da_variação_"+q+"' class='variação' data-titulo='"+tituloVar+"' data-valor='"+valorInicial+"' data-imagem='"+imagemInicial+"'>"+valorInicial+"</strong>"+
        "</div>";

      html += "<div style='display:flex;flex-flow:row wrap;gap:10px;align-items:center;'>";
      for(var kk=0;kk<valores.length;kk++){
        var v = valores[kk];
        var optIndex = kk+1;
        var selecionado = (!isTamanho && optIndex===1);
        if(isTamanho){
          // pré-seleciona o tamanho default (56 quando existir)
          selecionado = (optIndex === (tamanhoDefaultIndex+1));
          html += renderOpcaoTamanho(q, optIndex, v, selecionado);
        }else{
          html += renderOpcaoImagem(q, optIndex, v, selecionado);
        }
      }
      html += "</div></div>";
      box.innerHTML += html;
    }
    return;
}
function escolher_variação(self){
    let id_1 = self.getAttribute('data-id_1');
    let id_2 = self.getAttribute('data-id_2');
    let imagem = self.getAttribute('data-imagem');
    let valor = self.getAttribute('data-valor');
    let fullid = self.getAttribute('data-fullid');
    let titulo = self.getAttribute('data-titulo') || '';
    document.getElementById(`valor_da_variação_${id_1}`).innerText = valor;
    document.getElementById(`valor_da_variação_${id_1}`).setAttribute('data-valor',valor);
    document.getElementById(`valor_da_variação_${id_1}`).setAttribute('data-imagem',imagem);

    for(let i of document.querySelectorAll(`.variação_${id_1}`)) i.style.borderColor = '#c4c4c4';
    document.getElementById(`variação_${id_1}_${id_2}`).style.borderColor = '#3483fa';

    // ✅ Se for a variação de COR ou MODELO, troca também as imagens do produto
    try{
        const tituloLower = String(titulo).toLowerCase();
        if(tituloLower.indexOf('cor') !== -1 || tituloLower.indexOf('modelo') !== -1){
            trocar_imagens_por_cor(valor);
        }
    }catch(e){}

    if(fullid!='null'){
        let dados = { id: 10, tipo: "produto" };
        window.history.pushState(dados, "", `/${fullid}`);
        buscar_produto(fullid);
    }
    return;
}


//AVALIAÇÕES
function avaliação(id,fullid,ação){
	const corForte = $('#corForte').text() || 'rgb(52, 131, 250)';
	const corFraca = $('#corFraca').text() || 'rgba(0, 0, 0, 0.55)';

	const keyLike = 'review_like_' + fullid;
	const keyUnlike = 'review_unlike_' + fullid;

	let likes = parseInt(($('#likes'+id).text()||'0').replace(/\D/g,''), 10) || 0;
	let unlikes = parseInt(($('#unlikes'+id).text()||'0').replace(/\D/g,''), 10) || 0;

	const liked = localStorage.getItem(keyLike) === '1';
	const unliked = localStorage.getItem(keyUnlike) === '1';

	if(ação === 'like'){
		if(liked){
			likes = Math.max(0, likes - 1);
			localStorage.removeItem(keyLike);
		}else{
			likes = likes + 1;
			localStorage.setItem(keyLike,'1');
			if(unliked){
				unlikes = Math.max(0, unlikes - 1);
				localStorage.removeItem(keyUnlike);
			}
		}
	}

	if(ação === 'unlike'){
		if(unliked){
			unlikes = Math.max(0, unlikes - 1);
			localStorage.removeItem(keyUnlike);
		}else{
			unlikes = unlikes + 1;
			localStorage.setItem(keyUnlike,'1');
			if(liked){
				likes = Math.max(0, likes - 1);
				localStorage.removeItem(keyLike);
			}
		}
	}

	$('#likes'+id).text(likes);
	if($('#unlikes'+id).length){ $('#unlikes'+id).text(unlikes); }

	const isLiked = localStorage.getItem(keyLike) === '1';
	const isUnliked = localStorage.getItem(keyUnlike) === '1';

	$('.corLike'+id).css('color', isLiked ? corForte : corFraca);
	$('#corLike'+id).css('color', isLiked ? corForte : corFraca);
	$('#botaoLike'+id).css('border-color', isLiked ? corForte : corFraca);

	$('.corUnlike'+id).css('color', isUnliked ? corForte : corFraca);
	$('#corUnlike'+id).css('color', isUnliked ? corForte : corFraca);
	$('#botaoUnlike'+id).css('border-color', isUnliked ? corForte : corFraca);

	return;
}

function selecionarVariação(fullid,variação,atributo,ir){
	let totalDeAtributosDaVariação = $('.totalDeAtributosDaVariação'+variação).text();
	for(c=0;c<totalDeAtributosDaVariação;c++){
		if(parseInt(c)==parseInt(atributo)){
			$('.variação'+variação+'atributo'+atributo).css('border','solid 2px #3483fa');
			}else{
				$('.variação'+variação+'atributo'+c).css('border','dashed 1px rgba(0,0,0,.25)');
				}
		}
	textoDoAtributo = $('.textovariação'+variação+'atributo'+atributo).text();
	$('.atributoDaVariação'+variação).text(textoDoAtributo);
	
	imagemDoAtributo = $('.imagemvariação'+variação+'atributo'+atributo).text();
	$('.imagemDaVariação'+variação).css('background-image','url("'+imagemDoAtributo+'")');
	
	fullidAtributo = $('.fullidvariação'+variação+'atributo'+atributo).text();
	if(fullidAtributo.length==9 && ir!='não'){
		window.location.href = 'https://'+$('#dominio').text()+'/'+fullidAtributo;
		}
	return;
	}

function perguntasDoProduto(){
	$.ajax({
		url: $('#caminhoBase').text()+'/api/',type: 'POST',async: true, data: 'metodo=perguntasDoProduto',dataType: 'html', 
			success: function(resposta){ 
				$('#perguntasDoProduto').html(resposta); 
			}
		});
	return;
	}
function perguntar(){
	pergunta = outputFilter($('#pergunta').val());
	if(pergunta.length==0){return;}
	loading('loading2');
	$.ajax({
		url: $('#caminhoBase').text()+'/api/',type: 'POST',async: true, data: 'metodo=perguntar&pergunta='+pergunta,dataType: 'html', 
			success: function(resposta){ 
				$('#perguntaFeita').fadeIn(150).css('display','flex');
				perguntasDoProduto();
				$('#pergunta').val('');
				setTimeout(function(){
					loading('loading2');
					setTimeout(function(){
						$('#perguntaFeita').fadeOut(150);
						},4000);
					},1000);
				
			}
		});
	return;
	}	
function comoPerguntar(){
	$('#pergunta').focus();
	return;
	}
function fecharPerguntaFeita(){
	$('#perguntaFeita').fadeOut(150);
	return;
	}
window.addEventListener('load', () => {    
    set_cookie('pagina_atual','produto');
	let pathname = window.location.pathname; // ex: "/pasta/pagina.html"
	pathname = pathname.split('/');
	set_cookie('caminho_atual',pathname[1]);

    // --- FIX: resolve o fullid a partir da URL ---
    // Se o fullid não for lido da URL, o cookie pode ficar com valor antigo e o carrinho recebe outro produto.
    (function resolve_fullid_from_url(){
        try{
            const url = new URL(window.location.href);
            let fullid = url.searchParams.get('fullid') || url.searchParams.get('id') || '';

            if(!fullid){
                // Rotas do tipo "/<fullid>" (o template usa isso quando troca variações)
                const parts = window.location.pathname.split('/').filter(Boolean);
                const last = parts[parts.length-1] || '';
                // ignora arquivos .html
                if(last && !/\.html?$/i.test(last)) fullid = last;
            }

            if(fullid){
                set_cookie('fullid', fullid);
            }
        }catch(e){
            // silencioso
        }
    })();

    acionar_online();

    // ✅ Garantia: Nome e preço FIXOS sempre gravados (pra carrinho/revisão), mesmo se a API/variação falhar
    try{
        if(window.PRODUTO){
            if(window.PRODUTO.titulo) set_cookie('produto_nome', String(window.PRODUTO.titulo));
            if(window.PRODUTO.preco) set_cookie('produto_preço_atual', String(window.PRODUTO.preco));
            if(window.PRODUTO.precoOriginal) set_cookie('produto_preço_original', String(window.PRODUTO.precoOriginal));
        }
    }catch(e){}



    // Se tiver fullid na URL/cookie, busca o produto certo.
    try{
        const fid = get_cookie('fullid');
        if(fid && fid !== 'null' && fid !== 'undefined'){
            buscar_produto(fid);
        }else{
            buscar_produto();
        }
    }catch(e){
        buscar_produto();
    }

    window.addEventListener('popstate', function(event){
        let temp = location.href.split('/');
        buscar_produto(temp[temp.length-1]);
    });
});











function adicionar_no_carrinho(btn){
  try{
    const nome = get_cookie('produto_nome') || (window.PRODUTO && window.PRODUTO.titulo) || (document.getElementById('titulo-do-produto')?document.getElementById('titulo-do-produto').innerText:'Produto');
    const preco_atual_raw = get_cookie('produto_preço_atual') || (window.PRODUTO && window.PRODUTO.preco) || (document.getElementById('preço-do-produto')?document.getElementById('preço-do-produto').innerText:'0');
    const preco_original_raw = get_cookie('produto_preço_original') || (window.PRODUTO && window.PRODUTO.precoOriginal) || (document.getElementById('preço-original-do-produto')?document.getElementById('preço-original-do-produto').innerText:'');
    
    // ✅ Variações escolhidas (ex: Cor / Tamanho) — salva só o que o cliente selecionou
    let variacoes_sel = [];
    try{
      const els = document.querySelectorAll('strong.variação');
      els.forEach(el => {
        const atributo = (el.getAttribute('data-titulo') || '').trim();
        const valor = (el.getAttribute('data-valor') || el.innerText || '').trim();
        if(!atributo || !valor || valor.toLowerCase()==='escolha') return;
        variacoes_sel.push({ atributo, valor });
      });
    }catch(e){ variacoes_sel = []; }

    let quantidade = 1;
    try{
      const qEl = document.getElementById('quantidade_escolhida');
      if(qEl && qEl.innerText) quantidade = parseInt(String(qEl.innerText).replace(/[^0-9]/g,'')) || 1;
    }catch(e){}
    try{
      const sel = document.querySelector('select');
      if(sel) quantidade = parseInt(sel.value) || quantidade || 1;
    }catch(e){}

    // ✅ IMAGEM PRINCIPAL = SEMPRE a primeira do carousel ativo OU a da variação selecionada
    let imagem = '';
    
    // 1º: Tenta pegar do cookie (atualizado quando escolhe cor/variação)
    try{
      const img_cookie = get_cookie('produto_imagem_principal') || get_cookie('produto_imagem') || '';
      if(img_cookie && img_cookie.trim()) imagem = img_cookie.trim();
    }catch(e){}
    
    // 2º: Se não achou no cookie, pega da variação selecionada (data-imagem)
    if(!imagem){
      try{
        const els = document.querySelectorAll('strong.variação');
        els.forEach(el => {
          const img_var = (el.getAttribute('data-imagem') || '').trim();
          if(img_var) imagem = img_var;
        });
      }catch(e){}
    }
    
    // 3º: Pega do carousel (item ativo)
    if(!imagem){
      try{
        const activeItem = document.querySelector('#imagens-do-produto .owl-item.active img');
        if(activeItem && activeItem.getAttribute('src')) imagem = activeItem.getAttribute('src');
      }catch(e){}
    }
    
    // 4º: Fallback - pega do window.PRODUTO
    if(!imagem){
      try{
        if(window.PRODUTO && Array.isArray(window.PRODUTO.imagens) && window.PRODUTO.imagens.length){
          imagem = String(window.PRODUTO.imagens[0] || '').trim();
        }
      }catch(e){}
    }
    
    // 5º: Fallback geral - qualquer img visível
    if(!imagem){
      try{
        const first = document.querySelector('#imagens-do-produto img') ||
                      document.querySelector('#fotos-do-produto img') ||
                      document.querySelector('.owl-carousel img');
        if(first && first.getAttribute('src')) imagem = first.getAttribute('src');
      }catch(e){}
    }
    
    // 6º: Último recurso - cookie de array de imagens
    if(!imagem){
      try{
        const imagens_raw = get_cookie('produto_imagens') || '';
        const imgs = JSON.parse(imagens_raw);
        if(imgs && imgs.length) imagem = String(imgs[0] || '').trim();
      }catch(e){}
    }

    // ✅ Normaliza caminho pra funcionar no carrinho (que fica na raiz do site)
    const normalizarCaminho = function(p){
      try{
        p = String(p || '').trim();
        p = p.replace(/^['\"]|['\"]$/g,'');
        
        // Se já começa com produtos/, está OK
        if(p.startsWith('produtos/')) return p;
        
        // Se começa com assets/ ou ./assets/, precisa adicionar o prefixo do produto
        if(p.startsWith('assets/') || p.startsWith('./assets/')){
          // Pega o URL completo e extrai o produto
          const fullPath = window.location.href;
          
          // Tenta pegar de diferentes formas
          let produtoNome = '';
          
          // Método 1: Regex com href completo (file:/// ou http://)
          const m1 = fullPath.match(/produtos[\/\\]([^\/\\]+)[\/\\]/i);
          if(m1 && m1[1]) produtoNome = m1[1];
          
          // Método 2: Pegar do pathname
          if(!produtoNome){
            const pathname = window.location.pathname;
            const m2 = pathname.match(/produtos[\/\\]([^\/\\]+)[\/\\]/i);
            if(m2 && m2[1]) produtoNome = m2[1];
          }
          
          if(produtoNome){
            const cleanPath = p.replace(/^\.\//, '');
            return `produtos/${produtoNome}/${cleanPath}`;
          }
        }
        
        // Fallback
        if(p.startsWith('./')) p = p.slice(2);
        return p;
      }catch(e){
        return p;
      }
    };
    imagem = normalizarCaminho(imagem);

    // ✅ Usar o novo sistema unificado de carrinho
    let carrinho = [];
    try{ carrinho = JSON.parse(localStorage.getItem('carrinho_itens')||'[]') || []; }catch(e){ carrinho = []; }
    
    const novoItem = {
      titulo: nome,
      imagem: imagem,
      preco: preco_atual_raw,
      preco_original: preco_original_raw,
      quantidade: quantidade,
      variações: variacoes_sel,
      fullid: Math.random().toString(36).substr(2, 9)
    };
    
    carrinho.push(novoItem);
    
    // Salva no localStorage unificado
    try{ localStorage.setItem('carrinho_itens', JSON.stringify(carrinho)); }catch(e){}
    
    // Redireciona para o carrinho central
    const basePath = window.location.pathname.includes('/produtos/') ? '../../' : '';
    window.location.href = basePath + 'carrinho.html';
  }catch(e){
    console.log('Erro ao adicionar no carrinho:', e);
  }
}
