# Sistema de Gerenciamento de Usuários e Transações

## Visão Geral do Projeto

Este sistema é uma aplicação integrada de backend e frontend desenvolvida com tecnologias modernas como **Node.js**, **Express.js**, **Next.js** e outras ferramentas avançadas. Ele oferece uma solução abrangente para o gerenciamento de transações financeiras e controle de usuários. A estrutura segue o padrão **MVC (Model-View-Controller)**, garantindo uma arquitetura modular, escalável e de fácil manutenção.

O **backend** utiliza **SQLite** como banco de dados e fornece APIs seguras para manipulação de dados, enquanto o **frontend** oferece uma interface intuitiva e interativa para facilitar a experiência do usuário final.

---

## Tecnologias Utilizadas

### Backend
- **Node.js**: Plataforma JavaScript para execução no servidor.
- **Express.js**: Framework minimalista para criação de APIs RESTful.
- **SQLite**: Banco de dados relacional leve, ideal para aplicações de pequeno porte.
- **bcrypt**: Biblioteca para encriptação de senhas, garantindo segurança no armazenamento de credenciais.
- **cors**: Middleware para gerenciar políticas de acesso entre origens diferentes.
- **body-parser**: Utilizado para processar e interpretar os dados das requisições HTTP.

### Frontend
- **Next.js**: Framework React que combina renderização no servidor e no cliente.
- **Chart.js**: Biblioteca de gráficos para criar visualizações interativas e dinâmicas.
- **Tailwind CSS**: Framework de estilização que facilita o desenvolvimento responsivo.
- **React Hot Toast**: Biblioteca para exibição de notificações amigáveis e em tempo real.

---

## Instalação e Configuração

### Pré-requisitos

Certifique-se de ter instalado:
- Node.js (versão 16 ou superior).
- Gerenciador de pacotes como NPM ou Yarn.

### Passos para Configuração

1. Clone o repositório:
   ```bash
   git clone https://github.com/Russell-Nunez/Sistema-Banco.git
   cd Sistema-Banco
   ```
2. Instale as dependências do projeto:
   ```bash
   npm install
   ```
3. Inicie o servidor backend:
   ```bash
   npm start
   ```
4. Abra um novo terminal e inicie o servidor frontend:
   ```bash
   npm run dev
   ```
5. O backend estará acessível em `http://localhost:3001` e o frontend em `http://localhost:3000`.

---

## Estrutura do Projeto

```
├── backend
│   ├── controllers
│   │   ├── userController.js
│   │   ├── transferController.js
│   ├── models
│   │   ├── userModel.js
│   │   ├── transferModel.js
│   ├── routes
│   │   ├── userRoutes.js
│   │   ├── transferRoutes.js
│   ├── bd
│   │   └── database.sqlite
│   ├── app.js
├── frontend
│   ├── components
│   │   ├── nav-header.tsx
│   │   ├── hero-section.tsx
│   │   ├── button.tsx
│   │   ├── transfer-form.tsx
│   │   ├── transaction-charts.tsx
│   ├── pages
│   │   ├── index.tsx
│   │   ├── transactions.tsx
│   │   ├── login.tsx
│   ├── public
│   │   ├── logo.png
│   │   ├── icono_banco.png
│   │   ├── cards.png
```

---

## Funcionalidades

### Backend

#### Gerenciamento de Usuários

- **Registro de Usuário**
  - **Rota**: `POST /api/users/register`
  - Permite o cadastro de usuários com CPF, email e senha encriptada.

- **Autenticação**
  - **Rota**: `POST /api/users/login`
  - Gera um token JWT para autenticação segura e acesso às funcionalidades do sistema.

- **Consulta de Saldo**
  - **Rota**: `GET /api/users/:id/balance`
  - Retorna o saldo atualizado do usuário autenticado.

- **Consulta de Transações**
  - **Rota**: `GET /api/users/:id/transactions`
  - Lista todas as transações associadas ao usuário, organizadas cronologicamente.

#### Gerenciamento de Transferências

- **Criação de Transferências**
  - **Rota**: `POST /api/transfers/:id`
  - Permite realizar transferências com validações de saldo e CPF do destinatário.

- **Resumo de Transferências**
  - **Rota**: `GET /api/transfers/:id/transfer-summary`
  - Apresenta o total de entradas e saídas financeiras do usuário.

---

### Frontend

#### Componentes Principais

1. **NavHeader**: Implementa a barra de navegação com links para as principais páginas do sistema.
2. **HeroSection**: Seção inicial que apresenta os benefícios e diferenciais do GarupaPay.
3. **TransferForm**: Formulário funcional para criar novas transferências com validações front-end.
4. **TransactionCharts**: Gera gráficos interativos para visualizar dados financeiros (barras, linhas, ou rosca).

#### Páginas

1. **Home**: Introdução ao sistema, destacando suas principais funcionalidades.
2. **Transações**: Exibe saldo atual, totais de entradas e saídas, uma lista das transações mais recentes e permite realizar novas transferências.
3. **Login/Registro**: Interface para autenticação ou cadastro de novos usuários.

---

## Banco de Dados

### Estrutura das Tabelas

#### Tabela de Usuários
- Armazena informações básicas dos usuários, como CPF, email e saldo:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  saldo REAL NOT NULL
);
```

#### Tabela de Transferências
- Gerencia o registro de transações entre usuários:

```sql
CREATE TABLE transfers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  recipient_cpf TEXT NOT NULL,
  amount REAL NOT NULL,
  description TEXT,
  due_date TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (sender_id) REFERENCES users (id)
);
```

---

## Conclusão

Este sistema foi projetado para oferecer uma solução confiável e escalável para o gerenciamento de transações financeiras e controle de usuários. Sua arquitetura modular e intuitiva facilita a personalização e expansão, tornando-o ideal para aplicações empresariais e pessoais. Experimente e adapte-o para atender às suas necessidades específicas.

