# Awaken Drills

Versao 3.1.0. Aplicacao estatica (HTML, CSS e JavaScript puro) para drills e sparring de Jiu-Jitsu.

## O que foi ajustado

- Drill pode iniciar sem nenhuma tecnica selecionada. Nesse caso cada atleta recebe ao menos um intervalo sem rotulo de tecnica.
- Todos os erros de validacao e falhas da aplicacao aparecem em popup na tela.
- Ao finalizar a sessao, o cronometro mostra `FIM` em tela vermelha.
- Sino substituido por uma sintese mais forte de ring bell de boxe, sem arquivo externo.
- Suporte a 1, 2 ou 3 atletas, com tecnicas e cores independentes.
- Fullscreen mostra somente o tempo. Um toque na tela revela os controles por alguns segundos.
- PWA para iOS/Android com `manifest.webmanifest`, metatags de web app e service worker.
- Mantida a chave `awaken-drills-v2` do Local Storage para preservar os dados existentes.

## Estrutura

```text
AwakenDrills/
|-- public/
|   |-- index.html
|   |-- css/style.css
|   |-- js/main.js
|   |-- assets/
|   |   |-- images/awaken-symbol.png
|   |   `-- icons/ui.svg
|   |-- manifest.webmanifest
|   |-- sw.js
|   `-- _headers
|-- package.json
|-- wrangler.jsonc
|-- .gitignore
`-- README.md
```

## Cloudflare Pages

Nao ha build. Na configuracao do projeto use:

- Build command: vazio (ou `exit 0`).
- Build output directory: `public`.

Nao e necessario `npm install` nem Wrangler local.

## Cloudflare Workers Static Assets

O arquivo `wrangler.jsonc` continua apontando para `./public`. Em Workers Builds, conecte o repositorio pelo painel da Cloudflare. O projeto nao possui Wrangler como dependencia local e nao exige instalacao na sua maquina.

## iPhone e Android

Para ficar sem barra de URL de forma consistente, instale o webapp pela tela inicial:

- iOS/Safari: Compartilhar > Adicionar a Tela de Inicio.
- Android/Chrome: Instalar app / Adicionar a tela inicial.

No navegador comum, o botao de fullscreen solicita a Fullscreen API com `navigationUI: hide` quando suportado. Navegadores que nao permitem esconder a barra do sistema usam o modo expandido como fallback.
