// Funções para modais de livros
function confirmarExclusao(id, titulo) {
  document.getElementById('livroTitulo').textContent = titulo;
  document.getElementById('formExclusao').action = `/livros/deletar/${id}`;
  const modal = new bootstrap.Modal(document.getElementById('modalExclusao'));
  modal.show();
}

async function verDetalhes(id) {
  const modal = new bootstrap.Modal(document.getElementById('modalDetalhes'));
  modal.show();
  
  try {
    const response = await fetch(`/livros/api/${id}`);
    const livro = await response.json();
    
    if (response.ok) {
      const conteudo = `
        <div class="row">
          <div class="col-md-4 text-center">
            <i class="fas fa-book fa-5x text-primary mb-3"></i>
            <h4>${livro.titulo}</h4>
            <p class="text-muted">${livro.autor}</p>
            ${livro.ano ? `<p class="text-muted">${livro.ano}</p>` : ''}
          </div>
          <div class="col-md-8">
            <div class="row">
              <div class="col-md-6">
                <p><strong>Gênero:</strong> ${livro.genero || 'Não informado'}</p>
                <p><strong>Status:</strong> 
                  ${livro.status === 'lido' ? '<span class="badge bg-success">Lido</span>' : 
                    livro.status === 'lendo' ? '<span class="badge bg-warning">Lendo</span>' : 
                    '<span class="badge bg-info">Para Ler</span>'}
                </p>
                <p><strong>Avaliação:</strong> 
                  ${livro.avaliacao ? 
                    '<span class="text-warning">' + '⭐'.repeat(livro.avaliacao) + ` ${livro.avaliacao}/5</span>` : 
                    'Não avaliado'}
                </p>
                <p><strong>Formato:</strong> 
                  ${livro.formato ? `<span class="badge bg-secondary">${livro.formato}</span>` : 'Não informado'}
                </p>
                <p><strong>Páginas:</strong> ${livro.paginas ? `${livro.paginas} páginas` : 'Não informado'}</p>
              </div>
              <div class="col-md-6">
                <p><strong>ISBN:</strong> ${livro.isbn || 'Não informado'}</p>
                <p><strong>Editora:</strong> ${livro.editora || 'Não informado'}</p>
                <p><strong>Idioma:</strong> ${livro.idioma || 'Não informado'}</p>
                <p><strong>Data de Início:</strong> ${livro.data_inicio ? new Date(livro.data_inicio).toLocaleDateString('pt-BR') : 'Não informado'}</p>
                <p><strong>Data de Conclusão:</strong> ${livro.data_conclusao ? new Date(livro.data_conclusao).toLocaleDateString('pt-BR') : 'Não informado'}</p>
              </div>
            </div>
            
            ${livro.tags ? `<p><strong>Tags:</strong> <span class="badge bg-info">${livro.tags}</span></p>` : ''}
            ${livro.descricao ? `<p><strong>Descrição:</strong> ${livro.descricao}</p>` : ''}
            ${livro.notas ? `<p><strong>Notas:</strong> ${livro.notas}</p>` : ''}
          </div>
        </div>
      `;
      
      document.getElementById('detalhesConteudo').innerHTML = conteudo;
      document.getElementById('btnEditar').href = `/livros/editar/${id}`;
    } else {
      document.getElementById('detalhesConteudo').innerHTML = 
        '<div class="alert alert-danger">Erro ao carregar detalhes</div>';
    }
  } catch (error) {
    document.getElementById('detalhesConteudo').innerHTML = 
      '<div class="alert alert-danger">Erro ao carregar detalhes</div>';
  }
}

async function buscarGoogleBooks() {
  const termo = document.getElementById('titulo').value || document.getElementById('isbn').value;
  if (!termo) {
    alert('Digite o título ou ISBN para buscar.');
    return;
  }
  const query = encodeURIComponent(termo);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    if (!data.items || data.items.length === 0) {
      alert('Nenhum livro encontrado.');
      return;
    }
    const livro = data.items[0].volumeInfo;
    document.getElementById('titulo').value = livro.title || '';
    document.getElementById('autor').value = (livro.authors && livro.authors.join(', ')) || '';
    document.getElementById('ano').value = livro.publishedDate ? livro.publishedDate.substring(0,4) : '';
    document.getElementById('editora').value = livro.publisher || '';
    document.getElementById('descricao').value = livro.description || '';
    document.getElementById('isbn').value = (livro.industryIdentifiers && livro.industryIdentifiers[0].identifier) || '';
    document.getElementById('paginas').value = livro.pageCount || '';
    document.getElementById('idioma').value = livro.language || '';
    if (livro.categories && livro.categories.length > 0) {
      document.getElementById('genero').value = livro.categories.join(', ');
    }
    if (livro.imageLinks && livro.imageLinks.thumbnail) {
      // Exibe a capa, mas não faz upload automático
      let capaPreview = document.getElementById('capaPreview');
      if (!capaPreview) {
        capaPreview = document.createElement('img');
        capaPreview.id = 'capaPreview';
        capaPreview.className = 'img-thumbnail mt-2';
        capaPreview.style.maxHeight = '120px';
        document.getElementById('capa').parentNode.appendChild(capaPreview);
      }
      capaPreview.src = livro.imageLinks.thumbnail;
    }
  } catch (e) {
    alert('Erro ao buscar dados do Google Books.');
  }
}

// Dark mode toggle
function setDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', '1');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', '0');
  }
}

// Auto-submit dos filtros
document.addEventListener('DOMContentLoaded', function() {
  const ordenacaoSelect = document.querySelector('select[name="ordenacao"]');
  if (ordenacaoSelect) {
    ordenacaoSelect.addEventListener('change', function() {
      this.form.submit();
    });
  }

  const statusSelect = document.querySelector('select[name="status"]');
  if (statusSelect) {
    statusSelect.addEventListener('change', function() {
      this.form.submit();
    });
  }

  const formatoSelect = document.querySelector('select[name="formato"]');
  if (formatoSelect) {
    formatoSelect.addEventListener('change', function() {
      this.form.submit();
    });
  }

  // Spinner em botões de submit
  document.querySelectorAll('form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      const btn = form.querySelector('button[type=submit]');
      if (btn) {
        btn.disabled = true;
        const original = btn.innerHTML;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processando...';
        setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 10000); // fallback
      }
    });
  });

  // Esconder mensagens flash após 4s
  setTimeout(function() {
    document.querySelectorAll('.alert').forEach(function(el) {
      el.classList.add('fade');
      setTimeout(() => el.style.display = 'none', 500);
    });
  }, 4000);

  // Dark mode: aplicar preferência
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem('darkMode');
  setDarkMode(saved === '1' || (saved === null && prefersDark));

  // Toggle dark mode
  const btn = document.getElementById('toggle-darkmode');
  if (btn) {
    btn.addEventListener('click', function() {
      setDarkMode(!document.body.classList.contains('dark-mode'));
    });
  }
}); 