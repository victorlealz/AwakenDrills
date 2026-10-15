# Awaken Drills

Aplicação estática e bilíngue (português/inglês) para treinos de drills e sparring de Jiu-Jitsu. Inclui seleção e cadastro de técnicas, cronômetro de etapas, alternância de atletas por fundo azul/verde, rounds de preparação/sparring/descanso, Wake Lock quando suportado e armazenamento local de preferências. A marca é derivada do PDF oficial fornecido pelo proprietário.

## Estrutura

- `index.html`: interface semântica e acessível.
- `css/style.css`: estilos responsivos.
- `js/main.js`: temporizadores, idioma, biblioteca de técnicas e persistência.
- `assets/images/awaken-logo.png`: logotipo oficial.
- `assets/icons/`: reservado para ícones locais futuros.
- `wrangler.jsonc`: configuração Cloudflare Pages.

## Desenvolvimento local

Requer Node.js LTS e npm. Execute:

```sh
npm install
npm run dev
```

O endereço de desenvolvimento será exibido pelo Wrangler. Alternativamente, o site pode ser servido por qualquer servidor estático. Não é necessário backend.

## Deploy

### GitHub → Cloudflare Pages

1. Envie o conteúdo desta pasta para um repositório GitHub.
2. No painel Cloudflare, crie um projeto **Workers & Pages → Pages → Connect to Git** e conecte o repositório.
3. Selecione o projeto e configure: **Framework preset: None**, **Build command: vazio**, **Build output directory: `.`**, **Root directory: raiz do repositório**.
4. Publique. O site será atualizado a cada push para a branch de produção.

### CLI

```sh
npm install
npx wrangler login
npm run deploy
```

O script utiliza o nome de projeto `awaken-drills`. Se necessário, crie o projeto Pages no painel primeiro. `wrangler` utiliza a tag `latest` para obter a versão estável publicada no npm durante a instalação; para builds reproduzíveis, versione o `package-lock.json` gerado após `npm install`.

## Proteção por senha

**Não inclua senha no HTML/JavaScript**: uma senha no frontend não protege o site. Para controlar acesso, use **Cloudflare Zero Trust → Access → Applications → Add an application → Self-hosted** e configure o domínio de produção como hostname protegido. Crie uma política `Allow` para os endereços de e-mail autorizados e habilite autenticação por código de uso único (One-time PIN) ou provedor de identidade. Para proteção por uma senha compartilhada em vez de identidade por e-mail, será necessária uma solução de autenticação no lado do servidor (por exemplo, Worker com sessão e segredo protegido), que não faz parte desta versão estática. Verifique as opções atuais do seu plano Cloudflare.

## Operação

- Drills: marque as técnicas, ajuste tempo, séries, quantidade de participantes e primeiro atleta. Cada técnica/série gera uma etapa por participante.
- Sparring: ajuste preparação, luta, descanso e rounds; o descanso final é omitido.
- Os botões anterior/próximo pulam entre etapas. Pausar preserva o tempo restante. Reiniciar aplica as configurações atuais.
- Os tempos são calculados a partir de `performance.now()` para reduzir a deriva de intervalos; a execução em segundo plano pode sofrer restrições do navegador.
- O Wake Lock requer contexto seguro (HTTPS ou ambiente local compatível), permissão do navegador e tela visível. Não funciona em todos os dispositivos e não substitui ajustes de energia do sistema.
- Preferências e técnicas são armazenadas apenas no `localStorage` deste navegador. Não há sincronização entre dispositivos.
- O aviso sonoro é opcional e pode ser bloqueado por políticas de áudio do navegador.

## Privacidade e segurança

Não há contas, credenciais, rastreamento ou envio de dados a terceiros. Use HTTPS na publicação. Para restringir acesso, configure Cloudflare Access no domínio público antes de divulgar o endereço.
