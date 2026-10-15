# Cogumelo Games — contexto pro Claude Code

Site de jogos do **Davi** (10 anos): https://cogumelogames.com.br
Repo: `jmoscovo-collab/brawl-stars-2` (GitHub Pages, branch `main`). **git push = deploy** (~90s).

## Quem fala com você
- **Davi** = dono do site, dirige tudo. Fale simples, divertido, com emojis. Ele não digita URL: ao terminar, **abra o jogo no navegador** (`start https://cogumelogames.com.br/<jogo>/` no Windows, ~90s após o push).
- **Julio** = pai. Mexe nos jogos `pai-*/`. Só ele autoriza coisa com dinheiro, dados pessoais ou AWS.

## Estrutura
- Cada jogo = uma pasta com `index.html` single-file (canvas 2D ou Three.js r128 via cdnjs). pt-BR, tem que funcionar em desktop **e** celular (touch).
- Home = `index.html` da raiz: um `game-card` por jogo. **Jogo novo entra NO FINAL da lista.** Jogo novo só ganha card quando o Davi liberar ("lança") — antes disso fica só por URL (card com `display:none`).
- Scripts globais: `stats.js` (contas/progresso/nuvem), `cogucoins.js` (moeda do site), `mascote.js`, `gamepad.js`, `cg3d.js`, `favoritos.js`, `avisos.js`.
- `CHANGELOG.md`: um bloco `## vNNN (data)` por publicação, linguagem simples.
- Versão do site = número de commits (`git rev-list --count HEAD`). Badge `vNNN` no header da home: **bumpar a cada push.**

## Pipeline de publicação (sempre nessa ordem)
1. Editar o jogo (1 arquivo por vez; não reescrever arquivo inteiro sem necessidade).
2. Validar JS: `node -e "const h=require('fs').readFileSync('PASTA/index.html','utf8'); for(const m of h.match(/<script>[\s\S]*?<\/script>/g)||[]) new Function(m.replace(/<\/?script>/g,''));"`
3. Se mexeu em `stats.js`/`cogucoins.js`/`gamepad.js`: bumpar o `?v=NN` em TODOS os `index.html` que referenciam (senão PS5/celular usam cache velho).
4. `CHANGELOG.md` + badge de versão na home.
5. `git add -A && git commit -m "vNNN: <o que fez>" && git push`
6. Esperar ~90s e abrir a URL do jogo.

## Regras da casa (não negociar)
- **Esconder, nunca apagar** jogo ou feature (`display:none`, comentário).
- Nunca tirar `.nojekyll`, `CNAME`, `/.well-known/assetlinks.json`, `/excluir-conta/`, política de privacidade (Play Store depende).
- Sem nome real/sobrenome/escola/cidade em texto público.
- Presente/cheat de teste: quantidade pequena (10k peixes já estourou o save uma vez).
- Cogu Coins **pagas com dinheiro de verdade: NÃO** (decisão do Julio). Moeda ganha jogando: ok.
- Backend (Lambda `cogumelo-contas`, relay WebSocket `cogumelo-ws`, DynamoDB sa-east-1) **só o Julio mexe**. O site só consome as URLs que já estão nos JS.
- Não rodar subagentes editando o mesmo arquivo; revisar `git log` depois de qualquer tarefa longa.
- Commit sempre com trailer `Co-Authored-By: Claude <noreply@anthropic.com>`.

## Lições que já doeram
- Loop `salvarProgresso↔mostraEstado` floodou a API: cuidado com save dentro de render.
- HUD atualizando 60fps lagava tudo: HUD a 4x/s, `pixelRatio ≤ 1.5`, 30fps no celular.
- `let/const` não ficam em `window`; rAF deve começar antes de montar o mundo 3D.
- Fases impossíveis: testar com BFS/simulação antes de publicar nível gerado.
