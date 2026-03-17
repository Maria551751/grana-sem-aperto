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
   4. LÓGICA DA CALCULADORA GSA
   ========================================= */
let meuGrafico = null;

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
    if(corpoTabela) corpoTabela.innerHTML = ''; 

    const f = (v) => v.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

    for (let m = 0; m <= nMeses; m++) {
        if (m > 0) {
            let jurosDoMes = saldoAcumulado * iMensal;
            acumuladoJuros += jurosDoMes;
            totalInvestido += PMT;
            saldoAcumulado += jurosDoMes + PMT;
        }
        labels.push(`Mês ${m}`);
        dataInvestido.push(totalInvestido.toFixed(2));
        dataTotal.push(saldoAcumulado.toFixed(2));

        if (corpoTabela) {
            corpoTabela.innerHTML += `<tr><td>${m}</td><td>${f(saldoAcumulado * iMensal)}</td><td>${f(totalInvestido)}</td><td>${f(acumuladoJuros)}</td><td>${f(saldoAcumulado)}</td></tr>`;
        }
    }

    document.getElementById('totalInvestido').innerText = f(totalInvestido);
    document.getElementById('totalJuros').innerText = f(acumuladoJuros);
    document.getElementById('montanteFinal').innerText = f(saldoAcumulado);
    document.getElementById('resultadoGSA').style.display = 'block';

    renderizarGrafico(labels, dataInvestido, dataTotal);
}

function renderizarGrafico(labels, investido, total) {
    const ctx = document.getElementById('graficoEvolucao')?.getContext('2d');
    if (!ctx) return;
    if (meuGrafico) meuGrafico.destroy();
    meuGrafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{ label: 'Total Acumulado', data: total, borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.4 },
                       { label: 'Valor Investido', data: investido, borderColor: '#ffffff', borderDash: [5, 5], fill: false }]
        },
        options: { responsive: true, scales: { y: { ticks: { color: '#a1a1aa' } }, x: { ticks: { color: '#a1a1aa' } } } }
    });
}

/* =========================================
   5. IA E TAXAS EM TEMPO REAL
   ========================================= */
/* =========================================
   5. IA E TAXAS EM TEMPO REAL
   ========================================= */

// Puxa a chave do secret.js (local) ou do ambiente (Vercel)
const API_KEY = window.API_ENV_KEY || ""; 

function toggleAIChat() {
    const chat = document.getElementById('chat-box-ia');
    if(chat) chat.classList.toggle('chat-escondido');
}

async function perguntarIA() {
    const input = document.getElementById('user-query');
    const container = document.getElementById('chat-messages');
    
    if (!input || !container) return;
    if (!API_KEY) {
        console.error("Chave da API não encontrada!");
        return;
    }

    const query = input.value.trim();
    if (!query) return;

    // Detecta em qual página o usuário está para o contexto
    const paginaAtual = document.title; 
    let contexto = "Você é o assistente da GSA (Grana Sem Aperto). Responda de forma simples para jovens investidores.";

    if (paginaAtual.includes("Calculadora")) {
        contexto = "Você é o especialista em matemática financeira da GSA. Ajude o usuário com os cálculos de juros e termos financeiros.";
    } else if (paginaAtual.includes("Cursos")) {
        contexto = "Você é o tutor de investimentos da GSA. Ajude o usuário com as dúvidas sobre os módulos e aulas.";
    }

    // Exibe a mensagem do usuário
    container.innerHTML += `<div class="msg-user">${query}</div>`;
    input.value = "";

    // Exibe o "Digitando..."
    const aiMsgId = 'ai-' + Date.now();
    container.innerHTML += `<div class="msg-ia" id="${aiMsgId}">Digitando... </div>`;
    container.scrollTop = container.scrollHeight;

    // Montagem da URL
    const url = new URL("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent");
    url.searchParams.append("key", API_KEY.trim());

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${contexto} Pergunta do Investido(a): ${query}`
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            document.getElementById(aiMsgId).innerText = "Erro: " + data.error.message;
            return;
        }

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        document.getElementById(aiMsgId).innerText = text || "Resposta vazia da IA 😅";

    } catch (error) {
        document.getElementById(aiMsgId).innerText = "Erro de conexão 🌐";
        console.error(error);
    }
    
    container.scrollTop = container.scrollHeight;
}


async function atualizarTaxasReais() {
    try {
        const selicHtml = document.getElementById('taxaSelic');
        if(selicHtml) {
            selicHtml.innerText = "10,75%";
            document.getElementById('taxaCDI').innerText = "10,65%";
            document.getElementById('taxaAnual').placeholder = "Sugestão (Selic): 10.75";
        }
    } catch (e) { console.log("Erro taxas"); }
}

atualizarTaxasReais();