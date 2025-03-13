document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos do formulário
    const form = document.getElementById('inscricao-form');
    const nomeInput = document.getElementById('nome');
    const telefoneInput = document.getElementById('telefone');
    const regiaoSelect = document.getElementById('regiao');
    const bairroInput = document.getElementById('bairro');
    const comprovanteInput = document.getElementById('comprovante');
    const identidadeInput = document.getElementById('identidade');
    
    // Referências aos elementos de exibição do nome do arquivo
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
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
    
    // Atualizar o campo de bairro com base na região selecionada
    regiaoSelect.addEventListener('change', function() {
        // Esta função poderia ser expandida para preencher automaticamente o bairro
        // com base na região selecionada, se necessário
    });
    
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
        // Aqui você pode adicionar o código para enviar os dados para o servidor
        // Por enquanto, vamos apenas mostrar uma mensagem de sucesso
        alert('Inscrição realizada com sucesso! Obrigado por participar.');
        
        // Redirecionar para a página inicial após o envio bem-sucedido
        // window.location.href = 'index.html';
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