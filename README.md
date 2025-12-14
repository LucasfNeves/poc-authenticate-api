# API de Autenticação - Node.js

API RESTful de autenticação desenvolvida com Node.js, Express, TypeScript e PostgreSQL.

## Tecnologias

- **Node.js** v20.13.1
- **TypeScript** 5.9.3
- **Express.js** - Framework web
- **PostgreSQL** 14.3 - Banco de dados
- **Sequelize** - ORM
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Zod** - Validação de schemas
- **Jest** - Testes unitários e de integração
- **Winston** - Logger profissional
- **Docker** - Containerização
- **Swagger** - Documentação da API
- **ESLint + Prettier** - Code quality
- **Husky + Commitlint** - Git hooks

## Pré-requisitos

- Node.js v20+ instalado
- Docker e Docker Compose instalados
- Git instalado

## Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/LucasfNeves/poc-authenticate-api.git
cd poc-authenticate-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=app
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Application Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=15m
```

### 4. Suba os containers Docker

```bash
npm run docker:up
```

### 5. Execute as migrações do banco de dados

```bash
# Acesse o container
npm run docker:exec

# Dentro do container, rode as migrações (quando implementadas)
# npm run migrate
```

### 6. Execute o projeto

```bash
npm run dev
```

A API estará disponível em: `http://localhost:3000`

### Modo Produção

```bash
# Build do projeto
npm run build

# Inicie o servidor
npm start
```

## Documentação da API

### Acesso Local

A documentação Swagger está disponível em:

```
http://localhost:3000/api-docs
```

### Acesso em Produção

<!-- TODO: Atualizar com a URL de produção quando disponível -->

```
https://sua-api-em-producao.com/api-docs
```

## Testes

### Executar todos os testes

```bash
npm test
```

### Executar testes em modo watch

```bash
npm run test:watch
```

### Executar testes com cobertura

```bash
npm run test:coverage
```

O relatório de cobertura HTML estará disponível em: `coverage/index.html`

## Estrutura do Projeto

```
src/
├── application/           # Camada de aplicação
│   ├── controller/       # Controllers HTTP
│   ├── usecase/          # Casos de uso
│   └── schemas/          # Schemas de validação (Zod)
├── domain/               # Camada de domínio
│   ├── value-objects/    # Value Objects (DDD)
│   └── JwtAdapter.ts     # Adaptador JWT
├── infrastructure/       # Camada de infraestrutura
│   ├── database/         # Configuração e models do DB
│   ├── factories/        # Factories (DI)
│   ├── http/            # Adapters HTTP
│   └── repository/       # Repositórios (InMemory e Sequelize)
├── routes/              # Definição de rotas
├── shared/              # Código compartilhado
│   └── utils/           # Utilitários e erros
├── config/              # Configurações
└── index.ts             # Entrada da aplicação

test/
├── unit/                # Testes unitários
└── integration/         # Testes de integração
```

## Endpoints Principais

### Autenticação

#### Registrar Novo Usuário

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "senha123"
}
```

Para mais detalhes sobre todos os endpoints, acesse a [documentação Swagger](#-documentação-da-api).

## Comandos Docker

```bash
# Subir os containers
npm run docker:up

# Parar os containers
npm run docker:down

# Reiniciar os containers
npm run docker:restart

# Ver logs dos containers
npm run docker:logs

# Acessar o terminal do container backend
npm run docker:exec
```

## Scripts Disponíveis

```bash
npm run dev              # Inicia o servidor em modo desenvolvimento
npm run build           # Compila o TypeScript para JavaScript
npm start               # Inicia o servidor em produção
npm test                # Executa os testes
npm run test:watch      # Executa os testes em modo watch
npm run test:coverage   # Executa os testes com relatório de cobertura
npm run lint            # Verifica o código com ESLint
npm run lint:fix        # Corrige problemas do ESLint automaticamente
```

## Arquitetura

O projeto segue os princípios de **Clean Architecture** com 3 camadas principais:

1. **Domain (Domínio)**: Lógica de negócio pura, Value Objects
2. **Application (Aplicação)**: Use Cases, Controllers, Schemas
3. **Infrastructure (Infraestrutura)**: Banco de dados, Repositórios, HTTP, Factories

### Padrões Utilizados

- **Repository Pattern**: Abstração de acesso a dados
- **Factory Pattern**: Criação de dependências (DI)
- **Value Objects**: Validação de domínio
- **Use Cases**: Lógica de negócio isolada
- **Adapter Pattern**: Desacoplamento de bibliotecas externas

## Funcionalidades

- [x] Registro de usuários com validação
- [x] Hash de senhas com bcrypt
- [x] Geração de JWT e Refresh Tokens
- [x] Validação de dados com Zod
- [x] Value Objects para domínio
- [x] Testes unitários e de integração
- [x] Documentação Swagger
- [x] Logger com Winston
- [x] Docker para desenvolvimento
- [ ] Login de usuários
- [ ] Refresh Token
- [ ] Middleware de autenticação

### Conventional Commits

Este projeto utiliza [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `test:` Testes
- `refactor:` Refatoração
- `chore:` Tarefas gerais

## Autor

**Lucas Neves**

- GitHub: [@LucasfNeves](https://github.com/LucasfNeves)
