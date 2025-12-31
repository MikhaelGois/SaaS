# 🚀 INÍCIO RÁPIDO - PDV SaaS

## 📋 O que foi feito até agora

✅ **Autenticação & Autorização completa**
- Login/Register com JWT
- 4 papéis: ADMIN, MANAGER, CASHIER, WAITER
- RolesGuard para proteção de rotas

✅ **Módulo de Produtos & Categorias**
- CRUD completo
- Validação de categorias
- Filtros por categoria

✅ **Módulo de Ingredientes & Estoque**
- CRUD de ingredientes
- Ajuste manual de stock
- Alertas de mínimo
- Histórico de movimentações

✅ **Documentação & Guias**
- API Testing Guide
- Roadmap completo
- Implementation Plan
- Progress tracking

---

## 🔧 Setup Inicial

### 1. Clonar projeto e instalar dependências
```bash
cd "c:\Users\MBalieroDG\OneDrive - Luxottica Group S.p.A\Área de Trabalho\dev\Nova pasta (2)\pdv"
npm install
```

### 2. Criar arquivo .env.local
```bash
cp .env.example .env.local
```

**Editar `.env.local` com suas credenciais:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pdv_dev"
JWT_SECRET="dev-secret-key-32-chars-minimum"
JWT_EXPIRATION="24h"
PORT=3000
```

### 3. Iniciar PostgreSQL (se tiver Docker)
```bash
docker run --name pdv-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15
```

### 4. Aplicar migrations Prisma
```bash
npx prisma migrate dev --name init
```

### 5. (Opcional) Seed de dados de exemplo
```bash
npx prisma db seed
```

### 6. Iniciar servidor em modo desenvolvimento
```bash
npm run start:dev
```

**Servidor estará rodando em:** http://localhost:3000

---

## 📚 Documentação Disponível

### Para Testar API
- **[API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)** - Como testar endpoints de auth
- **[PRODUCTS_API.md](PRODUCTS_API.md)** - Documentação completa de produtos
- **[INGREDIENTS_API.md](INGREDIENTS_API.md)** - Documentação completa de ingredientes

### Para Entender o Projeto
- **[ROADMAP.md](ROADMAP.md)** - Roadmap do MVP e v2
- **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - Plano de execução
- **[PROGRESS.md](PROGRESS.md)** - Status atual do desenvolvimento

---

## 🔗 Endpoints Disponíveis Agora

### 🔐 Autenticação
```
POST   /auth/register     - Criar novo usuário
POST   /auth/login        - Fazer login
```

### 🏷️ Categorias
```
GET    /categories        - Listar todas
POST   /categories        - Criar (MANAGER, ADMIN)
GET    /categories/:id    - Obter uma
PATCH  /categories/:id    - Atualizar (MANAGER, ADMIN)
DELETE /categories/:id    - Deletar (MANAGER, ADMIN)
```

### 🍔 Produtos
```
GET    /products          - Listar todas
POST   /products          - Criar (MANAGER, ADMIN)
GET    /products/:id      - Obter um
PATCH  /products/:id      - Atualizar (MANAGER, ADMIN)
DELETE /products/:id      - Deletar (MANAGER, ADMIN)
```

### 🧂 Ingredientes
```
GET    /ingredients               - Listar todas
POST   /ingredients               - Criar (MANAGER, ADMIN)
GET    /ingredients/low-stock     - Ver baixos estoques (MANAGER, ADMIN)
GET    /ingredients/:id           - Obter um
GET    /ingredients/:id/movements - Ver histórico
PATCH  /ingredients/:id           - Atualizar (MANAGER, ADMIN)
POST   /ingredients/:id/adjust-stock - Ajustar stock (MANAGER, ADMIN, CASHIER)
DELETE /ingredients/:id           - Deletar (MANAGER, ADMIN)
```

---

## 💻 Exemplo de Uso (cURL)

### 1. Registrar usuário
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gerente@resto.com",
    "password": "Senha123!",
    "name": "João Gerente",
    "role": "MANAGER"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGci...",
  "user": {
    "id": "uuid-123",
    "email": "gerente@resto.com",
    "name": "João Gerente",
    "role": "MANAGER"
  }
}
```

### 2. Copiar token e usar em requisições
```bash
TOKEN="seu_token_aqui"

# Criar categoria
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Bebidas"}'

# Listar produtos
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run start:dev              # Iniciar em modo watch

# Build
npm run build                  # Compilar TypeScript

# Testes
npm run test                   # Unit tests
npm run test:watch            # Unit tests em watch mode
npm run test:e2e              # E2E tests

# Linting
npm run lint                   # Verificar código
npm run format                 # Formatar código

# Prisma
npx prisma studio            # Abrir GUI do banco
npx prisma migrate dev        # Criar nova migration
npx prisma generate          # Regenerar Prisma Client
```

---

## 📊 Estrutura de Pastas

```
pdv/
├── src/
│   ├── auth/              ✅ Autenticação completa
│   ├── product/           ✅ CRUD de produtos
│   ├── category/          ✅ CRUD de categorias
│   ├── ingredient/        ✅ CRUD de ingredientes
│   ├── order/             🚀 PRÓXIMO: Pedidos
│   ├── payment/           ⏳ TODO: Pix integration
│   ├── gateway/           ⏳ TODO: WebSockets
│   ├── whatsapp/          ⏳ TODO: Notificações
│   ├── audit/             ⏳ TODO: Auditoria
│   ├── prisma/            ✅ ORM configurado
│   ├── redis/             ⏳ TODO: Cache
│   ├── app.module.ts      ✅ Módulos registrados
│   └── main.ts            ✅ Entry point
├── backend/prisma/
│   └── schema.prisma      ✅ Data models
├── frontend/              ⏳ TODO: Next.js UI
├── test/                  ⏳ TODO: E2E tests
├── .env.example           ✅ Template
├── .env.local             ✅ Configuração local
└── package.json           ✅ Dependências
```

---

## 🎯 Próxima Tarefa: Order Service

Próximo módulo a implementar será o **Order Service**, que vai permitir:

1. Criar pedidos com validação de estoque
2. Decrementar ingredientes automaticamente
3. Atualizar status (PENDING → PREPARING → READY)
4. Suportar 3 tipos: SALOON, COUNTER, DELIVERY

**Estimado:** 2-3 horas

---

## ⚡ Troubleshooting

### Erro de conexão com PostgreSQL
```
Verifique se PostgreSQL está rodando:
- docker ps (se usar Docker)
- psql -U postgres (teste de conexão)
- Verifique DATABASE_URL em .env.local
```

### Erro de port 3000 já em uso
```bash
# Encontrar processo usando port 3000
lsof -i :3000

# Ou mudar PORT em .env.local
PORT=3001
```

### Migration falhou
```bash
# Reset banco (cuidado! deleta dados)
npx prisma migrate reset

# Ou recriar do zero
npx prisma migrate dev --name init
```

---

## 📞 Contato & Próximos Passos

1. **Testar endpoints** usando guias de API (veja PRODUCTS_API.md)
2. **Implementar Order Service** (próxima tarefa)
3. **Integrar WebSockets** para tempo real
4. **Adicionar Payment** (Pix/Stripe)
5. **Criar Frontend** (Next.js + React)

---

## 🎓 Recursos Adicionais

- **NestJS Docs:** https://docs.nestjs.com
- **Prisma Docs:** https://www.prisma.io/docs
- **JWT Guide:** https://jwt.io
- **Socket.IO:** https://socket.io/docs

---

**Projeto criado:** 31 de Dezembro de 2025  
**Stack:** Node.js + NestJS + PostgreSQL + Prisma + WebSockets + Redis  
**Status:** MVP 40% concluído

Qualquer dúvida, consulte os documentos de API ou ROADMAP.md
