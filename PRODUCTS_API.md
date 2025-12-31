# 📦 PRODUTOS & CATEGORIAS - Endpoints

## 🏷️ Categorias

### Criar Categoria
```bash
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Bebidas"
  }'
```

**Response:**
```json
{
  "id": "cat-123",
  "name": "Bebidas",
  "createdAt": "2025-12-31T10:00:00Z",
  "updatedAt": "2025-12-31T10:00:00Z"
}
```

### Listar Todas as Categorias
```bash
curl -X GET http://localhost:3000/categories \
  -H "Authorization: Bearer <token>"
```

### Obter Uma Categoria
```bash
curl -X GET http://localhost:3000/categories/cat-123 \
  -H "Authorization: Bearer <token>"
```

### Atualizar Categoria
```bash
curl -X PATCH http://localhost:3000/categories/cat-123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Bebidas Quentes"
  }'
```

### Deletar Categoria
```bash
curl -X DELETE http://localhost:3000/categories/cat-123 \
  -H "Authorization: Bearer <token>"
```

---

## 🍔 Produtos

### Criar Produto
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Coca-Cola 350ml",
    "description": "Refrigerante gelado",
    "price": 5.50,
    "categoryId": "cat-123",
    "available": true
  }'
```

**Response:**
```json
{
  "id": "prod-456",
  "name": "Coca-Cola 350ml",
  "description": "Refrigerante gelado",
  "price": 5.50,
  "categoryId": "cat-123",
  "category": {
    "id": "cat-123",
    "name": "Bebidas"
  },
  "available": true,
  "ingredients": [],
  "createdAt": "2025-12-31T10:05:00Z",
  "updatedAt": "2025-12-31T10:05:00Z"
}
```

### Listar Todos os Produtos
```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer <token>"
```

### Listar Produtos por Categoria
```bash
curl -X GET "http://localhost:3000/products?categoryId=cat-123" \
  -H "Authorization: Bearer <token>"
```

### Obter Um Produto
```bash
curl -X GET http://localhost:3000/products/prod-456 \
  -H "Authorization: Bearer <token>"
```

### Atualizar Produto
```bash
curl -X PATCH http://localhost:3000/products/prod-456 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "price": 6.00,
    "available": false
  }'
```

### Deletar Produto
```bash
curl -X DELETE http://localhost:3000/products/prod-456 \
  -H "Authorization: Bearer <token>"
```

---

## 🔐 Permissões Necessárias

| Endpoint | Método | Roles Permitidas |
|----------|--------|-----------------|
| /categories | POST | MANAGER, ADMIN |
| /categories | GET | Qualquer autenticado |
| /categories/:id | GET | Qualquer autenticado |
| /categories/:id | PATCH | MANAGER, ADMIN |
| /categories/:id | DELETE | MANAGER, ADMIN |
| /products | POST | MANAGER, ADMIN |
| /products | GET | Qualquer autenticado |
| /products/:id | GET | Qualquer autenticado |
| /products/:id | PATCH | MANAGER, ADMIN |
| /products/:id | DELETE | MANAGER, ADMIN |

---

## 📝 Exemplo Completo (Setup Inicial)

```bash
# 1. Register como MANAGER
TOKEN=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gerente@resto.com",
    "password": "Senha123!",
    "name": "João",
    "role": "MANAGER"
  }' | jq -r '.access_token')

# 2. Criar categoria
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Lanches"}'

# 3. Criar produtos...
```

---

**Status:** ✅ Products & Categories implementados e prontos para uso
