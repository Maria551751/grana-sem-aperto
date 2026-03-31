export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ error: "Mensagem vazia" });
        }

        const userMessage = message.trim();

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "Você é um assistente de educação financeira para jovens. Responda de forma simples, prática, amigável e curta."
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 429) {
                const texto = userMessage.toLowerCase();
                let reply = "Posso te ajudar com isso 😊\n\n";

                if (texto.includes("selic")) {
                    reply += "A Selic é a taxa básica de juros da economia. Quando ela sobe, investimentos de renda fixa como Tesouro Selic e alguns CDBs costumam render mais.";
                } else if (texto.includes("cdi")) {
                    reply += "O CDI é uma taxa muito usada como referência para investimentos, principalmente CDBs. Muitos produtos rendem um percentual do CDI.";
                } else if (texto.includes("poupança")) {
                    reply += "A poupança é simples e segura, mas normalmente rende menos do que outras opções de renda fixa, como CDB e Tesouro Selic.";
                } else if (texto.includes("juros compostos")) {
                    reply += "Juros compostos são juros sobre juros. Isso faz o dinheiro crescer mais com o tempo, principalmente quando você investe com constância.";
                } else if (texto.includes("juros")) {
                    reply += "Juros são o valor cobrado ou recebido pelo uso do dinheiro. Nos investimentos, eles ajudam seu patrimônio a crescer ao longo do tempo.";
                } else if (texto.includes("fii") || texto.includes("fiis") || texto.includes("fundo imobiliário")) {
                    reply += "FIIs são fundos imobiliários. Eles permitem investir em imóveis de forma mais acessível e podem pagar rendimentos periódicos.";
                } else if (texto.includes("ação") || texto.includes("ações")) {
                    reply += "Ações representam pequenas partes de empresas. Ao investir em ações, você se torna sócio daquela empresa e pode ganhar com valorização e dividendos.";
                } else if (texto.includes("reserva de emergência")) {
                    reply += "A reserva de emergência é um dinheiro guardado para imprevistos. O ideal é deixar em um investimento seguro e com liquidez diária.";
                } else if (texto.includes("tesouro direto")) {
                    reply += "Tesouro Direto é uma forma de investir em títulos públicos do governo. É uma opção bastante usada por quem está começando.";
                } else if (texto.includes("cdb")) {
                    reply += "CDB é um investimento de renda fixa emitido por bancos. Muitos CDBs rendem mais do que a poupança e podem acompanhar o CDI.";
                } else if (texto.includes("renda fixa")) {
                    reply += "Renda fixa é uma categoria de investimentos com regras de rentabilidade mais previsíveis. É ótima para quem busca mais segurança.";
                } else if (texto.includes("dividendo") || texto.includes("dividendos")) {
                    reply += "Dividendos são partes do lucro que algumas empresas distribuem aos acionistas. Eles podem gerar renda ao longo do tempo.";
                } else if (texto.includes("investir") || texto.includes("investimento")) {
                    reply += "Investir é fazer o seu dinheiro trabalhar por você. O ideal é começar entendendo seu objetivo, seu prazo e seu perfil.";
                } else {
                    reply += "Essa é uma ótima pergunta sobre finanças. O mais importante é começar com constância, entender o básico e tomar decisões com estratégia.";
                }

                return res.status(200).json({ reply });
            }

            return res.status(response.status).json({
                error: data?.error?.message || "Erro ao consultar a OpenAI"
            });
        }

        const reply = data?.choices?.[0]?.message?.content;

        if (!reply) {
            return res.status(500).json({
                error: "A IA respondeu sem conteúdo"
            });
        }

        return res.status(200).json({ reply });

    } catch (error) {
        console.error("Erro interno:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}