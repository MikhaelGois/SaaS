# 🍽️ PDV SaaS - Sistema de Gestão de Restaurante

**Status:** MVP 40% Concluído  
**Última atualização:** 31 de Dezembro de 2025  
**Stack:** NestJS + Next.js + PostgreSQL + Prisma

---

## 🎯 Visão Geral

**PDV SaaS** é um sistema completo de gestão de restaurante (Point of Sale + Kitchen Display System + Gerenciamento de Estoque) desenvolvido com stack moderna.

### Problema Resolvido
Pequenos e médios restaurantes sofrem com:
- ❌ Erros em pedidos (manual ou desorganizado)
- ❌ Falta de controle de estoque
- ❌ Dificuldade em processar pagamentos (Pix)
- ❌ Falta de visibilidade em tempo real na cozinha
- ❌ Sem integração com WhatsApp

### Solução
✅ **PDV Unificado** (salão, balcão, delivery)  
✅ **Controle de Estoque** com alertas automáticos  
✅ **Pix/QR Code** com webhook seguro  
✅ **KDS em Tempo Real** para cozinha  
✅ **WhatsApp** para confirmações  
✅ **Dashboard** com métricas importantes  

---

## 🚀 Quick Start (5 minutos)

### 1. Clone e instale
```bash
cd pdv
npm install
```

### 2. Configure banco de dados
```bash
cp .env.example .env.local
# Editar .env.local com sua DATABASE_URL
npx prisma migrate dev --name init
```

### 3. Inicie o servidor
```bash
npm run start:dev
```

Servidor rodando em: **http://localhost:3000**

### 4. Teste um endpoint
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gerente@resto.com",
    "password": "Senha123!",
    "name": "João",
    "role": "MANAGER"
  }'
```

**Mais exemplos:** Veja [QUICKSTART.md](QUICKSTART.md)

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| **[QUICKSTART.md](QUICKSTART.md)** | ⭐ COMECE AQUI - Setup rápido |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | Visão geral com diagramas |
| **[INDEX.md](INDEX.md)** | Índice centralizado de docs |
| [ROADMAP.md](ROADMAP.md) | Roadmap MVP + v2 |
| [PROGRESS.md](PROGRESS.md) | Status atual do projeto |
| [CHECKLIST.md](CHECKLIST.md) | Checklist de desenvolvimento |
| [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md) | Como testar endpoints |
| [PRODUCTS_API.md](PRODUCTS_API.md) | Documentação API de produtos |
| [INGREDIENTS_API.md](INGREDIENTS_API.md) | Documentação API de ingredientes |
| [ORDER_SERVICE_GUIDE.md](ORDER_SERVICE_GUIDE.md) | Guia para implementar Orders |
| [SUMMARY.md](SUMMARY.md) | Resumo do que foi feito |

---

## 📊 Status Atual

### ✅ Implementado (100%)
- 🔐 **Autenticação:** Login/Register com JWT + RBAC
- 🍔 **Produtos:** CRUD com categorias
- 🧂 **Ingredientes:** Controle de estoque com alertas
- 📦 **Database:** PostgreSQL + Prisma com migrations

### 🚀 Próximo (0%)
- 📋 **Pedidos:** CRUD com validação de estoque (2-3h)
- 💳 **Pagamentos:** Pix com Stripe/Mercado Pago (2-3h)
- 📡 **WebSockets:** KDS em tempo real (2-3h)

### ⏳ Futuro (0%)
- 📱 **WhatsApp:** Notificações automáticas
- 📊 **Auditoria:** Logs de todas as ações
- 🎨 **Frontend:** Next.js + React
- 🧪 **Testes:** Jest + Playwright

---

## 🏗️ Arquitetura

```
Frontend (Next.js)
    ↓ HTTP REST
Backend (NestJS)
    ├── Auth Module (JWT + RBAC)
    ├── Product Module (CRUD)
    ├── Category Module (CRUD)
    ├── Ingredient Module (Stock)
    ├── Order Module (Pedidos) 🚀
    ├── Payment Module (Pix) ⏳
    └── Gateway Module (WebSocket) ⏳
    ↓
Database (PostgreSQL + Prisma)
```

---

## 🔗 Endpoints Disponíveis

### Autenticação
```
POST   /auth/register     - Criar novo usuário
POST   /auth/login        - Fazer login
```

### Produtos & Categorias
```
GET    /products          - Listar produtos
POST   /products          - Criar produto (MANAGER)
GET    /categories        - Listar categorias
POST   /categories        - Criar categoria (MANAGER)
```

### Ingredientes & Estoque
```
GET    /ingredients       - Listar ingredientes
POST   /ingredients       - Criar ingrediente (MANAGER)
GET    /ingredients/low-stock - Ver estoque baixo (MANAGER)
POST   /ingredients/:id/adjust-stock - Ajustar stock (CASHIER+)
```

**Documentação completa:** Veja [PRODUCTS_API.md](PRODUCTS_API.md) e [INGREDIENTS_API.md](INGREDIENTS_API.md)

---

## 👥 Papéis (RBAC)

| Papel | Permissões |
|-------|-----------|
| **ADMIN** | Acesso total |
| **MANAGER** | Gerenciar menu, estoque, relatórios |
| **CASHIER** | Processar pagamentos, fechar pedidos |
| **WAITER** | Criar pedidos, acompanhar |

---

## 🛠️ Tech Stack

### Backend
- **NestJS 11** - Framework robusta para APIs
- **TypeScript** - Type safety
- **PostgreSQL** - Banco de dados
- **Prisma 4** - ORM moderno
- **JWT + Passport** - Autenticação segura
- **Bcrypt** - Hash de senhas
- **class-validator** - Validação de dados

### Frontend (Em breve)
- **Next.js 14** - React com SSR
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Socket.IO** - WebSockets

### Integrações (Em breve)
- **Stripe/Mercado Pago** - Pagamento Pix
- **WhatsApp Cloud API** - Notificações
- **Redis** - Cache e filas

---

## 📦 Como Instalar

### Requisitos
- Node.js 20+
- npm 10+
- PostgreSQL 15+ (ou Docker)

### Passo a Passo

```bash
# 1. Clone o repositório
git clone <seu-repo>
cd pdv

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com seus valores

# 4. Crie banco de dados
npx prisma migrate dev --name init

# 5. Inicie em desenvolvimento
npm run start:dev
```

**PostgreSQL Local (com Docker):**
```bash
docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15
```

---

## 🧪 Testes

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

---

## 🔒 Segurança

✅ **Implementado:**
- Bcrypt para senhas
- JWT com expiração
- CORS ativado
- Validação de entrada (class-validator)
- RBAC (Role-Based Access Control)
- Proteção de rotas com JwtAuthGuard

⏳ **Planejado:**
- Rate limiting
- HTTPS em produção
- LGPD compliance
- Criptografia de dados sensíveis

---

## 📈 Métricas do Projeto

```
Total Arquivos Código:     15+ módulos
Total Documentação:        12 arquivos
Linhas de Código:          ~2000 (backend)
Linhas Documentação:       ~8000
DTOs:                      8+
Services:                  5+
Controllers:               4+
Modules NestJS:            6+
```

---

## 🎯 Roadmap

### MVP (v1.0) - 2 semanas
- [x] Auth + RBAC
- [x] Produtos + Categorias
- [x] Ingredientes + Estoque
- [ ] Pedidos
- [ ] Pagamentos (Pix)
- [ ] WebSockets (KDS)
- [ ] Frontend básico

### v1.1 - 1 semana
- [ ] WhatsApp Notifications
- [ ] Auditoria & Logs
- [ ] Testes completos
- [ ] Deploy em staging

### v2.0 - Futuro
- [ ] Impressora térmica
- [ ] Menu QR para cliente
- [ ] Delivery com rotas
- [ ] Recomendações ML
- [ ] Mobile app (React Native)
- [ ] NFC-e (integração fiscal)

---

## 🤝 Como Contribuir

1. **Leia:** [QUICKSTART.md](QUICKSTART.md)
2. **Entenda:** [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Implemente:** Siga o [CHECKLIST.md](CHECKLIST.md)
4. **Teste:** Com curl ou Postman
5. **Commit:** Com mensagem descritiva

**Próxima tarefa:** [ORDER_SERVICE_GUIDE.md](ORDER_SERVICE_GUIDE.md)

---

## 📞 Suporte

### Documentação
- [Guias completos](INDEX.md)
- [API Testing](API_TESTING_GUIDE.md)
- [Troubleshooting](QUICKSTART.md#troubleshooting)

### Recursos Externos
- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [JWT.io](https://jwt.io)

---

## 📄 Licença

MIT License - Veja LICENSE.md para detalhes

---

## 👨‍💻 Autor

Desenvolvido como MVP de SaaS para gestão de restaurantes.

**Data:** 31 de Dezembro de 2025  
**Status:** 40% do MVP concluído  
**Próxima Fase:** Order Service + Pagamentos

---

## ⭐ Se este projeto ajudou, deixe uma star!

```
git clone <seu-repo>
cd pdv
npm install
npm run start:dev
```

Boa sorte! 🚀

---

**Última atualização:** 31/12/2025  
**Mantido por:** Seu nome aqui  
**Versão:** 0.4.0-alpha
