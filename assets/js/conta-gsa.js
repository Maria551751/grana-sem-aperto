/* =========================================
   CONTA GSA: login, perfil e ranking (Supabase)
   Única parte do site que fala com o Supabase. O jogo usa só window.ContaGSA.
   Sem supabase-config.js preenchido, disponivel() é false e o jogo segue no modo visitante.
   ========================================= */
(function () {
    const config = window.GSA_SUPABASE || {};
    const configurado = Boolean(config.url && config.anonKey && window.supabase?.createClient);
    const cliente = configurado ? window.supabase.createClient(config.url, config.anonKey) : null;

    let usuario = null;
    let perfil = null;
    const ouvintes = new Set();

    const avisar = () => ouvintes.forEach((ouvinte) => ouvinte({ usuario, perfil }));

    // Volta para a mesma página depois do login (Google ou link do e-mail).
    const enderecoDeVolta = () => window.location.origin + window.location.pathname;

    async function carregarPerfil() {
        if (!usuario) {
            perfil = null;
            return;
        }

        const { data, error } = await cliente.from('perfis').select('apelido, xp, sequencia, melhor_sequencia, ultimo_dia').eq('id', usuario.id).maybeSingle();
        if (error) throw error;
        perfil = data;
    }

    async function atualizarSessao(sessao) {
        usuario = sessao?.user || null;
        try {
            await carregarPerfil();
        } catch (erro) {
            console.error('Não foi possível carregar o perfil:', erro.message);
            perfil = null;
        }
        avisar();
    }

    if (cliente) {
        cliente.auth.onAuthStateChange((_evento, sessao) => {
            // Fora do callback: chamar o Supabase dentro dele pode travar a sessão.
            setTimeout(() => atualizarSessao(sessao), 0);
        });
    }

    function exigirCliente() {
        if (!cliente) throw new Error('Login indisponível no momento.');
    }

    const mensagemDeErro = (erro) => {
        const texto = String(erro?.message || erro || '');
        if (/perfis_apelido_unico|duplicate key/i.test(texto)) return 'Esse apelido já está em uso. Tente outro.';
        if (/perfis_apelido_check|violates check/i.test(texto)) return 'Use de 3 a 20 letras, números, ponto ou _.';
        if (/rate limit|too many/i.test(texto)) return 'Muitas tentativas. Espere um pouco e tente de novo.';
        return texto || 'Algo deu errado. Tente de novo.';
    };

    window.ContaGSA = {
        disponivel: () => configurado,
        usuario: () => usuario,
        perfil: () => perfil,

        aoMudar(ouvinte) {
            ouvintes.add(ouvinte);
            ouvinte({ usuario, perfil });
            return () => ouvintes.delete(ouvinte);
        },

        async entrarComGoogle() {
            exigirCliente();
            const { error } = await cliente.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: enderecoDeVolta() } });
            if (error) throw new Error(mensagemDeErro(error));
        },

        async enviarLinkPorEmail(email) {
            exigirCliente();
            const { error } = await cliente.auth.signInWithOtp({ email, options: { emailRedirectTo: enderecoDeVolta() } });
            if (error) throw new Error(mensagemDeErro(error));
        },

        async sair() {
            exigirCliente();
            await cliente.auth.signOut();
        },

        async criarPerfil(apelido) {
            exigirCliente();
            if (!usuario) throw new Error('Entre na sua conta primeiro.');
            const { error } = await cliente.from('perfis').insert({ id: usuario.id, apelido });
            if (error) throw new Error(mensagemDeErro(error));
            await carregarPerfil();
            avisar();
        },

        // Devolve { xpTotal, diasSeguidos, recordeDias, xpGanho } calculados no servidor.
        async registrarLicao(licaoId, acertos, total) {
            exigirCliente();
            const { data, error } = await cliente.rpc('registrar_licao', { p_licao: licaoId, p_acertos: acertos, p_total: total });
            if (error) throw new Error(mensagemDeErro(error));
            const [linha] = data || [];
            await carregarPerfil();
            avisar();
            return linha
                ? { xpTotal: linha.xp_total, diasSeguidos: linha.dias_seguidos, recordeDias: linha.recorde_dias, xpGanho: linha.xp_ganho }
                : null;
        },

        async licoesConcluidas() {
            if (!cliente || !usuario) return [];
            const { data, error } = await cliente.from('conclusoes').select('licao_id, dia, acertos, total, xp_ganho');
            if (error) throw new Error(mensagemDeErro(error));
            return data || [];
        },

        async obterRanking(periodo = 'semana') {
            exigirCliente();
            const { data, error } = await cliente.rpc('obter_ranking', { p_periodo: periodo });
            if (error) throw new Error(mensagemDeErro(error));
            return data || [];
        },

        async excluirConta() {
            exigirCliente();
            const { error } = await cliente.rpc('excluir_minha_conta');
            if (error) throw new Error(mensagemDeErro(error));
            await cliente.auth.signOut();
        }
    };
})();
