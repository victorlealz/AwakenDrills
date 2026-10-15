# Awaken Drills

Versão 3.0.1 (correção de empacotamento). Cronômetros de drills e sparring de Jiu-Jitsu em português e inglês. HTML, CSS e JavaScript puro, sem framework, backend ou dependência no navegador. O símbolo transparente da Awaken foi mantido.

## Estrutura

```text
awaken-drills/
|-- public/                 # ÚNICA pasta publicada no Worker
|   |-- index.html
|   |-- css/
|   |   `-- style.css
|   |-- js/
|   |   `-- main.js
|   |-- assets/
|   |   |-- images/
|   |   |   `-- awaken-symbol.png
|   |   `-- icons/
|   |       `-- ui.svg
|   `-- _headers
|-- package.json
|-- wrangler.jsonc
|-- .gitignore
`-- README.md
```

O site é estático, sem backend. `wrangler.jsonc` aponta para `./public`, impedindo que a pasta `node_modules` e outros arquivos do projeto sejam tratados como assets. Esta organização corrige o erro anterior que tentava publicar o binário `node_modules/workerd/bin/workerd` (129 MiB) como asset de um Worker (limite de 25 MiB por arquivo).

`public/index.html` contém as telas; `public/css/style.css` define a interface mobile-first; `public/js/main.js` implementa os cronômetros, o sino, a proteção de tela, a tradução e as técnicas individuais. `public/_headers` configura cabeçalhos de segurança e cache no Cloudflare Workers Static Assets. As referências usadas pelo HTML foram mantidas.

## Funcionamento

### Técnicas e atletas

A biblioteca inicia vazia. Abra **Técnicas** no menu, escolha o atleta e cadastre suas técnicas. Cada atleta possui lista e seleção próprias. O cadastro de ambos permanece disponível mesmo quando o drill atual usa somente um atleta. As técnicas aparecem na ordem de cadastro, sem séries por técnica.

Nas configurações do drill, selecione uma ou duas pessoas, os nomes, as técnicas e as cores. Cada pessoa escolhe entre as duas bolinhas, verde e azul; a cor da outra pessoa se ajusta para continuar distinta. Cada atleta participante precisa ter pelo menos uma técnica selecionada.

### Alternância

**Alternar Atletas** aparece quando há duas pessoas e vem ativado por padrão. A sequência dos tempos de execução é Atleta 1, Atleta 2, Atleta 1, Atleta 2, até o fim. Cada um segue a própria lista de técnicas.

**Listas de tamanhos diferentes:** a maior lista determina a quantidade de tempos por atleta; a menor recomeça do início para manter a alternância até o final. Por exemplo: com três técnicas do atleta 1 e uma do atleta 2, são seis tempos, e a técnica do atleta 2 reaparece em suas três participações. Nenhuma técnica nova é criada na biblioteca.

Desativado, o modo executa toda a seleção do atleta 1 e depois a do atleta 2, uma vez por técnica selecionada. Com uma pessoa, utiliza apenas a seleção dela.

### Tempos e preparar

Drill, sparring e descanso utilizam dropdowns separados de minutos e segundos, entre 00 e 59. O tempo de execução precisa ser maior que zero; o descanso pode ser zero.

**Preparar** possui dropdown de 0 a 30 segundos, com configurações independentes para drills e sparring. O padrão é 5 segundos em drills e 10 em sparring. Zero elimina essa fase, sem exibir um tempo vazio.

- **Drills:** preparar, atleta 1, preparar, atleta 2, preparar, atleta 1, e assim por diante, conforme a configuração. Durante a preparação, aparecem a pessoa e a técnica que virão a seguir. A cor neutra identifica a preparação; verde e azul identificam a execução.
- **Sparring:** preparar, combate, descanso, preparar, combate. O descanso é omitido após o último round. São permitidos entre 1 e 99 rounds.

A preparação também acontece antes do primeiro tempo e nunca depois do último. O indicador numérico conta os tempos de execução ou rounds, sem contar a preparação como uma participação adicional.

### Cronômetro e sino

**Iniciar** nas configurações abre a tela do cronômetro e começa a contagem. As configurações da sessão são capturadas nesse momento: alterar o cadastro depois não modifica silenciosamente uma sessão já montada.

O sino toca no encerramento de cada fase, incluindo preparar, execução e descanso, e no fim da sessão. O som é sintetizado localmente pela Web Audio API, com ataque curto e decaimento de sino; nenhum arquivo ou serviço externo é necessário. O contexto de áudio é ativado no gesto de iniciar. O botão do sino silencia ou reativa o som; ao reativar, toca uma amostra. Verifique o volume e as restrições de áudio do aparelho.

Pausar conserva o restante do tempo. Anterior e Próximo mudam de fase e deixam a contagem pausada; Reiniciar volta ao começo. Essas ações manuais não disparam o sino de encerramento. A barra de espaço alterna pausa e execução quando o foco não está em um campo ou botão.

O timer usa horários de término absolutos para corrigir atrasos do navegador. Ao retornar de uma aba suspensa, atualiza o tempo sem reproduzir uma rajada de sinos atrasados. O aplicativo não promete alarmes em segundo plano, com o aparelho bloqueado ou depois de fechar a página.

### Tela ativa e tela cheia

A solicitação de **Screen Wake Lock** é automática enquanto o cronômetro está rodando e a página está visível, inclusive em preparação e descanso. Não exige apertar um botão antes do treino. A bolinha ao lado de Tela Ativa fica verde quando a proteção foi efetivamente concedida.

Ao pausar, sair do cronômetro, ocultar a página ou terminar a sessão, o app libera a solicitação. Ao voltar para uma contagem em execução, tenta readquiri-la. O botão Tela Ativa permite tentar novamente após uma recusa ou revogação.

**Limite da plataforma:** essa API depende de contexto seguro (HTTPS em produção), suporte do navegador e permissão do sistema. Bateria baixa, economia de energia ou decisões do navegador podem impedir ou revogar a proteção. Não é possível impedir o bloqueio manual nem garantir tela ligada com o app em segundo plano. Se a solicitação falhar, o app mostra um aviso e mantém o cronômetro funcionando.

O botão de expansão usa a Fullscreen API quando disponível. Nos navegadores que recusam a tela cheia, a alternativa ocupa a área visível da página, sem prometer ocultar as barras do navegador. O mesmo botão ou Escape sai da expansão.

### Dados da versão anterior

A chave `awaken-drills-v2` foi mantida para reaproveitar as técnicas, seleções, nomes, cores, idioma e tempos já salvos. Preparações antigas maiores que 30 segundos são limitadas a 30. Não são importadas técnicas de exemplo.

Os dados pertencem ao armazenamento local do navegador e ao mesmo endereço/origem do site; não são sincronizados entre aparelhos, domínios ou perfis. Atualize no mesmo endereço e não limpe os dados do site para manter o cadastro. Atletas representam listas locais, não contas autenticadas. O timer em execução não é restaurado depois de recarregar a página.

## Desenvolvimento local

Requer Node.js 22 ou superior.

```bash
npm install
npm run check
npm run dev
```

Abra o endereço indicado pelo Wrangler. Para publicar manualmente na conta Cloudflare autenticada:

```bash
npx wrangler login
npm run deploy
```

O projeto utiliza Wrangler 4.151.0, fixado em `package.json`. O navegador recebe somente os arquivos estáticos em `public/`; Node.js e Wrangler são ferramentas de desenvolvimento e publicação.

## Deploy (Cloudflare Workers via GitHub)

Este pacote foi preparado para o **Worker existente `awakendrills`**, com o comando de publicação `npx wrangler deploy` encontrado no log enviado. Não é necessário criar um projeto Pages diferente.

1. **Extraia o ZIP** e coloque o conteúdo da pasta extraída na **raiz do repositório** GitHub, preservando a pasta `public/`.
2. Substitua `package.json` e inclua `wrangler.jsonc` e `.gitignore`. Exclua da raiz quaisquer arquivos antigos `index.html`, `style.css`, `main.js`, `ui.svg`, `awaken-symbol.png`, `_headers` e pastas estáticas antigas não usadas, para evitar duplicação. **Os equivalentes corretos estão em `public/`.** Não exclua arquivos de outros projetos que compartilhem o repositório.
3. Faça o commit na branch conectada à Cloudflare.
4. Nas configurações de build/deploy do Worker, mantenha o comando **`npx wrangler deploy`**. Não configure a saída como `.` para sobrescrever o `wrangler.jsonc`; os assets estão em **`./public`**. O aplicativo não requer um comando de build.
5. Verifique o novo log: a lista de assets deve conter somente os arquivos do site, sem `node_modules`.

**Importante:** o GitHub não descompacta automaticamente um ZIP enviado como arquivo. É necessário extrair o pacote antes de enviar os arquivos para o repositório. As configurações permanecem associadas ao Worker que já está ligado ao repositório.

Configuração relevante de `wrangler.jsonc`:

```json
{
  "name": "awakendrills",
  "compatibility_date": "2026-10-12",
  "assets": { "directory": "./public" }
}
```

O arquivo real inclui também o schema e a observabilidade. Para aplicações servidas por Workers Static Assets, `public/_headers` é a localização correta para cabeçalhos personalizados.

## Acesso protegido e segurança

Não há senha no frontend. Para restringir o uso, configure Cloudflare Zero Trust / Access com uma aplicação self-hosted e política de acesso para o domínio escolhido e os e-mails autorizados. Confira nas configurações do Access quais endereços (domínio próprio e subdomínio do Worker) ficam protegidos.

Proteger somente o domínio personalizado não garante proteção automática de um endereço `workers.dev` associado ao Worker. Verifique produção, previews e domínio personalizado em uma janela não autenticada antes de considerar o acesso restrito.

O frontend não envia técnicas a servidores, não carrega scripts externos e trata nomes como texto, nunca como HTML. `public/_headers` restringe recursos à mesma origem e desabilita enquadramento por outras páginas. A aplicação não necessita de câmera, microfone ou geolocalização.

A pasta `public/` é pública. Não coloque nela segredos, documentos privados, arquivos `.env` ou `.dev.vars`: `.gitignore` não é um controle de acesso nem uma garantia de exclusão no upload direto. Use a autenticação do Wrangler ou as configurações da Cloudflare, nunca credenciais em arquivos servidos pelo site.

## Verificação do pacote corrigido

A alteração realizada neste pacote é de **estrutura e configuração de deploy**: os códigos HTML, CSS, JavaScript, SVG e a imagem foram preservados. Foram conferidas a sintaxe de `public/js/main.js`, as referências dos arquivos do site, os ícones SVG usados pelo HTML, e a pasta indicada em `wrangler.jsonc`. Nenhum arquivo do `node_modules` está incluído no ZIP nem dentro de `public/`.

Esta validação local não equivale a um deploy real na conta Cloudflare, nem substitui testes de áudio, Wake Lock e tela cheia no dispositivo utilizado no treino.

## Referências

- [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)
- [Web Audio API: boas práticas e ativação por gesto](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)
- [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide)
- [Cloudflare Workers: Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Cloudflare Workers: cabeçalhos de assets](https://developers.cloudflare.com/workers/static-assets/headers/)
- [Cloudflare Workers: configurações de assets](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Wrangler 4.151.0](https://github.com/cloudflare/workers-sdk/releases/tag/wrangler%404.151.0)
