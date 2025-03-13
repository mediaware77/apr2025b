document.addEventListener('DOMContentLoaded', function() {
    // Implementação de lazy loading para imagens
    if ('loading' in HTMLImageElement.prototype) {
        // O navegador suporta lazy loading nativo
        console.log('O navegador suporta lazy loading nativo');
    } else {
        // Fallback para navegadores que não suportam lazy loading nativo
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            lazyLoadObserver.observe(img);
        });
    }

    // Adicionar funcionalidade de pesquisa por região
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Pesquisar por bairro ou região...';
    searchInput.classList.add('search-input');
    
    // Adicionar ícone de pesquisa
    const searchIcon = document.createElement('span');
    searchIcon.innerHTML = '&#128269;';
    searchIcon.classList.add('search-icon');
    
    const searchContainer = document.createElement('div');
    searchContainer.classList.add('search-container');
    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(searchInput);
    
    const calendarSection = document.querySelector('.calendar');
    calendarSection.insertBefore(searchContainer, calendarSection.querySelector('h2').nextSibling);
    
    // Adicionar botão para limpar a pesquisa
    const clearButton = document.createElement('button');
    clearButton.textContent = '✕';
    clearButton.classList.add('clear-search');
    clearButton.style.display = 'none';
    searchContainer.appendChild(clearButton);
    
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        clearButton.style.display = 'none';
        // Disparar o evento input para atualizar os resultados
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
    });
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const regions = document.querySelectorAll('.region');
        
        // Mostrar ou ocultar o botão de limpar
        clearButton.style.display = searchTerm.length > 0 ? 'block' : 'none';
        
        // Contar regiões visíveis
        let visibleCount = 0;
        
        regions.forEach(region => {
            const regionContent = region.textContent.toLowerCase();
            if (regionContent.includes(searchTerm)) {
                region.style.display = 'block';
                visibleCount++;
                // Destacar o termo pesquisado
                if (searchTerm.length > 2) {
                    highlightText(region, searchTerm);
                } else {
                    // Remover destaques anteriores
                    removeHighlights(region);
                }
            } else {
                region.style.display = 'none';
            }
        });
        
        // Mostrar mensagem se não houver resultados
        let noResultsMessage = document.querySelector('.no-results-message');
        
        if (visibleCount === 0 && searchTerm.length > 0) {
            if (!noResultsMessage) {
                noResultsMessage = document.createElement('p');
                noResultsMessage.classList.add('no-results-message');
                calendarSection.insertBefore(noResultsMessage, document.querySelector('.week'));
            }
            noResultsMessage.textContent = `Nenhum resultado encontrado para "${searchTerm}".`;
            noResultsMessage.style.display = 'block';
        } else if (noResultsMessage) {
            noResultsMessage.style.display = 'none';
        }
    });
    
    // Função para destacar texto
    function highlightText(element, term) {
        // Primeiro, remova destaques anteriores
        removeHighlights(element);
        
        // Função recursiva para percorrer nós de texto
        function searchAndHighlight(node) {
            if (node.nodeType === 3) { // Nó de texto
                const content = node.textContent;
                const lowerContent = content.toLowerCase();
                let index = lowerContent.indexOf(term);
                
                if (index >= 0) {
                    // Criar elementos para destacar o texto
                    const before = document.createTextNode(content.substring(0, index));
                    const highlight = document.createElement('span');
                    highlight.classList.add('highlight');
                    highlight.textContent = content.substring(index, index + term.length);
                    const after = document.createTextNode(content.substring(index + term.length));
                    
                    // Substituir o nó de texto pelos novos elementos
                    const parent = node.parentNode;
                    parent.insertBefore(before, node);
                    parent.insertBefore(highlight, node);
                    parent.insertBefore(after, node);
                    parent.removeChild(node);
                    
                    // Continuar procurando no texto restante
                    searchAndHighlight(after);
                }
            } else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
                // Elemento: percorrer filhos
                Array.from(node.childNodes).forEach(child => {
                    searchAndHighlight(child);
                });
            }
        }
        
        // Iniciar busca nos elementos de conteúdo
        const contentElements = element.querySelectorAll('.region-content');
        contentElements.forEach(el => {
            searchAndHighlight(el);
        });
    }
    
    // Função para remover destaques
    function removeHighlights(element) {
        const highlights = element.querySelectorAll('.highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize(); // Mesclar nós de texto adjacentes
        });
    }

    // Adicionar estilo para o destaque
    const style = document.createElement('style');
    style.textContent = `
        .search-container {
            margin: 20px 0;
            position: relative;
            display: flex;
            align-items: center;
        }
        .search-icon {
            position: absolute;
            left: 12px;
            font-size: 16px;
            color: var(--primary-color);
            z-index: 1;
        }
        .search-input {
            width: 100%;
            padding: 12px 40px 12px 35px;
            border: 2px solid var(--primary-color);
            border-radius: var(--border-radius);
            font-size: 16px;
            transition: var(--transition);
        }
        .search-input:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.3);
        }
        .clear-search {
            position: absolute;
            right: 12px;
            background: none;
            border: none;
            color: #777;
            font-size: 16px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
        .clear-search:hover {
            background-color: #eee;
            color: #333;
        }
        .highlight {
            background-color: var(--accent-color);
            color: black;
            font-weight: bold;
            padding: 2px 0;
        }
        .no-results-message {
            text-align: center;
            padding: 20px;
            background-color: #f8f8f8;
            border-radius: var(--border-radius);
            margin: 20px 0;
            color: #666;
        }
        @media (max-width: 767px) {
            .search-input {
                padding: 10px 35px 10px 30px;
                font-size: 15px;
            }
            .search-icon {
                left: 10px;
                font-size: 15px;
            }
            .clear-search {
                right: 10px;
                font-size: 15px;
            }
        }
    `;
    document.head.appendChild(style);

    // Adicionar botão "Voltar ao topo"
    const backToTopButton = document.createElement('button');
    backToTopButton.textContent = '↑';
    backToTopButton.setAttribute('aria-label', 'Voltar ao topo');
    backToTopButton.classList.add('back-to-top');
    document.body.appendChild(backToTopButton);

    // Estilizar o botão
    const backToTopStyle = document.createElement('style');
    backToTopStyle.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            display: none;
            box-shadow: var(--box-shadow);
            transition: var(--transition);
            z-index: 1000;
        }
        .back-to-top:hover {
            background-color: var(--secondary-color);
            transform: translateY(-3px);
        }
        .back-to-top.visible {
            display: block;
            animation: fadeIn 0.3s ease-out forwards;
        }
    `;
    document.head.appendChild(backToTopStyle);

    // Mostrar/ocultar o botão com base na posição de rolagem
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // Rolar suavemente para o topo quando o botão for clicado
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Detectar se é um dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Ajustar comportamento para dispositivos móveis
    if (isMobile) {
        // Adicionar classe ao body para estilos específicos para mobile
        document.body.classList.add('mobile-device');
        
        // Ajustar padding para elementos clicáveis para melhor experiência de toque
        const clickableElements = document.querySelectorAll('button, .region-header, .gallery-item');
        clickableElements.forEach(el => {
            el.classList.add('touch-friendly');
        });
    }
}); 