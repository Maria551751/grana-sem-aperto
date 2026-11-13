/* =========================================
   APOSTILA VISUAL: monta a página de cada aula
   aula.html?m=<slug> mostra uma aula; sem o parâmetro, mostra a lista das 11.
   O conteúdo vem de AULAS_GSA (aulas-conteudo.js). O PDF de cada aula é esta
   mesma página impressa, por isso tudo aqui também precisa funcionar no papel.
   ========================================= */
(function () {
    'use strict';

    const raiz = document.getElementById('aula-raiz');
    if (!raiz || typeof AULAS_GSA === 'undefined') return;

    const CHAVE_PASSOS = 'gsaAulaPassos';

    function el(tag, classe, texto) {
        const no = document.createElement(tag);
        if (classe) no.className = classe;
        if (texto !== undefined) no.textContent = texto;
        return no;
    }

    const doisDigitos = (numero) => String(numero).padStart(2, '0');

    /* ---------- Visuais ---------- */

    function exemplo(visual) {
        return visual.exemplo ? el('p', 'viz-exemplo', visual.exemplo) : null;
    }

    function listaComIcone(visual, tag, classe) {
        const lista = el(tag, classe + (visual.compacto ? ' compacto' : ''));
        visual.itens.forEach((item, indice) => {
            const linha = el('li');
            linha.style.setProperty('--ordem', indice);
            const icone = el('span', 'viz-icone', item.icone);
            icone.setAttribute('aria-hidden', 'true');
            linha.append(icone, el('strong', '', item.titulo), el('span', '', item.texto));
            lista.append(linha);
        });
        return lista;
    }

    const VISUAIS = {
        cartoes: (visual) => listaComIcone(visual, 'ul', 'viz-cartoes'),
        passos: (visual) => listaComIcone(visual, 'ol', 'viz-passos'),

        versus(visual) {
            const caixa = el('div', 'viz-versus');
            for (const lado of Object.keys(visual).filter((chave) => chave === 'bom' || chave === 'ruim')) {
                const secao = el('section', `versus-lado ${lado}`);
                const titulo = el('h3');
                const icone = el('span', 'versus-icone', lado === 'bom' ? '✓' : '✕');
                icone.setAttribute('aria-hidden', 'true');
                titulo.append(icone, document.createTextNode(visual[lado].titulo));
                const lista = el('ul');
                visual[lado].itens.forEach((item) => lista.append(el('li', '', item)));
                secao.append(titulo, lista);
                caixa.append(secao);
            }
            return caixa;
        },

        barras(visual) {
            const lista = el('ul', 'viz-barras');
            const maior = Math.max(...visual.itens.map((item) => item.valor));
            visual.itens.forEach((item) => {
                const linha = el('li', item.destaque ? 'destaque' : '');
                const topo = el('div', 'barra-topo');
                topo.append(el('span', 'barra-rotulo', item.rotulo));
                if (!visual.semValor) topo.append(el('strong', '', item.texto));
                const trilho = el('div', 'barra-trilho');
                const nivel = el('span', 'barra-nivel');
                nivel.style.setProperty('--valor', `${Math.max((item.valor / maior) * 100, 3)}%`);
                trilho.append(nivel);
                linha.append(topo, trilho);
                if (item.selo) linha.append(el('span', 'barra-selo', item.selo));
                lista.append(linha);
            });
            return lista;
        },

        divisao(visual) {
            const caixa = el('div', 'viz-divisao');
            visual.linhas.forEach((linha) => {
                if (linha.titulo) caixa.append(el('p', 'divisao-titulo', linha.titulo));
                const barra = el('div', 'divisao-barra');
                barra.setAttribute('role', 'img');
                barra.setAttribute('aria-label', linha.partes.map((parte) => `${parte.rotulo}: ${parte.pct}%`).join(', '));
                const legenda = el('ul', 'divisao-legenda');
                linha.partes.forEach((parte, indice) => {
                    const cor = `cor-${(indice % 3) + 1}`;
                    // Segmento estreito demais não leva o número: ele fica só na legenda.
                    const segmento = el('span', cor, parte.pct >= 12 ? `${parte.pct}%` : '');
                    segmento.style.setProperty('--pct', parte.pct);
                    barra.append(segmento);

                    const item = el('li');
                    const amostra = el('span', `divisao-amostra ${cor}`);
                    amostra.setAttribute('aria-hidden', 'true');
                    item.append(amostra, el('span', '', parte.rotulo), el('strong', '', parte.detalhe || `${parte.pct}%`));
                    legenda.append(item);
                });
                caixa.append(barra, legenda);
            });
            return caixa;
        },

        numeros(visual) {
            const lista = el('ul', 'viz-numeros');
            visual.itens.forEach((item) => {
                const linha = el('li');
                linha.append(el('strong', '', item.valor), el('span', '', item.legenda));
                lista.append(linha);
            });
            return lista;
        },

        conta(visual) {
            const caixa = el('div', 'viz-conta');
            visual.itens.forEach((item) => {
                const linha = el('div', 'conta-linha');
                linha.append(el('span', 'conta-sinal', item.sinal), el('span', 'conta-rotulo', item.rotulo), el('strong', '', item.texto));
                caixa.append(linha);
            });
            const resultado = el('div', `conta-linha conta-resultado ${visual.resultado.bom ? 'bom' : 'ruim'}`);
            resultado.append(el('span', 'conta-sinal', '='), el('span', 'conta-rotulo', visual.resultado.rotulo), el('strong', '', visual.resultado.texto));
            caixa.append(resultado);
            if (visual.resultado.selo) {
                const selo = el('p', `conta-selo ${visual.resultado.bom ? 'bom' : 'ruim'}`);
                const icone = el('span', 'versus-icone', visual.resultado.bom ? '✓' : '✕');
                icone.setAttribute('aria-hidden', 'true');
                selo.append(icone, document.createTextNode(visual.resultado.selo));
                caixa.append(selo);
            }
            return caixa;
        }
    };

    function montarVisual(visual) {
        const caixa = el('div', 'viz');
        const nota = exemplo(visual);
        if (nota) caixa.append(nota);
        caixa.append(VISUAIS[visual.tipo](visual));
        return caixa;
    }

    /* ---------- Partes da aula ---------- */

    function montarDesafio(desafio) {
        const secao = el('section', 'aula-bloco aula-desafio');
        secao.append(el('span', 'aula-etiqueta', 'MITO OU VERDADE?'), el('p', 'desafio-frase', `“${desafio.frase}”`));

        const botoes = el('div', 'desafio-botoes');
        const resultado = el('div', 'desafio-resultado');
        resultado.setAttribute('role', 'status');
        const certa = desafio.verdade ? 'verdade' : 'mito';
        // Texto inicial: é o que sai no PDF, onde não há botão para tocar.
        const veredito = el('strong', '', `Resposta: ${certa}.`);
        resultado.append(veredito, el('p', '', desafio.explicacao));
        resultado.hidden = true;

        for (const opcao of ['mito', 'verdade']) {
            const botao = el('button', 'desafio-botao', opcao === 'mito' ? 'Mito' : 'Verdade');
            botao.type = 'button';
            botao.addEventListener('click', () => {
                const acertou = opcao === certa;
                botoes.querySelectorAll('button').forEach((outro) => { outro.disabled = true; });
                botao.classList.add(acertou ? 'acertou' : 'errou');
                veredito.textContent = `${acertou ? 'Acertou!' : 'Quase.'} É ${certa}.`;
                resultado.hidden = false;
            });
            botoes.append(botao);
        }

        secao.append(botoes, resultado);
        return secao;
    }

    function lerPassosSalvos() {
        try {
            return JSON.parse(localStorage.getItem(CHAVE_PASSOS)) || {};
        } catch (falha) {
            return {};
        }
    }

    function montarPratica(aula) {
        const secao = el('section', 'aula-bloco aula-pratica');
        secao.append(el('span', 'aula-etiqueta', 'PRATIQUE AGORA'), el('h2', '', 'Sua vez'));

        const salvos = lerPassosSalvos();
        const feitos = Array.isArray(salvos[aula.slug]) ? salvos[aula.slug] : [];
        const lista = el('ul', 'pratica-lista');
        const progresso = el('p', 'pratica-progresso');
        progresso.setAttribute('role', 'status');
        const medidor = el('div', 'pratica-medidor');
        const nivel = el('span');
        medidor.append(nivel);

        const atualizar = () => {
            const marcados = [...lista.querySelectorAll('input')].map((caixa) => caixa.checked);
            const total = marcados.filter(Boolean).length;
            progresso.textContent = total === marcados.length ? 'Tudo feito. Boa!' : `${total} de ${marcados.length} feitos`;
            nivel.style.width = `${(total / marcados.length) * 100}%`;
            secao.classList.toggle('completa', total === marcados.length);
            try {
                localStorage.setItem(CHAVE_PASSOS, JSON.stringify({ ...lerPassosSalvos(), [aula.slug]: marcados }));
            } catch (falha) {
                // Sem armazenamento a lista funciona, só não fica salva.
            }
        };

        aula.passos.forEach((passo, indice) => {
            const item = el('li');
            const rotulo = el('label');
            const caixa = el('input');
            caixa.type = 'checkbox';
            caixa.checked = Boolean(feitos[indice]);
            caixa.addEventListener('change', atualizar);
            rotulo.append(caixa, el('span', '', passo));
            item.append(rotulo);
            lista.append(item);
        });

        secao.append(lista, medidor, progresso);
        if (aula.atalho) {
            const atalho = el('a', 'aula-atalho', `${aula.atalho.texto} →`);
            atalho.href = aula.atalho.href;
            secao.append(atalho);
        }
        atualizar();
        return secao;
    }

    function montarFontes(aula) {
        const secao = el('section', 'aula-fontes');
        secao.append(
            el('h2', '', 'Fontes e leitura complementar'),
            el('p', '', `Conteúdo elaborado pelo GSA a partir de referências públicas consultadas em ${DATA_CONSULTA_AULAS}. Regras, tributos e características de produtos podem mudar: confirme as condições atuais antes de agir.`)
        );
        const lista = el('ul');
        aula.fontes.forEach((fonte) => {
            const dados = typeof fonte === 'string' ? FONTES_GSA[fonte] : fonte;
            const item = el('li');
            const link = el('a', '', dados.nome);
            link.href = dados.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            item.append(link);
            lista.append(item);
        });
        secao.append(lista, el('p', 'aula-aviso', 'Este material é educacional. Não constitui recomendação de investimento, promessa de rentabilidade ou substituição de orientação profissional individualizada.'));
        return secao;
    }

    function montarAcoes(aula, indice) {
        const acoes = el('nav', 'aula-acoes');
        acoes.setAttribute('aria-label', 'Continuar');

        const jogar = el('a', 'btn-primario', 'Treinar no Desafio GSA');
        jogar.href = 'jogar.html';
        const pdf = el('a', 'btn-secundario', 'Baixar em PDF');
        pdf.href = `../assets/docs/${aula.pdf}`;
        pdf.setAttribute('download', '');
        acoes.append(jogar, pdf);

        // Módulo com videoaula ganha o botão para assistir.
        const videoaula = typeof linkVideoaula === 'function' ? linkVideoaula(aula.modulo) : '';
        if (videoaula) {
            const assistir = el('a', 'btn-secundario', '▶ Assistir videoaula');
            assistir.href = videoaula;
            if (typeof videoaulasPorModulo[aula.modulo] === 'string') {
                assistir.target = '_blank';
                assistir.rel = 'noopener noreferrer';
            }
            acoes.append(assistir);
        }

        const proxima = AULAS_GSA[indice + 1];
        if (proxima) {
            const seguinte = el('a', 'btn-secundario', `Próxima: ${proxima.titulo} →`);
            seguinte.href = `aula.html?m=${proxima.slug}`;
            acoes.append(seguinte);
        }
        return acoes;
    }

    function montarAula(aula, indice) {
        document.title = `${aula.titulo} | Apostila GSA`;
        const artigo = el('article', 'aula');

        // Só aparece no papel: identifica o PDF quando ele circula fora do site.
        const marca = el('div', 'aula-marca');
        const logo = el('img');
        logo.src = '../assets/img/logo-gsa.webp';
        logo.alt = '';
        marca.append(logo, el('strong', '', 'Grana Sem Aperto'), el('span', '', 'Apostila visual · grana-sem-aperto.vercel.app'));
        artigo.append(marca);

        const topo = el('header', 'aula-topo');
        const barra = el('div', 'topo-barra');
        const voltar = el('a', 'aula-voltar', '← Todas as aulas');
        voltar.href = 'aula.html';
        const selos = el('div', 'topo-selos');
        selos.append(el('span', 'topo-selo', 'Leitura de 3 min'), el('span', 'topo-selo', `Aula ${indice + 1} de ${AULAS_GSA.length}`));
        barra.append(voltar, selos);

        const fantasma = el('span', 'topo-numero', doisDigitos(indice + 1));
        fantasma.setAttribute('aria-hidden', 'true');
        const icone = el('span', 'topo-icone', aula.icone);
        icone.setAttribute('aria-hidden', 'true');

        const progresso = el('nav', 'topo-progresso');
        progresso.setAttribute('aria-label', 'Aulas da apostila');
        AULAS_GSA.forEach((outra, posicao) => {
            const passo = el('a', posicao < indice ? 'anterior' : posicao === indice ? 'atual' : '');
            passo.href = `aula.html?m=${outra.slug}`;
            passo.title = `${doisDigitos(posicao + 1)} · ${outra.titulo}`;
            passo.setAttribute('aria-label', `Aula ${posicao + 1}: ${outra.titulo}`);
            if (posicao === indice) passo.setAttribute('aria-current', 'page');
            progresso.append(passo);
        });

        topo.append(
            barra,
            fantasma,
            icone,
            el('span', 'aula-etiqueta', `MÓDULO ${doisDigitos(indice + 1)} · ${aula.trilha.toUpperCase()}`),
            el('h1', '', aula.titulo),
            el('p', 'aula-chamada', aula.chamada),
            el('p', 'aula-resumo', aula.resumo),
            progresso
        );
        artigo.append(topo);

        aula.ideias.forEach((ideia, posicao) => {
            const secao = el('section', 'aula-bloco ideia');
            const cabecalho = el('div', 'ideia-topo');
            const numero = el('span', 'ideia-numero', String(posicao + 1));
            numero.setAttribute('aria-hidden', 'true');
            cabecalho.append(numero, el('h2', '', ideia.titulo));
            secao.append(cabecalho, montarVisual(ideia.visual), el('p', 'ideia-texto', ideia.texto));
            artigo.append(secao);
        });

        if (aula.simulador && typeof montarSimuladorGSA === 'function') artigo.append(montarSimuladorGSA(aula.simulador));
        artigo.append(montarDesafio(aula.desafio), montarPratica(aula), montarAcoes(aula, indice), montarFontes(aula));
        return artigo;
    }

    function montarIndice() {
        document.title = 'Apostila visual | Grana Sem Aperto';
        const caixa = el('div', 'aula apostila-indice');
        const topo = el('header', 'aula-topo');
        const titulo = el('h1');
        titulo.append(document.createTextNode('Bateu o olho, '), el('span', '', 'entendeu.'));
        topo.append(
            el('span', 'aula-etiqueta', 'APOSTILA VISUAL GSA'),
            titulo,
            el('p', 'aula-resumo', 'Aulas curtas, com gráficos, comparações e passos no lugar de textos longos.')
        );
        const numeros = el('ul', 'indice-numeros');
        [[String(AULAS_GSA.length), 'aulas visuais'], [String(new Set(AULAS_GSA.map((aula) => aula.trilha)).size), 'trilhas'], ['3 min', 'por aula']].forEach(([valor, legenda]) => {
            const item = el('li');
            item.append(el('strong', '', valor), el('span', '', legenda));
            numeros.append(item);
        });
        topo.append(numeros);
        caixa.append(topo);

        const trilhas = [...new Set(AULAS_GSA.map((aula) => aula.trilha))];
        trilhas.forEach((trilha, posicao) => {
            const secao = el('section', 'indice-trilha');
            const cabecalho = el('h2');
            cabecalho.append(el('span', '', `Trilha ${doisDigitos(posicao + 1)}`), document.createTextNode(trilha));
            secao.append(cabecalho);
            const grade = el('ul', 'indice-grade');
            AULAS_GSA.forEach((aula, indice) => {
                if (aula.trilha !== trilha) return;
                const item = el('li');
                const link = el('a', 'indice-card');
                link.href = `aula.html?m=${aula.slug}`;
                const icone = el('span', 'indice-icone', aula.icone);
                icone.setAttribute('aria-hidden', 'true');
                const cardTopo = el('span', 'indice-card-topo');
                cardTopo.append(icone, el('span', 'indice-numero', doisDigitos(indice + 1)));
                link.style.setProperty('--ordem', grade.children.length);
                link.append(cardTopo, el('strong', '', aula.titulo), el('span', 'indice-chamada', aula.chamada), el('span', 'indice-abrir', 'Abrir aula →'));
                item.append(link);
                grade.append(item);
            });
            secao.append(grade);
            caixa.append(secao);
        });
        return caixa;
    }

    /* ---------- Entrada ---------- */

    const slug = new URLSearchParams(window.location.search).get('m');
    const indice = AULAS_GSA.findIndex((aula) => aula.slug === slug);
    raiz.replaceChildren(indice >= 0 ? montarAula(AULAS_GSA[indice], indice) : montarIndice());

    if (indice >= 0) {
        const leitura = el('div', 'aula-leitura');
        const avanco = el('span');
        leitura.append(avanco);
        document.body.append(leitura);
        let pedido = null;
        const medir = () => {
            pedido = null;
            const total = document.documentElement.scrollHeight - window.innerHeight;
            avanco.style.transform = `scaleX(${total > 0 ? Math.min(window.scrollY / total, 1) : 0})`;
        };
        window.addEventListener('scroll', () => { pedido ??= requestAnimationFrame(medir); }, { passive: true });
        medir();
    }

    // Os gráficos crescem quando entram na tela. Sem suporte, ou com movimento reduzido, já aparecem prontos.
    const blocos = raiz.querySelectorAll('.aula-topo, .aula-bloco, .indice-trilha');
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (semMovimento || !('IntersectionObserver' in window)) {
        blocos.forEach((bloco) => bloco.classList.add('visivel'));
    } else {
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) return;
                entrada.target.classList.add('visivel');
                observador.unobserve(entrada.target);
            });
        }, { threshold: 0.15 });
        blocos.forEach((bloco) => observador.observe(bloco));
        // Proteção: se o observador não responder (aba em segundo plano, por exemplo), o conteúdo aparece mesmo assim.
        setTimeout(() => {
            if (!raiz.querySelector('.visivel')) blocos.forEach((bloco) => bloco.classList.add('visivel'));
        }, 1500);
    }
})();
