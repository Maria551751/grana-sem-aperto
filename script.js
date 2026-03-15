/* =========================================
   1. CONTROLE DA SIDEBAR (ABRIR/FECHAR)
   ========================================= */
const btnAbrir = document.querySelector('.menu-mobile-btn');
const btnFechar = document.getElementById('btnFechar');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function toggleMenu() {
    if (sidebar && overlay) {
        sidebar.classList.toggle('ativo');
        overlay.classList.toggle('ativo');
    }
}

if (btnAbrir) btnAbrir.addEventListener('click', toggleMenu);
if (btnFechar) btnFechar.addEventListener('click', toggleMenu);
if (overlay) overlay.addEventListener('click', toggleMenu);

document.querySelectorAll('.sidebar-links a').forEach(link => {
    link.addEventListener('click', () => {
        sidebar?.classList.remove('ativo');
        overlay?.classList.remove('ativo');
    });
});

/* =========================================
   2. ANIMAÇÕES E PARTÍCULAS
   ========================================= */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('ativo');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.revelar').forEach(el => observer.observe(el));

const fundoAnimado = document.getElementById('fundoAnimado');
if (fundoAnimado) {
    fundoAnimado.innerHTML = '';
    for (let i = 0; i < 15; i++) {
        const particula = document.createElement('div');
        particula.className = 'particula';
        particula.style.left = Math.random() * 100 + '%';
        particula.style.animationDelay = Math.random() * 5 + 's';
        particula.style.animationDuration = (Math.random() * 3 + 2) + 's';
        fundoAnimado.appendChild(particula);
    }
}

/* =========================================
   3. FEEDBACK E MODAL DE CURSOS
   ========================================= */
const btnFeedback = document.querySelector('.btn-enviar-feedback');
if (btnFeedback) {
    btnFeedback.addEventListener('click', () => {
        const campo = document.getElementById('feedbackText');
        if (campo?.value.trim() !== "") {
            alert("Valeu pelo feedback, Dedê! 🚀");
            campo.value = "";
            toggleMenu();
        } else {
            alert("Escreve algo antes de enviar! 😂");
        }
    });
}

const modal = document.getElementById('modalCurso');
const btnFecharModal = document.getElementById('fecharModal');
const btnAssistir = document.querySelector('.btn-modal-acao');

if (modal && btnFecharModal) {
    const modulosData = {
        "O Despertar Financeiro": ["Mentalidade de Investidor", "Organização 50-30-20", "Montando a Reserva", "Bancos vs Corretoras"],
        "Mestre da Carteira GSA": ["Tesouro Direto na Prática", "Dividendos com FIIs", "Escolhendo Ações", "Rebalanceamento da Carteira"]
    };

    document.querySelectorAll('.btn-curso').forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.curso-card');
            const tituloCurso = card?.querySelector('h3').innerText;
            
            if (modulosData[tituloCurso]) {
                document.getElementById('modalTitulo').innerText = tituloCurso;
                const lista = document.getElementById('modalLista');
                lista.innerHTML = ''; 

                modulosData[tituloCurso].forEach((aula, index) => {
                    const item = document.createElement('div');
                    item.className = 'modulo-item';
                    item.innerHTML = `<span>${index + 1}. ${aula}</span>`;
                    item.onclick = () => {
                        document.querySelectorAll('.modulo-item').forEach(el => el.classList.remove('aula-ativa'));
                        item.classList.add('aula-ativa');
                        if (btnAssistir) btnAssistir.innerText = `Assistir: ${aula}`;
                    };
                    lista.appendChild(item);
                });

                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const fecharModalGSA = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    btnFecharModal.onclick = fecharModalGSA;
    window.onclick = (e) => { if (e.target == modal) fecharModalGSA(); };
}

/* =========================================
   4. LÓGICA DA CALCULADORA GSA (MATEMÁTICA FINANCEIRA)
   ========================================= */
function calcularGSA() {
    // 1. Pega os valores dos campos
    const P = parseFloat(document.getElementById('valorInicial').value) || 0;
    const PMT = parseFloat(document.getElementById('valorMensal').value) || 0;
    const taxaAnual = parseFloat(document.getElementById('taxaAnual').value) || 0;
    const nAnos = parseFloat(document.getElementById('tempoAnos').value) || 0;

    // 2. Valida se há dados para calcular
    if (taxaAnual <= 0 || nAnos <= 0) {
        alert("Coloque a taxa e o tempo para vermos o poder dos juros! 📈");
        return;
    }

    // 3. Converte taxa para mensal e tempo para meses
    const iMensal = (taxaAnual / 100) / 12;
    const nMeses = nAnos * 12;

    // 4. Fórmula de Juros Compostos com aportes mensais
    const montanteFinal = P * Math.pow(1 + iMensal, nMeses) + 
                         PMT * (Math.pow(1 + iMensal, nMeses) - 1) / iMensal;

    const totalInvestido = P + (PMT * nMeses);
    const totalJuros = montanteFinal - totalInvestido;

    // 5. Formatação para Moeda Brasileira
    const f = (v) => v.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

    // 6. Atualiza o HTML com os resultados
    document.getElementById('totalInvestido').innerText = f(totalInvestido);
    document.getElementById('totalJuros').innerText = f(totalJuros);
    document.getElementById('montanteFinal').innerText = f(montanteFinal);
    
    // 7. Mostra a caixa de resultados e rola até ela
    const resultadoBox = document.getElementById('resultadoGSA');
    resultadoBox.style.display = 'block';
    resultadoBox.scrollIntoView({ behavior: 'smooth' });
}

// Vincula a função ao objeto window para que o onclick no HTML funcione sempre
window.calcularGSA = calcularGSA;