function iniciarLuzMetodo() {
    const secao = document.querySelector('.metodo-aprender');
    const cursorPreciso = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!secao || !cursorPreciso || movimentoReduzido) return;

    let quadro = null;
    let x = 0;
    let y = 0;

    secao.addEventListener('pointerenter', () => secao.classList.add('luz-cursor-ativa'));
    secao.addEventListener('pointerleave', () => secao.classList.remove('luz-cursor-ativa'));
    secao.addEventListener('pointermove', (event) => {
        const limites = secao.getBoundingClientRect();
        x = event.clientX - limites.left;
        y = event.clientY - limites.top;
        if (quadro) return;
        quadro = requestAnimationFrame(() => {
            secao.style.setProperty('--luz-x', `${x}px`);
            secao.style.setProperty('--luz-y', `${y}px`);
            quadro = null;
        });
    }, { passive: true });
}

iniciarLuzMetodo();
