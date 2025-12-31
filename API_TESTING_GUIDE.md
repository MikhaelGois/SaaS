# 🔐 API Authentication - Quick Test Guide

## Endpoints Disponíveis

### 1. Register (Criar novo usuário)

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gerente@restaurante.com",
    "password": "Senha123!",
    "name": "João Gerente",
    "role": "MANAGER"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-123",
    "email": "gerente@restaurante.com",
    "name": "João Gerente",
    "role": "MANAGER"
  }
}
```

---

### 2. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gerente@restaurante.com",
    "password": "Senha123!"
  }'
```

**Response:** (mesmo da register)

---

### 3. Acessar Rota Protegida (com JWT)

```bash
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer <seu_access_token_aqui>"
```

---

## Roles Disponíveis

| Role | Descrição | Permissões |
|------|-----------|-----------|
| **ADMIN** | Administrador geral | Tudo |
| **MANAGER** | Gerente do restaurante | Criar pedidos, gerenciar estoque, relatórios |
| **CASHIER** | Caixa | Fechamento de pedidos, pagamentos |
| **WAITER** | Garçom | Criar pedidos de mesa, acompanhar |

---

## Testar com Postman

1. **Criar Collection:** PDV - Restaurant Management
2. **Adicionar requests:**
   - POST /auth/register
   - POST /auth/login
   - GET /products (com JWT)
   - GET /orders (com JWT)

---

## Variáveis de Ambiente (.env.local)

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pdv_dev"
JWT_SECRET="dev-secret-key-32-chars-minimum"
JWT_EXPIRATION="24h"
PORT=3000
```

---

## Setup Inicial (PostgreSQL local)

```bash
# 1. Start PostgreSQL (se tiver Docker)
docker run --name pdv-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15

# 2. Aplicar migrações Prisma
npx prisma migrate dev --name init

# 3. Seed com dados de exemplo (opcional)
npx prisma db seed

# 4. Abrir GUI do Prisma
npx prisma studio
```

---

## Próximas Tarefas

Depois de validar Auth:

- [ ] Product CRUD (criar cardápio)
- [ ] Order Management (criar pedidos)
- [ ] WebSocket (atualizações em tempo real para KDS)
- [ ] Payment Integration (Pix)

---

**Status:** ✅ Auth implementada e pronta para teste
