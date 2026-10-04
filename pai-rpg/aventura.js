// A TORRE DO RELÓGIO PERDIDO — livro-jogo original do Papai (Cogumelo Games).
// Sistema clássico de livro-jogo (Habilidade/Energia/Sorte, 2d6). História, lugares,
// monstros e piadas são 100% nossos.
//
// Formato de cada seção:
//   texto      — o parágrafo (pode ter \n)
//   cena       — { ambiente:'cidade'|'floresta'|'caverna'|'castelo'|'futuro'|'torre', hora:'dia'|'tarde'|'noite',
//                  props:['kit/arquivo.glb', ...] (extras), monstro:'kit/arquivo.glb' ou '@cuco'/'@pendulo' }
//   escolhas   — [{ txt, ir, cond?:{item|semItem|ouro|itens|algumItem}, efeito? }]
//   combate    — { nome, hab, eng, modelo, fuga?: seção pra onde foge, ir: seção após vencer }
//   teste      — { sorte: seção, azar: seção }   (Teste de Sorte fora de combate)
//   efeito     — { energia, sorte, habilidade, ouro, provisoes, item, removeItem } aplicado 1x ao entrar
//   comer      — true se pode comer aqui
//   checkpoint — true = ponto de retorno "bonzinho do papai"
//   fim        — 'epico' | 'bom' | 'torto' | 'ruim'  (tela final)

export const TITULO = 'A Torre do Relógio Perdido';

export const SECOES = {

// ============================== TÉRREO — VILA PONTEIRO TORTO ==============================
1: {
  texto: `Bem-vindo a Ponteiro Torto, a vila onde o tempo saiu de férias. Desde que o grande Relógio da Torre parou, o café da manhã é servido às 3 da madrugada, a escola começa antes de você acordar e o galo canta quando bem entende.\n\nO prefeito Seu Atrasildo agarra sua manga: "Aventureiro! Dizem que o Relojoeiro Tique-Taque roubou o Coração do Relógio e se escondeu no topo da torre. Cada andar dela é uma época diferente. Traga o Coração de volta e eu te dou... um abraço. A vila está sem dinheiro. O tesoureiro perdeu a hora de contar."`,
  cena: { ambiente:'cidade', hora:'dia' },
  checkpoint: true,
  escolhas: [
    { txt:'Passar na padaria da Dona Benta-Cinco antes', ir:2 },
    { txt:'Visitar a oficina do ferreiro Seu Martelino', ir:4 },
    { txt:'Olhar o relógio parado de perto', ir:62 },
    { txt:'Ir direto pra porta da torre', ir:3 },
  ],
},
2: {
  texto: `A padaria cheira a pão quente — quer dizer, cheirava, porque com o tempo parado o pão nem sabe se está cru ou queimado. Dona Benta-Cinco te dá duas broas "por conta da casa" e cochicha:\n\n"Escuta, meu filho: o Cuco Gigante que guarda o topo tem PAVOR de despertador. Tenho um aqui que toca 'Parabéns pra você' fora do tom. Faço por 3 moedas de ouro."`,
  cena: { ambiente:'cidade', hora:'dia', props:['food/loaf.glb','food/croissant.glb','food/cake.glb'] },
  efeito: { provisoes: 2 },
  escolhas: [
    { txt:'Comprar o despertador (3 de ouro)', ir:5, cond:{ ouro:3 } },
    { txt:'Agradecer e seguir pra torre', ir:3 },
  ],
},
5: {
  texto: `Você paga as 3 moedas. O despertador é rosa, tem formato de galinha e quando você encosta ele grita "PARABÉNS PRA VOCÊÊÊ" num tom que faria um lobo pedir desculpas.\n\n"Cuidado", diz Dona Benta-Cinco, "ele só toca uma vez. Depois emburra."`,
  cena: { ambiente:'cidade', hora:'dia', props:['food/loaf.glb','food/egg.glb'] },
  efeito: { ouro:-3, item:'despertador' },
  escolhas: [ { txt:'Seguir pra torre', ir:3 } ],
},
4: {
  texto: `Seu Martelino, o ferreiro, está martelando uma bigorna sem nada em cima. "Estou treinando", explica. Ele olha pra você e pra sua espada de treino.\n\n"Vai pra torre, é? Leva isto." Ele mostra uma tampa de panela gigante com alça de couro. "Escudo de Primeira Linha. Aguenta golpe de dragão. Nunca testei com dragão, mas aguenta minha esposa jogando chinelo. 5 moedas."`,
  cena: { ambiente:'cidade', hora:'dia', props:['food/frying-pan.glb','food/pot-lid.glb','weapons/crate-medium.glb'] },
  escolhas: [
    { txt:'Comprar o escudo-tampa (5 de ouro)', ir:6, cond:{ ouro:5 } },
    { txt:'"Obrigado, mas prefiro levar minha panela mental." Ir pra torre', ir:3 },
  ],
},
6: {
  texto: `Você amarra o escudo-tampa no braço. Fica ridículo e ao mesmo tempo estranhamente heroico. Toda vez que você bate nele faz "TÓIM".\n\nSua HABILIDADE aumenta em 1 ponto (e também a sua fama na vila).`,
  cena: { ambiente:'cidade', hora:'dia', props:['food/pot-lid.glb'] },
  efeito: { ouro:-5, item:'escudo', habilidade:1 },
  escolhas: [ { txt:'Ir pra torre fazendo TÓIM', ir:3 } ],
},
62: {
  texto: `Você se aproxima do relógio parado. Os ponteiros marcam 12:34 — ou 4:03, dependendo de quanto você inclina a cabeça. Um bando de pombos mora dentro do número 6.\n\nUm deles te olha fixo. Você sente que algo vai acontecer. Teste a sua Sorte.`,
  cena: { ambiente:'cidade', hora:'dia', props:['city-roads/light-curved.glb'] },
  teste: { sorte:100, azar:101 },
},
100: {
  texto: `O pombo pisca pra você, entra no relógio e volta com uma moeda dourada brilhante no bico. "Grrru", diz ele, que em pombês quer dizer "toma, é sua". Você ganha 2 de ouro e 1 ponto de SORTE. Bom presságio!`,
  cena: { ambiente:'cidade', hora:'dia' },
  efeito: { ouro:2, sorte:1 },
  escolhas: [ { txt:'Ir pra porta da torre', ir:3 } ],
},
101: {
  texto: `O pombo pisca pra você... e faz o que pombos fazem. Bem na sua cabeça. Em termos de aventura, isso é 1 ponto de ENERGIA a menos, por puro constrangimento.`,
  cena: { ambiente:'cidade', hora:'dia' },
  efeito: { energia:-1 },
  escolhas: [ { txt:'Limpar a cabeça e ir pra torre', ir:3 } ],
},
3: {
  texto: `A porta da torre é enorme, de madeira, com uma boca de ferro que se mexe. "ALTO LÁ", diz a porta. "Só entra quem responde meu enigma:\n\n**Tenho ponteiros mas não aponto pra ninguém, tenho números mas não sei contar. Quem sou eu?**"`,
  cena: { ambiente:'cidade', hora:'tarde', props:['castle/door.glb'] },
  enigma: true,
  escolhas: [
    { txt:'"Um relógio!"', ir:7 },
    { txt:'"Um professor de matemática de férias!"', ir:8 },
    { txt:'"Uma bússola!"', ir:8 },
  ],
},
8: {
  texto: `"ERRADO", diz a porta, e te dá um choquinho de quem esfregou o pé no tapete. Você perde 2 pontos de ENERGIA.\n\n"Pensa direito. Tique... taque... tique... taque..."`,
  cena: { ambiente:'cidade', hora:'tarde', props:['castle/door.glb'] },
  efeito: { energia:-2 },
  escolhas: [ { txt:'Tentar de novo', ir:3 } ],
},
7: {
  texto: `"CERTO!" A porta se abre rangendo como avô levantando do sofá. Você entra num hall empoeirado. Um elevador quebrado, uma escada em espiral e um armário de zelador.\n\nAlgo pequeno e metálico corre por entre seus pés fazendo "tic-tic-tic". É um RATO-RELÓGIO: corpo de mola, bigodes de ponteiro, e muito, muito mau humor. Ele ataca!`,
  cena: { ambiente:'torre', hora:'tarde', monstro:'space/rover.glb', props:['furniture/bookcaseClosed.glb'] },
  combate: { nome:'Rato-Relógio', hab:5, eng:4, modelo:'space/rover.glb', ir:9 },
},
9: {
  texto: `O Rato-Relógio dá um último "tic" e desmonta em molas e parafusos. No ninho dele você acha 3 moedas de ouro e um bilhete que diz "TE PEGO NO PRÓXIMO ANDAR — ass.: o outro rato". Você decide não pensar nisso.`,
  cena: { ambiente:'torre', hora:'tarde', props:['furniture/bookcaseClosed.glb','furniture/cardboardBoxOpen.glb'] },
  efeito: { ouro:3 },
  checkpoint: true,
  escolhas: [
    { txt:'Subir pela escada em espiral', ir:10 },
    { txt:'Examinar o elevador quebrado', ir:11 },
    { txt:'Abrir o armário do zelador', ir:12 },
    { txt:'Ler o mural de avisos do zelador', ir:63 },
  ],
},
63: {
  texto: `O mural diz:\n\n"AVISO 1: Andar 1 é pré-histórico. Não alimente os ursos. Eles já comem bem.\nAVISO 2: No castelo do andar 2, o cavaleiro está dormindo desde 1623. NÃO PUXE A CORDA DO SINO.\nAVISO 3: O Relojoeiro está roubando as engrenagens antigas da torre. Quem achar as três (pedra, ferro e cristal) conserta o relógio de vez.\nAVISO 4: Alguém pegou meu iogurte da geladeira. Eu SEI quem foi."`,
  cena: { ambiente:'torre', hora:'tarde', props:['furniture/bookcaseOpen.glb','furniture/books.glb'] },
  escolhas: [ { txt:'Subir pela escada em espiral', ir:10 } ],
},
11: {
  texto: `O painel do elevador não tem números. Tem três botões: "ONTEM", "ANTEONTEM" e "QUANDO EU ERA CRIANÇA". Uma plaquinha avisa: "Enjoo temporal não é responsabilidade da administração."`,
  cena: { ambiente:'torre', hora:'tarde', props:['furniture/doorwayOpen.glb'] },
  escolhas: [
    { txt:'Apertar "ONTEM"', ir:13 },
    { txt:'Melhor não. Voltar pro hall', ir:9 },
  ],
},
13: {
  texto: `O elevador treme, gira, toca uma musiquinha ao contrário e cospe você numa clareira pré-histórica com cheiro de samambaia. Você perde 1 ponto de ENERGIA de enjoo temporal, mas pulou a escada toda. Ao longe, um rio brilha de um jeito... gelatinoso.`,
  cena: { ambiente:'floresta', hora:'dia' },
  efeito: { energia:-1 },
  escolhas: [ { txt:'Seguir pro rio gelatinoso', ir:20 } ],
},
12: {
  texto: `O armário do zelador está trancado com um cadeado tão velho que já virou avô de cadeado. Você puxa com força. Teste a sua Sorte.`,
  cena: { ambiente:'torre', hora:'tarde', props:['furniture/bookcaseClosedDoors.glb'] },
  teste: { sorte:14, azar:15 },
},
14: {
  texto: `O cadeado se abre! Dentro: uma lanterna de zelador (funciona!), 2 provisões em marmita e um espanador. Você deixa o espanador. Ninguém nunca precisou de espanador numa aventura.`,
  cena: { ambiente:'torre', hora:'tarde', props:['furniture/bookcaseOpen.glb','furniture/lampSquareTable.glb'] },
  efeito: { item:'lanterna', provisoes:2 },
  escolhas: [ { txt:'Subir pela escada em espiral', ir:10 } ],
},
15: {
  texto: `O cadeado não abre, mas o armário inteiro tomba em cima de você. Vassoura, balde e um rodo caem na sua cabeça em ordem alfabética. Você perde 1 ponto de ENERGIA e ganha um chapéu de balde temporário.`,
  cena: { ambiente:'torre', hora:'tarde', props:['furniture/trashcan.glb'] },
  efeito: { energia:-1 },
  escolhas: [ { txt:'Tirar o balde e subir a escada', ir:10 } ],
},
10: {
  texto: `A escada em espiral conta os degraus em voz alta enquanto você sobe: "Um... dois... três... catorze... banana..." Ela também perdeu a noção do tempo.\n\nO corrimão é longo, liso e MUITO convidativo.`,
  cena: { ambiente:'torre', hora:'tarde', props:['castle/stairs-stone.glb','furniture/stairs.glb'] },
  escolhas: [
    { txt:'Subir direitinho, como gente grande', ir:16 },
    { txt:'Escorregar no corrimão (WIIII!)', ir:83 },
  ],
},
83: {
  texto: `Você monta no corrimão e desce... quer dizer, SOBE escorregando, porque nesta torre até o corrimão anda pra trás no tempo. Teste a sua Sorte.`,
  cena: { ambiente:'torre', hora:'tarde', props:['castle/stairs-stone.glb'] },
  teste: { sorte:102, azar:84 },
},
102: {
  texto: `WIIIII! Você chega no andar de cima com o cabelo pra trás e um sorriso de orelha a orelha. A escada aplaude. Você ganha 1 ponto de SORTE por pura alegria de viver.`,
  cena: { ambiente:'floresta', hora:'dia' },
  efeito: { sorte:1 },
  escolhas: [ { txt:'Explorar o andar 1', ir:16 } ],
},
84: {
  texto: `O corrimão muda de ideia no meio do caminho e você desce de bunda até o hall de entrada. TUM. Você perde 2 pontos de ENERGIA e o respeito da escada.`,
  cena: { ambiente:'torre', hora:'tarde', props:['furniture/bookcaseClosed.glb'] },
  efeito: { energia:-2 },
  escolhas: [ { txt:'Subir de novo, agora andando', ir:10 } ],
},

// ============================== ANDAR 1 — HÁ MUUUITO TEMPO (pré-história) ==============================
16: {
  texto: `ANDAR 1: HÁ MUUUITO TEMPO. Você sai da escada numa floresta de samambaias do tamanho de ônibus. Uma libélula do tamanho de um cachorro passa zumbindo. Uma placa de pedra diz "CUIDADO: PASSADO ESCORREGADIO".\n\nÀ esquerda, a boca escura de uma caverna. À direita, o barulho de um rio. E ao fundo, um tambor tocando: TUM-tum-TUM-tum.\n\nEste lugar parece seguro para uma refeição.`,
  cena: { ambiente:'floresta', hora:'dia', props:['nature/sign.glb'] },
  checkpoint: true, comer: true,
  escolhas: [
    { txt:'Entrar na caverna', ir:17 },
    { txt:'Ir na direção do rio', ir:20 },
    { txt:'Seguir o barulho do tambor', ir:64 },
  ],
},
64: {
  texto: `Você chega numa aldeia de CASTORES PRÉ-HISTÓRICOS. Eles usam relógios de pedra no pulso e todos marcam horas diferentes. O chefe, Roedor Pontual, bate o tambor e anuncia:\n\n"Forasteiro! Temos raízes assadas por 3 moedas. Ou você pode participar da nossa Dança da Chuva. Não chove há 40 mil anos, mas a gente gosta de dançar."`,
  cena: { ambiente:'floresta', hora:'tarde', props:['nature/campfire_logs.glb','nature/tent_smallOpen.glb','nature/log_stack.glb'] },
  escolhas: [
    { txt:'Comprar raízes assadas (3 de ouro → 2 provisões)', ir:65, cond:{ ouro:3 } },
    { txt:'Participar da Dança da Chuva', ir:66 },
    { txt:'Agradecer e ir pro rio', ir:20 },
  ],
},
65: {
  texto: `As raízes assadas têm gosto de batata que estudou muito. Você guarda 2 provisões na mochila. Roedor Pontual te dá um tapinha na costa com a cauda e aponta pro rio: "Cuidado com a ponte. Ela é mais velha que a minha avó, e minha avó é uma pedra."`,
  cena: { ambiente:'floresta', hora:'tarde', props:['nature/campfire_logs.glb','food/carrot.glb'] },
  efeito: { ouro:-3, provisoes:2 },
  escolhas: [ { txt:'Ir pro rio', ir:20 } ],
},
66: {
  texto: `Os castores começam: TUM-tum-TUM-tum. Você entra na roda e faz o único passo de dança que conhece: o passinho do pai no churrasco. Teste a sua Sorte.`,
  cena: { ambiente:'floresta', hora:'tarde', props:['nature/campfire_logs.glb','nature/tent_smallOpen.glb'] },
  teste: { sorte:67, azar:68 },
},
67: {
  texto: `CHOVE! Pela primeira vez em 40 mil anos! Os castores choram de alegria (ou é a chuva, difícil dizer). Roedor Pontual te entrega uma flauta feita de osso de galinha gigante:\n\n"Essa flauta acalma qualquer coisa que balança. Use com sabedoria. Ou não, tanto faz, a gente tem mais."`,
  cena: { ambiente:'floresta', hora:'tarde', props:['nature/campfire_logs.glb'] },
  efeito: { item:'flauta', sorte:1 },
  escolhas: [ { txt:'Ir pro rio', ir:20 } ],
},
68: {
  texto: `Não chove. Em vez disso, um castor bebê aponta pra você e diz "papai dança igual". Todo mundo ri por 10 minutos. Você perde 1 ponto de SORTE de vergonha e sai da aldeia com dignidade (nenhuma).`,
  cena: { ambiente:'floresta', hora:'tarde', props:['nature/campfire_logs.glb'] },
  efeito: { sorte:-1 },
  escolhas: [ { txt:'Ir pro rio, rápido', ir:20 } ],
},
17: {
  texto: `A caverna é escura como o quarto de um adolescente. Você ouve gotas pingando e um ronco baixo lá no fundo. Um ronco GRANDE.`,
  cena: { ambiente:'caverna', hora:'noite' },
  escolhas: [
    { txt:'Acender a lanterna e entrar', ir:18, cond:{ item:'lanterna' } },
    { txt:'Entrar no escuro mesmo, sou corajoso', ir:19 },
    { txt:'Voltar e improvisar uma tocha', ir:85, cond:{ semItem:'lanterna' } },
  ],
},
85: {
  texto: `Você pega um graveto, enrola com folha de samambaia e passa um pouco de manteiga da sua marmita (usa 1 provisão). Fricção, faísca e... TOCHA! Você se sente um homem das cavernas. Que sabe fazer manteiga.`,
  cena: { ambiente:'floresta', hora:'tarde', props:['nature/log.glb','nature/campfire_stones.glb'] },
  efeito: { item:'lanterna', provisoes:-1 },
  escolhas: [ { txt:'Voltar pra caverna com a tocha', ir:17 } ],
},
18: {
  texto: `A luz revela pinturas rupestres nas paredes: homens das cavernas caçando, um mamute... e um desenho da Torre do Relógio, com uma ENGRENAGEM DE PEDRA escondida atrás de uma rocha solta. Você empurra a rocha e lá está ela, quentinha de tanto tempo.\n\nO ronco vem de um urso enorme dormindo num canto. Você passa na ponta dos pés.`,
  cena: { ambiente:'caverna', hora:'noite', props:['nature/rock_largeA.glb','car/debris-nut.glb','furniture/bear.glb'] },
  efeito: { item:'engrenagem_pedra' },
  escolhas: [ { txt:'Seguir pro fundo da caverna', ir:21 } ],
},
19: {
  texto: `Você tropeça em algo grande, peludo e quente. O algo acorda. É o URSO DAS CAVERNAS FOFINHO — o nome é fofinho, o urso não. Ele levanta nas patas traseiras e ruge com bafo de 10 mil anos sem escovar os dentes.\n\nVocê pode fugir de volta pra clareira (perde 2 de ENERGIA na fuga).`,
  cena: { ambiente:'caverna', hora:'noite', monstro:'furniture/bear.glb' },
  combate: { nome:'Urso das Cavernas Fofinho', hab:6, eng:7, modelo:'furniture/bear.glb', fuga:16, ir:21 },
},
21: {
  texto: `No fundo da caverna, o teto abre num poço natural com raízes que servem de escada. Lá em cima, você vê pedras cinzentas e uma bandeira tremulando: o próximo andar.\n\nTambém tem um buraco no chão soprando um vento quente pra cima. Um atalho, talvez?`,
  cena: { ambiente:'caverna', hora:'noite', props:['nature/cliff_steps_stone.glb','nature/hanging_moss.glb'] },
  escolhas: [
    { txt:'Subir pelas raízes', ir:26 },
    { txt:'Pular no buraco de vento quente', ir:69 },
  ],
},
69: {
  texto: `Você pula. O vento te sopra pra cima como um saco plástico num dia de feira. Você gira, gira, gira... e vê uma janela do castelo se aproximando. Teste a sua Sorte.`,
  cena: { ambiente:'caverna', hora:'noite' },
  teste: { sorte:70, azar:71 },
},
70: {
  texto: `Você entra pela janela e cai sentadinho numa cadeira, bem em frente a uma mesa de banquete. Um cavaleiro de armadura ronca do outro lado do salão. Que pontaria!`,
  cena: { ambiente:'castelo', hora:'tarde', props:['furniture/tableCloth.glb','food/turkey.glb'] },
  escolhas: [ { txt:'Olhar a mesa de banquete', ir:29 } ],
},
71: {
  texto: `Você entra pela janela e cai em cima de uma armadura vazia, que despenca com o barulho de 40 panelas. Perde 2 pontos de ENERGIA. O cavaleiro que dormia do outro lado do salão... não dorme mais.`,
  cena: { ambiente:'castelo', hora:'tarde', props:['food/pot.glb','food/pan.glb'] },
  efeito: { energia:-2 },
  escolhas: [ { txt:'Ai.', ir:28 } ],
},
20: {
  texto: `O rio não é de água. É de GELATINA verde, tremelicando devagar. Peixes de gelatina pulam e fazem "blob". Uma ponte de troncos velhíssimos atravessa o rio, rangendo mesmo sem ninguém em cima.\n\nVocê pisa no primeiro tronco. Teste a sua Sorte.`,
  cena: { ambiente:'floresta', hora:'dia', props:['nature/bridge_wood.glb','nature/lily_large.glb'] },
  teste: { sorte:22, azar:23 },
},
22: {
  texto: `Você atravessa a ponte fazendo equilíbrio de bailarina. Do outro lado, num ninho de folhas, tem um OVO gigante, cor de céu, com pintinhas. Ele se mexe um pouquinho. "Tic... tic..."`,
  cena: { ambiente:'floresta', hora:'dia', props:['food/egg.glb','nature/plant_bushLarge.glb'] },
  escolhas: [
    { txt:'Pegar o ovo e aquecer no casaco', ir:24 },
    { txt:'Pescar no rio de gelatina', ir:86 },
    { txt:'Deixar o ovo em paz e seguir a trilha', ir:25 },
  ],
},
86: {
  texto: `Você usa a espada como vara e um cadarço como linha. Peixes de gelatina são curiosos mas não muito espertos. Teste a sua Sorte.`,
  cena: { ambiente:'floresta', hora:'dia', props:['nature/bridge_wood.glb','food/fish.glb'] },
  teste: { sorte:103, azar:104 },
},
103: {
  texto: `Você pesca um peixe-gelatina de morango! Ele tem gosto de sobremesa e textura de sobremesa porque, sejamos honestos, ele É sobremesa. Você ganha 1 provisão e este lugar é seguro para comer.`,
  cena: { ambiente:'floresta', hora:'dia', props:['food/fish.glb','food/pudding.glb'] },
  efeito: { provisoes:1 }, comer: true,
  escolhas: [ { txt:'Seguir a trilha', ir:25 } ],
},
104: {
  texto: `O peixe-gelatina morde sua isca, sua linha, sua vara e o seu dedo, nessa ordem. Não dói muito, mas gruda. Você perde 1 ponto de ENERGIA e o cadarço.`,
  cena: { ambiente:'floresta', hora:'dia', props:['food/fish.glb'] },
  efeito: { energia:-1 },
  escolhas: [ { txt:'Seguir a trilha com o sapato solto', ir:25 } ],
},
24: {
  texto: `Você embrulha o ovo no casaco. Ele esquenta, treme e CRACK! Sai um filhote de CUCO, do tamanho de um gatinho, todo despenado, que olha pra você e diz: "CU-cu?"\n\nEle acha que você é a mãe dele. Agora você tem um Cuquinho que te segue por toda a torre fazendo "cu-cu" a cada 15 minutos. Fofo. Barulhento, mas fofo.`,
  cena: { ambiente:'floresta', hora:'dia', props:['food/egg-half.glb','nature/plant_bushLarge.glb'] },
  efeito: { item:'cuquinho' },
  escolhas: [ { txt:'Seguir a trilha com o Cuquinho', ir:25 } ],
},
23: {
  texto: `O tronco quebra e você cai no rio de gelatina. BLOB. Você afunda devagar, muito devagar, com tempo de sobra pra pensar nas suas escolhas. Perde 3 pontos de ENERGIA.\n\nNo fundo, entre os peixes, você encontra 2 moedas de ouro que algum aventureiro azarado deixou cair. Sai do outro lado do rio, verde e brilhante.`,
  cena: { ambiente:'floresta', hora:'dia', props:['nature/lily_large.glb','nature/lily_small.glb'] },
  efeito: { energia:-3, ouro:2 },
  escolhas: [ { txt:'Seguir a trilha, chacoalhando', ir:25 } ],
},
25: {
  texto: `A trilha sobe um vulcãozinho de brinquedo que solta fumacinha de mentira. No topo, bloqueando a passagem, está o LAGARTÃO ATRASADO — um lagarto verde e enorme com um relógio de pulso em cada uma das quatro patas, todos atrasados.\n\n"Você está ATRASADO", ele sibila, olhando pros relógios. "Ou adiantado. Não sei. Vou te morder por precaução."\n\nVocê pode fugir de volta pra clareira (perde 2 de ENERGIA).`,
  cena: { ambiente:'floresta', hora:'tarde', monstro:'space/alien.glb', props:['nature/rock_tallA.glb'] },
  combate: { nome:'Lagartão Atrasado', hab:7, eng:8, modelo:'space/alien.glb', fuga:16, ir:105 },
},
105: {
  texto: `O Lagartão desiste, olha pro relógio e diz "Ah, é minha hora do cochilo" e dorme na hora. Atrás dele, uma escada de ossos de dinossauro leva pro andar de cima. Você sobe pulando de costela em costela.`,
  cena: { ambiente:'floresta', hora:'tarde', props:['space/bones.glb','nature/rock_tallA.glb'] },
  escolhas: [ { txt:'Subir a escada de ossos', ir:26 } ],
},

// ============================== ANDAR 2 — IDADE MÉDIA (castelo) ==============================
26: {
  texto: `ANDAR 2: IDADE MÉDIA, MAIS OU MENOS. Você entra num salão de castelo com bandeiras rasgadas, uma mesa de banquete e tochas que acendem sozinhas quando você passa (o castelo é medieval, mas moderno).\n\nNo meio do salão, em pé, um CAVALEIRO DE ARMADURA ENFERRUJADA ronca dentro do elmo. Cada ronco faz um "frrrr... TÓIM". Ao lado dele, uma corda de sino balança. Uma plaquinha diz "NÃO PUXE".`,
  cena: { ambiente:'castelo', hora:'tarde', props:['furniture/tableCloth.glb','castle/flag-banner-long.glb','characters/character-k.glb'] },
  checkpoint: true,
  escolhas: [
    { txt:'Passar na ponta dos pés', ir:27 },
    { txt:'Acordar o cavaleiro educadamente', ir:28 },
    { txt:'Examinar a mesa de banquete', ir:29 },
    { txt:'Ir pra cozinha (tem cheiro de sopa)', ir:72 },
    { txt:'Puxar a corda do sino (a placa diz NÃO)', ir:90 },
  ],
},
90: {
  texto: `Você puxa a corda. PLÉÉÉÉÉÉM. O sino é tão alto que os morcegos do telhado caem de sono, a sopa da cozinha ferve sozinha e você perde 1 ponto de SORTE por não saber ler placas.\n\nO cavaleiro acorda com um pulo: "QUEM OUSA?!"`,
  cena: { ambiente:'castelo', hora:'tarde', props:['castle/flag-banner-long.glb','characters/character-k.glb'] },
  efeito: { sorte:-1 },
  escolhas: [ { txt:'"Foi o vento!"', ir:28 } ],
},
27: {
  texto: `Você avança pelo tapete na ponta dos pés, como quem levanta de madrugada pra comer bolo escondido. A armadura range... o ronco para... Teste a sua Sorte.`,
  cena: { ambiente:'castelo', hora:'tarde', props:['characters/character-k.glb','furniture/rugRectangle.glb'] },
  teste: { sorte:30, azar:28 },
},
28: {
  texto: `O elmo se abre com um CLANG e uma voz enferrujada sai lá de dentro: "Quem ousa acordar Sir Ranger de Ferrugópolis?! Eu dormia há 400 anos! Estava no MELHOR SONHO! Com pudim!"\n\nEle levanta a espada (que range), o escudo (que range) e o joelho (que range mais). Combate! Você pode fugir pra mesa de banquete (perde 2 de ENERGIA).`,
  cena: { ambiente:'castelo', hora:'tarde', monstro:'characters/character-k.glb', props:['castle/flag-banner-long.glb'] },
  combate: { nome:'Sir Ranger de Ferrugópolis', hab:8, eng:8, modelo:'characters/character-k.glb', fuga:29, ir:31 },
},
31: {
  texto: `Sir Ranger senta no chão, ofegante. "Ufa... bom combate, jovem. Me deixou desenferrujado! Faz séculos que eu não me mexia tanto." Ele tira do cinto um frasquinho.\n\n"Óleo Anti-Ferrugem. Não uso, porque acho charmoso ranger. Mas pode te servir contra algo... metálico." Ele pisca com o olho que ainda abre.`,
  cena: { ambiente:'castelo', hora:'tarde', props:['characters/character-k.glb','food/bottle-oil.glb'] },
  efeito: { item:'oleo' },
  escolhas: [ { txt:'Agradecer e ir pra escadaria', ir:30 } ],
},
29: {
  texto: `A mesa de banquete está posta há 400 anos. O peru virou fóssil, o vinho virou vinagre e o vinagre virou pó. Mas, dentro de um pote lacrado com cera, você encontra biscoitos de castelo ainda crocantes (+1 provisão).\n\nNa ponta da mesa, um BAÚ com cadeado de pergunta. Este é um bom lugar para comer.`,
  cena: { ambiente:'castelo', hora:'tarde', props:['furniture/tableCloth.glb','food/turkey.glb','pirate/chest.glb'] },
  efeito: { provisoes:1 }, comer: true,
  escolhas: [
    { txt:'Tentar abrir o baú', ir:32 },
    { txt:'Ir pra escadaria', ir:30 },
  ],
},
32: {
  texto: `O cadeado do baú tem uma boquinha que fala: "Responda e eu abro:\n\n**Quanto mais você tira de mim, maior eu fico. O que sou eu?**"`,
  cena: { ambiente:'castelo', hora:'tarde', props:['pirate/chest.glb'] },
  enigma: true,
  escolhas: [
    { txt:'"Um buraco!"', ir:35 },
    { txt:'"O sono do meu pai no domingo!"', ir:36 },
    { txt:'"Uma mochila ao contrário!"', ir:36 },
  ],
},
35: {
  texto: `"Correto!" O baú se abre. Dentro: 8 moedas de ouro e uma ENGRENAGEM DE FERRO, pesada e com o brasão da torre. O cadeado sussurra: "Agora tem duas. Falta a de cristal, lá em cima. Não conta pra ninguém que eu falei."`,
  cena: { ambiente:'castelo', hora:'tarde', props:['pirate/chest.glb','car/debris-nut.glb'] },
  efeito: { ouro:8, item:'engrenagem_ferro' },
  escolhas: [ { txt:'Ir pra escadaria', ir:30 } ],
},
36: {
  texto: `"ERRADO", diz o baú, e te dá uma mordidinha no dedo. Você perde 2 pontos de ENERGIA. O baú fecha os olhos e finge que é um baú normal.`,
  cena: { ambiente:'castelo', hora:'tarde', props:['pirate/chest.glb'] },
  efeito: { energia:-2 },
  escolhas: [ { txt:'Voltar pra mesa', ir:29 } ],
},
72: {
  texto: `Na cozinha, uma panela borbulha sozinha. Um FANTASMA de chapéu de cozinheiro flutua sobre ela: Chef Boo. "Bem-vindo! Sopa de abóbora fantasma. Está aqui há 400 anos, mas fantasma não estraga."\n\nEle oferece uma tigela (você pode comer aqui) e ainda vende 3 provisões pra viagem por 2 moedas.`,
  cena: { ambiente:'castelo', hora:'noite', props:['food/pot-stew.glb','food/pumpkin.glb','furniture/kitchenStove.glb'] },
  comer: true,
  escolhas: [
    { txt:'Comprar 3 provisões (2 de ouro)', ir:106, cond:{ ouro:2 } },
    { txt:'Agradecer e voltar pro salão', ir:29 },
  ],
},
106: {
  texto: `Chef Boo embrulha três marmitas fantasmas. São transparentes, mas pesam e alimentam. "Diga ao Cavaleiro que a sopa dele está pronta. Desde 1623."`,
  cena: { ambiente:'castelo', hora:'noite', props:['food/pot-stew.glb','food/bowl-soup.glb'] },
  efeito: { ouro:-2, provisoes:3 },
  escolhas: [ { txt:'Voltar pro salão', ir:29 } ],
},
30: {
  texto: `A escadaria se divide em duas. À esquerda, uma porta com um SOL entalhado e uma ampulheta gigante ao lado. À direita, uma porta com uma LUA, de onde sai um "tic... TAC... tic... TAC" lento e pesado.\n\nAtrás de uma tapeçaria de unicórnio, você nota uma terceira porta, pequena e escondida.`,
  cena: { ambiente:'castelo', hora:'tarde', props:['castle/door.glb','castle/stairs-stone-square.glb'] },
  escolhas: [
    { txt:'Porta do Sol', ir:33 },
    { txt:'Porta da Lua', ir:34 },
    { txt:'Porta escondida atrás da tapeçaria', ir:73 },
  ],
},
73: {
  texto: `A Sala das Armaduras! Fileiras de armaduras vazias e um cabideiro de armas. Uma plaquinha diz "PEGUE SÓ UMA. A ÚLTIMA PESSOA PEGOU DUAS E FICOU COM DOR NAS COSTAS."`,
  cena: { ambiente:'castelo', hora:'noite', props:['furniture/coatRackStanding.glb','characters/character-k.glb','castle/flag.glb'] },
  escolhas: [
    { txt:'Espada de treino equilibrada (HABILIDADE +1)', ir:107, efeito:{ habilidade:1, item:'espada' } },
    { txt:'Elmo com almofada dentro (ENERGIA +3)', ir:107, efeito:{ energia:3 } },
    { txt:'Pé de coelho de armadura (SORTE +2)', ir:107, efeito:{ sorte:2 } },
  ],
},
107: {
  texto: `Você sai da Sala das Armaduras se sentindo mais pronto. As armaduras vazias fazem uma continência lenta e enferrujada. Você retribui. Ninguém precisa saber.`,
  cena: { ambiente:'castelo', hora:'noite', props:['castle/door.glb'] },
  escolhas: [
    { txt:'Porta do Sol', ir:33 },
    { txt:'Porta da Lua', ir:34 },
  ],
},
33: {
  texto: `A Porta do Sol só abre de dia — e dentro da torre é sempre a hora que ela quiser. Você vira a ampulheta gigante ao lado: a areia corre pra cima e, pela janela, a lua vai embora e o sol nasce em 3 segundos. A porta abre.\n\nLá dentro, uma biblioteca de pergaminhos. E no meio dela, um redemoinho cinza que tosse: POEIRA-VIVA, o monstro que se forma quando ninguém limpa uma estante por 400 anos.\n\n"ATCHIM", diz ele, ameaçador. Você pode fugir pra escadaria (perde 2 de ENERGIA).`,
  cena: { ambiente:'castelo', hora:'dia', monstro:'space/rock_crystals.glb', props:['furniture/bookcaseOpen.glb','furniture/books.glb'] },
  combate: { nome:'Poeira-Viva', hab:6, eng:6, modelo:'space/rock_crystals.glb', fuga:30, ir:37 },
},
37: {
  texto: `A Poeira-Viva se dissolve num último espirro. Nas estantes, você encontra um pergaminho com o título "SEGREDOS DO RELOJOEIRO (não ler)". Você lê:\n\n"O Relojoeiro Tique-Taque para de se mexer quando ouve um despertador. Ele odeia acordar. Também odeia terça-feira. E o seu Cuco Gigante só obedece a um cuco de verdade."\n\nSaber das coisas dá sorte: você ganha 2 pontos de SORTE.`,
  cena: { ambiente:'castelo', hora:'dia', props:['furniture/bookcaseOpen.glb','furniture/books.glb','furniture/desk.glb'] },
  efeito: { sorte:2 },
  escolhas: [ { txt:'Seguir pela escada em caracol atrás da estante', ir:38 } ],
},
34: {
  texto: `A Porta da Lua abre pra uma torre alta e escura. No meio, balançando de um lado pro outro, um PÊNDULO gigante de bronze com uma cara mal-humorada: o PENDULÃO. Ele guarda a escada pro andar de cima.\n\n"Tic... TAC... não vai passar... tic... TAC..." Você pode fugir pra escadaria (perde 2 de ENERGIA).`,
  cena: { ambiente:'castelo', hora:'noite', monstro:'@pendulo', props:['castle/stairs-stone.glb'] },
  combate: { nome:'Pendulão', hab:7, eng:7, modelo:'@pendulo', fuga:30, ir:38 },
  escolhasAntes: [
    { txt:'Tocar a flauta de osso pro Pendulão', ir:74, cond:{ item:'flauta' } },
  ],
},
74: {
  texto: `Você toca a flauta. Sai um som parecido com um pato tentando cantar ópera. O Pendulão balança mais devagar... mais devagar... e para, hipnotizado, com um sorriso bobo.\n\n"Zzzz... tic... zzzz..." Você passa por baixo dele e sobe a escada.`,
  cena: { ambiente:'castelo', hora:'noite', props:['castle/stairs-stone.glb'] },
  efeito: { sorte:1 },
  escolhas: [ { txt:'Subir a escada em caracol', ir:38 } ],
},
38: {
  texto: `A escada em caracol sobe, sobe e sobe. As paredes de pedra vão virando metal. As tochas viram lâmpadas. As lâmpadas viram luzes neon. Você ouve uma voz robótica dizer "BEM-VINDO AO ANO 3026. POR FAVOR, NÃO TOQUE EM NADA. VOCÊ VAI TOCAR, NÉ?"`,
  cena: { ambiente:'futuro', hora:'noite', props:['space/stairs.glb'] },
  escolhas: [ { txt:'Entrar no andar 3', ir:39 } ],
},

// ============================== ANDAR 3 — ANO 3026 (futuro) ==============================
39: {
  texto: `ANDAR 3: ANO 3026. Um corredor de metal brilhante com luzes azuis. Um robô-aspirador passa correndo, bate na parede, pede desculpa e continua. Pela janela, carros voadores presos num engarrafamento voador.\n\nÀ frente, o corredor principal. À esquerda, uma porta com a placa "LABORATÓRIO — NÃO APERTE O BOTÃO VERMELHO". À direita, uma estação de monotrilho.`,
  cena: { ambiente:'futuro', hora:'noite' },
  checkpoint: true,
  escolhas: [
    { txt:'Seguir pelo corredor principal', ir:40 },
    { txt:'Entrar no laboratório', ir:41 },
    { txt:'Pegar o monotrilho', ir:42 },
    { txt:'Perguntar o caminho pro robô-aspirador', ir:75 },
  ],
},
75: {
  texto: `O robô-aspirador para, gira duas vezes e diz: "01000011 01010101 01000011 01001111". Você não fala binário. Ele repete mais devagar: "zeeeero... uuuum...". Você agradece. Ele suga seu cadarço e vai embora.\n\n(Se você conhecesse binário, saberia que ele disse "CUCO". Mas você não sabe. Fica a dica.)`,
  cena: { ambiente:'futuro', hora:'noite', props:['space/rover.glb'] },
  escolhas: [ { txt:'Seguir pelo corredor principal', ir:40 } ],
},
40: {
  texto: `No meio do corredor, uma engrenagem gigante com olhos e dentes de metal rola na sua direção: o ENGRENAGO. Ele gira, faz faísca e grita "ROTAÇÃO! ROTAÇÃO!" porque é a única palavra que sabe.\n\nVocê pode fugir de volta pra entrada (perde 2 de ENERGIA).`,
  cena: { ambiente:'futuro', hora:'noite', monstro:'car/debris-nut.glb' },
  combate: { nome:'Engrenago', hab:7, eng:9, modelo:'car/debris-nut.glb', fuga:39, ir:44 },
  escolhasAntes: [
    { txt:'Jogar o Óleo Anti-Ferrugem no chão', ir:43, cond:{ item:'oleo' } },
  ],
},
43: {
  texto: `Você espirra o óleo no chão. O Engrenago tenta frear, patina, gira de lado, gira de cabeça pra baixo e desliza pelo corredor até cair num duto de ventilação. "ROTAÇÃÃÃÃO..." ecoa lá de baixo.\n\nVitória sem um arranhão! Você ganha 1 ponto de SORTE e o óleo acabou.`,
  cena: { ambiente:'futuro', hora:'noite', props:['food/bottle-oil.glb'] },
  efeito: { sorte:1, removeItem:'oleo' },
  escolhas: [ { txt:'Seguir até o fim do corredor', ir:44 } ],
},
41: {
  texto: `O laboratório está cheio de tubos, telas e um botão vermelho ENORME com a placa "NÃO". No meio, um robô alto e enferrujado acende os olhos: FERRUGINO 3000.\n\n"VISITANTE DETECTADO. PARA PASSAR, RESPONDA: **Estou sempre à sua frente, mas você nunca me alcança. Quem sou eu?**"`,
  cena: { ambiente:'futuro', hora:'noite', props:['space/desk_computerScreen.glb','space/machine_generator.glb','space/astronautB.glb'] },
  enigma: true,
  escolhas: [
    { txt:'"O amanhã!"', ir:45 },
    { txt:'"Minha sombra!"', ir:46 },
    { txt:'"O Wi-Fi da minha casa!"', ir:46 },
    { txt:'Apertar o botão vermelho', ir:87 },
  ],
},
45: {
  texto: `"CORRETO. VOCÊ É MAIS ESPERTO QUE 87% DOS VISITANTES. O OUTRO 13% ERAM ROBÔS-ASPIRADORES." Ferrugino 3000 abre um compartimento no peito e te entrega uma Poção de Bateria: você recupera 4 pontos de ENERGIA.\n\nEle também aponta um atalho: "A SALA DAS CÁPSULAS FICA ALI. NÃO ENTRE NAS CÁPSULAS. VOCÊ VAI ENTRAR, NÉ?"`,
  cena: { ambiente:'futuro', hora:'noite', props:['space/astronautB.glb','space/machine_barrel.glb'] },
  efeito: { energia:4 },
  escolhas: [ { txt:'Ir pra Sala das Cápsulas', ir:44 } ],
},
46: {
  texto: `"ERRADO. INICIANDO MODO... CÓCEGAS." Ferrugino 3000 estende dois braços com dedos de metal que se mexem rapidinho. Você não quer saber como são cócegas de robô. Combate!\n\nVocê pode fugir pra entrada (perde 2 de ENERGIA).`,
  cena: { ambiente:'futuro', hora:'noite', monstro:'space/astronautB.glb', props:['space/desk_computerScreen.glb'] },
  combate: { nome:'Ferrugino 3000', hab:9, eng:9, modelo:'space/astronautB.glb', fuga:39, ir:47 },
},
47: {
  texto: `Ferrugino 3000 cai, pisca, e reinicia: "REINICIANDO... OLÁ! SOU FERRUGINO 3000. VOCÊ É MEU MELHOR AMIGO. TOME 5 MOEDAS DE OURO." Ele não lembra de nada. Você aceita o ouro e o abraço de metal (gelado).`,
  cena: { ambiente:'futuro', hora:'noite', props:['space/astronautB.glb'] },
  efeito: { ouro:5 },
  escolhas: [ { txt:'Ir pra Sala das Cápsulas', ir:44 } ],
},
87: {
  texto: `Você aperta o botão vermelho. Claro que aperta. Luzes piscam, uma sirene toca "uí-uí-uí" e um teletransportador te suga. Teste a sua Sorte.`,
  cena: { ambiente:'futuro', hora:'noite', props:['space/machine_generatorLarge.glb'] },
  teste: { sorte:108, azar:88 },
},
108: {
  texto: `ZIP! Você reaparece direto na Sala das Cápsulas do Tempo, do outro lado do Engrenago, que ainda te procura pelo corredor gritando "ROTAÇÃO?". Atalho perfeito.`,
  cena: { ambiente:'futuro', hora:'noite', props:['space/machine_barrelLarge.glb'] },
  escolhas: [ { txt:'Explorar a Sala das Cápsulas', ir:44 } ],
},
88: {
  texto: `ZIP! Você reaparece na SALA DAS MEIAS PERDIDAS. Milhões de meias, uma de cada par, de todas as épocas. Lá no fundo, você reconhece a sua meia de dinossauro que sumiu quando você tinha 6 anos.\n\nVocê a coloca no bolso, emocionado. Ganha 1 ponto de SORTE. O mistério das meias está resolvido; a humanidade nunca vai saber.`,
  cena: { ambiente:'futuro', hora:'noite', props:['furniture/cardboardBoxOpen.glb','furniture/cardboardBoxClosed.glb','furniture/washer.glb'] },
  efeito: { sorte:1 },
  escolhas: [ { txt:'Sair pela porta dos fundos, de volta ao corredor', ir:39 } ],
},
42: {
  texto: `O monotrilho chega flutuando, silencioso. A porta abre e uma voz diz: "PRÓXIMA ESTAÇÃO: DEPENDE." Você entra. O trem acelera. Teste a sua Sorte.`,
  cena: { ambiente:'futuro', hora:'noite', props:['space/monorail_trainFront.glb','space/monorail_trackStraight.glb'] },
  teste: { sorte:48, azar:49 },
},
48: {
  texto: `"ESTAÇÃO: SALA DAS CÁPSULAS DO TEMPO. OBRIGADO POR VIAJAR CONOSCO. NÃO ESQUEÇA SEUS PERTENCES NEM SUAS DÉCADAS." Você desce exatamente onde queria. O monotrilho pisca os faróis e vai embora.`,
  cena: { ambiente:'futuro', hora:'noite', props:['space/monorail_trainPassenger.glb'] },
  escolhas: [ { txt:'Explorar a Sala das Cápsulas', ir:44 } ],
},
49: {
  texto: `"ESTAÇÃO: ONTEM." O monotrilho sai pela janela, dá uma volta na torre e te deixa... de volta na escadaria do castelo, andar 2. Você perde 2 pontos de ENERGIA de frustração temporal. O trem ainda diz "VOLTE SEMPRE" com a maior cara de pau.`,
  cena: { ambiente:'castelo', hora:'tarde', props:['castle/door.glb'] },
  efeito: { energia:-2 },
  escolhas: [ { txt:'Subir tudo de novo', ir:30 } ],
},
44: {
  texto: `A SALA DAS CÁPSULAS DO TEMPO. Cápsulas de vidro em fila, cada uma com uma data. No centro, numa vitrine com alarme, uma ENGRENAGEM DE CRISTAL brilha em azul. O alarme está com uma nota colada: "quebrado, consertar em 3027".\n\nVocê pega a engrenagem. Um elevador de luz sobe pro topo da torre.`,
  cena: { ambiente:'futuro', hora:'noite', props:['space/machine_barrelLarge.glb','space/rock_crystalsLargeA.glb','space/machine_barrel.glb'] },
  efeito: { item:'engrenagem_cristal' },
  escolhas: [
    { txt:'Subir no elevador de luz', ir:50 },
    { txt:'Entrar numa cápsula do tempo, só pra ver', ir:76 },
  ],
},
76: {
  texto: `Você entra numa cápsula marcada "???". A porta fecha, tudo gira, e você vê... o futuro? o passado? um documentário sobre pinguins? Teste a sua Sorte.`,
  cena: { ambiente:'futuro', hora:'noite', props:['space/machine_barrelLarge.glb'] },
  teste: { sorte:77, azar:78 },
},
77: {
  texto: `Você vê o futuro: você mesmo, no topo da torre, levantando o Coração do Relógio enquanto a vila comemora. Também vê que vai chover na quinta. Sair da cápsula sabendo que vai dar certo te dá 2 pontos de SORTE.`,
  cena: { ambiente:'futuro', hora:'noite', props:['space/machine_barrelLarge.glb'] },
  efeito: { sorte:2 },
  escolhas: [ { txt:'Subir no elevador de luz', ir:50 } ],
},
78: {
  texto: `A cápsula te transforma em bebê por 5 segundos. Você chora, faz xixi e volta ao normal, mas com fralda. Perde 2 pontos de ENERGIA e um pouco de orgulho. A fralda você tira antes de continuar. Ou não. Ninguém vai ver.`,
  cena: { ambiente:'futuro', hora:'noite', props:['space/machine_barrelLarge.glb'] },
  efeito: { energia:-2 },
  escolhas: [ { txt:'Subir no elevador de luz', ir:50 } ],
},

// ============================== TOPO — A SALA DO RELÓGIO PERDIDO ==============================
50: {
  texto: `O TOPO DA TORRE. Uma sala redonda, com o mecanismo gigante do Relógio: engrenagens do tamanho de rodas-gigantes, todas paradas. No centro, um buraco em forma de coração, vazio.\n\nUma risada sai das sombras: "Hê hê hê... chegou tarde. Ou cedo. Aqui não faz diferença!" É o RELOJOEIRO TIQUE-TAQUE, de cartola, com o Coração do Relógio brilhando no bolso do colete.\n\n"Sem tempo, ninguém precisa dormir cedo, ninguém tem prazo, ninguém chega atrasado! Sou um herói! E você é um chato! CUCO, ATACA!"\n\nDe uma casinha gigante sai o CUCO GIGANTE, um pássaro de madeira com asas que rangem e um bico que abre e fecha fazendo CU-CU. (Você pode comer aqui antes, se ele deixar.)`,
  cena: { ambiente:'torre', hora:'noite', monstro:'@cuco', props:['characters/character-r.glb','car/debris-nut.glb'] },
  checkpoint: true, comer: true,
  escolhas: [
    { txt:'Ligar o despertador da Dona Benta-Cinco', ir:51, cond:{ item:'despertador' } },
    { txt:'Soltar o Cuquinho', ir:52, cond:{ item:'cuquinho' } },
    { txt:'Tentar conversar com o Cuco', ir:80 },
    { txt:'Lutar contra o Cuco Gigante', ir:53 },
  ],
},
51: {
  texto: `PARABÉNS PRA VOCÊÊÊÊ! O despertador-galinha grita fora do tom. O Cuco Gigante para no ar, treme, tapa os ouvidos com as asas e volta correndo pra casinha, batendo a portinha. "CU... cu..." diz ele lá de dentro, ofendido.\n\nO Relojoeiro fica paralisado com a mão no ouvido: "AAAH, DESPERTADOR! ODEIO!" Você ganha 1 ponto de SORTE. O despertador emburra e não toca mais.`,
  cena: { ambiente:'torre', hora:'noite', props:['characters/character-r.glb','food/egg.glb'] },
  efeito: { sorte:1, removeItem:'despertador' },
  escolhas: [ { txt:'Encarar o Relojoeiro', ir:54 } ],
},
52: {
  texto: `Você solta o Cuquinho. Ele olha pro Cuco Gigante, arrepia as peninhas e grita: "CU-CU! MAMÃE!"\n\nO Cuco Gigante para. Olha. Os olhos de madeira ficam brilhantes. "Cu... cu?" Ele desce, pega o filhote com o bico delicadamente, e sai voando pela janela, feliz, rangendo as asas. Os dois vão embora pra sempre. Você chora um pouquinho. Foi bonito.`,
  cena: { ambiente:'torre', hora:'noite', props:['characters/character-r.glb'] },
  efeito: { removeItem:'cuquinho', sorte:1 },
  escolhas: [ { txt:'Encarar o Relojoeiro', ir:54 } ],
},
80: {
  texto: `"Senhor Cuco", você diz, "eu sei que você não quer isso. Você quer marcar as horas de novo, cantar ao meio-dia, ser útil." O Cuco Gigante para e inclina a cabeça de madeira. Teste a sua Sorte.`,
  cena: { ambiente:'torre', hora:'noite', monstro:'@cuco' },
  teste: { sorte:109, azar:110 },
},
109: {
  texto: `O Cuco pensa. Range. E dá meia-volta, entrando na casinha por vontade própria. "Cu-cu", diz baixinho, que quer dizer "tá bom, vai lá". O Relojoeiro fica boquiaberto: "TRAIDOR DE MADEIRA!"`,
  cena: { ambiente:'torre', hora:'noite', props:['characters/character-r.glb'] },
  escolhas: [ { txt:'Encarar o Relojoeiro', ir:54 } ],
},
110: {
  texto: `O Cuco pensa. Range. E te dá uma bicada na cabeça: "CU-CU!" (tradução: "não"). Você perde 2 pontos de ENERGIA. Vai ter que ser na luta mesmo.`,
  cena: { ambiente:'torre', hora:'noite', monstro:'@cuco' },
  efeito: { energia:-2 },
  escolhas: [ { txt:'Lutar contra o Cuco Gigante', ir:53 } ],
},
53: {
  texto: `O CUCO GIGANTE mergulha em você com o bico aberto. Cada CU-CU é um golpe. Você segura a espada com as duas mãos. Não tem pra onde fugir: é aqui, agora, contra um pássaro de madeira do tamanho de um carro.`,
  cena: { ambiente:'torre', hora:'noite', monstro:'@cuco' },
  combate: { nome:'Cuco Gigante', hab:8, eng:10, modelo:'@cuco', ir:54 },
},
54: {
  texto: `Só restam você e o Relojoeiro Tique-Taque. Ele ajeita a cartola e sorri.\n\n"Vamos fazer um acordo, aventureiro. Junte-se a mim! Um mundo sem relógios: recreio eterno, nunca mais hora de dormir, sobremesa a qualquer hora! Você seria meu ajudante. Tem uniforme."`,
  cena: { ambiente:'torre', hora:'noite', props:['characters/character-r.glb','car/debris-nut.glb'] },
  escolhas: [
    { txt:'"Recreio eterno? Onde eu assino?"', ir:55 },
    { txt:'"Não! Sem relógio não tem hora do lanche!" Lutar!', ir:56 },
    { txt:'Refletir o raio do relógio com o escudo-tampa', ir:89, cond:{ item:'escudo' } },
    { txt:'Oferecer 15 moedas pra ele devolver o Coração', ir:57, cond:{ ouro:15 } },
  ],
},
57: {
  texto: `Você estende 15 moedas. O Relojoeiro pega TODAS, conta, guarda no bolso e diz: "Obrigado! Agora, onde estávamos? Ah sim: ATACAR." Ele nunca prometeu nada. Lição: não negocie com vilão de cartola.`,
  cena: { ambiente:'torre', hora:'noite', props:['characters/character-r.glb'] },
  efeito: { ouro:-15 },
  escolhas: [ { txt:'Lutar!', ir:56 } ],
},
89: {
  texto: `O Relojoeiro aponta a bengala: um raio de luz azul do relógio sai na sua direção. Você levanta o escudo-tampa — TÓIM! — e o raio volta pra ele, chamuscando o colete e a cartola. "MINHA CARTOLA DE ESTIMAÇÃO!"\n\nEle começa a luta já ferido e furioso.`,
  cena: { ambiente:'torre', hora:'noite', monstro:'characters/character-r.glb', props:['car/debris-nut.glb'] },
  combate: { nome:'Relojoeiro Tique-Taque (chamuscado)', hab:10, eng:10, modelo:'characters/character-r.glb', ir:58 },
},
56: {
  texto: `O Relojoeiro tira a bengala da cartola (não pergunte como) e ela vira uma espada de ponteiro de relógio. "Você vai aprender que HORA é a MINHA hora!"\n\nEsta é a batalha final. Sem fuga. O Coração do Relógio brilha no bolso dele a cada golpe.`,
  cena: { ambiente:'torre', hora:'noite', monstro:'characters/character-r.glb', props:['car/debris-nut.glb'] },
  combate: { nome:'Relojoeiro Tique-Taque', hab:10, eng:14, modelo:'characters/character-r.glb', ir:58 },
},
55: {
  texto: `Você assina. O uniforme é roxo com bolinhas e tem um crachá: "AJUDANTE". O Relojoeiro comemora e o relógio fica parado pra sempre.\n\nNo começo é ótimo: sobremesa às 4 da manhã, ninguém te manda dormir. Mas depois de um tempo, ninguém sabe quando é seu aniversário. A escola nunca acaba porque nunca começa. E a Dona Benta-Cinco fecha a padaria porque não sabe quando o pão fica pronto.\n\nVocê e o Relojoeiro passam a eternidade jogando dama e discutindo quem começa. Ele sempre diz que "ainda não é a sua vez".\n\nFIM (o ruim). Talvez tentar de novo?`,
  cena: { ambiente:'torre', hora:'noite', props:['characters/character-r.glb','furniture/tableRound.glb','furniture/chair.glb'] },
  fim: 'ruim',
},
58: {
  texto: `O Relojoeiro Tique-Taque cai sentado, a cartola rola pelo chão e o Coração do Relógio salta do bolso dele — uma engrenagem dourada, pulsando como um coração de verdade: tum-TIC, tum-TAC.\n\n"Tá bom, tá bom", ele resmunga. "Eu só queria dormir até mais tarde UMA vez na vida..."\n\nVocê pega o Coração. Agora é hora (finalmente uma!) de consertar o relógio.`,
  cena: { ambiente:'torre', hora:'noite', props:['characters/character-r.glb','car/debris-nut.glb'] },
  escolhas: [
    { txt:'Revistar os bolsos do Relojoeiro primeiro', ir:81 },
    { txt:'Ir direto consertar o relógio', ir:82 },
  ],
},
81: {
  texto: `Nos bolsos do colete você encontra: 10 moedas de ouro, um bilhete de "lembrete: comprar leite" de 1847, três ponteiros de relógio sobressalentes e uma foto do Cuco Gigante quando filhote. Awn. Você pega o ouro e devolve a foto.`,
  cena: { ambiente:'torre', hora:'noite', props:['characters/character-r.glb'] },
  efeito: { ouro:10 },
  escolhas: [ { txt:'Consertar o relógio', ir:82 } ],
},
82: {
  texto: `Você se aproxima do mecanismo gigante. O buraco em forma de coração espera. Ao lado, três encaixes menores, vazios: um de pedra, um de ferro, um de cristal — as engrenagens antigas que o Relojoeiro tirou e espalhou pela torre.\n\nVocê encaixa o Coração. Tum-TIC. E olha pra sua mochila.`,
  cena: { ambiente:'torre', hora:'noite', props:['car/debris-nut.glb','car/debris-nut.glb','car/debris-nut.glb'] },
  escolhas: [
    { txt:'Encaixar as TRÊS engrenagens antigas', ir:59, cond:{ itens:['engrenagem_pedra','engrenagem_ferro','engrenagem_cristal'] } },
    { txt:'Encaixar as engrenagens que você tem', ir:60, cond:{ algumItem:['engrenagem_pedra','engrenagem_ferro','engrenagem_cristal'], naoTodos:['engrenagem_pedra','engrenagem_ferro','engrenagem_cristal'] } },
    { txt:'Dar corda e torcer pra funcionar', ir:61, cond:{ nenhumItem:['engrenagem_pedra','engrenagem_ferro','engrenagem_cristal'] } },
  ],
},
59: {
  texto: `Pedra. Ferro. Cristal. CLIC, CLIC, CLIC. O Coração pulsa forte e TODAS as engrenagens da torre começam a girar de uma vez. Um estrondo de sino sai do topo: DÓÓÓÓÓM!\n\nLá embaixo, em Ponteiro Torto, o galo canta na hora certa. O pão da Dona Benta-Cinco sai dourado. O prefeito olha o relógio e grita "MEIO-DIA! HORA DO ALMOÇO!", e pela primeira vez em meses todo mundo almoça junto.\n\nO Relojoeiro vira o novo zelador da torre, com direito a dormir até as 9 (mas só aos sábados). O Cuco Gigante canta ao meio-dia com o Cuquinho fazendo coro. E você ganha o abraço prometido do prefeito — e uma estátua, feita de pão.\n\n★ FIM ÉPICO ★ Você consertou o tempo. Agora não tem mais desculpa pra chegar atrasado.`,
  cena: { ambiente:'torre', hora:'dia', props:['car/debris-nut.glb','car/debris-nut.glb','car/debris-nut.glb','characters/character-r.glb'] },
  fim: 'epico',
},
60: {
  texto: `Você encaixa as engrenagens que tem. CLIC... CLIC... e um espaço vazio. O Coração pulsa, o relógio arranca e as engrenagens giram — meio tortas, mas giram.\n\nLá embaixo, Ponteiro Torto volta ao normal. Quase. O relógio adianta 7 minutos por dia, então toda semana a vila inteira precisa acertar o relógio de pulso. O prefeito chama isso de "tradição". A Dona Benta-Cinco chama de "desculpa pra vender mais café".\n\nO Relojoeiro vira zelador e vive resmungando que "faltou peça". Você ganha o abraço e uma medalha de chocolate.\n\n★ FIM BOM ★ (Dizem que quem acha as três engrenagens antigas conserta o relógio de vez...)`,
  cena: { ambiente:'torre', hora:'tarde', props:['car/debris-nut.glb','car/debris-nut.glb','characters/character-r.glb'] },
  fim: 'bom',
},
61: {
  texto: `Sem as engrenagens antigas, você faz o que todo pai faz com aparelho quebrado: dá corda, bate de leve do lado e diz "vai, vai, vai". E vai! O Coração pulsa e o relógio... funciona. Quando quer.\n\nEm Ponteiro Torto, o relógio às vezes marca a hora certa, às vezes marca "quinta" e às vezes toca 27 vezes sem motivo. Mas a vila adora: virou atração turística. "O Relógio Que Faz o Que Quer" recebe visitantes do mundo inteiro e a padaria da Dona Benta-Cinco abriu filial.\n\nO Relojoeiro vira guia turístico. Você ganha o abraço, um boné e um desconto vitalício em pão de queijo.\n\n★ FIM TORTO ★ (O zelador jurou que tem três engrenagens antigas espalhadas pela torre. Será?)`,
  cena: { ambiente:'torre', hora:'tarde', props:['characters/character-r.glb','food/loaf.glb'] },
  fim: 'torto',
},

};

// Modelos do palco por ambiente (base). O jogo posiciona sozinho.
export const AMBIENTES = {
  cidade:   { chao:'#7fae5a', ceu:'dia',   props:['city-suburban/building-type-a.glb','city-suburban/building-type-f.glb','city-suburban/tree-large.glb','city-suburban/fence.glb','city-roads/light-curved.glb'] },
  floresta: { chao:'#4f8a3c', ceu:'dia',   props:['nature/tree_default.glb','nature/tree_oak.glb','nature/tree_fat.glb','nature/plant_bushLarge.glb','nature/mushroom_redGroup.glb','nature/rock_largeB.glb'] },
  caverna:  { chao:'#4a4550', ceu:'#151020', props:['nature/cliff_block_stone.glb','nature/cliff_large_stone.glb','space/rock_crystals.glb','nature/rock_tallC.glb','nature/stone_largeA.glb'] },
  castelo:  { chao:'#8a8a90', ceu:'por-do-sol', props:['castle/wall.glb','castle/tower-square.glb','castle/wall-doorway.glb','castle/flag-banner-short.glb','castle/wall-pillar.glb'] },
  futuro:   { chao:'#2b3550', ceu:'noite', props:['space/corridor_wall.glb','space/machine_generator.glb','space/platform_high.glb','space/pipe_straight.glb','space/satelliteDish.glb'] },
  torre:    { chao:'#6b5a48', ceu:'noite', props:['castle/wall.glb','castle/wall-pillar.glb','furniture/lampSquareFloor.glb','castle/wall-doorway.glb','car/debris-nut.glb'] },
};

export const HEROI = 'characters/character-d.glb';
export const ITENS_NOME = {
  despertador:'⏰ Despertador-galinha', escudo:'🍳 Escudo-tampa', lanterna:'🔦 Lanterna', flauta:'🎶 Flauta de osso',
  cuquinho:'🐣 Cuquinho', oleo:'🛢️ Óleo Anti-Ferrugem', espada:'🗡️ Espada de treino',
  engrenagem_pedra:'⚙️ Engrenagem de Pedra', engrenagem_ferro:'⚙️ Engrenagem de Ferro', engrenagem_cristal:'💎 Engrenagem de Cristal',
};
