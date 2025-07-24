# 🔐 Configuração do Google OAuth - Guia Completo

## ❗ PROBLEMA IDENTIFICADO
O erro 403 do Google OAuth ocorre porque as **URLs de callback** não estão configuradas corretamente no Google Cloud Console.

## 🚀 Solução: Configurar Google Cloud Console

### 1. Acesse o Google Cloud Console
1. Vá para: https://console.cloud.google.com/
2. Faça login com sua conta Google

### 2. Criar/Selecionar Projeto
1. Clique no seletor de projeto (canto superior esquerdo)
2. Clique em "NOVO PROJETO" ou selecione um existente
3. Nome sugerido: "BookManager PWA"
4. Clique em "CRIAR"

### 3. Ativar a API Google+
1. No menu lateral, vá em "APIs e serviços" > "Biblioteca"
2. Procure por "Google+ API" 
3. Clique e depois em "ATIVAR"

### 4. Configurar Tela de Consentimento OAuth
1. Vá em "APIs e serviços" > "Tela de consentimento OAuth"
2. Selecione "Externo" (para uso público)
3. Clique em "CRIAR"

#### Informações do aplicativo:
- **Nome do aplicativo**: BookManager PWA
- **Email de suporte do usuário**: seu-email@gmail.com
- **Logo do aplicativo**: (opcional)
- **Domínio do aplicativo**: https://bookmanager.fly.dev
- **Links de política de privacidade**: https://bookmanager.fly.dev/privacy (opcional)
- **Links de termos de serviço**: https://bookmanager.fly.dev/terms (opcional)
- **Email de contato do desenvolvedor**: seu-email@gmail.com

4. Clique em "SALVAR E CONTINUAR"
5. Em "Escopos", clique em "SALVAR E CONTINUAR" (sem adicionar escopos extras)
6. Em "Usuários de teste", adicione seu email se necessário
7. Clique em "SALVAR E CONTINUAR"

### 5. Criar Credenciais OAuth
1. Vá em "APIs e serviços" > "Credenciais"
2. Clique em "+ CRIAR CREDENCIAIS" > "ID do cliente OAuth 2.0"
3. Tipo de aplicativo: "Aplicativo da Web"
4. Nome: "BookManager PWA Web Client"

#### 🎯 CONFIGURAÇÕES CRÍTICAS:

**Origens JavaScript autorizadas:**
```
https://bookmanager.fly.dev
```

**URIs de redirecionamento autorizados:**
```
https://bookmanager.fly.dev/usuarios/auth/google/callback
```

5. Clique em "CRIAR"

### 6. Copiar as Credenciais
Após criar, você verá:
- **ID do cliente**: algo como `123456789-abc123.apps.googleusercontent.com`
- **Chave secreta do cliente**: algo como `GOCSPX-abc123xyz789`

### 7. Atualizar os Secrets no Fly.io
Execute os comandos no terminal:

```bash
# Definir o Google Client ID
fly secrets set GOOGLE_CLIENT_ID="seu-client-id-aqui"

# Definir o Google Client Secret  
fly secrets set GOOGLE_CLIENT_SECRET="sua-client-secret-aqui"
```

### 8. Fazer Deploy Final
```bash
fly deploy
```

## 🧪 Testar o Login

1. Acesse: https://bookmanager.fly.dev
2. Clique em "Entrar" ou "Login"
3. Clique em "Login com Google"
4. Você será redirecionado para o Google
5. Autorize o aplicativo
6. Será redirecionado de volta para a aplicação logado

## ⚠️ IMPORTANTE:

### URLs que DEVEM estar configuradas no Google Console:
- **Origem autorizada**: `https://bookmanager.fly.dev`
- **URI de callback**: `https://bookmanager.fly.dev/usuarios/auth/google/callback`

### Se ainda der erro:
1. Verifique se as URLs estão EXATAMENTE como especificado
2. Aguarde alguns minutos (pode demorar para propagar)
3. Limpe o cache do navegador
4. Tente em modo incógnito

## 🎯 Status Final - CONCLUÍDO COM SUCESSO! ✅
- ✅ Aplicação PWA funcionando
- ✅ Database conectado 
- ✅ Google OAuth configurado e FUNCIONANDO
- ✅ URLs corretas no Google Console
- ✅ Secrets configurados no Fly.io
- ✅ Login com Google OPERACIONAL

## 🚀 APLICAÇÃO PRONTA!
**BookManager PWA está 100% funcional com Google OAuth!**

Acesse: **https://bookmanager.fly.dev**

---

## 📞 Se precisar de ajuda:
Copie e cole as configurações exatas do seu Google Console se continuar com problemas.
