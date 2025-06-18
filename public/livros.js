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
          </div>
          <div class="col-md-8">
            <p><strong>Gênero:</strong> ${livro.genero || 'Não informado'}</p>
            <p><strong>Ano:</strong> ${livro.ano || 'Não informado'}</p>
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
            ${livro.descricao ? `<p><strong>Descrição:</strong> ${livro.descricao}</p>` : ''}
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
}); 