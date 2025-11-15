# 🚀 Análise Comparativa de Faturamento Diário

Este projeto é uma aplicação web **front-end** interativa desenvolvida usando **HTML, CSS e JavaScript** para processar, analisar e visualizar dados de faturamento diário provenientes de duas fontes distintas (simulando arquivos JSON e XML).

O objetivo principal é oferecer uma ferramenta clara e visualmente dinâmica para a comparação de desempenho em um período de 30 dias.

---

### 📊 Funcionalidades e Análise Implementadas

O programa realiza as seguintes operações e cálculos estatísticos:

* **Leitura de Dados Simulado:** O JavaScript carrega e normaliza dados de duas fontes hardcoded que representam os formatos **JSON** e **XML**.
* **Processamento Robusto:** A lógica inclui tratamento de erros para garantir que os cálculos não falhem, mesmo com dados faltantes.
* **Cálculo de Métricas Chave (para cada fonte):**
    * **Total Mensal:** Soma de todos os valores.
    * **Maior Valor e Dia:** Identificação do dia de maior faturamento.
    * **Menor Valor Positivo e Dia:** Identificação do menor faturamento, ignorando dias com valor R$ 0,00.
    * **Média Diária:** Calculada apenas com base nos dias que tiveram faturamento (valor > R$ 0,00).
    * **Contagem de Dias Zerados:** Identificação dos dias sem movimentação.

---

### 💻 Tecnologias e Estilo

| Tecnologia | Finalidade Principal |
| :--- | :--- |
| **HTML5** | Estrutura semântica e inclusão de metatags/favicon. |
| **CSS3** | Estilização responsiva, layout **Mobile First** e aplicação de animações. |
| **JavaScript (ES6+)** | Lógica de processamento de dados e cálculo de estatísticas. |
| **Chart.js (CDN)** | Biblioteca para a renderização do gráfico de barras comparativo. |

#### ✨ Melhorias de Experiência do Usuário (UX)

* **Design Responsivo:** O layout se adapta automaticamente a telas de qualquer tamanho (celular, tablet e monitor).
* **Animações CSS:** Uso de *keyframes* (`slideIn`, `fadeIn`) para transições suaves, um efeito cascata no carregamento dos cartões de estatísticas e elevação ao passar o mouse.
* **Favicon:** Adição de um ícone personalizado na aba do navegador.

---

### ⚙️ Como Executar o Projeto

Este projeto é puramente front-end e pode ser executado diretamente em qualquer navegador moderno.

1.  Clone ou baixe os arquivos (`index.html`, `style.css`, `script.js`, etc.) em uma pasta local.
2.  **Abra o arquivo `index.html`** no seu navegador de preferência.
3.  É necessário estar **conectado à internet** para que a biblioteca Chart.js possa ser carregada via CDN e o gráfico seja renderizado.

---

###### Desenvolvido por Felipe Marzochi.
