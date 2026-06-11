
# Documentação Técnica: Sistema de Gestão — PerPart

## 1. Visão Geral do Projeto

O sistema é uma aplicação *Full Stack* voltada para a gestão de usuários, produtos e categorias. Ele foi desenvolvido como um desafio técnico para a PerPart e conta com funcionalidades completas de autenticação, níveis de acesso (Usuário e Administrador), auditoria de ações, sistema de favoritos e notificações.

O projeto é dividido em três blocos principais:

* **Backend:** API RESTful construída com NestJS.
* **Frontend:** Interface Web construída com Next.js (App Router).
* **Infraestrutura:** Orquestração de containers com Docker e Docker Compose, utilizando PostgreSQL como banco de dados.

---

## 2. Arquitetura e Tecnologias

### 2.1 Backend

* **Framework Principal:** NestJS (v11) com TypeScript.
* **Banco de Dados & ORM:** PostgreSQL manipulado através do TypeORM.
* **Autenticação:** JWT (JSON Web Tokens) com Passport e BcryptJS para hash de senhas.
* **Upload de Arquivos:** Multer para armazenamento local (uploads de avatares e imagens de produtos).
* **Documentação da API:** Swagger (disponível na rota `/api/docs`).

### 2.2 Frontend

* **Framework Principal:** Next.js (v16.2.4) utilizando a nova estrutura de `app/`.
* **Linguagem:** TypeScript.
* **Interface (UI):** Biblioteca oficial do Governo de Pernambuco `@uigovpe/components` e `@uigovpe/styles`.
* **Gerenciamento de Estado/Formulários:** React Hook Form com Zod (validação) e Context API nativa (AuthContext).
* **Comunicação com API:** Axios com interceptadores para injeção automática do token JWT.

### 2.3 Infraestrutura

* **Docker:** Imagens baseadas em `node:20-alpine`.
* **Docker Compose:** Sobe os serviços `db` (Postgres 15), `backend` (porta 3001) e `frontend` (porta 3000) de forma integrada numa rede interna (`desafio_net`).

---

## 3. Modelagem de Dados (Entidades)

O banco de dados relacional (PostgreSQL) possui as seguintes entidades principais mapeadas via TypeORM:

1. **User (Usuários):** * Contém `id`, `name`, `email`, `password` (hash), `role` (`admin` ou `user`), e `avatarUrl`.
* Possui relacionamentos One-to-Many com Produtos, Categorias e Favoritos.


2. **Product (Produtos):**
* Contém `id`, `name`, `description`, `price` (decimal), e `imageUrl`.
* Relacionamento Many-to-One com o Criador (Owner).
* Relacionamento Many-to-Many com Categorias.


3. **Category (Categorias):**
* Contém `id`, `name`, `description` e referência ao `owner` (Usuário que criou).


4. **Favorite (Favoritos):**
* Tabela de ligação contendo o `user` e o `product`.


5. **AuditLog (Auditoria):**
* Registra ações de sistema. Contém `user`, `action`, `entity`, `entityId`, `details` (JSON) e data de criação.


6. **Notification (Notificações):**
* Contém `message`, status `isRead`, e referência ao usuário `recipient`.



---

## 4. Funcionalidades e Regras de Negócio

### 4.1 Autenticação e Autorização (`AuthModule`)

* **Registro e Login:** A API oferece rotas públicas (`/auth/register` e `/auth/login`).
* **Guards:** O sistema utiliza `JwtAuthGuard` para proteger as rotas e o `RolesGuard` combinado com o decorator `@Roles('admin')` para restringir endpoints críticos (ex: gerenciar usuários ou ver auditoria) apenas para administradores.

### 4.2 Perfis de Acesso

* **Usuário Padrão (`USER`):** Pode listar e criar produtos e categorias. Pode favoritar produtos (o que dispara uma notificação automática para o dono do produto).
* **Administrador (`ADMIN`):** Tem acesso total. Possui uma visão de *Dashboard* com métricas globais, controle total sobre o CRUD de Usuários e acesso aos Relatórios de Auditoria. O *Seeder* do banco já inicializa um admin padrão (`admin@email.com` / `padraosenhaadmin`).

### 4.3 Upload de Imagens

* A API aceita upload via `multipart/form-data` utilizando `Multer`.
* Imagens de perfil vão para `./uploads/avatars`.
* Imagens de produtos vão para `./uploads/products`.
* As pastas são servidas estaticamente pelo NestJS (via `ServeStaticModule`).

---

## 5. Estrutura de Diretórios

### Backend (`/backend/src`)

* `main.ts`, `app.module.ts`: Pontos de entrada e configuração global (CORS, Banco, Swagger).
* `run-seed.ts`, `data-source.ts`: Configurações de migração/seeding do TypeORM.
* `/auth`: Lógica de JWT, estratégias do Passport, Guards e decorators de papéis.
* `/users`, `/products`, `/categories`, `/favorites`, `/notifications`: Módulos que contêm Controller, Service e Entity referentes aos seus escopos.
* `/audit`: Módulo de geração de log de ações visível no painel do administrador.

### Frontend (`/frontend/src`)

* `app/`: Estrutura do App Router do Next.js.
* `/login`, `/register`: Páginas de entrada.
* `/dashboard`, `/usuarios`, `/produtos`, `/categorias`, `/favoritos`, `/relatorios`: Telas internas do sistema.


* `components/`: Componentes reutilizáveis como `AppLayout` (barra lateral e topbar do Governo) e `ProtectedRoute` (lida com o redirecionamento caso o usuário não esteja logado).
* `contexts/AuthContext.tsx`: Gerencia o estado global do usuário, persistindo os tokens no `localStorage`.
* `services/api.ts`: Instância do Axios que intercepta requisições para injetar o header de `Authorization: Bearer <token>` e lida com o logout automático em caso de erro `401`.

---

## 6. Configuração e Instalação Local

### Utilizando Docker (Recomendado)

A configuração de rede, banco de dados e aplicações já está pronta no `docker-compose.yml`.

```bash
# Na raiz do projeto, execute:
docker compose up --build -d

```

Serviços inicializados:

* **Frontend:** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
* **Backend API:** [http://localhost:3001](https://www.google.com/search?q=http://localhost:3001)
* **Swagger (Docs):** [http://localhost:3001/api/docs](https://www.google.com/search?q=http://localhost:3001/api/docs)

### Rodando Localmente sem Docker

Se desejar executar a aplicação localmente no terminal:

1. **Suba apenas o banco de dados:**
```bash
docker compose up db -d

```


2. **Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm run seed # (Para criar o usuário Admin padrão)
npm run start:dev

```


3. **Frontend:**
```bash
cd frontend
npm install
# (Opcional se precisar sobrescrever as vars globais) cp .env.example .env.local 
npm run dev

```
## 7. Organização do Código-Fonte
```text
📦 perpart-teste-tecnico-dev-junior
┣ 📜 docker-compose.yml       # Orquestração dos containers (db, backend, frontend)
┣ 📜 README.md                # Documentação principal do projeto
┣ 📜 .gitignore               # Arquivos ignorados pelo Git na raiz
┃
┣ 📂 backend                  # API RESTful (NestJS)
┃ ┣ 📂 src                    # Código-fonte principal do backend
┃ ┃ ┣ 📂 audit                # Módulo de Auditoria (Logs de ações do sistema)
┃ ┃ ┃ ┣ 📜 audit-log.entity.ts
┃ ┃ ┃ ┣ 📜 audit.controller.ts
┃ ┃ ┃ ┣ 📜 audit.module.ts
┃ ┃ ┃ ┗ 📜 audit.service.ts
┃ ┃ ┣ 📂 auth                 # Módulo de Autenticação e Autorização (JWT, Guards)
┃ ┃ ┃ ┣ 📜 auth.controller.ts
┃ ┃ ┃ ┣ 📜 auth.module.ts
┃ ┃ ┃ ┣ 📜 auth.service.ts
┃ ┃ ┃ ┣ 📜 jwt-auth.guard.ts  # Proteção de rotas que exigem login
┃ ┃ ┃ ┣ 📜 jwt.strategy.ts    # Estratégia de validação do token
┃ ┃ ┃ ┣ 📜 roles.decorator.ts # Decorator para definir permissões (ex: @Roles('admin'))
┃ ┃ ┃ ┗ 📜 roles.guard.ts     # Valida se o usuário tem a role necessária
┃ ┃ ┣ 📂 categories           # Módulo de Categorias de Produtos (CRUD)
┃ ┃ ┣ 📂 favorites            # Módulo de Favoritos (Relação Usuário <-> Produto)
┃ ┃ ┣ 📂 notifications        # Módulo de Notificações (ex: ao favoritar produto)
┃ ┃ ┣ 📂 products             # Módulo de Produtos (CRUD e upload de imagens)
┃ ┃ ┣ 📂 users                # Módulo de Usuários (CRUD, upload de avatar e Seeder)
┃ ┃ ┃ ┣ 📜 user.seed.ts       # Script para criar o usuário Admin inicial
┃ ┃ ┃ ┗ 📜 ... (controller, service, module, entity)
┃ ┃ ┣ 📜 app.module.ts        # Módulo raiz que importa todos os outros módulos
┃ ┃ ┣ 📜 main.ts              # Ponto de entrada da aplicação (configurações do Swagger, CORS)
┃ ┃ ┣ 📜 data-source.ts       # Configuração da conexão com o banco para o TypeORM/Seeders
┃ ┃ ┗ 📜 run-seed.ts          # Script de execução dos seeders do banco de dados
┃ ┣ 📂 test                   # Testes automatizados (e2e)
┃ ┣ 📂 uploads                # Diretório gerado dinamicamente para armazenar imagens
┃ ┃ ┣ 📂 avatars              # Fotos de perfil dos usuários
┃ ┃ ┗ 📂 products             # Imagens dos produtos
┃ ┣ 📜 .env.example           # Exemplo de variáveis de ambiente do backend
┃ ┣ 📜 Dockerfile             # Configuração da imagem Docker do backend
┃ ┗ 📜 package.json           # Dependências e scripts do backend (npm)
┃
┗ 📂 frontend                 # Interface Web (Next.js 16 + React)
  ┣ 📂 src                    # Código-fonte principal do frontend
  ┃ ┣ 📂 app                  # Estrutura de roteamento (App Router do Next.js)
  ┃ ┃ ┣ 📂 categorias         # Tela de listagem e gestão de categorias
  ┃ ┃ ┣ 📂 dashboard          # Painel do Admin (métricas de usuários, produtos, etc.)
  ┃ ┃ ┣ 📂 favoritos          # Tela de produtos favoritados pelo usuário
  ┃ ┃ ┣ 📂 login              # Tela de autenticação
  ┃ ┃ ┣ 📂 produtos           # Tela de listagem e gestão de produtos
  ┃ ┃ ┣ 📂 register           # Tela de cadastro de novos usuários
  ┃ ┃ ┣ 📂 relatorios         # Tela de visualização dos logs de auditoria (Admin)
  ┃ ┃ ┣ 📂 usuarios           # Tela de gestão de usuários (Admin)
  ┃ ┃ ┣ 📜 globals.css        # Estilos globais e configurações do Tailwind
  ┃ ┃ ┣ 📜 layout.tsx         # Layout principal da aplicação (Providers e HTML base)
  ┃ ┃ ┗ 📜 page.tsx           # Página inicial (Redireciona para o login ou painel)
  ┃ ┣ 📂 components           # Componentes React reutilizáveis
  ┃ ┃ ┣ 📜 AppLayout.tsx      # Estrutura visual da aplicação (Menu lateral, Header do Gov)
  ┃ ┃ ┗ 📜 ProtectedRoute.tsx # Componente que bloqueia o acesso a rotas não autorizadas
  ┃ ┣ 📂 contexts             # Context API do React
  ┃ ┃ ┗ 📜 AuthContext.tsx    # Gerenciamento de estado de autenticação (login, logout, token)
  ┃ ┗ 📂 services             # Configurações de serviços externos
  ┃   ┗ 📜 api.ts             # Configuração do Axios (Base URL, Interceptors para JWT)
  ┣ 📜 .env.example           # Exemplo de variáveis de ambiente do frontend
  ┣ 📜 Dockerfile             # Configuração da imagem Docker do frontend
  ┣ 📜 next.config.ts         # Configurações do compilador do Next.js
  ┗ 📜 package.json           # Dependências e scripts do frontend (npm)

```

### Principais Destaques da Estrutura:

1. **Separação Clara de Responsabilidades:** O backend adota a arquitetura modular padrão do NestJS, onde cada entidade (`users`, `products`, `auth`) possui seu próprio diretório contendo suas rotas (`controller`), regras de negócio (`service`) e modelo de banco de dados (`entity`).
2. **Next.js App Router:** O frontend utiliza o diretório `src/app`, que é o padrão mais moderno do Next.js. Cada pasta dentro de `app/` representa uma rota acessível na URL da aplicação (ex: a pasta `app/login/` corresponde à rota `/login`).
3. **Gerenciamento de Uploads:** A pasta `uploads` no backend armazena os arquivos físicos localmente. No ambiente Docker, ela é mapeada como um *volume* no `docker-compose.yml` (`uploads_data:/app/uploads`) para garantir que os arquivos não se percam quando o container for reiniciado.


---

## 8. Detalhamento de Rotas da API

Todas as rotas privadas esperam o cabeçalho HTTP `Authorization: Bearer <JWT_TOKEN>` enviado pelo cliente. Os endpoints estão divididos por módulos funcionais.

### 8.1 Autenticação (`/auth`)

Gerencia o registro de novos usuários e a geração de tokens de acesso. As rotas deste módulo são **públicas**.

| Método | Rota | Parâmetros / Body | Descrição |
| --- | --- | --- | --- |
| **POST** | `/auth/register` | **Body (JSON):**<br>

<br>`{ name, email, password }` | Registra um novo usuário comum no sistema com senha criptografada e retorna o token de acesso. |
| **POST** | `/auth/login` | **Body (JSON):**<br>

<br>`{ email, password }` | Valida as credenciais e retorna o `access_token` juntamente com os dados básicos do perfil do usuário. |

---

### 8.2 Gerenciamento de Usuários (`/users`)

Controla o ciclo de vida dos usuários e uploads de avatares. Requer autenticação global.

* **Guards Aplicados:** `JwtAuthGuard`, `RolesGuard`

| Método | Rota | Permissão | Parâmetros | Descrição |
| --- | --- | --- | --- | --- |
| **GET** | `/users` | `admin` | **Query:** `page`, `limit`, `search` | Lista os usuários cadastrados de forma paginada e permite busca textual por nome ou e-mail. |
| **GET** | `/users/me` | Qualquer usuário | Nenhum | Retorna as informações completas do perfil do usuário associado ao token atual. |
| **GET** | `/users/:id` | `admin` | **Param:** `id` (UUID) | Retorna os detalhes de um usuário específico. |
| **POST** | `/users` | `admin` | **Body (JSON):** Dados do usuário | Cria um novo usuário diretamente a partir do painel administrativo. |
| **Put** | `/users/:id` | `admin` | **Param:** `id`<br>

<br>**Body:** Dados atualizados | Atualiza cadastros de usuários (permite alteração de perfil e redefinição de senha). |
| **DELETE** | `/users/:id` | `admin` | **Param:** `id` (UUID) | Exclui definitivamente um usuário do banco de dados. |
| **POST** | `/users/:id/avatar` | Qualquer usuário | **Param:** `id`<br>

<br>**File (Multer):** `file` (imagem) | Realiza o upload da foto de perfil do usuário e a salva no diretório `./uploads/avatars`. |

---

### 8.3 Catálogo de Produtos (`/products`)

Gerencia o cadastro de itens do sistema, seus preços e vinculações de categorias.

* **Guards Aplicados:** `JwtAuthGuard`

| Método | Rota | Permissão | Parâmetros | Descrição |
| --- | --- | --- | --- | --- |
| **GET** | `/products` | Qualquer usuário | **Query:** `page`, `limit`, `search`, `categoryId` | Lista produtos de forma paginada, aceitando filtros textuais por nome e filtros específicos por categoria. |
| **GET** | `/products/:id` | Qualquer usuário | **Param:** `id` (UUID) | Busca um produto detalhado, trazendo as relações de seu criador e suas categorias. |
| **POST** | `/products` | Qualquer usuário | **Body (JSON):**<br>

<br>`{ name, description, price, categoryIds }` | Cria um novo produto vinculando-o automaticamente ao usuário autenticado que realizou a chamada. |
| **Put** | `/products/:id` | Qualquer usuário | **Param:** `id`<br>

<br>**Body:** Dados atualizados | Altera os atributos de um produto ou modifica a sua lista de categorias associadas. |
| **DELETE** | `/products/:id` | Qualquer usuário | **Param:** `id` (UUID) | Remove o produto do catálogo. |
| **POST** | `/products/:id/image` | Qualquer usuário | **Param:** `id`<br>

<br>**File (Multer):** `file` (imagem) | Faz o upload da foto do produto, salvando o arquivo físico em `./uploads/products`. |

---

### 8.4 Categorias (`/categories`)

Gerencia as categorias que classificam os produtos do sistema.

* **Guards Aplicados:** `JwtAuthGuard`

| Método | Rota | Permissão | Parâmetros | Descrição |
| --- | --- | --- | --- | --- |
| **GET** | `/categories` | Qualquer usuário | **Query:** `page`, `limit`, `search` | Lista todas as categorias cadastradas com paginação e busca por nome. |
| **GET** | `/categories/:id` | Qualquer usuário | **Param:** `id` (UUID) | Retorna os detalhes completos de uma única categoria. |
| **POST** | `/categories` | Qualquer usuário | **Body (JSON):**<br>

<br>`{ name, description }` | Cria uma nova categoria e define o usuário logado como o seu respectivo criador (`owner`). |
| **Put** | `/categories/:id` | Qualquer usuário | **Param:** `id`<br>

<br>**Body:** Dados atualizados | Modifica as informações de identificação ou descrição da categoria. |
| **DELETE** | `/categories/:id` | Qualquer usuário | **Param:** `id` (UUID) | Exclui a categoria indicada do sistema. |

---

### 8.5 Sistema de Favoritos (`/favorites`)

Permite aos usuários salvarem produtos de interesse e gerencia as notificações cruzadas do ecossistema.

* **Guards Aplicados:** `JwtAuthGuard`

| Método | Rota | Permissão | Parâmetros | Descrição |
| --- | --- | --- | --- | --- |
| **GET** | `/favorites` | Qualquer usuário | Nenhum | Retorna todos os produtos adicionados à lista de favoritos do usuário logado. |
| **POST** | `/favorites/:productId` | Qualquer usuário | **Param:** `productId` | Executa o comportamento de *Toggle*. Se o produto não for favorito, ele é adicionado; se já for, é removido. Caso o produto seja de outro usuário, uma notificação é gerada para o proprietário do item. |

---

### 8.6 Auditoria e Relatórios (`/audit`)

Permite o rastreamento normativo das ações efetuadas dentro da plataforma, garantindo a conformidade e transparência da gestão.

* **Guards Aplicados:** `JwtAuthGuard`, `RolesGuard`
* **Permissão Módulo:** Restrito a administradores (`admin`)

| Método | Rota | Parâmetros | Descrição |
| --- | --- | --- | --- |
| **GET** | `/audit` | **Query:** `page`, `limit`, `userId`, `startDate`, `endDate` | Recupera o histórico de eventos contendo a ação, entidade modificada, ID da entidade e dados contextuais estruturados (JSON). Permite filtragem avançada por operador e período temporal. |

---

### 8.7 Rotas de Verificação Base (`/`)

| Método | Rota | Permissão | Descrição |
| --- | --- | --- | --- |
| **GET** | `/` | Pública | Executa um *Health Check* simples no servidor, retornando a string fixa `"Hello World!"`. |

---
