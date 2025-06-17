# 📚 BookManager

Uma aplicação web simples para cadastro e gerenciamento de livros, desenvolvida com Node.js, Express, Sequelize, EJS e SQLite.

## ✅ Funcionalidades

- Tela inicial de boas-vindas
- Listagem de todos os livros cadastrados
- Inclusão de novos livros
- Edição de livros existentes
- Exclusão de livros
- Templates reutilizáveis com EJS + Partials

## 🛠 Tecnologias Utilizadas

- Node.js + Express
- Sequelize ORM
- Banco de dados SQLite (ou MySQL opcional)
- EJS (Embedded JavaScript Templates)
- HTML/CSS

## 📦 Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/bookmanager.git
cd bookmanager
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o servidor

```bash
npm start
```

> O servidor estará disponível em: [http://localhost:3000](http://localhost:3000)

## 🗂 Estrutura do Projeto

```
bookmanager/
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   │   └── nav.ejs
│   ├── index.ejs
│   ├── livros.ejs
│   └── form.ejs
├── public/
│   └── style.css
├── app.js
├── package.json
└── README.md
```

## 📌 Observações

* A aplicação usa **SQLite** por padrão (arquivo `database.sqlite` será criado automaticamente).
* Para usar com **MySQL**, altere a configuração do Sequelize em `app.js`:

  ```js
  const sequelize = new Sequelize('nome_db', 'usuario', 'senha', {
    host: 'localhost',
    dialect: 'mysql'
  });
  ```

## 👤 Autor

**Antony Thiago Barbosa da Silva**  
Estudante de Sistemas de Informação  
IFAL - Instituto Federal de Alagoas 