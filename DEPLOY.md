# 🚀 Deploy no Fly.io - BookManager

## 📋 Pré-requisitos

1. **Conta no Fly.io**: [fly.io/docs/getting-started](https://fly.io/docs/getting-started)
2. **Fly CLI instalado**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

## 🔧 Configuração Inicial

### 1. Login no Fly.io
```bash
fly auth login
```

### 2. Deploy Automatizado (Recomendado)
```bash
./deploy.sh
```

### 3. Deploy Manual

#### 3.1 Criar Banco PostgreSQL
```bash
fly postgres create --name bookmanager-db --region gig --vm-size shared-cpu-1x
fly postgres attach --app bookmanager bookmanager-db
```

#### 3.2 Configurar Secrets
```bash
# Session Secret (obrigatório)
fly secrets set SESSION_SECRET="sua_chave_secreta_super_segura"

# Google OAuth (opcional)
fly secrets set GOOGLE_CLIENT_ID="seu_google_client_id"
fly secrets set GOOGLE_CLIENT_SECRET="seu_google_client_secret"
```

#### 3.3 Deploy
```bash
fly deploy
```

## 📊 Monitoramento

### Verificar Status
```bash
fly status
fly logs
```

### Métricas
```bash
fly dashboard
```

### SSH no Container
```bash
fly ssh console
```

## 🗄️ Banco de Dados

### Conectar ao PostgreSQL
```bash
fly postgres connect -a bookmanager-db
```

### Backup
```bash
fly postgres backup list -a bookmanager-db
```

## 🔧 Configurações Importantes

### Variáveis de Ambiente Automáticas
- `DATABASE_URL` - Configurada automaticamente pelo Fly.io
- `PORT` - Configurada como 3000
- `NODE_ENV` - Configurada como "production"

### Secrets Necessários
- `SESSION_SECRET` - Chave para sessões (obrigatório)
- `GOOGLE_CLIENT_ID` - Para OAuth Google (opcional)
- `GOOGLE_CLIENT_SECRET` - Para OAuth Google (opcional)

## 🐛 Troubleshooting

### Logs em Tempo Real
```bash
fly logs -f
```

### Reiniciar App
```bash
fly machine restart
```

### Problemas de Conexão BD
```bash
fly postgres status -a bookmanager-db
```

## 🔄 Updates

### Deploy Nova Versão
```bash
git add .
git commit -m "feat: nova funcionalidade"
fly deploy
```

### Rollback
```bash
fly releases
fly rollback <release_id>
```

## 📱 PWA no Produção

O app está configurado como PWA e funcionará automaticamente:
- ✅ Service Worker ativo
- ✅ Manifest configurado
- ✅ Ícones otimizados
- ✅ Offline support

## 🌐 URLs

- **App Principal**: https://bookmanager.fly.dev
- **API Docs**: https://bookmanager.fly.dev/api-docs
- **Dashboard**: fly.io/apps/bookmanager
