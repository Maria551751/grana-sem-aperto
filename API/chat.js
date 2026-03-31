export default async function handler(req, res) {
    const { message } = req.body;

    try {
        const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4.1-mini",
                input: message
            })
        });

        const data = await response.json();

        res.status(200).json({
            reply: data.output[0].content[0].text
        });

    } catch (error) {
        res.status(500).json({ error: "Erro na IA" });
    }
}