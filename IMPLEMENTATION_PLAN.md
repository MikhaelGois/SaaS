# 📋 PLANO DE IMPLEMENTAÇÃO DETALHADO - MVP

## ⚡ Quick Start (Próximos Passos Imediatos)

### 1. **Validar & Completar Autenticação** (TODAY)

**Status:** ~70% pronto (tem bugs potenciais)

**Problemas encontrados:**
- [ ] Import errado em `register.dto.ts`: `UserRole` vem de `../../../backend/prisma/schema.prisma` - isso não funciona em TS puro
- [ ] `jwt.constants.ts` não foi verificado - pode não ter SECRET configurado
- [ ] `JwtStrategy` não foi implementado

**Actions:**
```bash
# 1. Fix: Create a proper UserRole enum na pasta src/
# 2. Fix: Verify jwt.constants.ts
# 3. Implement: JwtStrategy with Passport
# 4. Add: @UseGuards(JwtAuthGuard) nos controllers
# 5. Test: Manual test com Postman
```

---

### 2. **Setup Database & Migrações**

**Status:** Prisma schema pronto, migrations não aplicadas

```bash
# 1. Create .env.local
DATABASE_URL="postgresql://user:pass@localhost:5432/pdv_db"
JWT_SECRET="your-super-secret-key-min-32chars"
JWT_EXPIRATION="60m"

# 2. Apply migrations
npx prisma migrate dev --name init

# 3. Seed de exemplo (opcional)
npx prisma db seed
```

---

### 3. **Completar Módulos Backend (Ordem de Prioridade)**

| # | Módulo | Status | Tempo Est. | Prioridade |
|---|--------|--------|-----------|-----------|
| 1 | **Auth (JWT)** | 70% | 1h | 🔴 ALTA |
| 2 | **Prisma ORM** | 100% | - | 🔴 ALTA |
| 3 | **Product/Category** | 0% | 2h | 🟠 MÉDIA |
| 4 | **Ingredient/Stock** | 0% | 3h | 🟠 MÉDIA |
| 5 | **Order Service** | 0% | 4h | 🔴 ALTA |
| 6 | **Payment Integration** | 0% | 5h | 🟠 MÉDIA |
| 7 | **WebSocket Gateway** | 0% | 3h | 🟠 MÉDIA |
| 8 | **WhatsApp Integration** | 0% | 2h | 🟡 BAIXA |
| 9 | **Audit Logging** | 0% | 2h | 🟡 BAIXA |

---

### 4. **Dependências a Instalar**

```bash
# Já existentes:
# ✅ @nestjs/* (core, jwt, passport, websockets)
# ✅ prisma, @prisma/client
# ✅ bcrypt, class-validator
# ✅ socket.io, ioredis
# ✅ passport-jwt

# Ainda precisa:
# ❌ stripe ou mercado-pago SDK
# ❌ axios para WhatsApp API
# ❌ qrcode (geração de QR dinâmico)
```

---

### 5. **Próximas Tarefas (Ordem Recomendada)**

**HOJE:**
- [ ] Fix Auth imports (UserRole enum)
- [ ] Verify JWT constants
- [ ] Implement JwtStrategy
- [ ] Create RolesGuard
- [ ] Test login/register endpoints

**AMANHÃ:**
- [ ] Product CRUD Controller + Service
- [ ] Category CRUD Controller + Service
- [ ] Ingredient CRUD Controller + Service
- [ ] Stock Service (decrementar, alertas)

**DIA 3:**
- [ ] Order CRUD (criar, listar, atualizar status)
- [ ] WebSocket setup para atualizações em tempo real
- [ ] OrderItem decrementação automática de estoque

**DIA 4:**
- [ ] Payment service com Pix integration
- [ ] Webhook handler
- [ ] QR code geração

**DIA 5:**
- [ ] WhatsApp notificações
- [ ] Audit logging
- [ ] Frontend setup

---

## 🚀 Executar Imediatamente

Depois de ler este arquivo, execute:

```bash
cd c:\Users\MBalieroDG\OneDrive\ -\ Luxottica\ Group\ S.p.A\Área\ de\ Trabalho\dev\Nova\ pasta\ \(2\)\pdv

# 1. Install deps (if not done)
npm install

# 2. Check for TypeScript errors
npm run lint

# 3. Try to build
npm run build

# 4. See what breaks and fix
```

---

**Próximo:** Vai receber instruções específicas para completar a Auth.
