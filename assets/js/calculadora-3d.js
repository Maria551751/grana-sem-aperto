import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const canvas = document.querySelector('#ferramentas-3d');

if (canvas) {
  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.12, 11.4);

  const renderizador = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderizador.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.15 : 1.5));
  renderizador.outputColorSpace = THREE.SRGBColorSpace;
  renderizador.toneMapping = THREE.ACESFilmicToneMapping;
  renderizador.toneMappingExposure = 1.2;

  function criarTexturaCartao(variante = 'black') {
    const tela = document.createElement('canvas');
    tela.width = 1024;
    tela.height = 640;
    const ctx = tela.getContext('2d');

    const fundo = ctx.createLinearGradient(0, 0, 1024, 640);
    fundo.addColorStop(0, variante === 'black' ? '#202824' : '#0d3326');
    fundo.addColorStop(0.48, variante === 'black' ? '#090d0b' : '#071b14');
    fundo.addColorStop(1, '#020403');
    ctx.fillStyle = fundo;
    ctx.fillRect(0, 0, 1024, 640);

    const brilho = ctx.createRadialGradient(820, 40, 10, 820, 40, 500);
    brilho.addColorStop(0, 'rgba(52,211,153,.28)');
    brilho.addColorStop(1, 'rgba(16,185,129,0)');
    ctx.fillStyle = brilho;
    ctx.fillRect(0, 0, 1024, 640);

    ctx.strokeStyle = 'rgba(110,231,183,.13)';
    ctx.lineWidth = 2;
    for (let x = -250; x < 1200; x += 82) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 440, 640);
      ctx.stroke();
    }

    ctx.fillStyle = '#6ee7b7';
    ctx.font = '900 70px Segoe UI, Arial';
    ctx.fillText('GSA', 70, 112);
    ctx.fillStyle = '#eefcf6';
    ctx.font = '700 25px Segoe UI, Arial';
    ctx.fillText('GREEN', 72, 148);
    ctx.fillStyle = 'rgba(238,252,246,.58)';
    ctx.font = '700 16px Segoe UI, Arial';
    ctx.fillText('PLANEJAMENTO FINANCEIRO', 72, 177);

    ctx.fillStyle = '#e5bd45';
    ctx.beginPath();
    ctx.roundRect(76, 245, 128, 94, 15);
    ctx.fill();
    ctx.strokeStyle = 'rgba(75,54,4,.55)';
    ctx.lineWidth = 4;
    [118, 160].forEach((x) => { ctx.beginPath(); ctx.moveTo(x, 247); ctx.lineTo(x, 337); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(77, 291); ctx.lineTo(202, 291); ctx.stroke();

    ctx.strokeStyle = '#d1fae5';
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(882, 278, 38, -0.9, 0.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(912, 278, 38, -0.9, 0.9); ctx.stroke();

    ctx.fillStyle = '#f0fdf7';
    ctx.font = '650 29px Segoe UI, Arial';
    ctx.fillText('5421  ••••  ••••  2030', 70, 440);
    ctx.fillStyle = 'rgba(238,252,246,.5)';
    ctx.font = '700 14px Segoe UI, Arial';
    ctx.fillText('CONQUISTA GSA', 70, 530);
    ctx.fillText('SEU FUTURO, SUAS ESCOLHAS', 650, 530);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 21px Segoe UI, Arial';
    ctx.fillText('GRANA SEM APERTO', 70, 562);

    const textura = new THREE.CanvasTexture(tela);
    textura.colorSpace = THREE.SRGBColorSpace;
    textura.anisotropy = Math.min(8, renderizador.capabilities.getMaxAnisotropy());
    return textura;
  }

  function criarCartao(variante) {
    const cartao = new THREE.Group();
    const corpo = new THREE.Mesh(
      new RoundedBoxGeometry(4.8, 3, 0.16, 8, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x060907, metalness: 0.78, roughness: 0.24 })
    );
    cartao.add(corpo);
    const frente = new THREE.Mesh(
      new THREE.PlaneGeometry(4.62, 2.82),
      new THREE.MeshStandardMaterial({ map: criarTexturaCartao(variante), metalness: 0.2, roughness: 0.36 })
    );
    frente.position.z = 0.091;
    cartao.add(frente);
    return cartao;
  }

  const conjunto = new THREE.Group();
  conjunto.position.set(0.2, 0.28, 0);
  conjunto.scale.setScalar(0.86);
  cena.add(conjunto);

  const cartaoTras = criarCartao('green');
  cartaoTras.position.set(-0.72, 0.68, -0.65);
  cartaoTras.rotation.set(-0.08, 0.22, -0.38);
  cartaoTras.scale.setScalar(0.91);
  conjunto.add(cartaoTras);

  const cartaoFrente = criarCartao('black');
  cartaoFrente.position.set(0.65, -0.25, 0.35);
  cartaoFrente.rotation.set(-0.1, -0.22, 0.2);
  conjunto.add(cartaoFrente);

  const sombra = new THREE.Mesh(
    new THREE.CircleGeometry(2.6, 64),
    new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.17, depthWrite: false })
  );
  sombra.scale.set(1.75, 0.34, 1);
  sombra.position.set(0.2, -2.15, -1.2);
  conjunto.add(sombra);

  cena.add(new THREE.HemisphereLight(0xd1fae5, 0x010302, 1.7));
  const luzPrincipal = new THREE.DirectionalLight(0xffffff, 3.4);
  luzPrincipal.position.set(-4, 6, 7);
  cena.add(luzPrincipal);
  const luzVerde = new THREE.PointLight(0x10b981, 18, 10);
  luzVerde.position.set(3.5, 0.5, 4);
  cena.add(luzVerde);

  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ajustarCanvas() {
    const largura = canvas.clientWidth;
    const altura = canvas.clientHeight;
    if (!largura || !altura) return;
    renderizador.setSize(largura, altura, false);
    camera.aspect = largura / altura;
    camera.updateProjectionMatrix();
  }

  function animar() {
    const tempo = performance.now() * 0.001;
    if (!reduzirMovimento) {
      conjunto.position.y = 0.28 + Math.sin(tempo * 0.75) * 0.08;
      conjunto.rotation.y = Math.sin(tempo * 0.38) * 0.055;
      cartaoFrente.rotation.z = 0.2 + Math.sin(tempo * 0.5) * 0.018;
      cartaoTras.rotation.z = -0.38 - Math.sin(tempo * 0.5) * 0.014;
    }
    renderizador.render(cena, camera);
  }

  ajustarCanvas();
  window.addEventListener('resize', ajustarCanvas);
  let cenaVisivel = true;
  let cenaAnimando = null;

  function atualizarLoop3D() {
    const deveAnimar = cenaVisivel && !document.hidden && !reduzirMovimento;
    if (deveAnimar === cenaAnimando) return;
    cenaAnimando = deveAnimar;
    renderizador.setAnimationLoop(deveAnimar ? animar : null);
    if (!deveAnimar) renderizador.render(cena, camera);
  }

  new IntersectionObserver(([entrada]) => {
    cenaVisivel = entrada.isIntersecting;
    atualizarLoop3D();
  }, { rootMargin: '120px 0px', threshold: 0.01 }).observe(canvas);

  document.addEventListener('visibilitychange', atualizarLoop3D);
  atualizarLoop3D();
}
