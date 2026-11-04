import Anthropic from "@anthropic-ai/sdk";

const MODELO_PADRAO = "claude-haiku-5-5";
const LIMITE_MENSAGEM = 600;
const LIMITE_HISTORICO = 6;
const LIMITE_TEXTO_HISTORICO = 1200;
const TIMEOUT_IA_MS = 15000;
// Curto para sobrar tempo do Haiku dentro do limite da função na Vercel.
// O agente do n8n chama o Claude Haiku e desiste em 10 s; o site espera um pouco mais que isso.
const TIMEOUT_N8N_MS = 12000;
const TIMEOUT_BCB_MS = 2500;
const VALIDADE_CACHE_TAXAS_MS = 60 * 60 * 1000;

// Mantenha igual ao texto de pages/criadores.html.
const TIME_GSA = [
    "Maria Eduarda Carneiro dos Santos — Ciência da Computação; estudante e Jovem Aprendiz do IBOL.",
    "Arthur da Silva Araujo — Engenharia da Computação; CEO da AIR, empresa de tecnologia que cria sites e sistemas.",
    "Gabriel Marques Bessa — vestibulando e Jovem Aprendiz da Courtyard by Marriott.",
    "Thalys Gomes de Lima da Silva — estudante e Jovem Aprendiz do IBOL.",
    "Vitor Hugo Scaldaferri — Arquitetura; estudante e Jovem Aprendiz da Aço Brasil.",
    "Vinicius Coelho Conde — vestibulando e Jovem Aprendiz da Courtyard by Marriott."
];

const CONTEXTO_POR_PAGINA = {
    calculadora: "A pessoa está na Calculadora de Juros Compostos, que simula aportes mensais com tabela mês a mês e gráfico. Dúvidas sobre taxas, prazos e aportes provavelmente se referem a essa simulação.",
    cursos: "A pessoa está na área de Cursos, com trilhas Organizar → Proteger → Crescer, módulos curtos, quizzes e PDFs. Dúvidas provavelmente se referem ao conteúdo de algum módulo.",
    criadores: "A pessoa está na página Criadores, que apresenta o time do GSA. Perguntas sobre o projeto ou sobre as pessoas do time são esperadas aqui.",
    jogo: "A pessoa está no Desafio GSA, o jogo de lições curtas: cada lição tem 5 perguntas e 3 vidas; acerto de primeira vale 10 XP, lição sem erros ganha 10 XP de bônus, cada lição rende XP uma vez por dia, a meta diária é 30 XP e jogar em dias seguidos aumenta a sequência. Quem entra na conta (Google ou link no e-mail) aparece no ranking só com o apelido. Ajude a entender o conceito das perguntas, sem entregar respostas prontas.",
    inicio: "A pessoa está na página inicial do GSA."
};

// Formato que o front espera (renderizarRespostaChatGSA em assets/js/global.js).
// Structured outputs garante esse JSON; os limites de tamanho ficam no prompt.
const SCHEMA_RESPOSTA = {
    type: "object",
    properties: {
        titulo: { type: "string" },
        resumo: { type: "string" },
        explicacao: { type: "string" },
        pontos_chave: { type: "array", items: { type: "string" } },
        alerta: { type: "string" }
    },
    required: ["titulo", "resumo", "explicacao", "pontos_chave", "alerta"],
    additionalProperties: false
};

const RESPOSTA_RECUSADA = {
    titulo: "Fora do meu alcance",
    resumo: "Não consigo ajudar com essa pergunta.",
    explicacao: "Posso tirar dúvidas sobre organização financeira, investimentos para iniciantes e o projeto GSA.",
    pontos_chave: [],
    alerta: ""
};

let cacheTaxas = { valor: null, expiraEm: 0 };
let clienteAnthropic = null;

// Criado só quando há chave: sem ANTHROPIC_API_KEY o construtor do SDK lança erro.
function obterClienteAnthropic() {
    clienteAnthropic ??= new Anthropic({ timeout: TIMEOUT_IA_MS, maxRetries: 1 });
    return clienteAnthropic;
}

function identificarPagina(caminho) {
    const texto = String(caminho || "").toLowerCase();
    if (texto.includes("calculadora")) return "calculadora";
    if (texto.includes("cursos")) return "cursos";
    if (texto.includes("criadores")) return "criadores";
    if (texto.includes("jogar")) return "jogo";
    return "inicio";
}

function formatarPercentual(valor) {
    return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";
}

async function buscarUltimoValorBCB(codigoSerie) {
    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${codigoSerie}/dados/ultimos/1?formato=json`;
    const resposta = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_BCB_MS) });

    if (!resposta.ok) {
        throw new Error(`Falha ao consultar série ${codigoSerie}`);
    }

    const [ultimo] = await resposta.json();
    return { valor: Number(String(ultimo.valor).replace(",", ".")), data: ultimo.data };
}

// Mesma lógica de taxas usada no front (assets/js/global.js) e documentada no README.
async function obterTaxasAtuais() {
    if (cacheTaxas.valor && Date.now() < cacheTaxas.expiraEm) {
        return cacheTaxas.valor;
    }

    try {
        const [selic, cdiDiario] = await Promise.all([buscarUltimoValorBCB(432), buscarUltimoValorBCB(12)]);
        const cdiAnual = (Math.pow(1 + cdiDiario.valor / 100, 252) - 1) * 100;
        const poupanca = selic.valor > 8.5 ? 6.17 : selic.valor * 0.7;

        cacheTaxas = {
            valor: `Selic: ${formatarPercentual(selic.valor)} ao ano (BCB, ${selic.data}). CDI: ${formatarPercentual(cdiAnual)} ao ano (BCB, ${cdiDiario.data}). Poupança: cerca de ${formatarPercentual(poupanca)} ao ano.`,
            expiraEm: Date.now() + VALIDADE_CACHE_TAXAS_MS
        };
        return cacheTaxas.valor;
    } catch (error) {
        console.error("Taxas do BCB indisponíveis:", error.message);
        return null;
    }
}

function montarPromptSistema(pagina, taxas) {
    return `Você é a IA GSA, assistente do Grana Sem Aperto (GSA): uma plataforma gratuita de educação financeira para jovens brasileiros que estão começando a organizar o dinheiro e a investir.

Como responder:
- Português do Brasil, linguagem simples, tom amigável e direto. Se usar um termo técnico, explique em poucas palavras.
- Seja prático: traga um exemplo com valores em reais quando ajudar a entender.
- Considere as mensagens anteriores da conversa para entender perguntas de continuação ("e se eu...", "e no caso de...").

Limites:
- Você ensina, não recomenda: não indique ação, FII, cripto, corretora ou banco específico para comprar ou vender, e nunca prometa rentabilidade.
- Nunca peça CPF, senhas, dados bancários ou outros dados pessoais. Se a pessoa enviar algum, oriente a não compartilhar.
- Se a pergunta fugir de dinheiro, finanças pessoais ou do projeto GSA, diga isso com gentileza e puxe a conversa de volta.
- Promessa de lucro garantido, "renda extra fácil" e pirâmide: alerte com clareza que são sinais de golpe.
- Em situações delicadas (dívida muito alta, imposto de renda, aposentadoria), oriente buscar um profissional certificado ou um órgão oficial.
- Não invente números. Ao citar Selic, CDI ou poupança, use apenas as taxas abaixo e mencione a data.

Taxas atuais: ${taxas || "indisponíveis agora. Explique o conceito sem citar valores e sugira conferir no site do Banco Central."}

Recursos do site para indicar quando fizer sentido:
- Calculadora de Juros Compostos (simula aportes mensais com tabela e gráfico).
- Cursos: trilhas Organizar → Proteger → Crescer, com quizzes e PDFs sobre organização da grana, reserva de emergência, cartão de crédito, Tesouro Direto, ações, FIIs e dividendos, rebalanceamento de carteira e mentalidade financeira.
- Página Criadores, com o time do projeto.

Sobre o projeto: o GSA começou como trabalho em grupo para uma apresentação no Senac. Time:
${TIME_GSA.map((pessoa) => `- ${pessoa}`).join("\n")}

Contexto da página atual: ${CONTEXTO_POR_PAGINA[pagina]}

Como preencher cada campo da resposta:
- "titulo": o tema, em até 6 palavras.
- "resumo": a resposta direta em uma frase (até 160 caracteres).
- "explicacao": de 2 a 4 frases com o porquê e um exemplo prático.
- "pontos_chave": até 3 itens curtos e acionáveis.
- "alerta": um cuidado importante (até 150 caracteres), ou "" se não houver.`;
}

// A API exige que a conversa comece pelo usuário; o histórico vem do navegador, então é filtrado aqui.
function limparHistorico(historico) {
    if (!Array.isArray(historico)) return [];

    const mensagens = historico
        .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string" && item.content.trim())
        .slice(-LIMITE_HISTORICO)
        .map((item) => ({ role: item.role, content: item.content.trim().slice(0, LIMITE_TEXTO_HISTORICO) }));

    while (mensagens[0]?.role === "assistant") {
        mensagens.shift();
    }

    return mensagens;
}

function normalizarResposta(conteudo) {
    let resposta;

    try {
        resposta = JSON.parse(conteudo);
    } catch {
        return { titulo: "", resumo: "", explicacao: String(conteudo).trim(), pontos_chave: [], alerta: "" };
    }

    const texto = (valor) => (typeof valor === "string" ? valor.trim() : "");

    return {
        titulo: texto(resposta.titulo),
        resumo: texto(resposta.resumo),
        explicacao: texto(resposta.explicacao),
        pontos_chave: Array.isArray(resposta.pontos_chave) ? resposta.pontos_chave.map(texto).filter(Boolean).slice(0, 3) : [],
        alerta: texto(resposta.alerta)
    };
}

const temConteudo = (card) => Boolean(card && (card.resumo || card.explicacao));

// Aceita o card direto, um array de itens (padrão do n8n), {"output": "..."} do AI Agent,
// {"text"}, {"reply"} ou {"resposta"}, e texto puro. Formato no n8n/README.md.
function extrairRespostaN8n(dado) {
    if (typeof dado === "string") {
        return dado.trim() ? normalizarResposta(dado) : null;
    }
    if (Array.isArray(dado)) {
        return extrairRespostaN8n(dado[0]);
    }
    if (!dado || typeof dado !== "object" || dado.usar_ia) {
        return null;
    }
    if (["titulo", "resumo", "explicacao", "pontos_chave", "alerta"].some((campo) => campo in dado)) {
        return normalizarResposta(JSON.stringify(dado));
    }
    for (const chave of ["reply", "resposta", "output", "text"]) {
        if (dado[chave]) return extrairRespostaN8n(dado[chave]);
    }
    return null;
}

// O workflow do n8n responde primeiro. Sem resposta útil (vazio, {"usar_ia": true}, erro ou demora),
// devolve null e o Haiku assume.
async function perguntarAoN8n({ mensagem, historico, pagina, taxas }) {
    const url = process.env.N8N_WEBHOOK_URL;
    if (!url) return null;

    const cabecalhos = { "Content-Type": "application/json" };
    if (process.env.N8N_WEBHOOK_TOKEN) {
        cabecalhos["X-GSA-Token"] = process.env.N8N_WEBHOOK_TOKEN;
    }

    try {
        const resposta = await fetch(url, {
            method: "POST",
            headers: cabecalhos,
            body: JSON.stringify({
                mensagem,
                historico,
                pagina,
                contexto_pagina: CONTEXTO_POR_PAGINA[pagina],
                taxas,
                prompt_sistema: montarPromptSistema(pagina, taxas)
            }),
            signal: AbortSignal.timeout(TIMEOUT_N8N_MS)
        });

        if (!resposta.ok) {
            console.error("n8n respondeu com erro:", resposta.status);
            return null;
        }

        const texto = await resposta.text();
        let dado = texto;
        try {
            dado = JSON.parse(texto);
        } catch {
            // Texto puro também vale como resposta.
        }

        const card = extrairRespostaN8n(dado);
        return temConteudo(card) ? card : null;
    } catch (error) {
        console.error("n8n indisponível:", error.message);
        return null;
    }
}

// Quando a IA não estiver disponível, o front responde com a base local (obterRespostaRapidaEducacaoFinanceira).
function responderFallback(res, motivo) {
    return res.status(503).json({ fallback: true, error: motivo });
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    try {
        const corpo = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
        const mensagem = typeof corpo.message === "string" ? corpo.message.trim() : "";

        if (!mensagem) {
            return res.status(400).json({ error: "Mensagem vazia" });
        }

        if (mensagem.length > LIMITE_MENSAGEM) {
            return res.status(400).json({ error: `Mensagem muito longa. Use até ${LIMITE_MENSAGEM} caracteres.` });
        }

        if (!process.env.N8N_WEBHOOK_URL && !process.env.ANTHROPIC_API_KEY) {
            return responderFallback(res, "Nenhuma IA configurada (N8N_WEBHOOK_URL ou ANTHROPIC_API_KEY)");
        }

        const taxas = await obterTaxasAtuais();
        const pagina = identificarPagina(corpo.pagina);
        const historico = limparHistorico(corpo.historico);

        const respostaN8n = await perguntarAoN8n({ mensagem, historico, pagina, taxas });
        if (respostaN8n) {
            return res.status(200).json({ reply: respostaN8n });
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            return responderFallback(res, "O n8n não respondeu e a ANTHROPIC_API_KEY não está configurada");
        }

        const resposta = await obterClienteAnthropic().messages.create({
            model: process.env.ANTHROPIC_MODEL || MODELO_PADRAO,
            // O Haiku 5.5 pensa por padrão e o pensamento conta nesse limite: sobra espaço para a resposta.
            max_tokens: 4096,
            output_config: {
                effort: "low",
                format: { type: "json_schema", schema: SCHEMA_RESPOSTA }
            },
            system: montarPromptSistema(pagina, taxas),
            messages: [
                ...historico,
                { role: "user", content: mensagem }
            ]
        });

        // Recusa dos filtros de segurança: HTTP 200, sem JSON no formato pedido. Não há fallback de modelo no Haiku.
        if (resposta.stop_reason === "refusal") {
            console.warn("Pergunta recusada pela IA:", resposta.stop_details?.category);
            return res.status(200).json({ reply: RESPOSTA_RECUSADA });
        }

        if (resposta.stop_reason === "max_tokens") {
            return responderFallback(res, "A resposta da IA foi cortada");
        }

        // A resposta pode começar com blocos de pensamento; só os de texto interessam.
        const conteudo = resposta.content
            .filter((bloco) => bloco.type === "text")
            .map((bloco) => bloco.text)
            .join("");

        if (!conteudo) {
            return responderFallback(res, "A IA respondeu sem conteúdo");
        }

        return res.status(200).json({ reply: normalizarResposta(conteudo) });

    } catch (error) {
        if (error instanceof Anthropic.AuthenticationError) {
            console.error("ANTHROPIC_API_KEY inválida");
        } else if (error instanceof Anthropic.RateLimitError) {
            console.error("Limite de uso da API da Anthropic atingido");
        } else if (error instanceof Anthropic.APIError) {
            console.error("Erro da API da Anthropic:", error.status, error.message);
        } else {
            console.error("Erro interno:", error);
        }
        return responderFallback(res, "IA indisponível no momento");
    }
}
