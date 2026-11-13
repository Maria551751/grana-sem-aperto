/* =========================================
   APOSTILA VISUAL: simuladores das aulas
   Cada aula pode ter um simulador (campo "simulador" em aulas-conteudo.js) com
   controles para a pessoa mexer e um resultado calculado na hora.
   As contas ficam em CALCULOS_SIMULADOR, sem tocar na página, para poderem ser testadas.
   Os valores são sempre da própria pessoa ou exemplos: nenhuma taxa real é embutida aqui.
   ========================================= */
const formatoMoedaSimulador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const formatoCentavosSimulador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const moedaSim = (valor) => formatoMoedaSimulador.format(valor);
const percentualSim = (valor) => `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
const mesesSim = (meses) => {
    if (meses < 12) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    const anos = Math.floor(meses / 12);
    const resto = meses % 12;
    return `${anos} ${anos === 1 ? 'ano' : 'anos'}${resto ? ` e ${resto} ${resto === 1 ? 'mês' : 'meses'}` : ''}`;
};

/* Cada conta recebe os valores dos controles e devolve:
   { destaque: { valor, legenda }, linhas: [{ rotulo, valor }], selo?: { bom, texto } } */
const CALCULOS_SIMULADOR = {
    constancia({ mensal, meses }) {
        return {
            destaque: { valor: moedaSim(mensal * meses), legenda: `guardados em ${mesesSim(meses)}` },
            linhas: [{ rotulo: 'Por dia, isso dá cerca de', valor: formatoCentavosSimulador.format(mensal / 30) }]
        };
    },

    divisao({ renda }) {
        const necessidades = Math.round(renda * 0.5);
        const desejos = Math.round(renda * 0.3);
        return {
            destaque: { valor: moedaSim(renda - necessidades - desejos), legenda: 'por mês para o Futuro (20%)' },
            linhas: [
                { rotulo: 'Necessidades (50%)', valor: moedaSim(necessidades) },
                { rotulo: 'Desejos (30%)', valor: moedaSim(desejos) }
            ]
        };
    },

    reserva({ gastos, meses, guarda }) {
        const meta = gastos * meses;
        return {
            destaque: { valor: moedaSim(meta), legenda: `é a sua meta para ${meses} meses de proteção` },
            linhas: [{ rotulo: `Guardando ${moedaSim(guarda)} por mês, você chega lá em`, valor: mesesSim(Math.ceil(meta / guarda)) }]
        };
    },

    rotativo({ divida }) {
        return {
            destaque: { valor: moedaSim(divida * 2), legenda: 'é até onde essa dívida pode chegar' },
            linhas: [{ rotulo: 'Juros e encargos, no limite da lei', valor: moedaSim(divida) }],
            selo: { bom: false, texto: 'O dobro do que você devia' }
        };
    },

    prazo({ prazo }) {
        const cenarios = {
            curto: { valor: 'Liquidez', primeiro: 'Títulos atrelados à Selic, que oscilam menos', cuidado: 'Prefixados e IPCA+ longos podem valer menos se você vender antes' },
            medio: { valor: 'Taxa conhecida', primeiro: 'Prefixados com vencimento perto da data do objetivo', cuidado: 'Vender antes do vencimento muda o retorno' },
            longo: { valor: 'Poder de compra', primeiro: 'Títulos IPCA+, que acompanham a inflação', cuidado: 'O preço oscila bastante no caminho' }
        };
        const cenario = cenarios[prazo];
        return {
            destaque: { valor: cenario.valor, legenda: 'é o que mais pesa nesse prazo' },
            linhas: [
                { rotulo: 'Costuma-se comparar primeiro', valor: cenario.primeiro },
                { rotulo: 'Ponto de atenção', valor: cenario.cuidado }
            ]
        };
    },

    vacancia({ vacancia }) {
        const rendimento = 1 - vacancia / 100;
        return {
            destaque: { valor: formatoCentavosSimulador.format(rendimento), legenda: 'por cota neste mês' },
            linhas: [
                { rotulo: 'Com tudo alugado', valor: formatoCentavosSimulador.format(1) },
                { rotulo: 'Queda no rendimento', valor: vacancia ? `− ${percentualSim(vacancia)}` : 'nenhuma' }
            ]
        };
    },

    concentracao({ parte, queda }) {
        const impacto = (parte * queda) / 100;
        return {
            destaque: { valor: `− ${percentualSim(impacto)}`, legenda: 'é quanto a sua carteira inteira cai' },
            linhas: [{ rotulo: 'Em R$ 1.000 investidos, a perda seria de', valor: moedaSim(impacto * 10) }]
        };
    },

    desvio({ alta }) {
        const acoes = 30 * (1 + alta / 100);
        const participacao = (acoes / (acoes + 70)) * 100;
        // Renda fixa necessária para as ações voltarem a ser 30% do total.
        const aporte = acoes * (70 / 30) - 70;
        return {
            destaque: { valor: percentualSim(participacao), legenda: 'da carteira em ações. O plano era 30%' },
            linhas: [
                { rotulo: 'Renda fixa agora', valor: percentualSim(100 - participacao) },
                { rotulo: 'Aporte em renda fixa para voltar ao plano, a cada R$ 100 iniciais', valor: moedaSim(aporte) }
            ]
        };
    },

    pontos({ gasto, retorno, anuidade }) {
        const beneficio = gasto * 12 * (retorno / 100);
        const saldo = beneficio - anuidade;
        return {
            destaque: { valor: `${saldo < 0 ? '− ' : ''}${moedaSim(Math.abs(saldo))}`, legenda: 'é o saldo do cartão em um ano' },
            linhas: [
                { rotulo: 'Pontos ou cashback no ano', valor: moedaSim(beneficio) },
                { rotulo: 'Anuidade', valor: moedaSim(anuidade) }
            ],
            selo: saldo >= 0 ? { bom: true, texto: 'O cartão devolve mais do que custa' } : { bom: false, texto: 'O cartão custa mais do que devolve' }
        };
    },

    quitacao({ divida, juros, parcela }) {
        const taxa = juros / 100;
        const jurosDoMes = divida * taxa;
        if (parcela <= jurosDoMes) {
            return {
                destaque: { valor: 'Nunca', legenda: 'com essa parcela, a dívida não diminui' },
                linhas: [{ rotulo: 'Juros só do primeiro mês', valor: moedaSim(jurosDoMes) }],
                selo: { bom: false, texto: 'A parcela não cobre nem os juros' }
            };
        }

        let saldo = divida;
        let total = 0;
        let meses = 0;
        while (saldo > 0.005 && meses < 1200) {
            saldo += saldo * taxa;
            const pagamento = Math.min(parcela, saldo);
            saldo -= pagamento;
            total += pagamento;
            meses += 1;
        }
        return {
            destaque: { valor: mesesSim(meses), legenda: 'para quitar a dívida' },
            linhas: [
                { rotulo: 'Total pago', valor: moedaSim(total) },
                { rotulo: 'Só de juros', valor: moedaSim(total - divida) }
            ]
        };
    },

    custo({ valor, parcela, parcelas }) {
        const total = parcela * parcelas;
        const custo = total - valor;
        if (custo < 0) {
            return {
                destaque: { valor: moedaSim(total), legenda: 'é a soma das parcelas' },
                linhas: [{ rotulo: 'A soma ficou menor que o valor emprestado', valor: 'confira os números' }]
            };
        }
        return {
            destaque: { valor: moedaSim(total), legenda: 'é o total que você paga' },
            linhas: [
                { rotulo: 'Juros e custos', valor: moedaSim(custo) },
                { rotulo: 'Para cada R$ 100 emprestados, você devolve', valor: moedaSim((total / valor) * 100) }
            ]
        };
    }
};

const FORMATOS_SIMULADOR = {
    moeda: moedaSim,
    percentual: percentualSim,
    meses: mesesSim,
    parcelas: (valor) => `${valor}x`
};

/* Monta o bloco do simulador. Chamado por aula.js. */
function montarSimuladorGSA(config) {
    const criar = (tag, classe, texto) => {
        const no = document.createElement(tag);
        if (classe) no.className = classe;
        if (texto !== undefined) no.textContent = texto;
        return no;
    };

    const secao = criar('section', 'aula-bloco aula-simulador');
    secao.append(criar('span', 'aula-etiqueta', 'SIMULADOR'), criar('h2', '', config.titulo));
    if (config.nota) secao.append(criar('p', 'sim-nota', config.nota));

    const corpo = criar('div', 'sim-corpo');
    const controles = criar('div', 'sim-controles');
    const resultado = criar('div', 'sim-resultado');
    const destaque = criar('strong', 'sim-destaque');
    const legenda = criar('span', 'sim-legenda');
    const linhas = criar('dl', 'sim-linhas');
    const selo = criar('p', 'sim-selo');
    // Leitores de tela ouvem o resultado só quando a pessoa solta o controle, não a cada passo.
    const aviso = criar('p', 'sim-aviso');
    aviso.setAttribute('role', 'status');
    resultado.append(destaque, legenda, linhas, selo);

    const valores = {};

    function calcular(anunciar) {
        const saida = CALCULOS_SIMULADOR[config.calculo](valores);
        destaque.textContent = saida.destaque.valor;
        legenda.textContent = saida.destaque.legenda;
        linhas.replaceChildren();
        saida.linhas.forEach((linha) => {
            const item = criar('div');
            item.append(criar('dt', '', linha.rotulo), criar('dd', '', linha.valor));
            linhas.append(item);
        });
        selo.hidden = !saida.selo;
        if (saida.selo) {
            selo.className = `sim-selo ${saida.selo.bom ? 'bom' : 'ruim'}`;
            const icone = criar('span', 'versus-icone', saida.selo.bom ? '✓' : '✕');
            icone.setAttribute('aria-hidden', 'true');
            selo.replaceChildren(icone, document.createTextNode(saida.selo.texto));
        }
        if (anunciar) aviso.textContent = `${saida.destaque.valor} ${saida.destaque.legenda}.`;
    }

    config.controles.forEach((controle, indice) => {
        valores[controle.id] = controle.valor;
        const campo = criar('div', 'sim-controle');
        const identificador = `sim-${config.calculo}-${controle.id}`;

        if (controle.tipo === 'opcoes') {
            const grupo = criar('fieldset', 'sim-opcoes');
            grupo.append(criar('legend', '', controle.rotulo));
            const lista = criar('div', 'sim-opcoes-lista');
            controle.opcoes.forEach((opcao) => {
                const rotulo = criar('label');
                const radio = criar('input');
                radio.type = 'radio';
                radio.name = identificador;
                radio.value = String(opcao.valor);
                radio.checked = opcao.valor === controle.valor;
                radio.addEventListener('change', () => {
                    valores[controle.id] = opcao.valor;
                    calcular(true);
                });
                rotulo.append(radio, criar('span', '', opcao.rotulo));
                lista.append(rotulo);
            });
            grupo.append(lista);
            campo.append(grupo);
        } else {
            const formatar = FORMATOS_SIMULADOR[controle.formato] || String;
            const topo = criar('div', 'sim-controle-topo');
            const rotulo = criar('label', '', controle.rotulo);
            rotulo.htmlFor = identificador;
            const valor = criar('output', '', formatar(controle.valor));
            valor.htmlFor = identificador;
            topo.append(rotulo, valor);

            const faixa = criar('input');
            faixa.type = 'range';
            faixa.id = identificador;
            faixa.min = controle.min;
            faixa.max = controle.max;
            faixa.step = controle.passo;
            faixa.value = controle.valor;
            const atualizar = () => {
                valores[controle.id] = Number(faixa.value);
                valor.textContent = formatar(valores[controle.id]);
                faixa.setAttribute('aria-valuetext', formatar(valores[controle.id]));
                faixa.style.setProperty('--posicao', `${((faixa.value - controle.min) / (controle.max - controle.min)) * 100}%`);
            };
            faixa.addEventListener('input', () => { atualizar(); calcular(false); });
            faixa.addEventListener('change', () => calcular(true));
            atualizar();
            campo.append(topo, faixa);
        }
        campo.style.setProperty('--ordem', indice);
        controles.append(campo);
    });

    corpo.append(controles, resultado);
    secao.append(corpo, aviso);
    calcular(false);
    return secao;
}
