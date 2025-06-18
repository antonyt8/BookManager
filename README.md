# 📚 BookManager v1.0

Uma aplicação web moderna e intuitiva para gerenciar sua biblioteca pessoal. Desenvolvida com Node.js, Express, Sequelize, EJS e SQLite, o BookManager oferece uma experiência completa para organizar, acompanhar e analisar sua coleção de livros.

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 14+ e npm

### Instalação e Execução
```bash
# 1. Clone o repositório
git clone https://github.com/antonyt8/BookManager.git
cd BookManager

# 2. Instale as dependências
npm install

# 3. Execute o projeto
npm run dev

# 4. Acesse no navegador
# http://localhost:3000
```

**✅ O projeto funciona imediatamente sem configurações adicionais!**

### **Funcionalidades para Testar**
1. **Dashboard**: Acesse a página inicial para ver estatísticas
2. **Lista de Livros**: Clique em "Livros" no menu
3. **Adicionar Livro**: Clique em "Novo Livro"
4. **Editar/Excluir**: Use os botões na lista de livros
5. **Busca e Filtros**: Teste na página de listagem

## ✨ Funcionalidades Implementadas

### 📖 **Gerenciamento Completo de Livros**
- **Cadastro completo**: Título, autor, ano, gênero, ISBN, páginas, editora, idioma, formato
- **Status de leitura**: Lido, Lendo, Para Ler
- **Sistema de avaliação**: 1 a 5 estrelas
- **Descrição e notas**: Campos para sinopse e observações pessoais
- **Tags**: Sistema de categorização por tags
- **Controle de datas**: Data de início e conclusão da leitura
- **Formato**: Físico, E-book, Audiobook, PDF

### 📊 **Dashboard Interativo**
- **Estatísticas em tempo real**: Total de livros, status de leitura
- **Gráficos dinâmicos**: Distribuição por status e gêneros
- **Métricas avançadas**: Média de avaliação, total de páginas
- **Análises detalhadas**: Gênero favorito, melhores avaliações
- **Livros recentes**: Últimos adicionados à biblioteca

### 🔍 **Busca e Filtros Avançados**
- **Busca por texto**: Título, autor, gênero, editora, tags
- **Filtros múltiplos**: Status de leitura, formato
- **Ordenação**: Por data, título, autor, avaliação
- **Paginação**: Navegação entre páginas com preservação de filtros

### 🎨 **Interface Moderna e Responsiva**
- **Design glassmorphism**: Efeito de vidro fosco contemporâneo
- **Gradientes vibrantes**: Paleta de cores moderna
- **Animações suaves**: Transições e hover effects
- **Tipografia Inter**: Fonte moderna e legível
- **Ícones FontAwesome**: Elementos visuais profissionais
- **Responsividade completa**: Desktop, tablet e mobile

### 🛡️ **Validação e Segurança**
- **Validação robusta**: Frontend e backend
- **Tratamento de erros**: Mensagens claras e informativas
- **Sanitização de dados**: Proteção contra injeção
- **Sessões seguras**: Flash messages para feedback

## ✅ Recursos Disponíveis

- **Dashboard interativo** com gráficos e estatísticas
- **Listagem de livros** com filtros avançados e busca
- **Formulário completo** com todos os campos implementados
- **Edição de livros** com validação
- **Exclusão de livros** com confirmação
- **Sistema de avaliação** com estrelas visuais
- **Status de leitura** com controle de progresso
- **Paginação** com design elegante
- **Tratamento de erros** com páginas personalizadas
- **Interface responsiva** para todos os dispositivos
- **Validação de formulários** no backend
- **Sessões** para mensagens flash

## 🛠 Tecnologias Utilizadas

- **Backend**: Node.js + Express
- **ORM**: Sequelize
- **Banco de dados**: SQLite
- **Template Engine**: EJS
- **Frontend**: Bootstrap 5 + CSS Customizado
- **Ícones**: FontAwesome 6.4
- **Validação**: Express-validator
- **Fontes**: Google Fonts (Inter)

## 🗂 Estrutura do Projeto

```
BookManager/
├── config/
│   └── database.js          # Configuração do banco de dados
├── controllers/
│   └── LivroController.js   # Lógica de negócio dos livros
├── middleware/
│   └── validation.js        # Validações de formulários
├── models/
│   └── Livro.js            # Modelo com todos os campos
├── routes/
│   └── livros.js           # Rotas organizadas
├── views/
│   ├── partials/
│   │   ├── header.ejs      # Header com meta tags
│   │   ├── footer.ejs      # Footer com scripts
│   │   └── nav.ejs         # Navegação principal
│   ├── dashboard.ejs       # Dashboard com gráficos
│   ├── error.ejs          # Página de erro 500
│   ├── 404.ejs           # Página de erro 404
│   ├── index.ejs         # Página inicial
│   ├── livros.ejs        # Lista de livros
│   └── form.ejs          # Formulário de livros
├── public/
│   ├── style.css         # Estilos customizados
│   ├── livros.js         # JavaScript do frontend
│   └── uploads/          # Diretório para uploads
├── app.js                # Arquivo principal da aplicação
├── package.json          # Dependências e scripts
└── README.md            # Este arquivo
```

## 📊 Campos do Modelo Livro

| Campo | Tipo | Obrigatório | Descrição | Status |
|-------|------|-------------|-----------|--------|
| `titulo` | String(200) | ✅ | Título do livro | ✅ Implementado |
| `autor` | String(100) | ✅ | Nome do autor | ✅ Implementado |
| `ano` | Integer | ❌ | Ano de publicação | ✅ Implementado |
| `genero` | String(50) | ❌ | Gênero literário | ✅ Implementado |
| `isbn` | String(13) | ❌ | Código ISBN | ✅ Implementado |
| `descricao` | Text | ❌ | Sinopse/descrição | ✅ Implementado |
| `avaliacao` | Integer(1-5) | ❌ | Avaliação em estrelas | ✅ Implementado |
| `status` | Enum | ❌ | Lido/Lendo/Para Ler | ✅ Implementado |
| `data_inicio` | Date | ❌ | Data de início da leitura | ✅ Implementado |
| `data_conclusao` | Date | ❌ | Data de conclusão | ✅ Implementado |
| `paginas` | Integer | ❌ | Número de páginas | ✅ Implementado |
| `editora` | String(100) | ❌ | Nome da editora | ✅ Implementado |
| `idioma` | String(50) | ❌ | Idioma do livro | ✅ Implementado |
| `formato` | Enum | ❌ | Físico/E-book/Audiobook/PDF | ✅ Implementado |
| `notas` | Text | ❌ | Notas pessoais | ✅ Implementado |
| `tags` | String(200) | ❌ | Tags para categorização | ✅ Implementado |
| `capa_url` | String(500) | ❌ | URL da capa | ❌ Não implementado |
| `created_at` | DateTime | ✅ | Data de criação | ✅ Automático |
| `updated_at` | DateTime | ✅ | Data de atualização | ✅ Automático |

## 🎯 Status de Leitura

- **🟢 Lido**: Livro completamente lido
- **🟡 Lendo**: Atualmente em leitura
- **🔵 Para Ler**: Na lista de leitura

## 📈 Estatísticas do Dashboard

- **Total de livros** na biblioteca
- **Distribuição por status** (gráfico de pizza)
- **Gêneros mais lidos** (gráfico de barras)
- **Média de avaliação** geral
- **Total de páginas** lidas
- **Gênero favorito** baseado em quantidade
- **Melhores avaliações** (top 5)
- **Livros recentes** adicionados

## 🎨 Design System

### Cores Principais
- **Primária**: Gradiente azul-roxo (#667eea → #764ba2)
- **Sucesso**: Gradiente azul-ciano (#4facfe → #00f2fe)
- **Aviso**: Gradiente verde (#43e97b → #38f9d7)
- **Perigo**: Gradiente rosa-amarelo (#fa709a → #fee140)

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700, 800
- **Hierarquia**: Títulos com gradientes, texto legível

### Componentes
- **Cards**: Glassmorphism com backdrop-filter
- **Botões**: Gradientes com hover effects
- **Tabelas**: Design limpo com hover states
- **Formulários**: Campos organizados com ícones

## 🚀 Roadmap Futuro

### **Funcionalidades Planejadas**
- 🔄 Upload de capas de livros
- 🔄 API REST completa
- 🔄 Exportação/importação de dados
- 🔄 Testes automatizados
- 🔄 Docker e CI/CD
- 🔄 Modo escuro/claro
- 🔄 Recomendações de livros
- 🔄 Integração com APIs de livros
- 🔄 Backup automático
- 🔄 Sistema de usuários e autenticação

## 👥 Autores

**Antony Thiago Barbosa da Silva**  
Estudante de Sistemas de Informação  
IFAL - Instituto Federal de Alagoas

**Ester Albuquerque**  
Estudante de Sistemas de Informação  
IFAL - Instituto Federal de Alagoas

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as dependências estão instaladas
2. Confirme se o Node.js está na versão correta
3. Verifique se a porta 3000 está disponível
4. Abra uma issue no GitHub com detalhes do problema

## 🎉 Sobre o Projeto

O BookManager nasceu da necessidade de ter uma ferramenta moderna e intuitiva para gerenciar bibliotecas pessoais. Com foco na experiência do usuário e design contemporâneo, oferecemos uma solução completa para organizar sua coleção de livros.

### Por que escolher o BookManager?

- **🎨 Design moderno**: Interface glassmorphism com gradientes
- **📱 Responsivo**: Funciona perfeitamente em qualquer dispositivo
- **📊 Análises**: Dashboard com estatísticas e gráficos
- **🔍 Busca avançada**: Encontre seus livros rapidamente
- **⚡ Performance**: Carregamento rápido e otimizado
- **🛡️ Seguro**: Validação robusta e sanitização de dados
- **📚 Completo**: Todos os campos essenciais implementados

---

**⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!**

**📚 Transforme sua biblioteca pessoal em uma experiência digital moderna!**

## ⚠️ Limitações Atuais

### **Funcionalidades Não Implementadas**
- **Upload de capas**: Sistema de upload de imagens de capa
- **Sistema de usuários**: Autenticação e múltiplos usuários
- **API REST**: Endpoints para integração externa
- **Exportação/importação**: Backup e restauração de dados
- **Testes automatizados**: Suite de testes unitários e integração
- **Modo escuro/claro**: Alternância de tema

> **Nota**: Estas funcionalidades estão planejadas para versões futuras do projeto.