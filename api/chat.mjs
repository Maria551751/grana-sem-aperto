export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Mensagem vazia" });
        }

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
                        content: "Você é um assistente de educação financeira para jovens. Explique de forma simples, prática e amigável."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Erro OpenAI:", data);
            return res.status(response.status).json({
                error: data?.error?.message || "Erro ao consultar a OpenAI"
            });
        }

        const reply = data?.choices?.[0]?.message?.content;

        if (!reply) {
            console.error("Resposta sem conteúdo:", data);
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