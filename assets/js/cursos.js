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

// Um card por módulo das trilhas; com link em videoaulasPorModulo o card vira "Assistir".
function montarVideoaulas() {
    const grade = document.getElementById('videoaulas-grid');
    if (!grade) return;

    const modulos = Object.values(modulosData).flat();
    grade.innerHTML = modulos.map((modulo, indice) => {
        const link = videoaulasPorModulo[modulo];
        const numero = String(indice + 1).padStart(2, '0');
        const capa = `
            <div class="videoaula-capa">
                <span class="videoaula-play" aria-hidden="true">▶</span>
                <span class="videoaula-selo">${link ? 'ASSISTIR' : 'EM BREVE'}</span>
            </div>
            <span class="videoaula-numero">MÓDULO ${numero}</span>
            <h3>${modulo}</h3>
        `;

        return link
            ? `<li class="videoaula-card videoaula-disponivel"><a href="${link}" target="_blank" rel="noopener noreferrer">${capa}</a></li>`
            : `<li class="videoaula-card" aria-label="${modulo}: videoaula em breve">${capa}</li>`;
    }).join('');
}

montarVideoaulas();
