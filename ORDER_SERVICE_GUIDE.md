# 🚀 ORDER SERVICE - Guia de Implementação

**Status:** Pronto para começar  
**Tempo estimado:** 2-3 horas  
**Prioridade:** 🔴 ALTA

---

## 📋 O que implementar

### 1. OrderService - CRUD + Lógica
- [x] Criar pedido (com validação de estoque)
- [x] Listar pedidos (com filtros)
- [x] Obter pedido específico
- [x] Atualizar status do pedido
- [x] Cancelar pedido
- [x] Decrementar ingredientes automaticamente

### 2. OrderItemService
- [x] Adicionar item ao pedido
- [x] Remover item do pedido
- [x] Validar estoque de ingredientes

### 3. OrderController
- [x] Routes para todas as operações
- [x] Proteção com JwtAuthGuard + RolesGuard

### 4. DTOs
- [x] CreateOrderDto
- [x] CreateOrderItemDto
- [x] UpdateOrderStatusDto

---

## 🏗️ Estrutura de Dados

```
Order (Comanda)
├── id: UUID
├── orderNumber: String (único)
├── userId: String (quem criou)
├── tableId: String (opcional, para salão)
├── type: SALOON | COUNTER | DELIVERY
├── status: PENDING | PREPARING | READY | SERVED | COMPLETED | CANCELLED
├── totalAmount: Decimal
├── customerName: String (opcional)
├── customerPhone: String (opcional)
├── deliveryAddress: String (opcional)
├── items: OrderItem[]
├── payment: Payment (opcional)
├── createdAt: DateTime
└── updatedAt: DateTime

OrderItem (Item da Comanda)
├── id: UUID
├── orderId: String (FK)
├── productId: String (FK)
├── quantity: Int
├── price: Decimal (preço no momento)
├── status: PENDING | PREPARING | READY | SERVED | CANCELLED
├── createdAt: DateTime
└── updatedAt: DateTime
```

---

## 🔄 Fluxo de Criação de Pedido

```
1. POST /orders (recebe CreateOrderDto)
   ↓
2. Validar que categoria existe (se aplicável)
   ↓
3. Criar Order com status PENDING
   ↓
4. Retornar Order criado
   ↓
5. POST /orders/:id/items (adicionar items)
   ↓
6. Para cada item:
   a. Validar que produto existe
   b. Validar estoque de ingredientes
   c. Criar OrderItem
   d. Decrementar estoque de ingredientes
   ↓
7. Atualizar totalAmount do Order
   ↓
8. Broadcast via WebSocket para cozinha (LATER)
```

---

## 📝 DTOs a Criar

### CreateOrderDto
```typescript
{
  type: 'SALOON' | 'COUNTER' | 'DELIVERY',
  tableId?: string,           // Se SALOON
  customerName?: string,      // Se DELIVERY
  customerPhone?: string,     // Se DELIVERY
  deliveryAddress?: string   // Se DELIVERY
}
```

### UpdateOrderItemDto
```typescript
{
  quantity: number
}
```

### UpdateOrderStatusDto
```typescript
{
  status: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED'
}
```

---

## 🔐 Permissões por Endpoint

| Endpoint | Método | Roles | Descrição |
|----------|--------|-------|-----------|
| /orders | POST | WAITER, CASHIER, MANAGER | Criar novo pedido |
| /orders | GET | Qualquer autenticado | Listar pedidos |
| /orders/:id | GET | Qualquer autenticado | Ver detalhes |
| /orders/:id/status | PATCH | MANAGER, CASHIER | Atualizar status |
| /orders/:id/items | POST | WAITER, CASHIER | Adicionar item |
| /orders/:id/items/:itemId | DELETE | WAITER, CASHIER | Remover item |
| /orders/:id | DELETE | MANAGER | Cancelar pedido |

---

## 💡 Lógica Importante

### Validação de Estoque
```typescript
// Quando adicionar item ao pedido:
for cada ingredient do produto {
  quantidade_necessaria = ingredient.quantity * orderItem.quantity
  estoque_disponivel = ingredient.stock
  
  if (estoque_disponivel < quantidade_necessaria) {
    throw BadRequestException('Estoque insuficiente')
  }
}
```

### Atualização de Status
```typescript
// Fluxo de status:
PENDING       // Pedido criado, aguardando cozinha
  ↓
PREPARING     // Cozinha começou a preparar
  ↓
READY         // Pronto para servir/retirar
  ↓
SERVED/COMPLETED // Finalizado (depende se é delivery)
  ↓
CANCELLED     // (pode ir para aqui de qualquer estado)
```

### Cálculo de Total
```typescript
// OrderItem.price = Product.price no momento da criação
// Order.totalAmount = SUM(OrderItem.price * OrderItem.quantity)
```

---

## 🚨 Casos de Uso Específicos

### Caso 1: Pedido para Salão
```bash
POST /orders
{
  "type": "SALOON",
  "tableId": "table-123"
}

POST /orders/:id/items
{
  "productId": "prod-456",
  "quantity": 2
}
```

### Caso 2: Pedido para Balcão
```bash
POST /orders
{
  "type": "COUNTER"
}
```

### Caso 3: Pedido para Delivery
```bash
POST /orders
{
  "type": "DELIVERY",
  "customerName": "João Silva",
  "customerPhone": "11999999999",
  "deliveryAddress": "Rua das Flores, 123"
}
```

---

## ✅ Checklist de Implementação

### OrderService
- [ ] create(createOrderDto) - criar novo pedido
- [ ] findAll(filters?) - listar com filtros
- [ ] findOne(id) - obter um
- [ ] updateStatus(id, statusDto) - mudar status
- [ ] cancel(id) - cancelar pedido
- [ ] calculateTotal(orderId) - atualizar total

### OrderItemService
- [ ] addItem(orderId, createItemDto) - adicionar item
- [ ] removeItem(itemId) - remover item
- [ ] validateStock(productId, quantity) - validar

### OrderController
- [ ] POST /orders - criar
- [ ] GET /orders - listar
- [ ] GET /orders/:id - obter um
- [ ] GET /orders/:id/items - listar items
- [ ] POST /orders/:id/items - adicionar item
- [ ] DELETE /orders/:id/items/:itemId - remover item
- [ ] PATCH /orders/:id/status - atualizar status
- [ ] DELETE /orders/:id - cancelar

---

## 🔧 Arquivo de Início (Order.Service)

```typescript
// Começar com estrutura básica:

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private ingredientService: IngredientService,
  ) {}

  // TODO: Implementar métodos
}
```

---

## 📊 Exemplo de Resposta

### Criar Pedido
```bash
POST /orders
{
  "type": "SALOON",
  "tableId": "table-123"
}
```

**Response:**
```json
{
  "id": "order-789",
  "orderNumber": "ORD001",
  "type": "SALOON",
  "tableId": "table-123",
  "userId": "user-456",
  "status": "PENDING",
  "totalAmount": 0,
  "items": [],
  "createdAt": "2025-12-31T16:00:00Z",
  "updatedAt": "2025-12-31T16:00:00Z"
}
```

### Adicionar Item
```bash
POST /orders/order-789/items
{
  "productId": "prod-456",
  "quantity": 2
}
```

**Response:**
```json
{
  "id": "order-item-999",
  "orderId": "order-789",
  "productId": "prod-456",
  "quantity": 2,
  "price": 25.50,
  "status": "PENDING",
  "createdAt": "2025-12-31T16:05:00Z",
  "updatedAt": "2025-12-31T16:05:00Z"
}
```

### Obter Pedido Completo
```bash
GET /orders/order-789
```

**Response:**
```json
{
  "id": "order-789",
  "orderNumber": "ORD001",
  "type": "SALOON",
  "tableId": "table-123",
  "userId": "user-456",
  "status": "PENDING",
  "totalAmount": 51.00,
  "items": [
    {
      "id": "order-item-999",
      "productId": "prod-456",
      "quantity": 2,
      "price": 25.50,
      "status": "PENDING"
    }
  ],
  "payment": null,
  "createdAt": "2025-12-31T16:00:00Z",
  "updatedAt": "2025-12-31T16:05:00Z"
}
```

---

## 🎯 Próxima Fase (Após Order)

Uma vez que Order esteja pronto:

1. **Stock Decrement Logic** - Garantir que ingredientes são decrementados
2. **WebSockets** - Broadcast de pedidos para cozinha em tempo real
3. **Payment Integration** - Pix e QR Code
4. **WhatsApp** - Notificações automáticas

---

## 📚 Referências

- **Prisma Docs:** https://www.prisma.io/docs
- **NestJS Docs:** https://docs.nestjs.com
- **Best Practices:** Use transactions para garantir consistência

---

**Pronto para começar?**

Quando implementar, lembre-se:
1. Sempre validar estoque antes de adicionar item
2. Usar transactions para evitar inconsistências
3. Testar com curl/Postman antes de integrar frontend
4. Broadcas para WebSocket quando status muda (LATER)

Boa sorte! 🚀
