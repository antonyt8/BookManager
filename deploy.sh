#!/bin/bash

# Script de deploy para Fly.io
echo "🚀 Iniciando deploy do BookManager..."

# 1. Verificar se fly CLI está instalado
if ! command -v fly &> /dev/null; then
    echo "❌ Fly CLI não encontrado. Instale com: curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# 2. Login no Fly.io (se necessário)
echo "🔐 Verificando autenticação..."
if ! fly auth whoami &> /dev/null; then
    echo "🔑 Faça login no Fly.io:"
    fly auth login
fi

# 3. Criar banco PostgreSQL (se não existir)
echo "🗄️ Configurando banco de dados..."
if ! fly postgres list | grep -q bookmanager-db; then
    echo "📦 Criando banco PostgreSQL..."
    fly postgres create --name bookmanager-db --region gig --vm-size shared-cpu-1x --volume-size 3
    
    echo "🔗 Anexando banco ao app..."
    fly postgres attach --app bookmanager bookmanager-db
else
    echo "✅ Banco já existe"
fi

# 4. Configurar secrets
echo "🔒 Configurando secrets..."

read -p "Digite o SESSION_SECRET (ou pressione Enter para gerar): " session_secret
if [ -z "$session_secret" ]; then
    session_secret=$(openssl rand -hex 32)
    echo "🔑 SESSION_SECRET gerado automaticamente"
fi

fly secrets set SESSION_SECRET="$session_secret"

# Google OAuth (opcional)
read -p "Configurar Google OAuth? (y/n): " setup_oauth
if [ "$setup_oauth" = "y" ]; then
    read -p "GOOGLE_CLIENT_ID: " google_client_id
    read -p "GOOGLE_CLIENT_SECRET: " google_client_secret
    
    fly secrets set GOOGLE_CLIENT_ID="$google_client_id"
    fly secrets set GOOGLE_CLIENT_SECRET="$google_client_secret"
fi

# 5. Deploy
echo "🚀 Fazendo deploy..."
fly deploy

# 6. Verificar status
echo "📊 Verificando status..."
fly status

echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://bookmanager.fly.dev"
