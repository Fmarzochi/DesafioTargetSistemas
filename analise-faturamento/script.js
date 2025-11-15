// Os dados dos arquivos JSON e XML (hardcoded para simular a leitura)
const dataJson = [
	{ "dia": 1, "valor": 22174.1664 }, { "dia": 2, "valor": 24537.6698 },
	{ "dia": 3, "valor": 26139.6134 }, { "dia": 4, "valor": 0.0 },
	{ "dia": 5, "valor": 0.0 }, { "dia": 6, "valor": 26742.6612 },
	{ "dia": 7, "valor": 0.0 }, { "dia": 8, "valor": 42889.2258 },
	{ "dia": 9, "valor": 46251.174 }, { "dia": 10, "valor": 11191.4722 },
	{ "dia": 11, "valor": 0.0 }, { "dia": 12, "valor": 0.0 },
	{ "dia": 13, "valor": 3847.4823 }, { "dia": 14, "valor": 373.7838 },
	{ "dia": 15, "valor": 2659.7563 }, { "dia": 16, "valor": 48924.2448 },
	{ "dia": 17, "valor": 18419.2614 }, { "dia": 18, "valor": 0.0 },
	{ "dia": 19, "valor": 0.0 }, { "dia": 20, "valor": 35240.1826 },
	{ "dia": 21, "valor": 43829.1667 }, { "dia": 22, "valor": 18235.6852 },
	{ "dia": 23, "valor": 4355.0662 }, { "dia": 24, "valor": 13327.1025 },
	{ "dia": 25, "valor": 0.0 }, { "dia": 26, "valor": 0.0 },
	{ "dia": 27, "valor": 25681.8318 }, { "dia": 28, "valor": 1718.1221 },
	{ "dia": 29, "valor": 13220.495 }, { "dia": 30, "valor": 8414.61 }
];

const dataXml = [
	{ "dia": 1, "valor": 31490.7866 }, { "dia": 2, "valor": 37277.9400 },
	{ "dia": 3, "valor": 37708.4303 }, { "dia": 4, "valor": 0.0000 },
	{ "dia": 5, "valor": 0.0000 }, { "dia": 6, "valor": 17934.2269 },
	{ "dia": 7, "valor": 0.0000 }, { "dia": 8, "valor": 6965.1262 },
	{ "dia": 9, "valor": 24390.9374 }, { "dia": 10, "valor": 14279.6481 },
	{ "dia": 11, "valor": 0.0000 }, { "dia": 12, "valor": 0.0000 },
	{ "dia": 13, "valor": 39807.6622 }, { "dia": 14, "valor": 27261.6304 },
	{ "dia": 15, "valor": 39775.6434 }, { "dia": 16, "valor": 29797.6232 },
	{ "dia": 17, "valor": 17216.5017 }, { "dia": 18, "valor": 0.0000 },
	{ "dia": 19, "valor": 0.0000 }, { "dia": 20, "valor": 12974.2000 },
	{ "dia": 21, "valor": 28490.9861 }, { "dia": 22, "valor": 8748.0937 },
	{ "dia": 23, "valor": 8889.0023 }, { "dia": 24, "valor": 17767.5583 },
	{ "dia": 25, "valor": 0.0000 }, { "dia": 26, "valor": 0.0000 },
	{ "dia": 27, "valor": 3071.3283 }, { "dia": 28, "valor": 48275.2994 },
	{ "dia": 29, "valor": 10299.6761 }, { "dia": 30, "valor": 39874.1073 }
];

/**
 * Função para formatar números como moeda brasileira (R$).
 * @param {number} num - O número a ser formatado.
 * @returns {string} - O número formatado.
 */
function formatCurrency(num) {
    if (isNaN(num) || num === null) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
}

/**
 * Função principal para analisar um conjunto de dados.
 * Inclui tratamento de erro robusto.
 */
function analyzeData(data, sourceName) {
    let total = 0;
    let max = { valor: -Infinity, dia: 0 };
    let minPositive = { valor: Infinity, dia: 0 };
    let nonZeroCount = 0;

    if (!Array.isArray(data) || data.length === 0) {
        console.error(`[ERRO] Dados inválidos ou vazios para a fonte: ${sourceName}`);
        return null;
    }

    data.forEach(row => {
        // Converte o valor para float de forma segura
        const valor = parseFloat(row.valor) || 0; 
        const dia = row.dia;

        total += valor;

        if (valor > max.valor) {
            max = { valor, dia };
        }

        if (valor > 0) {
            nonZeroCount++;
            if (valor < minPositive.valor) {
                minPositive = { valor, dia };
            }
        }
    });

    const average = nonZeroCount > 0 ? total / nonZeroCount : 0;
    const zeroDays = data.length - nonZeroCount;

    return {
        sourceName,
        total,
        max,
        minPositive,
        average,
        zeroDays
    };
}

/**
 * Renderiza as estatísticas calculadas no HTML.
 */
function renderStats(stats) {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) {
        console.error('[ERRO] Elemento #stats-container não encontrado no HTML.');
        return;
    }
    
    // Se a análise falhou, não renderiza
    if (!stats) return; 

    const html = `
        <div class="stat-card">
            <h3>Fonte de Dados: ${stats.sourceName}</h3>
            <p>Total Mensal: <span class="highlight">${formatCurrency(stats.total)}</span></p>
            <p>Média Diária (s/ zero): <span class="highlight">${formatCurrency(stats.average)}</span></p>
            <p>Maior Valor: <span class="highlight">${formatCurrency(stats.max.valor)} (Dia ${stats.max.dia})</span></p>
            <p>Menor Positivo: <span class="highlight">${formatCurrency(stats.minPositive.valor)} (Dia ${stats.minPositive.dia})</span></p>
            <p>Dias Zerados: <span class="highlight">${stats.zeroDays} dias</span></p>
        </div>
    `;
    statsContainer.innerHTML += html;
}

/**
 * Cria o gráfico de barras comparativo usando Chart.js.
 * Adiciona tratamento de erro para falhas de carregamento da biblioteca.
 */
function createChart(data1, data2) {
    try {
        // Verifica se a biblioteca Chart.js foi carregada
        if (typeof Chart === 'undefined') {
            const chartArea = document.querySelector('.chart-area');
            if(chartArea) {
                 chartArea.innerHTML = '<h2>Comparação Diária (R$)</h2><p style="color: red; font-weight: bold;">ERRO: A biblioteca Chart.js não foi carregada. Verifique sua conexão com a internet ou o caminho do script no index.html.</p>';
            }
            return;
        }

        const ctx = document.getElementById('faturamentoChart');
        if (!ctx) {
            console.error('[ERRO] Elemento Canvas #faturamentoChart não encontrado.');
            return;
        }

        const labels = data1.map(d => `Dia ${d.dia}`);
        const values1 = data1.map(d => parseFloat(d.valor));
        const values2 = data2.map(d => parseFloat(d.valor));

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'dados.json',
                        data: values1,
                        backgroundColor: 'rgba(0, 123, 255, 0.7)',
                        borderColor: 'rgba(0, 123, 255, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'dados (2).xml',
                        data: values2,
                        backgroundColor: 'rgba(40, 167, 69, 0.7)',
                        borderColor: 'rgba(40, 167, 69, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, // Garante que o gráfico se ajuste ao container
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Dia do Mês'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valor (R$)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += formatCurrency(context.parsed.y);
                                return label;
                            }
                        }
                    }
                }
            }
        });
    } catch (e) {
        console.error('[ERRO CRÍTICO] Falha ao criar o gráfico:', e);
        // Exibe uma mensagem de erro na área do gráfico se algo mais falhar
        const chartArea = document.querySelector('.chart-area');
        if(chartArea) {
             chartArea.innerHTML = '<h2>Comparação Diária (R$)</h2><p style="color: red; font-weight: bold;">ERRO CRÍTICO: Não foi possível renderizar o gráfico. Consulte o console para detalhes.</p>';
        }
    }
}

// Execução principal da aplicação
document.addEventListener('DOMContentLoaded', () => {
    // 1. Processamento e Análise
    const statsJson = analyzeData(dataJson, 'Dados JSON');
    const statsXml = analyzeData(dataXml, 'Dados XML');

    // 2. Renderização das Estatísticas
    renderStats(statsJson);
    renderStats(statsXml);

    // 3. Criação do Gráfico
    createChart(dataJson, dataXml);
});