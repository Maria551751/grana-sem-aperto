import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const canvas = document.querySelector("#hero-3d");

const cena = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.z = 5;

const renderizador = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
});

renderizador.setPixelRatio(
    Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.15 : 1.5)
);

/* =========================================
   TEXTURA DA CALCULADORA
   ========================================= */

function criarTexturaCalculadora() {
    const tela = document.createElement("canvas");

    tela.width = 768;
    tela.height = 1400;

    const contexto = tela.getContext("2d");

    const fundo = contexto.createLinearGradient(
        0,
        0,
        768,
        1400
    );

    fundo.addColorStop(0, "#07110e");
    fundo.addColorStop(0.5, "#09090b");
    fundo.addColorStop(1, "#031b13");

    contexto.fillStyle = fundo;
    contexto.fillRect(0, 0, tela.width, tela.height);

    contexto.fillStyle = "#10b981";
    contexto.font = "900 70px Inter, Arial";
    contexto.fillText("GSA", 60, 110);

    contexto.fillStyle = "#a1a1aa";
    contexto.font = "600 27px Inter, Arial";
    contexto.fillText("CALCULADORA DE JUROS", 60, 165);

    contexto.fillStyle = "#ffffff";
    contexto.font = "800 54px Inter, Arial";
    contexto.fillText("Faça seu dinheiro", 60, 260);

    contexto.fillStyle = "#10b981";
    contexto.fillText("crescer.", 60, 325);

    function criarCampo(titulo, valor, posicaoY) {
        contexto.fillStyle = "#a1a1aa";
        contexto.font = "600 25px Inter, Arial";
        contexto.fillText(titulo, 60, posicaoY);

        contexto.beginPath();
        contexto.roundRect(
            60,
            posicaoY + 25,
            648,
            100,
            24
        );

        contexto.fillStyle = "#151518";
        contexto.fill();

        contexto.strokeStyle = "#2d2d32";
        contexto.lineWidth = 3;
        contexto.stroke();

        contexto.fillStyle = "#ffffff";
        contexto.font = "700 35px Inter, Arial";
        contexto.fillText(
            valor,
            92,
            posicaoY + 88
        );
    }

    criarCampo(
        "INVESTIMENTO INICIAL",
        "R$ 1.000,00",
        410
    );

    criarCampo(
        "APORTE MENSAL",
        "R$ 300,00",
        575
    );

    criarCampo(
        "TEMPO",
        "5 anos",
        740
    );

    contexto.beginPath();
    contexto.roundRect(
        60,
        930,
        648,
        115,
        28
    );

    contexto.fillStyle = "#10b981";
    contexto.fill();

    contexto.fillStyle = "#04120d";
    contexto.font = "800 32px Inter, Arial";
    contexto.textAlign = "center";

    contexto.fillText(
        "CALCULAR INVESTIMENTO",
        384,
        1000
    );

    contexto.textAlign = "left";

    contexto.beginPath();
    contexto.roundRect(
        60,
        1090,
        648,
        230,
        28
    );

    contexto.fillStyle = "#111815";
    contexto.fill();

    contexto.strokeStyle = "#174a37";
    contexto.lineWidth = 3;
    contexto.stroke();

    contexto.fillStyle = "#a1a1aa";
    contexto.font = "600 25px Inter, Arial";
    contexto.fillText(
        "MONTANTE ESTIMADO",
        92,
        1150
    );

    contexto.fillStyle = "#ffffff";
    contexto.font = "900 55px Inter, Arial";
    contexto.fillText(
        "R$ 23.594",
        92,
        1225
    );

    contexto.strokeStyle = "#10b981";
    contexto.lineWidth = 8;
    contexto.lineCap = "round";

    contexto.beginPath();
    contexto.moveTo(455, 1250);
    contexto.lineTo(500, 1215);
    contexto.lineTo(548, 1225);
    contexto.lineTo(595, 1165);
    contexto.lineTo(658, 1125);
    contexto.stroke();

    const textura = new THREE.CanvasTexture(tela);

    textura.colorSpace = THREE.SRGBColorSpace;
    textura.anisotropy =
        renderizador.capabilities.getMaxAnisotropy();

    return textura;
}

/* =========================================
   TEXTURA DO GREEN CARD
   ========================================= */

function criarTexturaGreenCard() {
    const canvasCartao = document.createElement("canvas");

    canvasCartao.width = 1200;
    canvasCartao.height = 760;

    const contexto = canvasCartao.getContext("2d");

    const fundo = contexto.createLinearGradient(
        0,
        0,
        1200,
        760
    );

    fundo.addColorStop(0, "#064e3b");
    fundo.addColorStop(0.45, "#10b981");
    fundo.addColorStop(1, "#022c22");

    contexto.fillStyle = fundo;
    contexto.fillRect(
        0,
        0,
        canvasCartao.width,
        canvasCartao.height
    );

    contexto.fillStyle = "rgba(255, 255, 255, 0.06)";

    contexto.beginPath();
    contexto.arc(
        1050,
        80,
        350,
        0,
        Math.PI * 2
    );
    contexto.fill();

    contexto.beginPath();
    contexto.arc(
        150,
        750,
        280,
        0,
        Math.PI * 2
    );
    contexto.fill();

    contexto.fillStyle = "#d1fae5";
    contexto.font = "900 82px Inter, Arial";
    contexto.fillText("GSA", 75, 120);

    contexto.fillStyle = "#ffffff";
    contexto.font = "800 38px Inter, Arial";
    contexto.fillText("GREEN", 75, 170);

    contexto.fillStyle = "rgba(255,255,255,0.72)";
    contexto.font = "600 25px Inter, Arial";
    contexto.fillText("NÍVEL DIGITAL", 75, 220);

    contexto.beginPath();
    contexto.roundRect(
        75,
        300,
        155,
        115,
        22
    );

    contexto.fillStyle = "#d4af37";
    contexto.fill();

    contexto.strokeStyle = "#806b24";
    contexto.lineWidth = 5;

    contexto.beginPath();
    contexto.moveTo(126, 300);
    contexto.lineTo(126, 415);

    contexto.moveTo(178, 300);
    contexto.lineTo(178, 415);

    contexto.moveTo(75, 357);
    contexto.lineTo(230, 357);
    contexto.stroke();

    contexto.fillStyle = "#ffffff";
    contexto.font = "700 31px Inter, Arial";
    contexto.fillText(
        "CONQUISTA GSA",
        75,
        570
    );

    contexto.fillStyle = "rgba(255,255,255,0.68)";
    contexto.font = "500 24px Inter, Arial";
    contexto.fillText(
        "EVOLUÇÃO FINANCEIRA",
        75,
        615
    );

    contexto.fillStyle = "#d1fae5";
    contexto.font = "800 28px Inter, Arial";
    contexto.textAlign = "right";

    contexto.fillText(
        "SEU DINHEIRO. SEU FUTURO.",
        1120,
        690
    );

    contexto.textAlign = "left";

    const textura = new THREE.CanvasTexture(
        canvasCartao
    );

    textura.colorSpace = THREE.SRGBColorSpace;
    textura.anisotropy =
        renderizador.capabilities.getMaxAnisotropy();

    return textura;
}

/* =========================================
   CELULAR 3D
   ========================================= */

const celular = new THREE.Group();

const materialCorpo =
    new THREE.MeshStandardMaterial({
        color: 0x09090b,
        metalness: 0.85,
        roughness: 0.22
    });

const geometriaCorpo =
    new RoundedBoxGeometry(
        1.55,
        2.9,
        0.22,
        5,
        0.12
    );

const corpoCelular = new THREE.Mesh(
    geometriaCorpo,
    materialCorpo
);

celular.add(corpoCelular);

const materialTela =
    new THREE.MeshStandardMaterial({
        color: 0x07110e,
        metalness: 0.1,
        roughness: 0.35
    });

const geometriaTela =
    new RoundedBoxGeometry(
        1.38,
        2.62,
        0.035,
        5,
        0.09
    );

const telaCelular = new THREE.Mesh(
    geometriaTela,
    materialTela
);

telaCelular.position.z = 0.13;

celular.add(telaCelular);

const texturaCalculadora =
    criarTexturaCalculadora();

const geometriaInterface =
    new THREE.PlaneGeometry(
        1.28,
        2.44
    );

const materialInterface =
    new THREE.MeshBasicMaterial({
        map: texturaCalculadora
    });

const interfaceCalculadora =
    new THREE.Mesh(
        geometriaInterface,
        materialInterface
    );

interfaceCalculadora.position.z = 0.155;
interfaceCalculadora.position.y = -0.02;

celular.add(interfaceCalculadora);

const geometriaAltoFalante =
    new RoundedBoxGeometry(
        0.34,
        0.025,
        0.025,
        3,
        0.01
    );

const materialDetalhe =
    new THREE.MeshStandardMaterial({
        color: 0xd1fae5,
        metalness: 0.5,
        roughness: 0.25
    });

const altoFalante = new THREE.Mesh(
    geometriaAltoFalante,
    materialDetalhe
);

altoFalante.position.set(
    0,
    1.27,
    0.17
);

celular.add(altoFalante);

celular.rotation.set(
    -0.08,
    -0.3,
    -0.12
);

celular.scale.setScalar(0.7);
celular.position.x = 0.48;

cena.add(celular);

/* =========================================
   GREEN CARD 3D
   ========================================= */

const cartaoGreen = new THREE.Group();

const geometriaCartao =
    new RoundedBoxGeometry(
        2.45,
        1.52,
        0.09,
        6,
        0.13
    );

const materialCartao =
    new THREE.MeshStandardMaterial({
        color: 0x10b981,
        metalness: 0.75,
        roughness: 0.25
    });

const corpoCartao = new THREE.Mesh(
    geometriaCartao,
    materialCartao
);

cartaoGreen.add(corpoCartao);

const texturaGreenCard =
    criarTexturaGreenCard();

const geometriaFrenteCartao =
    new THREE.PlaneGeometry(
        2.27,
        1.35
    );

const materialFrenteCartao =
    new THREE.MeshBasicMaterial({
        map: texturaGreenCard
    });

const frenteCartao = new THREE.Mesh(
    geometriaFrenteCartao,
    materialFrenteCartao
);

frenteCartao.position.z = 0.056;

cartaoGreen.add(frenteCartao);

cartaoGreen.scale.setScalar(0.72);

cartaoGreen.position.set(
    -0.58,
    -0.32,
    -0.2
);

cartaoGreen.rotation.set(
    -0.08,
    0.28,
    0.15
);

cena.add(cartaoGreen);

/* =========================================
   ILUMINAÇÃO
   ========================================= */

const luzAmbiente =
    new THREE.AmbientLight(
        0xffffff,
        1.5
    );

cena.add(luzAmbiente);

const luzPrincipal =
    new THREE.DirectionalLight(
        0x10b981,
        4
    );

luzPrincipal.position.set(
    3,
    4,
    5
);

cena.add(luzPrincipal);

const luzBranca =
    new THREE.DirectionalLight(
        0xffffff,
        2
    );

luzBranca.position.set(
    -3,
    2,
    4
);

cena.add(luzBranca);

/* =========================================
   RESPONSIVIDADE
   ========================================= */

function ajustarCanvas() {
    const largura = canvas.clientWidth;
    const altura = canvas.clientHeight;

    renderizador.setSize(
        largura,
        altura,
        false
    );

    camera.aspect = largura / altura;
    camera.updateProjectionMatrix();
}

ajustarCanvas();

window.addEventListener(
    "resize",
    ajustarCanvas
);

/* =========================================
   ANIMAÇÃO
   ========================================= */

function animar() {
    const tempo =
        performance.now() * 0.001;

    celular.rotation.y =
        -0.3 + Math.sin(tempo) * 0.12;

    celular.position.y =
        Math.sin(tempo * 1.2) * 0.08;

    cartaoGreen.rotation.y =
        0.28 + Math.sin(tempo * 0.8) * 0.08;

    cartaoGreen.position.y =
        -0.32 +
        Math.sin(tempo * 1.1 + 1) * 0.06;

    renderizador.render(
        cena,
        camera
    );
}

/* Renderiza somente enquanto o 3D está visível. Isso evita gastar GPU durante
   a leitura das seções inferiores ou quando a aba está em segundo plano. */
let heroVisivel = true;
let heroAnimando = false;

function atualizarLoopHero() {
    const deveAnimar = heroVisivel && !document.hidden;
    if (deveAnimar === heroAnimando) return;
    heroAnimando = deveAnimar;
    renderizador.setAnimationLoop(deveAnimar ? animar : null);
    if (!deveAnimar) renderizador.render(cena, camera);
}

new IntersectionObserver(([entrada]) => {
    heroVisivel = entrada.isIntersecting;
    atualizarLoopHero();
}, { rootMargin: "120px 0px", threshold: 0.01 }).observe(canvas);

document.addEventListener("visibilitychange", atualizarLoopHero);
atualizarLoopHero();
