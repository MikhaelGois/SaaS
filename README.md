# 🍽️ PDV Restaurant - Sistema SaaS de Gerenciamento de Restaurante

> **Sistema completo de Ponto de Venda (PDV) para restaurantes, bares e lanchonetes com interface web moderna, gerenciamento de estoque, pedidos em tempo real e análise de vendas.**

[![Status](https://img.shields.io/badge/status-MVP%20Completo-success?style=flat-square)](https://github.com/MikhaelGois/SaaS)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=flat-square)](frontend/)
[![Backend](https://img.shields.io/badge/Backend-NestJS-red?style=flat-square)](pdv/)

## 🎯 Visão Geral

Este é um **Sistema SaaS completo** de gerenciamento de restaurante desenvolvido em **Next.js 14** (Frontend) e **NestJS** (Backend), com funcionalidades de:

- ✅ **Ponto de Venda (PDV)** - Criação de pedidos por garçons/atendentes
- ✅ **Kitchen Display System (KDS)** - Exibição de pedidos na cozinha em tempo real
- ✅ **Gestão de Estoque** - Controle de ingredientes e alertas de baixo estoque
- ✅ **Dashboard de Análise** - Estatísticas de vendas e receita
- ✅ **Autenticação JWT** - Segurança com controle de acesso por role
- ✅ **WebSocket em Tempo Real** - Sincronização instantânea entre garçom e cozinha

## 📊 Arquitetura do Projeto

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                   │
│  ├─ Login / Autenticação                               │
│  ├─ Menu / PDV (Criação de Pedidos)                   │
│  ├─ KDS (Kitchen Display System)                      │
│  ├─ Estoque (Gerenciamento de Ingredientes)          │
│  └─ Relatórios (Dashboard)                            │
├─────────────────────────────────────────────────────────┤
│                    Backend (NestJS)                     │
│  ├─ Auth Module (JWT)                                 │
│  ├─ Products & Categories                             │
│  ├─ Orders & Order Items                              │
│  ├─ Ingredients & Stock Management                    │
│  ├─ Payments & PIX Integration                        │
│  ├─ WebSocket Gateway (Real-time)                     │
│  └─ Redis (Cache & Sessions)                          │
├─────────────────────────────────────────────────────────┤
│                   Database (PostgreSQL)                 │
│  ├─ Users (Staff)                                     │
│  ├─ Products & Categories                             │
│  ├─ Orders & Order Items                              │
│  ├─ Ingredients & Stock Levels                        │
│  ├─ Payments & Transactions                           │
│  ├─ Tables & Occupancy                                │
│  └─ Audit Logs                                        │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 13+ ([Download](https://www.postgresql.org/download/)) ou **Docker**
- **Git** ([Download](https://git-scm.com/))

### 1️⃣ Clonar Repositório

```bash
git clone https://github.com/MikhaelGois/SaaS.git
cd SaaS
```

### 2️⃣ Instalar Dependências

**Backend:**
```bash
cd pdv
npm install
```

**Frontend:**
```bash
cd frontend
npm install --legacy-peer-deps
```

### 3️⃣ Configurar Variáveis de Ambiente

**Backend** (`pdv/.env`):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurant_pdv?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="sua-chave-secreta-super-segura-aqui"
PORT=3000
NODE_ENV=development
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4️⃣ Iniciar Database

#### Com Docker (Recomendado):
```bash
cd pdv
docker-compose up -d
```

#### Ou PostgreSQL Local:
```bash
# Criar banco de dados
createdb restaurant_pdv

# Configurar usuario
psql -U postgres -d restaurant_pdv -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

### 5️⃣ Executar Migrations e Seed

```bash
cd pdv

# Gerar Prisma Client
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Popular dados de teste
npm run prisma:seed
```

### 6️⃣ Iniciar Aplicação

**Terminal 1 - Backend:**
```bash
cd pdv
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7️⃣ Acessar Sistema

- 🌐 **Frontend**: http://localhost:3001
- 🔌 **API**: http://localhost:3000
- 📚 **Swagger API**: http://localhost:3000/api

### 📝 Credenciais de Teste

| Campo | Valor |
|-------|-------|
| **Email** | gerente@restaurante.com |
| **Senha** | senha123 |
| **Role** | MANAGER |

## 📄 Funcionalidades Detalhadas

### 1. **Login & Autenticação** 🔐

- Autenticação com email e senha
- Token JWT armazenado em localStorage
- Auto-logout em caso de token expirado
- Controle de acesso por role (ADMIN, MANAGER, CASHIER, WAITER)

```
POST /auth/login
{
  "email": "gerente@restaurante.com",
  "password": "senha123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "gerente@restaurante.com",
    "name": "Gerente Teste",
    "role": "MANAGER"
  }
}
```

### 2. **Menu/PDV - Criação de Pedidos** 🛒

**Funcionalidades:**
- Listagem de produtos por categoria
- Carrinho dinâmico com quantidade
- **3 tipos de pedido:**
  - 🏪 **Salão**: Seleção de mesa
  - 🛵 **Balcão**: Nome do cliente
  - 🚗 **Delivery**: Nome, telefone, endereço
- Adição de observações
- Cálculo automático de total

```
POST /orders
{
  "items": [
    { "productId": "uuid", "quantity": 2 },
    { "productId": "uuid", "quantity": 1 }
  ],
  "type": "SALOON",
  "tableId": "uuid",
  "notes": "Sem cebola, sem maionese"
}
```

### 3. **KDS - Kitchen Display System** 👨‍🍳

- Exibição em tempo real de pedidos via **WebSocket**
- Filtro por status: PENDING → PREPARING → READY
- Alertas de som para novos pedidos
- Interface otimizada para cozinha (dark mode)
- Atualização instantânea do status

**WebSocket Events:**
```javascript
// Cliente conecta ao KDS
socket.emit('connect', { name: 'Cozinha A' });

// Recebe novo pedido
socket.on('newOrder', (order) => {
  playSound('new_order');
  updateOrdersList(order);
});

// Atualiza status
socket.emit('orderStatusChanged', {
  orderId: 'uuid',
  status: 'PREPARING'
});
```

### 4. **Gestão de Estoque** 📦

- Listagem de ingredientes com níveis de estoque
- Indicadores de status:
  - ✅ **OK** (verde) - Acima do mínimo
  - ⚠️ **Baixo** (laranja) - Entre 1x e 1.5x do mínimo
  - ❌ **Crítico** (vermelho) - Abaixo do mínimo
- Filtro para apenas itens com baixo estoque
- Resumo de quantidades

```
GET /ingredients
GET /ingredients/low-stock

Response:
[
  {
    "id": "uuid",
    "name": "Carne Moída",
    "stock": 2500,
    "minStockAlert": 1000,
    "unit": "g",
    "status": "ok"
  }
]
```

### 5. **Dashboard de Análise** 📊

- Total de pedidos
- Pedidos completados
- Receita total (confirmada)
- Ticket médio
- Taxa de conclusão
- Preparado para integração com Recharts/Chart.js

```
GET /orders
GET /payments/stats/overview

Métricas:
- Total Orders: 150
- Completed Orders: 125
- Total Revenue: R$ 3.500,00
- Ticket Average: R$ 28,00
```

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** - Framework React moderno
- **TypeScript 5** - Type safety
- **Axios** - Cliente HTTP com interceptores
- **Socket.IO Client** - WebSocket
- **CSS Modules** - Estilos scoped
- **React Context** - State management

### Backend
- **NestJS 11** - Framework Node.js robusto
- **Prisma ORM** - Acesso ao banco de dados
- **PostgreSQL** - Banco relacional
- **Redis** - Cache e sessions
- **Socket.IO** - WebSocket server
- **JWT** - Autenticação

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração local

## 📈 Endpoints da API

### Autenticação
```
POST   /auth/login          - Login
POST   /auth/register       - Registrar usuário
POST   /auth/logout         - Logout
```

### Produtos & Categorias
```
GET    /products            - Listar produtos
GET    /products/:id        - Obter produto
POST   /products            - Criar produto
PATCH  /products/:id        - Atualizar produto
DELETE /products/:id        - Deletar produto
GET    /categories          - Listar categorias
POST   /categories          - Criar categoria
```

### Pedidos
```
GET    /orders              - Listar pedidos
GET    /orders/:id          - Obter pedido
POST   /orders              - Criar pedido
PATCH  /orders/:id/status   - Atualizar status
GET    /orders/status/:status - Filtrar por status
GET    /orders/table/:tableId - Pedidos da mesa
DELETE /orders/:id          - Deletar pedido
```

### Ingredientes
```
GET    /ingredients         - Listar ingredientes
GET    /ingredients/:id     - Obter ingrediente
GET    /ingredients/low-stock - Itens com baixo estoque
POST   /ingredients         - Criar ingrediente
PATCH  /ingredients/:id     - Atualizar ingrediente
POST   /ingredients/:id/adjust-stock - Ajustar estoque
GET    /ingredients/:id/movements - Histórico
```

### Mesas
```
GET    /tables              - Listar mesas
GET    /tables/:id          - Obter mesa
GET    /tables/stats/occupancy - Estatísticas
POST   /tables              - Criar mesa
PATCH  /tables/:id          - Atualizar mesa
DELETE /tables/:id          - Deletar mesa
```

### Pagamentos
```
GET    /payments            - Listar pagamentos
POST   /payments            - Criar pagamento
GET    /payments/order/:orderId - Pagamentos do pedido
POST   /payments/pix/qr     - Gerar QR code PIX
GET    /payments/stats/overview - Estatísticas
```

### WebSocket
```
WS     /kitchen             - Namespace para KDS
  - newOrder               - Novo pedido na cozinha
  - orderStatusChanged     - Status mudou
  - playSound              - Tocar som de alerta
```

## 🔐 Controle de Acesso

| Recurso | ADMIN | MANAGER | CASHIER | WAITER |
|---------|-------|---------|---------|--------|
| Menu/PDV | ✅ | ✅ | ✅ | ✅ |
| KDS | ✅ | ✅ | ❌ | ❌ |
| Estoque | ✅ | ✅ | ❌ | ❌ |
| Relatórios | ✅ | ✅ | ❌ | ❌ |
| Gerenciar Usuários | ✅ | ❌ | ❌ | ❌ |
| Gestão de Produtos | ✅ | ✅ | ❌ | ❌ |

## 📁 Estrutura de Diretórios

```
.
├── pdv/                          # Backend NestJS
│   ├── src/
│   │   ├── auth/                # Autenticação
│   │   ├── products/            # Produtos & Categorias
│   │   ├── orders/              # Pedidos
│   │   ├── ingredients/         # Estoque
│   │   ├── payments/            # Pagamentos
│   │   ├── tables/              # Mesas
│   │   ├── gateway/             # WebSocket
│   │   ├── audit/               # Auditoria
│   │   ├── prisma/              # ORM
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma        # Schema do banco
│   │   └── seed.ts              # Dados de teste
│   ├── package.json
│   └── .env
│
├── frontend/                     # Frontend Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/           # Página de login
│   │   │   ├── menu/            # PDV
│   │   │   ├── kds/             # Kitchen Display
│   │   │   ├── stock/           # Estoque
│   │   │   ├── reports/         # Dashboard
│   │   │   ├── layout.tsx       # Layout com AuthProvider
│   │   │   ├── page.tsx         # Home redirect
│   │   │   └── globals.css
│   │   └── lib/
│   │       ├── api.ts           # API client
│   │       └── auth-context.tsx # Auth state
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local
│
├── docker-compose.yml           # Containers (PostgreSQL, Redis)
├── .gitignore
└── README.md
```

## 🧪 Testes

### Executar Testes Backend
```bash
cd pdv

# Testes unitários
npm run test

# Testes com coverage
npm run test:cov

# Testes end-to-end
npm run test:e2e
```

## 📱 Responsividade

- ✅ Desktop (1920px+)
- ✅ Tablet (768px+)
- ✅ Mobile (320px+)

Todas as páginas são mobile-responsive com CSS Grid e Flexbox.

## 🔄 Fluxo de Pedido Completo

```
1. GARÇOM acessa Menu/PDV
   ↓
2. Seleciona produtos → Carrinho
   ↓
3. Escolhe tipo: Salão/Balcão/Delivery
   ↓
4. Confirma pedido → POST /orders
   ↓
5. COZINHA recebe via WebSocket (newOrder)
   ↓
6. Toca alarme sonoro automaticamente
   ↓
7. Cozinha avança status: PENDING → PREPARING → READY
   ↓
8. GARÇOM vê atualização em tempo real
   ↓
9. GERENTE acompanha em Dashboard
   ↓
10. Pedido finalizado com pagamento
```

## 🐛 Troubleshooting

### "Can't reach database server"
```bash
# Verifique se PostgreSQL está rodando
psql -U postgres

# Ou com Docker
docker-compose ps
```

### "Token inválido"
```bash
# Limpe localStorage no navegador
localStorage.clear()

# E faça novo login
```

### "WebSocket não conecta no KDS"
```bash
# Verifique se backend está rodando na porta 3000
curl http://localhost:3000/health

# Verifique CORS no main.ts
```

### "Erro ao criar pedido"
```bash
# Verifique se migrations foram executadas
npm run prisma:migrate

# Verifique se seed foi executado
npm run prisma:seed
```

## 📚 Documentação Adicional

- 📖 [Guia de Setup Completo](pdv/FRONTEND_REVIEW.md)
- 🏗️ [Arquitetura do Projeto](ARCHITECTURE.md)
- 🧪 [Guia de Testes](TESTING_GUIDE.md)
- 🚀 [Guia de Deploy](DEPLOYMENT_GUIDE.md)
- 📋 [Checklist MVP](CHECKLIST.md)

## 🚀 Deployment

### Heroku / Railway
```bash
# Deploy Backend
git push heroku main:main

# Deploy Frontend (Vercel)
vercel deploy --prod
```

### Docker
```bash
# Build images
docker build -t pdv-backend ./pdv
docker build -t pdv-frontend ./frontend

# Run containers
docker-compose up -d
```

## 📝 Licença

Este projeto está sob a licença **MIT**. Veja [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Mikhael Gois**
- GitHub: [@MikhaelGois](https://github.com/MikhaelGois)
- Email: mikhael@example.com

## 🤝 Contribuições

Contribuições são bem-vindas! Por favor:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Tem dúvidas ou encontrou um bug? 
- 🐛 Abra uma [Issue](https://github.com/MikhaelGois/SaaS/issues)
- 💬 Inicie uma [Discussion](https://github.com/MikhaelGois/SaaS/discussions)

## 🎯 Roadmap Futuro

- [ ] Integração com sistema de pagamento online
- [ ] Aplicativo mobile (React Native)
- [ ] Relatórios avançados com PDF export
- [ ] Autenticação com 2FA
- [ ] Suporte multi-idiomas
- [ ] API GraphQL
- [ ] Sincronização offline-first
- [ ] Integração com redes sociais

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

[![GitHub Stars](https://img.shields.io/github/stars/MikhaelGois/SaaS?style=social)](https://github.com/MikhaelGois/SaaS)

</div>


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
