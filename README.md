# Awaken Drills

Versão 3.0.0. Cronômetros de drills e sparring de Jiu-Jitsu em português e inglês. HTML, CSS e JavaScript puro, sem framework, backend ou dependência no navegador. O símbolo transparente da Awaken foi mantido.

## Estrutura

```text
awaken-drills/
|-- index.html
|-- css/
|   `-- style.css
|-- js/
|   `-- main.js
|-- assets/
|   |-- images/
|   |   `-- awaken-symbol.png
|   `-- icons/
|       `-- ui.svg
|-- package.json
|-- wrangler.jsonc
|-- .gitignore
|-- _headers
`-- README.md
```

`index.html` contém as telas separadas; `css/style.css` define a interface mobile-first; `js/main.js` implementa os cronômetros, o sino, a proteção de tela, a tradução e as técnicas individuais. `_headers` configura cabeçalhos de segurança e revalidação de cache na Cloudflare Pages. Classes CSS, IDs e identificadores JavaScript usam camelCase; o texto visível usa capitalização natural, sem rótulos em caixa alta.

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

Para usar os comandos npm, utilize Node.js 22 ou superior, conforme o requisito do Wrangler fixado neste projeto.

```bash
npm install
npm run dev
```

Abra o endereço indicado pelo Wrangler no terminal. O aplicativo continua sendo estático: Node.js e Wrangler são ferramentas de desenvolvimento/publicação, não um backend.

```bash
npm run check
```

Esse comando verifica a sintaxe do JavaScript. O `package-lock.json` será gerado por `npm install`; inclua-o no Git para registrar também as dependências transitivas resolvidas. Não é necessário configurar variáveis de ambiente para o aplicativo.

Wrangler **4.151.0** foi fixado com base na versão oficial consultada em 15/10/2026, em vez de usar a etiqueta variável `latest`.

## Deploy

### GitHub para Cloudflare Pages

Coloque o conteúdo desta pasta na raiz do repositório, mantendo `index.html` nesse nível. Na Cloudflare, abra Workers & Pages, crie uma aplicação **Pages** e importe o repositório GitHub.

Configure o preset como **None**, a branch de produção como `main`, o comando de build como `exit 0` e o diretório de saída como `.`. Não há compilação da aplicação. Mantenha o diretório raiz vazio se o projeto estiver na raiz do repositório.

Para atualizar um projeto Pages já integrado, substitua os arquivos do repositório, incluindo `assets/icons/ui.svg` e `_headers`, e faça um commit na branch de produção. As configurações de build acima permanecem as mesmas.

### Wrangler CLI

```bash
npx wrangler login
npm run deploy
```

O comando publica no projeto Pages `awaken-drills` da conta autenticada. Para criar um projeto novo pelo CLI antes do primeiro deploy:

```bash
npx wrangler pages project create awaken-drills
```

O arquivo `wrangler.jsonc` é de **Pages**, não de um Worker com backend. Não use `wrangler deploy` no lugar de `wrangler pages deploy`.

## Acesso protegido e segurança

Não há senha no frontend. Para restringir o uso, configure Cloudflare Zero Trust / Access com uma aplicação self-hosted e política de acesso para o domínio escolhido e os e-mails autorizados. A documentação oficial abaixo explica os detalhes de proteção dos endereços de Pages.

Proteger somente o domínio personalizado não protege automaticamente o `pages.dev`. A opção de proteção de previews, isoladamente, também não protege a URL de produção. Verifique produção, previews e domínio personalizado em uma janela não autenticada antes de considerar o acesso restrito.

O frontend não envia técnicas a servidores, não carrega scripts externos e trata nomes como texto, nunca como HTML. `_headers` restringe recursos à mesma origem e desabilita enquadramento por outras páginas. A aplicação não necessita de câmera, microfone ou geolocalização.

A pasta de publicação é pública. Não coloque nela segredos, documentos privados, arquivos `.env` ou `.dev.vars`: `.gitignore` não é um controle de acesso nem uma garantia de exclusão no upload direto. Use a autenticação do Wrangler ou as configurações da Cloudflare, nunca credenciais em arquivos servidos pelo site.

## Verificação desta entrega

Foram executados 20 grupos de testes de interface e comportamento em Chromium, com os arquivos carregados localmente em um ambiente de teste sem rede. Cobriram listas vazias/individuais, alternância, preparação, sparring, pausa, retomada, navegação, tradução, migração de dados, acessibilidade básica e layouts de 320 px a desktop, inclusive paisagem.

O ciclo de permissão, revogação e retorno do Wake Lock foi testado com a API simulada. O sino foi adicionalmente exercitado com a Web Audio API nativa, com sinal de áudio não nulo, e a tela cheia com a API nativa do Chromium. Não foram observadas exceções de JavaScript nesses testes. Casos adicionais incluíram nomes longos e armazenamento corrompido ou indisponível.

Isso não substitui testar o som e o bloqueio de tela no celular usado no treino. Não foi realizada publicação na conta Cloudflare nem instalação pelo registro npm, que estava inacessível neste ambiente. O projeto não contém dados de teste nem dependências dos testes.

## Referências

- [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)
- [Web Audio API: boas práticas e ativação por gesto](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)
- [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide)
- [Cloudflare Pages: HTML estático](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)
- [Cloudflare Pages: cabeçalhos](https://developers.cloudflare.com/pages/configuration/headers/)
- [Cloudflare Pages: Access e limitações conhecidas](https://developers.cloudflare.com/pages/platform/known-issues/)
- [Wrangler 4.151.0](https://github.com/cloudflare/workers-sdk/releases/tag/wrangler%404.151.0)
