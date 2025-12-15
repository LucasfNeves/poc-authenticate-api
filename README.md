# API de Autenticação - Node.js

API RESTful de autenticação desenvolvida com Node.js, Express, TypeScript e PostgreSQL seguindo os princípios de Clean Architecture.

## Tecnologias

- **Node.js** v20+
- **TypeScript** 5.9.3
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **Sequelize** - ORM
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Zod** - Validação de schemas
- **Jest** - Testes unitários e de integração
- **Winston** - Logger
- **Docker** - Containerização
- **Swagger** - Documentação da API
- **ESLint** - Linting
- **Husky + Commitlint** - Git hooks
- **GitHub Actions** - CI/CD

## Pré-requisitos

- Node.js v20+ instalado
- Docker e Docker Compose instalados
- Git instalado

## Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <repository-url>
cd autenticacao-nodejs
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
POSTGRES_PASSWORD=change-this-password
POSTGRES_DB=app
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Application Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=change-this-secret
JWT_EXPIRES_IN=24h
```

### 4. Suba os containers Docker

```bash
npm run docker:up
```

### 5. Execute o projeto

```bash
# Executar localmente
npm run dev

# OU acessar o container e executar
npm run docker:exec
# Dentro do container:
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

## API em Produção

A API está hospedada no **Render** e disponível em:

- **Base URL**: `https://poc-authenticate-api.onrender.com`
- **Todas as rotas**: Prefixadas com `/api`
- **Documentação Swagger**: `https://poc-authenticate-api.onrender.com/api/docs/`

> ⚠️ **Nota**: Por estar hospedada no Render (plano gratuito), a primeira requisição pode ter um tempo de resposta mais longo devido ao "cold start" do servidor.

## Documentação da API

A documentação Swagger está disponível em:

- **Produção**: `https://poc-authenticate-api.onrender.com/api/docs/`
- **Local**: `http://localhost:3000/api-docs`

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
│   ├── middlewares/      # Middlewares
│   └── usecase/          # Casos de uso
├── config/               # Configurações
│   ├── constant.ts       # Constantes
│   └── env.ts           # Variáveis de ambiente
├── domain/               # Camada de domínio
│   ├── value-objects/    # Value Objects (DDD)
│   └── JwtAdapter.ts     # Adaptador JWT
├── infrastructure/       # Camada de infraestrutura
│   ├── database/         # Configuração do banco
│   ├── factories/        # Factories (DI)
│   ├── http/            # Adapters HTTP
│   └── repository/       # Repositórios
├── routes/              # Definição de rotas
├── shared/              # Código compartilhado
│   └── utils/           # Utilitários e erros
└── index.ts             # Entrada da aplicação

test/
├── unit/                # Testes unitários
├── integration/         # Testes de integração
└── setup.ts             # Configuração dos testes

docker/
├── docker-compose.yaml  # Configuração Docker
└── Dockerfile           # Imagem Docker

docs/
└── swagger.json         # Documentação da API
```

## Endpoints Principais

Todos os endpoints são prefixados com `/api`:

### Autenticação

#### Cadastrar Novo Usuário (Sign-up)

```http
# Produção
POST https://poc-authenticate-api.onrender.com/api/auth/sign-up
# Local
POST http://localhost:3000/api/auth/sign-up

Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "senha123",
  "telephones": [
    {
      "area_code": 11,
      "number": 987654321
    }
  ]
}
```

#### Autenticar Usuário (Sign-in)

```http
# Produção
POST https://poc-authenticate-api.onrender.com/api/auth/sign-in
# Local
POST http://localhost:3000/api/auth/sign-in

Content-Type: application/json

{
  "email": "john@example.com",
  "password": "senha123"
}
```

#### Obter Dados do Usuário

```http
# Produção
GET https://poc-authenticate-api.onrender.com/api/user
# Local
GET http://localhost:3000/api/user

Authorization: Bearer <jwt_token>
```

Para mais detalhes sobre todos os endpoints, acesse a [documentação Swagger](#documentação-da-api).

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

# Acessar o terminal do container
npm run docker:exec
# Dentro do container:
npm run dev

# Sair do container (quando estiver dentro dele)
npm run docker:exit
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
npm run docker:exit     # Sair do container
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

- [x] Cadastro de usuários (sign-up) com validação
- [x] Hash de senhas com bcrypt
- [x] Autenticação de usuários (sign-in) com JWT
- [x] Obter dados do usuário autenticado
- [x] Validação de dados com Zod
- [x] Value Objects para domínio
- [x] Middleware de autenticação JWT
- [x] Testes unitários e de integração (75%+ cobertura)
- [x] Documentação Swagger
- [x] Logger com Winston
- [x] Docker para desenvolvimento
- [x] Clean Architecture
- [x] CI/CD com GitHub Actions
- [x] Conventional Commits
- [x] ESLint e Prettier

## CI/CD

O projeto utiliza GitHub Actions para integração e entrega contínua:

- **CI (Continuous Integration)**: Executa apenas em Pull Requests
  - Linting com ESLint
  - Testes unitários e de integração
  - Relatório de cobertura
- **CD (Continuous Deployment)**: Executa apenas na branch `main`

## Conventional Commits

Este projeto utiliza [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `test:` Testes
- `refactor:` Refatoração
- `chore:` Tarefas gerais

## Cobertura de Testes

```bash
npm run test:coverage
```

O relatório HTML estará disponível em: `coverage/lcov-report/index.html`

## Autor

**Lucas Neves**

- GitHub: [@LucasfNeves](https://github.com/LucasfNeves)
