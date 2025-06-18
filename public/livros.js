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
}); 