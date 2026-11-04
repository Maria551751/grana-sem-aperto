/* =========================================
   DESAFIO GSA: motor do jogo
   Trilha de lições (jogo-licoes.js), vidas, XP, sequência e meta diária.
   Visitante: progresso salvo só no navegador. Com conta (conta-gsa.js): XP e ranking no Supabase.
   ========================================= */
(function () {
    const CHAVE_PROGRESSO = 'gsaJogoProgresso';
    const META_DIARIA_XP = 30;
    const VIDAS_POR_LICAO = 3;
    // Mesma regra de registrar_licao em supabase/schema.sql.
    const XP_POR_ACERTO = 10;
    const XP_BONUS_PERFEITO = 10;

    const conta = window.ContaGSA;
    const todasLicoes = UNIDADES_JOGO.flatMap((unidade) => unidade.licoes.map((licao) => ({ ...licao, unidade })));

    const $ = (id) => document.getElementById(id);
    const escapar = (texto) => String(texto)
        .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

    // Datas no fuso de Brasília, igual ao servidor.
    const dataBrasilia = (deslocamentoDias = 0) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' })
        .format(new Date(Date.now() + deslocamentoDias * 86400000));

    /* ---------- Progresso local (visitante) ---------- */

    function lerProgresso() {
        const vazio = { xp: 0, sequencia: 0, melhorSequencia: 0, ultimoDia: null, concluidas: {}, xpDoDia: { dia: null, xp: 0, licoes: [] } };
        try {
            return { ...vazio, ...JSON.parse(localStorage.getItem(CHAVE_PROGRESSO) || '{}') };
        } catch {
            return vazio;
        }
    }

    let progresso = lerProgresso();

    function salvarProgresso() {
        try {
            localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(progresso));
        } catch {
            // Navegação privada ou armazenamento cheio: o jogo segue, só não lembra depois.
        }
    }

    function registrarLocal(licaoId, acertos, total) {
        const hoje = dataBrasilia();
        if (progresso.xpDoDia.dia !== hoje) progresso.xpDoDia = { dia: hoje, xp: 0, licoes: [] };

        const jaGanhouHoje = progresso.xpDoDia.licoes.includes(licaoId);
        const xpGanho = jaGanhouHoje ? 0 : acertos * XP_POR_ACERTO + (acertos === total ? XP_BONUS_PERFEITO : 0);

        if (!jaGanhouHoje) progresso.xpDoDia.licoes.push(licaoId);
        progresso.xpDoDia.xp += xpGanho;
        progresso.xp += xpGanho;

        if (progresso.ultimoDia !== hoje) {
            progresso.sequencia = progresso.ultimoDia === dataBrasilia(-1) ? progresso.sequencia + 1 : 1;
            progresso.ultimoDia = hoje;
        }
        progresso.melhorSequencia = Math.max(progresso.melhorSequencia, progresso.sequencia);

        const anterior = progresso.concluidas[licaoId];
        progresso.concluidas[licaoId] = {
            melhorAcertos: Math.max(anterior?.melhorAcertos || 0, acertos),
            total,
            perfeita: Boolean(anterior?.perfeita) || acertos === total
        };

        salvarProgresso();
        return xpGanho;
    }

    /* ---------- Estado da conta ---------- */

    let concluidasNoServidor = [];
    const logadoComPerfil = () => Boolean(conta?.usuario() && conta.perfil());

    async function sincronizarConclusoes() {
        try {
            concluidasNoServidor = logadoComPerfil() ? await conta.licoesConcluidas() : [];
        } catch (erro) {
            console.error('Não foi possível carregar as lições da conta:', erro.message);
            concluidasNoServidor = [];
        }
    }

    function licaoConcluida(licaoId) {
        const local = progresso.concluidas[licaoId];
        const remotas = concluidasNoServidor.filter((c) => c.licao_id === licaoId);
        if (!local && !remotas.length) return null;
        return {
            perfeita: Boolean(local?.perfeita) || remotas.some((c) => c.acertos === c.total)
        };
    }

    // A sequência só vale se a última partida foi hoje ou ontem.
    const sequenciaAtiva = (sequencia, ultimoDia) => (ultimoDia === dataBrasilia() || ultimoDia === dataBrasilia(-1) ? sequencia : 0);

    function resumoDoJogador() {
        if (logadoComPerfil()) {
            const perfil = conta.perfil();
            const hoje = dataBrasilia();
            return {
                xp: perfil.xp,
                sequencia: sequenciaAtiva(perfil.sequencia, perfil.ultimo_dia),
                xpHoje: concluidasNoServidor.filter((c) => c.dia === hoje).reduce((soma, c) => soma + c.xp_ganho, 0)
            };
        }
        return {
            xp: progresso.xp,
            sequencia: sequenciaAtiva(progresso.sequencia, progresso.ultimoDia),
            xpHoje: progresso.xpDoDia.dia === dataBrasilia() ? progresso.xpDoDia.xp : 0
        };
    }

    /* ---------- Painel de status e trilha ---------- */

    function renderizarStatus() {
        const { xp, sequencia, xpHoje } = resumoDoJogador();
        const metaPercentual = Math.min(100, Math.round((xpHoje / META_DIARIA_XP) * 100));

        $('jogo-status').innerHTML = `
            <div class="status-card status-sequencia${sequencia ? ' ativo' : ''}">
                <span class="status-icone" aria-hidden="true">🔥</span>
                <div><strong>${sequencia} ${sequencia === 1 ? 'dia' : 'dias'}</strong><span>Sequência</span></div>
            </div>
            <div class="status-card">
                <span class="status-icone" aria-hidden="true">⚡</span>
                <div><strong>${xp} XP</strong><span>${logadoComPerfil() ? 'Na sua conta' : 'Neste aparelho'}</span></div>
            </div>
            <div class="status-card status-meta">
                <span class="status-icone" aria-hidden="true">🎯</span>
                <div class="status-meta-texto">
                    <strong>${Math.min(xpHoje, META_DIARIA_XP)}/${META_DIARIA_XP} XP</strong><span>${xpHoje >= META_DIARIA_XP ? 'Meta de hoje batida!' : 'Meta de hoje'}</span>
                    <div class="status-meta-barra" role="progressbar" aria-label="Meta diária" aria-valuemin="0" aria-valuemax="${META_DIARIA_XP}" aria-valuenow="${Math.min(xpHoje, META_DIARIA_XP)}"><span style="width:${metaPercentual}%"></span></div>
                </div>
            </div>
        `;
    }

    // Zigue-zague da trilha, em px.
    const DESLOCAMENTOS = [0, 56, 84, 56, 0, -56, -84, -56];

    function renderizarTrilha() {
        let indiceGlobal = 0;
        let anteriorConcluida = true;

        $('jogo-trilha').innerHTML = UNIDADES_JOGO.map((unidade, indiceUnidade) => {
            const feitas = unidade.licoes.filter((licao) => licaoConcluida(licao.id)).length;

            const nos = unidade.licoes.map((licao) => {
                const concluida = licaoConcluida(licao.id);
                const disponivel = anteriorConcluida;
                const estado = concluida ? (concluida.perfeita ? 'perfeita' : 'concluida') : disponivel ? 'atual' : 'bloqueada';
                const deslocamento = DESLOCAMENTOS[indiceGlobal % DESLOCAMENTOS.length];
                indiceGlobal += 1;
                anteriorConcluida = Boolean(concluida);

                const rotulos = {
                    perfeita: 'concluída sem erros',
                    concluida: 'concluída',
                    atual: 'disponível',
                    bloqueada: 'bloqueada: conclua a lição anterior'
                };

                return `
                    <li class="trilha-no trilha-no-${estado}" style="--deslocamento:${deslocamento}px">
                        <button type="button" class="trilha-botao" data-licao="${licao.id}" ${estado === 'bloqueada' ? 'disabled' : ''}
                            aria-label="${escapar(licao.titulo)}, ${rotulos[estado]}">
                            <span class="trilha-icone" aria-hidden="true">${estado === 'bloqueada' ? '🔒' : licao.icone}</span>
                            ${estado === 'perfeita' ? '<span class="trilha-selo" aria-hidden="true">★</span>' : ''}
                            ${estado === 'concluida' ? '<span class="trilha-selo" aria-hidden="true">✓</span>' : ''}
                        </button>
                        ${estado === 'atual' ? '<span class="trilha-chamada" aria-hidden="true">Começar</span>' : ''}
                        <span class="trilha-nome">${escapar(licao.titulo)}</span>
                    </li>
                `;
            }).join('');

            return `
                <section class="trilha-unidade" aria-labelledby="unidade-${unidade.id}">
                    <header class="trilha-unidade-cabecalho">
                        <div>
                            <span>UNIDADE ${indiceUnidade + 1}</span>
                            <h2 id="unidade-${unidade.id}">${escapar(unidade.titulo)}</h2>
                            <p>${escapar(unidade.subtitulo)}</p>
                        </div>
                        <strong class="trilha-unidade-progresso">${feitas}/${unidade.licoes.length}</strong>
                    </header>
                    <ol class="trilha-caminho">${nos}</ol>
                </section>
            `;
        }).join('');
    }

    /* ---------- Lição ---------- */

    let partida = null;

    function embaralhar(lista) {
        const copia = [...lista];
        for (let i = copia.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [copia[i], copia[j]] = [copia[j], copia[i]];
        }
        return copia;
    }

    function prepararPergunta(pergunta, indice) {
        const opcoes = pergunta.tipo === 'vf' ? ['Verdadeiro', 'Falso'] : pergunta.opcoes;
        const ordem = pergunta.tipo === 'vf' ? opcoes.map((_, i) => i) : embaralhar(opcoes.map((_, i) => i));
        return {
            ...pergunta,
            indice,
            opcoes: ordem.map((i) => opcoes[i]),
            correta: ordem.indexOf(pergunta.correta)
        };
    }

    function iniciarLicao(licaoId) {
        const licao = todasLicoes.find((item) => item.id === licaoId);
        if (!licao) return;

        partida = {
            licao,
            total: licao.perguntas.length,
            fila: embaralhar(licao.perguntas.map(prepararPergunta)),
            vidas: VIDAS_POR_LICAO,
            erradas: new Set(),
            acertosDePrimeira: 0,
            sequenciaDeAcertos: 0,
            selecionada: null,
            fase: 'respondendo',
            focoAnterior: document.activeElement
        };

        const tela = $('licao-tela');
        tela.hidden = false;
        document.body.classList.add('licao-aberta');
        renderizarPergunta();
    }

    function fecharLicao() {
        $('licao-tela').hidden = true;
        document.body.classList.remove('licao-aberta');
        const foco = partida?.focoAnterior;
        partida = null;
        renderizarTudo();
        foco?.focus?.();
    }

    function coracoes() {
        return Array.from({ length: VIDAS_POR_LICAO }, (_, i) =>
            `<span class="${i < partida.vidas ? 'vida' : 'vida vida-perdida'}" aria-hidden="true">♥</span>`).join('');
    }

    function renderizarPergunta() {
        const pergunta = partida.fila[0];
        const respondidas = partida.total - partida.fila.length;
        const progressoPercentual = Math.round((respondidas / partida.total) * 100);
        const revisao = partida.erradas.has(pergunta.indice);

        $('licao-tela').innerHTML = `
            <div class="licao-caixa">
                <header class="licao-topo">
                    <button type="button" class="licao-fechar" data-acao="fechar" aria-label="Sair da lição">×</button>
                    <div class="licao-progresso" role="progressbar" aria-label="Progresso da lição" aria-valuemin="0" aria-valuemax="${partida.total}" aria-valuenow="${respondidas}">
                        <span style="width:${progressoPercentual}%"></span>
                    </div>
                    <div class="licao-vidas" aria-label="${partida.vidas} de ${VIDAS_POR_LICAO} vidas">${coracoes()}</div>
                </header>

                <div class="licao-corpo">
                    <span class="licao-tipo">${revisao ? 'REVISÃO' : pergunta.tipo === 'vf' ? 'VERDADEIRO OU FALSO?' : 'ESCOLHA A RESPOSTA'}</span>
                    <h2 id="licao-enunciado" class="licao-enunciado">${escapar(pergunta.enunciado)}</h2>
                    <div class="licao-opcoes${pergunta.tipo === 'vf' ? ' licao-opcoes-vf' : ''}" role="group" aria-labelledby="licao-enunciado">
                        ${pergunta.opcoes.map((opcao, i) => `
                            <button type="button" class="licao-opcao" data-opcao="${i}" aria-pressed="false">
                                <kbd aria-hidden="true">${i + 1}</kbd><span>${escapar(opcao)}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <footer class="licao-rodape" id="licao-rodape">
                    <div class="licao-feedback" id="licao-feedback" aria-live="polite"></div>
                    <button type="button" class="licao-acao" id="licao-acao" data-acao="verificar" disabled>Verificar</button>
                </footer>
            </div>
        `;

        partida.selecionada = null;
        partida.fase = 'respondendo';
        $('licao-tela').querySelector('.licao-opcao')?.focus();
    }

    function selecionarOpcao(indice) {
        if (partida?.fase !== 'respondendo') return;
        partida.selecionada = indice;
        $('licao-tela').querySelectorAll('.licao-opcao').forEach((botao) => {
            botao.setAttribute('aria-pressed', String(Number(botao.dataset.opcao) === indice));
        });
        // Com o foco no Verificar, o Enter confere a resposta (e não "clica" de novo numa opção).
        const acao = $('licao-acao');
        acao.disabled = false;
        acao.focus();
    }

    function verificarResposta() {
        if (partida?.fase !== 'respondendo' || partida.selecionada === null) return;

        const pergunta = partida.fila[0];
        const acertou = partida.selecionada === pergunta.correta;
        partida.fase = 'feedback';

        $('licao-tela').querySelectorAll('.licao-opcao').forEach((botao) => {
            const indice = Number(botao.dataset.opcao);
            botao.disabled = true;
            if (indice === pergunta.correta) botao.classList.add('opcao-certa');
            else if (indice === partida.selecionada) botao.classList.add('opcao-errada');
        });

        if (acertou) {
            if (!partida.erradas.has(pergunta.indice)) partida.acertosDePrimeira += 1;
            partida.sequenciaDeAcertos += 1;
            partida.fila.shift();
        } else {
            partida.erradas.add(pergunta.indice);
            partida.sequenciaDeAcertos = 0;
            partida.vidas -= 1;
            // A pergunta errada volta no fim da lição.
            partida.fila.push(partida.fila.shift());
            $('licao-tela').querySelector('.licao-vidas').innerHTML = coracoes();
            $('licao-tela').querySelector('.licao-vidas').setAttribute('aria-label', `${partida.vidas} de ${VIDAS_POR_LICAO} vidas`);
        }

        const elogios = ['Mandou bem!', 'Isso aí!', 'Certinho!', 'Boa!'];
        const titulo = acertou
            ? (partida.sequenciaDeAcertos >= 3 ? `${partida.sequenciaDeAcertos} seguidas! 🔥` : elogios[Math.floor(Math.random() * elogios.length)])
            : `Resposta certa: ${escapar(pergunta.opcoes[pergunta.correta])}`;

        $('licao-rodape').classList.add(acertou ? 'rodape-certo' : 'rodape-errado');
        $('licao-feedback').innerHTML = `
            <strong>${acertou ? '✓' : '✕'} ${titulo}</strong>
            <p>${escapar(pergunta.explicacao)}</p>
        `;

        const acao = $('licao-acao');
        acao.dataset.acao = 'continuar';
        acao.textContent = 'Continuar';
        acao.focus();

        const barra = $('licao-tela').querySelector('.licao-progresso');
        const respondidas = partida.total - partida.fila.length;
        barra.querySelector('span').style.width = `${Math.round((respondidas / partida.total) * 100)}%`;
        barra.setAttribute('aria-valuenow', String(respondidas));
    }

    function continuar() {
        if (partida?.fase !== 'feedback') return;
        if (partida.vidas <= 0) renderizarSemVidas();
        else if (!partida.fila.length) concluirLicao();
        else renderizarPergunta();
    }

    function renderizarSemVidas() {
        partida.fase = 'fim';
        $('licao-tela').innerHTML = `
            <div class="licao-caixa licao-fim">
                <div class="licao-fim-conteudo">
                    <span class="licao-fim-icone" aria-hidden="true">💔</span>
                    <h2>Acabaram as vidas</h2>
                    <p>Errar faz parte. Releia as explicações e tente de novo: as perguntas voltam em outra ordem.</p>
                </div>
                <div class="licao-fim-acoes">
                    <button type="button" class="licao-acao" data-acao="repetir">Tentar de novo</button>
                    <button type="button" class="licao-acao-secundaria" data-acao="fechar">Voltar para a trilha</button>
                </div>
            </div>
        `;
        $('licao-tela').querySelector('[data-acao="repetir"]').focus();
    }

    async function concluirLicao() {
        partida.fase = 'fim';
        const { licao, total, acertosDePrimeira: acertos } = partida;
        const perfeita = acertos === total;

        let xpGanho = registrarLocal(licao.id, acertos, total);
        let sequencia = progresso.sequencia;
        let avisoConta = '';

        if (logadoComPerfil()) {
            try {
                const resultado = await conta.registrarLicao(licao.id, acertos, total);
                xpGanho = resultado.xpGanho;
                sequencia = resultado.diasSeguidos;
                await sincronizarConclusoes();
            } catch (erro) {
                avisoConta = `<p class="licao-fim-aviso">Não deu para salvar na sua conta agora (${escapar(erro.message)}). O progresso ficou salvo neste aparelho.</p>`;
            }
        } else if (conta?.disponivel()) {
            avisoConta = `<p class="licao-fim-aviso">Quer aparecer no ranking? <button type="button" class="link-botao" data-acao="entrar">Entre na sua conta</button> e o XP das próximas lições fica salvo.</p>`;
        }

        const { xpHoje } = resumoDoJogador();

        $('licao-tela').innerHTML = `
            <div class="licao-caixa licao-fim">
                <div class="licao-fim-conteudo">
                    <span class="licao-fim-icone" aria-hidden="true">${perfeita ? '🏆' : '🎉'}</span>
                    <h2>${perfeita ? 'Lição perfeita!' : 'Lição concluída!'}</h2>
                    <p>${escapar(licao.titulo)}</p>
                    <div class="licao-fim-cards">
                        <div><span>XP</span><strong>+${xpGanho}</strong></div>
                        <div><span>Acertos de primeira</span><strong>${acertos}/${total}</strong></div>
                        <div><span>Sequência</span><strong>🔥 ${sequencia}</strong></div>
                    </div>
                    ${xpGanho === 0 ? '<p class="licao-fim-aviso">Você já ganhou XP nesta lição hoje, então essa rodada foi treino. Volte amanhã ou faça outra lição.</p>' : ''}
                    ${xpHoje >= META_DIARIA_XP && xpHoje - xpGanho < META_DIARIA_XP ? '<p class="licao-fim-meta">🎯 Meta de hoje batida!</p>' : ''}
                    ${avisoConta}
                </div>
                <div class="licao-fim-acoes">
                    <button type="button" class="licao-acao" data-acao="fechar">Continuar</button>
                </div>
            </div>
        `;
        $('licao-tela').querySelector('[data-acao="fechar"]').focus();
    }

    function tratarCliqueLicao(evento) {
        const opcao = evento.target.closest('[data-opcao]');
        if (opcao) return selecionarOpcao(Number(opcao.dataset.opcao));

        const acao = evento.target.closest('[data-acao]')?.dataset.acao;
        if (acao === 'fechar') fecharLicao();
        if (acao === 'verificar') verificarResposta();
        if (acao === 'continuar') continuar();
        if (acao === 'repetir') iniciarLicao(partida.licao.id);
        if (acao === 'entrar') {
            fecharLicao();
            abrirModalConta('entrar');
        }
    }

    function tratarTecladoLicao(evento) {
        if (!partida || $('licao-tela').hidden) return;
        if (evento.key === 'Escape') return fecharLicao();
        if (partida.fase === 'respondendo' && /^[1-4]$/.test(evento.key)) {
            const indice = Number(evento.key) - 1;
            if (indice < partida.fila[0].opcoes.length) selecionarOpcao(indice);
            return;
        }
        if (evento.key === 'Enter' && !evento.target.closest('.licao-opcao, [data-acao]')) {
            if (partida.fase === 'respondendo') verificarResposta();
            else if (partida.fase === 'feedback') continuar();
        }
    }

    /* ---------- Ranking ---------- */

    let periodoRanking = 'semana';

    async function renderizarRanking() {
        const painel = $('jogo-ranking');

        if (!conta?.disponivel()) {
            painel.innerHTML = `
                <header class="ranking-cabecalho"><span class="jogo-etiqueta">RANKING</span><h2>Em breve</h2></header>
                <p class="ranking-vazio">Logo você vai poder entrar com Google ou e-mail, salvar seu XP e disputar com a galera.</p>
            `;
            return;
        }

        painel.innerHTML = `
            <header class="ranking-cabecalho">
                <span class="jogo-etiqueta">RANKING</span>
                <h2>Quem mais aprendeu</h2>
                <div class="ranking-abas" role="tablist" aria-label="Período do ranking">
                    <button type="button" role="tab" data-periodo="semana" aria-selected="${periodoRanking === 'semana'}">Semana</button>
                    <button type="button" role="tab" data-periodo="geral" aria-selected="${periodoRanking === 'geral'}">Geral</button>
                </div>
            </header>
            <ol class="ranking-lista" id="ranking-lista" aria-busy="true"><li class="ranking-vazio">Carregando…</li></ol>
            <div class="ranking-rodape">${rodapeRanking()}</div>
        `;

        try {
            const linhas = await conta.obterRanking(periodoRanking);
            const lista = $('ranking-lista');
            lista.setAttribute('aria-busy', 'false');
            lista.innerHTML = linhas.length
                ? linhas.map((linha) => `
                    <li class="ranking-linha${linha.sou_eu ? ' ranking-eu' : ''}">
                        <span class="ranking-posicao">${['🥇', '🥈', '🥉'][linha.posicao - 1] || linha.posicao}</span>
                        <span class="ranking-apelido">${escapar(linha.apelido)}${linha.sou_eu ? ' <em>(você)</em>' : ''}</span>
                        <strong class="ranking-xp">${linha.xp} XP</strong>
                    </li>`).join('')
                : `<li class="ranking-vazio">${periodoRanking === 'semana' ? 'Ninguém pontuou nesta semana ainda. Seja a primeira pessoa!' : 'Ninguém pontuou ainda. Seja a primeira pessoa!'}</li>`;
        } catch (erro) {
            $('ranking-lista').innerHTML = `<li class="ranking-vazio">Não foi possível carregar o ranking agora.</li>`;
            console.error('Erro ao carregar o ranking:', erro.message);
        }
    }

    function rodapeRanking() {
        if (!conta.usuario()) {
            return `<p>Jogue sem conta ou entre para aparecer aqui.</p><button type="button" class="jogo-botao" data-conta="entrar">Entrar e participar</button>`;
        }
        if (!conta.perfil()) {
            return `<p>Falta só escolher seu apelido.</p><button type="button" class="jogo-botao" data-conta="apelido">Escolher apelido</button>`;
        }
        return `<p>No ranking aparece só o seu apelido: <strong>${escapar(conta.perfil().apelido)}</strong>.</p>`;
    }

    /* ---------- Conta: botão do topo e janela de login ---------- */

    function renderizarBotaoConta() {
        const area = $('jogo-conta');
        if (!conta?.disponivel()) {
            area.innerHTML = '';
            return;
        }

        if (!conta.usuario()) {
            area.innerHTML = `<button type="button" class="jogo-botao" data-conta="entrar">Entrar</button>`;
        } else if (!conta.perfil()) {
            area.innerHTML = `<button type="button" class="jogo-botao" data-conta="apelido">Escolher apelido</button>`;
        } else {
            const apelido = conta.perfil().apelido;
            area.innerHTML = `
                <details class="conta-menu">
                    <summary><span class="conta-avatar" aria-hidden="true">${escapar(apelido.charAt(0).toUpperCase())}</span><span>${escapar(apelido)}</span></summary>
                    <div class="conta-menu-lista">
                        <button type="button" data-conta="sair">Sair</button>
                        <button type="button" data-conta="excluir" class="conta-perigo">Excluir minha conta</button>
                    </div>
                </details>
            `;
        }
    }

    let focoAntesDoModal = null;
    let passoAtualConta = null;

    function abrirModalConta(passo) {
        if ($('conta-modal').hidden) focoAntesDoModal = document.activeElement;
        $('conta-modal').hidden = false;
        renderizarModalConta(passo);
    }

    function fecharModalConta() {
        $('conta-modal').hidden = true;
        passoAtualConta = null;
        focoAntesDoModal?.focus?.();
    }

    const AVISO_PRIVACIDADE = `
        <p class="conta-privacidade">Usamos seu e-mail só para você entrar. No ranking aparece apenas o apelido que você escolher.
        Se tiver menos de 18 anos, combine com um responsável antes de criar a conta. Você pode excluir a conta quando quiser.</p>
    `;

    function renderizarModalConta(passo, mensagem = '') {
        const caixa = $('conta-modal-caixa');
        const erro = mensagem ? `<p class="conta-erro" role="alert">${escapar(mensagem)}</p>` : '';

        const passos = {
            entrar: `
                <span class="jogo-etiqueta">SUA CONTA</span>
                <h2 id="conta-titulo">Entre para salvar seu XP</h2>
                <p class="conta-texto">Com conta, seu progresso fica salvo e você entra no ranking.</p>
                <button type="button" class="conta-google" data-conta="google">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h6c-.3 1.4-1 2.5-2.2 3.3v2.8h3.6c2-1.9 3.2-4.7 3.2-8.1z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9C3.8 20.5 7.6 23 12 23z"/><path fill="#FBBC05" d="M5.7 14c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V6.9H2C1.2 8.4.8 10.1.8 11.9s.4 3.5 1.2 5l3.7-2.9z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.5 2.1 15 1 12 1 7.6 1 3.8 3.5 2 7l3.7 2.9C6.6 7.3 9.1 5.4 12 5.4z"/></svg>
                    Entrar com Google
                </button>
                <div class="conta-ou"><span>ou</span></div>
                <form class="conta-form" data-form="email">
                    <label for="conta-email">Receba um link de acesso no e-mail</label>
                    <div class="conta-linha">
                        <input id="conta-email" type="email" required autocomplete="email" placeholder="seu@email.com" />
                        <button type="submit" class="jogo-botao">Enviar link</button>
                    </div>
                </form>
                ${erro}
                ${AVISO_PRIVACIDADE}
            `,
            'email-enviado': `
                <span class="jogo-etiqueta">QUASE LÁ</span>
                <h2 id="conta-titulo">Confira seu e-mail 📬</h2>
                <p class="conta-texto">Enviamos um link de acesso. Abra pelo celular ou pelo computador e você volta para cá já com a conta aberta.</p>
                <p class="conta-texto conta-texto-suave">Não chegou? Veja a caixa de spam ou tente de novo em alguns minutos.</p>
                <button type="button" class="jogo-botao" data-conta="fechar">Entendi</button>
            `,
            apelido: `
                <span class="jogo-etiqueta">BEM-VINDO(A)</span>
                <h2 id="conta-titulo">Escolha seu apelido</h2>
                <p class="conta-texto">É o nome que aparece no ranking. Evite usar seu nome completo.</p>
                <form class="conta-form" data-form="apelido">
                    <label for="conta-apelido">Apelido (3 a 20 letras, números, ponto ou _)</label>
                    <div class="conta-linha">
                        <input id="conta-apelido" type="text" required minlength="3" maxlength="20" pattern="[A-Za-z0-9_.]{3,20}" autocomplete="nickname" placeholder="ex: investidor_jr" />
                        <button type="submit" class="jogo-botao">Salvar</button>
                    </div>
                </form>
                ${erro}
            `,
            excluir: `
                <span class="jogo-etiqueta">EXCLUIR CONTA</span>
                <h2 id="conta-titulo">Tem certeza?</h2>
                <p class="conta-texto">Isso apaga seu login, apelido, XP e histórico do ranking. Não dá para desfazer. O progresso salvo neste aparelho continua.</p>
                ${erro}
                <div class="conta-acoes">
                    <button type="button" class="jogo-botao conta-perigo-botao" data-conta="confirmar-exclusao">Excluir minha conta</button>
                    <button type="button" class="jogo-botao-secundario" data-conta="fechar">Cancelar</button>
                </div>
            `
        };

        passoAtualConta = passo;
        caixa.innerHTML = `<button type="button" class="conta-fechar" data-conta="fechar" aria-label="Fechar">×</button>${passos[passo]}`;
        caixa.querySelector('input, .conta-google, [data-conta="confirmar-exclusao"], .jogo-botao')?.focus();
    }

    async function tratarAcaoConta(acao) {
        try {
            if (acao === 'entrar') return abrirModalConta('entrar');
            if (acao === 'apelido') return abrirModalConta('apelido');
            if (acao === 'excluir') return abrirModalConta('excluir');
            if (acao === 'fechar') return fecharModalConta();
            if (acao === 'google') return await conta.entrarComGoogle();
            if (acao === 'sair') {
                await conta.sair();
                return;
            }
            if (acao === 'confirmar-exclusao') {
                await conta.excluirConta();
                fecharModalConta();
            }
        } catch (erro) {
            const passoAtual = acao === 'confirmar-exclusao' ? 'excluir' : 'entrar';
            if (!$('conta-modal').hidden) renderizarModalConta(passoAtual, erro.message);
            else console.error(erro);
        }
    }

    async function tratarEnvioConta(evento) {
        const form = evento.target.closest('[data-form]');
        if (!form) return;
        evento.preventDefault();

        const botao = form.querySelector('button[type="submit"]');
        botao.disabled = true;

        try {
            if (form.dataset.form === 'email') {
                await conta.enviarLinkPorEmail($('conta-email').value.trim());
                renderizarModalConta('email-enviado');
            } else if (form.dataset.form === 'apelido') {
                await conta.criarPerfil($('conta-apelido').value.trim());
                fecharModalConta();
            }
        } catch (erro) {
            renderizarModalConta(form.dataset.form === 'email' ? 'entrar' : 'apelido', erro.message);
        }
    }

    /* ---------- Inicialização ---------- */

    function renderizarTudo() {
        renderizarStatus();
        renderizarTrilha();
        renderizarBotaoConta();
    }

    document.addEventListener('click', (evento) => {
        const botaoLicao = evento.target.closest('.trilha-botao[data-licao]');
        if (botaoLicao) return iniciarLicao(botaoLicao.dataset.licao);

        const aba = evento.target.closest('[data-periodo]');
        if (aba) {
            periodoRanking = aba.dataset.periodo;
            return renderizarRanking();
        }

        const acaoConta = evento.target.closest('[data-conta]');
        if (acaoConta) return tratarAcaoConta(acaoConta.dataset.conta);

        if (evento.target === $('conta-modal')) fecharModalConta();
    });

    document.addEventListener('submit', tratarEnvioConta);
    $('licao-tela').addEventListener('click', tratarCliqueLicao);
    document.addEventListener('keydown', tratarTecladoLicao);
    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && !$('conta-modal').hidden) fecharModalConta();
    });

    renderizarTudo();
    renderizarRanking();

    if (conta?.disponivel()) {
        let ultimoUsuario;
        conta.aoMudar(async ({ usuario, perfil }) => {
            await sincronizarConclusoes();
            renderizarTudo();
            renderizarRanking();

            // Acabou de entrar: sem apelido, a janela vai para o apelido; com apelido, a janela de login fecha.
            const acabouDeEntrar = usuario && ultimoUsuario !== usuario.id;
            if (acabouDeEntrar && !perfil && passoAtualConta !== 'apelido') {
                abrirModalConta('apelido');
            } else if (acabouDeEntrar && perfil && ['entrar', 'email-enviado'].includes(passoAtualConta)) {
                fecharModalConta();
            }
            ultimoUsuario = usuario?.id;
        });
    }

    // Para testes no console e para a home saber o progresso.
    window.DesafioGSA = { iniciarLicao, progresso: () => ({ ...progresso }) };
})();
