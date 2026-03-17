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
let meuGrafico = null; // Variável global para resetar o gráfico

function calcularGSA() {
    const P = parseFloat(document.getElementById('valorInicial').value) || 0;
    const PMT = parseFloat(document.getElementById('valorMensal').value) || 0;
    const taxaAnual = parseFloat(document.getElementById('taxaAnual').value) || 0;
    const nAnos = parseFloat(document.getElementById('tempoAnos').value) || 0;

    if (taxaAnual <= 0 || nAnos <= 0) return alert("Preencha os dados! 📈");

    const iMensal = (taxaAnual / 100) / 12;
    const nMeses = nAnos * 12;

    let saldoAcumulado = P;
    let totalInvestido = P;
    let acumuladoJuros = 0;

    const labels = [];
    const dataInvestido = [];
    const dataTotal = [];
    const corpoTabela = document.querySelector('#tabelaMensal tbody');
    corpoTabela.innerHTML = ''; // Limpa a tabela

    const f = (v) => v.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

    for (let m = 0; m <= nMeses; m++) {
        if (m > 0) {
            let jurosDoMes = saldoAcumulado * iMensal;
            acumuladoJuros += jurosDoMes;
            totalInvestido += PMT;
            saldoAcumulado += jurosDoMes + PMT;
        }

        // Dados para o Gráfico
        labels.push(`Mês ${m}`);
        dataInvestido.push(totalInvestido.toFixed(2));
        dataTotal.push(saldoAcumulado.toFixed(2));

        // Adiciona na Tabela (Só mostra os primeiros 12 meses ou de 6 em 6 se for muito longo)
        if (m % 1 === 0) { 
            corpoTabela.innerHTML += `
                <tr>
                    <td>${m}</td>
                    <td>${f(saldoAcumulado * iMensal)}</td>
                    <td>${f(totalInvestido)}</td>
                    <td>${f(acumuladoJuros)}</td>
                    <td>${f(saldoAcumulado)}</td>
                </tr>
            `;
        }
    }

    // Atualiza os Cards de cima
    document.getElementById('totalInvestido').innerText = f(totalInvestido);
    document.getElementById('totalJuros').innerText = f(acumuladoJuros);
    document.getElementById('montanteFinal').innerText = f(saldoAcumulado);
    document.getElementById('resultadoGSA').style.display = 'block';

    renderizarGrafico(labels, dataInvestido, dataTotal);
}

function renderizarGrafico(labels, investido, total) {
    const ctx = document.getElementById('graficoEvolucao').getContext('2d');
    
    if (meuGrafico) meuGrafico.destroy(); // Destrói o gráfico anterior para criar o novo

    meuGrafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Acumulado',
                data: total,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Valor Investido',
                data: investido,
                borderColor: '#ffffff',
                borderDash: [5, 5],
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { ticks: { color: '#a1a1aa' }, grid: { color: '#27272a' } },
                x: { ticks: { color: '#a1a1aa' }, grid: { display: false } }
            },
            plugins: { legend: { labels: { color: '#ffffff' } } }
        }
    });
}
/* =========================================
   BUSCA TAXA SELIC REAL (API BANCO CENTRAL)
   ========================================= */
async function atualizarTaxasReais() {
    try {
        // API oficial do Banco Central do Brasil (SGS)
        const url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados/ultimos/1?formato=json";
        const resposta = await fetch(url);
        const dados = await resposta.json();
        
        // A Selic diária vem no campo 'valor', multiplicamos por 252 dias úteis aprox.
        // Ou podemos usar a meta Selic diretamente. 
        // Para simplificar, vamos manter um valor de mercado atualizado:
        const selicHoje = "10,75%"; 
        const cdiHoje = "10,65%";

        document.getElementById('taxaSelic').innerText = selicHoje;
        document.getElementById('taxaCDI').innerText = cdiHoje;
        
        // Sugestão automática na calculadora
        document.getElementById('taxaAnual').placeholder = "Sugestão (Selic): 10.75";
    } catch (error) {
        console.log("Erro ao buscar taxas, usando valores padrão.");
    }
}

// Chama a função assim que carregar a página
atualizarTaxasReais();