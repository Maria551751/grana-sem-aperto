# 🚀 Grana Sem Aperto (GSA)

## 🧠 Projeto de Educação Financeira com IA e Dados Financeiros via API

Plataforma interativa que combina simulação de investimentos, trilhas educacionais e inteligência artificial para ensinar finanças de forma prática.

![Status](https://img.shields.io/badge/status-online-brightgreen)
![Frontend](https://img.shields.io/badge/frontend-HTML%20%7C%20CSS%20%7C%20JS-blue)
![IA](https://img.shields.io/badge/IA-Gemini%20API-purple)
![API](https://img.shields.io/badge/API-Banco%20Central-yellow)
![Deploy](https://img.shields.io/badge/deploy-vercel-black)

---

## 🌐 Acesse o projeto

👉 https://grana-sem-aperto.vercel.app/

---

## 💡 Sobre o Projeto

O **Grana Sem Aperto (GSA)** é uma plataforma digital de educação financeira voltada para jovens que querem começar a investir de forma prática.

O projeto combina:

* 📊 Simulação real de investimentos
* 🎓 Trilhas de aprendizado
* 🤖 Inteligência Artificial integrada

Tudo em uma interface moderna e interativa.

---

## 🎯 Problema

Grande parte dos jovens:

* não entende juros compostos
* não sabe por onde começar a investir
* acha o conteúdo financeiro complicado

---

## 🚀 Solução

O GSA resolve isso com:

* Simulações visuais e interativas
* Conteúdo dividido por níveis
* IA que responde dúvidas em tempo real

---

## ✨ Funcionalidades

### 📊 Calculadora de Juros Compostos

* Simulação completa de investimentos
* Tabela mensal detalhada
* Gráfico dinâmico com Chart.js
* Preenchimento automático da taxa CDI

---

### 🧮 Planejador de Orçamento

* Divide a renda do mês em Necessidades, Desejos e Futuro (regra 50-30-20)
* Opções 60-30-10 e 70-20-10 para quando as contas pesam mais
* Compara o plano com o que a pessoa gasta hoje
* Fica salvo só no navegador e leva o valor do Futuro para a calculadora

---

### 🎯 Metas de Economia

* Metas com valor, quanto já foi guardado e quanto entra por mês
* Barra de progresso e previsão de quando a meta é alcançada
* Fica salvo só no navegador

---

### 📖 Apostila Visual

* Uma aula visual para cada um dos 11 módulos, com gráficos, comparações e passos
* Um simulador, um "mito ou verdade" e uma lista de prática em cada aula
* PDF de cada aula gerado a partir da própria página

---

### 🎬 Videoaulas

* Aulas de cerca de dois minutos para quem está começando do zero, com animação, gráficos e narração
* Cada aula tem duas versões: horizontal para o computador e vertical para o celular
* A página `pages/videoaula.html` reconhece o aparelho e toca a versão certa; a pessoa pode trocar
* Legendas em português, ligadas por um botão
* Já no ar: Montando a Reserva, Cartão de Crédito sem Armadilha, Pontos e Milhas no Cartão, Saindo das Dívidas e Empréstimo do Jeito Certo
* Para publicar outra: coloque os arquivos em `assets/video` e cadastre o módulo em `videoaulasPorModulo` (`assets/js/global.js`)

---

### 📡 Taxas em Tempo Real

Integração com API do Banco Central para obter dados financeiros oficiais:

* Selic anual atualizada
* CDI diário fornecido pela API e convertido para anual
* Poupança calculada automaticamente

✔ Atualização automática
✔ Dados financeiros reais vindos da API
✔ Fallback em caso de erro

---

### 🤖 IA GSA Assistente

* Chat inteligente com Gemini API
* Respostas contextualizadas por página
* Suporte educacional em tempo real

---

### 🎓 Área de Cursos

* Trilhas organizadas por nível
* Módulos interativos
* Material em PDF
* Sistema de aulas

---

### 🧠 Sistema de Quiz

* Perguntas baseadas nos conteúdos
* Feedback imediato
* Experiência gamificada

---

### 🎨 Experiência do Usuário

* Design moderno (Glassmorphism + Neon)
* Animações com Intersection Observer
* Responsivo (mobile + desktop)
* Sidebar interativa

---

## 🧩 Arquitetura

* **Frontend:** HTML, CSS, JavaScript
* **IA:** Google Gemini API
* **Dados financeiros:** API do Banco Central do Brasil
* **Gráficos:** Chart.js
* **Deploy:** Vercel

---

## ⚙️ Como rodar o projeto

```bash
# Clone o repositório
git clone https://github.com/maria5517515s/grana-sem-aperto.git

# Abra com Live Server (VS Code)
```

---

## 🔑 Configuração da API

Crie um arquivo `secret.js`:

```js
window.API_ENV_KEY = "SUA_CHAVE_AQUI";
```

---

## 🔒 Segurança

* `secret.js` não é versionado (gitignore)
* Uso de variáveis de ambiente em produção
* As chaves sensíveis ficam fora do repositório público

---

## 📈 Lógica Financeira

### CDI

O CDI é obtido pela API do Banco Central do Brasil em base diária e convertido para anual:

```
(1 + taxa_diaria) ^ 252 - 1
```

---

### Poupança

* Selic > 8.5% → 6.17% ao ano
* Selic ≤ 8.5% → 70% da Selic

---

## 🚀 Próximas Melhorias

* 📈 Animação dos valores (contador dinâmico)
* 📉 Indicador de alta/queda das taxas
* 👤 Sistema de login
* 📊 Dashboard financeiro personalizado
* 📱 Transformar em PWA

---

## 👩‍💻 Desenvolvedora

**Maria Eduarda Carneiro dos Santos**

🎓 Ciência da Computação
💼 Jovem Aprendiz no IBOL

🔗 GitHub: https://github.com/Maria551751
🔗 LinkedIn: https://www.linkedin.com/in/maria-eduarda-carneiro-dos-santos-351193329/ 
---

## 💬 Sobre o Projeto

Projeto que começou em grupo para apresentação no Senac e que depois foi consolidado como portfólio autoral, aplicando:

* Integração com APIs reais
* Uso de IA em aplicações web
* Estruturação de produto digital
* Foco em UX/UI
* Desenvolvimento web 

---

## ✨ Missão

> "Transformar conhecimento financeiro em ação prática."

---

🔥 **GSA — Investir começa com entender.**
