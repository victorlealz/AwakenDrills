# Awaken Drills 5.0

PWA mobile-first para drills e sparring de Jiu-Jitsu. Projeto estatico, sem framework e sem dependencias de runtime.

## Recursos

- Drill com 1 a 4 atletas e alternancia automatica.
- Cada atleta ativo obrigatoriamente usa uma cor diferente.
- Cores principais azul, branco e preto, alem de vermelho, verde e roxo.
- A cor do atleta vira o fundo do cronometro.
- Tecnicas 100% livres: o usuario digita as tecnicas com as proprias palavras.
- Tecnica opcional: o treino inicia normalmente sem nenhuma tecnica cadastrada.
- Rodizio das tecnicas cadastradas por serie.
- Lembrete da proxima tecnica nos 2 segundos finais da preparacao.
- Sparring separado com preparacao, rounds e descanso.
- Tres sinos sintetizados no estilo boxe tradicional: ringue classico, ringue duplo e ringue vintage.
- Bipes opcionais em 3, 2 e 1 segundos, mantidos separados do sino final.
- Toggle PT / EN dentro do menu de configuracoes.
- Modo foco/tela cheia com somente o tempo visivel.
- Wake Lock opcional para manter a tela ligada durante o treino.
- PWA para iOS e Android com manifest, icones, service worker, safe areas e modo offline.
- Logo oficial Awaken fornecida para esta versao aplicada aos icones e identidade do app.
- Migracao das preferencias salvas da versao anterior, incluindo correcao automatica de cores duplicadas entre atletas ativos.

## Testar

Requer Node.js 18+.

```bash
npm run verify
```

## Desenvolvimento local

```bash
npx wrangler@latest dev
```

## Cloudflare Workers

```bash
npx wrangler@latest deploy
```

O `wrangler.jsonc` serve a pasta `./public` usando Static Assets e fallback de SPA.

## Cloudflare Pages

No painel:

- Framework preset: None
- Build command: vazio
- Build output directory: public

Deploy por CLI:

```bash
npx wrangler@latest pages deploy public --project-name=awakendrills
```
