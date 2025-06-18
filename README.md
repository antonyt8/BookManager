# 📚 BookManager v1.0

Uma aplicação web moderna e intuitiva para gerenciar sua biblioteca pessoal. Desenvolvida com Node.js, Express, Sequelize, EJS e SQLite, o BookManager oferece uma experiência completa para organizar, acompanhar e analisar sua coleção de livros.

## ✨ Funcionalidades Principais

### 📖 **Gerenciamento Completo de Livros**
- **Cadastro detalhado**: Título, autor, ano, gênero, ISBN
- **Status de leitura**: Lido, Lendo, Para Ler
- **Sistema de avaliação**: 1 a 5 estrelas
- **Informações bibliográficas**: Editora, idioma, formato, páginas
- **Controle de progresso**: Data de início e conclusão da leitura
- **Notas pessoais**: Resenhas e anotações
- **Tags**: Categorização personalizada

### 📊 **Dashboard Interativo**
- **Estatísticas em tempo real**: Total de livros, status de leitura
- **Gráficos dinâmicos**: Distribuição por status e gêneros
- **Métricas avançadas**: Média de avaliação, total de páginas
- **Análises detalhadas**: Gênero favorito, melhores avaliações
- **Livros recentes**: Últimos adicionados à biblioteca

### 🔍 **Busca e Filtros Inteligentes**
- **Busca avançada**: Título, autor, gênero, ISBN
- **Filtros múltiplos**: Status, ano, formato, idioma
- **Ordenação flexível**: Por data, avaliação, páginas, título
- **Paginação elegante**: Navegação suave entre páginas

### 🎨 **Interface Moderna e Responsiva**
- **Design glassmorphism**: Efeito de vidro fosco contemporâneo
- **Gradientes vibrantes**: Paleta de cores moderna
- **Animações suaves**: Transições e hover effects
- **Tipografia Inter**: Fonte moderna e legível
- **Ícones FontAwesome**: Elementos visuais profissionais
- **Responsividade completa**: Desktop, tablet e mobile

## ✅ Recursos Disponíveis

- **Dashboard interativo** com gráficos e estatísticas
- **Listagem avançada** com filtros e busca inteligente
- **Formulário completo** com todos os campos necessários
- **Sistema de avaliação** com estrelas visuais
- **Status de leitura** com controle de progresso
- **Paginação moderna** com design elegante
- **Tratamento de erros** com páginas personalizadas
- **Interface responsiva** para todos os dispositivos

## 🛠 Tecnologias Utilizadas

- **Backend**: Node.js + Express
- **ORM**: Sequelize
- **Banco de dados**: SQLite
- **Template Engine**: EJS
- **Frontend**: Bootstrap 5 + CSS Customizado
- **Ícones**: FontAwesome 6.4
- **Gráficos**: Chart.js
- **Validação**: Express-validator
- **Fontes**: Google Fonts (Inter)

## 🚀 Como Rodar o Projeto

### 📋 Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **npm** (gerenciador de pacotes do Node.js)
- **Git** (para clonar o repositório)

### 🔧 Instalação Passo a Passo

#### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/bookmanager.git
cd bookmanager
```

#### 2. Instale as dependências
```bash
npm install
```

#### 3. Configure as variáveis de ambiente (opcional)
Crie um arquivo `.env` na raiz do projeto:
```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=sua_chave_secreta_aqui
```

#### 4. Inicie o servidor
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

#### 5. Acesse a aplicação
Abra seu navegador e acesse: [http://localhost:3000](http://localhost:3000)

### 🎯 Primeiros Passos

1. **Acesse a página inicial** - Veja o dashboard com estatísticas
2. **Adicione seu primeiro livro** - Clique em "Novo Livro"
3. **Explore as funcionalidades** - Teste busca, filtros e edição
4. **Visualize as estatísticas** - Acesse o dashboard para ver gráficos

## 🗂 Estrutura do Projeto

```
bookmanager/
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
│   └── style.css         # Estilos customizados
├── app.js                # Arquivo principal da aplicação
├── package.json          # Dependências e scripts
└── README.md            # Este arquivo
```

## 📊 Campos do Modelo Livro

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `titulo` | String(200) | ✅ | Título do livro |
| `autor` | String(100) | ✅ | Nome do autor |
| `ano` | Integer | ✅ | Ano de publicação |
| `genero` | String(50) | ✅ | Gênero literário |
| `isbn` | String(13) | ❌ | Código ISBN |
| `descricao` | Text | ❌ | Sinopse/descrição |
| `avaliacao` | Integer(1-5) | ❌ | Avaliação em estrelas |
| `status` | Enum | ❌ | Lido/Lendo/Para Ler |
| `data_inicio` | Date | ❌ | Data de início da leitura |
| `data_conclusao` | Date | ❌ | Data de conclusão |
| `paginas` | Integer | ❌ | Número de páginas |
| `editora` | String(100) | ❌ | Nome da editora |
| `idioma` | String(50) | ❌ | Idioma do livro |
| `formato` | Enum | ❌ | Físico/E-book/Audiobook/PDF |
| `notas` | Text | ❌ | Notas pessoais |
| `tags` | String(200) | ❌ | Tags para categorização |
| `capa_url` | String(500) | ❌ | URL da capa |
| `created_at` | DateTime | ✅ | Data de criação |
| `updated_at` | DateTime | ✅ | Data de atualização |

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

## 🔧 Scripts Disponíveis

```bash
npm start          # Inicia o servidor em produção
npm run dev        # Modo desenvolvimento (com nodemon)
npm run lint       # Verifica qualidade do código
npm run format     # Formata o código automaticamente
```

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

### **Próximas Versões**
- 🔄 Sistema de usuários e autenticação
- 🔄 Upload de capas de livros
- 🔄 API REST completa
- 🔄 Exportação/importação de dados
- 🔄 Testes automatizados
- 🔄 Docker e CI/CD
- 🔄 Modo escuro/claro
- 🔄 Recomendações de livros
- 🔄 Integração com APIs de livros
- 🔄 Backup automático

## 👥 Autores

**Antony Thiago Barbosa da Silva**  
Estudante de Sistemas de Informação  
IFAL - Instituto Federal de Alagoas

**Ester Albuquerque**  
Colaboradora no design e desenvolvimento

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

---

**⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!**

**📚 Transforme sua biblioteca pessoal em uma experiência digital moderna!**