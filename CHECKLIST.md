# ✅ Checklist de Desenvolvimento - PDV SaaS

## 📋 Backend - Fase 1 ✅ CONCLUÍDO

### Autenticação & Autorização
- [x] Configurar NestJS com TypeScript strict
- [x] Implementar JWT Strategy com Passport
- [x] Criar AuthService com login/register
- [x] Hash de senhas com bcrypt
- [x] Criar RolesGuard para RBAC
- [x] Definir 4 papéis (ADMIN, MANAGER, CASHIER, WAITER)
- [x] Criar User types em arquivo centralizado
- [x] Configurar JWT constants com env variables
- [x] Criar AuthController com endpoints
- [x] Adicionar JwtAuthGuard em rotas protegidas
- [x] Validação com class-validator

**Status:** ✅ 100% Completo - Pronto para uso

---

### Produtos & Categorias
- [x] Criar Category Service com CRUD
- [x] Criar Category Controller com rotas
- [x] Criar CategoryModule e registrar
- [x] Adicionar DTOs para Category (Create, Update)
- [x] Validação de categoria única
- [x] Criar Product Service com CRUD
- [x] Criar Product Controller com rotas
- [x] Criar ProductModule e registrar
- [x] Adicionar DTOs para Product (Create, Update)
- [x] Validação de produto único
- [x] Verificar se categoria existe antes de criar produto
- [x] Suportar filtro por categoryId em listagem
- [x] Restrição de acesso: apenas MANAGER/ADMIN podem criar

**Status:** ✅ 100% Completo - Pronto para uso

---

### Ingredientes & Estoque
- [x] Criar Ingredient Service com CRUD
- [x] Criar Ingredient Controller com rotas
- [x] Criar IngredientModule e registrar
- [x] Adicionar DTOs para Ingredient (Create, Update, AdjustStock)
- [x] Implementar controle de stock
- [x] Suportar diferentes unidades (g, ml, kg, unit)
- [x] Implementar alertas de mínimo
- [x] Criar endpoint adjust-stock para ajustes manuais
- [x] Registrar motivos de ajustes (order, waste, count, received)
- [x] Implementar histórico de movimentações
- [x] Endpoint low-stock para gerentes
- [x] Validação de estoque negativo
- [x] Restrição: MANAGER/ADMIN podem criar, CASHIER pode ajustar

**Status:** ✅ 100% Completo - Pronto para uso

---

### Configuração Geral
- [x] Atualizar AppModule com novos módulos
- [x] Criar .env.example com variáveis necessárias
- [x] Criar .env.local para desenvolvimento
- [x] Configurar JWT_SECRET em env variables
- [x] Configurar PORT em env variables
- [x] Prisma schema com todos os models
- [x] Validar que não há erros TypeScript

**Status:** ✅ 100% Completo - Pronto para uso

---

## 📋 Backend - Fase 2 🚀 PRÓXIMO

### Order Service (COMEÇAR AGORA!)
- [ ] Criar OrderService com CRUD
  - [ ] create(createOrderDto) - criar novo pedido
  - [ ] findAll(filters?) - listar com filtros
  - [ ] findOne(id) - obter um pedido
  - [ ] updateStatus(id, statusDto) - mudar status
  - [ ] cancel(id) - cancelar pedido
  - [ ] calculateTotal(orderId) - atualizar total

- [ ] Criar OrderItemService
  - [ ] addItem(orderId, createItemDto)
  - [ ] removeItem(itemId)
  - [ ] validateStock(productId, quantity)

- [ ] Criar OrderController com rotas
  - [ ] POST /orders - criar pedido
  - [ ] GET /orders - listar
  - [ ] GET /orders/:id - detalhe
  - [ ] POST /orders/:id/items - adicionar item
  - [ ] DELETE /orders/:id/items/:itemId - remover item
  - [ ] PATCH /orders/:id/status - atualizar status
  - [ ] DELETE /orders/:id - cancelar

- [ ] Criar DTOs
  - [ ] CreateOrderDto
  - [ ] CreateOrderItemDto
  - [ ] UpdateOrderStatusDto

- [ ] Registrar no AppModule
- [ ] Testar com curl/Postman

**Tempo estimado:** 2-3 horas  
**Documentação:** [ORDER_SERVICE_GUIDE.md](ORDER_SERVICE_GUIDE.md)

---

### Stock Decrement Logic
- [ ] Integrar IngredientService no OrderService
- [ ] Validar estoque de ingredientes antes de adicionar item
- [ ] Decrementar estoque automaticamente ao criar OrderItem
- [ ] Rollback se estoque insuficiente
- [ ] Registrar motivo "order" nos movimentos
- [ ] Alertar se estoque ficar baixo após pedido

**Status esperado:** Após Order Service  
**Tempo:** 1-2 horas

---

## 📋 Backend - Fase 3 ⏳ TODO

### WebSockets (Socket.IO)
- [ ] Configurar Socket.IO no main.ts
- [ ] Criar Gateway para pedidos
- [ ] Broadcast ao criar novo pedido
- [ ] Broadcast ao atualizar status
- [ ] Broadcast ao decrementar estoque
- [ ] Handle disconnect gracefully
- [ ] Implementar namespaces (/kitchen, /cashier, /waiter)

**Status:** 0% - Após Order Service  
**Tempo:** 2-3 horas

---

### Payment Integration (Pix)
- [ ] Escolher Stripe ou Mercado Pago
- [ ] Criar PaymentService com integração
- [ ] Gerar QR Code dinâmico
- [ ] Implementar webhook de confirmação
- [ ] Atualizar status do pedido quando pagamento confirmado
- [ ] Armazenar transaction ID
- [ ] Tratamento de erros de pagamento

**Status:** 0% - Após Order Service  
**Tempo:** 2-3 horas

---

### WhatsApp Notifications
- [ ] Obter credentials do WhatsApp Cloud API
- [ ] Criar WhatsAppService com integração
- [ ] Template de "Pedido Confirmado"
- [ ] Template de "Pronto para Retirar"
- [ ] Template de "Entregue"
- [ ] Enviar notificação ao criar pedido
- [ ] Enviar notificação ao mudar status

**Status:** 0% - Após Order Service  
**Tempo:** 2-3 horas

---

### Auditoria & Logs
- [ ] Completar AuditService
- [ ] Registrar criação de usuário
- [ ] Registrar login
- [ ] Registrar criação de produto/categoria
- [ ] Registrar criação de pedido
- [ ] Registrar mudança de status
- [ ] Registrar ajustes de estoque
- [ ] Registrar pagamentos
- [ ] Endpoint para listar logs (filtro por usuário, data, tipo)

**Status:** 0% - Fase final backend  
**Tempo:** 2-3 horas

---

## 🎨 Frontend - Fase 4 ⏳ TODO

### Setup & Design System
- [ ] Instalar Tailwind CSS
- [ ] Instalar componentes (headless UI ou similar)
- [ ] Criar componentes base
  - [ ] Button
  - [ ] Input
  - [ ] Card
  - [ ] Modal
  - [ ] Loading spinner
  - [ ] Toast notifications
- [ ] Setup ESLint e Prettier
- [ ] Criar layout base

**Status:** 0% - Após backend básico  
**Tempo:** 2-3 horas

---

### Pages Principais
- [ ] Login Page
  - [ ] Form com validação
  - [ ] Armazenar JWT em localStorage
  - [ ] Redirecionar por role
  - [ ] Logout

- [ ] Dashboard
  - [ ] Resumo de vendas
  - [ ] Pedidos abertos
  - [ ] Alertas de estoque
  - [ ] Gráficos simples

- [ ] PDV (Caixa)
  - [ ] Seletor de mesa/tipo
  - [ ] Busca de produtos
  - [ ] Carrinho
  - [ ] Cálculo de total
  - [ ] Integração Pix/QR
  - [ ] Offline support (Service Worker)

- [ ] Comandas
  - [ ] Lista de comandas abertas
  - [ ] Detalhes de comanda
  - [ ] Adicionar/remover itens
  - [ ] Fechar comanda
  - [ ] Pagamento

- [ ] KDS (Cozinha)
  - [ ] Fila de pedidos
  - [ ] Cards por pedido
  - [ ] Status visual
  - [ ] Sons de notificação
  - [ ] WebSocket integration

- [ ] Estoque
  - [ ] Lista de ingredientes
  - [ ] Filtro por alerta
  - [ ] Ajuste manual
  - [ ] Histórico de movimentações

- [ ] Cardápio
  - [ ] Lista de produtos
  - [ ] Filtro por categoria
  - [ ] Busca
  - [ ] Edição (gerente)
  - [ ] Upload de imagens

- [ ] Relatórios
  - [ ] Vendas por período
  - [ ] Top produtos
  - [ ] Tempo médio atendimento
  - [ ] Ticket médio
  - [ ] Ruptura de estoque

**Status:** 0% - Fase final do MVP  
**Tempo:** 1-2 semanas (full-time)

---

## 🧪 Testes - Fase 5 ⏳ TODO

### Unit Tests
- [ ] AuthService tests
- [ ] ProductService tests
- [ ] IngredientService tests
- [ ] OrderService tests
- [ ] PaymentService tests
- [ ] Target: >70% coverage

**Status:** 0% - Durante desenvolvimento  
**Tempo:** 2-3 horas

---

### E2E Tests
- [ ] Setup Playwright
- [ ] Teste de login
- [ ] Teste de criação de pedido
- [ ] Teste de pagamento
- [ ] Teste de WebSocket
- [ ] Target: Fluxos principais cobertos

**Status:** 0% - Final do backend  
**Tempo:** 2-3 horas

---

## 🚀 Deploy & CI/CD - Fase 6 ⏳ TODO

### GitHub Actions
- [ ] Setup CI para testes automáticos
- [ ] Setup CD para staging
- [ ] Setup CD para produção
- [ ] Notificações de build

**Status:** 0% - Final do projeto  
**Tempo:** 2-3 horas

---

### Hospedagem
- [ ] Escolher host (Vercel, Heroku, Railway, etc)
- [ ] Setup environment variables
- [ ] Deploy inicial
- [ ] Setup de banco de dados
- [ ] Monitoramento

**Status:** 0% - Final do projeto  
**Tempo:** 2-3 horas

---

## 📚 Documentação - Sendo Criada

- [x] [SUMMARY.md](SUMMARY.md) - Resumo do que foi feito
- [x] [QUICKSTART.md](QUICKSTART.md) - Guia de início rápido
- [x] [ARCHITECTURE.md](ARCHITECTURE.md) - Visão geral com diagramas
- [x] [INDEX.md](INDEX.md) - Índice de documentação
- [x] [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md) - Como testar Auth
- [x] [PRODUCTS_API.md](PRODUCTS_API.md) - API de produtos
- [x] [INGREDIENTS_API.md](INGREDIENTS_API.md) - API de ingredientes
- [x] [ORDER_SERVICE_GUIDE.md](ORDER_SERVICE_GUIDE.md) - Guia para implementar Orders
- [x] [ROADMAP.md](ROADMAP.md) - Roadmap geral
- [x] [PROGRESS.md](PROGRESS.md) - Status atual
- [x] [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) - Plano de implementação
- [ ] README.md - Guia de setup final
- [ ] API.md - Documentação completa da API (auto-generated?)
- [ ] DEPLOYMENT.md - Guia de deploy em produção
- [ ] CONTRIBUTING.md - Guia para contribuidores

---

## 🎯 Resumo de Progresso

```
Fase 1 - Backend Básico:     ████████████████████░░ 100% ✅
  └─ Auth, Produtos, Ingredientes

Fase 2 - Orders & Payments:  ░░░░░░░░░░░░░░░░░░░░░░   0% 🚀
  └─ Order Service, Pix, WebSocket

Fase 3 - Notificações:       ░░░░░░░░░░░░░░░░░░░░░░   0% ⏳
  └─ WhatsApp, Auditoria

Fase 4 - Frontend:           ░░░░░░░░░░░░░░░░░░░░░░   0% ⏳
  └─ UI, Pages, Components

Fase 5 - Testes:             ░░░░░░░░░░░░░░░░░░░░░░   0% ⏳
  └─ Unit tests, E2E tests

Fase 6 - Deploy:             ░░░░░░░░░░░░░░░░░░░░░░   0% ⏳
  └─ CI/CD, Hospedagem

TOTAL MVP:                   ████░░░░░░░░░░░░░░░░░░  40% 🚀
```

---

## 🎓 Próximos Passos

### Hoje (Após essa implementação)
1. [ ] Ler [QUICKSTART.md](QUICKSTART.md)
2. [ ] Setup local (npm install, .env.local, migrations)
3. [ ] Testar endpoints de Auth com curl

### Amanhã
4. [ ] Começar [ORDER_SERVICE_GUIDE.md](ORDER_SERVICE_GUIDE.md)
5. [ ] Implementar Order Service (~2-3h)
6. [ ] Testar com curl

### Próximos 2 dias
7. [ ] Implementar Stock Decrement (~1-2h)
8. [ ] Implementar WebSockets (~2-3h)
9. [ ] Implementar Pagamentos (~2-3h)

### Semana seguinte
10. [ ] Frontend inicial (~1-2 semanas)
11. [ ] Testes (~2-3h)
12. [ ] Deploy (~2-3h)

---

## 💾 Como Rastrear Progresso

1. **Este arquivo** - Atualizar checkboxes conforme avança
2. **[PROGRESS.md](PROGRESS.md)** - Resumo de status geral
3. **GitHub Issues** (opcional) - Criar issues para cada tarefa
4. **Git Commits** - Commitar ao finalizar cada seção

---

## 🎯 Metas por Data

```
31/12 - Backend básico (Auth, Produtos, Ingredientes)  ✅ FEITO
01/01 - Order Service + WebSockets                      🚀 PRÓXIMO
02/01 - Pagamentos (Pix)                                ⏳
03/01 - Frontend básico                                 ⏳
04/01 - Testes + Deploy                                 ⏳
```

---

## 📞 Recursos Úteis

- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Socket.IO Docs](https://socket.io/docs)
- [Stripe API](https://stripe.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

**Last Updated:** 31 de Dezembro de 2025  
**Status:** 40% - Pronto para Fase 2  
**Next Task:** Implementar Order Service

Boa sorte! 🚀
