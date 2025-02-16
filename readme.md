# 🚀 Fastify Authentication API

Este projeto é uma API de autenticação utilizando **Fastify**, **Prisma**, **JWT** e **Zod** para validação de dados.

## 🛠 Tecnologias Utilizadas
- [Fastify](https://www.fastify.io/)
- [Prisma](https://www.prisma.io/)
- [Zod](https://zod.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [Docker](https://www.docker.com/)

---

## 📦 Como Configurar o Projeto

### 1️⃣ Clonar o Repositório
```sh
  git clone <URL_DO_REPOSITORIO>
  cd nome-do-repositorio
```

### 2️⃣ Instalar as Dependências
Se estiver utilizando **pnpm** (recomendado):
```sh
pnpm install
```
Se estiver utilizando **npm**:
```sh
npm install
```

Se estiver utilizando **yarn**:
```sh
yarn install
```

### 3️⃣ Configurar Variáveis de Ambiente
Crie um arquivo **.env** na raiz do projeto e adicione as variáveis necessárias:
```env
DATABASE_URL="postgresql://root:12345@localhost:5432/fastify-auth?schema=public"
JWT_SECRET="seu-segredo-aqui"
```

---

## 🐳 Rodando o Banco de Dados com Docker
Se desejar rodar o banco de dados via **Docker**, crie um arquivo `docker-compose.yml` e adicione o seguinte conteúdo:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:latest
    container_name: fastify-db
    restart: always
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: 12345
      POSTGRES_DB: fastify-auth
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

Agora, inicie o banco de dados:
```sh
docker-compose up -d
```

---

## 📂 Estrutura do Projeto
```
📦 projeto-fastify
 ┣ 📂 src
 ┃ ┣ 📂 routes
 ┃ ┃ ┗ 📜 auth.routes.ts
 ┃ ┣ 📂 controllers
 ┃ ┃ ┗ 📜 auth.controller.ts
 ┃ ┣ 📂 utils
 ┃ ┃ ┗ 📜 validate-schema.ts
 ┃ ┣ 📜 server.ts
 ┃ ┣ 📜 env.ts
 ┣ 📜 .env
 ┣ 📜 package.json
 ┣ 📜 tsconfig.json
 ┗ 📜 README.md
```

---

## 🔥 Rodando a API

### 1️⃣ Criar as Migrações do Prisma
Antes de rodar a API, execute:
```sh
pnpm prisma migrate dev
```

Se estiver usando **npm**:
```sh
npm run prisma migrate dev
```

### 2️⃣ Iniciar o Servidor
Para rodar a API em modo de desenvolvimento:
```sh
pnpm dev
```

Para rodar com **npm**:
```sh
npm run dev
```

Se estiver usando **yarn**:
```sh
yarn dev
```

---

## 🔑 Rotas Disponíveis

### 🔹 **POST /register**
Cria um novo usuário.
#### **Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123",
  "name": "User Name"
}
```

### 🔹 **POST /login**
Gera um token de autenticação JWT.
#### **Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

### 🔹 **POST /refresh-token**
Gera um novo token de acesso a partir do `refreshToken`.
#### **Body:**
```json
{
  "refreshToken": "token-aqui"
}
```

### 🔹 **GET /protected (Autenticado)**
Exemplo de rota protegida.
#### **Headers:**
```json
{
  "Authorization": "Bearer seu_token_aqui"
}
```

---

## 🔒 Criando uma Rota Protegida
Para criar uma rota autenticada, utilize o `preHandler` do Fastify:

```ts
fastify.get('/protected', {
  preHandler: [fastify.authenticate]
}, async (request, reply) => {
  return { message: 'Você acessou uma rota protegida!' };
});
```

---

## 🛠 Alias de Path no TypeScript
Para configurar **alias paths** no projeto, edite o `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@routes/*": ["src/routes/*"],
      "@controllers/*": ["src/controllers/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

Depois, instale `tsconfig-paths` para resolver os aliases:
```sh
pnpm add tsconfig-paths
```

Atualize o `package.json`:
```json
{
  "scripts": {
    "dev": "ts-node -r tsconfig-paths/register src/server.ts"
  }
}
```

Agora, importe arquivos usando aliases:
```ts
import { validateSchema } from '@utils/validate-schema';
```

---

## 🚀 Contribuindo
1. Faça um **fork** do projeto
2. Crie uma **branch** para sua feature (`git checkout -b minha-feature`)
3. Faça o **commit** das suas alterações (`git commit -m 'feat: Minha nova funcionalidade'`)
4. Faça um **push** para a branch (`git push origin minha-feature`)
5. Abra um **Pull Request**

---

## 📜 Licença
Este projeto está sob a licença **MIT**.

