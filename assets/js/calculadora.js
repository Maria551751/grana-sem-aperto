let graficoCalculadoraGSA = null;
let ultimaSimulacaoGSA = null;

const moedaBR = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dataBR = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' });

function dataLocal(valor) {
  if (!valor) return null;
  const [ano, mes, dia] = valor.split('-').map(Number);
  return new Date(ano, mes - 1, dia, 12);
}

function valorDataInput(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function diferencaMeses(inicio, fim) {
  if (!inicio || !fim || fim <= inicio) return 0;
  let meses = (fim.getFullYear() - inicio.getFullYear()) * 12 + fim.getMonth() - inicio.getMonth();
  if (fim.getDate() < inicio.getDate()) meses -= 1;
  return Math.max(0, meses);
}

function projetarInvestimento(valorInicial, aporteMensal, taxaMensal, meses) {
  let saldo = valorInicial;
  let investido = valorInicial;
  const labels = ['Início'];
  const valoresInvestidos = [investido];
  const valoresTotais = [saldo];

  for (let mes = 1; mes <= meses; mes += 1) {
    saldo += saldo * taxaMensal;
    saldo += aporteMensal;
    investido += aporteMensal;

    if (mes <= 24 || mes % 3 === 0 || mes === meses) {
      labels.push(mes < 12 ? `${mes}m` : `${(mes / 12).toFixed(mes % 12 ? 1 : 0)}a`);
      valoresInvestidos.push(investido);
      valoresTotais.push(saldo);
    }
  }

  return { saldo, investido, juros: saldo - investido, labels, valoresInvestidos, valoresTotais };
}

function proximoDiaAviso(dia) {
  const hoje = new Date();
  let proxima = new Date(hoje.getFullYear(), hoje.getMonth(), dia, 12);
  if (proxima < hoje) proxima = new Date(hoje.getFullYear(), hoje.getMonth() + 1, dia, 12);
  return proxima;
}

function criarMensagemRendimento(dados) {
  const hoje = new Date();
  const rendimentoMensalEstimado = dados.saldoHoje * dados.taxaMensal;
  const tipoProvento = ['fii', 'acao'].includes(dados.tipo) ? 'provento' : 'rendimento';

  if (hoje.getDate() === dados.diaRendimento) {
    return {
      titulo: 'Parabéns por acompanhar seu planejamento!',
      texto: `Hoje é o dia configurado para o seu aviso. O ${tipoProvento} mensal estimado seria de aproximadamente ${moedaBR.format(rendimentoMensalEstimado)}. Isso é uma simulação, não a confirmação de um pagamento real.`
    };
  }

  const proxima = proximoDiaAviso(dados.diaRendimento);
  return {
    titulo: 'Seu próximo lembrete está planejado',
    texto: `No dia ${dataBR.format(proxima)}, mostraremos uma nova estimativa. Mantendo o cenário atual, o rendimento mensal aproximado seria ${moedaBR.format(rendimentoMensalEstimado)}.`
  };
}

function renderizarGraficoGSA(dados) {
  const canvas = document.getElementById('graficoEvolucao');
  if (!canvas || typeof Chart === 'undefined') return;
  if (graficoCalculadoraGSA) graficoCalculadoraGSA.destroy();

  graficoCalculadoraGSA = new Chart(canvas, {
    type: 'line',
    data: {
      labels: dados.labels,
      datasets: [
        { label: 'Montante projetado', data: dados.valoresTotais, borderColor: '#34d399', backgroundColor: 'rgba(16,185,129,.12)', fill: true, tension: .38, pointRadius: 0, borderWidth: 2.5 },
        { label: 'Total aplicado', data: dados.valoresInvestidos, borderColor: '#8b9690', borderDash: [5, 5], pointRadius: 0, borderWidth: 1.5 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: { legend: { labels: { color: '#8f9a94', boxWidth: 12, usePointStyle: true } }, tooltip: { callbacks: { label: (item) => `${item.dataset.label}: ${moedaBR.format(item.raw)}` } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#6f7a74', maxTicksLimit: 8 } },
        y: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#6f7a74', callback: (valor) => moedaBR.format(valor).replace(',00', '') } }
      }
    }
  });
}

function exibirErro(mensagem) {
  const erro = document.getElementById('erroSimulador');
  if (!erro) return;
  erro.textContent = mensagem;
  erro.hidden = !mensagem;
}

function calcularSimulacao(evento) {
  evento?.preventDefault();

  const nome = document.getElementById('nomeInvestimento').value.trim() || 'Meu planejamento';
  const tipo = document.getElementById('tipoInvestimento').value;
  const valorInicial = Number(document.getElementById('valorInicial').value);
  const aporteMensal = Number(document.getElementById('valorMensal').value) || 0;
  const taxaAnual = Number(document.getElementById('taxaAnual').value);
  const inicio = dataLocal(document.getElementById('dataInvestimento').value);
  const fim = dataLocal(document.getElementById('dataFinal').value);
  const diaRendimento = Math.min(28, Math.max(1, Number(document.getElementById('diaRendimento').value) || 10));
  const hoje = new Date();

  if (!(valorInicial > 0)) return exibirErro('Informe um valor inicial maior que zero.');
  if (!(taxaAnual >= 0 && taxaAnual <= 100)) return exibirErro('Informe uma taxa anual entre 0% e 100%.');
  if (!inicio || !fim || fim <= inicio) return exibirErro('A data final precisa ser posterior à data do investimento.');

  const totalMeses = diferencaMeses(inicio, fim);
  if (totalMeses < 1 || totalMeses > 600) return exibirErro('Escolha um prazo entre 1 mês e 50 anos.');
  exibirErro('');

  const taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;
  const mesesAteHoje = inicio < hoje ? Math.min(totalMeses, diferencaMeses(inicio, hoje)) : 0;
  const projecao = projetarInvestimento(valorInicial, aporteMensal, taxaMensal, totalMeses);
  const projecaoHoje = projetarInvestimento(valorInicial, aporteMensal, taxaMensal, mesesAteHoje);
  const rendimentoAteHoje = Math.max(0, projecaoHoje.juros);
  const anos = totalMeses / 12;

  ultimaSimulacaoGSA = {
    nome, tipo, valorInicial, aporteMensal, taxaAnual, taxaMensal, inicio: valorDataInput(inicio), fim: valorDataInput(fim), diaRendimento,
    saldoHoje: projecaoHoje.saldo,
    montante: projecao.saldo,
    totalInvestido: projecao.investido,
    juros: projecao.juros,
    ...projecao
  };

  document.getElementById('resultadoVazio').hidden = true;
  document.getElementById('resultadoConteudo').hidden = false;
  document.getElementById('resultadoNome').textContent = nome;
  document.getElementById('resultadoPrazo').textContent = `${totalMeses} meses`;
  document.getElementById('montanteFinal').textContent = moedaBR.format(projecao.saldo);
  document.getElementById('totalInvestido').textContent = moedaBR.format(projecao.investido);
  document.getElementById('totalJuros').textContent = moedaBR.format(projecao.juros);
  document.getElementById('rendimentoAteHoje').textContent = moedaBR.format(rendimentoAteHoje);
  document.getElementById('crescimentoPercentual').textContent = `${((projecao.saldo / projecao.investido - 1) * 100).toFixed(1).replace('.', ',')}% acima do total aplicado em ${anos.toFixed(1).replace('.', ',')} anos`;

  const mensagem = criarMensagemRendimento(ultimaSimulacaoGSA);
  document.getElementById('avisoTitulo').textContent = mensagem.titulo;
  document.getElementById('avisoTexto').textContent = mensagem.texto;
  renderizarGraficoGSA(projecao);

  if (window.innerWidth < 900) document.getElementById('resultadoGSA').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function usarTaxaDoCard(card) {
  const elemento = document.getElementById(card.dataset.usarTaxa);
  const campoTaxa = document.getElementById('taxaAnual');
  if (!elemento || !campoTaxa) return;
  const valor = Number(elemento.textContent.replace('%', '').replace('.', '').replace(',', '.').trim());
  if (!Number.isFinite(valor)) return;
  campoTaxa.value = valor.toFixed(2);
  campoTaxa.focus();
  document.querySelectorAll('.taxa-card').forEach((item) => item.classList.toggle('selecionada', item === card));
}

function exibirAcompanhamento(dados) {
  const secao = document.getElementById('acompanhamento');
  if (!secao || !dados) return;
  secao.hidden = false;
  document.getElementById('acompanhamentoNome').textContent = dados.nome;
  document.getElementById('acompanhamentoAviso').textContent = dataBR.format(proximoDiaAviso(dados.diaRendimento));
  document.getElementById('acompanhamentoMontante').textContent = moedaBR.format(dados.montante);
}

function salvarAcompanhamento() {
  const confirmou = document.getElementById('confirmarEstimativa').checked;
  if (!ultimaSimulacaoGSA) return;
  if (!confirmou) {
    document.getElementById('confirmarEstimativa').focus();
    document.getElementById('avisoTitulo').textContent = 'Confirme que entendeu a estimativa';
    document.getElementById('avisoTexto').textContent = 'Marque a opção abaixo do gráfico antes de salvar este acompanhamento.';
    return;
  }
  localStorage.setItem('gsaAcompanhamento', JSON.stringify(ultimaSimulacaoGSA));
  exibirAcompanhamento(ultimaSimulacaoGSA);
  document.getElementById('btnSalvarAcompanhamento').textContent = 'Acompanhamento salvo ✓';
}

function excluirAcompanhamento() {
  localStorage.removeItem('gsaAcompanhamento');
  document.getElementById('acompanhamento').hidden = true;
}

function prepararDatas() {
  const hoje = new Date();
  const final = new Date(hoje.getFullYear() + 5, hoje.getMonth(), hoje.getDate(), 12);
  document.getElementById('dataInvestimento').value = valorDataInput(hoje);
  document.getElementById('dataFinal').value = valorDataInput(final);
}

function iniciarLuzesSecoesClaras() {
  const cursorPreciso = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!cursorPreciso || movimentoReduzido) return;

  document.querySelectorAll('.taxas-secao, .como-usar-secao').forEach((secao) => {
    let quadroLuz = null;
    let posicaoX = 0;
    let posicaoY = 0;

    secao.addEventListener('pointerenter', () => secao.classList.add('luz-cursor-ativa'));
    secao.addEventListener('pointerleave', () => secao.classList.remove('luz-cursor-ativa'));
    secao.addEventListener('pointermove', (evento) => {
      const limites = secao.getBoundingClientRect();
      posicaoX = evento.clientX - limites.left;
      posicaoY = evento.clientY - limites.top;
      if (quadroLuz) return;

      quadroLuz = requestAnimationFrame(() => {
        secao.style.setProperty('--luz-x', `${posicaoX}px`);
        secao.style.setProperty('--luz-y', `${posicaoY}px`);
        quadroLuz = null;
      });
    }, { passive: true });
  });
}

function limparSimulador() {
  const formulario = document.getElementById('formSimulador');
  if (!formulario) return;

  formulario.reset();
  prepararDatas();
  exibirErro('');
  ultimaSimulacaoGSA = null;

  document.getElementById('resultadoVazio').hidden = false;
  document.getElementById('resultadoConteudo').hidden = true;
  document.getElementById('confirmarEstimativa').checked = false;
  document.getElementById('btnSalvarAcompanhamento').textContent = 'Salvar acompanhamento';
  document.querySelectorAll('.taxa-card.selecionada').forEach((card) => card.classList.remove('selecionada'));

  if (graficoCalculadoraGSA) {
    graficoCalculadoraGSA.destroy();
    graficoCalculadoraGSA = null;
  }

  document.getElementById('nomeInvestimento').focus();
}

document.addEventListener('DOMContentLoaded', () => {
  prepararDatas();
  iniciarLuzesSecoesClaras();
  document.getElementById('formSimulador')?.addEventListener('submit', calcularSimulacao);
  document.getElementById('btnLimparSimulador')?.addEventListener('click', limparSimulador);
  document.querySelectorAll('[data-usar-taxa]').forEach((card) => card.addEventListener('click', () => usarTaxaDoCard(card)));
  document.getElementById('btnSalvarAcompanhamento')?.addEventListener('click', salvarAcompanhamento);
  document.getElementById('btnExcluirAcompanhamento')?.addEventListener('click', excluirAcompanhamento);

  try {
    const salvo = JSON.parse(localStorage.getItem('gsaAcompanhamento'));
    if (salvo?.nome && Number.isFinite(salvo.montante)) exibirAcompanhamento(salvo);
  } catch (erro) {
    localStorage.removeItem('gsaAcompanhamento');
  }
});

window.calcularGSA = () => calcularSimulacao();
