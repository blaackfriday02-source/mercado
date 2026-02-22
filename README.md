# Loja de Relógios (Template)

Este template já vem com:
- A mesma estrutura visual do modelo (HTML + CSS do `tela/`)
- Fontes `.woff2` locais em `api/fontes/` (Proxima Nova + ícones)
- Owl Carousel incluso (slider de imagens)
- Um `data/placeholder.js` só pra preencher o layout com dados fictícios

## Como rodar local (sem dor de cabeça)
1) Abra esta pasta no VSCode
2) Instale a extensão **Live Server**
3) Clique com o botão direito no `index.html` > **Open with Live Server**

> Se você abrir o HTML dando “duplo clique”, alguns browsers podem bloquear scripts por causa de CORS. Live Server resolve.

## Como carregar as fontes (igualzinho)
As fontes já estão locais e o CSS já aponta pra elas:
`tela/css/css.css` tem os `@font-face` assim:

```css
@font-face{
  font-family: proximanovaregular;
  src: url("../../api/fontes/proximanova-regular.woff2");
}
```

Ou seja: mantenha a estrutura de pastas:
- `tela/css/css.css`
- `api/fontes/*.woff2`

Se você mudar pastas, ajuste o caminho do `url(...)`.

## Trocar logo e ícone
- Coloque seu logo em: `assets/logo.png`
- Coloque seu favicon em: `assets/favicon.png`

## Onde trocar textos/preço/imagens
No começo, tá tudo vindo do arquivo:
- `data/placeholder.js`

Depois você pode:
- trocar esse JS pra puxar do seu catálogo
- ou preencher direto no HTML

## Observação importante
O visual do modelo lembra um marketplace conhecido. Use a estrutura/UX como inspiração, mas evite usar marca, nome, logotipos e textos que possam dar treta.
