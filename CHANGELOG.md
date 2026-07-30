# Changelog - Cogumelo Games (site)

## v2.7.0 (2026-07-30) — AMIZADES v2 + PERFIL
- Pedidos de amizade (enviar/aceitar/recusar), bloqueio (bloqueado nao pode pedir de volta)
- Perfil: nome, jogando desde, FOTO (12 emojis sugeridos ou foto da galeria, 96x96)
- Busca de jogadores com Solicitar/Bloquear/Ver perfil
- Backend Lambda v3 (solicitar/aceitar/recusar/bloquear/perfil/foto)


## v2.6.0 (2026-07-27) — CONTAS NA NUVEM
- Conta agora funciona em QUALQUER aparelho: registrar/entrar/salvar via API na AWS pessoal 049
  (Lambda cogumelo-contas + API Gateway y67msybrr8 + DynamoDB cogumelo-contas, sa-east-1)
- Auto-save sincroniza com a nuvem a cada 60s (stats.js); fallback local se sem internet
- Penaltis: bolas e poderes pela metade do preco


## v2.5.0 (2026-07-27)
- Sorte do Cogumelo PUBLICADO (aprovado pelo Julio via Telegram): clicker + Maquina Maluca de numeros,
  fichas fixas Bronze/Prata/Ouro/Diamante, 12 melhorias de clique, 777 = jackpot


## v2.4.0 (2026-07-27) — pacotao do Davi
- JOGO NOVO: Policia VS Ladrao (250 niveis procedurais validados, lasers/armarios/canos, 10 skins, 5 habilidades)
- JOGO NOVO: Chuva de Cogumelos (6 tipos de cogumelo, dash, loja de consumiveis, inventario)
- Turbo Racing: arquibancadas, pista 2x mais larga, 3 modos (3/5/9 voltas), raridades, roleta 1x/hora
  (secretos 1%), 5 batidas = 3s travado, colisao entre carros (2s), foguinho no turbo
- Zumbi: dpad + botao de ataque no celular, camera por arrasto, timer h:mm:ss
- Pescaria: varas 60% mais baratas, peixes valem 3x, raridade SECRETA (0,001%), +50% de tempo no celular
- Home: barra de pesquisa de jogos


## v2.3.0 (2026-07-26)
- JOGO NOVO: Capy.io — capivara-cobra estilo .io, arena 3000x3000, 10 bots com IA, boost,
  ranking ao vivo, moedas por partida e 130 skins (10 series x 13 paletas)


## v2.2.0 (2026-07-25)
- JOGO NOVO: Luta de Capivara — 100 niveis vs bots animais, soco (ESPACO) + chute (mouse) no PC,
  botoes no celular, moedas por vitoria, 14 skins de animais (Capivara gratis ate Unicornio 60k)


## v2.1.0 (2026-07-25)
- Penaltis: modos torneio COPA 2026 (12 grupos reais do sorteio) e CHAMPIONS 2025/26 (36 clubes reais)
  — escolhe o time, fase de grupos/liga + mata-mata ate a final, campeao = +1000 moedas
- Cogumelo Parkour: hardcore com lava, pulo duplo, 130 niveis, 20 skins (publicado)
- Sorte do Cogumelo: criado, AGUARDANDO aprovacao do Julio (nao publicado na home)


## v2.0.0 (2026-07-25)
- JOGO NOVO: Cogumelo Parkour 2D — 30 niveis de plataforma, moedas por nivel (1a vez = dobro),
  loja com 10 skins de cogumelo, controles teclado + botoes de toque
- Penaltis: +21 bolas novas (ate a CURVA MASTER de 2,5 milhoes com chute de banana)
- Pescaria: Livro do Pescador (indice), +tesouros e tralhas, precos rebalanceados


## v1.9.0 (2026-07-25)
- JOGO NOVO: Pescaria Maluca — peixes em 5 raridades (comum 50%, raro 30%, epico 15%, lendario 4,99%, ultra 0,01%),
  comprador de peixes (Seu Ze), loja com 6 varas (ate 50.000), sorte por vara, funciona por toque no celular


## v1.8.2 (2026-07-24)
- Conta: AUTO-SAVE do progresso em todos os jogos (a cada 10s e ao sair da pagina, via stats.js)
- Stats: lista de jogos atualizada (Penaltis, Ninja, Parkour, Labirinto, Prisao, Arena)


## v1.8.1 (2026-07-24)
- Penaltis: novo modo TIMES — 100 clubes do Ibis ao Real Madrid, progresso separado do modo Selecoes, mesmas moedas


## v1.8.0 (2026-07-24) — Fase 6 (final do plano do Davi)
### Arena Cogumelo (ex-Brawl Stars 2, v2.0.0)
- Nome novo (marca registrada removida); "Davi" removido da tela
- 12 lutadores (+4 novos), +30% vida, loja funcional, trilha de trofeus com resgate
- Kit medicos no lugar das caixas; zona battle royale que fecha; mato = invisivel
- 4 modos: Battle Royale, Mata-Mata, Pega-Cristais, Duelo 1v1
### Cogumelo Ninja
- 4 espadas novas (3000 a 15000); nivel sobe a cada 500 cortes (mais bombas/velocidade)
### Fuga da Prisao 3D
- 23 niveis (20 novos, procedurais com validacao BFS de caminho); niveis 2 e 3 eram IMPOSSIVEIS e foram corrigidos
- Moedas por nivel + loja com 7 skins; chave dourada nova; ser pego reinicia no mesmo nivel


## v1.7.0 (2026-07-24) — Fase 5
### Zumbi Survival
- Cronometro de sobrevivencia; ondas mais dificeis com anuncio; barra de fome + comidas 3D
- Lobby com 3 mapas (Cidade, Deserto, Noite Sombria) e loja de armas (moedas por onda)
- Barra de vida em cima dos zumbis; aviso de virar a tela no celular
### Labirinto Assombrado
- Jumpscares com som (WebAudio); 3 monstros rondando; sangue cartunesco
- Barras de vida e fome; 10 armarios com comida/remedio/susto (tecla E)
- Aviso animado de deitar o celular


## v1.6.0 (2026-07-24) — Fase 4
### Turbo Racing
- Botoes de toque pra celular; 20 carros novos + 6 exclusivos na loja (500-2000 moedas)
- 10 mapas selecionaveis; cronometro no canto sup. esquerdo; 9 bots (10 na pista)
- Moedas por posicao: 1o=20, 2o=16, 3o=13, 4o=10
### Street Drive
- Botoes de toque pra celular; TURBO com barra de recarga
- FIX: pista sumia (todos os segmentos reciclavam no mesmo frame e teleportavam alem do far plane)
- Loja: 6 carros novos por vitorias (5 a 20), saldo = vitorias - gastas


## v1.5.0 (2026-07-24) — Fase 3
### Capivara Run (v3.1.0)
- Modo 2 jogadores agora e Voce vs Computador (bot com IA); modos 3 e 4 removidos
- 13 skins com raridades (Comum/Raro/Epico/Lendario/Cosmico) + loja com precos por raridade
- Vida extra por 100 moedas (1x por partida)
- Roleta: 10 premios, Tartaruga Ninja 0,1% (exclusiva da roleta)
### Parkour
- Cenario de fundo (sol, montanhas, nuvens parallax)
- 7 skins compraveis com moedas; cronometro mm:ss no canto superior direito
- Placa azul nao mata ao passar por cima; controles sem delay
### Clicker
- Botao unico de entrada (sem virar o celular); combo TURBO de clique ate x5
- Loja: 5 tenis (10M a 500M) + 5 melhorias (7,5M a 400M); 12 esteiras; save completo


## v1.4.0 (2026-07-24) — Fase 2: Contas
- Pagina /conta/: criar conta (nome+senha com hash SHA-256), entrar, sair, jogar como visitante
- Progresso de TODOS os jogos salvo na conta (snapshot do localStorage, auto-save ao abrir a pagina)
- Botao de conta no topo da home mostrando quem esta logado
- Limite v1: contas valem por aparelho; sync entre aparelhos precisa de backend (aguardando decisao)


## v1.3.1 (2026-07-24)
- Penaltis: escolha de dispositivo (computador/celular) e aviso de girar a tela no celular


## v1.3.0 (2026-07-24)

### Novo
- Jogo novo: Penaltis (Copa de 100 niveis com selecoes, loja de bolas, poderes e moedas)

### Fase 1 (limpeza do site)
- Rua Suja 3D, Demo Graficos e Enviar Sugestao ESCONDIDOS da home (nao removidos — display:none)
- Nome do site agora e so "Cogumelo Games"

---

# Changelog - Brawl Stars 2

## v1.2.0 (2026-05-21)

### Novo
- Agua agora BLOQUEIA passagem (ninguem pode andar na agua — igual parede)
- Borda visual ao redor da agua (pedra)
- Spawn seguro: jogador e inimigos nunca nascem dentro da agua ou paredes

### Melhorias (Realismo)
- Ceu azul realista no fundo (em vez de escuro)
- Luz do sol com tom quente e sombras nítidas
- Chao verde como grama (em vez de verde escuro)
- Paredes de pedra com aparencia solida
- Moitas mais verdes e com sombra
- Agua com profundidade visual e brilho
- Tone mapping cinematico (ACES)
- Neblina suave no horizonte

---

## v1.1.0 (2026-05-21)

### Novo
- Controles touch para celular (joystick esquerdo = mover, joystick direito = mirar e atirar)
- Layout responsivo: se adapta a qualquer tela (celular, tablet, PC)
- Renderer redimensiona automaticamente
- Meta tags para fullscreen no celular (PWA-ready)
- Minimap reposicionado no mobile pra nao atrapalhar

### Melhorias
- Menu responsivo (grid 2 colunas no celular)
- Toque na tela volta ao menu no game over

---

## v1.0.0 (2026-05-21)

### Novo
- Jogo 3D completo com Three.js (camera estilo Brawl Stars)
- 8 brawlers com ataques unicos (normal, shotgun, zap, cannon, laser, triple, spore, bomb)
- Mapa grande com camera que segue o jogador
- Elementos de mapa: agua (deixa lento), moita (esconde), paredes (bloqueiam), caixas com cubo de poder
- Cubos de poder: destroi caixa = +HP e +dano
- IA independente: inimigos lutam entre si (todos por si)
- 10 brawlers por partida
- Menu completo: tela inicial, brawlers, loja, estrada de trofeus
- Sistema de trofeus (ganhos por partida)
- Minimap com agua, moitas, caixas e inimigos
- Sons 8-bit para todos os eventos
- Indicador de versao no canto inferior direito

### Brawlers
- Bolt (comum) - tiro simples
- Ferro (comum) - shotgun 5 tiros
- Spark (raro) - raio eletrico rapido
- Tanque (raro) - bala grande e lenta
- Laser (epico) - laser que atravessa
- Shadow (epico) - 3 tiros em leque
- Cogumelo (mitico) - esporos venenosos
- Nuclear (lendario) - bomba explosiva
