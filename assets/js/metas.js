/* =========================================
   METAS DE ECONOMIA
   A pessoa cria metas (celular, viagem, reserva), registra o que já guardou e
   vê quanto falta e em quanto tempo chega lá no ritmo atual.
   Tudo fica só no navegador (localStorage); nada é enviado para o GSA.
   As contas ficam em CALCULOS_METAS, sem tocar na página, para poderem ser testadas.
   ========================================= */
const CALCULOS_METAS = {
    // Valores em centavos. "hoje" entra por parâmetro para a previsão poder ser testada.
    situacao(meta, hoje = new Date()) {
        const falta = Math.max(meta.alvo - meta.guardado, 0);
        const percentual = meta.alvo > 0 ? Math.min(Math.floor((meta.guardado / meta.alvo) * 100), 100) : 0;
        const completa = falta === 0;
        const meses = !completa && meta.mensal > 0 ? Math.ceil(falta / meta.mensal) : null;
        let previsao = null;
        if (meses !== null) {
            // Dia 1 evita pular um mês quando hoje é dia 31.
            previsao = new Date(hoje.getFullYear(), hoje.getMonth() + meses, 1);
        }
        return { falta, percentual, completa, meses, previsao };
    },

    // null = vazio; NaN = inválido; senão, centavos.
    paraCentavos(texto) {
        const limpo = String(texto ?? '').trim();
        if (limpo === '') return null;
        const numero = Number(limpo);
        return Number.isFinite(numero) && numero >= 0 ? Math.round(numero * 100) : NaN;
    }
};

(function () {
    'use strict';

    if (typeof document === 'undefined') return;
    const formulario = document.getElementById('formMeta');
    if (!formulario) return;

    const CHAVE_METAS = 'gsaMetas';
    const LIMITE_DE_METAS = 12;
    const ICONES = ['🎯', '📱', '✈️', '🛟', '🎓', '🚲', '🎮', '🏠'];

    const lista = document.getElementById('metasLista');
    const vazio = document.getElementById('metasVazio');
    const resumo = document.getElementById('metasResumo');
    const erro = document.getElementById('erroMeta');
    const status = document.getElementById('metasStatus');
    const titulo = document.getElementById('metas-titulo');
    const botaoSalvar = document.getElementById('btnSalvarMeta');
    const botaoCancelar = document.getElementById('btnCancelarMeta');

    const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    const formatar = (centavos) => moeda.format(centavos / 100);
    const mesEAno = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
    const emMeses = (meses) => (meses === 1 ? '1 mês' : `${meses} meses`);

    function el(tag, classe, texto) {
        const no = document.createElement(tag);
        if (classe) no.className = classe;
        if (texto !== undefined) no.textContent = texto;
        return no;
    }

    /* ---------- Armazenamento ---------- */

    function carregar() {
        try {
            const salvas = JSON.parse(localStorage.getItem(CHAVE_METAS));
            if (!Array.isArray(salvas)) return [];
            return salvas.filter((meta) => meta && typeof meta.nome === 'string' && Number.isInteger(meta.alvo) && meta.alvo > 0)
                .map((meta) => ({
                    id: String(meta.id),
                    icone: ICONES.includes(meta.icone) ? meta.icone : ICONES[0],
                    nome: meta.nome.slice(0, 40),
                    alvo: meta.alvo,
                    guardado: Number.isInteger(meta.guardado) && meta.guardado >= 0 ? meta.guardado : 0,
                    mensal: Number.isInteger(meta.mensal) && meta.mensal >= 0 ? meta.mensal : 0
                }));
        } catch (falha) {
            return [];
        }
    }

    function salvar() {
        try {
            localStorage.setItem(CHAVE_METAS, JSON.stringify(metas));
        } catch (falha) {
            // Navegação privada ou armazenamento cheio: as metas valem só até fechar a página.
        }
    }

    let metas = carregar();
    let editando = null;

    /* ---------- Tela ---------- */

    function textoDaPrevisao(meta, situacao) {
        if (situacao.completa) return `Meta alcançada! Você guardou ${formatar(meta.guardado)}.`;
        const falta = `Faltam ${formatar(situacao.falta)}.`;
        if (situacao.meses === null) return `${falta} Informe quanto guarda por mês para ver a previsão.`;
        return `${falta} Guardando ${formatar(meta.mensal)} por mês, você chega lá em ${emMeses(situacao.meses)} (${mesEAno.format(situacao.previsao)}).`;
    }

    function montarCartao(meta) {
        const situacao = CALCULOS_METAS.situacao(meta);
        const cartao = el('li', `meta-card${situacao.completa ? ' completa' : ''}`);
        cartao.dataset.id = meta.id;

        const topo = el('div', 'meta-topo');
        const icone = el('span', 'meta-icone', meta.icone);
        icone.setAttribute('aria-hidden', 'true');
        const nome = el('div', 'meta-nome');
        nome.append(el('strong', '', meta.nome), el('span', '', `${formatar(meta.guardado)} de ${formatar(meta.alvo)}`));
        topo.append(icone, nome, el('strong', 'meta-percentual', `${situacao.percentual}%`));

        const medidor = el('div', 'meta-medidor');
        medidor.setAttribute('role', 'progressbar');
        medidor.setAttribute('aria-label', `Progresso da meta ${meta.nome}`);
        medidor.setAttribute('aria-valuemin', '0');
        medidor.setAttribute('aria-valuemax', '100');
        medidor.setAttribute('aria-valuenow', String(situacao.percentual));
        const nivel = el('span');
        nivel.style.width = `${situacao.percentual}%`;
        medidor.append(nivel);

        const previsao = el('p', 'meta-previsao');
        if (situacao.completa) {
            const selo = el('span', 'meta-selo', '✓');
            selo.setAttribute('aria-hidden', 'true');
            previsao.append(selo);
        }
        previsao.append(document.createTextNode(textoDaPrevisao(meta, situacao)));

        const deposito = el('form', 'meta-deposito');
        deposito.noValidate = true;
        const campo = el('div', 'campo-prefixo');
        const entrada = el('input');
        entrada.type = 'number';
        entrada.min = '0.01';
        entrada.step = '0.01';
        entrada.inputMode = 'decimal';
        entrada.placeholder = '50,00';
        entrada.setAttribute('aria-label', `Valor guardado agora para ${meta.nome}`);
        campo.append(el('span', '', 'R$'), entrada);
        const guardar = el('button', 'meta-guardar', 'Guardei');
        guardar.type = 'submit';
        deposito.append(campo, guardar);
        deposito.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const valor = CALCULOS_METAS.paraCentavos(entrada.value);
            if (!valor || Number.isNaN(valor)) {
                entrada.focus();
                return;
            }
            meta.guardado += valor;
            salvar();
            renderizar();
            const nova = CALCULOS_METAS.situacao(meta);
            status.textContent = `${formatar(valor)} guardados em ${meta.nome}. ${nova.completa ? 'Meta alcançada!' : `Faltam ${formatar(nova.falta)}.`}`;
        });

        const acoes = el('div', 'meta-acoes');
        const editar = el('button', '', 'Editar');
        editar.type = 'button';
        editar.addEventListener('click', () => comecarEdicao(meta));
        const excluir = el('button', 'meta-excluir', 'Excluir');
        excluir.type = 'button';
        // Dois toques para excluir: o primeiro pede confirmação no próprio botão.
        let confirmando = null;
        excluir.addEventListener('click', () => {
            if (!confirmando) {
                excluir.textContent = 'Confirmar exclusão';
                excluir.classList.add('confirmando');
                confirmando = setTimeout(() => {
                    excluir.textContent = 'Excluir';
                    excluir.classList.remove('confirmando');
                    confirmando = null;
                }, 4000);
                return;
            }
            clearTimeout(confirmando);
            metas = metas.filter((outra) => outra.id !== meta.id);
            if (editando === meta.id) cancelarEdicao();
            salvar();
            renderizar();
            status.textContent = `Meta ${meta.nome} excluída.`;
        });
        acoes.append(editar, excluir);

        cartao.append(topo, medidor, previsao, deposito, acoes);
        return cartao;
    }

    function renderizar() {
        lista.replaceChildren(...metas.map(montarCartao));
        vazio.hidden = metas.length > 0;
        lista.hidden = metas.length === 0;
        const guardado = metas.reduce((soma, meta) => soma + meta.guardado, 0);
        resumo.textContent = metas.length ? `${formatar(guardado)} guardados` : 'Nenhuma meta ainda';
    }

    /* ---------- Formulário ---------- */

    function mostrarErro(mensagem) {
        erro.textContent = mensagem;
        erro.hidden = !mensagem;
    }

    function cancelarEdicao() {
        editando = null;
        formulario.reset();
        mostrarErro('');
        titulo.textContent = 'Crie uma meta';
        botaoSalvar.querySelector('span').textContent = 'Salvar meta';
        botaoCancelar.hidden = true;
    }

    function comecarEdicao(meta) {
        editando = meta.id;
        formulario.elements.iconeMeta.value = meta.icone;
        formulario.elements.nomeMeta.value = meta.nome;
        formulario.elements.alvoMeta.value = String(meta.alvo / 100);
        formulario.elements.guardadoMeta.value = meta.guardado ? String(meta.guardado / 100) : '';
        formulario.elements.mensalMeta.value = meta.mensal ? String(meta.mensal / 100) : '';
        titulo.textContent = 'Editar meta';
        botaoSalvar.querySelector('span').textContent = 'Salvar alterações';
        botaoCancelar.hidden = false;
        mostrarErro('');
        formulario.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        formulario.elements.nomeMeta.focus({ preventScroll: true });
    }

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const campos = formulario.elements;
        const nome = campos.nomeMeta.value.trim();
        const alvo = CALCULOS_METAS.paraCentavos(campos.alvoMeta.value);
        const guardado = CALCULOS_METAS.paraCentavos(campos.guardadoMeta.value);
        const mensal = CALCULOS_METAS.paraCentavos(campos.mensalMeta.value);

        const falhar = (mensagem, campo) => { mostrarErro(mensagem); campo.focus(); };
        if (!nome) return falhar('Dê um nome para a meta.', campos.nomeMeta);
        if (!alvo || Number.isNaN(alvo)) return falhar('Informe o valor da meta, maior que zero.', campos.alvoMeta);
        if (Number.isNaN(guardado)) return falhar('O valor já guardado precisa ser a partir de zero.', campos.guardadoMeta);
        if (Number.isNaN(mensal)) return falhar('O valor por mês precisa ser a partir de zero.', campos.mensalMeta);
        if (!editando && metas.length >= LIMITE_DE_METAS) return falhar(`Você já tem ${LIMITE_DE_METAS} metas. Exclua uma para criar outra.`, campos.nomeMeta);

        const dados = { icone: campos.iconeMeta.value || ICONES[0], nome: nome.slice(0, 40), alvo, guardado: guardado || 0, mensal: mensal || 0 };
        const existente = metas.find((meta) => meta.id === editando);
        if (existente) {
            Object.assign(existente, dados);
            status.textContent = `Meta ${dados.nome} atualizada.`;
        } else {
            metas.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, ...dados });
            status.textContent = `Meta ${dados.nome} criada.`;
        }

        salvar();
        cancelarEdicao();
        renderizar();
        // No celular a lista fica abaixo do formulário.
        if (window.matchMedia('(max-width: 1050px)').matches) {
            document.getElementById('metasPainel').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        }
    });

    botaoCancelar.addEventListener('click', cancelarEdicao);
    renderizar();
})();
