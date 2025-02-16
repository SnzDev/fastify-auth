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
O JWT_SECRET pode ser gerado no linux usando o seguinte comando:  

```bash
openssl rand -base64 32
```

---

## 🐳 Rodando o Banco de Dados com Docker
Se desejar rodar o banco de dados via **Docker**, utilize o `docker-compose.yml` com o seguinte comando:

```sh
docker-compose up -d
```

---

## 🔥 Rodando a API

### 1️⃣ Criar as Migrações do Prisma
Antes de rodar a API, execute:
```sh
pnpm db:migrate
```

Se estiver usando **npm**:
```sh
npm run db:migrate
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

## 🚀 Contribuindo
1. Faça um **fork** do projeto
2. Crie uma **branch** para sua feature (`git checkout -b minha-feature`)
3. Faça o **commit** das suas alterações (`git commit -m 'feat: Minha nova funcionalidade'`)
4. Faça um **push** para a branch (`git push origin minha-feature`)
5. Abra um **Pull Request**

---

<!-- ## 📜 Licença
Este projeto está sob a licença **MIT**. -->

