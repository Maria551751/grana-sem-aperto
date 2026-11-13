/* =========================================
   VIDEOAULA: toca o vídeo do módulo na versão certa para o aparelho.
   Celular em pé recebe a versão vertical; computador, tablet e celular
   deitado recebem a horizontal. A pessoa pode trocar quando quiser.
   Os vídeos ficam em assets/video e são listados em videoaulasPorModulo (global.js).
   ========================================= */

// Regras de escolha separadas da tela, para poderem ser testadas sozinhas.
const ESCOLHA_VIDEOAULA = {
    // "celular" quando o navegador se declara móvel, ou quando a tela é pequena e de toque.
    // Tablets ficam como "computador": a tela é larga e a versão horizontal aproveita melhor.
    aparelho({ movel, agente = '', toque = false, menorLado = Infinity } = {}) {
        if (movel === true) return 'celular';
        if (/iPhone|iPod|Windows Phone|Android.+Mobile/i.test(agente)) return 'celular';
        return toque && menorLado <= 600 ? 'celular' : 'computador';
    },

    // A escolha feita à mão vale mais que a detecção.
    formato({ aparelho, emPe, escolhaManual } = {}) {
        if (escolhaManual === 'vertical' || escolhaManual === 'horizontal') return escolhaManual;
        return aparelho === 'celular' && emPe ? 'vertical' : 'horizontal';
    },

    aviso({ aparelho, formato, escolhaManual } = {}) {
        if (escolhaManual) return `Você escolheu a versão ${formato}.`;
        if (aparelho === 'celular') {
            return formato === 'vertical'
                ? 'Você está no celular: esta é a versão vertical, feita para a tela em pé.'
                : 'Celular deitado: esta é a versão horizontal.';
        }
        return 'Você está no computador: esta é a versão horizontal.';
    }
};

(function iniciarVideoaula() {
    if (typeof document === 'undefined') return;
    const raiz = document.getElementById('videoaula-raiz');
    if (!raiz) return;

    function el(tag, classe, texto) {
        const no = document.createElement(tag);
        if (classe) no.className = classe;
        if (texto != null) no.textContent = texto;
        return no;
    }

    // Só entram os módulos que têm vídeo no próprio site.
    const catalogo = Object.values(modulosData).flat()
        .map((modulo, indice) => {
            const video = videoaulasPorModulo[modulo];
            return video && typeof video === 'object'
                ? { modulo, numero: String(indice + 1).padStart(2, '0'), ...video }
                : null;
        })
        .filter(Boolean);

    const pedido = new URLSearchParams(window.location.search).get('m');
    const posicao = catalogo.findIndex((video) => video.arquivo === pedido);

    const caixa = el('div', 'va-caixa');
    raiz.append(caixa);

    const voltar = el('a', 'va-voltar', '← Voltar para Aprender');
    voltar.href = 'Cursos.html#videoaulas';
    caixa.append(voltar);

    if (posicao < 0) montarLista();
    else montarPlayer(catalogo[posicao], catalogo[posicao + 1]);

    function montarLista() {
        caixa.append(el('span', 'va-etiqueta', 'VIDEOAULAS'));
        caixa.append(el('h1', '', 'Escolha uma videoaula'));
        if (!catalogo.length) {
            caixa.append(el('p', 'va-resumo', 'As videoaulas ainda estão sendo gravadas. Enquanto isso, veja a apostila visual.'));
            return;
        }
        const lista = el('ul', 'va-lista');
        catalogo.forEach((video) => {
            const item = el('li');
            const link = el('a', 'va-cartao');
            link.href = `videoaula.html?m=${video.arquivo}`;
            const capa = el('img');
            capa.src = `../assets/video/${video.arquivo}-horizontal.webp`;
            capa.alt = '';
            capa.loading = 'lazy';
            capa.width = 1280;
            capa.height = 720;
            link.append(capa, el('span', 'va-etiqueta', `MÓDULO ${video.numero} · ${video.duracao.toUpperCase()}`), el('strong', '', video.modulo));
            item.append(link);
            lista.append(item);
        });
        caixa.append(lista);
    }

    function montarPlayer(video, proxima) {
        const base = `../assets/video/${video.arquivo}`;
        document.title = `${video.modulo}: videoaula | Grana Sem Aperto`;

        caixa.append(el('span', 'va-etiqueta', `MÓDULO ${video.numero} · VIDEOAULA · ${video.duracao.toUpperCase()}`));
        caixa.append(el('h1', '', video.modulo));
        caixa.append(el('p', 'va-resumo', video.resumo));

        const moldura = el('div', 'va-moldura');
        const tela = el('video');
        tela.controls = true;
        tela.playsInline = true;
        tela.preload = 'metadata';
        tela.setAttribute('aria-label', `Videoaula: ${video.modulo}`);
        const faixa = el('track');
        faixa.kind = 'captions';
        faixa.srclang = 'pt-BR';
        faixa.label = 'Português';
        faixa.src = `${base}.vtt`;
        tela.append(faixa);
        moldura.append(tela);
        caixa.append(moldura);

        const barra = el('div', 'va-barra');
        const aviso = el('p', 'va-status');
        aviso.setAttribute('role', 'status');
        const trocar = el('button', 'va-trocar');
        trocar.type = 'button';
        const legendas = el('button', 'va-legendas', 'Ligar legendas');
        legendas.type = 'button';
        legendas.setAttribute('aria-pressed', 'false');
        barra.append(aviso, trocar, legendas);
        caixa.append(barra);

        const acoes = el('nav', 'va-acoes');
        acoes.setAttribute('aria-label', 'Continuar');
        const aula = el('a', 'btn-primario', 'Abrir aula visual');
        aula.href = `aula.html?m=${video.aula}`;
        const jogar = el('a', 'btn-secundario', 'Praticar no Desafio GSA');
        jogar.href = 'jogar.html';
        acoes.append(aula, jogar);
        if (proxima) {
            const seguinte = el('a', 'btn-secundario', `Próxima videoaula: ${proxima.modulo} →`);
            seguinte.href = `videoaula.html?m=${proxima.arquivo}`;
            acoes.append(seguinte);
        }
        caixa.append(acoes);

        const emPe = window.matchMedia('(orientation: portrait)');
        let escolhaManual = null;
        let formatoAtual = null;

        function ambiente() {
            return {
                movel: navigator.userAgentData ? navigator.userAgentData.mobile : undefined,
                agente: navigator.userAgent,
                toque: window.matchMedia('(pointer: coarse)').matches,
                menorLado: Math.min(window.screen.width, window.screen.height)
            };
        }

        // Troca o arquivo sem perder o ponto em que a pessoa estava.
        function carregar(formato) {
            const tempo = tela.currentTime || 0;
            const tocando = !tela.paused && !tela.ended;
            formatoAtual = formato;
            moldura.dataset.formato = formato;
            if (tempo > 0) {
                tela.addEventListener('loadedmetadata', () => {
                    tela.currentTime = tempo;
                    if (tocando) tela.play().catch(() => {});
                }, { once: true });
            }
            tela.poster = `${base}-${formato}.webp`;
            tela.src = `${base}-${formato}.mp4`;
        }

        function aplicar() {
            const aparelho = ESCOLHA_VIDEOAULA.aparelho(ambiente());
            const formato = ESCOLHA_VIDEOAULA.formato({ aparelho, emPe: emPe.matches, escolhaManual });
            aviso.textContent = ESCOLHA_VIDEOAULA.aviso({ aparelho, formato, escolhaManual });
            trocar.textContent = formato === 'vertical' ? 'Ver versão horizontal' : 'Ver versão vertical';
            if (formato !== formatoAtual) carregar(formato);
        }

        trocar.addEventListener('click', () => {
            escolhaManual = formatoAtual === 'vertical' ? 'horizontal' : 'vertical';
            aplicar();
        });

        legendas.addEventListener('click', () => {
            const texto = tela.textTracks[0];
            if (!texto) return;
            const ligar = texto.mode !== 'showing';
            texto.mode = ligar ? 'showing' : 'hidden';
            legendas.setAttribute('aria-pressed', String(ligar));
            legendas.textContent = ligar ? 'Desligar legendas' : 'Ligar legendas';
        });

        // Celular girado: troca de versão sozinho, a não ser que a pessoa já tenha escolhido.
        if (emPe.addEventListener) emPe.addEventListener('change', aplicar);
        else if (emPe.addListener) emPe.addListener(aplicar);

        aplicar();
    }
})();
