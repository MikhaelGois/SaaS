# 🚀 Deployment Guide - MVP Backend

**Deploy em 30 minutos para produção**

---

## 🎯 Opções de Deploy

### Recomendado: Railway.app ⭐

**Por quê?**
- Banco de dados PostgreSQL incluído
- Deploy automático via Git
- Environment variables na UI
- $10/mês por aplicação
- Suporte excelente

### Alternativas

- **Heroku** (pago agora, antes era free)
- **Render** (alternativa grátis)
- **DigitalOcean** (mais controle)
- **AWS/Azure** (overkill para MVP)

---

## 1️⃣ Railway Setup (30 minutos)

### Step 1: Preparar Repositório

```bash
cd pdv

# 1. Inicializar git (se não tiver)
git init
git add .
git commit -m "Initial MVP backend commit"

# 2. Criar repositório no GitHub
# https://github.com/new
# Nome: pdv-backend-mvp
# Visibility: Private (para segurança)

# 3. Push para GitHub
git remote add origin https://github.com/seu-usuario/pdv-backend-mvp.git
git branch -M main
git push -u origin main
```

---

### Step 2: Criar conta Railway

1. Acesse https://railway.app
2. Click "Create Project"
3. Escolha "Deploy from GitHub"
4. Autorize GitHub
5. Selecione seu repositório

---

### Step 3: Adicionar Serviços

#### Banco de Dados PostgreSQL

```bash
# Na dashboard Railway:
# 1. Click "Add Service"
# 2. Escolha "PostgreSQL"
# 3. Railway cria automaticamente com:
#    - Host: xxx.railway.app
#    - Port: 5432
#    - Database: railway
#    - Username: postgres
#    - Password: (auto-gerado)
```

#### Backend NestJS

```bash
# Na dashboard:
# 1. Click "Add Service"
# 2. Escolha "Deploy from GitHub"
# 3. Conecte seu repositório pdv-backend-mvp
# 4. Railway detecta Node.js automaticamente
```

---

### Step 4: Configurar Environment Variables

Na dashboard Railway, clique no serviço NestJS e adicione:

```bash
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/railway
JWT_SECRET=sua-chave-muito-segura-aleatorio-aqui
JWT_EXPIRATION=60m
PIX_KEY=restaurante@pix.key
MERCADO_PAGO_ID=seu-id
STRIPE_SECRET_KEY=sk_live_xxx
WHATSAPP_API_TOKEN=seu-token
WHATSAPP_PHONE_ID=seu-phone-id
REDIS_URL=redis://localhost:6379
PORT=3000
NODE_ENV=production
```

**⚠️ IMPORTANTE:**
- `DATABASE_URL` vem automaticamente do PostgreSQL service
- Gere `JWT_SECRET` com: `openssl rand -base64 32`
- Mantenha credenciais em variáveis, NUNCA em código

---

### Step 5: Configurar build.json (se necessário)

```json
{
  "build": {
    "builder": "static"
  }
}
```

---

### Step 6: Fazer o Deploy

```bash
# No repositório local
git add .
git commit -m "Ready for production"
git push origin main

# Railway detecta automaticamente
# Build inicia em ~30s
# Deploy completa em ~2 minutos
```

---

## 2️⃣ Verificar Deploy

### Logs

```bash
# Na dashboard Railway:
# Clique em "View Logs"
# Procure por: "NestJS server listening on port 3000"
```

### Health Check

```bash
# Seu backend está em: https://xxx.railway.app

curl https://xxx.railway.app/api/health

# Response esperado:
# { "status": "ok" }
```

---

## 3️⃣ Database Migrations em Produção

```bash
# Opção 1: Via Railway Dashboard
# Services > NestJS > Variables
# Add: RUN_MIGRATIONS=true

# Opção 2: Rodar manualmente
# No Railway Terminal:
npm run prisma:migrate:deploy
```

---

## 4️⃣ Monitoramento

### Railway Metrics

- **CPU Usage**
- **Memory Usage**
- **Network I/O**
- **Deployment History**

### Health Checks

```bash
# Verificar status a cada 5 minutos
curl -s https://seu-dominio/api/health | jq .status
```

---

## 5️⃣ Configuração de Domínio Customizado

```bash
# Na dashboard Railway:
# 1. NestJS Service > Settings > Domain
# 2. Adicione seu domínio (ex: api.seurestaurante.com)
# 3. Configure DNS no seu registrador:
#    CNAME: seu-dominio.railway.app

# Após ~5 minutos:
# https://seu-dominio.railway.app está pronto
```

---

## 6️⃣ Environment Secrets (Proteção Extra)

### GitHub Secrets (Recomendado)

```bash
# No GitHub:
# 1. Settings > Secrets and variables > Actions
# 2. New Repository Secret
# 3. Adicione: DATABASE_URL, JWT_SECRET, etc

# No arquivo .github/workflows/deploy.yml:
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

---

## 7️⃣ Backup de Dados

### PostgreSQL Backups no Railway

```bash
# Railway faz backup automático
# Acesse via: Services > PostgreSQL > Backups
# Você pode:
# - Fazer download do backup
# - Restaurar para data anterior
```

---

## 8️⃣ Troubleshooting Deploy

### Build falha
```bash
# Verificar logs
railway logs --service=yourappname

# Solução comum: Faltam dependências
npm install --save alguns-packages
git push
```

### Aplicação crasheia
```bash
# Ver erro exato
railway logs

# Comum: DATABASE_URL inválida
# Verificar: env variables corretas
```

### Timeout nas requisições
```bash
# Railway timeout padrão: 120s
# Se necessário aumentar:
# Contate suporte ou use Render/AWS
```

---

## 9️⃣ CI/CD Automático

### GitHub Actions (Opcional)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - run: npm run test
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: npm install -g railway && railway up
```

---

## 🔟 Security Checklist

- [ ] `JWT_SECRET` é forte (32+ caracteres aleatórios)
- [ ] Database password é forte
- [ ] `NODE_ENV=production`
- [ ] `CORS` configurado só para domínios confiáveis
- [ ] Senhas de usuários de teste removidas
- [ ] `.env` não versionado no Git
- [ ] Logs não contêm dados sensíveis
- [ ] HTTPS ativado (Railway faz automaticamente)
- [ ] Rate limiting configurado (se necessário)
- [ ] Database backups automatizados

---

## 📊 Exemplo: Deploy Completo

```bash
# 1. Preparar código
cd pdv
git status

# 2. Verificar se compila
npm run build

# 3. Rodar testes
npm run test

# 4. Commit e push
git add .
git commit -m "v1.0.0 - Production ready"
git push origin main

# 5. Railway detecta automaticamente
# 6. Build inicia em 30s
# 7. Deploy completa em 2 minutos
# 8. Check logs: railway logs

# 9. Testar em produção
curl https://xxx.railway.app/auth/login \
  -d '{"email":"test@test.com","password":"test"}'

# 10. ✅ Pronto!
```

---

## 🎯 Performance em Produção

### Otimizações aplicadas

✅ **Prisma:**
```javascript
// Use select para não trazer tudo
const orders = await prisma.order.findMany({
  select: {
    id: true,
    status: true,
    totalAmount: true,
  },
});
```

✅ **Cache com Redis:**
```javascript
// Já configurado em RedisService
await redis.set('key', value, { EX: 3600 });
```

✅ **Compression:**
```bash
# NestJS já ativa gzip automaticamente
```

---

## 📈 Monitoramento em Produção

### Logs importantes

```bash
# Ver apenas erros
railway logs --service=app | grep -i error

# Ver requisições lentas
railway logs --service=app | grep -i "duration"
```

### Alertas (via Railway)

```bash
# Settings > Notifications
# Email quando:
# - Deployment falha
# - High CPU usage
# - Out of memory
```

---

## 💰 Custos Railway

```
PostgreSQL: $10-15/mês (depende uso)
NestJS app: $5/mês (base)
Total: ~$15-20/mês

Muito mais barato que:
- Heroku: $7-50/mês (antes era free)
- AWS: Varia muito
- DigitalOcean: $5+ por droplet
```

---

## 🔄 Atualizações em Produção

### Zero-downtime deployment

```bash
# Railway faz automaticamente:
# 1. Build nova versão
# 2. Start nova instância
# 3. Redireciona tráfego
# 4. Mata versão antiga
# Tempo total: ~2 minutos sem downtime
```

---

## 📞 Suporte Railway

- **Discord:** railway.app/discord
- **Docs:** railway.app/docs
- **Email:** support@railway.app
- **Status:** railway.app/status

---

## ✅ Checklist Final

- [ ] Código commitado no GitHub
- [ ] README.md atualizado
- [ ] `.env.example` com variáveis necessárias
- [ ] Tests passando (`npm run test`)
- [ ] Build sem erros (`npm run build`)
- [ ] Railway conectado ao GitHub
- [ ] PostgreSQL criado
- [ ] Env variables configuradas
- [ ] Migrations rodadas
- [ ] Health check respondendo
- [ ] Domínio customizado (opcional)
- [ ] Backups automatizados
- [ ] Monitoramento ativo

---

## 🎉 Parabéns!

Seu MVP backend está **em produção** e pronto para:
- ✅ Aceitar requisições de usuários reais
- ✅ Armazenar dados em banco persistente
- ✅ Processar pagamentos (Pix/Stripe)
- ✅ Notificar via WhatsApp
- ✅ Streaming em tempo real (WebSockets)

**Próximos passos:**
1. Deploy frontend (Next.js) em Vercel
2. Testes com usuários beta
3. Coletar feedback
4. Iteração rápida

---

**Status:** 🟢 Pronto para Produção
**Próximo:** Deployment do Frontend

