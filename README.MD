# 🚀 Grana Sem Aperto (GSA) - Inteligência Financeira

O **Grana Sem Aperto** é uma plataforma interativa de educação financeira voltada para jovens investidores. O projeto combina ferramentas de cálculo, trilhas de aprendizagem e um assistente inteligente baseado em IA para simplificar o mundo dos investimentos.

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3 (Glassmorphism Design), JavaScript (ES6+).
* **Inteligência Artificial:** Google Gemini 2.5 Flash API.
* **Gráficos:** Chart.js para visualização de evolução de patrimônio.
* **Design:** Responsivo e moderno com foco em UX/UI.

## ✨ Funcionalidades Principais

* **IA GSA Assistente:** Um chatbot contextual integrado em todas as páginas. Ele utiliza a API do Gemini para tirar dúvidas sobre juros na calculadora ou sobre módulos na área de cursos.
* **Calculadora de Juros Compostos:** Simulador completo com tabela de evolução mensal e gráfico dinâmico de patrimônio.
* **Trilhas de Cursos:** Organização de conteúdo educativo para investidores iniciantes e avançados.
* **Segurança:** Implementação de variáveis de ambiente para proteção de chaves de API.

## 🔒 Segurança de API

Para manter a integridade do projeto e evitar o vazamento de chaves privadas, este repositório utiliza um sistema de injeção de dependências:
1. As chaves de API são armazenadas localmente em um arquivo `secret.js` (ignorado pelo Git).
2. Em produção, as chaves são gerenciadas via **Environment Variables** (Vercel/Netlify).

## 👨‍💻 Desenvolvedora

**Maria Eduarda Carneiro dos Santos (D. S. G.)** *Estudante de Ciência da Computação | Jovem Aprendiz no IBOL*

---
"Dominando suas finanças com a estratégia GSA."