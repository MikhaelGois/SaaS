# 🧂 INGREDIENTES & ESTOQUE - Endpoints

## 📦 Listar Todos os Ingredientes

```bash
curl -X GET http://localhost:3000/ingredients \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
[
  {
    "id": "ing-001",
    "name": "Tomate",
    "stock": 50.5,
    "unit": "kg",
    "minStockAlert": 10,
    "belowMinimum": false,
    "productIngredients": [
      {
        "productId": "prod-123",
        "quantity": 0.2,
        "product": {
          "name": "Salada"
        }
      }
    ]
  }
]
```

---

## 🆕 Criar Ingrediente

```bash
curl -X POST http://localhost:3000/ingredients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Tomate",
    "stock": 50.5,
    "unit": "kg",
    "minStockAlert": 10
  }'
```

**Campos:**
- `name`: Nome do ingrediente (obrigatório)
- `stock`: Quantidade em estoque (obrigatório)
- `unit`: Unidade de medida (obrigatório) - "g", "ml", "unit", "kg", etc.
- `minStockAlert`: Quantidade mínima para alerta (opcional, padrão 0)

---

## 🔍 Obter Um Ingrediente

```bash
curl -X GET http://localhost:3000/ingredients/ing-001 \
  -H "Authorization: Bearer <token>"
```

---

## ⚠️ Ver Itens com Estoque Baixo

```bash
curl -X GET http://localhost:3000/ingredients/low-stock \
  -H "Authorization: Bearer <token>"
```

---

## 📊 Ver Histórico de Movimentações

```bash
curl -X GET http://localhost:3000/ingredients/ing-001/movements \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
[
  {
    "ingredientId": "ing-001",
    "quantity": -5,
    "reason": "order",
    "timestamp": "2025-12-31T14:30:00Z"
  }
]
```

---

## ✏️ Atualizar Ingrediente

```bash
curl -X PATCH http://localhost:3000/ingredients/ing-001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "stock": 45.5,
    "minStockAlert": 15
  }'
```

---

## 📦 Ajustar Estoque Manualmente

```bash
# Adicionar estoque (entrada)
curl -X POST http://localhost:3000/ingredients/ing-001/adjust-stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "quantity": 10,
    "reason": "received"
  }'

# Remover estoque (perda/desperdício)
curl -X POST http://localhost:3000/ingredients/ing-001/adjust-stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "quantity": -2,
    "reason": "waste"
  }'

# Ajuste por contagem
curl -X POST http://localhost:3000/ingredients/ing-001/adjust-stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "quantity": 3,
    "reason": "count"
  }'
```

**Motivos (reason):**
- `order` - Consumido em pedido
- `waste` - Desperdício/Dano
- `count` - Ajuste de contagem
- `received` - Entrada de estoque
- `adjustment` - Ajuste geral

---

## 🗑️ Deletar Ingrediente

```bash
curl -X DELETE http://localhost:3000/ingredients/ing-001 \
  -H "Authorization: Bearer <token>"
```

---

## 🔐 Permissões por Endpoint

| Endpoint | Método | Roles |
|----------|--------|-------|
| /ingredients | GET | Qualquer autenticado |
| /ingredients | POST | MANAGER, ADMIN |
| /ingredients/low-stock | GET | MANAGER, ADMIN |
| /ingredients/:id | GET | Qualquer autenticado |
| /ingredients/:id/movements | GET | Qualquer autenticado |
| /ingredients/:id | PATCH | MANAGER, ADMIN |
| /ingredients/:id/adjust-stock | POST | MANAGER, ADMIN, CASHIER |
| /ingredients/:id | DELETE | MANAGER, ADMIN |

---

## 📈 Exemplo: Criar Ingredients para Lanchonete

```bash
TOKEN="seu_token_aqui"

# 1. Pão de Hambúrguer
curl -X POST http://localhost:3000/ingredients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Pão de Hambúrguer",
    "stock": 100,
    "unit": "unit",
    "minStockAlert": 20
  }'

# 2. Hambúrguer (carne)
curl -X POST http://localhost:3000/ingredients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Carne de Hambúrguer 100g",
    "stock": 80,
    "unit": "unit",
    "minStockAlert": 15
  }'

# 3. Alface
curl -X POST http://localhost:3000/ingredients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Alface",
    "stock": 5,
    "unit": "kg",
    "minStockAlert": 1
  }'

# 4. Tomate
curl -X POST http://localhost:3000/ingredients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Tomate",
    "stock": 3,
    "unit": "kg",
    "minStockAlert": 0.5
  }'

# 5. Queijo
curl -X POST http://localhost:3000/ingredients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Queijo Cheddar",
    "stock": 2,
    "unit": "kg",
    "minStockAlert": 0.5
  }'
```

---

## 🚀 Próximos Passos

- [ ] Conectar Ingredientes a Produtos (ProductIngredient)
- [ ] Implementar Order Service com decremento automático
- [ ] Criar dashboard de alertas de estoque
- [ ] Persistir histórico de movimentações em banco de dados

---

**Status:** ✅ Ingredientes implementados e prontos para uso
