# ✅ Checklist de Deploy - BookManager

## 🔍 PRÉ-DEPLOY (Local)

### Configuração Básica
- [x] ✅ `package.json` configurado
- [x] ✅ `server.js` funcionando  
- [x] ✅ `app.js` sem erros
- [x] ✅ Dependências instaladas (`npm install`)
- [x] ✅ Testes passando (`npm test`)

### Arquivos de Deploy
- [x] ✅ `Dockerfile` criado e otimizado
- [x] ✅ `fly.toml` configurado
- [x] ✅ `.dockerignore` criado
- [x] ✅ Scripts de deploy (`deploy.sh`)

### Banco de Dados
- [x] ✅ Configuração PostgreSQL (`config/database.js`)
- [x] ✅ Models definidos e funcionando
- [x] ✅ Migrations funcionando (se aplicável)

### Segurança
- [x] ✅ `.env` no `.gitignore`
- [x] ✅ `SESSION_SECRET` configurado
- [x] ✅ Variáveis sensíveis não commitadas

### Funcionalidades
- [x] ✅ Página inicial carrega (/)
- [x] ✅ Login/Cadastro funciona (/usuarios/login)
- [x] ✅ API respondendo (/api/*)
- [x] ✅ PWA configurado (se aplicável)

## 🚀 DEPLOY

### Fly.io Setup
- [ ] Fly CLI instalado (`curl -L https://fly.io/install.sh | sh`)
- [ ] Login realizado (`fly auth login`)
- [ ] App criado no Fly.io

### Banco de Dados
- [ ] PostgreSQL criado (`fly postgres create`)
- [ ] Banco anexado ao app (`fly postgres attach`)

### Secrets
- [ ] `SESSION_SECRET` configurado (`fly secrets set`)
- [ ] Google OAuth configurado (se aplicável)
- [ ] Outras variáveis de ambiente

### Deploy Final
- [ ] Build Docker funcionando
- [ ] Deploy realizado (`fly deploy`)
- [ ] App acessível na URL

## 🧪 PÓS-DEPLOY (Produção)

### Testes de Funcionalidade
- [ ] Página inicial carrega
- [ ] Login/cadastro funciona
- [ ] Banco de dados conectando
- [ ] API respondendo
- [ ] PWA instalável (se aplicável)

### Monitoramento
- [ ] Logs sem erros (`fly logs`)
- [ ] Status saudável (`fly status`)
- [ ] Métricas OK (`fly dashboard`)

### Performance
- [ ] Tempo de resposta aceitável (< 2s)
- [ ] Memória dentro dos limites
- [ ] CPU não saturada

## 🔧 COMANDOS ÚTEIS

### Validação Local
```bash
./validate.sh          # Validar configurações
./test-functional.sh    # Testar funcionalidades
npm test               # Executar testes unitários
```

### Deploy
```bash
./deploy.sh            # Deploy automatizado
fly deploy             # Deploy manual
```

### Monitoramento
```bash
fly status             # Status do app
fly logs -f            # Logs em tempo real
fly ssh console        # SSH no container
```

### Troubleshooting
```bash
fly machine restart    # Reiniciar app
fly postgres status    # Status do banco
fly releases           # Histórico de deploys
```

## 🎯 CRITÉRIOS DE SUCESSO

### ✅ Tudo OK se:
- App carrega sem erro 500
- Login/cadastro funciona
- Banco de dados conecta
- Logs sem erros críticos
- Performance aceitável

### ❌ Problemas se:
- Erro 500 constante
- Banco não conecta
- Memory/CPU limits
- Timeouts frequentes
- Logs com erros

## 📊 MÉTRICAS DE SUCESSO

- **Uptime**: > 99%
- **Response Time**: < 2s
- **Error Rate**: < 1%
- **Memory Usage**: < 80%
- **CPU Usage**: < 70%
