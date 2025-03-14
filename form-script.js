document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos do formulário
    const form = document.getElementById('inscricao-form');
    const nomeInput = document.getElementById('nome');
    const dataNascimentoInput = document.getElementById('data-nascimento');
    const telefoneInput = document.getElementById('telefone');
    const regiaoSelect = document.getElementById('regiao');
    const bairroInput = document.getElementById('bairro');
    const comprovanteInput = document.getElementById('comprovante');
    const identidadeInput = document.getElementById('identidade');
    
    // Referências aos elementos de exibição do nome do arquivo
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    // Função para aplicar máscara de data DD/MM/AAAA
    function mascaraData(input) {
        let v = input.value;
        
        // Remove tudo que não é dígito
        v = v.replace(/\D/g, '');
        
        // Aplica a máscara DD/MM/AAAA
        if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
        if (v.length > 5) v = v.substring(0, 5) + '/' + v.substring(5, 9);
        
        // Atualiza o valor do input
        input.value = v;
    }
    
    // Função para validar a data no formato DD/MM/AAAA
    function validarData(dataStr) {
        // Verifica o formato DD/MM/AAAA
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataStr)) {
            return false;
        }
        
        // Divide a data em dia, mês e ano
        const partes = dataStr.split('/');
        const dia = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10) - 1; // Mês em JS começa em 0
        const ano = parseInt(partes[2], 10);
        
        // Verifica se a data é válida
        const dataObj = new Date(ano, mes, dia);
        if (
            dataObj.getFullYear() !== ano ||
            dataObj.getMonth() !== mes ||
            dataObj.getDate() !== dia
        ) {
            return false;
        }
        
        // Verifica idade mínima (16 anos)
        const hoje = new Date();
        const idadeMinima = new Date(hoje.getFullYear() - 16, hoje.getMonth(), hoje.getDate());
        
        // Verifica se a data não é futura e se tem pelo menos 16 anos
        return dataObj <= hoje && dataObj <= idadeMinima;
    }
    
    // Adiciona a máscara ao campo de data
    dataNascimentoInput.addEventListener('input', function() {
        mascaraData(this);
    });
    
    // Validar data ao sair do campo
    dataNascimentoInput.addEventListener('blur', function() {
        const dataStr = this.value;
        
        // Se o campo estiver vazio, não valida
        if (!dataStr) return;
        
        // Valida a data
        if (!validarData(dataStr)) {
            alert('Data inválida ou você deve ter pelo menos 16 anos para participar.');
            this.value = '';
            this.focus();
        }
    });
    
    // Adicionar eventos para mostrar o nome do arquivo selecionado
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileNameDisplay = this.parentElement.querySelector('.file-input-name');
            if (this.files.length > 0) {
                fileNameDisplay.textContent = this.files[0].name;
                
                // Validar tamanho do arquivo (máximo 5MB)
                const fileSize = this.files[0].size / 1024 / 1024; // em MB
                if (fileSize > 5) {
                    alert('O arquivo é muito grande. O tamanho máximo permitido é 5MB.');
                    this.value = '';
                    fileNameDisplay.textContent = 'Nenhum arquivo selecionado';
                }
            } else {
                fileNameDisplay.textContent = 'Nenhum arquivo selecionado';
            }
        });
    });
    
    // Validação do campo de nome (apenas letras e espaços)
    nomeInput.addEventListener('input', function() {
        // Remover caracteres que não são letras, espaços ou acentos
        this.value = this.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
        
        // Converter para maiúsculas
        this.value = this.value.toUpperCase();
    });
    
    // Validação do campo de telefone (apenas números)
    telefoneInput.addEventListener('input', function() {
        // Remover caracteres que não são números
        this.value = this.value.replace(/\D/g, '');
    });
    
    // Converter o campo de bairro para maiúsculas
    bairroInput.addEventListener('input', function() {
        // Converter para maiúsculas
        this.value = this.value.toUpperCase();
    });
    
    // Atualizar o campo de bairro com base na região selecionada
    regiaoSelect.addEventListener('change', function() {
        // Esta função poderia ser expandida para preencher automaticamente o bairro
        // com base na região selecionada, se necessário
    });
    
    // Função para converter data do formato DD/MM/AAAA para YYYY-MM-DD
    function convertDataParaISO(dataStr) {
        if (!dataStr || !dataStr.includes('/')) return '';
        
        const partes = dataStr.split('/');
        if (partes.length !== 3) return '';
        
        const dia = partes[0];
        const mes = partes[1];
        const ano = partes[2];
        
        return `${ano}-${mes}-${dia}`;
    }
    
    // Função para converter data do formato DD/MM/AAAA para DDMMYYYY
    function convertDataParaDDMMYYYY(dataStr) {
        if (!dataStr || !dataStr.includes('/')) return '';
        
        const partes = dataStr.split('/');
        if (partes.length !== 3) return '';
        
        const dia = partes[0];
        const mes = partes[1];
        const ano = partes[2];
        
        return `${dia}${mes}${ano}`;
    }
    
    // Função para enviar dados como JSON (alternativa ao FormData)
    function sendAsJson(submitButton, originalButtonText) {
        console.log('Tentando enviar como JSON...');
        
        const webhookUrl = 'https://webhook.mediaware.com.br/webhook/0e1cec2b-acd2-49cc-ab60-52e2b29e6494';
        
        // Converter a data para o formato DDMMYYYY
        const dataNascimento = convertDataParaDDMMYYYY(dataNascimentoInput.value);
        
        // Criar objeto com os dados do formulário
        const formDataJson = {
            nome: nomeInput.value,
            dataNascimento: dataNascimento,
            telefone: telefoneInput.value,
            regiao: regiaoSelect.value,
            bairro: bairroInput.value,
            comprovante_nome: comprovanteInput.files[0].name,
            identidade_nome: identidadeInput.files[0].name
        };
        
        // Enviar como JSON
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJson)
        })
        .then(response => {
            console.log('Resposta JSON recebida:', response.status, response.statusText);
            if (response.ok) {
                showSuccessMessage();
            } else {
                alert('Não foi possível enviar o formulário. Por favor, tente novamente mais tarde.');
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        })
        .catch(e => {
            console.error('Erro ao enviar como JSON:', e);
            alert('Erro ao enviar o formulário. Por favor, tente novamente mais tarde.');
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
    }
    
    // Validação do formulário antes do envio
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        let isValid = true;
        let errorMessage = '';
        
        // Validar nome (não vazio e apenas letras)
        if (!nomeInput.value.trim()) {
            isValid = false;
            errorMessage += 'Por favor, informe seu nome completo.\n';
        }
        
        // Validar data de nascimento
        if (!dataNascimentoInput.value.trim()) {
            isValid = false;
            errorMessage += 'Por favor, informe sua data de nascimento.\n';
        } else if (!validarData(dataNascimentoInput.value)) {
            isValid = false;
            errorMessage += 'Data de nascimento inválida ou você deve ter pelo menos 16 anos.\n';
        }
        
        // Validar telefone (não vazio e apenas números)
        if (!telefoneInput.value.trim()) {
            isValid = false;
            errorMessage += 'Por favor, informe seu telefone.\n';
        } else if (telefoneInput.value.length < 10) {
            isValid = false;
            errorMessage += 'O telefone deve ter pelo menos 10 dígitos.\n';
        }
        
        // Validar região selecionada
        if (!regiaoSelect.value) {
            isValid = false;
            errorMessage += 'Por favor, selecione sua região.\n';
        }
        
        // Validar bairro
        if (!bairroInput.value.trim()) {
            isValid = false;
            errorMessage += 'Por favor, informe seu bairro.\n';
        }
        
        // Validar upload de comprovante de residência
        if (!comprovanteInput.files.length) {
            isValid = false;
            errorMessage += 'Por favor, faça o upload do comprovante de residência.\n';
        }
        
        // Validar upload de identidade
        if (!identidadeInput.files.length) {
            isValid = false;
            errorMessage += 'Por favor, faça o upload da identidade.\n';
        }
        
        if (!isValid) {
            alert('Por favor, corrija os seguintes erros:\n' + errorMessage);
            return;
        }
        
        // Se chegou aqui, o formulário é válido
        // Vamos enviar os dados para o webhook
        const webhookUrl = 'https://webhook.mediaware.com.br/webhook/0e1cec2b-acd2-49cc-ab60-52e2b29e6494';
        
        // Criar um objeto FormData para enviar os arquivos
        const formData = new FormData();
        
        // Adicionar os dados do formulário
        formData.append('nome', nomeInput.value);
        formData.append('dataNascimento', convertDataParaDDMMYYYY(dataNascimentoInput.value));
        formData.append('telefone', telefoneInput.value);
        formData.append('regiao', regiaoSelect.value);
        formData.append('bairro', bairroInput.value);
        
        // Adicionar os arquivos (podem causar problemas em alguns servidores)
        try {
            formData.append('comprovante', comprovanteInput.files[0]);
            formData.append('identidade', identidadeInput.files[0]);
        } catch (e) {
            console.error('Erro ao adicionar arquivos:', e);
            // Adicionar informações sobre os arquivos em vez dos arquivos em si
            formData.append('comprovante_nome', comprovanteInput.files[0].name);
            formData.append('identidade_nome', identidadeInput.files[0].name);
        }
        
        // Mostrar mensagem de carregamento
        const submitButton = document.querySelector('.submit-button');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        console.log('Enviando dados para:', webhookUrl);
        
        // Enviar os dados para o webhook
        fetch(webhookUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('Resposta recebida:', response.status, response.statusText);
            if (response.ok) {
                // Mostrar mensagem de sucesso
                showSuccessMessage();
            } else {
                return response.text().then(text => {
                    console.error('Erro na resposta:', text);
                    throw new Error(`Erro ao enviar o formulário (${response.status}). Por favor, tente novamente.`);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao enviar formulário:', error);
            
            // Tentar novamente sem os arquivos se houver erro
            if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                console.log('Tentando enviar sem os arquivos...');
                
                // Criar um novo FormData apenas com os dados de texto
                const textOnlyFormData = new FormData();
                textOnlyFormData.append('nome', nomeInput.value);
                textOnlyFormData.append('dataNascimento', convertDataParaDDMMYYYY(dataNascimentoInput.value));
                textOnlyFormData.append('telefone', telefoneInput.value);
                textOnlyFormData.append('regiao', regiaoSelect.value);
                textOnlyFormData.append('bairro', bairroInput.value);
                textOnlyFormData.append('comprovante_nome', comprovanteInput.files[0].name);
                textOnlyFormData.append('identidade_nome', identidadeInput.files[0].name);
                
                // Tentar enviar apenas os dados de texto
                fetch(webhookUrl, {
                    method: 'POST',
                    body: textOnlyFormData
                })
                .then(response => {
                    if (response.ok) {
                        showSuccessMessage();
                    } else {
                        // Se ainda houver erro, tentar como JSON
                        sendAsJson(submitButton, originalButtonText);
                    }
                })
                .catch(e => {
                    console.error('Erro ao enviar sem arquivos:', e);
                    // Tentar como JSON como última alternativa
                    sendAsJson(submitButton, originalButtonText);
                });
            } else {
                alert(error.message);
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    });
    
    // Função para mostrar mensagem de sucesso
    function showSuccessMessage() {
        const formSection = document.querySelector('.form-section');
        
        // Criar elemento de mensagem de sucesso
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <h2>Inscrição Realizada com Sucesso!</h2>
            <p>Obrigado por se inscrever nas Assembleias Populares Regionais 2025.</p>
            <p>Você receberá um e-mail de confirmação em breve.</p>
            <a href="index.html" class="back-button">Voltar para a página inicial</a>
        `;
        
        // Substituir o formulário pela mensagem de sucesso
        formSection.innerHTML = '';
        formSection.appendChild(successMessage);
    }
});
