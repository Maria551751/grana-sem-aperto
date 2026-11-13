/* =========================================
   APOSTILA VISUAL: conteúdo das 11 aulas
   Cada aula tem 3 ideias, e cada ideia leva um visual montado por aula.js.
   Tipos de visual: cartoes, passos, versus, barras, divisao, numeros e conta.
   Os nomes em "modulo" precisam bater com modulosData em global.js.
   Valores marcados como exemplo são ilustrações, não taxas reais.
   ========================================= */
const FONTES_GSA = {
    caderno: { nome: 'Banco Central - Caderno de Educação Financeira', url: 'https://www.bcb.gov.br/pre/pef/port/caderno_cidadania_financeira.pdf' },
    cidadania: { nome: 'Banco Central - Cidadania Financeira', url: 'https://www.bcb.gov.br/cidadaniafinanceira/indexcidadaniafinanceira' },
    suitability: { nome: 'Portal do Investidor/CVM - Perfil e suitability', url: 'https://www.gov.br/investidor/pt-br/investir/antes-de-investir/respeite-o-seu-perfil-de-investidor/entenda-o-suitability' },
    diversificacao: { nome: 'Portal do Investidor/CVM - Diversificação', url: 'https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/etfs/como-reduzir-o-risco' },
    cartao: { nome: 'Banco Central - Cartão de crédito', url: 'https://www.bcb.gov.br/cidadaniafinanceira/cartaodecredito/' },
    jurosCartao: { nome: 'Banco Central - Juros acumulados no cartão', url: 'https://bcb.gov.br/estatisticas/juros-cartao-de-credito' },
    leiRotativo: { nome: 'Lei 14.690/2023 - Limite de juros e encargos do rotativo', url: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14690.htm' },
    cdc: { nome: 'Código de Defesa do Consumidor (Lei 8.078/1990)', url: 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm' },
    tesouroRegras: { nome: 'Tesouro Direto - Regras e regulamento', url: 'https://www.tesourodireto.com.br/sobre-o-tesouro/regras-e-regulamento' },
    tesouroProdutos: { nome: 'Tesouro Direto - Nossos produtos', url: 'https://www.tesourodireto.com.br/produtos/nossos-produtos' },
    tesouroReserva: { nome: 'Tesouro Direto - Tesouro Reserva', url: 'https://www.tesourodireto.com.br/tesouro-reserva' },
    fgc: { nome: 'FGC - Sobre a garantia', url: 'https://www.fgc.org.br/sobre-garantia-fgc' }
};

const DATA_CONSULTA_AULAS = '13/11/2026';

const AULAS_GSA = [
    {
        slug: 'mentalidade',
        icone: '🧠',
        modulo: 'Mentalidade de Investidor',
        trilha: 'O Despertar Financeiro',
        titulo: 'Mentalidade de Investidor',
        chamada: 'Decidir melhor antes de investir mais.',
        resumo: 'Investir não começa na bolsa. Começa quando você conhece seus hábitos, define objetivos e cria um processo que evita decisões por impulso.',
        pdf: 'Mentalidade-Financeira.pdf',
        ideias: [
            {
                titulo: 'Dinheiro também é comportamento',
                texto: 'Emoção, pressa e comparação pesam tanto quanto a matemática. Um plano simples e repetido vale mais do que a busca pela escolha perfeita.',
                visual: {
                    tipo: 'versus',
                    ruim: { titulo: 'No impulso', itens: ['Compra na emoção', 'Se compara com os outros', 'Procura a escolha perfeita'] },
                    bom: { titulo: 'Com processo', itens: ['Espera 24 horas', 'Segue o próprio plano', 'Repete o simples todo mês'] }
                }
            },
            {
                titulo: 'Três perguntas antes de investir',
                texto: 'A CVM destaca que o investimento deve combinar com o objetivo e com o perfil de risco de cada pessoa.',
                visual: {
                    tipo: 'cartoes',
                    itens: [
                        { icone: '🎯', titulo: 'Para quê?', texto: 'O objetivo do dinheiro' },
                        { icone: '📅', titulo: 'Quando?', texto: 'O prazo até usar' },
                        { icone: '🎢', titulo: 'Quanto oscila?', texto: 'O risco que você aguenta sem largar o plano' }
                    ]
                }
            },
            {
                titulo: 'O processo GSA',
                texto: 'Rentabilidade passada não garante retorno futuro. O que você controla é o processo.',
                visual: {
                    tipo: 'passos',
                    itens: [
                        { icone: '📝', titulo: 'Planeje', texto: 'Uma quantia possível' },
                        { icone: '⚙️', titulo: 'Automatize', texto: 'Sempre que puder' },
                        { icone: '👀', titulo: 'Acompanhe', texto: 'Sem obsessão' },
                        { icone: '🔁', titulo: 'Revise', texto: 'Em datas definidas' }
                    ]
                }
            }
        ],
        desafio: { frase: 'Guardar um pouco todo mês vale mais do que esperar sobrar muito.', verdade: true, explicacao: 'Constância cria o hábito e dá mais tempo para os juros compostos trabalharem.' },
        passos: ['Escreva um objetivo financeiro para 12 meses.', 'Defina uma ação pequena que pode ser repetida mensalmente.', 'Anote qual emoção mais influencia suas compras.'],
        fontes: ['cidadania', 'caderno', 'suitability']
    },
    {
        slug: 'organizando',
        icone: '💸',
        modulo: 'Organizando sua grana',
        trilha: 'O Despertar Financeiro',
        titulo: 'Organizando sua grana',
        chamada: 'Clareza para transformar renda em escolhas.',
        resumo: 'Orçamento não é punição. É um mapa: mostra o que entra, o que sai, as dívidas e o espaço que sobra para os objetivos.',
        pdf: 'ORGANIZANDO-SUA-GRANA.pdf',
        atalho: { texto: 'Abrir o Planejador de Orçamento', href: 'planejador.html' },
        ideias: [
            {
                titulo: 'Registre o que realmente acontece',
                texto: 'Anote receitas e despesas com valores reais e separe em quatro grupos.',
                visual: {
                    tipo: 'cartoes',
                    itens: [
                        { icone: '🏠', titulo: 'Fixos', texto: 'Aluguel, contas, transporte' },
                        { icone: '🛒', titulo: 'Variáveis', texto: 'Mercado, lazer, compras' },
                        { icone: '💳', titulo: 'Dívidas', texto: 'Parcelas e faturas' },
                        { icone: '🎯', titulo: 'Objetivos', texto: 'Reserva e metas' }
                    ]
                }
            },
            {
                titulo: 'Uma referência, não uma regra',
                texto: 'Percentuais prontos, como a regra 50-30-20, ajudam a começar, mas não substituem a sua realidade. Proteja primeiro o essencial.',
                visual: {
                    tipo: 'divisao',
                    exemplo: 'Exemplo: renda de R$ 1.500 por mês',
                    linhas: [{ partes: [{ rotulo: 'Necessidades', pct: 50, detalhe: 'R$ 750' }, { rotulo: 'Desejos', pct: 30, detalhe: 'R$ 450' }, { rotulo: 'Futuro', pct: 20, detalhe: 'R$ 300' }] }]
                }
            },
            {
                titulo: 'Fechamento mensal',
                texto: 'Compare o planejado com o realizado, escolha um ajuste concreto e defina o limite da próxima semana ou do próximo mês.',
                visual: {
                    tipo: 'barras',
                    exemplo: 'Exemplo: gasto com lazer no mês',
                    itens: [
                        { rotulo: 'Planejado', valor: 200, texto: 'R$ 200' },
                        { rotulo: 'Realizado', valor: 260, texto: 'R$ 260', destaque: true, selo: 'R$ 60 acima' }
                    ]
                }
            }
        ],
        desafio: { frase: 'Orçamento é só para quem ganha muito.', verdade: false, explicacao: 'É com pouca renda que cada real mais precisa de destino. Orçamento é mapa, não punição.' },
        passos: ['Liste todas as fontes de renda do mês.', 'Classifique três gastos como essenciais ou ajustáveis.', 'Escolha uma despesa para reduzir sem comprometer bem-estar.', 'Monte o seu mês no Planejador de Orçamento do GSA e compare com os gastos de hoje.'],
        fontes: ['caderno', 'cidadania', 'suitability']
    },
    {
        slug: 'reserva',
        icone: '🛟',
        modulo: 'Montando a Reserva',
        trilha: 'O Despertar Financeiro',
        titulo: 'Montando a Reserva',
        chamada: 'Liquidez e segurança para os imprevistos.',
        resumo: 'Reserva de emergência é proteção para o inesperado. O tamanho certo depende dos seus gastos essenciais e de quão estável é a sua renda.',
        pdf: 'RESERVA-DE-EMERGENCIA.pdf',
        atalho: { texto: 'Simular na Calculadora do GSA', href: 'calculadora.html#simulador' },
        ideias: [
            {
                titulo: 'Meça em meses de gastos',
                texto: 'A reserva é planejada em meses de despesas essenciais, não como um percentual da renda. Quem tem renda instável pode precisar de mais.',
                visual: {
                    tipo: 'barras',
                    exemplo: 'Exemplo: gastos essenciais de R$ 1.000 por mês',
                    itens: [
                        { rotulo: 'Meta inicial: 1 mês', valor: 1000, texto: 'R$ 1.000' },
                        { rotulo: '3 meses', valor: 3000, texto: 'R$ 3.000' },
                        { rotulo: '6 meses', valor: 6000, texto: 'R$ 6.000', destaque: true }
                    ]
                }
            },
            {
                titulo: 'Três critérios',
                texto: 'Rentabilidade máxima não é o objetivo do dinheiro que pode ser preciso amanhã. Em 2026 o Tesouro Direto lançou o Tesouro Reserva, atrelado à Selic e com resgate a qualquer momento: é mais uma opção para comparar.',
                visual: {
                    tipo: 'cartoes',
                    itens: [
                        { icone: '💧', titulo: 'Liquidez', texto: 'Dá para sacar rápido' },
                        { icone: '🛡️', titulo: 'Baixo risco', texto: 'Sem sustos no valor' },
                        { icone: '🧩', titulo: 'Simplicidade', texto: 'Fácil de entender' }
                    ]
                }
            },
            {
                titulo: 'Garantia tem regra',
                texto: 'Alguns produtos bancários contam com o FGC, dentro desses limites. Títulos públicos não entram no FGC: a garantia é do Tesouro Nacional. Confira emissor, prazo, liquidez e tributação.',
                visual: {
                    tipo: 'numeros',
                    itens: [
                        { valor: 'R$ 250 mil', legenda: 'Limite do FGC por CPF, em cada instituição' },
                        { valor: 'R$ 1 milhão', legenda: 'Teto do FGC por CPF a cada 4 anos' }
                    ]
                }
            }
        ],
        desafio: { frase: 'A reserva deve ficar no investimento que mais rende.', verdade: false, explicacao: 'O dinheiro que pode ser preciso amanhã pede liquidez e baixo risco, não rentabilidade máxima.' },
        passos: ['Calcule suas despesas essenciais médias.', 'Defina uma meta inicial menor e alcançável.', 'Confira liquidez e regras do produto antes de aplicar.', 'Simule na Calculadora do GSA em quanto tempo você chega à meta.'],
        fontes: ['cidadania', 'caderno', 'fgc', 'tesouroRegras', 'tesouroReserva']
    },
    {
        slug: 'cartao',
        icone: '💳',
        modulo: 'Cartão de Crédito sem Armadilha',
        trilha: 'O Despertar Financeiro',
        titulo: 'Cartão sem armadilha',
        chamada: 'Crédito é ferramenta, não renda extra.',
        resumo: 'O limite do cartão é um empréstimo disponível, não parte da sua renda. Usar bem é acompanhar compras, vencimento e o custo do crédito.',
        pdf: 'Cartao-de-Credito-sem-Armadilha.pdf',
        ideias: [
            {
                titulo: 'Fatura integral',
                texto: 'Pagando o total até o vencimento, não há encargos do rotativo. Pagar só uma parte transforma o resto em dívida.',
                visual: {
                    tipo: 'versus',
                    bom: { titulo: 'Pagou tudo', itens: ['Sem juros', 'O cartão vira só um meio de pagamento'] },
                    ruim: { titulo: 'Pagou uma parte', itens: ['O resto vira dívida', 'Entram juros e encargos do rotativo'] }
                }
            },
            {
                titulo: 'O rotativo pode dobrar a dívida',
                texto: 'Pela lei, juros e encargos do rotativo e do parcelamento da fatura não podem passar do valor original. Mesmo assim, a dívida pode chegar ao dobro.',
                visual: {
                    tipo: 'barras',
                    exemplo: 'Exemplo: R$ 1.000 que ficaram no rotativo',
                    itens: [
                        { rotulo: 'O que você devia', valor: 1000, texto: 'R$ 1.000' },
                        { rotulo: 'Até onde pode chegar', valor: 2000, texto: 'R$ 2.000', destaque: true, selo: 'o dobro' }
                    ]
                }
            },
            {
                titulo: 'Rotina segura',
                texto: 'Quatro hábitos que evitam a surpresa na fatura.',
                visual: {
                    tipo: 'cartoes',
                    itens: [
                        { icone: '🔔', titulo: 'Alertas', texto: 'Aviso a cada compra' },
                        { icone: '📆', titulo: 'Parcelas', texto: 'Acompanhe as que ainda vêm' },
                        { icone: '📏', titulo: 'Limite', texto: 'Do tamanho do orçamento' },
                        { icone: '🧮', titulo: 'CET', texto: 'Compare antes de parcelar a fatura' }
                    ]
                }
            }
        ],
        desafio: { frase: 'O limite do cartão faz parte da minha renda.', verdade: false, explicacao: 'Limite é empréstimo disponível. Usar tudo é gastar um dinheiro que ainda não entrou.' },
        passos: ['Some compras à vista e parcelas já contratadas.', 'Confira data de fechamento e vencimento.', 'Simule quanto sobraria se a renda diminuísse neste mês.', 'Siga para os módulos 09 e 10: pontos no cartão e como sair das dívidas.'],
        fontes: ['cartao', 'jurosCartao', 'leiRotativo', 'caderno']
    },
    {
        slug: 'tesouro',
        icone: '🏛️',
        modulo: 'Tesouro Direto na Prática',
        trilha: 'Mestre da Carteira GSA',
        titulo: 'Tesouro Direto na prática',
        chamada: 'Prazo e objetivo antes do nome do título.',
        resumo: 'Títulos públicos são renda fixa emitida pelo Tesouro Nacional. O retorno e a oscilação dependem do tipo de título e de quando você resgata.',
        pdf: 'Tesouro-Direto-na-Pratica.pdf',
        ideias: [
            {
                titulo: 'Os tipos de título',
                texto: 'Há ainda títulos para objetivos específicos, como RendA+ (aposentadoria) e Educa+ (estudos), e o Tesouro Reserva, lançado em 2026 para a reserva de emergência.',
                visual: {
                    tipo: 'cartoes',
                    itens: [
                        { icone: '📈', titulo: 'Tesouro Selic', texto: 'Acompanha a taxa Selic' },
                        { icone: '🔒', titulo: 'Prefixado', texto: 'Taxa definida na compra' },
                        { icone: '🛒', titulo: 'IPCA+', texto: 'Inflação mais uma taxa real' }
                    ]
                }
            },
            {
                titulo: 'Marcação a mercado',
                texto: 'O preço do título muda todos os dias. Isso só pesa para quem vende antes do vencimento.',
                visual: {
                    tipo: 'versus',
                    ruim: { titulo: 'Vendeu antes', itens: ['Recebe o preço de mercado do dia', 'O retorno pode ser diferente do contratado'] },
                    bom: { titulo: 'Levou até o vencimento', itens: ['Valem as condições contratadas', 'Observadas as regras e os custos'] }
                }
            },
            {
                titulo: 'Escolha com método',
                texto: 'Ligue o título e o vencimento ao seu objetivo, nesta ordem.',
                visual: {
                    tipo: 'passos',
                    itens: [
                        { icone: '🎯', titulo: 'Objetivo', texto: 'E o prazo dele' },
                        { icone: '🧾', titulo: 'Custos', texto: 'Tributação e taxa de custódia' },
                        { icone: '🚪', titulo: 'Saída', texto: 'Risco de resgatar antes' },
                        { icone: '💧', titulo: 'Liquidez', texto: 'Quanto você precisa dela' }
                    ]
                }
            }
        ],
        desafio: { frase: 'Título público nunca oscila.', verdade: false, explicacao: 'Prefixados e IPCA+ mudam de preço todos os dias. Quem vende antes do vencimento pode receber menos do que esperava.' },
        passos: ['Defina o prazo do objetivo.', 'Compare Selic, Prefixado e IPCA+ para esse prazo.', 'Leia as regras atuais antes de investir.'],
        fontes: ['tesouroProdutos', 'tesouroRegras', 'suitability', 'caderno']
    },
    {
        slug: 'fiis',
        icone: '🏢',
        modulo: 'Dividendos com FIIs',
        trilha: 'Mestre da Carteira GSA',
        titulo: 'Dividendos com FIIs',
        chamada: 'Rendimento não é sinônimo de garantia.',
        resumo: 'Fundos imobiliários juntam o dinheiro de muitos investidores para aplicar em ativos do mercado imobiliário. As cotas são renda variável.',
        pdf: 'Dividendos-com-FIIs.pdf',
        ideias: [
            {
                titulo: 'De onde vem o resultado',
                texto: 'A origem depende da política de cada fundo.',
                visual: {
                    tipo: 'cartoes',
                    itens: [
                        { icone: '🏢', titulo: 'Aluguéis', texto: 'Dos imóveis do fundo' },
                        { icone: '📄', titulo: 'Papéis', texto: 'Ativos financeiros imobiliários' },
                        { icone: '📊', titulo: 'Cotas', texto: 'Variação do valor da cota' }
                    ]
                }
            },
            {
                titulo: 'Riscos que importam',
                texto: 'Qualquer um deles pode mexer no preço da cota e no rendimento. O rendimento pode diminuir ou deixar de ser pago.',
                visual: {
                    tipo: 'cartoes',
                    compacto: true,
                    itens: [
                        { icone: '🚪', titulo: 'Vacância', texto: 'Imóvel vazio' },
                        { icone: '⏳', titulo: 'Inadimplência', texto: 'Inquilino não paga' },
                        { icone: '📈', titulo: 'Juros', texto: 'Mexem no preço' },
                        { icone: '🎯', titulo: 'Concentração', texto: 'Poucos ativos' },
                        { icone: '🧑‍💼', titulo: 'Gestão', texto: 'Decisões do gestor' },
                        { icone: '💧', titulo: 'Liquidez', texto: 'Dificuldade de vender' }
                    ]
                }
            },
            {
                titulo: 'O que analisar',
                texto: 'Olhe o fundo antes de olhar só o rendimento recente. A tributação dos rendimentos e do ganho na venda de cotas tem regras próprias e vem sendo debatida: confirme a regra em vigor.',
                visual: {
                    tipo: 'passos',
                    itens: [
                        { icone: '📘', titulo: 'Documentos', texto: 'Regulamento e relatórios' },
                        { icone: '🏗️', titulo: 'Ativos', texto: 'Imóveis, papéis e contratos' },
                        { icone: '💰', titulo: 'Custos', texto: 'Dívidas e taxas' },
                        { icone: '🧾', titulo: 'Imposto', texto: 'Regra em vigor' }
                    ]
                }
            }
        ],
        desafio: { frase: 'FII paga o mesmo rendimento todo mês, como um aluguel fixo.', verdade: false, explicacao: 'O rendimento varia com vacância, inadimplência e juros, e pode até deixar de ser pago.' },
        passos: ['Escolha um FII apenas para estudo.', 'Identifique política, principais ativos e riscos.', 'Compare rendimento distribuído e resultado recorrente.'],
        fontes: [
            { nome: 'Portal do Investidor/CVM - Fundos Imobiliários', url: 'https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/fundos-de-investimentos-imobiliarios-fii' },
            { nome: 'Portal do Investidor/CVM - Principais riscos dos FIIs', url: 'https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/fundos-de-investimentos-imobiliarios-fii/principais-riscos' },
            'suitability'
        ]
    },
    {
        slug: 'acoes',
        icone: '📈',
        modulo: 'Escolhendo Ações',
        trilha: 'Mestre da Carteira GSA',
        titulo: 'Escolhendo ações',
        chamada: 'Uma ação é uma parte de uma empresa.',
        resumo: 'Comprar uma ação é se expor ao desempenho e aos riscos de um negócio. Preço baixo, dividendo recente ou fama não bastam para decidir.',
        pdf: 'Escolhendo-Acoes.pdf',
        ideias: [
            {
                titulo: 'Comece pelo negócio',
                texto: 'Consulte os documentos oficiais e os resultados divulgados ao mercado.',
                visual: {
                    tipo: 'cartoes',
                    itens: [
                        { icone: '💵', titulo: 'Receita', texto: 'Como a empresa ganha dinheiro?' },
                        { icone: '👥', titulo: 'Mercado', texto: 'Quem são clientes e concorrentes?' },
                        { icone: '⚠️', titulo: 'Riscos', texto: 'O que pode dar errado?' },
                        { icone: '🏛️', titulo: 'Governança', texto: 'Como ela é dirigida?' }
                    ]
                }
            },
            {
                titulo: 'Números com contexto',
                texto: 'Receita, margens, lucro, caixa e dívida precisam ser vistos juntos e ao longo do tempo. Um ano isolado não conta a história.',
                visual: {
                    tipo: 'barras',
                    exemplo: 'Exemplo fictício: lucro de uma empresa, em milhões',
                    itens: [
                        { rotulo: 'Ano 1', valor: 100, texto: 'R$ 100' },
                        { rotulo: 'Ano 2', valor: 60, texto: 'R$ 60' },
                        { rotulo: 'Ano 3', valor: 110, texto: 'R$ 110', destaque: true, selo: 'ano bom' },
                        { rotulo: 'Ano 4', valor: 40, texto: 'R$ 40' }
                    ]
                }
            },
            {
                titulo: 'Risco e diversificação',
                texto: 'Ações podem cair e causar perda parcial ou total. Diversificar reduz a concentração, mas não elimina os riscos.',
                visual: {
                    tipo: 'divisao',
                    linhas: [
                        { titulo: 'Tudo em uma empresa', partes: [{ rotulo: 'Empresa A', pct: 100 }] },
                        { titulo: 'Dividido', partes: [{ rotulo: 'Empresa A', pct: 34 }, { rotulo: 'Outro setor', pct: 33 }, { rotulo: 'Outra classe', pct: 33 }] }
                    ]
                }
            }
        ],
        desafio: { frase: 'Ação barata é sempre uma boa oportunidade.', verdade: false, explicacao: 'Preço baixo sozinho não diz nada: pode ser uma empresa com problemas. Estude o negócio antes.' },
        passos: ['Explique em uma frase como a empresa ganha dinheiro.', 'Liste dois riscos específicos do negócio.', 'Leia o formulário de referência e o resultado mais recente.'],
        fontes: [
            { nome: 'Portal do Investidor/CVM - Ações', url: 'https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/acoes' },
            { nome: 'Portal do Investidor/CVM - Cuidados ao investir', url: 'https://www.gov.br/investidor/pt-br/investir/cuidados-ao-investir' },
            'diversificacao',
            'suitability'
        ]
    },
    {
        slug: 'rebalanceamento',
        icone: '⚖️',
        modulo: 'Rebalanceamento da Carteira',
        trilha: 'Mestre da Carteira GSA',
        titulo: 'Rebalanceamento da carteira',
        chamada: 'Voltar ao plano sem tentar prever o mercado.',
        resumo: 'Com as altas e quedas, os percentuais da carteira se afastam do plano. Rebalancear é comparar o que você tem com o que planejou e ajustar.',
        pdf: 'REBALANCEAMENTO-DA-CARTEIRA.pdf',
        ideias: [
            {
                titulo: 'A carteira sai do lugar',
                texto: 'Concentração que você não escolheu aumenta o risco. A CVM destaca que rebalancear mantém a coerência entre risco, objetivos e horizonte.',
                visual: {
                    tipo: 'divisao',
                    exemplo: 'Exemplo: plano de 70% em renda fixa e 30% em ações',
                    linhas: [
                        { titulo: 'O plano', partes: [{ rotulo: 'Renda fixa', pct: 70 }, { rotulo: 'Ações', pct: 30 }] },
                        { titulo: 'Depois de uma alta das ações', partes: [{ rotulo: 'Renda fixa', pct: 55 }, { rotulo: 'Ações', pct: 45 }] }
                    ]
                }
            },
            {
                titulo: 'Como fazer',
                texto: 'Corrigir com os novos aportes reduz custos e movimentações desnecessárias.',
                visual: {
                    tipo: 'passos',
                    itens: [
                        { icone: '📅', titulo: 'Defina a regra', texto: 'Uma data ou uma faixa de tolerância' },
                        { icone: '➕', titulo: 'Use os aportes', texto: 'No que ficou abaixo do plano' },
                        { icone: '🔁', titulo: 'Venda por último', texto: 'Só se os aportes não bastarem' }
                    ]
                }
            },
            {
                titulo: 'O que considerar',
                texto: 'Rebalancear não garante lucro nem elimina perdas. Serve para manter o risco que você escolheu.',
                visual: {
                    tipo: 'cartoes',
                    itens: [
                        { icone: '🎯', titulo: 'Objetivo', texto: 'Mudou o objetivo ou o prazo?' },
                        { icone: '💼', titulo: 'Momento', texto: 'Mudou a renda ou o perfil?' },
                        { icone: '🧾', titulo: 'Custos', texto: 'Taxas, impostos e liquidez' }
                    ]
                }
            }
        ],
        desafio: { frase: 'Rebalancear é vender tudo o que caiu.', verdade: false, explicacao: 'É voltar aos percentuais do plano, de preferência usando os novos aportes.' },
        passos: ['Anote os percentuais atuais da carteira.', 'Compare com a estratégia escolhida.', 'Defina uma regra simples de revisão periódica.'],
        fontes: [
            { nome: 'Portal do Investidor/CVM - Revisão e rebalanceamento', url: 'https://www.gov.br/investidor/pt-br/penso-logo-invisto/checklist-financeiro-de-inicio-de-ano-tudo-o-que-voce-precisa-verificar' },
            'diversificacao',
            'suitability'
        ]
    },
    {
        slug: 'pontos',
        icone: '✈️',
        modulo: 'Pontos e Milhas no Cartão',
        trilha: 'Crédito a seu Favor',
        titulo: 'Pontos e milhas no cartão',
        chamada: 'Ponto é bônus, não motivo para gastar.',
        resumo: 'Programas de pontos, milhas e cashback devolvem uma pequena parte do que você gasta. Só valem a pena para quem já usa o cartão com controle.',
        pdf: 'Pontos-e-Milhas-no-Cartao.pdf',
        ideias: [
            {
                titulo: 'Como os pontos funcionam',
                texto: 'As regras mudam de um programa para outro, e muitos têm prazo de validade.',
                visual: {
                    tipo: 'passos',
                    itens: [
                        { icone: '🛍️', titulo: 'Compra', texto: 'Feita no cartão' },
                        { icone: '⭐', titulo: 'Pontua', texto: 'Pontos, milhas ou cashback' },
                        { icone: '🎁', titulo: 'Troca', texto: 'Passagem, produto ou desconto' },
                        { icone: '⏰', titulo: 'Validade', texto: 'Ponto vencido é ponto perdido' }
                    ]
                }
            },
            {
                titulo: 'A conta que importa',
                texto: 'Se o cartão custa mais do que devolve, peça isenção da anuidade ou troque de cartão.',
                visual: {
                    tipo: 'conta',
                    exemplo: 'Exemplo: um ano de cartão',
                    itens: [
                        { rotulo: 'Pontos do ano', texto: 'R$ 150', sinal: '+' },
                        { rotulo: 'Anuidade', texto: 'R$ 480', sinal: '−' }
                    ],
                    resultado: { rotulo: 'Saldo', texto: '− R$ 330', bom: false, selo: 'Não compensa' }
                }
            },
            {
                titulo: 'Sem juros, sempre',
                texto: 'Os juros do rotativo anulam qualquer benefício do programa.',
                visual: {
                    tipo: 'versus',
                    bom: { titulo: 'A seu favor', itens: ['Só gastos que já estavam no orçamento', 'Fatura inteira até o vencimento', 'Comprar logo depois do fechamento'] },
                    ruim: { titulo: 'Contra você', itens: ['Comprar mais para pontuar', 'Pagar só o mínimo', 'Deixar os pontos vencerem'] }
                }
            }
        ],
        desafio: { frase: 'Vale a pena comprar mais só para juntar pontos.', verdade: false, explicacao: 'Os pontos devolvem uma fração pequena do gasto. Comprar sem precisar custa muito mais do que o ponto vale.' },
        passos: ['Descubra quanto o seu cartão cobra de anuidade e quanto vale cada ponto.', 'Anote a data de fechamento da fatura e a validade dos seus pontos.', 'Escolha um gasto fixo do mês para concentrar no cartão e pagar integralmente.'],
        fontes: ['cartao', 'jurosCartao', 'leiRotativo', 'caderno']
    },
    {
        slug: 'dividas',
        icone: '📉',
        modulo: 'Saindo das Dívidas',
        trilha: 'Crédito a seu Favor',
        titulo: 'Saindo das dívidas',
        chamada: 'Dívida se resolve com plano, não com pressa.',
        resumo: 'Sair das dívidas começa por enxergar o tamanho do problema. Com a lista completa, dá para decidir o que pagar primeiro e negociar o que cabe no mês.',
        pdf: 'Saindo-das-Dividas.pdf',
        ideias: [
            {
                titulo: 'Coloque tudo no papel',
                texto: 'Some as parcelas e compare com a renda para saber quanto dá para pagar por mês sem faltar para o essencial.',
                visual: {
                    tipo: 'cartoes',
                    itens: [
                        { icone: '👤', titulo: 'Credor', texto: 'Para quem você deve' },
                        { icone: '💰', titulo: 'Valor', texto: 'Quanto deve no total' },
                        { icone: '📈', titulo: 'Juros', texto: 'Quanto a dívida cresce' },
                        { icone: '📅', titulo: 'Parcela', texto: 'Quanto sai por mês' }
                    ]
                }
            },
            {
                titulo: 'Comece pela mais cara',
                texto: 'Quitar primeiro a dívida de juros mais altos faz o total parar de crescer. Trocar por um crédito mais barato também ajuda, desde que você pare de criar dívida nova.',
                visual: {
                    tipo: 'barras',
                    exemplo: 'Ordem típica do custo dos juros. Confira as taxas das suas dívidas.',
                    semValor: true,
                    itens: [
                        { rotulo: 'Rotativo do cartão', valor: 100, destaque: true, selo: 'pague primeiro' },
                        { rotulo: 'Cheque especial', valor: 78 },
                        { rotulo: 'Empréstimo pessoal', valor: 50 },
                        { rotulo: 'Consignado', valor: 24 }
                    ]
                }
            },
            {
                titulo: 'Negocie com segurança',
                texto: 'Depois que a dívida é paga, o credor tem 5 dias úteis para pedir a retirada do seu nome dos cadastros de inadimplentes.',
                visual: {
                    tipo: 'passos',
                    itens: [
                        { icone: '📞', titulo: 'Peça o valor', texto: 'Atualizado, com o credor' },
                        { icone: '🧮', titulo: 'Proponha', texto: 'Uma parcela que cabe no mês' },
                        { icone: '📝', titulo: 'Por escrito', texto: 'Guarde acordo e comprovantes' },
                        { icone: '✅', titulo: '5 dias úteis', texto: 'Para o nome sair do cadastro' }
                    ]
                }
            }
        ],
        desafio: { frase: 'Pegar um empréstimo para pagar outra dívida sempre piora a situação.', verdade: false, explicacao: 'Trocar uma dívida cara por outra com juros menores pode ajudar. Só funciona se você parar de criar dívida nova.' },
        passos: ['Liste suas dívidas com valor, juros e parcela.', 'Marque a de juros mais altos e defina quanto pode pagar por mês.', 'Pare de usar o crédito que gerou a dívida até concluir o plano.'],
        fontes: ['caderno', { nome: 'Consumidor.gov.br - Negociação direta com as empresas', url: 'https://www.consumidor.gov.br/' }, { nome: 'Lei 14.181/2021 - Prevenção e tratamento do superendividamento', url: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14181.htm' }, 'cdc']
    },
    {
        slug: 'emprestimo',
        icone: '🤝',
        modulo: 'Empréstimo do Jeito Certo',
        trilha: 'Crédito a seu Favor',
        titulo: 'Empréstimo do jeito certo',
        chamada: 'Crédito bom é o que cabe no plano.',
        resumo: 'Empréstimo é dinheiro alugado: você devolve o valor e paga juros pelo uso. Ajuda quando resolve uma necessidade real ou reduz um custo maior.',
        pdf: 'Emprestimo-do-Jeito-Certo.pdf',
        ideias: [
            {
                titulo: 'Compare pelo total, não pela parcela',
                texto: 'O CET (Custo Efetivo Total) soma juros, tarifas, seguros e impostos, e a instituição deve informar antes da contratação. Peça propostas em mais de um lugar.',
                visual: {
                    tipo: 'barras',
                    exemplo: 'Exemplo: R$ 2.000 emprestados, total pago em cada proposta',
                    itens: [
                        { rotulo: 'A: 12 parcelas de R$ 210', valor: 2520, texto: 'R$ 2.520' },
                        { rotulo: 'B: 24 parcelas de R$ 130', valor: 3120, texto: 'R$ 3.120', destaque: true, selo: 'parcela menor, total maior' }
                    ]
                }
            },
            {
                titulo: 'Quando faz sentido',
                texto: 'Para consumo por impulso ou para aplicar o dinheiro, os juros costumam superar o ganho.',
                visual: {
                    tipo: 'versus',
                    bom: { titulo: 'Pode ajudar', itens: ['Trocar dívida cara por mais barata', 'Resolver uma emergência', 'Investir em estudo ou trabalho'] },
                    ruim: { titulo: 'Costuma atrapalhar', itens: ['Compra por impulso', 'Pegar emprestado para investir'] }
                }
            },
            {
                titulo: 'Proteja-se',
                texto: 'Confira também se a parcela cabe no orçamento mesmo em um mês ruim.',
                visual: {
                    tipo: 'cartoes',
                    itens: [
                        { icone: '🚫', titulo: 'Depósito antes?', texto: 'É golpe. Instituição autorizada não cobra para liberar' },
                        { icone: '🏦', titulo: 'Autorização', texto: 'Confirme no site do Banco Central' },
                        { icone: '⏩', titulo: 'Quitou antes?', texto: 'Tem direito a desconto proporcional dos juros' }
                    ]
                }
            }
        ],
        desafio: { frase: 'Parcela pequena significa empréstimo barato.', verdade: false, explicacao: 'Parcela baixa com prazo longo pode sair muito mais cara no total. Olhe quanto você paga somando tudo.' },
        passos: ['Peça o CET de duas ou três propostas e compare o total pago.', 'Simule o seu mês já com a parcela incluída.', 'Confirme no site do Banco Central se a instituição é autorizada.'],
        fontes: [{ nome: 'Banco Central - Resolução CMN 4.881/2020 (Custo Efetivo Total)', url: 'https://www.bcb.gov.br/content/estabilidadefinanceira/especialnor/Resolu%C3%A7%C3%A3o4881.pdf' }, 'caderno', { nome: 'Febraban - Antifraudes', url: 'https://portal.febraban.org.br/AntiFraude/' }, 'cdc']
    }
];
