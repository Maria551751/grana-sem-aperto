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

let aulaSelecionada = "";
let cursoSelecionado = "";

const btnAcao = document.querySelector('.btn-modal-acao');

const modulosData = {
    "O Despertar Financeiro": [
        "Mentalidade de Investidor",
        "Organizando sua grana",
        "Montando a Reserva",
        "Cartão de Crédito sem Armadilha"
    ],
    "Mestre da Carteira GSA": [
        "Tesouro Direto na Prática",
        "Dividendos com FIIs",
        "Escolhendo Ações",
        "Rebalanceamento da Carteira"
    ]
};

function atualizarBotao() {
    if (!btnAcao) return;

    if (aulaSelecionada) {
        btnAcao.innerText = `VER AULA: ${aulaSelecionada.toUpperCase()} 🚀`;
        btnAcao.disabled = false;
        btnAcao.style.opacity = "1";
    } else {
        btnAcao.innerText = "Selecione um módulo";
        btnAcao.disabled = true;
        btnAcao.style.opacity = "0.5";
    }
}

document.querySelectorAll('.btn-curso').forEach(botao => {
    botao.addEventListener('click', (e) => {
        e.preventDefault();

        const card = e.target.closest('.curso-card');
        const tituloCurso = card?.querySelector('h3')?.innerText;

        if (!modulosData[tituloCurso]) return;

        cursoSelecionado = tituloCurso;
        aulaSelecionada = "";

        const modal = document.getElementById('modalCursos');
        const lista = document.getElementById('listaModulos');
        const titulo = document.getElementById('modalTitulo');

        if (!modal || !lista || !titulo) return;

        titulo.innerText = tituloCurso;
        lista.innerHTML = "";

        modulosData[tituloCurso].forEach((aula, index) => {
            const item = document.createElement('div');
            item.className = 'modulo-item';
            item.innerHTML = `<span>${index + 1}. ${aula}</span>`;

            item.onclick = () => {
                document.querySelectorAll('.modulo-item')
                    .forEach(el => el.classList.remove('aula-ativa'));

                item.classList.add('aula-ativa');
                aulaSelecionada = aula;
                atualizarBotao();
            };

            lista.appendChild(item);
        });

        atualizarBotao();

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

function abrirJanelaAula() {
    if (!aulaSelecionada) {
        alert("Selecione uma aula primeiro 😊");
        return;
    }

    const modalCursos = document.getElementById('modalCursos');
    const modalAula = document.getElementById('modalAula');
    const tituloAula = document.getElementById('tituloAulaAtiva');
    const cursoPertencente = document.getElementById('cursoPertencente');
    const containerAcoes = document.querySelector('.aula-acoes');

    if (!modalCursos || !modalAula || !tituloAula || !cursoPertencente || !containerAcoes) return;

    modalCursos.style.display = 'none';
    modalAula.style.display = 'flex';

    tituloAula.innerText = aulaSelecionada;
    cursoPertencente.innerText = `Curso: ${cursoSelecionado}`;

    containerAcoes.innerHTML = `
        <button class="btn-acess-item" onclick="alert('Iniciando vídeo...')">
            <span>▶️</span> Assistir Aula
        </button>

        <a id="linkMaterial" href="#" target="_blank" class="btn-acess-item" style="text-decoration: none; color: inherit;">
            <span>📄</span> Material Didático
        </a>

        <button class="btn-acess-item" style="border-color: #facc15; color: #facc15;" onclick="abrirQuiz()">
            <span>✍️</span> Fazer Exercícios
        </button>
    `;

    const btnMaterial = document.getElementById('linkMaterial');
    const materiais = {
        "Mentalidade de Investidor": "../assets/docs/Mentalidade-Financeira.pdf",
        "Organizando sua grana": "../assets/docs/ORGANIZANDO-SUA-GRANA.pdf",
        "Montando a Reserva": "../assets/docs/RESERVA-DE-EMERGENCIA.pdf",
        "Cartão de Crédito sem Armadilha": "../assets/docs/Cartao-de-Credito-sem-Armadilha.pdf",
        "Tesouro Direto na Prática": "../assets/docs/Tesouro-Direto-na-Pratica.pdf",
        "Dividendos com FIIs": "../assets/docs/Dividendos-com-FIIs.pdf",
        "Escolhendo Ações": "../assets/docs/Escolhendo-Acoes.pdf",
        "Rebalanceamento da Carteira": "../assets/docs/REBALANCEAMENTO-DA-CARTEIRA.pdf"
    };

    if (btnMaterial) {
        if (materiais[aulaSelecionada]) {
            btnMaterial.href = materiais[aulaSelecionada];
            btnMaterial.style.opacity = '1';
            btnMaterial.style.pointerEvents = 'auto';
        } else {
            btnMaterial.style.opacity = '0.3';
            btnMaterial.style.pointerEvents = 'none';
        }
    }
}

const bancoDeQuizzes = {
    "Mentalidade de Investidor": [
        {
            pergunta: "De acordo com o material, o dinheiro é apenas matemática?",
            opcoes: ["Sim, basta saber as fórmulas.", "Não, dinheiro também é comportamento.", "Sim, as emoções não influenciam."],
            correta: 1,
            explicacao: "Saber a teoria não basta se não houver disciplina. Dinheiro é comportamento."
        },
        {
            pergunta: "O que caracteriza o 'Modo Sobrevivência'?",
            opcoes: ["Investir em ações.", "Apenas pagar contas sem construir liberdade.", "Ter uma reserva de 12 meses."],
            correta: 1,
            explicacao: "Só pagar contas não constrói liberdade. É o modo de apenas 'apagar incêndios'."
        }
    ],
    "Organizando sua grana": [
        {
            pergunta: "Qual é a regra de divisão sugerida no método GSA?",
            opcoes: ["50% Desejos, 30% Necessidades, 20% Investimento", "50% Necessidades, 30% Desejos, 20% Investimento", "60% Contas, 40% Investimento"],
            correta: 1,
            explicacao: "O método sugere 50% para necessidades, 30% para desejos pessoais e 20% para o seu futuro."
        }
    ],
    "Montando a Reserva": [
        {
            pergunta: "Qual a característica vital para o dinheiro da Reserva de Emergência?",
            opcoes: ["Alta Rentabilidade", "Liquidez Diária (disponibilidade rápida)", "Prazo de 5 anos"],
            correta: 1,
            explicacao: "A reserva precisa estar disponível imediatamente para quando a emergência surgir."
        }
    ],
    "Cartão de Crédito sem Armadilha": [
        {
            pergunta: "Qual o maior perigo do cartão mencionado no material?",
            opcoes: ["O parcelamento sem juros.", "O pagamento mínimo da fatura.", "Fazer compras online."],
            correta: 1,
            explicacao: "O pagamento mínimo ativa os juros rotativos, uma das dívidas mais caras que existem."
        }
    ],
    "Tesouro Direto na Prática": [
        {
            pergunta: "Qual título é o mais seguro e indicado para reserva de emergência?",
            opcoes: ["Tesouro IPCA+", "Tesouro Prefixado", "Tesouro Selic"],
            correta: 2,
            explicacao: "O Tesouro Selic é o mais estável e seguro para quem está começando."
        }
    ],
    "Rebalanceamento da Carteira": [
        {
            pergunta: "Qual é o principal objetivo do rebalanceamento de carteira?",
            opcoes: [
                "Tentar adivinhar qual ação vai subir amanhã.",
                "Manter o nível de risco que você definiu para sua estratégia.",
                "Vender tudo o que está caindo para não perder dinheiro."
            ],
            correta: 1,
            explicacao: "O rebalanceamento serve para trazer a carteira de volta aos percentuais que você definiu, controlando o risco."
        },
        {
            pergunta: "Na prática, o que o rebalanceamento te força a fazer?",
            opcoes: [
                "Comprar o que está caro e vender o que está barato.",
                "Pagar mais taxas para a corretora sem necessidade.",
                "Comprar o que está barato (abaixo da meta) e vender o que ficou caro (acima da meta)."
            ],
            correta: 2,
            explicacao: "Ele te obriga matematicamente a comprar na baixa e vender na alta, seguindo a sua meta de alocação."
        }
    ],
    "Dividendos com FIIs": [
        {
            pergunta: "O que é um FII (Fundo de Investimento Imobiliário)?",
            opcoes: [
                "Um empréstimo que fazes ao banco para construir casas.",
                "Um fundo que investe em imóveis e distribui aluguéis aos cotistas.",
                "Uma forma de comprar um imóvel inteiro sozinho."
            ],
            correta: 1,
            explicacao: "Ao comprar uma cota, tornas-te 'dono' de um pedaço de grandes imóveis (shoppings, galpões) e recebes parte dos aluguéis."
        },
        {
            pergunta: "Qual é o erro comum ao olhar apenas para o 'Dividend Yield'?",
            opcoes: [
                "Achar que rendimento alto significa sempre um bom negócio.",
                "Achar que o rendimento é garantido pelo governo.",
                "Ignorar que os FIIs não pagam dividendos mensalmente."
            ],
            correta: 0,
            explicacao: "Um Yield muito alto pode ser sinal de queda no preço do ativo ou um problema temporário. Analisar a gestão e os imóveis é obrigatório."
        }
    ],
    "Escolhendo Ações": [
        {
            pergunta: "Ao comprar uma ação, o que estás realmente a fazer?",
            opcoes: [
                "A apostar na subida de um código (ticker) na bolsa.",
                "A tornar-te sócio de um negócio real com funcionários e lucros.",
                "A emprestar dinheiro à empresa para ela pagar dívidas."
            ],
            correta: 1,
            explicacao: "Uma ação é a menor parte de uma empresa. Ser acionista é ser sócio do negócio."
        },
        {
            pergunta: "O material diz que 'Preço sozinho não diz nada'. Porquê?",
            opcoes: [
                "Porque o preço das ações nunca muda.",
                "Porque uma ação barata pode ser uma armadilha e uma cara pode ser oportunidade.",
                "Porque o lucro da empresa é o que define o preço fixo da ação."
            ],
            correta: 1,
            explicacao: "Barato pode ser um mau negócio com desconto. Deves entender o que a empresa faz antes de olhar apenas para o preço."
        }
    ]
};

function abrirQuiz() {
    const perguntasAtuais = bancoDeQuizzes[aulaSelecionada] || bancoDeQuizzes["Mentalidade de Investidor"];
    const titulo = document.getElementById('tituloAulaAtiva');
    const subtitulo = document.getElementById('cursoPertencente');

    if (titulo) titulo.innerText = `✍️ Quiz: ${aulaSelecionada}`;
    if (subtitulo) subtitulo.innerText = "Teste seus conhecimentos do material";

    carregarPergunta(0);
}

function carregarPergunta(index) {
    const container = document.querySelector('.aula-acoes');
    const perguntasAtuais = bancoDeQuizzes[aulaSelecionada] || bancoDeQuizzes["Mentalidade de Investidor"];
    const dados = perguntasAtuais[index];

    if (!container || !dados) return;

    container.innerHTML = `
        <p class="quiz-pergunta">${dados.pergunta}</p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            ${dados.opcoes.map((opcao, i) => `
                <button class="quiz-opcao" onclick="verificarResposta(${index}, ${i}, event)">
                    ${opcao}
                </button>
            `).join('')}
        </div>
        <div class="quiz-footer">
            Pergunta ${index + 1} de ${perguntasAtuais.length}
        </div>
    `;
}

function verificarResposta(perguntaIdx, respostaIdx, event) {
    const perguntasAtuais = bancoDeQuizzes[aulaSelecionada] || bancoDeQuizzes["Mentalidade de Investidor"];
    const dados = perguntasAtuais[perguntaIdx];
    const container = document.querySelector('.aula-acoes');

    if (!container || !dados) return;

    if (respostaIdx === dados.correta) {
        container.innerHTML = `
            <div style="text-align: center; animation: fadeInUp 0.4s ease;">
                <h3 style="color: #22c55e; margin-bottom: 10px;">✅ Resposta Correta!</h3>
                <p style="color: #ccc; font-size: 14px; margin-bottom: 20px; line-height: 1.5;">
                    ${dados.explicacao}
                </p>
                ${perguntaIdx + 1 < perguntasAtuais.length
                    ? `<button class="btn-acess-item" style="justify-content: center; background: #22c55e; color: #000;" onclick="carregarPergunta(${perguntaIdx + 1})">Próxima Pergunta 🚀</button>`
                    : `<div style="padding: 20px; border: 1px solid #22c55e; border-radius: 15px; background: rgba(34, 197, 94, 0.1); margin-bottom: 20px;">
                        <p style="color: #fff; font-weight: bold;">🏆 Parabéns! Quiz Concluído.</p>
                        <p style="color: #aaa; font-size: 12px;">Você dominou o conteúdo de ${aulaSelecionada}.</p>
                       </div>
                       <button class="btn-voltar-gsa" onclick="abrirJanelaAula()">Voltar para a Aula</button>`
                }
            </div>
        `;
    } else {
        const botaoClicado = event?.target;
        if (!botaoClicado) return;

        botaoClicado.style.borderColor = "#ef4444";
        botaoClicado.style.background = "rgba(239, 68, 68, 0.1)";
        botaoClicado.innerText = "❌ Tente outra vez...";

        setTimeout(() => {
            botaoClicado.style.borderColor = "rgba(255, 255, 255, 0.1)";
            botaoClicado.style.background = "rgba(255, 255, 255, 0.05)";
            botaoClicado.innerText = dados.opcoes[respostaIdx];
        }, 1500);
    }
}

function fecharModalGSA() {
    const modal = document.getElementById('modalCursos');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function fecharJanelaAula() {
    const modalAula = document.getElementById('modalAula');
    const modalLista = document.getElementById('modalCursos');

    if (modalAula) modalAula.style.display = 'none';
    if (modalLista) modalLista.style.display = 'flex';
}

window.addEventListener('click', (e) => {
    const modalLista = document.getElementById('modalCursos');
    const modalAula = document.getElementById('modalAula');

    if (e.target === modalLista) fecharModalGSA();
    if (e.target === modalAula) fecharJanelaAula();
});

/* =========================================
   4. LÓGICA DA CALCULADORA GSA
   ========================================= */
let meuGrafico = null;

function calcularGSA() {
    const P = parseFloat(document.getElementById('valorInicial')?.value) || 0;
    const PMT = parseFloat(document.getElementById('valorMensal')?.value) || 0;
    const taxaAnual = parseFloat(document.getElementById('taxaAnual')?.value) || 0;
    const nAnos = parseFloat(document.getElementById('tempoAnos')?.value) || 0;

    if (taxaAnual <= 0 || nAnos <= 0) {
        alert("Preencha os dados! 📈");
        return;
    }

    const iMensal = (taxaAnual / 100) / 12;
    const nMeses = nAnos * 12;

    let saldoAcumulado = P;
    let totalInvestido = P;
    let acumuladoJuros = 0;

    const labels = [];
    const dataInvestido = [];
    const dataTotal = [];
    const corpoTabela = document.querySelector('#tabelaMensal tbody');

    if (corpoTabela) corpoTabela.innerHTML = '';

    const f = (v) => v.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    for (let m = 0; m <= nMeses; m++) {
        let jurosDoMes = 0;

        if (m > 0) {
            jurosDoMes = saldoAcumulado * iMensal;
            acumuladoJuros += jurosDoMes;
            totalInvestido += PMT;
            saldoAcumulado += jurosDoMes + PMT;
        }

        labels.push(`Mês ${m}`);
        dataInvestido.push(totalInvestido);
        dataTotal.push(saldoAcumulado);

        if (corpoTabela) {
            corpoTabela.innerHTML += `
                <tr>
                    <td>${m}</td>
                    <td>${f(jurosDoMes)}</td>
                    <td>${f(totalInvestido)}</td>
                    <td>${f(acumuladoJuros)}</td>
                    <td>${f(saldoAcumulado)}</td>
                </tr>
            `;
        }
    }

    const totalInvestidoEl = document.getElementById('totalInvestido');
    const totalJurosEl = document.getElementById('totalJuros');
    const montanteFinalEl = document.getElementById('montanteFinal');
    const resultadoEl = document.getElementById('resultadoGSA');

    if (totalInvestidoEl) totalInvestidoEl.innerText = f(totalInvestido);
    if (totalJurosEl) totalJurosEl.innerText = f(acumuladoJuros);
    if (montanteFinalEl) montanteFinalEl.innerText = f(saldoAcumulado);
    if (resultadoEl) resultadoEl.style.display = 'block';

    setTimeout(() => {
        renderizarGrafico(labels, dataInvestido, dataTotal);
    }, 100);
}

function renderizarGrafico(labels, investido, total) {
    const canvas = document.getElementById('graficoEvolucao');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (meuGrafico) meuGrafico.destroy();

    meuGrafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Total Acumulado',
                    data: total,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Valor Investido',
                    data: investido,
                    borderColor: '#ffffff',
                    borderDash: [5, 5],
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    ticks: { color: '#a1a1aa' }
                },
                x: {
                    ticks: { color: '#a1a1aa' }
                }
            }
        }
    });
}

/* =========================================
   5. IA E TAXAS EM TEMPO REAL
   ========================================= */
function toggleAIChat() {
    const chat = document.getElementById('chat-box-ia');
    if (chat) chat.classList.toggle('chat-escondido');
}

async function perguntarIA() {
    const input = document.getElementById('user-query');
    const container = document.getElementById('chat-messages');

    const query = input.value.trim();
    if (!query) return;

    container.innerHTML += `<p><strong>Você:</strong> ${query}</p>`;

   async function perguntarIA() {
    const input = document.getElementById('user-query');
    const container = document.getElementById('chat-messages');

    const query = input.value.trim();
    if (!query) return;

    container.innerHTML += `<p><strong>Você:</strong> ${query}</p>`;

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: query })
        });

        const data = await response.json();

        container.innerHTML += `<p><strong>GSA:</strong> ${data.reply}</p>`;

    } catch (error) {
        container.innerHTML += `<p>Erro ao conectar com a IA</p>`;
    }

    input.value = "";
}
}

/* ===== TAXAS AUTOMÁTICAS CORRIGIDAS ===== */
function formatarPercentual(valor) {
    return Number(valor).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + '%';
}

function formatarDataHora(data) {
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(data);
}

function calcularPoupancaAnual(selicAnual) {
    if (selicAnual > 8.5) {
        return 6.17;
    }
    return selicAnual * 0.7;
}

function converterCdiDiarioParaAnual(cdiDiarioPercentual) {
    const taxaDecimalDia = cdiDiarioPercentual / 100;
    const taxaAnualDecimal = Math.pow(1 + taxaDecimalDia, 252) - 1;
    return taxaAnualDecimal * 100;
}

function atualizarStatusTaxas(texto) {
    const selicStatus = document.getElementById('selicStatus');
    const cdiStatus = document.getElementById('cdiStatus');
    const poupancaStatus = document.getElementById('poupancaStatus');

    if (selicStatus) selicStatus.textContent = texto;
    if (cdiStatus) cdiStatus.textContent = texto;
    if (poupancaStatus) poupancaStatus.textContent = texto;
}

async function buscarUltimoValorBCB(codigoSerie) {
    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${codigoSerie}/dados/ultimos/1?formato=json`;
    const resposta = await fetch(url);

    if (!resposta.ok) {
        throw new Error(`Falha ao consultar série ${codigoSerie}`);
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados) || !dados.length) {
        throw new Error(`Sem dados para a série ${codigoSerie}`);
    }

    return {
        valor: Number(String(dados[0].valor).replace(',', '.')),
        data: dados[0].data
    };
}

async function atualizarTaxas() {
    const selicValor = document.getElementById('selicValor');
    const cdiValor = document.getElementById('cdiValor');
    const poupancaValor = document.getElementById('poupancaValor');

    if (!selicValor || !cdiValor || !poupancaValor) return;

    try {
        atualizarStatusTaxas('Atualizando dados');

        const [selic, cdiDiario] = await Promise.all([
            buscarUltimoValorBCB(432),
            buscarUltimoValorBCB(12)
        ]);

        const cdiAnual = converterCdiDiarioParaAnual(cdiDiario.valor);
        const poupanca = calcularPoupancaAnual(selic.valor);
        const agora = formatarDataHora(new Date());

        selicValor.textContent = formatarPercentual(selic.valor);
        cdiValor.textContent = formatarPercentual(cdiAnual);
        poupancaValor.textContent = formatarPercentual(poupanca);

        const selicStatus = document.getElementById('selicStatus');
        const cdiStatus = document.getElementById('cdiStatus');
        const poupancaStatus = document.getElementById('poupancaStatus');

        if (selicStatus) selicStatus.textContent = `BCB • ${selic.data}`;
        if (cdiStatus) cdiStatus.textContent = `CDI diário convertido • ${cdiDiario.data}`;
        if (poupancaStatus) poupancaStatus.textContent = `Atualizado em ${agora}`;

        const campoTaxa = document.getElementById('taxaAnual');
        if (campoTaxa && !campoTaxa.value) {
            campoTaxa.value = cdiAnual.toFixed(2);
        }
    } catch (erro) {
        console.error('Erro ao atualizar taxas:', erro);

        selicValor.textContent = '14,75%';
        cdiValor.textContent = '14,65%';
        poupancaValor.textContent = '6,17%';

        atualizarStatusTaxas('Usando valor de reserva');
    }
}

atualizarTaxas();
setInterval(atualizarTaxas, 60 * 60 * 1000);

/* =========================================
   9. CRIADORES
   ========================================= */
function slide(direcao) {
    const slider = document.getElementById('slider');
    if (!slider) return;

    const scrollAmount = slider.clientWidth;

    if (direcao === 'direita') {
        slider.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    } else {
        slider.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    }
}

/* =========================================
   10. ACESSIBILIDADE
   ========================================= */
function toggleAcessPanel() {
    const panel = document.getElementById('acess-panel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
}

let currentFontSize = 16;

function mudarFonte(delta) {
    currentFontSize += delta;

    if (currentFontSize < 12) currentFontSize = 12;
    if (currentFontSize > 22) currentFontSize = 22;

    document.documentElement.style.fontSize = currentFontSize + 'px';
    localStorage.setItem('gsaFontSize', currentFontSize);
}

function toggleContraste() {
    document.body.classList.toggle('alto-contraste');
    const isContraste = document.body.classList.contains('alto-contraste');
    localStorage.setItem('gsaContraste', isContraste);
}

function toggleVLibras() {
    const widget = document.getElementById('vlibras-widget');

    if (widget) {
        if (widget.style.display === 'none' || widget.style.display === '') {
            widget.style.display = 'block';

            if (!window.VLibras) {
                const script = document.createElement('script');
                script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
                script.onload = () => {
                    new window.VLibras.Widget('https://vlibras.gov.br/app');
                };
                document.body.appendChild(script);
            }
        } else {
            widget.style.display = 'none';
            const controleLibras = document.querySelector('.vpw-controls');
            if (controleLibras && controleLibras.closest('.enabled')) {
                controleLibras.closest('.enabled').style.display = 'none';
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('gsaContraste') === 'true') {
        document.body.classList.add('alto-contraste');
    }

    const savedFont = localStorage.getItem('gsaFontSize');
    if (savedFont) {
        currentFontSize = parseInt(savedFont, 10);
        document.documentElement.style.fontSize = currentFontSize + 'px';
    }
});