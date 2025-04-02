document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();

    const nomeContratante = document.getElementById('nomeContratante').value;
    const cpfContratante = document.getElementById('cpfContratante').value;
    const enderecoContratante = document.getElementById('enderecoContratante').value;
    const dataEvento = new Date(document.getElementById('dataEvento').value).toLocaleDateString('pt-BR');
    const localCerimonia = document.getElementById('localCerimonia').value;
    const localRecepcao = document.getElementById('localRecepcao').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaInicio2 = document.getElementById('horaInicio2').value;
    const horaFim = document.getElementById('horaFim').value;
    const pacote = document.getElementById('pacote').value;
    const valorTotal = parseFloat(document.getElementById('valorTotal').value);
    const entrada = parseFloat(document.getElementById('entrada').value);
    const formaPagamento = document.getElementById('formaPagamento').value;
    const dataAssinatura = new Date().toLocaleDateString('pt-BR');

    // Função para calcular a duração em horas (sem decimais)
    const calcularDuracao = (inicio, fim) => {
        const [inicioHoras, inicioMinutos] = inicio.split(':').map(Number);
        const [fimHoras, fimMinutos] = fim.split(':').map(Number);

        const inicioEmMinutos = inicioHoras * 60 + inicioMinutos;
        let fimEmMinutos = fimHoras * 60 + fimMinutos;

        if (fimEmMinutos < inicioEmMinutos) {
            fimEmMinutos += 24 * 60;
        }

        const duracaoEmMinutos = fimEmMinutos - inicioEmMinutos;
        return Math.round(duracaoEmMinutos / 60);
    };

    const duracao = calcularDuracao(horaInicio, horaFim);

    // Função para formatar valores no padrão brasileiro
    const formatarValor = (valor) => {
        return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Função para converter número em extenso (simplificada)
    const numeroPorExtenso = (valor) => {
        const unidades = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
        const dezenas = ['dez', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
        const centenas = ['cem', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
        const milhares = 'mil';

        let valorInteiro = Math.floor(valor);
        let centavos = Math.round((valor - valorInteiro) * 100);

        let extenso = '';
        if (valorInteiro >= 1000) {
            const milhar = Math.floor(valorInteiro / 1000);
            extenso += `${unidades[milhar]} ${milhares}`;
            valorInteiro %= 1000;
            if (valorInteiro > 0) extenso += ' e ';
        }
        if (valorInteiro >= 100) {
            const centena = Math.floor(valorInteiro / 100);
            extenso += centenas[centena - 1];
            valorInteiro %= 100;
            if (valorInteiro > 0) extenso += ' e ';
        }
        if (valorInteiro >= 20) {
            const dezena = Math.floor(valorInteiro / 10);
            extenso += dezenas[dezena - 1];
            valorInteiro %= 10;
            if (valorInteiro > 0) extenso += ' e ';
        }
        if (valorInteiro > 0) {
            extenso += unidades[valorInteiro];
        }

        if (centavos > 0) {
            extenso += ` e ${centavos} centavos`;
        }

        return extenso;
    };

    // Mapear forma de pagamento
    const formasPagamento = {
        'pix': 'PIX',
        'cartao_credito': 'Cartão de Crédito',
        'cartao_debito': 'Cartão de Débito',
        'boleto': 'Boleto Bancário',
        'dinheiro': 'Dinheiro'
    };
    const formaPagamentoTexto = formasPagamento[formaPagamento] || 'PIX';

    // Calcular valores
    const percentualEntrada = ((entrada / valorTotal) * 100).toFixed(2);
    const diferenca = valorTotal - entrada;
    const valorRetido = valorTotal * 0.30; // 30% do valor total

    // Cláusula 4 condicional
    let clausulaPagamento = '';
    if (formaPagamento === 'cartao_credito') {
        clausulaPagamento = `
            <p class="item">4.1. O valor total é de <strong>${formatarValor(valorTotal)}</strong> (${numeroPorExtenso(valorTotal)} reais), pago via <strong>Cartão de Crédito</strong>:</p>
            <p class="subitem">a) Pago integralmente no ato da assinatura, podendo ser parcelado em até <strong>12 vezes</strong>, com eventuais encargos de parcelamento sendo de responsabilidade do <strong>CONTRATANTE</strong>;</p>
        `;
    } else {
        const detalhesPagamento = ', chave CNPJ: <strong>50.475.036/0001-08</strong>';
        clausulaPagamento = `
            <p class="item">4.1. O valor total é de <strong>${formatarValor(valorTotal)}</strong> (${numeroPorExtenso(valorTotal)} reais), pago via <strong>${formaPagamentoTexto}</strong>${detalhesPagamento}:</p>
            <p class="subitem">a) ${percentualEntrada}% (${formatarValor(entrada)}) no ato da assinatura;</p>
            ${entrada < valorTotal ? `<p class="subitem">b) A diferença de ${formatarValor(diferenca)} deverá ser paga até <strong>7 dias</strong> antes do evento;</p>` : ''}
        `;
    }

    // Cláusula 4.3 (multas e juros) condicional
    const clausulaMultas = formaPagamento !== 'cartao_credito' ? `
        <p class="item">4.3. Atrasos incorrerão em multa de <strong>2%</strong>, juros de <strong>1%</strong> ao mês e correção pelo IPCA;</p>
    ` : '';

    const contratoHTML = `
        <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS PARA COBERTURA DE EVENTO</h1>
        <p>Pelo presente instrumento particular, de um lado:</p>
        <p><strong>CONTRATADO:</strong> AMIE STORIES, pessoa jurídica de direito privado, inscrita no <strong>CNPJ sob o nº 50.475.036/0001-08</strong>, representada por <strong>Amanda Firmiano de Oliveira Costa</strong>, <strong>CPF nº 072.278.433-35</strong>, com sede na Rua André Dall’Olio, 530, apt 1402, Papicu, Fortaleza/CE, CEP 60.175-195, e <strong>Emilly Oliveira da Silva Sales</strong>, <strong>CPF nº 063.751.993-01</strong>, com endereço na Avenida Santos Dumont, 7785, apt 506, Manuel Dias Branco, Fortaleza/CE, CEP 60.182-453;</p>
        <p><strong>CONTRATANTE:</strong> ${nomeContratante}, pessoa física de direito privado, inscrita no <strong>CPF sob o nº ${cpfContratante}</strong>, com endereço na <strong>${enderecoContratante}</strong>;</p>
        <p>CONSIDERANDO que o <strong>CONTRATANTE</strong> deseja contratar o <strong>CONTRATADO</strong> para realizar a cobertura de evento;</p>
        <p>CONSIDERANDO que quaisquer serviços adicionais fora do acordado serão objeto de nova negociação;</p>
        <p>As partes celebram o presente Contrato de Prestação de Serviços para Cobertura de Evento, regido pelas seguintes cláusulas:</p>
        <p class="clausula">CLÁUSULA 1ª – OBJETO</p>
        <p class="item">1.1. O objeto deste contrato é a prestação de serviços de cobertura do evento do <strong>CONTRATANTE</strong>, a realizar-se em <strong>${dataEvento}</strong>, em <strong>${localCerimonia}</strong> às <strong>${horaInicio}</strong> (cerimônia) e <strong>${localRecepcao}</strong> às <strong>${horaInicio2}</strong> (recepção), o evento será das <strong>${horaInicio}</strong> às <strong>${horaFim}</strong>, compreendendo:</p>
        <p class="subitem">a) Filmagem completa da cerimônia;</p>
        <p class="subitem">b) Filmagem da recepção (decoração, sessão de fotos, convidados, hora dos parabéns);</p>
        <p class="subitem">c) Edição de stories e um reels para Instagram (resumo do evento);</p>
        <p class="subitem">d) Pacote "<strong>${pacote}</strong>" com <strong>${duracao} horas</strong> de cobertura;</p>
        <p class="clausula">CLÁUSULA 2ª - OBRIGAÇÕES DO CONTRATADO</p>
        <p class="item">2.1. Comparecer ao local com <strong>30 minutos</strong> de antecedência;</p>
        <p class="item">2.2. Realizar a cobertura do evento limitada ao tempo de duração do pacote contratado (<strong>${duracao} horas</strong>);</p>
        <p class="item">2.3. Fornecer equipamentos e materiais necessários;</p>
        <p class="item">2.4. Garantir qualidade e resolução das entregas;</p>
        <p class="item">2.5. Editar e entregar o material em até <strong>5 dias úteis</strong> após o evento;</p>
        <p class="item">2.6. Prestar os serviços com ética, dedicação e respeito aos prazos;</p>
        <p class="clausula">CLÁUSULA 3ª - OBRIGAÇÕES DO CONTRATANTE</p>
        <p class="item">3.1. Fornecer informações necessárias ao <strong>CONTRATADO</strong>;</p>
        <p class="item">3.2. Conferir os materiais antes da finalização, isentando o <strong>CONTRATADO</strong> após aprovação;</p>
        <p class="item">3.3. Respeitar prazos de avaliação para evitar atrasos;</p>
        <p class="item">3.4. Efetuar o pagamento conforme acordado;</p>
        <p class="item">3.5. Zelar pela imagem do <strong>CONTRATADO</strong>;</p>
        <p class="item">3.6. Informar alterações no evento com antecedência mínima de <strong>3 dias</strong>, sob pena de custos adicionais;</p>
        <p class="clausula">CLÁUSULA 4ª - PAGAMENTO</p>
        ${clausulaPagamento}
        <p class="item">4.2. Por se tratar de Microempreendedor Individual (MEI) prestando serviço a pessoa física, o <strong>CONTRATADO</strong> não emitirá nota fiscal, conforme dispensa prevista no art. 18-A, § 4º, da Lei Complementar nº 123/2006, fornecendo recibo simples com os dados de pagamento;</p>
        ${clausulaMultas}
        <p class="clausula">CLÁUSULA 5ª – VIGÊNCIA</p>
        <p class="item">5.1. Este contrato vigora da data de assinatura até <strong>5 dias úteis</strong> após a data do evento (prazo de entrega), salvo prorrogação por Termo Aditivo;</p>
        <p class="clausula">CLÁUSULA 6ª – RESCISÃO</p>
        <p class="item">6.1. Caso uma das partes deseje rescindir este contrato antes do evento, deverá notificar a outra por escrito com antecedência mínima de <strong>30 dias</strong>;</p>
        <p class="item">6.2. Em caso de rescisão pelo <strong>CONTRATANTE</strong>, o <strong>CONTRATADO</strong> reterá <strong>30%</strong> do valor total (<strong>${formatarValor(valorRetido)}</strong> - ${numeroPorExtenso(valorRetido)} reais), a título de compensação pela reserva da data de <strong>${dataEvento}</strong>, que impede a contratação de outros serviços para o mesmo dia, configurando perda de oportunidade. O <strong>CONTRATADO</strong> restituirá eventual saldo remanescente no prazo de <strong>5 dias úteis</strong>;</p>
        <p class="item">6.3. Caso a rescisão ocorra por iniciativa do <strong>CONTRATADO</strong>, este restituirá integralmente os valores pagos pelo <strong>CONTRATANTE</strong> no prazo de <strong>5 dias úteis</strong>, acrescidos de correção pelo IPCA, salvo se a rescisão decorrer de descumprimento contratual do <strong>CONTRATANTE</strong>;</p>
        <p class="item">6.4. Em situações de força maior (ex.: catástrofes naturais, conforme art. 393 do Código Civil), que impossibilitem a realização do evento ou do serviço, ambas as partes ficam isentas de responsabilidade, e o <strong>CONTRATADO</strong> devolverá os valores pagos, deduzidos apenas de custos já incorridos e comprovados (ex.: aquisição de materiais específicos);</p>
        <p class="clausula">CLÁUSULA 7ª - INEXISTÊNCIA DE VÍNCULO</p>
        <p class="item">7.1. Não há vínculo empregatício entre as partes;</p>
        <p class="clausula">CLÁUSULA 8ª – AJUSTES</p>
        <p class="item">8.1. Ajustes ou regravações solicitados pelo <strong>CONTRATANTE</strong> terão custos adicionais, a serem negociados entre as partes e pagos via <strong>${formaPagamentoTexto}</strong>;</p>
        <p class="clausula">CLÁUSULA 9ª - CONFIDENCIALIDADE</p>
        <p class="item">9.1. O <strong>CONTRATADO</strong> manterá sigilo sobre informações do evento, cumprindo a Lei nº 13.709/2018 (LGPD);</p>
        <p class="clausula">CLÁUSULA 10ª – ATENDIMENTO PRESENCIAL</p>
        <p class="item">10.1. Fora de <strong>Fortaleza/CE</strong>, o <strong>CONTRATANTE</strong> arcará com custos de deslocamento e hospedagem;</p>
        <p class="clausula">CLÁUSULA 11ª - DISPOSIÇÕES GERAIS</p>
        <p class="item">11.1. Este contrato prevalece sobre acordos anteriores e só pode ser alterado por aditivo;</p>
        <p class="clausula">CLÁUSULA 12ª – FORO</p>
        <p class="item">12.1. Fica eleita a Comarca de <strong>Fortaleza/CE</strong> para dirimir controvérsias;</p>
        <p>E, por estarem assim acordadas, as partes assinam este contrato por meio de assinaturas digitais, com validade jurídica conforme a Medida Provisória nº 2.200-2/2001;</p>
        <br><br>
        <p><strong>Fortaleza</strong>, <strong>${dataAssinatura}</strong>;</p>
        <br><br>
        <p class="linha-assinatura"></p>
        <p><strong>CONTRATADO:</strong> AMIE STORIES</p>
        <p class="centralizado">Representante Legal: Amanda Firmiano de Oliveira Costa</p>
        <br><br>
        <p class="linha-assinatura"></p>
        <p><strong>CONTRATANTE:</strong> ${nomeContratante}</p>
    `;

    document.getElementById('form-container').style.display = 'none';
    document.getElementById('contrato').innerHTML = contratoHTML;
    document.getElementById('contrato').style.display = 'block';
    document.getElementById('print-button').style.display = 'block';
});