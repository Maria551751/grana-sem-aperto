/* =========================================
   1. ANIMAÇÃO DE ENTRADA (REVEAL AO ROLAR)
   ========================================= */
function animaScroll() {
    const elementos = document.querySelectorAll('.revelar');
    
    elementos.forEach((el) => {
        const topoElemento = el.getBoundingClientRect().top;
        // Ativa a animação quando o elemento chega a 85% da altura da tela
        const alturaTela = window.innerHeight * 0.85;
        
        if (topoElemento < alturaTela) {
            el.classList.add('ativo');
        }
    });
}

// Executa ao carregar e ao rolar a página
window.addEventListener('load', animaScroll);
window.addEventListener('scroll', animaScroll);


/* =========================================
   2. ANIMAÇÃO DE FUNDO NEON (CARTEIRA GSA)
   ========================================= */
const fundoNeon = document.getElementById('fundoAnimado');

function criarFeixeNeon() {
    if (!fundoNeon) return;

    const feixe = document.createElement('div');
    feixe.classList.add('particula'); 

    feixe.style.left = Math.random() * 100 + '%';
    const duracao = Math.random() * 2.5 + 1.5;
    feixe.style.animationDuration = duracao + 's';
    feixe.style.animationDelay = Math.random() * 2 + 's';

    fundoNeon.appendChild(feixe);

    setTimeout(() => {
        feixe.remove();
    }, (duracao + 2) * 1000);
}

if (fundoNeon) {
    setInterval(criarFeixeNeon, 150);
}



/* =========================================
   4. MENU MOBILE (3 LISTRAS)
   ========================================= */
const menuBtn = document.querySelector('.menu-mobile-btn');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        console.log("Menu clicado! Sistema pronto para Sidebar.");
        alert("Grana Sem Aperto: Menu lateral em breve!");
    });
}