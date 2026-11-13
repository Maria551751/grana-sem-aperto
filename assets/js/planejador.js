/* =========================================
   PLANEJADOR DE ORÇAMENTO
   Divide a renda do mês em Necessidades, Desejos e Futuro. Se a pessoa informar
   quanto gasta hoje, compara cada parte com o plano.
   Tudo fica só no navegador (localStorage); nada é enviado para o GSA.
   ========================================= */
(function () {
    'use strict';

    const CHAVE_ORCAMENTO = 'gsaOrcamento';
    // Lida por calculadora.js para preencher o aporte mensal.
    const CHAVE_APORTE = 'gsaAporteSugerido';
    const SEMANAS_POR_MES = 52 / 12;

    const MODELOS = {
        '50-30-20': { necessidades: 50, desejos: 30, futuro: 20 },
        '60-30-10': { necessidades: 60, desejos: 30, futuro: 10 },
        '70-20-10': { necessidades: 70, desejos: 20, futuro: 10 }
    };
    const PARTES = ['necessidades', 'desejos', 'futuro'];
    const NOMES = { necessidades: 'Necessidades', desejos: 'Desejos', futuro: 'Futuro' };
    const CAMPOS_DE_GASTO = { necessidades: 'gastoNecessidades', desejos: 'gastoDesejos', futuro: 'gastoFuturo' };

    const formulario = document.getElementById('formOrcamento');
    if (!formulario) return;

    const campoRenda = document.getElementById('rendaMensal');
    const erro = document.getElementById('erroOrcamento');
    const painel = document.getElementById('resultadoOrcamento');
    const vazio = document.getElementById('orcamentoVazio');
    const conteudo = document.getElementById('orcamentoConteudo');
    const barra = document.getElementById('orcamentoBarra');
    const dica = document.getElementById('orcamentoDica');
    const lista = document.getElementById('orcamentoPartes');
    const resumo = document.getElementById('orcamentoResumo');
    const status = document.getElementById('orcamentoStatus');

    // As contas são feitas em centavos (inteiros) para a soma fechar com a renda.
    const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    const moedaSemCentavos = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
    const formatar = (centavos) => moeda.format(centavos / 100);
    const paraCentavos = (reais) => Math.round(reais * 100);

    let ultimoPlano = null;

    /* ---------- Contas ---------- */

    function calcularPlano(renda, percentuais) {
        const necessidades = Math.round(renda * percentuais.necessidades / 100);
        const desejos = Math.round(renda * percentuais.desejos / 100);
        // O Futuro fica com o resto, para as três partes somarem exatamente a renda.
        return { necessidades, desejos, futuro: renda - necessidades - desejos };
    }

    // Em Necessidades e Desejos o plano é um teto; em Futuro, é uma meta a alcançar.
    function avaliarParte(parte, plano, gasto) {
        const nivel = plano > 0 ? Math.min(gasto / plano, 1) : (gasto > 0 ? 1 : 0);
        const diferenca = formatar(Math.abs(plano - gasto));

        if (parte === 'futuro') {
            const base = `Você guarda ${formatar(gasto)} de ${formatar(plano)}.`;
            if (gasto === 0) return { nivel, tipo: 'atencao', texto: 'Você ainda não guarda nada. Comece com qualquer valor.' };
            if (gasto < plano) return { nivel, tipo: 'atencao', texto: `${base} Faltam ${diferenca} para a meta.` };
            if (gasto === plano) return { nivel, tipo: 'bom', texto: `${base} Meta batida.` };
            return { nivel, tipo: 'bom', texto: `${base} Meta batida, com ${diferenca} a mais.` };
        }

        const base = `Você gasta ${formatar(gasto)} de ${formatar(plano)}.`;
        if (gasto > plano) return { nivel, tipo: 'atencao', texto: `${base} São ${diferenca} acima do plano.` };
        if (gasto === plano) return { nivel, tipo: 'bom', texto: `${base} No limite do plano.` };
        return { nivel, tipo: 'bom', texto: `${base} Sobram ${diferenca}.` };
    }

    function avaliarMes(renda, gastos) {
        const total = gastos.necessidades + gastos.desejos + gastos.futuro;
        const diferenca = formatar(Math.abs(renda - total));

        if (total > renda) {
            return { tipo: 'critico', texto: `Seus gastos passam da renda em ${diferenca}. Reveja primeiro os desejos e, depois, as contas que dá para reduzir.` };
        }
        if (total < renda) {
            return { tipo: 'bom', texto: `Sobram ${diferenca} sem destino. Que tal mandar para o Futuro?` };
        }
        return { tipo: 'bom', texto: 'Cada real do seu mês já tem destino.' };
    }

    /* ---------- Leitura do formulário ---------- */

    // null = campo vazio; NaN = valor inválido.
    function lerValor(campo) {
        if (campo.validity.badInput) return NaN;
        const texto = campo.value.trim();
        if (texto === '') return null;
        const numero = Number(texto);
        return Number.isFinite(numero) && numero >= 0 ? paraCentavos(numero) : NaN;
    }

    function lerFormulario() {
        const renda = lerValor(campoRenda);
        if (renda === null || Number.isNaN(renda) || renda <= 0) {
            return { erro: 'Informe quanto entra por mês para montar o orçamento.', campo: campoRenda };
        }

        const gastos = {};
        for (const parte of PARTES) {
            const campo = document.getElementById(CAMPOS_DE_GASTO[parte]);
            const valor = lerValor(campo);
            if (Number.isNaN(valor)) {
                return { erro: 'Os gastos precisam ser valores a partir de zero.', campo };
            }
            gastos[parte] = valor;
        }

        const modelo = formulario.elements.modeloOrcamento.value;
        return { renda, modelo: MODELOS[modelo] ? modelo : '50-30-20', gastos };
    }

    function mostrarErro(mensagem) {
        erro.textContent = mensagem;
        erro.hidden = !mensagem;
    }

    /* ---------- Tela ---------- */

    function renderizar({ renda, modelo, gastos }) {
        const percentuais = MODELOS[modelo];
        const plano = calcularPlano(renda, percentuais);
        ultimoPlano = { plano, percentuais };

        document.getElementById('orcamentoTitulo').textContent = `Regra ${modelo.split('-').join(' · ')}`;
        document.getElementById('orcamentoRenda').textContent = `Renda de ${formatar(renda)}`;
        document.getElementById('orcamentoGuardar').textContent = formatar(plano.futuro);
        document.getElementById('orcamentoEmUmAno').textContent = `Em 12 meses, isso vira ${formatar(plano.futuro * 12)}, sem contar os juros.`;

        const descricoes = [];
        for (const parte of PARTES) {
            const linha = lista.querySelector(`[data-parte="${parte}"]`);
            linha.querySelector('[data-valor]').textContent = formatar(plano[parte]);
            linha.querySelector('[data-percentual]').textContent = `${percentuais[parte]}% da renda`;
            barra.querySelector(`[data-parte="${parte}"]`).style.flexGrow = percentuais[parte];
            descricoes.push(`${NOMES[parte]} ${formatar(plano[parte])}`);

            const medidor = linha.querySelector('[data-medidor]');
            const gasto = gastos[parte];
            medidor.hidden = gasto === null;
            if (gasto !== null) {
                const avaliacao = avaliarParte(parte, plano[parte], gasto);
                medidor.dataset.situacaoTipo = avaliacao.tipo;
                medidor.querySelector('[data-nivel]').style.width = `${avaliacao.nivel * 100}%`;
                medidor.querySelector('[data-situacao]').textContent = avaliacao.texto;
            }
        }

        const porSemana = moedaSemCentavos.format(plano.desejos / 100 / SEMANAS_POR_MES);
        lista.querySelector('[data-semana]').textContent = `Lazer, delivery, roupas e streaming · cerca de ${porSemana} por semana`;
        barra.setAttribute('aria-label', `Divisão da renda: ${descricoes.join(', ')}.`);

        // O resumo do mês só faz sentido com os três gastos informados.
        const informouTudo = PARTES.every((parte) => gastos[parte] !== null);
        resumo.hidden = !informouTudo;
        let textoResumo = '';
        if (informouTudo) {
            const avaliacao = avaliarMes(renda, gastos);
            resumo.dataset.situacaoTipo = avaliacao.tipo;
            textoResumo = avaliacao.texto;
            document.getElementById('orcamentoResumoTexto').textContent = textoResumo;
        }

        vazio.hidden = true;
        conteudo.hidden = false;
        status.textContent = `Orçamento montado: ${descricoes.join(', ')}. ${textoResumo}`.trim();
    }

    function limparTela() {
        ultimoPlano = null;
        esconderDica();
        conteudo.hidden = true;
        vazio.hidden = false;
        status.textContent = '';
    }

    /* ---------- Salvar neste navegador ---------- */

    function salvar(dados) {
        try {
            localStorage.setItem(CHAVE_ORCAMENTO, JSON.stringify(dados));
        } catch (falha) {
            // Navegação privada ou armazenamento cheio: o planejador segue funcionando sem salvar.
        }
    }

    function restaurar() {
        let salvo;
        try {
            salvo = JSON.parse(localStorage.getItem(CHAVE_ORCAMENTO));
        } catch (falha) {
            localStorage.removeItem(CHAVE_ORCAMENTO);
            return;
        }
        if (!salvo || !Number.isInteger(salvo.renda) || salvo.renda <= 0 || !MODELOS[salvo.modelo]) return;

        const emReais = (centavos) => (Number.isInteger(centavos) && centavos >= 0 ? String(centavos / 100) : '');
        campoRenda.value = emReais(salvo.renda);
        formulario.elements.modeloOrcamento.value = salvo.modelo;
        for (const parte of PARTES) {
            document.getElementById(CAMPOS_DE_GASTO[parte]).value = emReais(salvo.gastos?.[parte]);
        }

        const dados = lerFormulario();
        if (!dados.erro) renderizar(dados);
    }

    /* ---------- Eventos ---------- */

    function montar({ rolar }) {
        const dados = lerFormulario();
        if (dados.erro) {
            mostrarErro(dados.erro);
            dados.campo.focus();
            return;
        }

        mostrarErro('');
        renderizar(dados);
        salvar(dados);

        // No celular o resultado fica abaixo do formulário.
        if (rolar && window.matchMedia('(max-width: 1050px)').matches) {
            const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            painel.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' });
        }
    }

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        montar({ rolar: true });
    });

    // Com o orçamento na tela, trocar a divisão atualiza na hora.
    formulario.addEventListener('change', (evento) => {
        if (evento.target.name === 'modeloOrcamento' && !conteudo.hidden) montar({ rolar: false });
    });

    document.getElementById('btnLimparOrcamento').addEventListener('click', () => {
        formulario.reset();
        mostrarErro('');
        limparTela();
        try {
            localStorage.removeItem(CHAVE_ORCAMENTO);
        } catch (falha) {
            // Sem armazenamento não há o que apagar.
        }
        campoRenda.focus();
    });

    document.getElementById('btnSimularFuturo').addEventListener('click', () => {
        if (!ultimoPlano) return;
        try {
            sessionStorage.setItem(CHAVE_APORTE, (ultimoPlano.plano.futuro / 100).toFixed(2));
        } catch (falha) {
            // Sem armazenamento a calculadora abre vazia.
        }
    });

    /* ---------- Destaque e dica ao passar o mouse ---------- */

    function destacar(parte) {
        barra.classList.toggle('com-destaque', Boolean(parte));
        for (const nome of PARTES) {
            barra.querySelector(`[data-parte="${nome}"]`).classList.toggle('destaque', nome === parte);
            lista.querySelector(`[data-parte="${nome}"]`).classList.toggle('destaque', nome === parte);
        }
    }

    function esconderDica() {
        dica.hidden = true;
        destacar(null);
    }

    function mostrarDica(segmento) {
        const parte = segmento.dataset.parte;
        if (!ultimoPlano || !NOMES[parte]) return;

        dica.querySelector('strong').textContent = formatar(ultimoPlano.plano[parte]);
        dica.querySelector('span').textContent = `${NOMES[parte]} · ${ultimoPlano.percentuais[parte]}% da renda`;
        dica.hidden = false;

        // Centraliza sobre o segmento sem deixar a dica sair do gráfico.
        const largura = barra.offsetWidth;
        const metade = dica.offsetWidth / 2;
        const centro = segmento.offsetLeft + segmento.offsetWidth / 2;
        dica.style.left = `${Math.min(Math.max(centro, metade), Math.max(largura - metade, metade))}px`;
        destacar(parte);
    }

    barra.querySelectorAll('[data-parte]').forEach((segmento) => {
        segmento.addEventListener('pointerenter', () => mostrarDica(segmento));
        segmento.addEventListener('pointerleave', esconderDica);
    });

    lista.querySelectorAll('.orcamento-parte').forEach((linha) => {
        linha.addEventListener('pointerenter', () => destacar(linha.dataset.parte));
        linha.addEventListener('pointerleave', () => destacar(null));
    });

    restaurar();
})();
