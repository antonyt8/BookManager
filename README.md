# 📚 BookManager v2.0

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

> **📖 Para instruções detalhadas, veja a seção "Configuração e Instalação Detalhada" abaixo.**

## ✨ Funcionalidades Implementadas

### 📖 **Gerenciamento de Livros**
- **Cadastro básico**: Título, autor, ano, gênero
- **Status de leitura**: Lido, Lendo, Para Ler
- **Sistema de avaliação**: 1 a 5 estrelas
- **Descrição**: Campo para sinopse/descrição
- **Campos no modelo**: ISBN, páginas, editora, idioma, formato, notas, tags, datas (não implementados na interface)
- **Controle de datas**: Data de início e conclusão da leitura (apenas no modelo)

### 📊 **Dashboard Interativo**
- **Estatísticas em tempo real**: Total de livros, status de leitura
- **Gráficos dinâmicos**: Distribuição por status e gêneros
- **Métricas avançadas**: Média de avaliação, total de páginas
- **Análises detalhadas**: Gênero favorito, melhores avaliações
- **Livros recentes**: Últimos adicionados à biblioteca

### 🔍 **Busca e Filtros**
- **Busca por texto**: Título, autor, gênero
- **Filtros**: Status de leitura
- **Ordenação**: Por data, título, autor, avaliação
- **Paginação**: Navegação entre páginas

### 🎨 **Interface Moderna e Responsiva**
- **Design glassmorphism**: Efeito de vidro fosco contemporâneo
- **Gradientes vibrantes**: Paleta de cores moderna
- **Animações suaves**: Transições e hover effects
- **Tipografia Inter**: Fonte moderna e legível
- **Ícones FontAwesome**: Elementos visuais profissionais
- **Responsividade completa**: Desktop, tablet e mobile

## ✅ Recursos Disponíveis

- **Dashboard interativo** com gráficos e estatísticas
- **Listagem de livros** com filtros e busca
- **Formulário de cadastro** com validação (campos básicos)
- **Edição de livros** existentes
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
- **Gráficos**: Chart.js
- **Validação**: Express-validator
- **Fontes**: Google Fonts (Inter)

## 🚀 Configuração e Instalação Detalhada

> **💡 Se você já executou os passos rápidos acima e funcionou, pode pular esta seção. Aqui você encontrará instruções mais detalhadas, troubleshooting e configurações avançadas.**

### 📋 Pré-requisitos Obrigatórios

#### **Sistema Operacional**
- ✅ **Linux** (Ubuntu 18.04+, Debian 10+, CentOS 7+)
- ✅ **macOS** (10.14+)
- ✅ **Windows** (10/11 com WSL2 recomendado)

#### **Node.js e npm**
- **Node.js**: Versão 14.0.0 ou superior
- **npm**: Versão 6.0.0 ou superior (vem com Node.js)

#### **Verificação de Versões**
```bash
# Verificar versão do Node.js
node --version

# Verificar versão do npm
npm --version

# Verificar versão do Git
git --version
```

#### **Instalação do Node.js (se necessário)**

**Ubuntu/Debian:**
```bash
# Atualizar repositórios
sudo apt update

# Instalar Node.js e npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

**macOS (com Homebrew):**
```bash
# Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Node.js
brew install node

# Verificar instalação
node --version
npm --version
```

**Windows:**
1. Baixe o instalador do Node.js em: https://nodejs.org/
2. Execute o instalador e siga as instruções
3. Abra o PowerShell e verifique:
```powershell
node --version
npm --version
```

### 🔧 Instalação Passo a Passo

#### **1. Clone o Repositório**
```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/bookmanager.git

# Navegar para o diretório
cd bookmanager

# Verificar se está no diretório correto
ls -la
```

#### **2. Instalar Dependências**
```bash
# Instalar todas as dependências
npm install

# Verificar se a instalação foi bem-sucedida
npm list --depth=0
```

#### **3. Configuração do Ambiente**

O projeto está configurado para funcionar imediatamente sem configurações adicionais. Todas as configurações usam valores padrão:

- **Porta**: 3000
- **Ambiente**: development
- **Sessão**: chave padrão segura
- **Banco de dados**: SQLite local

#### **4. Configuração do Banco de Dados**

O banco de dados SQLite será criado automaticamente na primeira execução. Se quiser configurar manualmente:

```bash
# Verificar se o arquivo database.sqlite existe
ls -la database.sqlite

# Se não existir, será criado automaticamente na primeira execução
```

#### **5. Verificação da Estrutura do Projeto**
```bash
# Verificar se todos os arquivos estão presentes
tree -I 'node_modules|.git' -a

# Estrutura esperada:
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
│   ├── style.css         # Estilos customizados
│   ├── livros.js         # JavaScript do frontend
│   └── uploads/          # Diretório para uploads
├── app.js                # Arquivo principal da aplicação
├── package.json          # Dependências e scripts
├── test-simple.js        # Arquivo de teste
└── README.md            # Este arquivo
```

### 🚀 Executando o Projeto

#### **Modo Desenvolvimento (Recomendado)**
```bash
# Iniciar em modo desenvolvimento (com auto-reload)
npm run dev

# Ou usar nodemon diretamente
npx nodemon app.js
```

#### **Modo Produção**
```bash
# Iniciar em modo produção
npm start

# Ou usar node diretamente
node app.js
```

#### **Verificação de Funcionamento**
Após iniciar o servidor, você deve ver:

```bash
✅ Conexão com banco de dados estabelecida com sucesso.
✅ Modelos sincronizados com o banco de dados.
🚀 Servidor rodando em http://localhost:3000
📚 BookManager iniciado com sucesso!
🌍 Ambiente: development
```

#### **Acessando a Aplicação**
1. Abra seu navegador
2. Acesse: [http://localhost:3000](http://localhost:3000)
3. Você deve ver a página inicial do BookManager

### 🔍 Troubleshooting

#### **Problemas Comuns e Soluções**

**1. Erro: "Port 3000 is already in use"**
```bash
# Verificar processos na porta 3000
lsof -i :3000

# Matar processo (substitua PID pelo número do processo)
kill -9 PID

# Ou usar uma porta diferente
PORT=3001 npm run dev
```

**2. Erro: "Cannot find module"**
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

**3. Erro: "Database connection failed"**
```bash
# Verificar permissões do diretório
ls -la database.sqlite

# Recriar banco de dados
rm database.sqlite
npm run dev
```

**4. Erro: "EACCES: permission denied"**
```bash
# Corrigir permissões
sudo chown -R $USER:$USER .
chmod +x app.js
```

**5. Node.js versão incompatível**
```bash
# Verificar versão
node --version

# Se necessário, atualizar Node.js
# Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS:
brew update && brew upgrade node
```

#### **Logs e Debug**
```bash
# Ver logs detalhados
DEBUG=* npm run dev

# Ver logs de erro
npm run dev 2>&1 | tee error.log

# Verificar status do processo
ps aux | grep node
```

### 🧪 Testando a Aplicação

#### **Testes Básicos**
```bash
# Teste de conexão com banco
node test-simple.js

# Teste de dependências
npm audit

# Teste de linting
npm run lint
```

#### **Verificação de Funcionalidades**
1. **Dashboard**: Acesse `/dashboard` para ver estatísticas
2. **Lista de Livros**: Acesse `/livros` para ver todos os livros
3. **Novo Livro**: Clique em "Novo Livro" para testar o formulário
4. **Busca**: Teste a funcionalidade de busca na lista de livros

### 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia com nodemon (auto-reload)

# Produção
npm start            # Inicia o servidor

# Qualidade de Código
npm run lint         # Verifica qualidade do código
npm run format       # Formata o código automaticamente

# Testes
npm test             # Executa testes (se configurados)
```

### 🎯 Primeiros Passos Após Instalação

1. **Acesse a página inicial** - Veja o dashboard com estatísticas
2. **Adicione seu primeiro livro** - Clique em "Novo Livro"
3. **Explore as funcionalidades** - Teste busca, filtros e edição
4. **Visualize as estatísticas** - Acesse o dashboard para ver gráficos
5. **Teste a responsividade** - Acesse em diferentes dispositivos

### 📞 Suporte e Contato

Se você encontrar problemas:

1. **Verifique os logs** do servidor
2. **Confirme as versões** do Node.js e npm
3. **Teste a conectividade** do banco de dados
4. **Verifique as permissões** dos arquivos
5. **Abra uma issue** no GitHub com detalhes do problema

**Informações para suporte:**
- Sistema Operacional: `uname -a`
- Node.js: `node --version`
- npm: `npm --version`
- Logs de erro: `npm run dev 2>&1`

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
│   ├── style.css         # Estilos customizados
│   ├── livros.js         # JavaScript do frontend
│   └── uploads/          # Diretório para uploads
├── app.js                # Arquivo principal da aplicação
├── package.json          # Dependências e scripts
├── test-simple.js        # Arquivo de teste
└── README.md            # Este arquivo
```

## 📊 Campos do Modelo Livro

| Campo | Tipo | Obrigatório | Descrição | No Formulário |
|-------|------|-------------|-----------|---------------|
| `titulo` | String(200) | ✅ | Título do livro | ✅ |
| `autor` | String(100) | ✅ | Nome do autor | ✅ |
| `ano` | Integer | ❌ | Ano de publicação | ✅ |
| `genero` | String(50) | ❌ | Gênero literário | ✅ |
| `isbn` | String(13) | ❌ | Código ISBN | ❌ |
| `descricao` | Text | ❌ | Sinopse/descrição | ✅ |
| `avaliacao` | Integer(1-5) | ❌ | Avaliação em estrelas | ✅ |
| `status` | Enum | ❌ | Lido/Lendo/Para Ler | ✅ |
| `data_inicio` | Date | ❌ | Data de início da leitura | ❌ |
| `data_conclusao` | Date | ❌ | Data de conclusão | ❌ |
| `paginas` | Integer | ❌ | Número de páginas | ❌ |
| `editora` | String(100) | ❌ | Nome da editora | ❌ |
| `idioma` | String(50) | ❌ | Idioma do livro | ❌ |
| `formato` | Enum | ❌ | Físico/E-book/Audiobook/PDF | ❌ |
| `notas` | Text | ❌ | Notas pessoais | ❌ |
| `tags` | String(200) | ❌ | Tags para categorização | ❌ |
| `capa_url` | String(500) | ❌ | URL da capa | ❌ |
| `created_at` | DateTime | ✅ | Data de criação | ✅ |
| `updated_at` | DateTime | ✅ | Data de atualização | ✅ |

> **Nota**: Apenas os campos marcados com ✅ no formulário estão disponíveis na interface atual. Os demais campos existem no modelo mas não estão implementados na interface.

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

---

**⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!**

**📚 Transforme sua biblioteca pessoal em uma experiência digital moderna!**

## ⚠️ Limitações Atuais

### **Campos Não Implementados na Interface**
Os seguintes campos existem no modelo de dados mas não estão disponíveis no formulário:
- **ISBN**: Código de identificação do livro
- **Páginas**: Número de páginas
- **Editora**: Nome da editora
- **Idioma**: Idioma do livro
- **Formato**: Físico, E-book, Audiobook, PDF
- **Notas**: Anotações pessoais
- **Tags**: Categorização personalizada
- **Capa URL**: URL da imagem da capa
- **Data de Início**: Data de início da leitura
- **Data de Conclusão**: Data de conclusão da leitura

### **Funcionalidades Não Implementadas**
- Upload de imagens de capa
- Sistema de usuários e autenticação
- API REST completa
- Exportação/importação de dados
- Testes automatizados
- Modo escuro/claro

> **Nota**: Estas funcionalidades estão planejadas para versões futuras do projeto.