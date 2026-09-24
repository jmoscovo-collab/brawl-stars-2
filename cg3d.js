// cg3d.js — módulo 3D compartilhado do Cogumelo Games (jogos novos).
// Requer um <script type="importmap"> na página mapeando "three" e "three/addons/"
// (veja /assets/README.md). Os addons do three importam "three" internamente, então
// o importmap é a única forma de garantir UMA instância do three sem bundler.
//
// Versão fixa: three 0.160.1 (jsdelivr). Os 19 jogos antigos usam r128 global — não misturar.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

export { THREE, OrbitControls, RGBELoader };
export const VERSAO_CG3D = '1.0.0';

// Decoder Draco hospedado pelo Google (mesma versão que o three usa nos exemplos).
const DRACO_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';

// Presets de céu: [cor de cima, cor do horizonte, cor da névoa, cor do sol, intensidade do sol]
const CEUS = {
  'dia':        ['#4a90e2', '#cfe8ff', '#cfe8ff', '#fff4d6', 2.5],
  'noite':      ['#050818', '#1a1f4a', '#0d1230', '#9fb4ff', 0.6],
  'por-do-sol': ['#2b1b5a', '#ff9a5c', '#ffb98a', '#ffb070', 1.8],
};

// ---------------------------------------------------------------- cena

/**
 * Cria renderer + cena + câmera + luzes + environment prontos pra jogo.
 * Passe `canvas` (um <canvas>) OU `container` (elemento onde o canvas será criado).
 * Retorna { renderer, scene, camera, composer, luzSol, luzAmbiente, render, resize, tick }.
 */
export function criaCena({
  canvas, container,
  sombras = true,
  bloom = false, bloomForca = 0.6,
  ceu = 'dia',
  nevoa = true,
  pixelRatioMax = 2,
} = {}) {
  if (!canvas) {
    canvas = document.createElement('canvas');
    (container || document.body).appendChild(canvas);
  }
  const alvo = container || canvas.parentElement || document.body;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioMax));
  renderer.shadowMap.enabled = sombras;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 500);
  camera.position.set(0, 5, 10);

  // Céu por gradiente (esfera grande com shader) — não depende de textura externa.
  const preset = CEUS[ceu] || [ceu, ceu, ceu, '#ffffff', 2];
  const [corTopo, corHorizonte, corNevoa, corSol, forcaSol] = preset;
  scene.add(criaCeuGradiente(corTopo, corHorizonte));
  if (nevoa) scene.fog = new THREE.Fog(corNevoa, 30, 200);

  // Environment (reflexos) via RoomEnvironment, sem HDR externo.
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  // Sol com shadow camera generosa (cobre ~60m de arena) + luz de céu/chão.
  const luzSol = new THREE.DirectionalLight(corSol, forcaSol);
  luzSol.position.set(20, 30, 15);
  luzSol.castShadow = sombras;
  luzSol.shadow.mapSize.set(2048, 2048);
  luzSol.shadow.camera.near = 1;
  luzSol.shadow.camera.far = 120;
  luzSol.shadow.camera.left = luzSol.shadow.camera.bottom = -30;
  luzSol.shadow.camera.right = luzSol.shadow.camera.top = 30;
  luzSol.shadow.bias = -0.0005;
  luzSol.shadow.normalBias = 0.02;
  scene.add(luzSol, luzSol.target);

  const luzAmbiente = new THREE.HemisphereLight(corHorizonte, '#5a4a3a', 0.8);
  scene.add(luzAmbiente);

  // Pós-processamento só se pedir bloom (custa GPU em celular).
  let composer = null;
  if (bloom) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const passeBloom = new UnrealBloomPass(new THREE.Vector2(1, 1), bloomForca, 0.4, 0.85);
    composer.addPass(passeBloom);
    composer.addPass(new OutputPass());
  }

  function resize() {
    const w = alvo.clientWidth || window.innerWidth;
    const h = alvo.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  redimensionaAuto(renderer, camera, alvo, composer);

  function render() {
    if (composer) composer.render(); else renderer.render(scene, camera);
  }

  // Loop: cb(dt, tempo) roda todo frame; retorna função pra parar.
  const relogio = new THREE.Clock();
  function tick(cb) {
    let ativo = true;
    renderer.setAnimationLoop(() => {
      if (!ativo) return;
      const dt = Math.min(relogio.getDelta(), 0.1); // trava dt em aba pausada
      cb?.(dt, relogio.elapsedTime);
      render();
    });
    return () => { ativo = false; renderer.setAnimationLoop(null); };
  }

  return { renderer, scene, camera, composer, luzSol, luzAmbiente, render, resize, tick };
}

// Esfera invertida com gradiente vertical topo→horizonte.
function criaCeuGradiente(corTopo, corHorizonte) {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { topo: { value: new THREE.Color(corTopo) }, horizonte: { value: new THREE.Color(corHorizonte) } },
    vertexShader: `varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 topo; uniform vec3 horizonte; varying vec3 vPos;
      void main(){ float h = normalize(vPos).y; float t = smoothstep(-0.05, 0.6, h);
      gl_FragColor = vec4(mix(horizonte, topo, t), 1.0); }`,
  });
  const ceu = new THREE.Mesh(new THREE.SphereGeometry(400, 24, 12), mat);
  ceu.name = 'ceu';
  return ceu;
}

/** Ajusta renderer/câmera quando a janela ou o container muda de tamanho. */
export function redimensionaAuto(renderer, camera, alvo = renderer.domElement.parentElement || document.body, composer = null) {
  const ajusta = () => {
    const w = alvo.clientWidth || window.innerWidth;
    const h = alvo.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', ajusta);
  if ('ResizeObserver' in window) new ResizeObserver(ajusta).observe(alvo);
  return ajusta;
}

// ---------------------------------------------------------------- modelos

let _gltf = null;
function loaderGLTF() {
  if (_gltf) return _gltf;
  const draco = new DRACOLoader();
  draco.setDecoderPath(DRACO_PATH);
  _gltf = new GLTFLoader().setDRACOLoader(draco);
  return _gltf;
}

const _cache = new Map(); // path → Promise<gltf>

/**
 * Carrega um .glb (Draco ok) com cache por path.
 * Retorna Object3D já com sombras marcadas, `.animacoes` (AnimationClip[]) e `.criaMixer()`.
 * `clonar=true` devolve uma cópia independente (SkeletonUtils.clone se tiver esqueleto),
 * então pode chamar várias vezes o mesmo path pra instanciar vários.
 */
export async function carregaModelo(path, { escala = 1, sombras = true, clonar = true } = {}) {
  if (!_cache.has(path)) _cache.set(path, loaderGLTF().loadAsync(path));
  let gltf;
  try { gltf = await _cache.get(path); }
  catch (e) { _cache.delete(path); throw new Error(`cg3d: falhou carregar ${path}: ${e.message || e}`); }

  const original = gltf.scene;
  const obj = clonar ? clonaObjeto(original) : original;
  obj.scale.setScalar(escala);
  obj.traverse(n => {
    if (n.isMesh) { n.castShadow = sombras; n.receiveShadow = sombras; }
  });
  obj.animacoes = gltf.animations || [];
  obj.criaMixer = () => criaMixer(obj);
  return obj;
}

function clonaObjeto(obj) {
  let temSkin = false;
  obj.traverse(n => { if (n.isSkinnedMesh) temSkin = true; });
  return temSkin ? SkeletonUtils.clone(obj) : obj.clone(true);
}

/** Mixer com atalhos: mixer.toca('Nome', {loop, fade}) e mixer.update(dt) no tick. */
export function criaMixer(obj) {
  const mixer = new THREE.AnimationMixer(obj);
  const clips = obj.animacoes || [];
  let atual = null;
  mixer.nomes = clips.map(c => c.name);
  mixer.toca = (nome, { loop = true, fade = 0.2 } = {}) => {
    const clip = THREE.AnimationClip.findByName(clips, nome) || clips[0];
    if (!clip) return null;
    const acao = mixer.clipAction(clip);
    acao.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce);
    acao.clampWhenFinished = !loop;
    if (atual && atual !== acao) atual.fadeOut(fade);
    acao.reset().fadeIn(fade).play();
    atual = acao;
    return acao;
  };
  return mixer;
}

/** carregaVarios(['/a.glb','/b.glb']) ou ({heroi:'/a.glb'}) → mapa nome→Object3D. */
export async function carregaVarios(paths, opcoes = {}) {
  const entradas = Array.isArray(paths) ? paths.map(p => [p, p]) : Object.entries(paths);
  const objs = await Promise.all(entradas.map(([, p]) => carregaModelo(p, opcoes)));
  return Object.fromEntries(entradas.map(([k], i) => [k, objs[i]]));
}

/** Lê /assets/models/catalog.json → [{kit, file, name, bytes, path}]. */
export async function carregaCatalogo(url = '/assets/models/catalog.json') {
  const r = await fetch(url, { cache: 'no-cache' });
  if (!r.ok) throw new Error(`cg3d: catálogo ${r.status}`);
  const lista = await r.json();
  return lista.map(m => ({ ...m, path: m.path || `/assets/models/${m.file}` }));
}

/** Centraliza o modelo na origem e escala pra caber em `alturaAlvo` (útil pra viewers). */
export function normalizaModelo(obj, alturaAlvo = 1) {
  const caixa = new THREE.Box3().setFromObject(obj);
  const tam = caixa.getSize(new THREE.Vector3());
  const maior = Math.max(tam.x, tam.y, tam.z) || 1;
  const s = alturaAlvo / maior;
  obj.scale.multiplyScalar(s);
  const centro = new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3());
  obj.position.sub(centro);
  return obj;
}

// ---------------------------------------------------------------- chão

/** Plano horizontal com sombra. `textura` = URL de imagem repetida a cada 4 unidades. */
export function chao({ tamanho = 100, cor = '#6da34d', textura = null, repeticao = tamanho / 4 } = {}) {
  const mat = new THREE.MeshStandardMaterial({ color: cor, roughness: 0.9 });
  if (textura) {
    const tex = new THREE.TextureLoader().load(textura);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeticao, repeticao);
    tex.colorSpace = THREE.SRGBColorSpace;
    mat.map = tex;
  }
  const plano = new THREE.Mesh(new THREE.PlaneGeometry(tamanho, tamanho), mat);
  plano.rotation.x = -Math.PI / 2;
  plano.receiveShadow = true;
  plano.name = 'chao';
  return plano;
}

// ---------------------------------------------------------------- loading

let _loading = null;

/** Overlay "Carregando..." com cogumelo girando. Chame escondeLoading() depois. */
export function mostraLoading(container = document.body, texto = 'Carregando 3D...') {
  escondeLoading();
  const el = document.createElement('div');
  el.className = 'cg3d-loading';
  el.style.cssText = `position:${container === document.body ? 'fixed' : 'absolute'};inset:0;display:flex;
    flex-direction:column;align-items:center;justify-content:center;gap:12px;z-index:9999;
    background:#0a0a2a;color:#fff;font-family:Arial,sans-serif;font-size:18px`;
  el.innerHTML = `<div style="font-size:48px;animation:cg3dgira 1.2s linear infinite">🍄</div><div>${texto}</div>
    <style>@keyframes cg3dgira{to{transform:rotate(360deg)}}</style>`;
  container.appendChild(el);
  _loading = el;
  return el;
}

export function escondeLoading() {
  _loading?.remove();
  _loading = null;
}
