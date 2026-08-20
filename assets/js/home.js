const carteiraInterativa = document.querySelector("[data-carteira-interativa]");

if (carteiraInterativa) {
  const controles = carteiraInterativa.querySelectorAll("[data-carteira]");

  function selecionarParteCarteira(parteSelecionada) {
    controles.forEach((controle) => {
      const estaAtivo = controle.dataset.carteira === parteSelecionada;

      controle.classList.toggle("ativo", estaAtivo);
      controle.setAttribute("aria-pressed", String(estaAtivo));
    });
  }

  controles.forEach((controle) => {
    controle.addEventListener("click", () => {
      selecionarParteCarteira(controle.dataset.carteira);
    });
  });
}

const secaoClaraGSA = document.querySelector('.gsa-secao');
const cursorPreciso = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (secaoClaraGSA && cursorPreciso && !movimentoReduzido) {
  let quadroLuz = null;
  let posicaoX = 50;
  let posicaoY = 50;

  function atualizarLuz() {
    secaoClaraGSA.style.setProperty('--luz-x', `${posicaoX}px`);
    secaoClaraGSA.style.setProperty('--luz-y', `${posicaoY}px`);
    quadroLuz = null;
  }

  secaoClaraGSA.addEventListener('pointerenter', () => {
    secaoClaraGSA.classList.add('luz-cursor-ativa');
  });

  secaoClaraGSA.addEventListener('pointermove', (evento) => {
    const limites = secaoClaraGSA.getBoundingClientRect();
    posicaoX = evento.clientX - limites.left;
    posicaoY = evento.clientY - limites.top;

    if (!quadroLuz) quadroLuz = requestAnimationFrame(atualizarLuz);
  }, { passive: true });

  secaoClaraGSA.addEventListener('pointerleave', () => {
    secaoClaraGSA.classList.remove('luz-cursor-ativa');
  });
}
