# BJJ Drills - Awaken Drills 5.4.5

Webapp/PWA mobile-first para drills e sparring de Jiu-Jitsu.

## Alteração 5.4.5

- Corrigida a sequência de rounds no seletor (1 a 10, incluindo o round 4).
- O botão de saída do modo fullscreen agora usa um ícone de início desenhado em CSS, no mesmo padrão visual do pause/play.
- O botão de entrada em fullscreen também usa um ícone vetorial em CSS, sem depender de glifo Unicode.
- Versão exibida e chave de cache do service worker foram sincronizadas.
- O cronômetro só começa depois da tentativa de entrada em fullscreen/modo imersivo.
- Antes de cada drill, a técnica atribuída àquele atleta naquela série aparece por **2 segundos**.
- Cada atleta mantém sua própria fila de técnicas na ordem de cadastro.
- Com vários atletas, o rodízio ocorre por série e por atleta sem misturar as filas.
- Atleta sem técnica pula somente o seu aviso; os avisos dos outros atletas continuam normalmente.
- Os quatro efeitos originais voltaram às opções: Boxing Bell, I'm gonna smash your boy, Faaah e Dry Fart.
- A identidade visual usa exclusivamente a logo fornecida pelo usuário, armazenada localmente no app para cabeçalho, favicon, Apple Touch Icon e ícones PWA.

### Exemplo de sequência

Com A = `A1, A2, A3` e B = `B1, B2`, a fila de avisos é:

`A1 -> B1 -> A2 -> B2 -> A3 -> B1 ...`

Cada aviso fica 2 segundos na tela e é seguido imediatamente pelo drill do mesmo atleta.

## Verificar

Requer Node.js 18+.

```bash
npm run verify
```

A suíte cobre sintaxe, assets e cenários com 1 a 4 atletas, múltiplas técnicas, atletas sem técnica e a ordem fullscreen -> início do timer.

## Desenvolvimento local

```bash
npx wrangler@latest dev
```

## Deploy

```bash
npm run deploy
```

O `wrangler.jsonc` serve a pasta `./public` como Static Assets.
