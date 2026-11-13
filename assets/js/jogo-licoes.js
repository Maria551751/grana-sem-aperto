/* =========================================
   DESAFIO GSA: conteúdo das lições
   As unidades seguem as trilhas da página Cursos (modulosData em global.js).
   Os ids das lições precisam bater com a lista de registrar_licao em supabase/schema.sql.
   tipo "vf" = verdadeiro ou falso; "escolha" = uma resposta certa entre as opções.
   ========================================= */
const UNIDADES_JOGO = [
    {
        id: 'despertar',
        titulo: 'O Despertar Financeiro',
        subtitulo: 'Organizar e proteger',
        licoes: [
            {
                id: 'mentalidade',
                titulo: 'Mentalidade de Investidor',
                icone: '🧠',
                perguntas: [
                    {
                        tipo: 'escolha',
                        enunciado: 'Dinheiro é só matemática?',
                        opcoes: ['Sim, basta saber as contas.', 'Não: também envolve hábitos e comportamento.', 'Sim, emoção não interfere em nada.'],
                        correta: 1,
                        explicacao: 'Saber a teoria não basta sem disciplina. As escolhas do dia a dia pesam tanto quanto as contas.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Guardar um pouco todo mês, mesmo pouco, vale mais do que esperar sobrar muito.',
                        correta: 0,
                        explicacao: 'Constância cria o hábito e deixa os juros compostos trabalharem por mais tempo.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Qual é um sinal do "modo sobrevivência"?',
                        opcoes: ['Ter uma reserva de 6 meses.', 'Viver só pagando contas, sem nenhum plano.', 'Investir um pouco todo mês.'],
                        correta: 1,
                        explicacao: 'Só apagar incêndios não constrói liberdade. O primeiro passo é ter um plano, mesmo simples.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Um perfil promete "renda garantida de 20% ao mês". O que fazer?',
                        opcoes: ['Entrar rápido antes que acabe.', 'Desconfiar: retorno alto e garantido é sinal de golpe.', 'Chamar os amigos para entrar junto.'],
                        correta: 1,
                        explicacao: 'Nenhum investimento sério garante retorno tão alto. Promessa assim costuma ser pirâmide ou golpe.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Esperar 24 horas antes de uma compra por impulso ajuda a decidir melhor.',
                        correta: 0,
                        explicacao: 'Dar um tempo separa vontade de necessidade. Muitas vezes a vontade passa.'
                    }
                ]
            },
            {
                id: 'organizando-grana',
                titulo: 'Organizando sua grana',
                icone: '💸',
                perguntas: [
                    {
                        tipo: 'escolha',
                        enunciado: 'Na regra 50-30-20, para onde vão os 20%?',
                        opcoes: ['Lazer e delivery.', 'Futuro: reserva e investimentos.', 'Aluguel e contas.'],
                        correta: 1,
                        explicacao: '50% necessidades, 30% desejos e 20% futuro. Os 20% constroem sua segurança.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Você ganha R$ 1.500. Pela regra 50-30-20, quanto vai para necessidades?',
                        opcoes: ['R$ 300', 'R$ 450', 'R$ 750'],
                        correta: 2,
                        explicacao: '50% de R$ 1.500 é R$ 750. Os desejos ficam com R$ 450 e o futuro com R$ 300.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Delivery e streaming entram em "desejos", não em "necessidades".',
                        correta: 0,
                        explicacao: 'São gastos que você escolhe ter. Necessidades são moradia, comida, transporte e contas básicas.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Qual é o primeiro passo para organizar a grana?',
                        opcoes: ['Anotar quanto entra e para onde vai.', 'Pedir um aumento.', 'Investir tudo em ações.'],
                        correta: 0,
                        explicacao: 'Sem saber para onde o dinheiro vai, não dá para planejar. Anotar os gastos vem antes de tudo.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Se a renda não permite guardar 20%, não vale a pena guardar nada.',
                        correta: 1,
                        explicacao: 'A regra é um ponto de partida. Comece com o que der, mesmo 5%, e aumente aos poucos.'
                    }
                ]
            },
            {
                id: 'reserva',
                titulo: 'Montando a Reserva',
                icone: '🛟',
                perguntas: [
                    {
                        tipo: 'escolha',
                        enunciado: 'Para que serve a reserva de emergência?',
                        opcoes: ['Comprar o celular novo.', 'Cobrir imprevistos, como perder a renda ou um conserto urgente.', 'Tentar ganhar muito rápido.'],
                        correta: 1,
                        explicacao: 'A reserva é o colchão para o inesperado, para você não precisar se endividar.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Qual característica é mais importante na reserva?',
                        opcoes: ['Rentabilidade altíssima.', 'Liquidez: poder sacar rápido.', 'Prazo longo de 10 anos.'],
                        correta: 1,
                        explicacao: 'No imprevisto você precisa do dinheiro na hora. Segurança e liquidez vêm antes do rendimento.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Ações são um bom lugar para guardar a reserva de emergência.',
                        correta: 1,
                        explicacao: 'Ações oscilam. Na hora do aperto elas podem estar em queda, e você venderia no prejuízo.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Seus gastos essenciais são R$ 1.000 por mês. Uma reserva de 6 meses é:',
                        opcoes: ['R$ 1.000', 'R$ 6.000', 'R$ 12.000'],
                        correta: 1,
                        explicacao: '6 meses × R$ 1.000 = R$ 6.000. Dá para começar com uma meta menor e ir crescendo.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Onde a reserva costuma ficar?',
                        opcoes: ['Tesouro Selic ou CDB com liquidez diária.', 'Criptomoedas.', 'Na carteira, em dinheiro vivo.'],
                        correta: 0,
                        explicacao: 'São opções conservadoras, que rendem mais que a poupança e deixam sacar rápido.'
                    }
                ]
            },
            {
                id: 'cartao',
                titulo: 'Cartão sem Armadilha',
                icone: '💳',
                perguntas: [
                    {
                        tipo: 'vf',
                        enunciado: 'O limite do cartão é uma renda extra.',
                        correta: 1,
                        explicacao: 'Limite é crédito: dinheiro emprestado que vai chegar na fatura. Não é salário a mais.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'O que acontece se você pagar só o mínimo da fatura?',
                        opcoes: ['Nada, está tudo certo.', 'O resto entra no rotativo, com juros muito altos.', 'O banco perdoa a diferença.'],
                        correta: 1,
                        explicacao: 'O rotativo tem alguns dos juros mais caros do Brasil. A dívida cresce rápido.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Qual hábito ajuda a não se enrolar com o cartão?',
                        opcoes: ['Só olhar a fatura quando ela fecha.', 'Acompanhar os gastos durante o mês.', 'Ter vários cartões para dividir.'],
                        correta: 1,
                        explicacao: 'Acompanhando no app ao longo do mês, a fatura não vira surpresa.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Muitas compras parceladas ao mesmo tempo podem apertar os próximos meses.',
                        correta: 0,
                        explicacao: 'Cada parcela pequena soma. Juntas, elas ocupam a renda dos meses seguintes.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Qual é a melhor forma de pagar a fatura?',
                        opcoes: ['Pagar o valor total até o vencimento.', 'Pagar o mínimo todo mês.', 'Pagar só quando lembrar.'],
                        correta: 0,
                        explicacao: 'Pagando o total em dia, o cartão é só um meio de pagamento, sem juros.'
                    }
                ]
            }
        ]
    },
    {
        id: 'carteira',
        titulo: 'Mestre da Carteira GSA',
        subtitulo: 'Crescer com equilíbrio',
        licoes: [
            {
                id: 'tesouro',
                titulo: 'Tesouro Direto na Prática',
                icone: '🏛️',
                perguntas: [
                    {
                        tipo: 'escolha',
                        enunciado: 'Ao investir no Tesouro Direto, você está:',
                        opcoes: ['Comprando parte de uma empresa.', 'Emprestando dinheiro para o governo.', 'Comprando um imóvel.'],
                        correta: 1,
                        explicacao: 'Os títulos públicos são empréstimos ao governo federal, que devolve com juros.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Qual título acompanha a Selic e costuma ser usado na reserva?',
                        opcoes: ['Tesouro Selic.', 'Tesouro IPCA+ 2045.', 'Tesouro Prefixado 2035.'],
                        correta: 0,
                        explicacao: 'O Tesouro Selic oscila pouco e pode ser vendido a qualquer dia útil.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'O Tesouro IPCA+ combina mais com:',
                        opcoes: ['Dinheiro para o mês que vem.', 'Objetivos de longo prazo, protegidos da inflação.', 'A reserva de emergência.'],
                        correta: 1,
                        explicacao: 'Ele paga a inflação mais uma taxa. Brilha no longo prazo, como aposentadoria.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Dá para começar no Tesouro Direto com pouco dinheiro.',
                        correta: 0,
                        explicacao: 'O mínimo costuma ficar perto de R$ 30, porque dá para comprar frações de um título.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Vender um título antes do vencimento pode render diferente do combinado.',
                        correta: 0,
                        explicacao: 'Antes do vencimento vale o preço de mercado do dia. A taxa combinada só é garantida no vencimento.'
                    }
                ]
            },
            {
                id: 'fiis',
                titulo: 'Dividendos com FIIs',
                icone: '🏢',
                perguntas: [
                    {
                        tipo: 'escolha',
                        enunciado: 'O que é um FII?',
                        opcoes: ['Um fundo que investe no mercado imobiliário.', 'Um tipo de cartão de crédito.', 'Um título do governo.'],
                        correta: 0,
                        explicacao: 'Com as cotas de um FII você investe em imóveis (ou títulos do setor) com pouco dinheiro.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Vacância alta num FII de imóveis significa:',
                        opcoes: ['Muitos imóveis vazios, o que pode reduzir a renda.', 'Que o fundo está lotado.', 'Que o rendimento está garantido.'],
                        correta: 0,
                        explicacao: 'Imóvel vazio não paga aluguel. Por isso a vacância afeta os rendimentos.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Os rendimentos dos FIIs são garantidos todo mês.',
                        correta: 1,
                        explicacao: 'Eles dependem dos aluguéis e dos resultados do fundo, e podem cair.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Um dividend yield alto, sozinho, prova que o fundo é bom?',
                        opcoes: ['Sim, é só olhar isso.', 'Não: também importam imóveis, gestão e riscos.', 'Sim, se pagou muito no último mês.'],
                        correta: 1,
                        explicacao: 'Um rendimento alto pode vir de algo pontual. Olhe o conjunto antes de decidir.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Ter cotas de vários FIIs ajuda a diversificar o risco.',
                        correta: 0,
                        explicacao: 'Se um fundo tiver problema, os outros seguram a carteira.'
                    }
                ]
            },
            {
                id: 'acoes',
                titulo: 'Escolhendo Ações',
                icone: '📈',
                perguntas: [
                    {
                        tipo: 'escolha',
                        enunciado: 'Comprar uma ação é:',
                        opcoes: ['Emprestar dinheiro para o banco.', 'Virar sócio de uma pequena parte da empresa.', 'Comprar um título do governo.'],
                        correta: 1,
                        explicacao: 'Cada ação é um pedacinho da empresa. Você participa dos resultados, bons ou ruins.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Uma ação de R$ 2 é sempre mais barata que uma de R$ 50.',
                        correta: 1,
                        explicacao: 'O preço sozinho não diz nada. Barato ou caro depende do que a empresa vale e entrega.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Antes de comprar uma ação, o mais importante é:',
                        opcoes: ['Seguir a dica de um amigo.', 'Entender o negócio e os riscos da empresa.', 'Olhar só se subiu ontem.'],
                        correta: 1,
                        explicacao: 'Saber como a empresa ganha dinheiro e quais riscos ela tem vem antes do preço.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'O que são dividendos?',
                        opcoes: ['Parte do lucro que a empresa divide com os acionistas.', 'Uma taxa da corretora.', 'Um imposto sobre ações.'],
                        correta: 0,
                        explicacao: 'Quando a empresa lucra, ela pode distribuir parte desse lucro a quem tem as ações.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'No curto prazo, o preço das ações pode subir e cair bastante.',
                        correta: 0,
                        explicacao: 'Por isso ações combinam com dinheiro de longo prazo, não com a reserva.'
                    }
                ]
            },
            {
                id: 'rebalanceamento',
                titulo: 'Rebalanceamento',
                icone: '⚖️',
                perguntas: [
                    {
                        tipo: 'escolha',
                        enunciado: 'Rebalancear a carteira é:',
                        opcoes: ['Vender tudo quando cai.', 'Voltar para os percentuais que você planejou.', 'Trocar de corretora.'],
                        correta: 1,
                        explicacao: 'Com o tempo uns ativos sobem mais que outros. Rebalancear devolve a carteira ao plano.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Você planejou 70% renda fixa e 30% ações. As ações subiram e viraram 45%. O que é rebalancear?',
                        opcoes: ['Comprar ainda mais ações.', 'Levar a carteira de volta para perto de 70/30.', 'Não fazer nada nunca.'],
                        correta: 1,
                        explicacao: 'Você ajusta (com novos aportes ou vendendo um pouco) para manter o risco que escolheu.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Diversificar é pôr todo o dinheiro no investimento que mais rendeu no ano passado.',
                        correta: 1,
                        explicacao: 'Diversificar é espalhar entre tipos diferentes. O que rendeu muito ontem não garante amanhã.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Um jeito simples de rebalancear sem vender nada:',
                        opcoes: ['Pôr os próximos aportes no que ficou abaixo da meta.', 'Parar de investir.', 'Sacar tudo e começar de novo.'],
                        correta: 0,
                        explicacao: 'Direcionando os aportes novos, a carteira volta ao equilíbrio sem gerar venda nem imposto.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Revisar a carteira numa frequência fixa, como a cada 6 meses, ajuda a manter a estratégia.',
                        correta: 0,
                        explicacao: 'Uma data fixa evita decisões no impulso e mantém o plano em dia.'
                    }
                ]
            }
        ]
    },
    {
        id: 'credito',
        titulo: 'Crédito a seu Favor',
        subtitulo: 'Usar sem cair em armadilha',
        licoes: [
            {
                id: 'pontos-cartao',
                titulo: 'Pontos e Milhas no Cartão',
                icone: '✈️',
                perguntas: [
                    {
                        tipo: 'escolha',
                        enunciado: 'Como se ganham pontos no cartão de crédito?',
                        opcoes: ['Deixando a fatura atrasar.', 'Comprando no cartão: cada compra soma pontos, milhas ou cashback.', 'Pedindo aumento de limite.'],
                        correta: 1,
                        explicacao: 'O programa devolve uma pequena parte do que você gasta. Ele só compensa nas compras que você já faria.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Vale a pena comprar mais só para juntar pontos.',
                        correta: 1,
                        explicacao: 'Os pontos devolvem uma fração pequena do gasto. Comprar sem precisar custa muito mais do que o ponto vale.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'O cartão cobra R$ 480 de anuidade e seus pontos do ano valem R$ 150. Esse cartão:',
                        opcoes: ['Compensa, porque dá pontos.', 'Não compensa: você paga mais do que recebe.', 'Compensa se a anuidade for parcelada.'],
                        correta: 1,
                        explicacao: 'A conta é benefício menos custo. Vale pedir isenção da anuidade ou trocar por um cartão sem anuidade.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Para o cartão trabalhar a seu favor, a regra número 1 é:',
                        opcoes: ['Pagar a fatura inteira até o vencimento.', 'Pagar só o mínimo e guardar o resto.', 'Usar todo o limite todo mês.'],
                        correta: 0,
                        explicacao: 'Os juros do rotativo apagam o ganho de anos de pontos. Sem fatura paga inteira, não existe vantagem.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Comprar logo depois do fechamento da fatura dá mais dias até o pagamento.',
                        correta: 0,
                        explicacao: 'A compra só entra na fatura seguinte. É o chamado melhor dia de compra, e ajuda a organizar o mês sem pagar juros.'
                    }
                ]
            },
            {
                id: 'dividas',
                titulo: 'Saindo das Dívidas',
                icone: '📉',
                perguntas: [
                    {
                        tipo: 'escolha',
                        enunciado: 'Qual é o primeiro passo para sair das dívidas?',
                        opcoes: ['Pegar um empréstimo novo sem olhar a taxa.', 'Listar todas: para quem deve, quanto, os juros e a parcela.', 'Parar de abrir as cobranças.'],
                        correta: 1,
                        explicacao: 'Sem a lista completa não dá para montar um plano. Colocar no papel mostra por onde começar.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Você tem três dívidas e sobrou um dinheiro. Qual quitar primeiro para pagar menos juros?',
                        opcoes: ['A de juros mais altos, como o rotativo do cartão.', 'A mais antiga.', 'A do banco mais conhecido.'],
                        correta: 0,
                        explicacao: 'Atacar primeiro a dívida mais cara faz o total parar de crescer. Enquanto isso, mantenha as parcelas das outras em dia.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Trocar uma dívida cara por outra com juros menores pode ser um bom caminho.',
                        correta: 0,
                        explicacao: 'Trocar o rotativo por um crédito mais barato reduz os juros. Só funciona se você parar de criar dívida nova.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Na hora de renegociar uma dívida, o melhor é:',
                        opcoes: ['Aceitar a primeira proposta sem ler.', 'Fechar uma parcela que cabe no orçamento e pedir o acordo por escrito.', 'Prometer um valor alto para agradar.'],
                        correta: 1,
                        explicacao: 'Acordo que não cabe no bolso vira dívida de novo. Guarde o acordo e os comprovantes.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Depois que a dívida é paga, o credor tem 5 dias úteis para pedir a retirada do seu nome dos cadastros de inadimplentes.',
                        correta: 0,
                        explicacao: 'É um direito do consumidor. Se o nome continuar negativado depois do prazo, reclame com a empresa e no Procon.'
                    }
                ]
            },
            {
                id: 'emprestimo',
                titulo: 'Empréstimo do Jeito Certo',
                icone: '🤝',
                perguntas: [
                    {
                        tipo: 'escolha',
                        enunciado: 'Para comparar dois empréstimos, o número que importa é:',
                        opcoes: ['O valor da parcela.', 'O CET, Custo Efetivo Total.', 'O nome do banco.'],
                        correta: 1,
                        explicacao: 'O CET soma juros, tarifas, seguros e impostos. A instituição é obrigada a informar antes de você assinar.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Uma parcela pequena sempre significa um empréstimo barato.',
                        correta: 1,
                        explicacao: 'Parcela baixa com prazo longo pode sair muito mais cara no total. Olhe quanto você paga somando tudo.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Pediram um depósito antes de liberar o seu empréstimo. Isso é:',
                        opcoes: ['Normal: é a taxa de cadastro.', 'Golpe: instituição autorizada não cobra antes de liberar o crédito.', 'Um desconto nos juros.'],
                        correta: 1,
                        explicacao: 'Cobrança adiantada é a marca do golpe do falso empréstimo. Confira no site do Banco Central se a instituição é autorizada.'
                    },
                    {
                        tipo: 'escolha',
                        enunciado: 'Qual destes usos de empréstimo faz mais sentido?',
                        opcoes: ['Trocar uma dívida cara por uma mais barata.', 'Pagar uma viagem decidida de última hora.', 'Investir para tentar ganhar mais do que os juros.'],
                        correta: 0,
                        explicacao: 'Empréstimo ajuda quando reduz um custo ou resolve uma necessidade real. Para consumo por impulso ou para investir, os juros costumam superar o ganho.'
                    },
                    {
                        tipo: 'vf',
                        enunciado: 'Quem quita um empréstimo antes do prazo tem direito a desconto proporcional nos juros.',
                        correta: 0,
                        explicacao: 'Esse direito está no Código de Defesa do Consumidor. Sobrou dinheiro? Antecipar parcelas reduz o custo total.'
                    }
                ]
            }
        ]
    }
];
