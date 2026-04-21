if (typeof window.CONFIG === 'undefined') {
    window.CONFIG = {
        GEMINI_API_KEY: ""
    };
}

const N8N_CHAT_WEBHOOK_URL = "https://granasemaperto.app.n8n.cloud/webhook/gsa-chat";

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
            pergunta: "De acordo com o material, o dinheiro ? apenas matem?tica?",
            opcoes: ["Sim, basta saber as f?rmulas.", "N?o, dinheiro tamb?m ? comportamento.", "Sim, as emo??es n?o influenciam."],
            correta: 1,
            explicacao: "Saber a teoria n?o basta se n?o houver disciplina. Dinheiro tamb?m ? comportamento."
        },
        {
            pergunta: "O que caracteriza o 'Modo Sobreviv?ncia'?",
            opcoes: ["Investir em a??es.", "Apenas pagar contas sem construir liberdade.", "Ter uma reserva de 12 meses."],
            correta: 1,
            explicacao: "S? pagar contas n?o constr?i liberdade. ? o modo de apenas apagar inc?ndios."
        },
        {
            pergunta: "Qual mudan?a de mentalidade o curso incentiva primeiro?",
            opcoes: ["Buscar lucro r?pido a qualquer custo.", "Assumir controle das escolhas financeiras do dia a dia.", "Copiar investimentos sem estudar."],
            correta: 1,
            explicacao: "O primeiro passo ? assumir o controle do pr?prio comportamento financeiro antes de pensar em investir."
        }
    ],
    "Organizando sua grana": [
        {
            pergunta: "Qual ? a regra de divis?o sugerida no m?todo GSA?",
            opcoes: ["50% Desejos, 30% Necessidades, 20% Investimento", "50% Necessidades, 30% Desejos, 20% Investimento", "60% Contas, 40% Investimento"],
            correta: 1,
            explicacao: "O m?todo sugere 50% para necessidades, 30% para desejos pessoais e 20% para o seu futuro."
        },
        {
            pergunta: "Dentro da regra 50-30-20, em qual parte entra o dinheiro do seu futuro?",
            opcoes: ["Nos 20% destinados a investir e construir patrim?nio.", "Nos 30% dos desejos.", "Nos 50% das necessidades b?sicas."],
            correta: 0,
            explicacao: "Os 20% s?o justamente a parte reservada para investir, guardar e construir sua base financeira."
        },
        {
            pergunta: "Qual ? o principal benef?cio de organizar a grana antes de investir?",
            opcoes: ["Comprar mais coisas no impulso.", "Saber para onde o dinheiro vai e evitar descontrole.", "Parar de pagar qualquer conta fixa."],
            correta: 1,
            explicacao: "Organiza??o traz clareza, ajuda a evitar desperd?cios e prepara o terreno para investir com consist?ncia."
        }
    ],
    "Montando a Reserva": [
        {
            pergunta: "Qual a caracter?stica vital para o dinheiro da Reserva de Emerg?ncia?",
            opcoes: ["Alta Rentabilidade", "Liquidez Di?ria (disponibilidade r?pida)", "Prazo de 5 anos"],
            correta: 1,
            explicacao: "A reserva precisa estar dispon?vel imediatamente para quando a emerg?ncia surgir."
        },
        {
            pergunta: "Qual situa??o combina com o uso da reserva de emerg?ncia?",
            opcoes: ["Aproveitar uma promo??o de celular.", "Cobrir um conserto urgente do carro.", "Comprar um presente caro por impulso."],
            correta: 1,
            explicacao: "A reserva existe para imprevistos reais e urgentes, n?o para consumo por vontade do momento."
        },
        {
            pergunta: "Qual faixa o curso sugere como meta para a reserva?",
            opcoes: ["De 3 a 12 meses dos gastos essenciais.", "Apenas 1 sal?rio fixo.", "Exatamente 24 meses de renda."],
            correta: 0,
            explicacao: "A faixa de 3 a 12 meses ajuda a adaptar a reserva ao n?vel de seguran?a que a pessoa precisa."
        }
    ],
    "Cart?o de Cr?dito sem Armadilha": [
        {
            pergunta: "Qual o maior perigo do cart?o mencionado no material?",
            opcoes: ["O parcelamento sem juros.", "O pagamento m?nimo da fatura.", "Fazer compras online."],
            correta: 1,
            explicacao: "O pagamento m?nimo ativa os juros rotativos, uma das d?vidas mais caras que existem."
        },
        {
            pergunta: "Qual atitude ajuda a usar o cart?o com mais seguran?a?",
            opcoes: ["Gastar sem olhar o limite.", "Acompanhar a fatura e pagar o valor total.", "Usar o rotativo por v?rios meses."],
            correta: 1,
            explicacao: "Controlar a fatura e pagar o total evita juros altos e impede a bola de neve."
        },
        {
            pergunta: "Por que o limite do cart?o n?o deve ser visto como renda extra?",
            opcoes: ["Porque ? apenas dinheiro emprestado que depois vira conta.", "Porque o banco bloqueia qualquer compra acima de R$ 50.", "Porque cart?o s? serve para emerg?ncia m?dica."],
            correta: 0,
            explicacao: "Limite n?o ? dinheiro seu; ? cr?dito que precisar? ser pago depois, de prefer?ncia sem juros."
        }
    ],
    "Tesouro Direto na Pr?tica": [
        {
            pergunta: "Qual t?tulo ? o mais seguro e indicado para reserva de emerg?ncia?",
            opcoes: ["Tesouro IPCA+", "Tesouro Prefixado", "Tesouro Selic"],
            correta: 2,
            explicacao: "O Tesouro Selic ? o mais est?vel e seguro para quem est? come?ando."
        },
        {
            pergunta: "O que voc? est? fazendo ao investir no Tesouro Direto?",
            opcoes: ["Emprestando dinheiro para o governo em troca de rendimento.", "Comprando uma a??o da bolsa.", "Abrindo uma conta internacional."],
            correta: 0,
            explicacao: "No Tesouro Direto, o investidor empresta dinheiro ao governo e recebe juros por isso."
        },
        {
            pergunta: "Qual vantagem torna o Tesouro Selic popular entre iniciantes?",
            opcoes: ["Oscila fortemente todos os dias.", "Tem simplicidade, liquidez e baixo risco relativo.", "Garante lucros altos em qualquer prazo."],
            correta: 1,
            explicacao: "Ele costuma ser o ponto de partida porque ? simples de entender, tem liquidez e risco mais controlado."
        }
    ],
    "Rebalanceamento da Carteira": [
        {
            pergunta: "Qual ? o principal objetivo do rebalanceamento de carteira?",
            opcoes: [
                "Tentar adivinhar qual a??o vai subir amanh?.",
                "Manter o n?vel de risco que voc? definiu para sua estrat?gia.",
                "Vender tudo o que est? caindo para n?o perder dinheiro."
            ],
            correta: 1,
            explicacao: "O rebalanceamento serve para trazer a carteira de volta aos percentuais que voc? definiu, controlando o risco."
        },
        {
            pergunta: "Na pr?tica, o que o rebalanceamento te for?a a fazer?",
            opcoes: [
                "Comprar o que est? caro e vender o que est? barato.",
                "Pagar mais taxas para a corretora sem necessidade.",
                "Comprar o que est? barato (abaixo da meta) e vender o que ficou caro (acima da meta)."
            ],
            correta: 2,
            explicacao: "Ele te obriga matematicamente a comprar na baixa e vender na alta, seguindo a sua meta de aloca??o."
        },
        {
            pergunta: "Quando o rebalanceamento costuma ser necess?rio?",
            opcoes: [
                "Quando a carteira se afasta demais dos percentuais definidos.",
                "Todos os dias, independentemente de qualquer mudan?a.",
                "Apenas quando todas as a??es est?o caindo."
            ],
            correta: 0,
            explicacao: "O rebalanceamento entra em cena quando a distribui??o real da carteira foge da estrat?gia planejada."
        }
    ],
    "Dividendos com FIIs": [
        {
            pergunta: "O que ? um FII (Fundo de Investimento Imobili?rio)?",
            opcoes: [
                "Um empr?stimo que fazes ao banco para construir casas.",
                "Um fundo que investe em im?veis e distribui alugu?is aos cotistas.",
                "Uma forma de comprar um im?vel inteiro sozinho."
            ],
            correta: 1,
            explicacao: "Ao comprar uma cota, tornas-te dono de um peda?o de grandes im?veis e recebes parte dos alugu?is."
        },
        {
            pergunta: "Qual ? o erro comum ao olhar apenas para o Dividend Yield?",
            opcoes: [
                "Achar que rendimento alto significa sempre um bom neg?cio.",
                "Achar que o rendimento ? garantido pelo governo.",
                "Ignorar que os FIIs n?o pagam dividendos mensalmente."
            ],
            correta: 0,
            explicacao: "Um yield muito alto pode ser sinal de queda no pre?o do ativo ou um problema tempor?rio."
        },
        {
            pergunta: "Qual ponto deve ser analisado al?m do rendimento de um FII?",
            opcoes: [
                "A qualidade da gest?o e dos im?veis do fundo.",
                "A cor do aplicativo da corretora.",
                "O n?mero de letras do ticker."
            ],
            correta: 0,
            explicacao: "Olhar gest?o, vac?ncia, qualidade dos ativos e contratos ajuda a entender se o fundo faz sentido."
        }
    ],
    "Escolhendo A??es": [
        {
            pergunta: "Ao comprar uma a??o, o que est?s realmente a fazer?",
            opcoes: [
                "A apostar na subida de um c?digo na bolsa.",
                "A tornar-te s?cio de um neg?cio real com funcion?rios e lucros.",
                "A emprestar dinheiro ? empresa para ela pagar d?vidas."
            ],
            correta: 1,
            explicacao: "Uma a??o ? a menor parte de uma empresa. Ser acionista ? ser s?cio do neg?cio."
        },
        {
            pergunta: "O material diz que pre?o sozinho n?o diz nada. Por qu??",
            opcoes: [
                "Porque o pre?o das a??es nunca muda.",
                "Porque uma a??o barata pode ser uma armadilha e uma cara pode ser oportunidade.",
                "Porque o lucro da empresa define um pre?o fixo para sempre."
            ],
            correta: 1,
            explicacao: "Barato pode ser um mau neg?cio com desconto. ? preciso entender a empresa antes de olhar s? para o pre?o."
        },
        {
            pergunta: "Antes de comprar uma a??o, qual atitude ? mais coerente com o curso?",
            opcoes: [
                "Estudar o neg?cio, entender riscos e avaliar a empresa.",
                "Comprar porque algu?m disse que vai subir.",
                "Olhar s? o pre?o atual e decidir na hora."
            ],
            correta: 0,
            explicacao: "O foco ? investir com crit?rio, estudando empresa, riscos e contexto antes de colocar dinheiro."
        }
    ]
};

const QUIZ_N8N_MIN_COUNT = 8;
const QUIZ_N8N_MAX_COUNT = 10;

const quizState = {
    perguntas: [],
    indiceAtual: 0,
    acertos: 0,
    origem: 'local',
    titulo: '',
    descricao: '',
    quantidadeSolicitada: QUIZ_N8N_MIN_COUNT
};

const quizHistoricoPorAula = {};

const quizContextoPorAula = {
    "Mentalidade de Investidor": "mentalidade financeira, disciplina, comportamento com dinheiro, controle emocional e construcao de habitos saudaveis",
    "Organizando sua grana": "orcamento pessoal, regra 50-30-20, organizacao dos gastos, prioridades e planejamento financeiro",
    "Montando a Reserva": "reserva de emergencia, liquidez diaria, gastos essenciais, seguranca financeira e imprevistos",
    "Cartão de Crédito sem Armadilha": "uso consciente do cartao de credito, fatura, limite, juros rotativos e parcelamento",
    "Tesouro Direto na Prática": "tesouro direto, tesouro selic, renda fixa, seguranca, liquidez e investimentos para iniciantes",
    "Dividendos com FIIs": "fundos imobiliarios, dividendos, vacancia, gestao, renda passiva e analise basica",
    "Escolhendo Ações": "acoes, empresa, valuation basico, riscos, fundamentos e perfil de investidor",
    "Rebalanceamento da Carteira": "alocacao de ativos, rebalanceamento, controle de risco, diversificacao e disciplina"
};

function limparQuizTexto(valor, fallback = '') {
    return corrigirTextoCorrompido(String(valor ?? fallback))
        .replace(/\s+/g, ' ')
        .trim();
}

function corrigirTextoCorrompido(valor) {
    const textoOriginal = String(valor ?? '');
    if (!textoOriginal) return '';

    const temSinalDeMojibake = /Ã|Â|â€|â€œ|â€|â€™|ðŸ|ï¸|�/.test(textoOriginal);
    if (!temSinalDeMojibake) {
        return textoOriginal;
    }

    try {
        const textoCorrigido = decodeURIComponent(escape(textoOriginal));
        const originalRuim = (textoOriginal.match(/Ã|Â|â|ð|ï|�/g) || []).length;
        const corrigidoRuim = (textoCorrigido.match(/Ã|Â|â|ð|ï|�/g) || []).length;

        if (textoCorrigido && corrigidoRuim <= originalRuim) {
            return textoCorrigido;
        }
    } catch (error) {
        return textoOriginal;
    }

    return textoOriginal;
}

function sortearQuantidadeQuiz() {
    return Math.floor(Math.random() * (QUIZ_N8N_MAX_COUNT - QUIZ_N8N_MIN_COUNT + 1)) + QUIZ_N8N_MIN_COUNT;
}

function escaparQuizHtml(valor) {
    return limparQuizTexto(valor)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function stripQuizCodeFences(valor) {
    return corrigirTextoCorrompido(String(valor ?? ''))
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();
}

function tentarParseQuizPayload(valor) {
    if (!valor) return null;
    if (typeof valor === 'object') return valor;
    if (typeof valor !== 'string') return null;

    const texto = stripQuizCodeFences(valor);
    if (!texto) return null;

    try {
        return JSON.parse(texto);
    } catch (error) {
        const inicio = texto.indexOf('{');
        const fim = texto.lastIndexOf('}');

        if (inicio !== -1 && fim > inicio) {
            try {
                return JSON.parse(texto.slice(inicio, fim + 1));
            } catch (nestedError) {
                return null;
            }
        }
    }

    return null;
}

function normalizarPerguntaQuiz(item) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return null;

    const pergunta = limparQuizTexto(item.pergunta || item.enunciado || item.question || '');
    const opcoesBrutas = Array.isArray(item.opcoes)
        ? item.opcoes
        : Array.isArray(item.options)
            ? item.options
            : [];
    const opcoes = opcoesBrutas
        .map((opcao) => limparQuizTexto(opcao))
        .filter(Boolean)
        .slice(0, 4);

    if (!pergunta || opcoes.length < 3) return null;

    let correta = Number.isInteger(item.correta)
        ? item.correta
        : Number.isInteger(item.correctIndex)
            ? item.correctIndex
            : Number(item.correta ?? item.correctIndex ?? 0);

    if (!Number.isFinite(correta) || correta < 0 || correta >= opcoes.length) {
        correta = 0;
    }

    return {
        pergunta,
        opcoes,
        correta,
        explicacao: limparQuizTexto(
            item.explicacao ||
            item.explanation ||
            'Boa! Essa alternativa faz mais sentido com o conteudo deste modulo.'
        )
    };
}

function normalizarRespostaQuiz(payload) {
    const bruto = tentarParseQuizPayload(
        payload?.quiz ??
        payload?.mensagem ??
        payload?.message ??
        payload?.reply ??
        payload?.response ??
        payload?.output ??
        payload?.content ??
        payload
    );

    if (!bruto || typeof bruto !== 'object' || Array.isArray(bruto)) {
        return null;
    }

    const perguntasBrutas = Array.isArray(bruto.perguntas)
        ? bruto.perguntas
        : Array.isArray(bruto.questions)
            ? bruto.questions
            : [];

    const perguntas = perguntasBrutas
        .map((item) => normalizarPerguntaQuiz(item))
        .filter(Boolean)
        .slice(0, 10);

    if (!perguntas.length) {
        return null;
    }

    return {
        titulo: limparQuizTexto(bruto.titulo || `Quiz: ${aulaSelecionada || 'GSA'}`),
        descricao: limparQuizTexto(
            bruto.descricao ||
            bruto.resumo ||
            `Perguntas novas para praticar ${aulaSelecionada || 'o conteudo do modulo'}.`
        ),
        perguntas
    };
}

function obterPerguntasQuizLocais() {
    return (bancoDeQuizzes[aulaSelecionada] || bancoDeQuizzes["Mentalidade de Investidor"] || [])
        .map((item) => normalizarPerguntaQuiz(item))
        .filter(Boolean);
}

function obterPerguntasQuizAtuais() {
    return quizState.perguntas.length ? quizState.perguntas : obterPerguntasQuizLocais();
}

function salvarHistoricoQuiz(perguntas) {
    const historicoAtual = Array.isArray(quizHistoricoPorAula[aulaSelecionada])
        ? quizHistoricoPorAula[aulaSelecionada]
        : [];
    const atualizadas = Array.from(
        new Set([
            ...historicoAtual,
            ...perguntas.map((pergunta) => limparQuizTexto(pergunta.pergunta)).filter(Boolean)
        ])
    );

    quizHistoricoPorAula[aulaSelecionada] = atualizadas.slice(-60);
}

function atualizarCabecalhoQuiz(tituloTexto, descricaoTexto) {
    const titulo = document.getElementById('tituloAulaAtiva');
    const subtitulo = document.getElementById('cursoPertencente');

    if (titulo) titulo.innerText = tituloTexto;
    if (subtitulo) subtitulo.innerText = descricaoTexto;
}

function renderizarQuizCarregando() {
    const container = document.querySelector('.aula-acoes');
    if (!container) return;

    atualizarCabecalhoQuiz(`Quiz: ${aulaSelecionada}`, `Gerando ${quizState.quantidadeSolicitada} perguntas novas para este modulo...`);

    container.innerHTML = `
        <div style="padding: 24px; border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 18px; background: rgba(255, 255, 255, 0.03); text-align: center;">
            <div style="width: 46px; height: 46px; margin: 0 auto 14px; border-radius: 999px; border: 3px solid rgba(34, 197, 94, 0.2); border-top-color: #22c55e; animation: girarQuiz 1s linear infinite;"></div>
            <h3 style="color: #fff; font-size: 18px; margin-bottom: 8px;">Montando um quiz novo agora</h3>
            <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">
                A IA GSA esta preparando perguntas diferentes para ${aulaSelecionada}.
            </p>
        </div>
    `;
}

async function buscarQuizDinamico() {
    const response = await fetch(N8N_CHAT_WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mode: "quiz",
            module: aulaSelecionada,
            course: cursoSelecionado,
            count: quizState.quantidadeSolicitada,
            module_context: quizContextoPorAula[aulaSelecionada] || '',
            avoid_questions: (quizHistoricoPorAula[aulaSelecionada] || []).slice(-30)
        })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.message || data?.error || "Falha ao gerar quiz dinamico.");
    }

    return normalizarRespostaQuiz(data);
}

async function abrirQuiz() {
    if (!aulaSelecionada) {
        alert("Selecione uma aula primeiro :)");
        return;
    }

    quizState.perguntas = [];
    quizState.indiceAtual = 0;
    quizState.acertos = 0;
    quizState.quantidadeSolicitada = sortearQuantidadeQuiz();

    renderizarQuizCarregando();

    try {
        const quizGerado = await buscarQuizDinamico();

        if (quizGerado?.perguntas?.length) {
            quizState.perguntas = quizGerado.perguntas;
            quizState.origem = 'ia';
            quizState.titulo = quizGerado.titulo;
            quizState.descricao = quizGerado.descricao;
            salvarHistoricoQuiz(quizGerado.perguntas);
            atualizarCabecalhoQuiz(quizGerado.titulo, quizGerado.descricao);
            carregarPergunta(0);
            return;
        }
    } catch (error) {
        console.error('Quiz dinamico indisponivel no momento:', error);
    }

    quizState.perguntas = obterPerguntasQuizLocais();
    quizState.origem = 'local';
    quizState.titulo = `Quiz: ${aulaSelecionada}`;
    quizState.descricao = "Modo local ativo enquanto o quiz dinamico nao responde.";
    atualizarCabecalhoQuiz(quizState.titulo, quizState.descricao);
    carregarPergunta(0);
}

function gerarNovoQuiz() {
    abrirQuiz();
}

function carregarPergunta(index) {
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

function carregarPergunta(index) {
    const container = document.querySelector('.aula-acoes');
    const perguntasAtuais = obterPerguntasQuizAtuais();
    const dados = perguntasAtuais[index];

    if (!container || !dados) return;

    quizState.indiceAtual = index;

    container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; flex-wrap: wrap;">
            <span style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: 0.04em; background: rgba(34, 197, 94, 0.12); border: 1px solid rgba(34, 197, 94, 0.25); color: #86efac;">
                ${quizState.origem === 'ia' ? 'NOVO QUIZ DA IA' : 'QUIZ LOCAL'}
            </span>
            <button class="btn-acess-item" style="justify-content: center; padding: 10px 14px; font-size: 12px;" onclick="gerarNovoQuiz()">
                Gerar novo quiz
            </button>
        </div>
        <p class="quiz-pergunta">${escaparQuizHtml(dados.pergunta)}</p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            ${dados.opcoes.map((opcao, i) => `
                <button class="quiz-opcao" onclick="verificarResposta(${index}, ${i}, event)">
                    ${escaparQuizHtml(opcao)}
                </button>
            `).join('')}
        </div>
        <div class="quiz-footer">
            Pergunta ${index + 1} de ${perguntasAtuais.length} • Acertos ${quizState.acertos}
        </div>
    `;
}

function verificarResposta(perguntaIdx, respostaIdx, event) {
    const perguntasAtuais = obterPerguntasQuizAtuais();
    const dados = perguntasAtuais[perguntaIdx];
    const container = document.querySelector('.aula-acoes');

    if (!container || !dados) return;

    if (respostaIdx === dados.correta) {
        quizState.acertos += 1;

        container.innerHTML = `
            <div style="text-align: center; animation: fadeInUp 0.4s ease;">
                <h3 style="color: #22c55e; margin-bottom: 10px;">Resposta correta!</h3>
                <p style="color: #ccc; font-size: 14px; margin-bottom: 20px; line-height: 1.6;">
                    ${escaparQuizHtml(dados.explicacao)}
                </p>
                ${perguntaIdx + 1 < perguntasAtuais.length
                    ? `<button class="btn-acess-item" style="justify-content: center; background: #22c55e; color: #000;" onclick="carregarPergunta(${perguntaIdx + 1})">Proxima pergunta</button>`
                    : `<div style="padding: 20px; border: 1px solid #22c55e; border-radius: 15px; background: rgba(34, 197, 94, 0.1); margin-bottom: 20px;">
                        <p style="color: #fff; font-weight: bold; margin-bottom: 6px;">Quiz concluido!</p>
                        <p style="color: #d4d4d8; font-size: 13px; line-height: 1.5;">Voce acertou ${quizState.acertos} de ${perguntasAtuais.length} perguntas em ${escaparQuizHtml(aulaSelecionada)}.</p>
                       </div>
                       <div style="display: flex; flex-direction: column; gap: 10px; align-items: stretch;">
                            <button class="btn-acess-item" style="justify-content: center; background: #22c55e; color: #000;" onclick="gerarNovoQuiz()">Gerar novo quiz</button>
                            <button class="btn-voltar-gsa" onclick="abrirJanelaAula()">Voltar para a Aula</button>
                       </div>`
                }
            </div>
        `;
    } else {
        const botaoClicado = event?.target;
        if (!botaoClicado) return;

        botaoClicado.style.borderColor = "#ef4444";
        botaoClicado.style.background = "rgba(239, 68, 68, 0.1)";
        botaoClicado.innerText = "Tente outra vez";

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

let iaEnviandoMensagem = false;

function inicializarEnvioChatComEnter() {
    const input = document.getElementById('user-query');

    if (!input || input.dataset.enterInicializado === 'true') {
        return;
    }

    input.dataset.enterInicializado = 'true';
    input.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' || event.shiftKey) {
            return;
        }

        event.preventDefault();

        if (!iaEnviandoMensagem) {
            perguntarIA();
        }
    });
}

inicializarEnvioChatComEnter();

async function perguntarIA() {
    const input = document.getElementById('user-query');
    const container = document.getElementById('chat-messages');

    if (!input || !container) return;

    const query = input.value.trim();
    if (!query) return;

    const escapeHtml = (texto) => corrigirTextoCorrompido(String(texto))
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const formatarTexto = (texto) => escapeHtml(texto).replaceAll('\n', '<br>');

    const tentarParseJson = (valor) => {
        if (typeof valor !== 'string') return valor;

        const removerCercasMarkdown = (texto) => {
            const textoLimpo = corrigirTextoCorrompido(texto).trim();
            const matchBloco = textoLimpo.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
            return matchBloco ? matchBloco[1].trim() : textoLimpo;
        };

        const texto = removerCercasMarkdown(valor);
        if (!texto) return '';

        const candidatos = [texto];

        const inicioObjeto = texto.indexOf('{');
        const fimObjeto = texto.lastIndexOf('}');
        if (inicioObjeto !== -1 && fimObjeto > inicioObjeto) {
            candidatos.push(texto.slice(inicioObjeto, fimObjeto + 1).trim());
        }

        const inicioArray = texto.indexOf('[');
        const fimArray = texto.lastIndexOf(']');
        if (inicioArray !== -1 && fimArray > inicioArray) {
            candidatos.push(texto.slice(inicioArray, fimArray + 1).trim());
        }

        for (const candidato of candidatos) {
            if (
                (candidato.startsWith('{') && candidato.endsWith('}')) ||
                (candidato.startsWith('[') && candidato.endsWith(']'))
            ) {
                try {
                    return JSON.parse(candidato);
                } catch {
                    continue;
                }
            }
        }

        return texto;
    };

    const formatarRotulo = (chave) => {
        const texto = corrigirTextoCorrompido(String(chave)).replaceAll('_', ' ').replaceAll('-', ' ');
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    };

    const normalizarChave = (chave) => corrigirTextoCorrompido(String(chave))
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    const ehChaveTitulo = (chave) => ['titulo', 'title', 'tema', 'assunto', 'topico', 'topico_principal']
        .includes(normalizarChave(chave));

    const ehChaveResumo = (chave) => ['resumo', 'summary', 'descricao', 'description', 'subtitulo', 'subtitulo_curto']
        .includes(normalizarChave(chave));

    const ehChaveLista = (chave) => [
        'passos',
        'etapas',
        'lista',
        'itens',
        'dicas',
        'recomendacoes',
        'recomendacoes_praticas',
        'acoes',
        'exemplos',
        'exemplos_de_uso',
        'como_fazer',
        'pontos_chave',
        'pontos'
    ].includes(normalizarChave(chave));

    const ehChaveAlerta = (chave) => {
        const chaveNormalizada = normalizarChave(chave);
        return ['alerta', 'atencao', 'cuidado', 'importante', 'observacao', 'aviso']
            .includes(chaveNormalizada);
    };

    const temRespostaEstruturada = (valor) => {
        if (!valor || typeof valor !== 'object' || Array.isArray(valor)) {
            return false;
        }

        return Object.keys(valor).length > 0;
    };

    const temRespostaPadraoGSA = (valor) => {
        if (!valor || typeof valor !== 'object' || Array.isArray(valor)) {
            return false;
        }

        const chaves = Object.keys(valor).map(normalizarChave);
        return [
            'titulo',
            'resumo',
            'explicacao',
            'explicacao_curta',
            'pontos_chave',
            'alerta'
        ].some((chave) => chaves.includes(chave));
    };

    const gerarTituloFallback = () => {
        const textoOriginal = corrigirTextoCorrompido(String(query || '')).trim().replace(/[?!.]+$/g, '');

        if (!textoOriginal) return '';

        const textoLimpo = textoOriginal
            .replace(/^(o que é|o que e|o que seria|me explica|explique|fala sobre|me fale sobre|quero saber sobre|como funciona|qual a finalidade de|qual a importancia de|qual a importância de)\s+/i, '')
            .trim();

        const titulo = textoLimpo || textoOriginal;
        return titulo ? titulo.charAt(0).toUpperCase() + titulo.slice(1) : '';
    };

    const limparTextoPlano = (texto) => corrigirTextoCorrompido(String(texto))
        .replace(/\s+/g, ' ')
        .trim();

    const resumirTextoCurto = (texto, limite = 180) => {
        const textoLimpo = limparTextoPlano(texto);
        if (!textoLimpo) return '';

        const sentencas = textoLimpo.match(/[^.!?]+[.!?]?/g) || [textoLimpo];
        const primeiraSentenca = sentencas[0]?.trim() || textoLimpo;

        if (primeiraSentenca.length <= limite) {
            return primeiraSentenca;
        }

        const corte = primeiraSentenca.slice(0, limite);
        const ultimoEspaco = corte.lastIndexOf(' ');
        const pontoCorte = ultimoEspaco > 60 ? ultimoEspaco : limite;
        return `${corte.slice(0, pontoCorte).trim()}...`;
    };

    const transformarTextoEmItem = (chave, texto) => {
        const chaveNormalizada = normalizarChave(chave);
        const resumo = resumirTextoCurto(texto, 165);

        if (!resumo) return '';

        if (['finalidade', 'proposito', 'objetivo'].includes(chaveNormalizada)) {
            return resumo;
        }

        if (['tamanho_ideal', 'valor_ideal', 'meta_ideal'].includes(chaveNormalizada)) {
            return `Meta ideal: ${resumo}`;
        }

        if (['onde_guardar', 'onde_deixar', 'onde_investir'].includes(chaveNormalizada)) {
            return `Onde guardar: ${resumo}`;
        }

        if (['importancia', 'beneficio', 'beneficios'].includes(chaveNormalizada)) {
            return `Por que isso importa: ${resumo}`;
        }

        return resumo;
    };

    const renderizarItemLista = (item) => {
        const valor = tentarParseJson(item);

        if (valor === null || typeof valor === 'undefined' || valor === '') {
            return '';
        }

        if (typeof valor === 'string' || typeof valor === 'number' || typeof valor === 'boolean') {
            return formatarTexto(valor);
        }

        if (Array.isArray(valor)) {
            return `
                <ul class="ia-resposta-lista">
                    ${valor.map((subitem) => `<li>${renderizarItemLista(subitem)}</li>`).join('')}
                </ul>
            `;
        }

        if (typeof valor === 'object') {
            return renderizarRespostaEstruturada(valor, { nested: true });
        }

        return formatarTexto(valor);
    };

    const renderizarListaPassos = (itens) => {
        return itens
            .map((item) => `<li>${renderizarItemLista(item)}</li>`)
            .join('');
    };

    const renderizarListaGenerica = (itens) => {
        return itens
            .map((item) => `<li>${renderizarItemLista(item)}</li>`)
            .join('');
    };

    const extrairListaCurta = (valor, limite = 3) => {
        const valorNormalizado = tentarParseJson(valor);
        const itens = Array.isArray(valorNormalizado) ? valorNormalizado : [valorNormalizado];

        return itens
            .map((item) => {
                if (item === null || typeof item === 'undefined' || item === '') {
                    return '';
                }

                if (typeof item === 'object') {
                    return resumirTextoCurto(JSON.stringify(item), 160);
                }

                return resumirTextoCurto(limparTextoPlano(item), 160);
            })
            .filter(Boolean)
            .slice(0, limite);
    };

    const renderizarRespostaPadraoGSA = (valor) => {
        const titulo = formatarTexto(valor.titulo || valor.tema || valor.assunto || gerarTituloFallback());
        const resumo = resumirTextoCurto(
            limparTextoPlano(valor.resumo || valor.conceito || valor.finalidade || ''),
            170
        );
        const explicacao = limparTextoPlano(
            valor.explicacao ||
            valor.explicação ||
            valor.definicao ||
            valor.definição ||
            ''
        );
        const pontosChave = extrairListaCurta(
            valor.pontos_chave || valor.pontos || valor.passos || valor.etapas || valor.exemplos_de_uso || [],
            3
        );
        const exercicios = extrairListaCurta(
            valor.exercicios || valor.fixacao || valor.perguntas_de_fixacao || [],
            12
        );
        const alerta = resumirTextoCurto(
            limparTextoPlano(valor.alerta || valor.aviso || valor.importante || ''),
            160
        );

        const blocos = [];

        if (titulo) {
            blocos.push(`<div class="ia-resposta-titulo">${titulo}</div>`);
        }

        if (resumo) {
            blocos.push(`<p class="ia-resposta-resumo">${formatarTexto(resumo)}</p>`);
        }

        if (explicacao) {
            blocos.push(`<p class="ia-resposta-explicacao">${formatarTexto(explicacao)}</p>`);
        }

        if (pontosChave.length) {
            blocos.push(`
                <div class="ia-resposta-secao">
                    <div class="ia-resposta-secao-titulo">Pontos-chave</div>
                    <ul class="ia-resposta-lista">
                        ${pontosChave.map((item) => `<li>${formatarTexto(item)}</li>`).join('')}
                    </ul>
                </div>
            `);
        }

        if (exercicios.length) {
            blocos.push(`
                <div class="ia-resposta-secao">
                    <div class="ia-resposta-secao-titulo">Exercícios para praticar</div>
                    <ol class="ia-resposta-exercicios">
                        ${exercicios.map((item) => `<li>${formatarTexto(item)}</li>`).join('')}
                    </ol>
                </div>
            `);
        }

        if (alerta) {
            blocos.push(`
                <div class="ia-resposta-alerta">
                    <span class="ia-resposta-alerta-icon">&#9888;&#65039;</span>
                    <p>${formatarTexto(alerta)}</p>
                </div>
            `);
        }

        return `<div class="ia-resposta-card ia-resposta-card-gsa">${blocos.join('')}</div>`;
    };

    const renderizarRespostaChatGSA = (valor) => {
        const titulo = formatarTexto(valor.titulo || valor.tema || valor.assunto || gerarTituloFallback());
        const resumo = resumirTextoCurto(
            limparTextoPlano(valor.resumo || valor.conceito || valor.finalidade || ''),
            170
        );
        const explicacao = limparTextoPlano(
            valor.explicacao ||
            valor.explicação ||
            valor.definicao ||
            valor.definição ||
            ''
        );
        const pontosChave = extrairListaCurta(
            valor.pontos_chave || valor.pontos || valor.passos || valor.etapas || valor.exemplos_de_uso || [],
            3
        );
        const alerta = resumirTextoCurto(
            limparTextoPlano(valor.alerta || valor.aviso || valor.importante || ''),
            160
        );

        const blocos = [];

        if (titulo) {
            blocos.push(`<div class="ia-resposta-titulo">${titulo}</div>`);
        }

        if (resumo) {
            blocos.push(`<p class="ia-resposta-resumo">${formatarTexto(resumo)}</p>`);
        }

        if (explicacao) {
            blocos.push(`<p class="ia-resposta-explicacao">${formatarTexto(explicacao)}</p>`);
        }

        if (pontosChave.length) {
            blocos.push(`
                <div class="ia-resposta-secao">
                    <div class="ia-resposta-secao-titulo">Pontos-chave</div>
                    <ul class="ia-resposta-lista">
                        ${pontosChave.map((item) => `<li>${formatarTexto(item)}</li>`).join('')}
                    </ul>
                </div>
            `);
        }

        if (alerta) {
            blocos.push(`
                <div class="ia-resposta-alerta">
                    <span class="ia-resposta-alerta-icon">&#9888;&#65039;</span>
                    <p>${formatarTexto(alerta)}</p>
                </div>
            `);
        }

        return `<div class="ia-resposta-card ia-resposta-card-gsa">${blocos.join('')}</div>`;
    };

    const ordenarEntradasResposta = (valor) => {
        const ordemPreferida = [
            'titulo',
            'tema',
            'assunto',
            'resumo',
            'explicacao',
            'explicacao_curta',
            'conceito',
            'finalidade',
            'pontos_chave',
            'passos',
            'etapas',
            'exercicios',
            'exemplos_de_uso',
            'exemplos',
            'tamanho_ideal',
            'onde_guardar',
            'importancia',
            'alerta'
        ].map(normalizarChave);

        return Object.entries(valor).sort(([chaveA], [chaveB]) => {
            const indiceA = ordemPreferida.indexOf(normalizarChave(chaveA));
            const indiceB = ordemPreferida.indexOf(normalizarChave(chaveB));
            const ordemA = indiceA === -1 ? Number.MAX_SAFE_INTEGER : indiceA;
            const ordemB = indiceB === -1 ? Number.MAX_SAFE_INTEGER : indiceB;

            if (ordemA !== ordemB) return ordemA - ordemB;
            return chaveA.localeCompare(chaveB, 'pt-BR');
        });
    };

    const renderizarRespostaEstruturada = (valor, opcoes = {}) => {
        const nested = opcoes.nested === true;
        const blocos = [];
        const entradas = ordenarEntradasResposta(valor).filter(([, valorCampo]) => {
            return !(
                valorCampo === null ||
                typeof valorCampo === 'undefined' ||
                valorCampo === '' ||
                (Array.isArray(valorCampo) && valorCampo.length === 0)
            );
        });

        const tituloEncontrado = entradas.find(([chave, valorCampo]) => {
            return ehChaveTitulo(chave) && (typeof valorCampo === 'string' || typeof valorCampo === 'number');
        });

        const titulo = tituloEncontrado
            ? formatarTexto(tituloEncontrado[1])
            : (!nested ? formatarTexto(gerarTituloFallback()) : '');

        const textos = [];
        const itensLista = [];
        const alertas = [];
        const nestedCards = [];

        entradas.forEach(([chave, valorCampo]) => {
            if (tituloEncontrado && chave === tituloEncontrado[0]) {
                return;
            }

            const valorNormalizado = tentarParseJson(valorCampo);

            if (
                valorNormalizado === null ||
                typeof valorNormalizado === 'undefined' ||
                valorNormalizado === '' ||
                (Array.isArray(valorNormalizado) && valorNormalizado.length === 0)
            ) {
                return;
            }

            if (ehChaveAlerta(chave)) {
                alertas.push(resumirTextoCurto(formatarMensagemIA(valorNormalizado), 140));
                return;
            }

            if (Array.isArray(valorNormalizado) || ehChaveLista(chave)) {
                const itens = Array.isArray(valorNormalizado) ? valorNormalizado : [valorNormalizado];
                itens.forEach((item) => {
                    const textoItem = resumirTextoCurto(renderizarItemLista(item), 140);
                    if (textoItem) {
                        itensLista.push(textoItem);
                    }
                });
                return;
            }

            if (typeof valorNormalizado === 'object') {
                nestedCards.push(renderizarRespostaEstruturada(valorNormalizado, { nested: true }));
                return;
            }

            textos.push({
                chave,
                valor: limparTextoPlano(valorNormalizado),
                prioridade: ehChaveResumo(chave) ? 0 : 1
            });
        });

        textos.sort((a, b) => a.prioridade - b.prioridade);

        const resumo = textos.length ? resumirTextoCurto(textos[0].valor, 190) : '';
        const itensTexto = textos
            .slice(1)
            .map((item) => transformarTextoEmItem(item.chave, item.valor))
            .filter(Boolean);

        if (titulo) {
            blocos.push(`<div class="ia-resposta-titulo">${titulo}</div>`);
        }

        if (resumo) {
            blocos.push(`<p class="ia-resposta-resumo">${formatarTexto(resumo)}</p>`);
        }

        const listaFinal = [...itensLista, ...itensTexto].filter(Boolean);
        if (listaFinal.length) {
            blocos.push(`
                <ul class="ia-resposta-lista">
                    ${listaFinal.map((item) => `<li>${formatarTexto(item)}</li>`).join('')}
                </ul>
            `);
        }

        nestedCards.forEach((card) => {
            blocos.push(`<div class="ia-resposta-subcard">${card}</div>`);
        });

        alertas.forEach((alerta) => {
            blocos.push(`
                <div class="ia-resposta-alerta">
                    <span class="ia-resposta-alerta-icon">⚠️</span>
                    <p>${formatarTexto(alerta)}</p>
                </div>
            `);
        });

        return `<div class="ia-resposta-card${nested ? ' ia-resposta-card-interno' : ''}">${blocos.join('')}</div>`;
    };

    const formatarMensagemIA = (conteudo) => {
        const valor = tentarParseJson(conteudo);

        if (valor === null || typeof valor === 'undefined' || valor === '') {
            return '';
        }

        if (typeof valor === 'string' || typeof valor === 'number' || typeof valor === 'boolean') {
            return formatarTexto(valor);
        }

        if (Array.isArray(valor)) {
            return valor
                .map((item, index) => `${index + 1}. ${formatarMensagemIA(item)}`)
                .join('<br>');
        }

        if (typeof valor === 'object') {
            if (temRespostaPadraoGSA(valor)) {
                return renderizarRespostaChatGSA(valor);
            }

            if (temRespostaEstruturada(valor)) {
                return renderizarRespostaEstruturada(valor);
            }
        }

        return formatarTexto(valor);
    };

    const extrairPayloadRespostaIA = (data) => {
        if (data === null || typeof data === 'undefined') {
            return '';
        }

        if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
            return data;
        }

        if (Array.isArray(data)) {
            const itemUtil = data.find((item) => item !== null && typeof item !== 'undefined');
            return typeof itemUtil === 'undefined' ? data : extrairPayloadRespostaIA(itemUtil);
        }

        if (typeof data !== 'object') {
            return data;
        }

        const chavesPreferidas = [
            'mensagem',
            'message',
            'reply',
            'response',
            'resposta',
            'answer',
            'output',
            'content',
            'text',
            'body',
            'data'
        ];

        for (const chave of chavesPreferidas) {
            if (typeof data[chave] !== 'undefined' && data[chave] !== null && data[chave] !== '') {
                return extrairPayloadRespostaIA(data[chave]);
            }
        }

        return data;
    };

    const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const montarMarkupMensagem = (remetente, texto, opcoes = {}) => {
        const conteudo = opcoes.html
            ? (typeof texto === 'string' ? texto : formatarMensagemIA(texto))
            : formatarTexto(texto);
        const esconderRemetente = opcoes.esconderRemetente === true;
        const corpoMensagem = opcoes.html
            ? `<div class="chat-conteudo-html${esconderRemetente ? ' chat-conteudo-html-sem-remetente' : ''}">${conteudo}</div>`
            : `<div class="chat-conteudo-texto">${conteudo}</div>`;

        return `${esconderRemetente ? '' : `<strong>${escapeHtml(remetente)}:</strong>`}${corpoMensagem}`;
    };

    const adicionarMensagem = (classe, remetente, texto, opcoes = {}) => {

        const elemento = document.createElement('div');
        elemento.className = classe;
        elemento.innerHTML = montarMarkupMensagem(remetente, texto, opcoes);
        container.appendChild(elemento);
        container.scrollTop = container.scrollHeight;
        return elemento;
    };

    const adicionarMensagemPensando = () => {
        const elemento = document.createElement('div');
        elemento.className = 'msg-ia msg-ia-pensando';
        elemento.innerHTML = `
            <strong>GSA:</strong>
            <div class="chat-pensando" aria-label="IA pensando">
                <span class="chat-pensando-ponto"></span>
                <span class="chat-pensando-ponto"></span>
                <span class="chat-pensando-ponto"></span>
            </div>
        `;
        container.appendChild(elemento);
        container.scrollTop = container.scrollHeight;
        return elemento;
    };

    const animarMensagemExistente = async (elemento, remetente, texto, opcoes = {}) => {
        if (!elemento) return;

        elemento.className = 'msg-ia';
        elemento.innerHTML = montarMarkupMensagem(remetente, texto, opcoes);

        const alvoDigitacao = elemento.querySelector('.chat-conteudo-html, .chat-conteudo-texto');
        if (!alvoDigitacao) return;

        alvoDigitacao.classList.add('chat-digitando');

        const walker = document.createTreeWalker(alvoDigitacao, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                return node.textContent && node.textContent.trim()
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT;
            }
        });

        const nosTexto = [];
        let noAtual = walker.nextNode();

        while (noAtual) {
            nosTexto.push({
                node: noAtual,
                texto: noAtual.textContent
            });
            noAtual.textContent = '';
            noAtual = walker.nextNode();
        }

        const totalCaracteres = nosTexto.reduce((total, item) => total + item.texto.length, 0);
        const tamanhoBloco = totalCaracteres > 420 ? 4 : totalCaracteres > 220 ? 3 : 2;
        const pausa = totalCaracteres > 420 ? 10 : totalCaracteres > 220 ? 14 : 18;

        for (const item of nosTexto) {
            for (let indice = 0; indice < item.texto.length; indice += tamanhoBloco) {
                item.node.textContent += item.texto.slice(indice, indice + tamanhoBloco);
                container.scrollTop = container.scrollHeight;
                await esperar(pausa);
            }
        }

        alvoDigitacao.classList.add('chat-digitando-finalizado');
    };

    adicionarMensagem('msg-user', 'Você', query);
    input.value = "";
    const mensagemPensando = adicionarMensagemPensando();
    const mensagemErroConexaoIa = 'Erro ao conectar com a IA.';

    try {
        const response = await fetch(N8N_CHAT_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: query })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const mensagemErro = data?.mensagem || data?.error || data?.message || data?.hint || "Erro ao responder.";
            await esperar(500);
            await animarMensagemExistente(mensagemPensando, 'GSA', formatarMensagemIA(mensagemErro), { html: true });
            return;
        }

        const payloadResposta = extrairPayloadRespostaIA(data);

        const temPayloadEstruturado = payloadResposta &&
            typeof payloadResposta === 'object' &&
            !Array.isArray(payloadResposta) &&
            Object.keys(payloadResposta).length > 0;

        if (
            !temPayloadEstruturado &&
            (
                typeof payloadResposta === 'undefined' ||
                payloadResposta === null ||
                payloadResposta === '' ||
                (typeof payloadResposta === 'object' && !Array.isArray(payloadResposta) && Object.keys(payloadResposta).length === 0)
            )
        ) {
            await esperar(500);
            await animarMensagemExistente(mensagemPensando, 'GSA', 'A IA respondeu em um formato diferente do esperado.');
            return;
        }

        const respostaFormatada = temPayloadEstruturado
            ? (
                temRespostaPadraoGSA(payloadResposta)
                    ? renderizarRespostaChatGSA(payloadResposta)
                    : formatarMensagemIA(payloadResposta)
            )
            : formatarMensagemIA(payloadResposta);

        if (!respostaFormatada) {
            await esperar(500);
            await animarMensagemExistente(mensagemPensando, 'GSA', 'A IA respondeu em um formato diferente do esperado.');
            return;
        }

        await esperar(650);
        await animarMensagemExistente(mensagemPensando, 'GSA', respostaFormatada, { html: true, esconderRemetente: true });
    } catch (error) {
        console.error(error);
        await esperar(500);
        return await animarMensagemExistente(mensagemPensando, 'GSA', mensagemErroConexaoIa);
    }
}



/* ===== TAXAS AUTOMÁTICAS CORRIGIDAS ===== */
const perguntarIAOriginal = perguntarIA;
perguntarIA = async function () {
    const botaoEnviar = document.getElementById('btn-enviar-ia');

    if (iaEnviandoMensagem) return;

    iaEnviandoMensagem = true;
    if (botaoEnviar) botaoEnviar.disabled = true;

    try {
        await perguntarIAOriginal();
    } finally {
        iaEnviandoMensagem = false;
        if (botaoEnviar) botaoEnviar.disabled = false;
    }
};

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

    if (window.lucide && document.querySelector('[data-lucide]')) {
        window.lucide.createIcons();
    }

    if (window.VLibras && document.querySelector('[vw]') && !window.__gsaVlibrasIniciado) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
        window.__gsaVlibrasIniciado = true;
    }
});
