# Chat do GSA pelo n8n

O GSA Assistente (`api/chat.mjs`, na Vercel) pergunta primeiro ao seu workflow do n8n. Assim você controla exatamente o que o bot responde. A ordem é:

1. **n8n** responde.
2. Se o n8n devolver vazio, `{"usar_ia": true}`, der erro ou demorar mais de 12 segundos, o **Claude Haiku** do próprio site responde (se a `ANTHROPIC_API_KEY` estiver configurada na Vercel).
3. Se nenhum dos dois responder, o site usa as **respostas locais** do `global.js`.

A URL do webhook fica só na Vercel e nunca aparece no site.

## O agente GSA IA (Claude Haiku 5.5)

O agente do GSA está em [`gsa-ia-haiku.json`](gsa-ia-haiku.json). É a versão nova do antigo **GSA IA - Webhook n8n (Gemini Chat + Quiz)**, de abril de 2026, com o Gemini trocado pelo **Claude Haiku 5.5**:

- **Entrada:** `POST /webhook/gsa-chat`, no formato abaixo. Também aceita `message` e o modo quiz antigo (`mode: "quiz"`, `module`, `count`).
- **Comportamento:** usa o `prompt_sistema` que o site manda, ou seja, o mesmo prompt de `api/chat.mjs`. Se ele não vier, usa o prompt padrão do nó "Preparar Pedido ao Claude".
- **Resposta:** o card, com resposta estruturada (`output_config.format`) e `effort: "low"`. O histórico das últimas mensagens vai junto.
- **Falhas:**
  - Se o Claude falhar ou demorar mais de 10 s, o agente responde 502 com `usar_ia: true` e o site responde sozinho.
  - Se o Claude recusar a pergunta, o agente devolve um card educado.

Para instalar:

1. No n8n, **Import from File** com `gsa-ia-haiku.json`.
2. No nó "Perguntar ao Claude Haiku", crie a credencial **Anthropic** com a sua chave da API.
3. No nó "Receber Pergunta do Site", mude Authentication para **Header Auth** e crie uma credencial nova: Name `X-GSA-Token`, Value um segredo longo.
4. Publique e coloque a URL e o segredo na Vercel (tabela abaixo).

Não escreva chave de API dentro dos nós nem suba export de workflow com chave para o GitHub.

## Variáveis na Vercel

Em **Project → Settings → Environment Variables**:

| Variável | Valor |
|---|---|
| `N8N_WEBHOOK_URL` | URL de produção do webhook, por exemplo `https://n8n.seudominio.com/webhook/gsa-chat` (a que tem `/webhook/`, não `/webhook-test/`) |
| `N8N_WEBHOOK_TOKEN` | Um segredo longo e aleatório. O site manda no cabeçalho `X-GSA-Token` |
| `ANTHROPIC_API_KEY` | Opcional: a IA que responde quando o n8n não responder |

Depois de salvar, faça um novo deploy.

## Montar o workflow no n8n

1. **Webhook**
   - HTTP Method: `POST`
   - Path: `gsa-chat`
   - Authentication: **Header Auth**, com uma credencial de nome `X-GSA-Token` e valor igual ao `N8N_WEBHOOK_TOKEN`
   - Respond: **Using 'Respond to Webhook' Node**
2. **Sua lógica**: respostas fixas, busca numa planilha ou banco, um AI Agent com a sua base de conhecimento, o que preferir.
3. **Respond to Webhook**, respondendo com JSON (formatos abaixo).
4. Publique (ative) o workflow.

## O que o site manda

```json
{
  "mensagem": "Quanto preciso guardar na reserva?",
  "historico": [
    { "role": "user", "content": "oi" },
    { "role": "assistant", "content": "Reserva de emergência — Guarde para imprevistos..." }
  ],
  "pagina": "inicio",
  "contexto_pagina": "A pessoa está na página inicial do GSA.",
  "taxas": "Selic: 13,75% ao ano (BCB, 04/11/2026). CDI: ...",
  "prompt_sistema": "Você é a IA GSA, assistente do Grana Sem Aperto..."
}
```

- `pagina` é `inicio`, `calculadora`, `planejador`, `metas`, `cursos`, `criadores` ou `jogo`.
- `historico` traz as últimas 6 mensagens, já limpas.
- `taxas` pode vir `null` se o Banco Central estiver fora do ar.
- `prompt_sistema` é o mesmo prompt que o Haiku usa (regras de segurança, time, recursos do site). Se você usar um AI Agent no n8n, pode passar esse texto como *system message*.

## O que o n8n devolve

O jeito recomendado é o card que o chat desenha:

```json
{
  "titulo": "Reserva de emergência",
  "resumo": "Guarde de 3 a 6 meses dos seus gastos essenciais.",
  "explicacao": "Se você gasta R$ 1.000 por mês com o essencial, a meta é de R$ 3.000 a R$ 6.000.",
  "pontos_chave": ["Comece com R$ 500.", "Deixe com liquidez diária.", "Não use para compras."],
  "alerta": "Reserva não é para investir em ações."
}
```

Também funcionam:

| Resposta do n8n | O que acontece |
|---|---|
| O card acima, sozinho ou dentro de uma lista `[ {...} ]` | Mostra o card |
| `{ "output": "texto" }` (saída padrão do AI Agent) | Mostra o texto. Se o texto for o card em JSON, mostra o card |
| `{ "text": "..." }`, `{ "reply": ... }` ou `{ "resposta": ... }` | Mesmo comportamento do `output` |
| Texto puro (sem JSON) | Mostra o texto |
| `{}` ou `{ "usar_ia": true }` | O n8n não sabe a resposta: o Claude Haiku responde |

Use no máximo 3 itens em `pontos_chave`; o resto é cortado.

## Exemplo: respostas fixas com IA para o resto

Um nó **Code** entre o Webhook e o Respond to Webhook:

```js
const pergunta = $json.body.mensagem.toLowerCase();

const respostas = [
  {
    termos: ['reserva', 'emergência', 'emergencia'],
    card: {
      titulo: 'Reserva de emergência',
      resumo: 'Guarde de 3 a 6 meses dos seus gastos essenciais.',
      explicacao: 'Comece com uma meta pequena e deixe o dinheiro onde dá para sacar rápido.',
      pontos_chave: ['Comece com R$ 500.', 'Liquidez diária.', 'Só para imprevistos.'],
      alerta: ''
    }
  }
];

const achada = respostas.find((r) => r.termos.some((t) => pergunta.includes(t)));

// Sem resposta fixa: deixa o Claude Haiku responder.
return [{ json: achada ? achada.card : { usar_ia: true } }];
```

No Respond to Webhook, escolha **Respond With: First Incoming Item**.
