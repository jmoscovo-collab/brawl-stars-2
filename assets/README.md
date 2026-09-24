# Assets 3D do Cogumelo Games

- `/cg3d.js` — módulo compartilhado (three **0.160.1** via jsdelivr, ES module). Só pra **jogos novos**.
  Os 19 jogos antigos usam three r128 por `<script>` global — não misturar os dois na mesma página.
- `/assets/models/<kit>/<arquivo>.glb` — modelos Kenney (CC0), comprimidos com **Draco**.
- `/assets/models/catalog.json` — lista `[{kit, file, name, bytes}]` gerada automaticamente.
- `/assets/` — página "Catálogo 3D": visualiza cada modelo, copia o caminho, mostra nós e animações.

## Exemplo mínimo de jogo novo

```html
<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>body{margin:0;overflow:hidden}canvas{display:block}</style>
<!-- OBRIGATÓRIO: os addons do three importam "three" internamente; sem importmap dá erro. -->
<script type="importmap">
{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/"
} }
</script></head>
<body>
<script type="module">
import { THREE, criaCena, carregaModelo, chao, mostraLoading, escondeLoading } from '/cg3d.js';

mostraLoading();
const cena = criaCena({ container: document.body, ceu: 'dia', sombras: true });
cena.scene.add(chao({ tamanho: 60, cor: '#6da34d' }));

const carro = await carregaModelo('/assets/models/car/sedan.glb', { escala: 1 });
cena.scene.add(carro);
const mixer = carro.animacoes.length ? carro.criaMixer() : null;
mixer?.toca(mixer.nomes[0]);
escondeLoading();

cena.camera.position.set(0, 4, 8);
cena.tick((dt) => {          // roda todo frame; dt em segundos
  carro.rotation.y += dt;
  mixer?.update(dt);
  cena.camera.lookAt(carro.position);
});
</script>
</body></html>
```

## API do cg3d.js

| Função | O que faz |
|---|---|
| `criaCena({canvas\|container, sombras, bloom, bloomForca, ceu, nevoa, pixelRatioMax})` | renderer (PCFSoft, sRGB, ACES) + scene + camera + sol + hemisfério + environment (RoomEnvironment) + céu gradiente. Retorna `{renderer, scene, camera, composer, luzSol, luzAmbiente, render(), resize(), tick(cb)}`. `ceu`: `'dia'`, `'noite'`, `'por-do-sol'` ou uma cor CSS. |
| `carregaModelo(path, {escala, sombras, clonar})` | Promise<Object3D> com cache por path. Chamar 2x o mesmo path devolve 2 cópias independentes (SkeletonUtils.clone se tiver esqueleto). Vem com `.animacoes` e `.criaMixer()`. |
| `criaMixer(obj)` | AnimationMixer com `mixer.toca('Nome', {loop, fade})`, `mixer.nomes`. Chame `mixer.update(dt)` no tick. |
| `carregaVarios(['/a.glb', ...])` ou `({heroi: '/a.glb'})` | Promise de mapa nome → Object3D. |
| `carregaCatalogo()` | fetch de `/assets/models/catalog.json`, já com campo `path`. |
| `normalizaModelo(obj, alturaAlvo)` | centraliza e escala pra caber (viewers, previews). |
| `chao({tamanho, cor\|textura})` | plano com `receiveShadow`. |
| `redimensionaAuto(renderer, camera)` | resize por window + ResizeObserver (criaCena já chama). |
| `mostraLoading(container)` / `escondeLoading()` | overlay 🍄 "Carregando 3D...". |
| exports extras | `THREE`, `OrbitControls`, `RGBELoader`. |

## Convenções

- **Caminhos absolutos** sempre: `/cg3d.js`, `/assets/models/...`. O jogo mora em `/nome-do-jogo/index.html`, então caminho relativo quebra.
- **Draco**: os `.glb` são comprimidos; o `cg3d.js` já configura o `DRACOLoader` (decoder no gstatic). Não precisa fazer nada.
- **Não colocar modelo dentro da pasta do jogo** — reaproveitar `/assets/models/`. Modelo novo entra num `<kit>/` e o `catalog.json` é regenerado.
- **Sem bundler, sem npm**: HTML + `<script type="module">` + importmap. GitHub Pages serve direto.
- **Celular**: `pixelRatioMax: 2` default; `bloom: false` default (custa GPU). Testar no telefone antes de publicar.
- Versão do three é **fixa** (0.160.1). Trocar só se mudar em `cg3d.js`, `assets/index.html` e nos importmaps dos jogos juntos.

## Pro subagente que vai criar um jogo

1. Leia `/assets/models/catalog.json` (`cat /Users/julio.moscovo/Downloads/Lang/jogo-davi/assets/models/catalog.json`) e escolha os modelos pelo `kit`/`name`. O caminho no jogo é `/assets/models/<kit>/<file>`.
2. Pra descobrir **nomes de nós** (ex.: roda, porta, arma — pra animar/esconder partes) e **nomes de animações**, abra `https://cogumelogames.com.br/assets/` (ou local com `python3 -m http.server 8766 --directory /Users/julio.moscovo/Downloads/Lang/jogo-davi`) e clique no card: o modal lista `nome (tipo)` de cada nó e as animações com duração.
   Sem browser, use no console de um jogo: `obj.traverse(n => console.log(n.name, n.type))`.
3. Use `obj.getObjectByName('nome')` pra pegar a parte; `mixer.toca('nome-da-animacao')` pra animar.
4. Copie o exemplo mínimo acima, mantenha o importmap **igual**, e nunca carregue three r128 global na mesma página.
