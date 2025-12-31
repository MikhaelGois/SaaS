# 🍽️ PDV SaaS - Roadmap & Estado Atual

**Status do Projeto:** MVP em andamento
**Stack:** NestJS + Next.js + PostgreSQL + Prisma + WebSockets + Redis

---

## 📊 Estado Atual (Estrutura Base Implementada)

### ✅ Backend (NestJS)
- **Estrutura Base:** Módulos criados (Auth, Order, Stock, Payment, Gateway, WhatsApp, Audit, Redis)
- **Database:** Prisma configurado com PostgreSQL
- **Schema:** Modelos principais definidos (User, Product, Ingredient, Order, Payment, Table)
- **Validação:** DTOs estruturados para login, registro, pedidos, pagamentos
- **WebSockets:** Socket.IO configurado para comunicação em tempo real
- **Segurança:** JWT, RBAC com papéis (CASHIER, WAITER, MANAGER, ADMIN)

### ✅ Frontend (Next.js)
- **Scaffolding:** Projeto Next.js 14 criado
- **Estrutura:** Pages criadas (PDV, Comandas, KDS, Estoque, Cardápio, Relatórios)
- **Styling:** Tailwind CSS + CSS Modules base
- **Testing:** Playwright configurado

### 🔄 Em Progresso / Incompleto
- **Auth Service:** DTOs criados, mas lógica de senha com bcrypt não totalmente testada
- **Order Service:** CRUD básico, falta integração com WebSocket
- **Payment Service:** Webhook struct definido, falta implementação Stripe/Mercado Pago
- **Stock Service:** Model criado, falta decrementação de insumos por item
- **WhatsApp Service:** Module vazio, falta integração com Cloud API
- **Frontend Pages:** Layout esquemático, sem componentes interativos

---

## 🎯 Roadmap - MVP (Prioridade Lógica)

### **Fase 1: Autenticação & Autorização** (Semana 1)
- [ ] Completar `AuthService` - Register, Login, Token Refresh
- [ ] Implementar `RolesGuard` com verificação de acesso por rota
- [ ] Página de Login no Frontend com validação
- [ ] Middleware de autenticação global

**Output esperado:** Usuários autenticados podem acessar dashboard conforme seu role.

---

### **Fase 2: Catálogo de Produtos & Estoque** (Semana 1-2)
- [ ] CRUD de Produtos (criar, listar, editar, deletar) - apenas MANAGER
- [ ] CRUD de Ingredientes (stock, unidade, alerta mínimo)
- [ ] Tela do Cardápio (filtro por categoria, busca)
- [ ] Gestão de Estoque (visualizar, decrementar, alertas)

**Output esperado:** Restaurante consegue gerenciar seu menu e levels de estoque.

---

### **Fase 3: Fluxo de Pedidos (Salão, Balcão, Delivery)** (Semana 2-3)
- [ ] OrderService - Criar pedido com validação de estoque
- [ ] Decrementar insumos automaticamente por order item
- [ ] Atualizar status do pedido (PENDING → PREPARING → READY → SERVED)
- [ ] WebSocket - Broadcast para cozinha quando novo pedido entra

**Output esperado:** Garçom abre comanda, sistema decrementa estoque, cozinha recebe fila em tempo real.

---

### **Fase 4: Pagamentos (Pix & QR)** (Semana 3)
- [ ] Integração Pix com Stripe/Mercado Pago
- [ ] Gerar QR Code dinâmico
- [ ] Webhook para confirmar pagamento
- [ ] Atualizar status do pedido quando payment = COMPLETED

**Output esperado:** Caixa fecha comanda com Pix/QR, sem dor de cabeça com confirmação manual.

---

### **Fase 5: Notificações (WhatsApp)** (Semana 4)
- [ ] Cloud API WhatsApp - enviar confirmação de pedido
- [ ] Notificar cliente na retirada/entrega
- [ ] Templates de mensagem (português)

**Output esperado:** Cliente recebe "Seu pedido foi confirmado!" via WhatsApp.

---

### **Fase 6: Telas de Gerenciamento (Frontend)** (Semana 4-5)
- [ ] PDV - Adicionar itens ao carrinho, calcular total, integrar com Pix
- [ ] Comandas - Listar comandas abertas, fechar com pagamento
- [ ] KDS (Cozinha) - Fila visual com status, sons de notificação
- [ ] Dashboard - Tempo médio atendimento, ticket médio, % Pix

**Output esperado:** Interface intuitiva e rápida para todos os papéis.

---

### **Fase 7: Auditoria & Logs** (Semana 5)
- [ ] Registrar todas ações: criação de pedido, mudança status, pagamentos
- [ ] Filtro por usuário, data, tipo de ação
- [ ] Suporte para compliance LGPD

**Output esperado:** Rastreabilidade completa de todas operações.

---

### **Fase 8: Testes & Deploy** (Semana 6)
- [ ] Unit Tests (Auth, Order, Payment)
- [ ] E2E Tests (fluxo completo de pedido)
- [ ] GitHub Actions - CI/CD
- [ ] Deploy no Heroku/Vercel (dev/staging/prod)

**Output esperado:** Código testado e deployável em produção.

---

## 🚀 Roadmap - V2 (Pós-MVP)

- [ ] Impressora Térmica (integração com drivers)
- [ ] Cardápio QR para cliente (menu digital, self-service)
- [ ] Delivery com otimização de rotas
- [ ] Recomendações ML ("quem compra X, leva Y")
- [ ] Mobile App (React Native)
- [ ] Emissão de NFC-e
- [ ] Integração com sistemas de delivery (iFood, Uber)

---

## 📁 Estrutura de Pastas (Referência)

```
pdv/
├── src/
│   ├── main.ts                 # Entry point
│   ├── app.module.ts           # Root module
│   ├── auth/                   # Login, JWT, Roles
│   ├── order/                  # CRUD de pedidos + WebSocket
│   ├── stock/                  # Controle de estoque
│   ├── payment/                # Integração Pix/Stripe
│   ├── whatsapp/               # Notificações WhatsApp
│   ├── gateway/                # WebSockets
│   ├── audit/                  # Logs de auditoria
│   ├── prisma/                 # ORM
│   └── redis/                  # Cache e filas
├── backend/
│   └── prisma/
│       └── schema.prisma       # Data models
├── frontend/
│   └── src/
│       └── app/
│           ├── page.tsx        # Dashboard
│           ├── pdv/            # PDV screen
│           ├── comandeiro/     # Comandas
│           ├── kds/            # Cozinha
│           ├── stock/          # Estoque
│           ├── menu/           # Cardápio
│           └── reports/        # Relatórios
├── test/                       # E2E tests
└── README.md
```

---

## 🔌 Integrações Necessárias

| Integração | Responsável | Status |
|-----------|------------|--------|
| **Stripe/Mercado Pago** | Payment Service | TODO |
| **WhatsApp Cloud API** | WhatsApp Service | TODO |
| **Socket.IO** | Gateway | PARTIALLY DONE |
| **Redis** | Order Queue | TODO |
| **Prisma ORM** | Database | ✅ DONE |
| **JWT Auth** | Auth Service | PARTIALLY DONE |

---

## 📋 Checklist por Dia (Sugestão)

**Dia 1:** Auth + Login Frontend
**Dia 2-3:** Produtos + Estoque + Cardápio
**Dia 4-5:** Pedidos + WebSocket + KDS
**Dia 6:** Pagamentos + Pix
**Dia 7-8:** WhatsApp + Notificações
**Dia 9:** Dashboard + Relatórios
**Dia 10:** Testes + Deploy

---

## 🎨 UI/UX Checklist

- [ ] Design System (componentes reutilizáveis)
- [ ] Core Web Vitals > 90
- [ ] Acessibilidade (A11y)
- [ ] Responsividade (mobile first)
- [ ] Offline-first com Service Workers
- [ ] PWA capable

---

## ⚙️ Comandos Úteis

```bash
# Backend
npm run start:dev          # Inicia em modo watch
npm run test              # Unit tests
npm run test:e2e          # E2E tests

# Frontend
npm run dev               # Desenvolvimento

# Prisma
npx prisma migrate dev    # Cria migration
npx prisma studio        # GUI do banco
```

---

## 📞 Próximos Passos

1. **Confirmar stack de pagamentos:** Stripe ou Mercado Pago?
2. **Definir banco de dados:** PostgreSQL local ou cloud (Azure DB, AWS RDS)?
3. **Hosting:** Vercel (frontend) + Heroku/Railway (backend)?
4. **WhatsApp:** Já tem account WhatsApp Business?

---

**Última atualização:** 31 de Dezembro de 2025
